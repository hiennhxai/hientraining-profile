import React, { useState, useRef, useCallback } from 'react';
import { PhotoAlbumItem } from '../types';
import { compressAndOptimizeImage, transformAndCropImage, ImageCropParams } from '../utils/imageOptimizer';
import { Upload, Image as ImageIcon, Sparkles, Trash2, Check, Copy, ZoomIn, ZoomOut, RotateCw, Scissors, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PhotoAlbumManagerProps {
  photos: PhotoAlbumItem[];
  onUpdatePhotos: (photos: PhotoAlbumItem[]) => void;
  onSelectPhotoUrl?: (url: string) => void;
  compactMode?: boolean;
}

interface BatchItem {
  id: string;
  name: string;
  status: 'pending' | 'compressing' | 'done' | 'error';
  originalSize: number;
  compressedSize?: number;
  savings?: number;
  error?: string;
}

export const PhotoAlbumManager: React.FC<PhotoAlbumManagerProps> = ({
  photos,
  onUpdatePhotos,
  onSelectPhotoUrl,
  compactMode = false
}) => {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Image Editor Modal
  const [editingPhoto, setEditingPhoto] = useState<PhotoAlbumItem | null>(null);
  const [cropParams, setCropParams] = useState<ImageCropParams>({
    zoom: 1.0, rotation: 0, brightness: 100, contrast: 100,
    cropX: 0, cropY: 0, cropWidth: 100, cropHeight: 100
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsBatchRunning(true);

    // Initialize batch queue
    const initialBatch: BatchItem[] = files.map(f => ({
      id: `batch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      status: 'pending',
      originalSize: f.size,
    }));
    setBatchItems(initialBatch);

    const newPhotos: PhotoAlbumItem[] = [];

    // Process all files in parallel (max 4 concurrent)
    const CONCURRENCY = 4;
    const chunks: File[][] = [];
    for (let i = 0; i < files.length; i += CONCURRENCY) {
      chunks.push(files.slice(i, i + CONCURRENCY));
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(async (file, localIdx) => {
        const batchId = initialBatch[files.indexOf(file)].id;

        // Mark as compressing
        setBatchItems(prev => prev.map(b => b.id === batchId ? { ...b, status: 'compressing' } : b));

        try {
          const result = await compressAndOptimizeImage(file, 1920, 1080, 0.82);
          const savings = Math.round(((file.size - result.compressedSize) / (file.size || 1)) * 100);

          // Convert dataUrl (Base64) to Blob
          const base64Response = await fetch(result.dataUrl);
          const blob = await base64Response.blob();

          // Upload to Supabase
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
          const { error: uploadError } = await supabase.storage
            .from('photos')
            .upload(fileName, blob, { contentType: 'image/webp' });

          if (uploadError) throw new Error("Lỗi upload: " + uploadError.message);

          const { data: publicUrlData } = supabase.storage
            .from('photos')
            .getPublicUrl(fileName);

          const publicUrl = publicUrlData.publicUrl;

          const photoItem: PhotoAlbumItem = {
            id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            url: publicUrl,
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            width: result.width,
            height: result.height,
            createdAt: new Date().toISOString().slice(0, 10),
            caption: file.name.replace(/\.[^/.]+$/, '')
          };
          newPhotos.push(photoItem);

          setBatchItems(prev => prev.map(b => b.id === batchId ? {
            ...b, status: 'done', compressedSize: result.compressedSize, savings
          } : b));
        } catch (err) {
          setBatchItems(prev => prev.map(b => b.id === batchId ? {
            ...b, status: 'error', error: (err as Error).message
          } : b));
        }
      }));
    }

    // Prepend new photos to album
    onUpdatePhotos([...newPhotos, ...photos]);
    setIsBatchRunning(false);

    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [photos, onUpdatePhotos]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f): f is File => f instanceof File && f.type.startsWith('image/'));
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDeletePhoto = async (photo: PhotoAlbumItem) => {
    if (window.confirm('Bạn có chắc muốn xóa hình ảnh này khỏi Album?')) {
      try {
        const urlObj = new URL(photo.url);
        if (urlObj.hostname.includes('supabase.co')) {
          const parts = urlObj.pathname.split('/');
          const fileName = parts[parts.length - 1];
          if (fileName) {
            await supabase.storage.from('photos').remove([fileName]);
          }
        }
      } catch (e) {
        // Ignore parsing errors for non-supabase URLs
      }
      onUpdatePhotos(photos.filter(p => p.id !== photo.id));
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleApplyCrop = async () => {
    if (!editingPhoto) return;
    try {
      const transformedBase64 = await transformAndCropImage(editingPhoto.url, cropParams);
      
      const base64Response = await fetch(transformedBase64);
      const blob = await base64Response.blob();

      const fileName = `crop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, blob, { contentType: 'image/webp' });

      if (uploadError) throw new Error("Lỗi upload: " + uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      onUpdatePhotos(photos.map(p => p.id === editingPhoto.id ? { ...p, url: publicUrl } : p));
      setEditingPhoto(null);
    } catch (err) {
      alert('Lỗi khi lưu ảnh đã chỉnh sửa: ' + (err as Error).message);
    }
  };

  const doneCount = batchItems.filter(b => b.status === 'done').length;
  const totalBatch = batchItems.length;
  const progressPct = totalBatch > 0 ? Math.round((doneCount / totalBatch) * 100) : 0;

  return (
    <div className="space-y-6">

      {/* ─── DRAG & DROP UPLOAD ZONE ─── */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isBatchRunning && fileInputRef.current?.click()}
        className={`relative p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center select-none
          ${isDragOver
            ? 'border-orange-500 bg-orange-50 scale-[1.01]'
            : 'border-orange-300 bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-white hover:border-orange-500 hover:bg-orange-50/80'
          }
          ${isBatchRunning ? 'pointer-events-none opacity-80' : ''}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all
            ${isDragOver ? 'bg-orange-500 scale-110' : 'bg-orange-600 shadow-orange-500/30'}`}
          >
            {isBatchRunning
              ? <Sparkles className="w-8 h-8 text-white animate-spin" />
              : <Upload className="w-8 h-8 text-white" />
            }
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              {isBatchRunning
                ? `Đang nén & tối ưu ${doneCount}/${totalBatch} ảnh...`
                : isDragOver
                  ? '✦ Thả ảnh vào đây để tải lên!'
                  : 'Kéo thả nhiều ảnh vào đây hoặc bấm để chọn'
              }
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Hỗ trợ JPG · PNG · WebP · HEIC — Nén thông minh Canvas WebP, giữ nét 4K, giảm 80–90% dung lượng
            </p>
          </div>

          {!isBatchRunning && (
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md hover:bg-orange-500 transition-colors flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Chọn Nhiều Ảnh Cùng Lúc
              </span>
              <span className="text-xs text-slate-400 font-medium">hoặc kéo thả từ máy tính</span>
            </div>
          )}
        </div>
      </div>

      {/* ─── BATCH PROGRESS PANEL ─── */}
      {batchItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header + overall progress bar */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Tiến Trình Nén Hàng Loạt — {doneCount}/{totalBatch} ảnh
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-orange-600">{progressPct}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Per-file list */}
          <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
            {batchItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-2.5 text-xs">
                {/* Status icon */}
                <span className="shrink-0">
                  {item.status === 'done' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  {item.status === 'compressing' && <Loader className="w-4 h-4 text-orange-500 animate-spin" />}
                  {item.status === 'pending' && <span className="w-4 h-4 rounded-full border-2 border-slate-300 inline-block" />}
                  {item.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                </span>

                {/* File name */}
                <span className="flex-1 font-medium text-slate-700 truncate" title={item.name}>
                  {item.name}
                </span>

                {/* Stats */}
                <span className="shrink-0 font-mono text-slate-400">
                  {formatBytes(item.originalSize)}
                </span>

                {item.status === 'done' && item.compressedSize && (
                  <>
                    <span className="shrink-0 text-slate-400">→</span>
                    <span className="shrink-0 font-mono font-bold text-emerald-600">
                      {formatBytes(item.compressedSize)}
                    </span>
                    <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                      -{item.savings}%
                    </span>
                  </>
                )}

                {item.status === 'compressing' && (
                  <span className="shrink-0 text-orange-500 font-medium animate-pulse">Đang nén...</span>
                )}

                {item.status === 'error' && (
                  <span className="shrink-0 text-red-500 font-medium truncate max-w-[120px]" title={item.error}>
                    {item.error}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Done summary */}
          {!isBatchRunning && doneCount > 0 && (
            <div className="px-5 py-3 bg-emerald-50 border-t border-emerald-100 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">
                Đã nén thành công {doneCount} ảnh và lưu vào Album!{' '}
                {batchItems.filter(b => b.status === 'error').length > 0 &&
                  `(${batchItems.filter(b => b.status === 'error').length} ảnh lỗi)`
                }
              </span>
              <button
                type="button"
                onClick={() => setBatchItems([])}
                className="ml-auto text-emerald-600 hover:text-emerald-800 text-[10px] font-bold underline cursor-pointer"
              >
                Đóng thông báo
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── ALBUM GALLERY ─── */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-orange-600" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Thư Viện Album Ảnh ({photos.length} Ảnh)
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">Hover ảnh → Chèn Ảnh / Chỉnh sửa / Xóa</span>
      </div>

      {photos.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          <ImageIcon className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          Chưa có ảnh nào trong Album. Kéo thả hoặc bấm để tải lên ở trên.
        </div>
      ) : (
        <div className={`grid ${compactMode ? 'grid-cols-2 sm:grid-cols-3 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'}`}>
          {photos.map((photo) => {
            const saving = Math.max(0, Math.round(((photo.originalSize - photo.compressedSize) / (photo.originalSize || 1)) * 100));
            return (
              <div
                key={photo.id}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                      {photo.width}×{photo.height}
                    </span>
                    {saving > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-bold">
                        -{saving}% Nét
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                    {onSelectPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => onSelectPhotoUrl(photo.url)}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Chèn Ảnh</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPhoto(photo);
                        setCropParams({ zoom: 1.0, rotation: 0, brightness: 100, contrast: 100, cropX: 0, cropY: 0, cropWidth: 100, cropHeight: 100 });
                      }}
                      className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-md cursor-pointer"
                      title="Chỉnh sửa ảnh"
                    >
                      <Scissors className="w-4 h-4 text-orange-600" />
                    </button>
                  </div>
                </div>

                <div className="p-3 space-y-2 text-xs flex-1">
                  <input
                    type="text"
                    value={photo.caption || ''}
                    placeholder="Nhập chú thích ảnh..."
                    onChange={(e) => {
                      onUpdatePhotos(photos.map(p => p.id === photo.id ? { ...p, caption: e.target.value } : p));
                    }}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:bg-white"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
                    <span>{formatBytes(photo.compressedSize)} nén</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(photo.url, photo.id)}
                        className="text-slate-600 hover:text-orange-600 font-bold flex items-center gap-1 cursor-pointer"
                        title="Copy URL"
                      >
                        {copiedId === photo.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === photo.id ? 'Đã Copy' : 'Copy URL'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── EDIT MODAL ─── */}
      {editingPhoto && (
        <div className="fixed inset-0 z-[120] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-extrabold text-slate-900">CHỈNH SỬA & CẮT GỌT HÌNH ẢNH PRO</h3>
              </div>
              <button onClick={() => setEditingPhoto(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={editingPhoto.url}
                alt="preview"
                style={{
                  transform: `scale(${cropParams.zoom}) rotate(${cropParams.rotation}deg)`,
                  filter: `brightness(${cropParams.brightness}%) contrast(${cropParams.contrast}%)`,
                  transition: 'transform 0.2s ease, filter 0.2s ease'
                }}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Zoom: {(cropParams.zoom * 100).toFixed(0)}%</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setCropParams({ ...cropParams, zoom: Math.max(0.5, cropParams.zoom - 0.1) })} className="p-1 rounded bg-slate-100 hover:bg-slate-200"><ZoomOut className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setCropParams({ ...cropParams, zoom: Math.min(3, cropParams.zoom + 0.1) })} className="p-1 rounded bg-slate-100 hover:bg-slate-200"><ZoomIn className="w-3.5 h-3.5" /></button>
                  </div>
                </label>
                <input type="range" min="0.5" max="3" step="0.05" value={cropParams.zoom} onChange={(e) => setCropParams({ ...cropParams, zoom: parseFloat(e.target.value) })} className="w-full accent-orange-600" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Xoay: {cropParams.rotation}°</span>
                  <button onClick={() => setCropParams({ ...cropParams, rotation: (cropParams.rotation + 90) % 360 })} className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold flex items-center gap-1 cursor-pointer"><RotateCw className="w-3.5 h-3.5" /><span>90°</span></button>
                </label>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Độ Sáng: {cropParams.brightness}%</label>
                <input type="range" min="50" max="150" value={cropParams.brightness} onChange={(e) => setCropParams({ ...cropParams, brightness: parseInt(e.target.value) })} className="w-full accent-orange-600" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tương Phản: {cropParams.contrast}%</label>
                <input type="range" min="50" max="150" value={cropParams.contrast} onChange={(e) => setCropParams({ ...cropParams, contrast: parseInt(e.target.value) })} className="w-full accent-orange-600" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button type="button" onClick={() => setEditingPhoto(null)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">Hủy</button>
              <button type="button" onClick={handleApplyCrop} className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Áp Dụng & Lưu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
