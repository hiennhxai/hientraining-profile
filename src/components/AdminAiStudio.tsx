import React, { useState, useRef } from 'react';
import { Sparkles, Image as ImageIcon, Wand2, Download, UploadCloud, Cpu, Shirt, UserCircle, Maximize, AlertCircle } from 'lucide-react';
import { compressAndOptimizeImage } from '../utils/imageOptimizer';
import { supabase } from '../lib/supabase';
import { PhotoAlbumItem } from '../types';

interface AdminAiStudioProps {
  onSaveToAlbum: (photo: PhotoAlbumItem) => void;
}

type AiTool = 'generate' | 'edit' | 'faceswap' | 'tryon' | 'controlnet';

export const AdminAiStudio: React.FC<AdminAiStudioProps> = ({ onSaveToAlbum }) => {
  const [activeTool, setActiveTool] = useState<AiTool>('generate');
  
  // States for Image Generation
  const [genPrompt, setGenPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // States for Image Editing
  const [editPrompt, setEditPrompt] = useState('');
  const [editSourceImage, setEditSourceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- Handlers ---
  const handleGenerate = async () => {
    if (!genPrompt) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: genPrompt, model: 'flux-dev' })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Lỗi khi gọi API Tạo Ảnh");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedImage(url);
    } catch (err) {
      alert("Lỗi tạo ảnh: " + (err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!editPrompt || !editSourceImage) return;
    setIsProcessing(true);
    setGeneratedImage(null);
    try {
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: editPrompt, image: editSourceImage })
      });
      if (!response.ok) throw new Error("Lỗi khi gọi API Modal Edit");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedImage(url);
    } catch (err) {
      alert("Lỗi sửa ảnh: " + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => setEditSourceImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadHD = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `AI-HD-${Date.now()}.jpg`;
    a.click();
  };

  const handleCompressAndSave = async () => {
    if (!generatedImage) return;
    setIsSaving(true);
    try {
      // Tải blob từ URL local
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      const file = new File([blob], `ai-image-${Date.now()}.jpg`, { type: blob.type });
      
      // Nén ảnh WebP
      const compressed = await compressAndOptimizeImage(file, 1920, 1080, 0.85);
      
      const base64Response = await fetch(compressed.dataUrl);
      const compressedBlob = await base64Response.blob();
      
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, compressedBlob, { contentType: 'image/webp' });

      if (uploadError) throw new Error("Lỗi upload: " + uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);
        
      const finalUrl = publicUrlData.publicUrl;
      
      // Tạo Photo Item
      const item: PhotoAlbumItem = {
        id: `img-ai-${Date.now()}`,
        name: `AI_Studio_${Date.now()}.webp`,
        url: finalUrl,
        originalSize: file.size,
        compressedSize: Math.round(compressed.dataUrl.length * 0.75),
        width: 1920,
        height: 1080,
        createdAt: new Date().toISOString().slice(0, 10),
        caption: `AI Studio: ${activeTool === 'generate' ? genPrompt : editPrompt}`,
        folder: 'Ảnh AI (Tạo Tự Động)'
      };
      
      onSaveToAlbum(item);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Lỗi lưu ảnh: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-4 relative">
      {/* Cột trái: Menu Công Cụ */}
      <div className="w-full md:w-64 bg-white rounded-2xl border border-slate-200 p-3 shrink-0 flex flex-col gap-2 shadow-xs">
        <div className="px-2 pb-2 mb-2 border-b border-slate-100 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-extrabold text-sm text-slate-900 uppercase">AI Tools</h3>
        </div>

        <button aria-label="Action button" onClick={() => { setActiveTool('generate'); setGeneratedImage(null); }}
          className={`px-3 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-all ${
            activeTool === 'generate' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <ImageIcon className="w-4 h-4 shrink-0" />
          Tạo Ảnh Mới (FLUX)
        </button>

        <button aria-label="Action button" onClick={() => { setActiveTool('edit'); setGeneratedImage(null); }}
          className={`px-3 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-all ${
            activeTool === 'edit' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          Sửa Ảnh (Pix2Pix)
        </button>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 mb-2 px-2 uppercase tracking-wider">Coming Soon</p>
          
          <button aria-label="Action button" disabled className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 text-slate-400 opacity-70 bg-slate-50">
            <UserCircle className="w-4 h-4 shrink-0" />
            Đổi Khuôn Mặt (FaceSwap)
          </button>
          
          <button aria-label="Action button" disabled className="w-full mt-2 px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 text-slate-400 opacity-70 bg-slate-50">
            <Shirt className="w-4 h-4 shrink-0" />
            Thay Quần Áo (Try-on)
          </button>

          <button aria-label="Action button" disabled className="w-full mt-2 px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 text-slate-400 opacity-70 bg-slate-50">
            <Maximize className="w-4 h-4 shrink-0" />
            Dựng Phối Cảnh (ControlNet)
          </button>
        </div>
        
        <div className="mt-auto pt-4 text-[10px] text-slate-400 font-medium text-center">
          Powered by FLUX.1 Dev (Hugging Face)
        </div>
      </div>

      {/* Cột phải: Khu vực làm việc */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        
        {activeTool === 'generate' && (
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" /> Tạo Ảnh AI Siêu Thực (FLUX.1 Dev)
            </h3>
            <textarea
              rows={3}
              placeholder="Miêu tả bức ảnh bạn muốn tạo (Nên dùng tiếng Anh). VD: A professional studio portrait of a businessman..."
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
            />
            <div className="mt-3 flex justify-end">
              <button aria-label="Action button" onClick={handleGenerate}
                disabled={!genPrompt.trim() || isGenerating}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {isGenerating ? 'Đang tạo ảnh...' : 'Bắt Đầu Tạo Ảnh'}
              </button>
            </div>
          </div>
        )}

        {activeTool === 'edit' && (
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Sửa Ảnh Tự Động (InstructPix2Pix)
            </h3>
            
            <div className="flex gap-4 mb-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors shrink-0 overflow-hidden relative"
              >
                {editSourceImage ? (
                  <img loading="lazy" decoding="async" src={editSourceImage} alt="Source" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-indigo-400 mb-2" />
                    <span className="text-[10px] font-bold text-indigo-600 text-center px-2">Tải ảnh gốc</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

              <div className="flex-1 flex flex-col justify-center">
                <textarea
                  rows={2}
                  placeholder="Nhập lệnh sửa (VD: make it winter, add a red hat...)"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button aria-label="Action button" onClick={handleEdit}
                disabled={!editPrompt.trim() || !editSourceImage || isProcessing}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isProcessing ? 'Đang xử lý...' : 'Sửa Ảnh'}
              </button>
            </div>
          </div>
        )}

        {/* Kết Quả */}
        <div className="flex-1 p-5 flex flex-col items-center justify-center bg-slate-900 relative">
          {generatedImage ? (
            <div className="h-full w-full flex flex-col items-center justify-center animate-fade-in">
              <img loading="lazy" decoding="async" src={generatedImage} alt="AI Result" className="max-h-[60vh] max-w-full rounded-lg shadow-2xl object-contain bg-slate-800" />
              
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button aria-label="Action button" onClick={handleDownloadHD}
                  className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Tải Về Máy (HD Không nén)
                </button>

                <button aria-label="Action button" onClick={handleCompressAndSave}
                  disabled={isSaving}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 ${
                    saveSuccess ? 'bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isSaving ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : saveSuccess ? (
                    <UploadCloud className="w-4 h-4" />
                  ) : (
                    <UploadCloud className="w-4 h-4" />
                  )}
                  {isSaving ? 'Đang Nén & Upload...' : saveSuccess ? 'Đã Lưu Vào Kho Ảnh!' : 'Nén WebP & Lưu Vào Kho'}
                </button>
              </div>
              
              <p className="text-slate-400 text-[11px] mt-3 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Khuyến nghị chọn [Nén WebP] để tiết kiệm dung lượng Supabase (Chỉ chiếm 20% dung lượng gốc).
              </p>
            </div>
          ) : (
            <div className="text-slate-500 text-center flex flex-col items-center">
              <ImageIcon className="w-16 h-16 opacity-20 mb-3" />
              <p className="text-sm font-medium">Kết quả AI sẽ hiển thị tại đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



