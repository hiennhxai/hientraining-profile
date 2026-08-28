import { useState, useEffect } from 'react';
import { Language } from '../types';
import { ArrowRight, PhoneCall, MessageSquare } from 'lucide-react';
import { getAdminData } from '../data/adminStore';
import { EditableWrapper } from './EditableWrapper';

interface SubPageBottomCtaProps {
  lang: Language;
  onNavigatePage: (page: string) => void;
  isEditActive?: boolean;
  onEditField?: (fieldKey: string, fieldLabel: string, currentValue: string) => void;
}

export function SubPageBottomCta({ lang, onNavigatePage, isEditActive = false, onEditField }: SubPageBottomCtaProps) {
  const isVi = lang === 'vi';
  const [gen, setGen] = useState(getAdminData().general);

  useEffect(() => {
    const handleUpdate = () => setGen(getAdminData().general);
    window.addEventListener('admin_data_updated', handleUpdate);
    window.addEventListener('supabase_realtime_update', handleUpdate);
    return () => {
      window.removeEventListener('admin_data_updated', handleUpdate);
      window.removeEventListener('supabase_realtime_update', handleUpdate);
    };
  }, []);

  const triggerEdit = (key: string, label: string, currentVal: string) => {
    if (onEditField) onEditField(key, label, currentVal);
  };

  return (
    <section className="py-6 sm:py-8 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          
          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Thẻ Tag CTA"
            onEdit={() => triggerEdit('ctaHeader', 'Thẻ Tag Khối CTA', gen.ctaHeader || 'BẮT ĐẦU HÀNH TRÌNH BỨT PHÁ CÙNG XUÂN HIẾN')}
          >
            <span className="text-xs font-mono font-bold text-orange-600 tracking-wider uppercase block">
              {gen.ctaHeader || (isVi ? 'BẮT ĐẦU HÀNH TRÌNH BỨT PHÁ CÙNG XUÂN HIẾN' : 'START YOUR BREAKTHROUGH JOURNEY WITH XUAN HIEN')}
            </span>
          </EditableWrapper>

          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Tiêu Đề CTA"
            onEdit={() => triggerEdit('ctaSubheader', 'Tiêu Đề Khối CTA', gen.ctaSubheader || 'Bạn cần thiết kế lộ trình đào tạo riêng?')}
          >
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {gen.ctaSubheader || (isVi ? 'Bạn cần thiết kế lộ trình đào tạo riêng?' : 'Need a custom training roadmap?')}
            </h3>
          </EditableWrapper>

          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Mô Tả CTA"
            onEdit={() => triggerEdit('ctaDescription', 'Mô Tả Khối CTA', gen.ctaDescription || 'Liên hệ trực tiếp với Xuân Hiến...')}
          >
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
              {gen.ctaDescription || (isVi 
                ? 'Liên hệ trực tiếp với Xuân Hiến qua Zalo/Hotline hoặc gửi thông tin để nhận buổi tư vấn 1-1 định hướng miễn phí.'
                : 'Contact Xuan Hien directly via Zalo/Hotline or submit your request to receive a complimentary 1-on-1 strategy session.')}
            </p>
          </EditableWrapper>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button aria-label="Action button" onClick={() => onNavigatePage('contact')}
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isVi ? 'Đăng Ký Tư Vấn Trực Tiếp' : 'Book Direct Consultation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${(gen.phoneHotline || '0813131385').replace(/\s+/g, '')}`}
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-200 hover:bg-white hover:text-orange-600 transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-orange-600" />
              <span>Hotline/Zalo: {gen.phoneHotline || '0813 13 13 85'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}



