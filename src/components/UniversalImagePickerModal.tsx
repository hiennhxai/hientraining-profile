import React, { useState, useRef, useEffect } from 'react';
import { PhotoAlbumItem } from '../types';
import { compressAndOptimizeImage } from '../utils/imageOptimizer';
import { generateImagePromptWithAI } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import { 
  X, Upload, Image as ImageIcon, Link as LinkIcon, Check, Sparkles, 
  Camera, Crop, ZoomIn, ZoomOut, Move, RotateCcw, Sliders, Layers, FolderPlus 
} from 'lucide-react';

// ─── AI MODEL OPTIONS ───
type AiModelKey = 'pollinations' | 'cloudflare' | 'modal-h100';

const AI_MODELS: { key: AiModelKey; name: string; badge: string; desc: string; speed: string; color: string; usageNote: string }[] = [
  { key: 'modal-h100',   name: 'Modal H100 (Cá nhân)', badge: '🚀 Siêu Tốc', desc: 'Máy chủ độc quyền của bạn trên Modal chạy FLUX.1 Dev.', speed: '~20s', color: 'blue', usageNote: 'Tính phí theo Modal. Dành cho nhu cầu sử dụng chuyên sâu.' },
  { key: 'pollinations', name: 'Pollinations AI', badge: '🎁 Miễn Phí', desc: 'Sử dụng mô hình FLUX siêu đẹp.', speed: '~10s', color: 'emerald', usageNote: 'Hoàn toàn miễn phí 100%. Không giới hạn lượt tạo ảnh / ngày.' },
  { key: 'cloudflare',   name: 'Cloudflare AI', badge: '☁️ Tốc Độ', desc: 'Tạo ảnh bằng SDXL trên mạng lưới Cloudflare Edge.', speed: '~15s', color: 'amber', usageNote: 'Miễn phí siêu khủng (hàng ngàn lượt/ngày). Đã cấu hình Token thành công.' },
];

interface UniversalImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUrl: (url: string) => void;
  onSelectUrls?: (urls: string[]) => void;
  isMultiSelect?: boolean;
  currentUrl?: string;
  photos: PhotoAlbumItem[];
  onUpdatePhotos: (photos: PhotoAlbumItem[]) => void;
  title?: string;
  aiContext?: string;
  defaultTab?: 'album' | 'upload' | 'url' | 'crop' | 'ai';
}

type AspectRatioOption = '16:9' | '4:3' | '1:1' | '3:4' | 'free';

async function uploadToSupabaseStorageIfPossible(dataUrl: string, prefix: string = 'img'): Promise<string> {
  try {
    if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
    const base64Response = await fetch(dataUrl);
    const blob = await base64Response.blob();
    const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, blob, { contentType: 'image/webp' });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);
      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }
  } catch (err) {
    console.warn("Supabase storage upload fallback to dataUrl:", err);
  }
  return dataUrl;
}

