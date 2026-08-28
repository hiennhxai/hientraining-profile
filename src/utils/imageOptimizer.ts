/**
 * Client-side High Quality Image Optimizer & Compressor & Cropper
 * Uses HTML5 Canvas for zero-latency, high-performance image processing.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  mimeType: string;
  savingPercent: number;
}

export interface ImageCropParams {
  zoom: number; // 1.0 = 100%, 1.5 = 150%, etc.
  rotation: number; // 0, 90, 180, 270
  brightness: number; // 100 = default
  contrast: number; // 100 = default
  cropX: number; // % starting 0..100
  cropY: number; // % starting 0..100
  cropWidth: number; // % 0..100
  cropHeight: number; // % 0..100
}

/**
 * Reads a File object and compresses it cleanly to WebP or JPEG
 */
export async function compressAndOptimizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.82
): Promise<ProcessedImageResult> {
  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lỗi đọc file ảnh!"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("File không phải ảnh hợp lệ!"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio aspect-fit max dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Không thể khởi tạo Canvas context!"));
          return;
        }

        // Draw with high smoothing quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for ultra efficiency, fallback to JPEG
        let dataUrl = canvas.toDataURL("image/webp", quality);
        let mimeType = "image/webp";

        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
          mimeType = "image/jpeg";
        }

        // Calculate approximate byte size from Base64
        const head = `data:${mimeType};base64,`;
        const base64Length = dataUrl.length - head.length;
        const compressedSize = Math.round((base64Length * 3) / 4);

        const savingPercent = Math.max(
          0,
          Math.round(((originalSize - compressedSize) / originalSize) * 100)
        );

        resolve({
          dataUrl,
          width,
          height,
          originalSize,
          compressedSize,
          mimeType,
          savingPercent,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Apply Cropping, Rotation & Filter Adjustments onto an existing image DataURL
 */
export async function transformAndCropImage(
  sourceUrl: string,
  params: ImageCropParams,
  outputQuality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onerror = () => reject(new Error("Không thể nạp ảnh!"));
    img.onload = () => {
      const { zoom, rotation, brightness, contrast, cropX, cropY, cropWidth, cropHeight } = params;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context failed"));
        return;
      }

      // Crop coordinates calculation
      const srcX = (img.width * cropX) / 100;
      const srcY = (img.height * cropY) / 100;
      const srcW = (img.width * cropWidth) / 100;
      const srcH = (img.height * cropHeight) / 100;

      canvas.width = Math.max(1, Math.round(srcW));
      canvas.height = Math.max(1, Math.round(srcH));

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Translate for rotation if applicable
      ctx.save();
      if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }

      // Apply zoom ratio
      const drawW = canvas.width * zoom;
      const drawH = canvas.height * zoom;
      const offsetX = (canvas.width - drawW) / 2;
      const offsetY = (canvas.height - drawH) / 2;

      ctx.drawImage(img, srcX, srcY, srcW, srcH, offsetX, offsetY, drawW, drawH);
      ctx.restore();

      const resultUrl = canvas.toDataURL("image/jpeg", outputQuality);
      resolve(resultUrl);
    };
    img.src = sourceUrl;
  });
}
