import { useState, useEffect, useMemo } from 'react';
import { Language, ArticleCategory, Article } from '../types';
import { getAdminData } from '../data/adminStore';
import { translations } from '../data/translations';
import { EditableWrapper } from './EditableWrapper';
import { ArrowUpRight, Filter, ArrowUpDown, Clock, Sparkles, X } from 'lucide-react';

interface BlogSectionProps {
  lang: Language;
  onOpenArticle?: (slug: string) => void;
  isEditActive?: boolean;
  onEditField?: (fieldKey: string, fieldLabel: string, currentValue: string) => void;
  isSubpage?: boolean;
}

const CATEGORY_LIST: { id: 'all' | ArticleCategory; labelVi: string; labelEn: string }[] = [
  { id: 'all', labelVi: 'Tất Cả Bài Viết', labelEn: 'All Posts' },
  { id: 'livestream', labelVi: 'Livestream', labelEn: 'Livestream' },
  { id: 'lighting', labelVi: 'Ánh Sáng Studio', labelEn: 'Studio Lighting' },
  { id: 'audio', labelVi: 'Âm Thanh & Mic', labelEn: 'Audio & Mic' },
  { id: 'mc', labelVi: 'MC & Tự Tin', labelEn: 'MC & Stage' },
  { id: 'skills', labelVi: 'Kỹ Năng Mềm', labelEn: 'Soft Skills' },
  { id: 'kienthuc', labelVi: 'Kiến Thức Ngành', labelEn: 'Knowledge' },
  { id: 'setup', labelVi: 'Technical Setup', labelEn: 'Technical Setup' },
];

const getCategoryBadgeClass = (cat: ArticleCategory) => {
  const map: Record<ArticleCategory, string> = {
    livestream: 'bg-orange-50 text-orange-600 border-orange-200',
    lighting: 'bg-amber-50 text-amber-600 border-amber-200',
    audio: 'bg-sky-50 text-sky-600 border-sky-200',
    mc: 'bg-purple-50 text-purple-600 border-purple-200',
    skills: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    kienthuc: 'bg-blue-50 text-blue-600 border-blue-200',
    setup: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  };
  return map[cat] || 'bg-slate-100 text-slate-700 border-slate-200';
};

