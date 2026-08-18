import React, { useState, useRef, useEffect } from 'react';
import { PhotoAlbumItem } from '../types';
import { compressAndOptimizeImage } from '../utils/imageOptimizer';
import { generateImagePromptWithAI } from '../lib/gemini';
import { 
  X, Upload, Image as ImageIcon, Link as LinkIcon, Check, Sparkles, 
  Camera, Crop, ZoomIn, ZoomOut, Move, RotateCcw, Sliders, Layers 
} from 'lucide-react';

interface UniversalImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUrl: (url: string) => void;
  currentUrl?: string;
  photos: PhotoAlbumItem[];
  onUpdatePhotos: (photos: PhotoAlbumItem[]) => void;
  title?: string;
  aiContext?: string;
}

type AspectRatioOption = '16:9' | '4:3' | '1:1' | '3:4' | 'free';

export const UniversalImagePickerModal: React.FC<UniversalImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectUrl,
  currentUrl = '',
  photos,
  onUpdatePhotos,
  title = 'CHỌN HOẶC TẢI HÌNH ẢNH MỚI',
  aiContext
}) => {
  const [activeTab, setActiveTab] = useState<'album' | 'upload' | 'url' | 'crop' | 'ai'>('album');
  const [inputUrl, setInputUrl] = useState<string>(currentUrl);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── AI IMAGE GENERATION STATE ───
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [generatedAiImageUrl, setGeneratedAiImageUrl] = useState<string | null>(null);

  // ─── CROPPING & INTERACTIVE PAN/ZOOM STATE ───
  const [cropImageUrl, setCropImageUrl] = useState<string>(currentUrl);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('16:9');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [processingCrop, setProcessingCrop] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const [nativeSize, setNativeSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    if (currentUrl) {
      setInputUrl(currentUrl);
      setCropImageUrl(currentUrl);
    }
  }, [currentUrl, isOpen]);

  if (!isOpen) return null;

  // ─── FILE UPLOAD HANDLER ───
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos: PhotoAlbumItem[] = [...photos];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Automatically compress image down to ~300KB - 500KB WebP
        const result = await compressAndOptimizeImage(file, 1920, 1080, 0.85);
        
        const photoItem: PhotoAlbumItem = {
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          url: result.dataUrl,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          width: result.width,
          height: result.height,
          createdAt: new Date().toISOString().slice(0, 10),
          caption: file.name.replace(/\.[^/.]+$/, "")
        };

        newPhotos.unshift(photoItem);
        if (i === 0) {
          setCropImageUrl(result.dataUrl);
        }
      }

      onUpdatePhotos(newPhotos);
      // Switch to Crop tab so user can fine-tune position immediately if desired
      setActiveTab('crop');
    } catch (err) {
      alert("Lỗi khi nén ảnh: " + (err as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrlDirectly = () => {
    if (!inputUrl.trim()) {
      alert("Vui lòng nhập đường dẫn URL hình ảnh!");
      return;
    }
    onSelectUrl(inputUrl.trim());
    onClose();
  };

  const startCroppingUrl = (targetUrl: string) => {
    setCropImageUrl(targetUrl);
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setActiveTab('crop');
  };

  // ─── POINTER PAN & DRAG LOGIC FOR IMAGE FRAMING ───
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: pan.x,
      initialY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    setPan({
      x: dragStartRef.current.initialX + dx,
      y: dragStartRef.current.initialY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setIsDragging(false);
      dragStartRef.current = null;
    }
  };

  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    setZoom((prev) => Math.min(4.0, Math.max(0.5, prev + delta)));
  };

  // ─── EXPORT CANVAS CROPPED IMAGE ───
  const handleExportCroppedImage = async () => {
    if (!cropImageUrl) {
      alert("Không có ảnh để tinh chỉnh!");
      return;
    }

    setProcessingCrop(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Không thể nạp ảnh để cắt!"));
        img.src = cropImageUrl;
      });

      // Target canvas dimensions based on aspect ratio preset
      let targetW = 1280;
      let targetH = 720; // 16:9
      if (aspectRatio === '4:3') { targetW = 1024; targetH = 768; }
      else if (aspectRatio === '1:1') { targetW = 800; targetH = 800; }
      else if (aspectRatio === '3:4') { targetW = 768; targetH = 1024; }
      else if (aspectRatio === 'free') { targetW = img.width; targetH = img.height; }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error("Canvas Context Error");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background fill
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);

      // Base scale fitting image to container
      const baseScale = Math.max(targetW / img.width, targetH / img.height);
      const drawW = img.width * baseScale * zoom;
      const drawH = img.height * baseScale * zoom;

      // Calculate pan scale relative to UI preview box width
      const previewW = previewBoxRef.current?.clientWidth || 500;
      const scaleFactor = targetW / previewW;

      const drawX = (targetW - drawW) / 2 + pan.x * scaleFactor;
      const drawY = (targetH - drawH) / 2 + pan.y * scaleFactor;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      const croppedDataUrl = canvas.toDataURL('image/webp', 0.88);

      // Save into photo album
      const newPhotoItem: PhotoAlbumItem = {
        id: `img-crop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: `Crop_${aspectRatio}_${Date.now()}`,
        url: croppedDataUrl,
        originalSize: croppedDataUrl.length,
        compressedSize: croppedDataUrl.length,
        width: targetW,
        height: targetH,
        createdAt: new Date().toISOString().slice(0, 10),
        caption: `Ảnh căn khung (${aspectRatio}, zoom ${(zoom * 100).toFixed(0)}%)`
      };

      onUpdatePhotos([newPhotoItem, ...photos]);
      onSelectUrl(croppedDataUrl);
      onClose();
    } catch (err) {
      alert("Lỗi khi tạo hình ảnh đã căn chỉnh: " + (err as Error).message);
    } finally {
      setProcessingCrop(false);
    }
  };

  // Helper aspect ratio CSS class for crop preview box
  const getAspectClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-[4/3]';
      case '1:1': return 'aspect-square max-w-sm';
      case '3:4': return 'aspect-[3/4] max-w-xs';
      default: return 'aspect-video';
    }
  };

  return (
    <div className="fixed inset-0 z-[130] bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-extrabold tracking-tight uppercase">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection — 2x2 Grid on Mobile, Flex Row on Tablet/Desktop so Album Tab is NEVER hidden */}
        <div className="bg-slate-100 p-2 sm:px-4 sm:py-2 border-b border-slate-200 grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('album')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'album' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">1. Album ({photos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'upload' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Upload className="w-4 h-4 shrink-0" />
            <span className="truncate">2. Tải Ảnh Mới</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'url' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <LinkIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">3. Link URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crop')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'crop' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Crop className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate">4. 📐 Căn Khung & Zoom</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ai' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-purple-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="truncate">5. 🪄 Tạo Bằng AI</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TAB 1: ALBUM SELECTOR */}
          {activeTab === 'album' && (
            <div className="space-y-4">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 font-medium flex items-center justify-between">
                <span>✦ Bấm <strong>"Chọn Ngay"</strong> hoặc <strong>"Căn Vị Trí & Zoom"</strong> để tinh chỉnh hình ảnh trước khi lưu.</span>
              </div>

              {photos.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  Kho Album chưa có ảnh. Vui lòng chuyển sang tab <strong>"Tải Ảnh Mới"</strong> để tải ảnh lên.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((photo) => {
                    const isSelected = currentUrl === photo.url;
                    return (
                      <div 
                        key={photo.id}
                        className={`group relative bg-slate-900 rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected ? 'border-orange-500 ring-2 ring-orange-500/50 scale-[1.02]' : 'border-slate-200 hover:border-orange-400'
                        }`}
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <img src={photo.url} alt={photo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] font-mono text-white">
                            {(photo.compressedSize / 1024).toFixed(0)} KB
                          </div>
                          {isSelected && (
                            <div className="absolute inset-0 bg-orange-600/40 flex items-center justify-center">
                              <span className="px-3 py-1 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Đang Dùng
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-2 bg-white space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-800 line-clamp-1 block">{photo.caption || photo.name}</span>
                          <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectUrl(photo.url);
                                onClose();
                              }}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center"
                            >
                              Chọn Ngay
                            </button>
                            <button
                              type="button"
                              onClick={() => startCroppingUrl(photo.url)}
                              className="px-2 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-0.5"
                              title="Căn khung, Kéo di chuyển vị trí & Zoom ảnh"
                            >
                              <Crop className="w-3 h-3" />
                              <span>Căn Khung</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD & AUTOMATIC COMPRESSION (300KB - 500KB) */}
          {activeTab === 'upload' && (
            <div className="p-8 border-2 border-dashed border-orange-300 rounded-2xl bg-orange-50/50 text-center space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-orange-500/30">
                {uploading ? <Sparkles className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {uploading ? 'Đang tự động nén & tối ưu hóa ảnh...' : 'Tải Ảnh Từ Máy Tính Hoặc Camera Điện Thoại'}
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Sau khi tải lên, hệ thống sẽ mở công cụ <strong>Căn Khung & Zoom/Kéo Vị Trí</strong> giúp bạn tinh chỉnh khung hình đại diện hoàn hảo nhất.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Chọn Ảnh Hoặc Chụp Hình</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT URL INPUT */}
          {activeTab === 'url' && (
            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Đường Dẫn URL Hình Ảnh</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 bg-white"
                />
              </div>

              {inputUrl && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                  <span className="text-[11px] font-mono text-slate-500 font-bold">Xem trước ảnh URL:</span>
                  <div className="max-h-48 aspect-video mx-auto overflow-hidden rounded-lg bg-slate-900 flex items-center justify-center">
                    <img src={inputUrl} alt="URL Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApplyUrlDirectly}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Dùng Ngay Không Căn Khung</span>
                </button>
                <button
                  type="button"
                  onClick={() => startCroppingUrl(inputUrl)}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Crop className="w-4 h-4" />
                  <span>Căn Khung & Zoom URL Này</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: AI IMAGE GENERATION */}
          {activeTab === 'ai' && (
            <div className="space-y-4 p-4 bg-purple-50 rounded-2xl border border-purple-200">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Viết Lệnh (Prompt) Cho AI Bằng Tiếng Anh
                  </label>
                  {aiContext && (
                    <button
                      type="button"
                      onClick={async () => {
                        setIsGeneratingPrompt(true);
                        try {
                          const prompt = await generateImagePromptWithAI(aiContext);
                          setAiPrompt(prompt);
                        } catch (err) {
                          console.error(err);
                          alert("Lỗi khi viết prompt AI.");
                        } finally {
                          setIsGeneratingPrompt(false);
                        }
                      }}
                      disabled={isGeneratingPrompt}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-[10px] font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isGeneratingPrompt ? <Sparkles className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Phân Tích Bài Viết & Viết Prompt
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  placeholder="A cinematic professional studio photography of a microphone..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-purple-300 font-mono text-xs text-slate-800 bg-white custom-scrollbar focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <button
                type="button"
                disabled={!aiPrompt.trim()}
                onClick={() => {
                  const encodedPrompt = encodeURIComponent(aiPrompt.trim());
                  const seed = Math.floor(Math.random() * 1000000);
                  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&model=flux&seed=${seed}`;
                  setGeneratedAiImageUrl(imageUrl);
                }}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Tạo Ảnh Ngay Lập Tức
              </button>

              {generatedAiImageUrl && (
                <div className="p-4 bg-white rounded-xl border border-purple-200 text-center space-y-3 mt-4">
                  <span className="text-[11px] font-bold text-purple-700">Kết quả tạo ảnh từ AI:</span>
                  <div className="max-h-64 aspect-video mx-auto overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shadow-inner relative">
                    <img 
                      src={generatedAiImageUrl} 
                      alt="AI Generated" 
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        (e.target as HTMLImageElement).classList.remove('opacity-0');
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/1200x630/f8fafc/94a3b8?text=Error+Loading+Image';
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectUrl(generatedAiImageUrl);
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Dùng Ảnh Này
                    </button>
                    <button
                      type="button"
                      onClick={() => startCroppingUrl(generatedAiImageUrl)}
                      className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Crop className="w-4 h-4" />
                      Căn Khung Lại
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INTERACTIVE IMAGE CROPPER & DRAG-PAN/ZOOM EDITOR */}
          {activeTab === 'crop' && (
            <div className="space-y-4">
              {/* Presets & Controls bar */}
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Aspect Ratio Selector */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-bold flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-orange-400" /> Tỷ lệ khung:
                    </span>
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      {(['16:9', '4:3', '1:1', '3:4', 'free'] as AspectRatioOption[]).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => {
                            setAspectRatio(ratio);
                            setPan({ x: 0, y: 0 });
                          }}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                            aspectRatio === ratio
                              ? 'bg-orange-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {ratio === '16:9' ? '16:9 (Banner)' : ratio === '4:3' ? '4:3 (Dự án)' : ratio === '1:1' ? '1:1 (Logo)' : ratio === '3:4' ? '3:4 (Chân dung)' : 'Tự do'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-bold">Zoom: {(zoom * 100).toFixed(0)}%</span>
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Thu nhỏ"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-24 accent-orange-500 cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setZoom((prev) => Math.min(3.0, prev + 0.1))}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Phóng to"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1.0);
                        setPan({ x: 0, y: 0 });
                      }}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                      title="Đặt lại vị trí & Zoom ban đầu"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <Move className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Dùng ngón tay/chuột <strong>kéo giữ hình ảnh</strong> để di chuyển đến vị trí mong muốn trọn vẹn trong khung. Cuộn chuột để Zoom.</span>
                </div>
              </div>

              {/* Interactive Viewport Box with Overlay Grid */}
              <div className="w-full max-h-[220px] sm:max-h-[280px] flex items-center justify-center bg-slate-950 p-2 sm:p-4 rounded-2xl border border-slate-800 overflow-hidden">
                <div
                  ref={previewBoxRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onWheel={handleWheelZoom}
                  className={`w-full max-h-full ${getAspectClass()} relative overflow-hidden bg-slate-900 rounded-xl border-2 border-dashed border-orange-500/70 shadow-2xl select-none transition-shadow ${
                    isDragging ? 'cursor-grabbing border-orange-400 ring-2 ring-orange-500/40' : 'cursor-grab'
                  }`}
                  style={{ touchAction: 'none' }}
                >
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10 border border-white/20">
                    <div className="border-r border-b border-white/15" />
                    <div className="border-r border-b border-white/15" />
                    <div className="border-b border-white/15" />
                    <div className="border-r border-b border-white/15" />
                    <div className="border-r border-b border-white/15" />
                    <div className="border-b border-white/15" />
                    <div className="border-r border-white/15" />
                    <div className="border-r border-white/15" />
                    <div />
                  </div>

                  {/* Rendered Image with Transform */}
                  {cropImageUrl ? (
                    <img
                      src={cropImageUrl}
                      alt="Crop Viewport"
                      onLoad={(e) => setNativeSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
                      style={{
                        transform: (() => {
                          let previewScale = 1;
                          if (nativeSize.w > 0 && nativeSize.h > 0 && previewBoxRef.current) {
                            const pw = previewBoxRef.current.clientWidth;
                            const ph = previewBoxRef.current.clientHeight;
                            previewScale = Math.max(pw / nativeSize.w, ph / nativeSize.h);
                          }
                          return `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${previewScale * zoom})`;
                        })(),
                      }}
                      className="absolute top-1/2 left-1/2 max-w-none max-h-none pointer-events-none transition-transform duration-75"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs font-mono">
                      Chưa chọn ảnh để căn khung
                    </div>
                  )}

                  {/* Top-Right Badge */}
                  <div className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white font-mono text-[10px] font-bold flex items-center gap-1.5">
                    <Crop className="w-3 h-3 text-orange-400" />
                    <span>Khung {aspectRatio}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('album')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  ‹ Quay lại Kho Album
                </button>

                <button
                  type="button"
                  onClick={handleExportCroppedImage}
                  disabled={processingCrop}
                  className={`px-6 py-2.5 rounded-xl text-white text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                    processingCrop
                      ? 'bg-slate-600 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  }`}
                >
                  {processingCrop ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{processingCrop ? 'Đang Xuất Ảnh...' : 'ÁP DỤNG HÌNH ĐÃ CĂN CHỈNH'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
