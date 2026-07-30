import { useEffect } from 'react';
import { Language, ArticleCategory } from '../types';
import { translations } from '../data/translations';
import { getAdminData } from '../data/adminStore';

interface ArticleReaderModalProps {
  slug: string | null;
  lang: Language;
  onClose: () => void;
}

const getCategoryInfo = (cat: ArticleCategory, isVi: boolean) => {
  const map: Record<ArticleCategory, { cls: string; label: string }> = {
    livestream: { cls: 'bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold', label: 'LIVESTREAM' },
    lighting: { cls: 'bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold', label: isVi ? 'ÁNH SÁNG' : 'STUDIO LIGHTING' },
    audio: { cls: 'bg-sky-50 text-sky-600 border border-sky-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold', label: isVi ? 'ÂM THANH & MIC' : 'AUDIO & MIC' },
    mc: { cls: 'bg-purple-50 text-purple-600 border border-purple-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold', label: isVi ? 'MC & TỰ TIN' : 'MC & STAGE' },
    skills: { cls: 'bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold', label: isVi ? 'KỸ NĂNG MỀM' : 'SOFT SKILLS' },
    kienthuc: { cls: 'bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold', label: isVi ? 'KIẾN THỨC' : 'KNOWLEDGE' },
    setup: { cls: 'bg-indigo-50 text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold', label: isVi ? 'SETUP' : 'TECHNICAL SETUP' },
  };
  return map[cat];
};

export function ArticleReaderModal({ slug, lang, onClose }: ArticleReaderModalProps) {
  const t = translations[lang];

  useEffect(() => {
    if (slug) {
      document.body.classList.add('reader-lock');
    } else {
      document.body.classList.remove('reader-lock');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && slug) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('reader-lock');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [slug, onClose]);

  if (!slug) return null;

  const adminData = getAdminData();
  const article = adminData.articles[slug];
  if (!article) return null;

  const isVi = lang === 'vi';
  const d = article[lang] || article.vi || article.en;
  const catInfo = getCategoryInfo(article.cat, isVi);

  return (
    <div
      className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      id="reader"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'reader') {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative animate-scaleUp text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="reader-bar bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <button
            className="text-orange-400 hover:text-orange-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            onClick={onClose}
            aria-label="Close article"
          >
            <span className="text-base font-bold">←</span>
            <span>{t.reader_back || 'Đóng Bài Viết'}</span>
          </button>
          <span className="reader-progress font-mono text-xs font-bold text-slate-400">XUÂN HIẾN MEDIA / KẾT NỐI KIẾN THỨC</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Article Body Content */}
        <div className="reader-panel overflow-y-auto p-6 sm:p-10 space-y-6">
          <div className="reader-meta flex flex-wrap items-center gap-3 mb-4">
            <span className={catInfo ? catInfo.cls : 'text-orange-600 font-mono text-xs font-bold'}>{catInfo ? catInfo.label : (article.cat || 'BLOG').toUpperCase()}</span>
            <span className="text-slate-500 font-mono text-xs font-medium">{article.date}</span>
            <span className="text-slate-500 font-mono text-xs font-medium">· {d.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">{d.title}</h1>
          <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed font-medium">{d.dek}</p>

          {d.context && (
            <div
              className="reader-context bg-orange-50/70 border border-orange-200 rounded-xl p-4 text-slate-800 font-medium text-sm mb-8"
              data-label={t.reader_context_label}
              dangerouslySetInnerHTML={{ __html: d.context }}
            />
          )}

          <div className="reader-body space-y-6 text-slate-700 leading-relaxed font-normal text-base">
            {d.body.map((block, idx) => {
              if (block.t === 'p') {
                return <div key={idx} className="text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: block.c }} />;
              }
              if (block.t === 'h') {
                return (
                  <h3 key={idx} className="text-xl font-extrabold text-slate-900 mt-8 mb-3">
                    {block.sn && <span className="block text-xs font-mono font-bold text-orange-600 uppercase mb-1">{block.sn}</span>}
                    <span dangerouslySetInnerHTML={{ __html: block.c }} />
                  </h3>
                );
              }
              if (block.t === 'quote') {
                return <div key={idx} className="border-l-4 border-orange-500 pl-4 py-2 my-6 text-slate-900 font-semibold italic bg-orange-50/40 rounded-r-lg" dangerouslySetInnerHTML={{ __html: block.c }} />;
              }
              if (block.t === 'stat') {
                return (
                  <div key={idx} className="grid grid-cols-2 gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200 my-6">
                    {block.items.map((item, iIdx) => (
                      <div key={iIdx}>
                        <div className="text-3xl font-black text-orange-600 font-mono">{item.v}</div>
                        <div className="text-xs font-mono text-slate-600 uppercase font-semibold mt-1">{item.l}</div>
                      </div>
                    ))}
                  </div>
                );
              }
              if (block.t === 'list') {
                return (
                  <ul key={idx} className="space-y-2 my-4 pl-4 list-disc text-slate-700 font-medium">
                    {block.items.map((item, lIdx) => (
                      <li key={lIdx} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                );
              }
              if (block.t === 'img') {
                return (
                  <figure key={idx} className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 text-white">
                    <img src={block.url} alt={block.caption || 'Hình ảnh minh họa'} className="w-full h-auto max-h-[520px] object-cover" />
                    {block.caption && (
                      <figcaption className="p-3 bg-slate-900/90 text-center font-mono text-xs text-slate-300 border-t border-slate-800">
                        📷 {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              return null;
            })}
          </div>

          <div className="reader-cta mt-12 p-6 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-800 text-sm font-semibold">{t.reader_cta}</p>
            <a href="tel:0813131385" className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-700 transition-colors shadow-sm">
              {t.ct_b1}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
