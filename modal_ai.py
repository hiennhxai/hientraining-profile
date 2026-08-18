import modal
import io

def download_model():
    from diffusers import FluxPipeline
    import torch
    import os
    FluxPipeline.from_pretrained(
        "black-forest-labs/FLUX.1-schnell", 
        torch_dtype=torch.bfloat16,
        token=os.environ.get("HF_TOKEN")
    )

# Cài đặt môi trường Python ảo trên Modal
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "torch",
        "transformers",
        "accelerate",
        "diffusers",
        "fastapi"
    )
    .run_function(download_model, secrets=[modal.Secret.from_name("huggingface")])
)

app = modal.App("flux-schnell-api", image=image)

# Cấu hình Card đồ họa H100 siêu mạnh và bảo mật HuggingFace Token
@app.cls(gpu="A10G", secrets=[modal.Secret.from_name("huggingface")])
class FluxModel:
    @modal.enter()
    def enter(self):
        from diffusers import FluxPipeline
        import torch
        import os
        # Load model vào VRAM của Card Đồ Họa khi khởi động máy chủ
        self.pipe = FluxPipeline.from_pretrained(
            "black-forest-labs/FLUX.1-schnell", 
            torch_dtype=torch.bfloat16,
            token=os.environ.get("HF_TOKEN")
        ).to("cuda")

    # Tạo thành một đường link API POST (giống như Cloudflare/Segmind)
    @modal.fastapi_endpoint(method="POST")
    async def generate(self, request):
        from fastapi import Response
        data = await request.json()
        prompt = data.get("prompt", "A beautiful futuristic city landscape")
        
        # Vẽ ảnh (chỉ mất 4 steps nhờ bản Schnell)
        image = self.pipe(prompt, num_inference_steps=4, guidance_scale=0.0).images[0]
        
        # Đóng gói ảnh thành định dạng JPEG và trả về cho Website
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_bytes = img_byte_arr.getvalue()
        
        return Response(content=img_bytes, media_type="image/jpeg")
