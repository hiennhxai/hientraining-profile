import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getAdminData } from '../data/adminStore';
import { Mic, Award, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface HeroPortraitShowcaseProps {
  lang: Language;
}

export function HeroPortraitShowcase({ lang }: HeroPortraitShowcaseProps) {
  const [config, setConfig] = useState(getAdminData().general);
  const isVi = lang === 'vi';

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getAdminData().general);
    };
    window.addEventListener('admin_data_updated', handleUpdate);
    return () => window.removeEventListener('admin_data_updated', handleUpdate);
  }, []);

  const portraitUrl = config.heroPortraitUrl || "";
  const zoom = (config.heroPortraitZoom || 100) / 100;
  const offsetX = config.heroPortraitOffsetX || 0;
  const offsetY = config.heroPortraitOffsetY || 0;
  const flipX = config.heroPortraitFlipX !== false;

  const scaleXVal = (flipX ? -1 : 1) * zoom;

  return (
    <div className="relative w-full max-w-md mx-auto flex items-center justify-center p-2 group">
      {/* Background Soft Glow Spotlight Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/25 via-amber-500/15 to-transparent rounded-full blur-3xl scale-110 pointer-events-none group-hover:from-orange-500/35 group-hover:via-amber-500/25 transition-all duration-700" />
      <div className="absolute -bottom-10 inset-x-10 h-32 bg-orange-400/20 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/30 transition-all duration-700" />

      {/* Main Frameless Floating Portrait Container */}
      <div className="relative z-10 w-full aspect-[4/5] flex items-center justify-center overflow-visible">
        
        {/* Soft All-Edges Faded Image (All 4 sides softly fade into background, pops up on hover) */}
        <div className="relative w-full h-full transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-[1.04]">
          <Image src={portraitUrl || "https://xuanhien.com/og-image.jpg"}
            alt="MC Nguyễn Hồng Xuân Hiến — Personal Brand Portrait"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            style={{
              transform: `scaleX(${scaleXVal}) scaleY(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
              maskImage: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0) 96%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0) 96%)',
            }}
            className="object-cover object-top transition-transform duration-500 filter drop-shadow-[0_15px_25px_rgba(249,115,22,0.15)] group-hover:drop-shadow-[0_25px_35px_rgba(249,115,22,0.3)]"
          />
        </div>

        {/* Floating Badge 1: Top-Right (MC TRUYỀN HÌNH) - Shifted high and right to avoid covering face */}
        <div className="absolute -top-4 -right-4 sm:-top-2 sm:-right-8 z-30 bg-white/95 backdrop-blur-md border border-orange-200/90 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl flex items-center gap-2 sm:gap-2.5 animate-float-slow">
          <div className="p-1 sm:p-1.5 rounded-xl bg-orange-100 text-orange-600 font-bold">
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-mono font-extrabold text-orange-600 leading-none">
              {isVi ? 'MC TRUYỀN HÌNH' : 'TV PRESENTATION'}
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-slate-500 font-semibold mt-0.5 whitespace-nowrap">
              {isVi ? '10+ NĂM KINH NGHIỆM' : '10+ YEARS EXPERIENCE'}
            </div>
          </div>
        </div>

        {/* Floating Badge 2: Lower-Left (Á QUÂN TV FACE) - Shifted down and left to avoid covering body */}
        <div className="absolute bottom-16 -left-4 sm:bottom-28 sm:-left-8 z-30 bg-white/95 backdrop-blur-md border border-amber-200/90 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl flex items-center gap-2 sm:gap-2.5 animate-float-delayed">
          <div className="p-1 sm:p-1.5 rounded-xl bg-amber-100 text-amber-600 font-bold">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-mono font-extrabold text-amber-600 leading-none">
              {isVi ? 'Á QUÂN TV FACE' : 'RUNNER-UP TV FACE'}
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-slate-500 font-semibold mt-0.5 whitespace-nowrap">
              {isVi ? 'GƯƠNG MẶT TRUYỀN HÌNH' : 'NATIONAL TV HOST'}
            </div>
          </div>
        </div>

        {/* Floating Badge 3: Bottom Center (NGUYỄN HỒNG XUÂN HIẾN) */}
        <div className="absolute -bottom-3 sm:-bottom-2 z-30 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-xl transition-all duration-300 group-hover:translate-y-1 flex items-center gap-2 sm:gap-3">
          <div className="p-1 sm:p-1.5 rounded-xl bg-orange-600 text-white font-bold">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="text-[11px] sm:text-xs font-black text-white leading-none whitespace-nowrap">NGUYỄN HỒNG XUÂN HIẾN</div>
            <div className="text-[9px] sm:text-[10px] font-mono text-orange-400 font-bold uppercase mt-0.5 whitespace-nowrap">
              {isVi ? 'TRAINER & COACHING' : 'SPECIALIST TRAINER & COACHING'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


