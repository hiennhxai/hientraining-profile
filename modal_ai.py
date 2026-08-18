import modal
import io
from fastapi import Request

def download_model():
    from diffusers import FluxPipeline
    import torch
    import os
    FluxPipeline.from_pretrained(
        "black-forest-labs/FLUX.1-schnell", 
        torch_dtype=torch.bfloat16,
        token=os.environ.get("HF_TOKEN")
    )

def download_edit_model():
    from diffusers import StableDiffusionInstructPix2PixPipeline
    import torch
    StableDiffusionInstructPix2PixPipeline.from_pretrained(
        "timbrooks/instruct-pix2pix", 
        torch_dtype=torch.float16, 
        safety_checker=None
    )

# Cài đặt môi trường Python ảo trên Modal
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "torch",
        "transformers",
        "accelerate",
        "diffusers",
        "fastapi",
        "python-multipart",
        "pillow"
    )
    .run_function(download_model, secrets=[modal.Secret.from_name("huggingface")])
    .run_function(download_edit_model)
)

app = modal.App("flux-schnell-api", image=image)

# Cấu hình Card đồ họa H100 siêu mạnh (80GB VRAM)
@app.cls(gpu="H100", secrets=[modal.Secret.from_name("huggingface")])
class FluxModelH100:
    @modal.enter()
    def enter(self):
        from diffusers import FluxPipeline
        import torch
        import os
        self.pipe = FluxPipeline.from_pretrained(
            "black-forest-labs/FLUX.1-schnell", 
            torch_dtype=torch.bfloat16,
            token=os.environ.get("HF_TOKEN")
        ).to("cuda")

    @modal.fastapi_endpoint(method="POST")
    async def generate(self, request: Request):
        from fastapi import Response
        data = await request.json()
        prompt = data.get("prompt", "A beautiful futuristic city landscape")
        image = self.pipe(prompt, num_inference_steps=4, guidance_scale=0.0).images[0]
        
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_bytes = img_byte_arr.getvalue()
        return Response(content=img_bytes, media_type="image/jpeg")

# Card đồ họa tầm trung (A10G 24GB VRAM - T4 không đủ RAM cho FLUX)
@app.cls(gpu="A10G", secrets=[modal.Secret.from_name("huggingface")])
class FluxModelT4:
    @modal.enter()
    def enter(self):
        from diffusers import FluxPipeline
        import torch
        import os
        self.pipe = FluxPipeline.from_pretrained(
            "black-forest-labs/FLUX.1-schnell", 
            torch_dtype=torch.bfloat16,
            token=os.environ.get("HF_TOKEN")
        )
        self.pipe.enable_model_cpu_offload()

    @modal.fastapi_endpoint(method="POST")
    async def generate(self, request: Request):
        from fastapi import Response
        data = await request.json()
        prompt = data.get("prompt", "A beautiful futuristic city landscape")
        image = self.pipe(prompt, num_inference_steps=4, guidance_scale=0.0).images[0]
        
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_bytes = img_byte_arr.getvalue()
        return Response(content=img_bytes, media_type="image/jpeg")

# Card đồ họa T4 (rẻ hơn, đủ dùng cho việc sửa ảnh)
@app.cls(gpu="T4")
class EditModel:
    @modal.enter()
    def enter(self):
        from diffusers import StableDiffusionInstructPix2PixPipeline
        import torch
        # Tải InstructPix2Pix
        self.pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(
            "timbrooks/instruct-pix2pix", 
            torch_dtype=torch.float16, 
            safety_checker=None
        ).to("cuda")

    @modal.fastapi_endpoint(method="POST")
    async def edit(self, request: Request):
        from fastapi import Response
        import base64
        from PIL import Image
        
        data = await request.json()
        prompt = data.get("prompt", "make it look like a painting")
        image_b64 = data.get("image", "")
        
        # Xóa tiền tố data:image/jpeg;base64, nếu có
        if "," in image_b64:
            image_b64 = image_b64.split(",")[1]
            
        img_data = base64.b64decode(image_b64)
        init_image = Image.open(io.BytesIO(img_data)).convert("RGB")
        
        # Sửa ảnh
        image = self.pipe(
            prompt, 
            image=init_image, 
            num_inference_steps=20, 
            image_guidance_scale=1.5
        ).images[0]
        
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_bytes = img_byte_arr.getvalue()
        
        return Response(content=img_bytes, media_type="image/jpeg")
