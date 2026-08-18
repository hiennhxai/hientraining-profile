import React, { useState } from 'react';
import { BodyBlock, ArticleTranslation, PhotoAlbumItem } from '../types';
import { PhotoAlbumManager } from './PhotoAlbumManager';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Type, Heading1, Quote as QuoteIcon, 
  List, Link as LinkIcon, Image as ImageIcon, Bold, Italic, 
  Highlighter, Sparkles, Box, Check, AlignLeft
} from 'lucide-react';

interface RichArticleBlockEditorProps {
  translation: ArticleTranslation;
  onChange: (updated: ArticleTranslation) => void;
  albumPhotos: PhotoAlbumItem[];
  onUpdateAlbumPhotos: (photos: PhotoAlbumItem[]) => void;
  onOpenPicker?: (onSelect: (url: string) => void, title: string, currentUrl: string, aiContext?: string) => void;
}

export const RichArticleBlockEditor: React.FC<RichArticleBlockEditorProps> = ({
  translation,
  onChange,
  albumPhotos,
  onUpdateAlbumPhotos,
  onOpenPicker
}) => {
  const [showLinkModal, setShowLinkModal] = useState<number | null>(null);
  const [linkUrl, setLinkUrl] = useState('https://xuanhien.info');
  const [linkText, setLinkText] = useState('Xuân Hiến Studio');

  const [showPhotoPicker, setShowPhotoPicker] = useState<number | null>(null);

  const handleUpdateBlock = (index: number, newBlock: BodyBlock) => {
    const newBody = [...translation.body];
    newBody[index] = newBlock;
    onChange({ ...translation, body: newBody });
  };

  const handleAddBlock = (type: 'p' | 'h' | 'quote' | 'list') => {
    let block: BodyBlock;
    if (type === 'p') {
      block = { t: 'p', c: 'Nhập nội dung đoạn văn mới ở đây...' };
    } else if (type === 'h') {
      block = { t: 'h', sn: '01', c: 'Tiêu Đề Mục Mới' };
    } else if (type === 'quote') {
      block = { t: 'quote', c: 'Trích dẫn ấn tượng hoặc thông điệp cốt lõi...' };
    } else {
      block = { t: 'list', items: ['Ý thứ nhất...', 'Ý thứ hai...'] };
    }
    onChange({ ...translation, body: [...translation.body, block] });
  };

  const handleDeleteBlock = (index: number) => {
    const newBody = translation.body.filter((_, i) => i !== index);
    onChange({ ...translation, body: newBody });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newBody = [...translation.body];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newBody.length) return;
    const temp = newBody[index];
    newBody[index] = newBody[targetIdx];
    newBody[targetIdx] = temp;
    onChange({ ...translation, body: newBody });
  };

  const insertFormatting = (index: number, tag: 'strong' | 'em' | 'callout' | 'underline') => {
    const block = translation.body[index];
    if ('c' in block) {
      let content = block.c;
      if (tag === 'strong') {
        content = `${content} <strong>in đậm</strong>`;
      } else if (tag === 'em') {
        content = `${content} <em>in nghiêng</em>`;
      } else if (tag === 'underline') {
        content = `${content} <u>gạch chân</u>`;
      } else if (tag === 'callout') {
        content = `<div class="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-xl my-3 text-slate-800 font-medium">${content}</div>`;
      }
      handleUpdateBlock(index, { ...block, c: content });
    }
  };

  const handleInsertLink = (index: number) => {
    const block = translation.body[index];
    if ('c' in block) {
      const htmlLink = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-orange-600 font-bold underline hover:text-orange-700">${linkText}</a>`;
      const updatedContent = `${block.c} ${htmlLink}`;
      handleUpdateBlock(index, { ...block, c: updatedContent });
      setShowLinkModal(null);
    }
  };

  const handleInsertPhotoToBlock = (index: number, url: string) => {
    const block = translation.body[index];
    if ('c' in block) {
      const imgHtml = `<figure class="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-md"><img src="${url}" alt="Xuân Hiến Studio" class="w-full h-auto object-cover"/><figcaption class="p-3 bg-slate-50 text-center text-xs text-slate-500 font-medium border-t border-slate-100">Hình ảnh minh họa từ Album Xuân Hiến Studio</figcaption></figure>`;
      const updatedContent = `${block.c}\n${imgHtml}`;
      handleUpdateBlock(index, { ...block, c: updatedContent });
      setShowPhotoPicker(null);
    }
  };

  const aiContextStr = `Title: ${translation.title}\nSummary: ${translation.dek}`;

  return (
    <div className="space-y-6">
      {/* Editor Header Info */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
          <Type className="w-4 h-4 text-orange-600" />
          <span>Thông Tin Tiêu Đề & Tóm Tắt Bài Viết</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tiêu Đề Bài Viết (Headline chính)</label>
            <input 
              type="text"
              value={translation.title}
              onChange={(e) => onChange({ ...translation, title: e.target.value })}
              className="w-full font-extrabold text-slate-900 px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Thời Gian Đọc (Read time)</label>
            <input 
              type="text"
              value={translation.readTime}
              onChange={(e) => onChange({ ...translation, readTime: e.target.value })}
              className="w-full font-mono px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Đoạn Tóm Tắt Đầu Bài (Dek / Intro)</label>
            <textarea 
              rows={2}
              value={translation.dek}
              onChange={(e) => onChange({ ...translation, dek: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-medium"
            />
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-700 mb-1">Ảnh Bìa (Cover Image) (Landscape 32:9)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={translation.coverImage || ''}
                onChange={(e) => onChange({ ...translation, coverImage: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 bg-orange-50/40"
              />
              <button
                type="button"
                onClick={() => {
                  if (onOpenPicker) {
                    onOpenPicker(
                      (selectedUrl) => onChange({ ...translation, coverImage: selectedUrl }),
                      `CHỌN ẢNH BÌA BÀI VIẾT: ${translation.title}`,
                      translation.coverImage || '',
                      aiContextStr
                    );
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Đổi Ảnh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900 rounded-2xl text-white shadow-md">
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400 pl-2">
          Trình Soạn Thảo Block Chuyên Nghiệp ({translation.body.length} Khối)
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => handleAddBlock('p')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-orange-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Đoạn Văn (P)</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('h')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-orange-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Heading1 className="w-3.5 h-3.5" />
            <span>+ Tiêu Đề (H2)</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('quote')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-orange-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <QuoteIcon className="w-3.5 h-3.5" />
            <span>+ Trích Dẫn</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('list')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-orange-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
            <span>+ Danh Sách</span>
          </button>
        </div>
      </div>

      {/* Dynamic Blocks Container */}
      <div className="space-y-4">
        {translation.body.map((block, idx) => (
          <div 
            key={idx} 
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 transition-all space-y-3"
          >
            {/* Block Control Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold uppercase">
                  Block #{idx + 1} : {block.t.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400 font-medium">Chỉnh sửa nội dung & định dạng</span>
              </div>

              {/* Formatting Quick Tools */}
              <div className="flex items-center gap-1">
                {'c' in block && (
                  <>
                    <button
                      type="button"
                      onClick={() => insertFormatting(idx, 'strong')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                      title="In đậm (Bold)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting(idx, 'em')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                      title="In nghiêng (Italic)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting(idx, 'callout')}
                      className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-bold cursor-pointer"
                      title="Đóng khung Callout Nổi Bật"
                    >
                      <Box className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLinkModal(idx)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                      title="Chèn Liên Kết (Hyperlink)"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenPicker) {
                          const currentUrl = /src="(.*?)"/.exec(block.c)?.[1] || '';
                          onOpenPicker(
                            (url) => {
                              const newC = `<img src="${url}" alt="Article Image" class="w-full rounded-2xl shadow-md my-4" />`;
                              handleUpdateBlock(idx, { ...block, c: newC });
                            },
                            'CHỌN HÌNH ẢNH CHO BÀI VIẾT',
                            currentUrl,
                            aiContextStr
                          );
                        } else {
                          setShowPhotoPicker(idx);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-bold cursor-pointer"
                      title="Chèn Ảnh Từ Album Studio"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {/* Move & Delete */}
                <button
                  type="button"
                  onClick={() => handleMoveBlock(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 cursor-pointer ml-2"
                  title="Di chuyển lên"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveBlock(idx, 'down')}
                  disabled={idx === translation.body.length - 1}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 cursor-pointer"
                  title="Di chuyển xuống"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBlock(idx)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                  title="Xóa block"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Block Specific Content */}
            {block.t === 'p' && (
              <div>
                <textarea 
                  rows={4}
                  value={block.c}
                  onChange={(e) => handleUpdateBlock(idx, { ...block, c: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-serif leading-relaxed focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập nội dung đoạn văn (Hỗ trợ HTML tags <strong>, <em>, <a>, <img>...)"
                />
              </div>
            )}

            {block.t === 'h' && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Số Thứ Tự (Vd: 01)</label>
                  <input 
                    type="text" 
                    value={block.sn || ''} 
                    onChange={(e) => handleUpdateBlock(idx, { ...block, sn: e.target.value })}
                    className="w-full px-2.5 py-1.5 font-mono text-xs font-bold rounded-xl border border-slate-300"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Nội Dung Tiêu Đề Heading</label>
                  <input 
                    type="text" 
                    value={block.c} 
                    onChange={(e) => handleUpdateBlock(idx, { ...block, c: e.target.value })}
                    className="w-full px-3 py-1.5 font-extrabold text-xs text-slate-900 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            )}

            {block.t === 'quote' && (
              <div>
                <textarea 
                  rows={3}
                  value={block.c}
                  onChange={(e) => handleUpdateBlock(idx, { ...block, c: e.target.value })}
                  className="w-full p-3 rounded-xl border border-orange-300 bg-orange-50/50 text-xs font-semibold text-orange-900 italic"
                />
              </div>
            )}

            {block.t === 'list' && (
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500">Các Mục Trong Danh Sách (Mỗi dòng 1 ý)</label>
                <textarea 
                  rows={4}
                  value={block.items.join('\n')}
                  onChange={(e) => handleUpdateBlock(idx, { ...block, items: e.target.value.split('\n').filter(i => i.trim()) })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* INSERT LINK MODAL */}
      {showLinkModal !== null && (
        <div className="fixed inset-0 z-[130] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 shadow-xl">
            <h4 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-orange-600" />
              <span>Chèn Đường Dẫn (Hyperlink)</span>
            </h4>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Hiển Thị Link (Anchor Text)</label>
                <input 
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường Dẫn Đích (URL)</label>
                <input 
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleInsertLink(showLinkModal)}
                className="px-4 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs"
              >
                Chèn Link Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSERT PHOTO FROM ALBUM MODAL */}
      {showPhotoPicker !== null && (
        <div className="fixed inset-0 z-[130] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-600" />
                <span>Chọn Ảnh Từ Album Studio Để Chèn Vào Bài Viết</span>
              </h4>
              <button onClick={() => setShowPhotoPicker(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                Đóng
              </button>
            </div>

            <PhotoAlbumManager
              photos={albumPhotos}
              onUpdatePhotos={onUpdateAlbumPhotos}
              onSelectPhotoUrl={(url) => handleInsertPhotoToBlock(showPhotoPicker, url)}
              compactMode={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
