import { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { projectCategoriesData, ProjectCategory, ProjectCardItem } from '../data/projects';
import { getAdminData } from '../data/adminStore';
import { EditableWrapper } from './EditableWrapper';
import { ExternalLink, Sparkles, TrendingUp, ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductsSectionProps {
  lang: Language;
  isEditActive?: boolean;
  onEditField?: (fieldKey: string, fieldLabel: string, currentValue: string) => void;
}

export function ProductsSection({ lang, isEditActive = false, onEditField }: ProductsSectionProps) {
  const t = translations[lang];
  const isVi = lang === 'vi';
  
  const [categories, setCategories] = useState<ProjectCategory[]>(() => {
    const adminData = getAdminData();
    return adminData.projects && adminData.projects.length > 0 ? adminData.projects : projectCategoriesData;
  });

  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || 'tiktok-channels');

  // Lightbox State
  const [activeLightbox, setActiveLightbox] = useState<{ title: string; photos: string[]; currentIdx: number } | null>(null);

  useEffect(() => {
    const syncData = () => {
      const adminData = getAdminData();
      if (adminData.projects && adminData.projects.length > 0) {
        setCategories(adminData.projects);
      }
    };
    syncData();
    window.addEventListener('admin_data_updated', syncData);
    window.addEventListener('supabase_realtime_update', syncData);
    return () => {
      window.removeEventListener('admin_data_updated', syncData);
      window.removeEventListener('supabase_realtime_update', syncData);
    };
  }, []);

  const triggerEdit = (key: string, label: string, currentVal: string) => {
    if (onEditField) onEditField(key, label, currentVal);
  };

  const activeCategory = categories.find(c => c.id === activeTab) || categories[0] || projectCategoriesData[0];

  const handleOpenLightbox = (item: ProjectCardItem) => {
    const photos: string[] = [];
    if (item.thumbnailUrl) photos.push(item.thumbnailUrl);
    if (item.galleryPhotos && item.galleryPhotos.length > 0) {
      item.galleryPhotos.forEach(p => {
        if (!photos.includes(p)) photos.push(p);
      });
    }
    if (photos.length > 0) {
      setActiveLightbox({ title: item.title, photos, currentIdx: 0 });
    }
  };

  return (
    <section id="projects" className="py-8 sm:py-12 bg-slate-50 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Tiêu Đề Dự Án"
            onEdit={() => triggerEdit('projectsTitle', 'Tiêu Đề Các Dự Án', t.pd_title)}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{t.pd_title}</h2>
          </EditableWrapper>

          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Thẻ Tag Dự Án"
            onEdit={() => triggerEdit('projectsSub', 'Mô Tả Khối Dự Án', t.pd_sub)}
          >
            <p className="text-orange-600 font-semibold text-sm mt-1">{t.pd_sub}</p>
          </EditableWrapper>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-200 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                activeTab === cat.id
                  ? 'bg-orange-600 text-white shadow-md scale-102'
                  : 'bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200'
              }`}
            >
              <span>{cat.title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${activeTab === cat.id ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {cat.items?.length || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Category Description Header */}
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 mb-8 flex items-center gap-3 shadow-xs">
          <Sparkles className="w-5 h-5 text-orange-600 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {activeCategory.description}
          </p>
        </div>

        {/* Items Grid — 3 Columns on Large Screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {activeCategory.items.map((item) => {
            const hasPhotos = (item.galleryPhotos && item.galleryPhotos.length > 0) || item.thumbnailUrl;
            const photoCount = (item.galleryPhotos?.length || 0) + (item.thumbnailUrl ? 1 : 0);

            return (
              <div 
                key={item.id}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* 16:9 Thumbnail Image with Hover Gallery Click */}
                  {item.thumbnailUrl && (
                    <div 
                      onClick={() => handleOpenLightbox(item)}
                      className="relative aspect-video w-full rounded-xl bg-slate-900 overflow-hidden border border-slate-200 cursor-pointer group/thumb"
                    >
                      <img 
                        src={item.thumbnailUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                        <ImageIcon className="w-4 h-4 text-orange-400" />
                        <span>Xem Pop-up Album Ảnh ({photoCount})</span>
                      </div>
                    </div>
                  )}

                  {/* Header Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                      {item.role || 'DỰ ÁN'}
                    </span>
                    {item.stats && (
                      <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{item.stats}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tg, idx) => (
                        <span key={idx} className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold">
                  {hasPhotos && (
                    <button
                      type="button"
                      onClick={() => handleOpenLightbox(item)}
                      className="text-slate-700 hover:text-orange-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-orange-600" />
                      <span>Album Ảnh ({photoCount})</span>
                    </button>
                  )}

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 flex items-center gap-1 ml-auto transition-colors"
                    >
                      <span>{isVi ? 'Truy cập video' : 'Watch Video'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Footer Note */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-xs font-mono font-bold text-slate-600 shadow-2xs">
          <span>{isVi ? '✦ Đã hoàn thành 150+ dự án livestream & sản xuất video truyền thông đa lĩnh vực' : '✦ Completed 150+ livestream & media video production projects across various industries'}</span>
        </div>
      </div>

      {/* PROJECT GALLERY LIGHTBOX MODAL */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-orange-500" />
                  <span>{activeLightbox.title}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Hình ảnh {activeLightbox.currentIdx + 1} / {activeLightbox.photos.length}
                </p>
              </div>
              <button
                onClick={() => setActiveLightbox(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[450px] p-4">
              <img
                src={activeLightbox.photos[activeLightbox.currentIdx]}
                alt={`Photo ${activeLightbox.currentIdx + 1}`}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl"
              />

              {activeLightbox.photos.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveLightbox({
                      ...activeLightbox,
                      currentIdx: (activeLightbox.currentIdx - 1 + activeLightbox.photos.length) % activeLightbox.photos.length
                    })}
                    className="absolute left-4 p-3 rounded-full bg-slate-900/80 hover:bg-orange-600 text-white transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setActiveLightbox({
                      ...activeLightbox,
                      currentIdx: (activeLightbox.currentIdx + 1) % activeLightbox.photos.length
                    })}
                    className="absolute right-4 p-3 rounded-full bg-slate-900/80 hover:bg-orange-600 text-white transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnails Navigation */}
            {activeLightbox.photos.length > 1 && (
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-2 overflow-x-auto">
                {activeLightbox.photos.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveLightbox({ ...activeLightbox, currentIdx: idx })}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeLightbox.currentIdx === idx ? 'border-orange-500 scale-105 shadow-md' : 'border-slate-800 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