export function BlogSection({ lang, onOpenArticle, isEditActive = false, onEditField, isSubpage = false }: BlogSectionProps) {
  const [articlesRecord, setArticlesRecord] = useState<Record<string, Article>>(getAdminData().articles);
  const [selectedCategory, setSelectedCategory] = useState<'all' | ArticleCategory>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const t = translations[lang];
  const isVi = lang === 'vi';

  useEffect(() => {
    const handleUpdate = () => {
      setArticlesRecord(getAdminData().articles);
    };
    window.addEventListener('admin_data_updated', handleUpdate);
    return () => window.removeEventListener('admin_data_updated', handleUpdate);
  }, []);

  const triggerEdit = (key: string, label: string, currentVal: string) => {
    if (onEditField) onEditField(key, label, currentVal);
  };

  const rawArticles = useMemo(() => Object.values(articlesRecord) as Article[], [articlesRecord]);

  // Calculate Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: rawArticles.length };
    rawArticles.forEach((art) => {
      const cat = art.cat || 'kienthuc';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [rawArticles]);

  // Only categories that actually have at least 1 article (count > 0)
  const activeCategories = useMemo(() => {
    return CATEGORY_LIST.filter((cat) => {
      if (cat.id === 'all') return true;
      const count = categoryCounts[cat.id] || 0;
      return count > 0;
    });
  }, [categoryCounts]);

  // Filter & Sort Articles
  const filteredArticles = useMemo(() => {
    let result = [...rawArticles];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.cat === selectedCategory);
    }

    // Sort by Date (Newest vs Oldest)
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      const dateA = a.date || '2026.01.01';
      const dateB = b.date || '2026.01.01';
      if (sortOrder === 'newest') {
        return dateB.localeCompare(dateA);
      } else {
        return dateA.localeCompare(dateB);
      }
    });

    return result;
  }, [rawArticles, selectedCategory, sortOrder]);

  return (
    <section id="blog" className={`${isSubpage ? 'py-4 sm:py-6' : 'py-12 sm:py-16'} bg-slate-50 relative overflow-hidden border-b border-slate-200 font-sans`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="space-y-0.5">
            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Tiêu Đề Bài Viết"
              onEdit={() => triggerEdit('blogTitle', 'Tiêu Đề Bài Viết Kiến Thức', t.bl_title)}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {t.bl_title}
              </h2>
            </EditableWrapper>

            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Mô Tả Blog"
              onEdit={() => triggerEdit('blogSub', 'Mô Tả Blog', t.bl_sub2)}
            >
              <p className="text-slate-600 text-sm mt-1">
                {t.bl_sub2}
              </p>
            </EditableWrapper>
          </div>

          {/* Sort Order Selector */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs shrink-0 self-start md:self-auto">
            <span className="text-[11px] font-mono font-bold text-slate-500 pl-2 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span>Sắp xếp:</span>
            </span>

            <button aria-label="Action button" type="button"
              onClick={() => setSortOrder('newest')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                sortOrder === 'newest'
                  ? 'bg-slate-900 text-amber-400 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Mới Nhất</span>
            </button>

            <button aria-label="Action button" type="button"
              onClick={() => setSortOrder('oldest')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                sortOrder === 'oldest'
                  ? 'bg-slate-900 text-amber-400 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Cũ Nhất</span>
            </button>
          </div>
        </div>

        {/* Compact Category Theme Tabs (20% Smaller + Superscript Count) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-orange-600" />
              <span>CHỦ ĐỀ BÀI VIẾT HIỂN THỊ</span>
            </span>

            {selectedCategory !== 'all' && (
              <button aria-label="Action button" type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Xem Tất Cả</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {activeCategories.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isActive = selectedCategory === cat.id;

              return (
                <button aria-label="Action button" key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-0.5 border ${
                    isActive
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:bg-orange-50/40'
                  }`}
                >
                  <span>{isVi ? cat.labelVi : cat.labelEn}</span>
                  {/* Superscript Count Badge */}
                  <sup className={`font-mono text-[9px] font-black leading-none ml-0.5 ${
                    isActive ? 'text-amber-300' : 'text-orange-600'
                  }`}>
                    ({count})
                  </sup>
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {filteredArticles.map((a) => {
              const articleData = a[lang] || a.vi || a.en;
              const catBadgeClass = getCategoryBadgeClass(a.cat);
              const coverImg = articleData.coverImage || a.coverImage;

              return (
                <div
                  key={a.slug}
                  className="group rounded-2xl bg-white border border-slate-200 hover:border-orange-400 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-0.5"
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
                  {/* Slim Horizontal Banner Thumbnail Image (1/2 Height of 16:9 = aspect-[32/9]) */}
                  <div className="relative aspect-[32/9] sm:aspect-[3.2/1] w-full overflow-hidden bg-slate-950">
                    {coverImg ? (
                      <img loading="lazy" decoding="async" src={coverImg}
                        alt={articleData.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center p-3">
                        <span className="text-[10px] font-extrabold text-orange-400 tracking-wider uppercase font-mono">
                          XUÂN HIẾN MEDIA
                        </span>
                      </div>
                    )}

                    {/* Top Overlay Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase shadow-sm ${catBadgeClass}`}>
                        {(a.cat || 'BLOG').toUpperCase()}
                      </span>
                    </div>

                    {/* Top Overlay Date */}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-white font-mono text-[9px] font-bold border border-white/10">
                        {a.date}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-1.5">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                        {articleData.title}
                      </h3>
                      
                      <p className="text-xs text-slate-600 line-clamp-2 font-medium leading-relaxed">
                        {articleData.dek}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 font-semibold">{a.author || 'Xuân Hiển'} · {articleData.readTime}</span>
                      
                      <span className="text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex items-center gap-0.5 font-extrabold">
                        <span>{t.bl_read || 'Đọc Bài'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <Filter className="w-8 h-8 text-slate-300 mx-auto animate-bounce" />
            <h4 className="text-sm font-extrabold text-slate-800">Chưa có bài viết cho chủ đề này!</h4>
            <button aria-label="Action button" type="button"
              onClick={() => setSelectedCategory('all')}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer hover:bg-orange-500 transition-all inline-block"
            >
              Xem Tất Cả Bài Viết
            </button>
          </div>
        )}

      </div>
    </section>
  );
}




