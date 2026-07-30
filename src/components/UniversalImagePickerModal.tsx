import React, { useState, useRef } from 'react';
import { PhotoAlbumItem } from '../types';
import { compressAndOptimizeImage } from '../utils/imageOptimizer';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Check, Sparkles, Copy, Camera } from 'lucide-react';

interface UniversalImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUrl: (url: string) => void;
  currentUrl?: string;
  photos: PhotoAlbumItem[];
  onUpdatePhotos: (photos: PhotoAlbumItem[]) => void;
  title?: string;
}

export const UniversalImagePickerModal: React.FC<UniversalImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectUrl,
  currentUrl = '',
  photos,
  onUpdatePhotos,
  title = 'CHỌN HOẶC TẢI HÌNH ẢNH MỚI'
}) => {
  const [activeTab, setActiveTab] = useState<'album' | 'upload' | 'url'>('album');
  const [inputUrl, setInputUrl] = useState<string>(currentUrl);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos: PhotoAlbumItem[] = [...photos];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Automatically compress image down to ~300KB - 500KB WebP
        const result = await compressAndOptimizeImage(file, 1920, 1080, 0.82);
        
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
        // Instantly select the first uploaded compressed image
        if (i === 0) {
          onSelectUrl(result.dataUrl);
        }
      }

      onUpdatePhotos(newPhotos);
      onClose();
    } catch (err) {
      alert("Lỗi khi nén ảnh: " + (err as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (!inputUrl.trim()) {
      alert("Vui lòng nhập đường dẫn URL hình ảnh!");
      return;
    }
    onSelectUrl(inputUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
        
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

        {/* Tab Selection */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('album')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'album' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>1. Kho Album Ảnh Studio ({photos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'upload' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>2. Tải Ảnh Mới / Chụp Ảnh (Tự Động Nén 300KB-500KB)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'url' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>3. Dán Link URL</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TAB 1: ALBUM SELECTOR */}
          {activeTab === 'album' && (
            <div className="space-y-4">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 font-medium">
                ✦ Bấm <strong>"Chọn Ảnh Này"</strong> để sử dụng ngay hình ảnh nén chất lượng cao từ Kho Album của bạn.
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
                        onClick={() => {
                          onSelectUrl(photo.url);
                          onClose();
                        }}
                        className={`group relative bg-slate-900 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
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
                        <div className="p-2 bg-white flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-800 line-clamp-1">{photo.caption || photo.name}</span>
                          <span className="text-[10px] font-mono text-orange-600 font-bold">Chèn ›</span>
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
                  Hệ thống tự động quy đổi & nén ảnh xuống chuẩn <strong>300KB - 500KB (WebP High Definition)</strong> giúp giữ sắc nét 4K mà website tải siêu nhanh.
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

              <button
                type="button"
                onClick={handleApplyUrl}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Áp Dụng URL Này</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