export const UniversalImagePickerModal: React.FC<UniversalImagePickerModalProps> = ({
  isOpen, onClose, onSelectUrl, onSelectUrls, isMultiSelect = false,
  currentUrl = '', photos, onUpdatePhotos, title = 'CHỌN HOẶC TẢI HÌNH ẢNH MỚI', aiContext, defaultTab
}) => {
  const [activeTab, setActiveTab] = useState<'album' | 'upload' | 'url' | 'crop' | 'ai'>(defaultTab || 'album');
  
  // Folder & Search State
  const [activeFolder, setActiveFolder] = useState<string>('Tất cả');
  const allFolders = React.useMemo(() => {
    const folderSet = new Set(['Tất cả', 'Thương Hiệu & Logo', 'Khóa Học 1-1', 'Studio & Showroom', 'Chân Dung MC', 'Dịch Vụ & Sự Kiện', 'Ảnh AI (Tạo Tự Động)']);
    photos.forEach(p => {
      if (p.folder && p.folder !== 'Tất cả') folderSet.add(p.folder);
    });
    return Array.from(folderSet);
  }, [photos]);
  
  // Filtered Photos for Album Tab
  const filteredPhotos = React.useMemo(() => {
    return photos.filter(p => {
      if (!p.url) return false;
      return activeFolder === 'Tất cả' || (p.folder || 'Kho Chung') === activeFolder;
    });
  }, [photos, activeFolder]);

  // Multi-select state
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  useEffect(() => {
    if (isOpen) setSelectedUrls([]);
  }, [isOpen]);

  const [inputUrl, setInputUrl] = useState<string>(currentUrl);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadFolder, setUploadFolder] = useState<string>('Kho Chung');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute unique folders from photos
  const FOLDER_OPTIONS = Array.from(new Set([
    'Kho Chung', 
    'Thương Hiệu & Logo', 
    'Khóa Học 1-1', 
    'Studio & Showroom', 
    'Chân Dung MC', 
    'Dịch Vụ & Sự Kiện', 
    'Ảnh AI (Tạo Tự Động)', 
    ...photos.map(p => p.folder || 'Kho Chung')
  ])).filter(f => f !== 'Tất cả');

  // ─── AI IMAGE GENERATION STATE ───
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSavingToAlbum, setIsSavingToAlbum] = useState(false);
  const [saveAlbumSuccess, setSaveAlbumSuccess] = useState(false);
  const [generatedAiImageUrl, setGeneratedAiImageUrl] = useState<string | null>(null);
  const [selectedAiModel, setSelectedAiModel] = useState<AiModelKey>('modal-h100');
  const [selectedStyle, setSelectedStyle] = useState<string>('none');
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isEditingImage, setIsEditingImage] = useState<boolean>(false);

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
    if (isOpen) {
      if (defaultTab) setActiveTab(defaultTab);
      if (currentUrl) {
        setInputUrl(currentUrl);
        setCropImageUrl(currentUrl);
      }
    }
  }, [currentUrl, isOpen, defaultTab]);

  if (!isOpen) return null;

  // ─── FILE UPLOAD HANDLER ───
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos: PhotoAlbumItem[] = [...photos];
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Automatically compress image down to ~300KB - 500KB WebP
        const result = await compressAndOptimizeImage(file, 1920, 1080, 0.85);
        const finalUrl = await uploadToSupabaseStorageIfPossible(result.dataUrl, 'upload');
        
        const photoItem: PhotoAlbumItem = {
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          url: finalUrl,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          width: result.width,
          height: result.height,
          createdAt: new Date().toISOString().slice(0, 10),
          caption: file.name.replace(/\.[^/.]+$/, ""),
          folder: uploadFolder
        };

        newPhotos.unshift(photoItem);
        newUrls.push(finalUrl);
        if (i === 0) {
          setCropImageUrl(finalUrl);
        }
      }

      onUpdatePhotos(newPhotos);
      if (isMultiSelect) {
        setSelectedUrls(prev => [...prev, ...newUrls]);
        setActiveTab('album');
        setActiveFolder(uploadFolder);
      } else {
        // Switch to Crop tab so user can fine-tune position immediately if desired
        setActiveTab('crop');
      }
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

  // ─── AI GENERATION HANDLER ───
  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) return;

    let finalPrompt = aiPrompt.trim();
    if (selectedStyle === 'photorealistic') {
      finalPrompt += ", ultra-realistic photography, 8k resolution, highly detailed, photorealistic, sharp focus, cinematic lighting";
    } else if (selectedStyle === 'cartoon') {
      finalPrompt += ", 3d pixar animation style, disney style, cute, vibrant colors, stylized character design";
    } else if (selectedStyle === 'anime2d') {
      finalPrompt += ", 2d anime style, studio ghibli style, flat colors, cel shading, detailed 2d animation, beautifully drawn";
    } else if (selectedStyle === 'simple') {
      finalPrompt += ", simple minimalist design, clean background, minimal details, flat colors";
    } else if (selectedStyle === 'flatdesign') {
      finalPrompt += ", flat design style, corporate memphis style, simple geometric shapes, clean minimal background, pastel colors";
    } else if (selectedStyle === 'lineart') {
      finalPrompt += ", minimalist line art, simple continuous line, black and white sketch, minimal details, elegant";
    } else if (selectedStyle === 'watercolor') {
      finalPrompt += ", watercolor painting style, soft washed colors, beautiful artistic watercolor, gentle brush strokes, aesthetic";
    } else if (selectedStyle === 'vector') {
      finalPrompt += ", flat vector illustration, adobe illustrator style, clean sharp lines, 2d vector art, scalable graphic";
    } else if (selectedStyle === 'illustration') {
      finalPrompt += ", beautiful digital illustration, artstation, digital painting, expressive, detailed illustration";
    }

    setIsGeneratingImage(true);
    try {
      let blob: Blob;
      if (selectedAiModel === 'pollinations') {
        const randomSeed = Math.floor(Math.random() * 100000);
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?seed=${randomSeed}&width=1024&height=1024&nologo=true`;
        const pollRes = await fetch(pollUrl);
        if (!pollRes.ok) throw new Error("Lỗi kết nối đến máy chủ Pollinations AI");
        blob = await pollRes.blob();
      } else {
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: finalPrompt, model: selectedAiModel })
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Server API returned ' + res.status);
        }
        blob = await res.blob();
      }
      const file = new File([blob], 'ai-generated.png', { type: blob.type });
      const result = await compressAndOptimizeImage(file, 1920, 1080, 0.85);
      setGeneratedAiImageUrl(result.dataUrl);
    } catch (err) {
      console.error("HF Generation error:", err);
      alert(`Lỗi khi tạo ảnh: ` + (err as Error).message);
    } finally {
      setIsGeneratingImage(false);
    }
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
      const finalCroppedUrl = await uploadToSupabaseStorageIfPossible(croppedDataUrl, 'crop');

      // Save into photo album
      const newPhotoItem: PhotoAlbumItem = {
        id: `img-crop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: `Crop_${aspectRatio}_${Date.now()}.webp`,
        url: finalCroppedUrl,
        originalSize: croppedDataUrl.length,
        compressedSize: croppedDataUrl.length,
        width: targetW,
        height: targetH,
        createdAt: new Date().toISOString().slice(0, 10),
        caption: `Ảnh căn khung (${aspectRatio}, zoom ${(zoom * 100).toFixed(0)}%)`,
        folder: 'Kho Chung'
      };

      onUpdatePhotos([newPhotoItem, ...photos]);
      onSelectUrl(finalCroppedUrl);
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
              {photos.filter(p => !!p.url).length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  Kho Album chưa có ảnh. Vui lòng chuyển sang tab <strong>"Tải Ảnh Mới"</strong> để tải ảnh lên.
                </div>
              ) : (
                <>
                  {/* Row 1: Folder Filter Badges */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
                      <FolderPlus className="w-3.5 h-3.5" /> Thư Mục:
                    </span>
                    {allFolders.map((folderName) => {
                      const isActive = activeFolder === folderName;
                      return (
                        <button
                          key={folderName}
                          type="button"
                          onClick={() => setActiveFolder(folderName)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                            isActive 
                              ? 'bg-orange-600 text-white shadow-md' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {folderName}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredPhotos.map((photo) => {
                      const isSingleSelected = !isMultiSelect && currentUrl === photo.url;
                      const isMultiSelected = isMultiSelect && selectedUrls.includes(photo.url);
                      const isSelected = isSingleSelected || isMultiSelected;

                      return (
                        <div 
                          key={photo.id}
                          className={`group relative bg-slate-900 rounded-xl overflow-hidden border-2 transition-all ${
                            isSelected ? 'border-orange-500 ring-2 ring-orange-500/50 scale-[1.02]' : 'border-slate-200 hover:border-orange-400'
                          }`}
                        >
                          <div className="aspect-video relative overflow-hidden" 
                            onClick={() => {
                              if (isMultiSelect) {
                                setSelectedUrls(prev => 
                                  prev.includes(photo.url) 
                                    ? prev.filter(u => u !== photo.url) 
                                    : [...prev, photo.url]
                                );
                              }
                            }}
                          >
                            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer" />
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] font-mono text-white">
                              {(photo.compressedSize / 1024).toFixed(0)} KB
                            </div>
                            {isSelected && (
                              <div className="absolute inset-0 bg-orange-600/40 flex items-center justify-center">
                                <span className="px-3 py-1 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> {isMultiSelect ? 'Đã Chọn' : 'Đang Dùng'}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-2 bg-white space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-800 line-clamp-1 block">{photo.caption || photo.name}</span>
                            {!isMultiSelect && (
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
                                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center"
                                >
                                  Căn Lại
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                  })}
                </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD & AUTOMATIC COMPRESSION (300KB - 500KB) */}
          {activeTab === 'upload' && (
            <div className="p-8 border-2 border-dashed border-orange-300 rounded-2xl bg-orange-50/50 text-center space-y-4">
              <input
                type="file"
                multiple
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

              {/* Folder Selector */}
              <div className="max-w-xs mx-auto text-left">
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Thư Mục Đích:</label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  {FOLDER_OPTIONS.map(folder => (
                    <option key={folder} value={folder}>{folder}</option>
                  ))}
                </select>
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
              {/* ─── AI MODEL SELECTOR ─── */}
              <div>
                <label className="block text-xs font-extrabold text-purple-900 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Chọn AI Tạo Ảnh
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AI_MODELS.map((m) => {
                    const isSelected = selectedAiModel === m.key;
                    const borderColor = isSelected
                      ? m.color === 'purple' ? 'border-purple-500 ring-2 ring-purple-300'
                      : m.color === 'blue' ? 'border-blue-500 ring-2 ring-blue-300'
                      : m.color === 'emerald' ? 'border-emerald-500 ring-2 ring-emerald-300'
                      : 'border-amber-500 ring-2 ring-amber-300'
                      : 'border-slate-200 hover:border-purple-300';
                    const bgColor = isSelected
                      ? m.color === 'purple' ? 'bg-purple-50'
                      : m.color === 'blue' ? 'bg-blue-50'
                      : m.color === 'emerald' ? 'bg-emerald-50'
                      : 'bg-amber-50'
                      : 'bg-white hover:bg-slate-50';
                    const badgeColor = m.color === 'purple' ? 'bg-purple-100 text-purple-700'
                      : m.color === 'blue' ? 'bg-blue-100 text-blue-700'
                      : m.color === 'emerald' ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700';

                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setSelectedAiModel(m.key)}
                        disabled={isGeneratingImage}
                        className={`relative p-2.5 rounded-xl border-2 ${borderColor} ${bgColor} text-left transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5">
                            <Check className="w-4 h-4 text-purple-600" />
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px] font-bold text-slate-800">{m.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${badgeColor}`}>{m.badge}</span>
                          <span className="text-[9px] text-slate-400 font-medium">{m.speed}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1 leading-tight">{m.desc}</p>
                        <p className="text-[9px] font-medium text-orange-700 mt-1.5 pt-1.5 border-t border-slate-200/60 leading-tight">
                          <span className="font-bold">Lưu ý:</span> {m.usageNote}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ─── AI STYLE SELECTOR ─── */}
              <div className="mt-4">
                <label className="block text-xs font-extrabold text-purple-900 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Chọn Phong Cách (AI Agent)
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-purple-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="none">✨ Mặc định (Tự do nhập lệnh)</option>
                  <option value="photorealistic">📸 Chân thực (Người thật, sắc nét 8k)</option>
                  <option value="cartoon">🐰 Hoạt hình 3D (Pixar, Disney)</option>
                  <option value="anime2d">🌸 Hoạt hình 2D (Anime, Studio Ghibli)</option>
                  <option value="simple">⚪ Đơn giản (Tối giản, ít chi tiết)</option>
                  <option value="flatdesign">📐 Thiết kế phẳng (Flat Design, phong cách app)</option>
                  <option value="lineart">✏️ Vẽ nét đứt (Line art, phác thảo)</option>
                  <option value="watercolor">🎨 Màu nước (Mềm mại, nghệ thuật)</option>
                  <option value="vector">✒️ Vector (Hình vẽ phẳng, thiết kế logo/icon)</option>
                  <option value="illustration">🎨 Hoạt họa minh họa (Vẽ tranh kỹ thuật số)</option>
                </select>
                <p className="text-[10px] text-purple-600 mt-1.5 font-medium">
                  Mẹo: Chọn phong cách để AI tự động tối ưu câu lệnh, bạn chỉ cần miêu tả chủ thể (VD: "a beautiful girl").
                </p>
              </div>

              {/* ─── PROMPT INPUT ─── */}
              <div className="mt-4">
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
                          const prompt = await generateImagePromptWithAI(aiContext, selectedStyle);
                          setAiPrompt(prompt);
                        } catch (err: any) {
                          console.error("Gemini Error:", err);
                          const errMsg = err.message || '';
                          if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
                            alert("⏳ Trợ lý AI đang bị quá tải (vượt quá số lượt miễn phí trong 1 phút). Vui lòng đợi khoảng 10-15 giây rồi bấm thử lại nhé!");
                          } else {
                            alert("Lỗi khi viết prompt AI: " + errMsg);
                          }
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
                disabled={!aiPrompt.trim() || isGeneratingImage}
                onClick={handleGenerateImage}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingImage ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGeneratingImage
                  ? `Đang vẽ bằng ${AI_MODELS.find(m => m.key === selectedAiModel)?.name} (${AI_MODELS.find(m => m.key === selectedAiModel)?.speed})...`
                  : `Tạo Ảnh với ${AI_MODELS.find(m => m.key === selectedAiModel)?.name}`
                }
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
                  
                  {/* AI IMAGE EDITING TOOL */}
                  <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-left">
                    <label className="block text-[11px] font-extrabold text-indigo-900 mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      🪄 Sửa ảnh này bằng AI (InstructPix2Pix)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="VD: make it winter, add a red hat, make it watercolor..."
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        disabled={isEditingImage}
                        className="flex-1 px-3 py-2 rounded-lg border border-indigo-300 font-mono text-[11px] text-slate-800 bg-white"
                      />
                      <button
                        type="button"
                        disabled={!editPrompt.trim() || isEditingImage}
                        onClick={async () => {
                          setIsEditingImage(true);
                          try {
                            const res = await fetch('/api/edit-image', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ prompt: editPrompt.trim(), image: generatedAiImageUrl })
                            });
                            if (!res.ok) {
                              const errorData = await res.json().catch(() => ({}));
                              throw new Error(errorData.error || 'Lỗi ' + res.status);
                            }
                            const blob = await res.blob();
                            const file = new File([blob], 'ai-edited.png', { type: blob.type });
                            const result = await compressAndOptimizeImage(file, 1920, 1080, 0.85);
                            setGeneratedAiImageUrl(result.dataUrl);
                            setEditPrompt('');
                          } catch (err) {
                            alert("Lỗi khi sửa ảnh AI: " + (err as Error).message);
                          } finally {
                            setIsEditingImage(false);
                          }
                        }}
                        className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-[11px] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        {isEditingImage ? <Sparkles className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {isEditingImage ? 'Đang sửa...' : 'Thực Hiện'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <button
                      type="button"
                      disabled={isSavingToAlbum}
                      onClick={async () => {
                        if (!generatedAiImageUrl) return;
                        setIsSavingToAlbum(true);
                        try {
                          const finalUrl = await uploadToSupabaseStorageIfPossible(generatedAiImageUrl, 'ai');
                          const photoItem: PhotoAlbumItem = {
                            id: `img-ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                            name: `AI_${selectedAiModel}_${Date.now()}.webp`,
                            url: finalUrl,
                            originalSize: 0,
                            compressedSize: Math.round(generatedAiImageUrl.length * 0.75),
                            width: 1200, 
                            height: 630,
                            createdAt: new Date().toISOString().slice(0, 10),
                            caption: `AI (${AI_MODELS.find(m => m.key === selectedAiModel)?.name}): ${aiPrompt.substring(0, 35)}...`,
                            folder: 'Ảnh AI (Tạo Tự Động)'
                          };
                          onUpdatePhotos([photoItem, ...photos]);
                          onSelectUrl(finalUrl);
                          onClose();
                        } catch (err) {
                          console.error("Save AI image error:", err);
                        } finally {
                          setIsSavingToAlbum(false);
                        }
                      }}
                      className="w-full py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      title="Lưu ảnh vào kho và áp dụng cho mục đang chọn"
                    >
                      <Check className="w-4 h-4" />
                      <span>Dùng Ảnh Này</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSavingToAlbum}
                      onClick={async () => {
                        if (!generatedAiImageUrl) return;
                        setIsSavingToAlbum(true);
                        try {
                          const finalUrl = await uploadToSupabaseStorageIfPossible(generatedAiImageUrl, 'ai');
                          const photoItem: PhotoAlbumItem = {
                            id: `img-ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                            name: `AI_${selectedAiModel}_${Date.now()}.webp`,
                            url: finalUrl,
                            originalSize: 0,
                            compressedSize: Math.round(generatedAiImageUrl.length * 0.75),
                            width: 1200, 
                            height: 630,
                            createdAt: new Date().toISOString().slice(0, 10),
                            caption: `AI (${AI_MODELS.find(m => m.key === selectedAiModel)?.name}): ${aiPrompt.substring(0, 35)}...`,
                            folder: 'Ảnh AI (Tạo Tự Động)'
                          };
                          onUpdatePhotos([photoItem, ...photos]);
                          setSaveAlbumSuccess(true);
                          setTimeout(() => setSaveAlbumSuccess(false), 3000);
                        } catch (err) {
                          console.error("Save AI image error:", err);
                        } finally {
                          setIsSavingToAlbum(false);
                        }
                      }}
                      className={`w-full py-2.5 px-2 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                        saveAlbumSuccess ? 'bg-emerald-700 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                      title="Lưu vào kho album để tái sử dụng"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{saveAlbumSuccess ? '✓ Đã Lưu Kho!' : 'Lưu Vào Album'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSavingToAlbum}
                      onClick={() => startCroppingUrl(generatedAiImageUrl)}
                      className="w-full py-2.5 px-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      title="Căn khung & zoom ảnh theo tỷ lệ chuẩn"
                    >
                      <Crop className="w-4 h-4" />
                      <span>Căn Khung Lại</span>
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
