import React, { useState, useRef, useCallback, useMemo } from 'react';
import { PhotoAlbumItem } from '../types';
import { compressAndOptimizeImage, ImageCropParams } from '../utils/imageOptimizer';
import { 
  Upload, Image as ImageIcon, Sparkles, Trash2, Check, Copy, ZoomIn, ZoomOut, 
  RotateCw, Scissors, X, CheckCircle, AlertCircle, Loader, Folder, FolderPlus, 
  Grid, LayoutGrid, CheckSquare, Square, Filter, Download, Move, Search, Eye, Sliders, Maximize2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UniversalImagePickerModal } from './UniversalImagePickerModal';

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

const DEFAULT_FOLDERS = [
  'Tất cả',
  'Thương Hiệu & Logo',
  'Khóa Học 1-1',
  'Studio & Showroom',
  'Chân Dung MC',
  'Dịch Vụ & Sự Kiện',
  'Ảnh AI (Tạo Tự Động)'
];

export const PhotoAlbumManager: React.FC<PhotoAlbumManagerProps> = ({
  photos,
  onUpdatePhotos,
  onSelectPhotoUrl,
  compactMode = false
}) => {
  // Batch upload state
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Grid Density & View Mode
  // 'compact' = 6 columns (1/3 size), 'medium' = 4 columns (1/2 size), 'large' = 3 columns
  const [gridDensity, setGridDensity] = useState<'compact' | 'medium' | 'large'>('compact');

  // Folder & Search State
  const [activeFolder, setActiveFolder] = useState<string>('Tất cả');
  const [customFolders, setCustomFolders] = useState<string[]>(DEFAULT_FOLDERS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState('');

  // Multi-Select State
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isMoveFolderModalOpen, setIsMoveFolderModalOpen] = useState(false);
  const [targetMoveFolder, setTargetMoveFolder] = useState<string>('Khác');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Lightbox Preview Modal
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoAlbumItem | null>(null);

  // Image Pro Editor Modal State
  const [editingPhoto, setEditingPhoto] = useState<PhotoAlbumItem | null>(null);
  const [editorState, setEditorState] = useState<{
    zoom: number;
    rotation: number; // 0, 90, 180, 270
    flipX: boolean;
    flipY: boolean;
    brightness: number; // 50 to 150
    contrast: number; // 50 to 150
    filter: 'normal' | 'grayscale' | 'sepia' | 'vintage' | 'high-contrast';
  }>({
    zoom: 1.0,
    rotation: 0,
    flipX: false,
    flipY: false,
    brightness: 100,
    contrast: 100,
    filter: 'normal'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Process files upload
  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsBatchRunning(true);

    const initialBatch: BatchItem[] = files.map(f => ({
      id: `batch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      status: 'pending',
      originalSize: f.size,
    }));
    setBatchItems(initialBatch);

    const newPhotos: PhotoAlbumItem[] = [];
    const CONCURRENCY = 4;
    const chunks: File[][] = [];
    for (let i = 0; i < files.length; i += CONCURRENCY) {
      chunks.push(files.slice(i, i + CONCURRENCY));
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(async (file) => {
        const batchId = initialBatch[files.indexOf(file)].id;
        setBatchItems(prev => prev.map(b => b.id === batchId ? { ...b, status: 'compressing' } : b));

        try {
          const result = await compressAndOptimizeImage(file, 1920, 1080, 0.82);
          const savings = Math.round(((file.size - result.compressedSize) / (file.size || 1)) * 100);

          const base64Response = await fetch(result.dataUrl);
          const blob = await base64Response.blob();

          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
          const { error: uploadError } = await supabase.storage
            .from('photos')
            .upload(fileName, blob, { contentType: 'image/webp' });

          if (uploadError) throw new Error("Lỗi upload: " + uploadError.message);

          const { data: publicUrlData } = supabase.storage
            .from('photos')
            .getPublicUrl(fileName);

          const photoItem: PhotoAlbumItem = {
            id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            url: publicUrlData.publicUrl,
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            width: result.width,
            height: result.height,
            createdAt: new Date().toISOString().slice(0, 10),
            caption: file.name.replace(/\.[^/.]+$/, ''),
            folder: activeFolder !== 'Tất cả' ? activeFolder : 'Kho Chung'
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

    onUpdatePhotos([...newPhotos, ...photos]);
    setIsBatchRunning(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [photos, onUpdatePhotos, activeFolder]);

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

  const handleDeletePhoto = async (photoToDelete: PhotoAlbumItem) => {
    if (window.confirm(`Xóa vĩnh viễn hình ảnh "${photoToDelete.caption || photoToDelete.name}" khỏi Album và máy chủ?`)) {
      try {
        const fileName = photoToDelete.url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('photos').remove([fileName]);
        }
      } catch (err) {
        console.error("Lỗi xóa file trên Supabase:", err);
      }
      onUpdatePhotos(photos.filter(p => p.id !== photoToDelete.id));
      setSelectedPhotoIds(prev => prev.filter(id => id !== photoToDelete.id));
      if (lightboxPhoto?.id === photoToDelete.id) setLightboxPhoto(null);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Folder management
  const handleCreateNewFolder = () => {
    const trimmed = newFolderNameInput.trim();
    if (!trimmed) return;
    if (!customFolders.includes(trimmed)) {
      setCustomFolders([...customFolders, trimmed]);
    }
    setActiveFolder(trimmed);
    setNewFolderNameInput('');
    setIsNewFolderModalOpen(false);
  };

  // Multi-select handlers
  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotoIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (filteredPhotos: PhotoAlbumItem[]) => {
    if (selectedPhotoIds.length === filteredPhotos.length) {
      setSelectedPhotoIds([]);
    } else {
      setSelectedPhotoIds(filteredPhotos.map(p => p.id));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedPhotoIds.length === 0) return;
    if (window.confirm(`Xóa vĩnh viễn ${selectedPhotoIds.length} hình ảnh đã chọn khỏi hệ thống?`)) {
      try {
        const photosToDelete = photos.filter(p => selectedPhotoIds.includes(p.id));
        const fileNames = photosToDelete.map(p => p.url.split('/').pop() || '').filter(Boolean);
        if (fileNames.length > 0) {
          await supabase.storage.from('photos').remove(fileNames);
        }
      } catch (err) {
        console.error("Lỗi xóa batch trên Supabase:", err);
      }
      onUpdatePhotos(photos.filter(p => !selectedPhotoIds.includes(p.id)));
      setSelectedPhotoIds([]);
    }
  };

  const handleBatchMoveFolder = () => {
    if (selectedPhotoIds.length === 0) return;
    onUpdatePhotos(photos.map(p => {
      if (selectedPhotoIds.includes(p.id)) {
        return { ...p, folder: targetMoveFolder };
      }
      return p;
    }));
    setSelectedPhotoIds([]);
    setIsMoveFolderModalOpen(false);
  };

  // Photo Editor Export handler (renders to canvas and uploads edited WebP to Supabase)
  const handleApplyEditorChanges = async () => {
    if (!editingPhoto) return;
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = editingPhoto.url;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isRotated = editorState.rotation === 90 || editorState.rotation === 270;
      canvas.width = isRotated ? img.height : img.width;
      canvas.height = isRotated ? img.width : img.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((editorState.rotation * Math.PI) / 180);
      ctx.scale(editorState.flipX ? -1 : 1, editorState.flipY ? -1 : 1);

      let filterString = `brightness(${editorState.brightness}%) contrast(${editorState.contrast}%)`;
      if (editorState.filter === 'grayscale') filterString += ' grayscale(100%)';
      else if (editorState.filter === 'sepia') filterString += ' sepia(90%)';
      else if (editorState.filter === 'vintage') filterString += ' sepia(40%) hue-rotate(-20deg)';
      else if (editorState.filter === 'high-contrast') filterString += ' contrast(150%) saturate(140%)';

      ctx.filter = filterString;
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const editedDataUrl = canvas.toDataURL('image/webp', 0.88);
      const base64Response = await fetch(editedDataUrl);
      const blob = await base64Response.blob();

      const fileName = `edited-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, blob, { contentType: 'image/webp', upsert: true });

      let finalUrl = editedDataUrl;
      if (!uploadError) {
        const { data: pubData } = supabase.storage.from('photos').getPublicUrl(fileName);
        if (pubData?.publicUrl) finalUrl = pubData.publicUrl;
      }

      onUpdatePhotos(photos.map(p => p.id === editingPhoto.id ? {
        ...p,
        url: finalUrl,
        width: canvas.width,
        height: canvas.height,
        compressedSize: blob.size
      } : p));

      setEditingPhoto(null);
    } catch (e) {
      alert("Không thể áp dụng chỉnh sửa hình ảnh: " + (e as Error).message);
    }
  };

  // Filtered photos list
  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      const matchFolder = activeFolder === 'Tất cả' || (p.folder || 'Kho Chung') === activeFolder;
      const matchSearch = !searchQuery || (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return matchFolder && matchSearch;
    });
  }, [photos, activeFolder, searchQuery]);

  // Compute stats per folder
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = { 'Tất cả': photos.length };
    photos.forEach(p => {
      const f = p.folder || 'Kho Chung';
      counts[f] = (counts[f] || 0) + 1;
    });
    return counts;
  }, [photos]);

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ─── HEADER BAR: FOLDERS, UPLOAD & SEARCH CONTROLS ─── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600 font-bold">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                KHO QUẢN TRỊ HÌNH ẢNH STUDIO ({photos.length} FILE)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tự động nén WebP 4K ➔ Tải lên Supabase CDN ➔ Hệ thống Thư Mục & Chỉnh sửa Pro
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tạo Ảnh AI Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewFolderModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-orange-600" />
              <span>+ Tạo Thư Mục</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Tải Ảnh Mới Hàng Loạt</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
            isDragOver ? 'border-orange-500 bg-orange-50/80 scale-[1.01]' : 'border-slate-300 hover:border-orange-400 bg-slate-50/60 hover:bg-orange-50/30'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Upload className="w-4 h-4 text-orange-600" />
            <span>Kéo thả nhiều file ảnh vào đây hoặc nhấp để chọn ảnh từ máy tính</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Hỗ trợ PNG, JPG, WEBP (Tự động nén chuẩn Studio 85% tiết kiệm dung lượng)</span>
        </div>

        {/* Batch Upload Progress Notification */}
        {batchItems.length > 0 && (
          <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                {isBatchRunning ? <Loader className="w-4 h-4 animate-spin text-orange-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                <span>Tiến Trình Xử Lý Nén Ảnh ({batchItems.filter(b => b.status === 'done').length}/{batchItems.length})</span>
              </span>
              {!isBatchRunning && (
                <button type="button" onClick={() => setBatchItems([])} className="text-slate-400 hover:text-white text-[11px] underline">
                  Đóng
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto pt-1">
              {batchItems.map(item => (
                <div key={item.id} className="p-2 rounded bg-slate-800 text-[11px] flex items-center justify-between">
                  <span className="truncate max-w-[100px] text-slate-300">{item.name}</span>
                  {item.status === 'done' && <span className="text-emerald-400 font-bold">-{item.savings}%</span>}
                  {item.status === 'compressing' && <span className="text-orange-400">Đang nén...</span>}
                  {item.status === 'error' && <span className="text-red-400">Lỗi</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── FOLDER TABS & DENSITY CONTROLS BAR ─── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        {/* Row 1: Folder Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Folder className="w-3.5 h-3.5" /> Thư Mục:
          </span>
          {customFolders.map((folderName) => {
            const count = folderCounts[folderName] || 0;
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
                <span>{folderName}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${isActive ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Search Input & Density View Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm hình ảnh theo tên hoặc chú thích..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Multi-Select Toggle */}
            <button
              type="button"
              onClick={() => toggleSelectAll(filteredPhotos)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                selectedPhotoIds.length > 0 ? 'bg-orange-50 border-orange-300 text-orange-700' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {selectedPhotoIds.length === filteredPhotos.length && filteredPhotos.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-orange-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Chọn Tất Cả ({selectedPhotoIds.length})</span>
            </button>

            {/* Density View Switcher (As requested by user: 1/3 size, 1/2 size, large) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setGridDensity('compact')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  gridDensity === 'compact' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Lưới Nhỏ 6 Cột (Tối ưu xem hàng trăm ảnh - 1/3 kích thước)"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">6 Cột (Nhỏ)</span>
              </button>

              <button
                type="button"
                onClick={() => setGridDensity('medium')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  gridDensity === 'medium' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Lưới Vừa 4 Cột (1/2 kích thước)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">4 Cột (Vừa)</span>
              </button>

              <button
                type="button"
                onClick={() => setGridDensity('large')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  gridDensity === 'large' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Lưới Lớn 3 Cột"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3 Cột (Lớn)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BULK ACTIONS FLOATING TOOLBAR ─── */}
      {selectedPhotoIds.length > 0 && (
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-fade-in border border-slate-700">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-lg bg-orange-600 text-white">
              Đã chọn {selectedPhotoIds.length} ảnh
            </span>
            <span className="text-slate-300 hidden sm:inline">Thao tác hàng loạt:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMoveFolderModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Move className="w-3.5 h-3.5 text-amber-400" />
              <span>Chuyển Vào Thư Mục</span>
            </button>

            <button
              type="button"
              onClick={handleBatchDelete}
              className="px-3.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa Tất Cả ({selectedPhotoIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── ALBUM PHOTO GALLERY GRID ─── */}
      {filteredPhotos.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
          <ImageIcon className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          Không tìm thấy hình ảnh nào trong thư mục này. Hãy bấm "Tải Ảnh Mới" để thêm hình vào Album.
        </div>
      ) : (
        <div className={`grid ${
          gridDensity === 'compact' 
            ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5' 
            : gridDensity === 'medium'
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
        }`}>
          {filteredPhotos.map((photo) => {
            const isSelected = selectedPhotoIds.includes(photo.id);
            const saving = Math.max(0, Math.round(((photo.originalSize - photo.compressedSize) / (photo.originalSize || 1)) * 100));

            return (
              <div
                key={photo.id}
                className={`group relative bg-white rounded-2xl border transition-all flex flex-col overflow-hidden shadow-xs hover:shadow-lg ${
                  isSelected ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-slate-200 hover:border-orange-300'
                }`}
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onClick={() => setLightboxPhoto(photo)}
                  />

                  {/* Multi-Select Checkbox Overlay */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); toggleSelectPhoto(photo.id); }}
                    className="absolute top-2 left-2 z-10 p-1 rounded-lg bg-slate-900/60 backdrop-blur-xs cursor-pointer hover:bg-orange-600 transition-colors"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-white" />
                    ) : (
                      <Square className="w-4 h-4 text-white/70" />
                    )}
                  </div>

                  {/* Folder Tag Badge */}
                  {photo.folder && (
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-orange-300 text-[9px] font-bold">
                      {photo.folder}
                    </span>
                  )}

                  {/* Savings / Resolution Badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    {saving > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-[9px] font-mono font-bold">
                        -{saving}%
                      </span>
                    )}
                  </div>

                  {/* Hover Quick Action Overlay */}
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                    {onSelectPhotoUrl && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onSelectPhotoUrl(photo.url); }}
                        className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
                        title="Chèn ảnh này vào bài viết/khóa học"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Chèn</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setLightboxPhoto(photo); }}
                      className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-md cursor-pointer"
                      title="Xem phóng to ảnh"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-700" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPhoto(photo);
                        setEditorState({ zoom: 1.0, rotation: 0, flipX: false, flipY: false, brightness: 100, contrast: 100, filter: 'normal' });
                      }}
                      className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-md cursor-pointer"
                      title="Chỉnh sửa & Cắt gọt Pro"
                    >
                      <Scissors className="w-3.5 h-3.5 text-orange-600" />
                    </button>
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="p-2 space-y-1.5 text-xs flex-1 bg-white">
                  <input
                    type="text"
                    value={photo.caption || ''}
                    placeholder="Tên chú thích..."
                    onChange={(e) => {
                      onUpdatePhotos(photos.map(p => p.id === photo.id ? { ...p, caption: e.target.value } : p));
                    }}
                    className="w-full text-[11px] font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:bg-white"
                  />

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100">
                    <span className="truncate">{formatBytes(photo.compressedSize)}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = photo.url;
                          a.download = photo.name;
                          a.click();
                        }}
                        className="text-slate-600 hover:text-indigo-600 font-bold cursor-pointer"
                        title="Tải ảnh về máy"
                      >
                        <Download className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyUrl(photo.url, photo.id)}
                        className="text-slate-600 hover:text-orange-600 font-bold cursor-pointer"
                        title="Sao chép đường dẫn ảnh CDN"
                      >
                        {copiedId === photo.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo)}
                        className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                        title="Xóa hình ảnh"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── MODAL 1: TẠO THƯ MỤC MỚI ─── */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-[140] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-orange-600" />
                <span>TẠO THƯ MỤC HÌNH ẢNH MỚI</span>
              </h3>
              <button onClick={() => setIsNewFolderModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên Thư Mục Mới</label>
              <input
                type="text"
                value={newFolderNameInput}
                onChange={(e) => setNewFolderNameInput(e.target.value)}
                placeholder="Vd: Banner Quảng Cáo, Ảnh Khóa Học Nâng Cao..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCreateNewFolder}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold shadow-md"
              >
                Tạo Thư Mục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: DI CHUYỂN ẢNH VÀO THƯ MỤC ─── */}
      {isMoveFolderModalOpen && (
        <div className="fixed inset-0 z-[140] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Move className="w-4 h-4 text-orange-600" />
                <span>CHUYỂN {selectedPhotoIds.length} ÁNH VÀO THƯ MỤC</span>
              </h3>
              <button onClick={() => setIsMoveFolderModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Thư Mục Đích</label>
              <select
                value={targetMoveFolder}
                onChange={(e) => setTargetMoveFolder(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white"
              >
                {customFolders.filter(f => f !== 'Tất cả').map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsMoveFolderModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleBatchMoveFolder}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold shadow-md"
              >
                Xác Nhận Di Chuyển
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: LIGHTBOX PREVIEW PHÓNG TO HÌNH ẢNH ─── */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 text-white space-y-4 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-5 h-5 text-orange-500" />
                <span className="font-extrabold text-sm uppercase tracking-wider">{lightboxPhoto.caption || lightboxPhoto.name}</span>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-2 relative">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.name}
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-4 text-slate-400 font-mono">
                <span>Kích thước: {lightboxPhoto.width}×{lightboxPhoto.height} px</span>
                <span>Dung lượng: {formatBytes(lightboxPhoto.compressedSize)}</span>
                <span>Thư mục: <strong className="text-orange-400">{lightboxPhoto.folder || 'Kho Chung'}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                {onSelectPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => { onSelectPhotoUrl(lightboxPhoto.url); setLightboxPhoto(null); }}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold flex items-center gap-1.5 shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Chèn Ảnh Này</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleCopyUrl(lightboxPhoto.url, lightboxPhoto.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5"
                >
                  {copiedId === lightboxPhoto.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span>Copy CDN URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: PRO PHOTO EDITOR (XOAY, LẬT, BỘ LỌC & ĐỘ SÁNG) ─── */}
      {editingPhoto && (
        <div className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 shadow-2xl animate-scaleIn">
            
            {/* Sticky Header */}
            <div className="px-6 py-3.5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-extrabold uppercase tracking-wide">BỘ CÔNG CỤ CHỈNH SỬA & HIỆU ỨNG ÁNH SÁNG PRO</h3>
              </div>
              <button onClick={() => setEditingPhoto(null)} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Center Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Editor Image Live Canvas Preview */}
              <div className="relative aspect-video max-h-[260px] sm:max-h-[300px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-2 mx-auto">
                <img
                  src={editingPhoto.url}
                  alt="preview"
                  style={{
                    transform: `scale(${editorState.zoom}) rotate(${editorState.rotation}deg) scaleX(${editorState.flipX ? -1 : 1}) scaleY(${editorState.flipY ? -1 : 1})`,
                    filter: `brightness(${editorState.brightness}%) contrast(${editorState.contrast}%) ${
                      editorState.filter === 'grayscale' ? 'grayscale(100%)' :
                      editorState.filter === 'sepia' ? 'sepia(90%)' :
                      editorState.filter === 'vintage' ? 'sepia(40%) hue-rotate(-20deg)' :
                      editorState.filter === 'high-contrast' ? 'contrast(150%) saturate(140%)' : ''
                    }`,
                    transition: 'transform 0.2s ease, filter 0.2s ease'
                  }}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Editor Controls */}
              <div className="space-y-4 text-xs font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200">
                
                {/* Rotation & Flip Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <RotateCw className="w-4 h-4 text-orange-600" /> Xoay & Lật Ảnh:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditorState({ ...editorState, rotation: (editorState.rotation + 90) % 360 })}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Xoay 90°</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditorState({ ...editorState, flipX: !editorState.flipX })}
                      className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1 cursor-pointer ${
                        editorState.flipX ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span>Lật Ngang ↔</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditorState({ ...editorState, flipY: !editorState.flipY })}
                      className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1 cursor-pointer ${
                        editorState.flipY ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span>Lật Dọc ↕</span>
                    </button>
                  </div>
                </div>

                {/* Color Filter Presets */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mr-2">
                    <Sliders className="w-4 h-4 text-orange-600" /> Bộ Lọc Màu:
                  </span>
                  {[
                    { id: 'normal', name: 'Chuẩn Studio' },
                    { id: 'grayscale', name: 'Trắng Đen' },
                    { id: 'sepia', name: 'Cổ Điển' },
                    { id: 'vintage', name: 'Vintage' },
                    { id: 'high-contrast', name: 'Rực Rỡ' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setEditorState({ ...editorState, filter: f.id as any })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        editorState.filter === f.id ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>

                {/* Sliders: Brightness & Contrast */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Độ Sáng: {editorState.brightness}%</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={editorState.brightness}
                      onChange={(e) => setEditorState({ ...editorState, brightness: parseInt(e.target.value) })}
                      className="w-full accent-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tương Phản: {editorState.contrast}%</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={editorState.contrast}
                      onChange={(e) => setEditorState({ ...editorState, contrast: parseInt(e.target.value) })}
                      className="w-full accent-orange-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer Actions */}
            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 shrink-0 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleApplyEditorChanges}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Xuất & Lưu Ảnh Mới</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generator Modal directly from PhotoAlbumManager */}
      {isAiModalOpen && (
        <UniversalImagePickerModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          title="TẠO ẢNH BẰNG AI & LƯU VÀO KHO ALBUM"
          photos={photos}
          onUpdatePhotos={onUpdatePhotos}
          onSelectUrl={() => {
            setIsAiModalOpen(false);
          }}
          defaultTab="ai"
        />
      )}

    </div>
  );
};
