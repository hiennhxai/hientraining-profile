import { useState, useEffect } from 'react';
import { ServiceItem, Language } from '../types';
import { getAdminData } from '../data/adminStore';
import { translations } from '../data/translations';
import { ServiceGalleryModal } from './ServiceGalleryModal';
import { EditableWrapper } from './EditableWrapper';
import { Headphones, Video, Tv, Mic, Award, ArrowRight, ImageIcon, Sparkles } from 'lucide-react';

interface ServicesSectionProps {
  lang: Language;
  onOpenService?: (service: ServiceItem) => void;
  isEditActive?: boolean;
  onEditField?: (fieldKey: string, fieldLabel: string, currentValue: string) => void;
}

const iconMap: Record<string, any> = {
  Headphones,
  Video,
  Tv,
  Mic,
  Award,
};

export function ServicesSection({ lang, onOpenService, isEditActive = false, onEditField }: ServicesSectionProps) {
  const [services, setServices] = useState<ServiceItem[]>(getAdminData().services);
  const t = translations[lang];
  const isVi = lang === 'vi';

  useEffect(() => {
    const handleUpdate = () => {
      setServices(getAdminData().services);
    };
    window.addEventListener('admin_data_updated', handleUpdate);
    return () => window.removeEventListener('admin_data_updated', handleUpdate);
  }, []);

  const triggerEdit = (key: string, label: string, currentVal: string) => {
    if (onEditField) onEditField(key, label, currentVal);
  };

  return (
    <section id="services" className="py-6 sm:py-8 bg-white relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Tiêu Đề Dịch Vụ"
              onEdit={() => triggerEdit('servicesTitle', 'Tiêu Đề Các Dịch Vụ', t.sv_title)}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{t.sv_title}</h2>
            </EditableWrapper>

            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Thẻ Tag Dịch Vụ"
              onEdit={() => triggerEdit('servicesSub', 'Mô Tả Khối Dịch Vụ', t.sv_sub)}
            >
              <p className="text-orange-600 font-semibold text-sm mt-1">{t.sv_sub}</p>
            </EditableWrapper>
          </div>
          <span className="text-xs font-mono text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
            {isVi ? 'Nhấp vào Dịch vụ để xem Album hình ảnh thực tế 📷' : 'Click Service to view Showcase Gallery 📷'}
          </span>
        </div>

        {/* Services Showcase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((s, idx) => {
            const Icon = iconMap[s.iconName] || Headphones;
            const defaultServiceImgs = [
              "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
            ];
            const thumbUrl = s.thumbnailUrl || defaultServiceImgs[idx % defaultServiceImgs.length];

            return (
              <div 
                key={s.id || idx}
                onClick={() => onOpenService?.(s)}
                className="group rounded-2xl bg-white border border-slate-200 hover:border-orange-400 overflow-hidden transition-all duration-300 shadow-sm interactive-card flex flex-col justify-between cursor-pointer"
                role="button"
                tabIndex={0}
              >
                {/* 16:9 Landscape Service Thumbnail Banner */}
                <EditableWrapper
                  isEditActive={isEditActive}
                  type="image"
                  label={`Đổi Ảnh Dịch Vụ ${idx + 1}`}
                  onEdit={() => triggerEdit(`service_${s.id}_thumbnailUrl`, `URL Ảnh Thumbnail Dịch Vụ ${s.title}`, thumbUrl)}
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img 
                      src={thumbUrl} 
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-orange-600/90 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-md">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs text-white bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20 font-bold">
                        SVC.0{idx + 1}
                      </span>
                    </div>
                  </div>
                </EditableWrapper>
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-[11px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                  <span>{isVi ? 'Xem Album Ảnh Thực Tế 📷' : 'View Showcase Gallery 📷'}</span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold text-slate-500 line-clamp-1">{s.tags}</span>
                    <span className="text-orange-600 group-hover:translate-x-1 transition-transform p-1 shrink-0 font-bold text-xs flex items-center gap-1">
                      <span>{isVi ? 'Xem Album' : 'Gallery'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
