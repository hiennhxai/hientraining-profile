import { useState, useEffect } from 'react';
import { Language, ArticleCategory, Article } from '../types';
import { getAdminData } from '../data/adminStore';
import { translations } from '../data/translations';
import { ArrowUpRight } from 'lucide-react';

interface BlogSectionProps {
  lang: Language;
  onOpenArticle: (slug: string) => void;
}

const getCategoryInfo = (cat: ArticleCategory, isVi: boolean) => {
  const map: Record<ArticleCategory, { cls: string; label: string }> = {
    livestream: { cls: 'bg-orange-50 text-orange-600 border-orange-200', label: 'LIVESTREAM' },
    lighting: { cls: 'bg-amber-50 text-amber-600 border-amber-200', label: isVi ? 'ÁNH SÁNG' : 'STUDIO LIGHTING' },
    audio: { cls: 'bg-sky-50 text-sky-600 border-sky-200', label: isVi ? 'ÂM THANH & MIC' : 'AUDIO & MIC' },
    mc: { cls: 'bg-purple-50 text-purple-600 border-purple-200', label: isVi ? 'MC & TỰ TIN' : 'MC & STAGE' },
    skills: { cls: 'bg-emerald-50 text-emerald-600 border-emerald-200', label: isVi ? 'KỸ NĂNG MỀM' : 'SOFT SKILLS' },
    kienthuc: { cls: 'bg-blue-50 text-blue-600 border-blue-200', label: isVi ? 'KIẾN THỨC' : 'KNOWLEDGE' },
    setup: { cls: 'bg-indigo-50 text-indigo-600 border-indigo-200', label: isVi ? 'SETUP' : 'TECHNICAL SETUP' },
  };
  return map[cat] || { cls: 'bg-orange-50 text-orange-600 border-orange-200', label: (cat || 'BLOG').toUpperCase() };
};

export function BlogSection({ lang, onOpenArticle }: BlogSectionProps) {
  const [articlesRecord, setArticlesRecord] = useState<Record<string, Article>>(getAdminData().articles);
  const t = translations[lang];

  useEffect(() => {
    const handleUpdate = () => {
      setArticlesRecord(getAdminData().articles);
    };
    window.addEventListener('admin_data_updated', handleUpdate);
    return () => window.removeEventListener('admin_data_updated', handleUpdate);
  }, []);

  const articleList = Object.values(articlesRecord) as Article[];

  return (
    <section id="blog" className="py-6 sm:py-8 bg-slate-50 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{t.bl_title}</h2>
          <p className="text-orange-600 font-semibold text-sm mt-1">{t.bl_sub2}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-10">
          {articleList.map((a) => {
            const articleData = a[lang] || a.vi || a.en;
            const isVi = lang === 'vi';
            const catInfo = getCategoryInfo(a.cat, isVi);

            return (
              <div
                key={a.slug}
                className="group p-7 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-xl"
                onClick={() => onOpenArticle(a.slug)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenArticle(a.slug);
                  }
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 font-mono text-xs">
                    <span className="text-slate-500 font-medium">{a.date}</span>
                    <span className={`px-3 py-1 rounded-lg border ${catInfo.cls} font-bold text-[11px]`}>
                      {catInfo.label}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors mb-3 leading-snug">
                    {articleData.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-5 font-medium leading-relaxed">
                    {articleData.dek}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-orange-600 font-bold">{a.author} · {articleData.readTime}</span>
                  <span className="text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex items-center gap-1 font-bold">
                    <span>{t.bl_read}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

