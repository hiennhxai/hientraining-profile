import React, { useState, useEffect } from 'react';
import { getAdminData } from '../data/adminStore';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  variant?: 'default' | 'full' | 'iconOnly';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "h-9", 
  showText = true, 
  textColor = "text-slate-900",
}) => {
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

  const customLogoUrl = gen?.logoImageUrl;
  const brandName = gen?.brandName || 'XUÂN HIẾN';
  const subBrandName = gen?.subBrandName || 'MEDIA & TRAINING';

  // If a custom image logo URL is provided, display the image logo directly
  if (customLogoUrl) {
    return (
      <div className={`inline-flex items-center gap-3 shrink-0 ${className}`}>
        <div className="flex items-center justify-center h-full w-auto max-h-12 overflow-hidden">
          <img 
            src={customLogoUrl} 
            alt={brandName}
            className="object-contain object-center max-h-12 w-auto mx-auto my-auto block"
          />
        </div>
        {showText && (
          <div className="flex flex-col leading-none">
            <span className={`font-black tracking-wider text-base sm:text-lg uppercase ${textColor}`}>
              {brandName}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-orange-600 font-bold uppercase mt-0.5">
              {subBrandName}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 shrink-0 ${className}`}>
      {/* Precision Vector Emblem matching original logo */}
      <svg 
        viewBox="0 0 950 620" 
        className="h-full w-auto aspect-[95/62] shrink-0"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo Emblem"
      >
        <defs>
          <linearGradient id="xhRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF3826" />
            <stop offset="100%" stopColor="#D31010" />
          </linearGradient>
          <linearGradient id="xhOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F35A25" />
            <stop offset="100%" stopColor="#E64A19" />
          </linearGradient>
          <linearGradient id="xhCenterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7801E" />
            <stop offset="100%" stopColor="#E66700" />
          </linearGradient>
          <linearGradient id="xhAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9A01B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        <rect x="0" y="450" width="135" height="135" fill="url(#xhRedGrad)" rx="6" />
        <path d="M 0 90 H 135 V 270 H 315 V 585 H 180 V 405 H 135 V 405 H 0 Z" fill="url(#xhOrangeGrad)" />
        <rect x="360" y="90" width="135" height="315" fill="url(#xhCenterGrad)" rx="6" />
        <rect x="540" y="90" width="270" height="135" fill="url(#xhAmberGrad)" rx="6" />
        <rect x="540" y="270" width="270" height="135" fill="url(#xhAmberGrad)" rx="6" />
        <rect x="360" y="450" width="450" height="135" fill="url(#xhAmberGrad)" rx="6" />
        <circle cx="865" cy="65" r="32" stroke="url(#xhAmberGrad)" strokeWidth="10" fill="none" />
        <text 
          x="865" 
          y="77" 
          textAnchor="middle" 
          fill="#F59E0B" 
          fontSize="36" 
          fontWeight="800"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          R
        </text>
      </svg>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-wider text-base sm:text-lg uppercase ${textColor}`}>
            {brandName}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-orange-600 font-bold uppercase mt-0.5">
            {subBrandName}
          </span>
        </div>
      )}
    </div>
  );
};
