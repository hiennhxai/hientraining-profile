import { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { projectCategoriesData } from '../data/projects';
import { ExternalLink, Sparkles, TrendingUp } from 'lucide-react';

interface ProductsSectionProps {
  lang: Language;
}

export function ProductsSection({ lang }: ProductsSectionProps) {
  const t = translations[lang];
  const isVi = lang === 'vi';
  const [activeTab, setActiveTab] = useState<string>(projectCategoriesData[0].id);

  const activeCategory = projectCategoriesData.find(c => c.id === activeTab) || projectCategoriesData[0];

  return (
    <section id="projects" className="py-6 sm:py-8 bg-slate-50 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{t.pd_title}</h2>
          <p className="text-orange-600 font-semibold text-sm mt-1">{t.pd_sub}</p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-200 pb-4">
          {projectCategoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200'
              }`}
            >
              {isVi ? cat.title : (
                cat.id === 'tiktok-channels' ? 'TIKTOK CREATOR CHANNELS' :
                cat.id === 'livestream-sales' ? 'BRAND LIVESTREAM SALES' :
                cat.id === 'tv-events' ? 'TV SHOWS & VIRTUAL EVENTS' :
                'BRAND VIDEOS & F&B'
              )}
            </button>
          ))}
        </div>

        {/* Category Description Header */}
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 mb-8 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-orange-600 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            {activeCategory.description}
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {activeCategory.items.map((item) => (
            <div 
              key={item.id}
              className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                    {item.role || 'PROJECT'}
                  </span>
                  {item.stats && (
                    <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{item.stats}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed font-normal">
                  {item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.map((tg, idx) => (
                      <span key={idx} className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                        {tg}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <span>{isVi ? 'Truy cập kênh / Video' : 'Visit Channel / Watch Video'}</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Section Footer Note */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-xs font-mono font-bold text-slate-600 shadow-2xs">
          <span>{isVi ? '✦ Đã hoàn thành 150+ dự án livestream & sản xuất video truyền thông đa lĩnh vực' : '✦ Completed 150+ livestream & media video production projects across various industries'}</span>
        </div>
      </div>
    </section>
  );
}
