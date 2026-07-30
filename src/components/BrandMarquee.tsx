import React, { useState, useEffect } from 'react';
import { Language, BrandLogoItem } from '../types';
import { getAdminData } from '../data/adminStore';

interface BrandMarqueeProps {
  lang: Language;
}

export function BrandMarquee({ lang }: BrandMarqueeProps) {
  const [adminData, setAdminData] = useState(getAdminData());
  const isVi = lang === 'vi';

  useEffect(() => {
    const handleUpdate = () => {
      setAdminData(getAdminData());
    };
    window.addEventListener('admin_data_updated', handleUpdate);
    return () => window.removeEventListener('admin_data_updated', handleUpdate);
  }, []);

  const brandLogos: BrandLogoItem[] = adminData.brandLogos || [];
  const speedSeconds = adminData.general.marqueeDuration || 55;

  if (!brandLogos || brandLogos.length === 0) return null;

  // Duplicate for seamless infinite loop
  const doubleLogos = [...brandLogos, ...brandLogos];

  return (
    <div className="w-full bg-white py-5 border-y border-slate-200 relative overflow-hidden my-6 group/marquee">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50/60 via-white to-amber-50/40 pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-widest text-[10px] sm:text-[11px]">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>{isVi ? 'ĐÃ HỢP TÁC & ĐỒNG HÀNH CÙNG CÁC THƯƠNG HIỆU & ĐÀI TRUYỀN HÌNH' : 'TRUSTED BY LEADING BRANDS & MEDIA HOUSES'}</span>
        </div>
        <span className="text-slate-400 text-[10px] hidden sm:block">
          {isVi ? 'Rê chuột để tạm dừng ◄—►' : 'Hover to pause ◄—►'}
        </span>
      </div>

      {/* Left/Right fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Scrolling track */}
      <div className="overflow-hidden">
        <div
          className="animate-marquee-reverse inline-flex items-stretch gap-1.5 px-2 group-hover/marquee:[animation-play-state:paused]"
          style={{ animationDuration: `${speedSeconds}s` }}
        >
          {doubleLogos.map((brand, idx) => (
            <div key={`${brand.id}-${idx}`} className="inline-flex">
              <BrandCard brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandCard({ brand }: { brand: BrandLogoItem }) {
  return (
    <div
      className="inline-flex flex-col items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group/card shrink-0 w-[155px]"
      title={`${brand.name} — ${brand.category}`}
    >
      {/* Logo Image Area — fixed height 48px, always centered */}
      <div className="h-12 w-full flex items-center justify-center p-1 overflow-hidden shrink-0">
        {brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="max-h-full max-w-full object-contain object-center group-hover/card:scale-105 transition-transform duration-300 mx-auto my-auto block"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${brand.color || 'from-orange-500 to-amber-600'} flex items-center justify-center text-white text-base font-bold shadow-sm group-hover/card:scale-105 transition-transform duration-300`}
          >
            {brand.icon || '✦'}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-slate-100" />

      {/* Brand info — always visible */}
      <div className="w-full text-center space-y-0.5">
        <p
          className="text-[11px] font-extrabold text-slate-800 group-hover/card:text-orange-600 transition-colors leading-tight truncate w-full"
          title={brand.name}
        >
          {brand.name}
        </p>
        <p
          className="text-[9px] font-semibold text-orange-500 uppercase tracking-wide leading-tight truncate w-full"
          title={brand.category}
        >
          {brand.category}
        </p>
      </div>
    </div>
  );
}
