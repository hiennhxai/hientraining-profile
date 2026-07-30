import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Link, Type, Image as ImageIcon, Upload, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { compressAndOptimizeImage } from '../utils/imageOptimizer';

interface InlineTextEditorModalProps {
  isOpen: boolean;
  title: string;
  initialValue: string;
  onClose: () => void;
  onSave: (newValue: string) => void;
}

export const InlineTextEditorModal: React.FC<InlineTextEditorModalProps> = ({
  isOpen,
  title,
  initialValue,
  onClose,
  onSave,
}) => {
  const [content, setContent] = useState(initialValue);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImageField = title.toLowerCase().includes('ảnh') || title.toLowerCase().includes('url') || initialValue.startsWith('http');

  useEffect(() => {
    setContent(initialValue || '');
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleApplyBold = () => {
    setIsBold(!isBold);
    if (!content.includes('<strong>')) {
      setContent(`<strong>${content}</strong>`);
    } else {
      setContent(content.replace(/<\/?strong>/g, ''));
    }
  };

  const handleApplyItalic = () => {
    setIsItalic(!isItalic);
    if (!content.includes('<em>')) {
      setContent(`<em>${content}</em>`);
    } else {
      setContent(content.replace(/<\/?em>/g, ''));
    }
  };

  const handleAddLink = () => {
    if (linkUrl) {
      setContent(`<a href="${linkUrl}" class="text-orange-600 underline font-bold" target="_blank">${content}</a>`);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const result = await compressAndOptimizeImage(file, 1920, 1080, 0.82);
      const base64Response = await fetch(result.dataUrl);
      const blob = await base64Response.blob();

      const fileName = `inline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, blob, { contentType: 'image/webp' });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      setContent(publicUrlData.publicUrl);
    } catch (err) {
      alert('Lỗi tải ảnh: ' + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[160] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-scaleUp text-slate-800">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isImageField ? <ImageIcon className="w-4 h-4 text-orange-500" /> : <Type className="w-4 h-4 text-orange-500" />}
            <h3 className="font-extrabold text-sm uppercase tracking-wider">{title || 'CHỈNH SỬA VĂN BẢN TRỰC QUAN'}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formatting Toolbar Bar (Text mode only) */}
        {!isImageField && (
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={handleApplyBold}
              className={`p-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                isBold ? 'bg-orange-600 text-white border-orange-500' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Đậm (Bold)"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              onClick={handleApplyItalic}
              className={`p-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                isItalic ? 'bg-orange-600 text-white border-orange-500' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Nghiêng (Italic)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-slate-300 mx-1" />

            <button
              onClick={() => setTextAlign('left')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                textAlign === 'left' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Canh trái"
            >
              <AlignLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTextAlign('center')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                textAlign === 'center' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Canh giữa"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTextAlign('right')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                textAlign === 'right' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Canh phải"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-slate-300 mx-1" />

            <button
              onClick={() => setShowLinkInput(!showLinkInput)}
              className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
              title="Chèn liên kết (Link)"
            >
              <Link className="w-4 h-4 text-orange-600" />
              <span className="text-[10px] font-bold">Chèn Link</span>
            </button>
          </div>
        )}

        {/* Link Input Row */}
        {showLinkInput && (
          <div className="p-3 bg-orange-50 border-b border-orange-200 flex items-center gap-2 animate-fadeIn">
            <input
              type="text"
              placeholder="Nhập URL (ví dụ: https://zalo.me/... hoặc #courses)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
            />
            <button
              onClick={handleAddLink}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
            >
              Áp dụng Link
            </button>
          </div>
        )}

        {/* Main Editable Content */}
        <div className="p-6 space-y-4">
          {isImageField ? (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
                {content ? (
                  <img src={content} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 text-xs">Chưa có hình ảnh</span>
                )}
              </div>

              {/* Upload Button & File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                >
                  {isUploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading ? 'Đang nén & Tải lên...' : 'Tải Ảnh Mới Từ Máy Tính'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hoặc dán trực tiếp đường dẫn URL Hình ảnh:</label>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung văn bản (Hỗ trợ định dạng HTML):</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full p-4 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-slate-50 transition-all text-${textAlign}`}
              />
            </div>
          )}

          {/* Live Preview Box (Text only) */}
          {!isImageField && (
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">Xem trước trực tiếp:</span>
              <div
                className={`text-sm text-slate-900 font-medium text-${textAlign}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirmSave}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Áp Dụng Thay Đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
