import { useState, useEffect } from 'react';
import { Language, SocialLinkItem } from '../types';
import { getAdminData } from '../data/adminStore';
import { translations } from '../data/translations';
import { Logo } from './Logo';
import { 
  Settings, MessageCircle, Share2, MapPin, Video, Youtube, 
  AtSign, Send, PhoneCall, Gamepad2, Globe, Plus, Link2, ExternalLink
} from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigatePage?: (page: string) => void;
  onOpenAdminLogin?: () => void;
}

const ICON_MAP: Record<string, any> = {
  MessageCircle,
  Share2,
  Video,
  Youtube,
  Send,
  PhoneCall,
  Gamepad2,
  AtSign,
  Globe,
  Link2,
};

function getSocialBrandStyles(platform: string, iconName?: string) {
  const p = (platform + ' ' + (iconName || '')).toLowerCase();
  
  if (p.includes('zalo')) {
    return {
      bg: 'bg-blue-50/90 text-blue-700 border-blue-200/80 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-2xs',
      iconColor: 'text-blue-600 group-hover:text-white'
    };
  }
  if (p.includes('facebook') || p.includes('fb')) {
    return {
      bg: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/80 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-2xs',
      iconColor: 'text-indigo-600 group-hover:text-white'
    };
  }
  if (p.includes('tiktok')) {
    return {
      bg: 'bg-slate-900 text-white border-slate-900 hover:bg-black hover:border-black shadow-2xs',
      iconColor: 'text-cyan-400 group-hover:text-white'
    };
  }
  if (p.includes('youtube') || p.includes('yt')) {
    return {
      bg: 'bg-red-50/90 text-red-700 border-red-200/80 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-2xs',
      iconColor: 'text-red-600 group-hover:text-white'
    };
  }
  if (p.includes('telegram') || p.includes('tele')) {
    return {
      bg: 'bg-sky-50/90 text-sky-700 border-sky-200/80 hover:bg-sky-500 hover:text-white hover:border-sky-500 shadow-2xs',
      iconColor: 'text-sky-500 group-hover:text-white'
    };
  }
  if (p.includes('whatsapp') || p.includes('wa')) {
    return {
      bg: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-2xs',
      iconColor: 'text-emerald-600 group-hover:text-white'
    };
  }
  if (p.includes('discord')) {
    return {
      bg: 'bg-violet-50/90 text-violet-700 border-violet-200/80 hover:bg-violet-600 hover:text-white hover:border-violet-600 shadow-2xs',
      iconColor: 'text-violet-600 group-hover:text-white'
    };
  }
  if (p.includes('x.com') || p.includes('twitter') || iconName === 'X') {
    return {
      bg: 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-950 hover:text-white hover:border-slate-950 shadow-2xs',
      iconColor: 'text-slate-900 group-hover:text-white'
    };
  }
  if (p.includes('threads') || p.includes('instagram') || p.includes('insta')) {
    return {
      bg: 'bg-amber-50/90 text-amber-800 border-amber-200/80 hover:bg-amber-600 hover:text-white hover:border-amber-600 shadow-2xs',
      iconColor: 'text-amber-600 group-hover:text-white'
    };
  }
  
  return {
    bg: 'bg-white text-slate-700 border-slate-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 shadow-2xs',
    iconColor: 'text-slate-600 group-hover:text-white'
  };
}

export function Footer({ lang, onNavigatePage, onOpenAdminLogin }: FooterProps) {
  const t = translations[lang];
  const isVi = lang === 'vi';

  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(getAdminData().socialLinks || []);
  const [gen, setGen] = useState(getAdminData().general);

  useEffect(() => {
    const handleUpdate = () => {
      setSocialLinks(getAdminData().socialLinks || []);
      setGen(getAdminData().general);
    };
    window.addEventListener('admin_data_updated', handleUpdate);
    window.addEventListener('supabase_realtime_update', handleUpdate);
    return () => {
      window.removeEventListener('admin_data_updated', handleUpdate);
      window.removeEventListener('supabase_realtime_update', handleUpdate);
    };
  }, []);

  const handleNav = (page: string) => {
    if (onNavigatePage) {
      onNavigatePage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-50/80 py-7 text-xs text-slate-600 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Main 3 Equal Balanced Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 items-start">
          
          {/* COLUMN 1: Brand & Owner Info (Left Column) */}
          <div className="space-y-2.5">
            <Logo className="h-8" showText={true} textColor="text-slate-900" />
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              {gen.footerDesc || (isVi 
                ? 'Đào tạo kỹ năng cá nhân 1 kèm 1 thực chiến, kỹ thuật ánh sáng, âm thanh & sản xuất Livestream Studio chuyên nghiệp.'
                : '1-on-1 practical skill coaching, studio lighting, sound setup & professional Livestream production.')}
            </p>
            <div className="pt-1 text-slate-700 text-xs font-mono space-y-1">
              <div><strong className="text-slate-900">{isVi ? 'Chủ sở hữu:' : 'Owner:'}</strong> NGUYỄN HỒNG XUÂN HIẾN</div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>TP. Hồ Chí Minh (Offline 1-1 & Online Live)</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Colorful 3-Column Social Media Grid (Center Column) */}
          <div className="space-y-2.5">
            <h4 className="font-mono font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center justify-between">
              <span>{isVi ? 'Kênh Mạng Xã Hội & Truyền Thông' : 'Social Media Platforms'}</span>
              <span className="text-[10px] text-slate-400 font-normal">({socialLinks.length})</span>
            </h4>

            {/* Compact 3-Column Brand-Colored Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              {socialLinks.map((item) => {
                const IconComponent = (item.iconName && ICON_MAP[item.iconName]) || Globe;
                const isX = item.iconName === 'X' || item.platform.toLowerCase().includes('x.com');
                const brandStyle = getSocialBrandStyles(item.platform, item.iconName);

                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${item.label} — ${item.url}`}
                    className={`inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border font-mono font-bold transition-all text-[11px] group cursor-pointer ${brandStyle.bg}`}
                  >
                    {isX ? (
                      <span className="font-extrabold text-[12px] leading-none shrink-0">𝕏</span>
                    ) : (
                      <IconComponent className={`w-3.5 h-3.5 shrink-0 transition-colors ${brandStyle.iconColor}`} />
                    )}
                    <span className="truncate">{item.label || item.platform}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* COLUMN 3: Balanced 2-Subcolumn Site Navigation (Right Column) */}
          <div className="space-y-2.5 md:pl-4">
            <h4 className="font-mono font-bold text-slate-900 uppercase tracking-wider text-xs">
              {isVi ? 'Danh Mục Trang Web' : 'Site Navigation'}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-xs font-semibold text-slate-700">
              <div className="space-y-1.5">
                <button onClick={() => handleNav('home')} className="block hover:text-orange-600 transition-colors cursor-pointer text-left">
                  › {isVi ? 'Trang chủ' : 'Home'}
                </button>
                <button onClick={() => handleNav('about')} className="block hover:text-orange-600 transition-colors cursor-pointer text-left">
                  › {t.nav_about}
                </button>
                <button onClick={() => handleNav('courses')} className="block hover:text-orange-600 transition-colors cursor-pointer text-left">
                  › {t.nav_courses}
                </button>
                <button onClick={() => handleNav('services')} className="block hover:text-orange-600 transition-colors cursor-pointer text-left">
                  › {t.nav_services}
                </button>
              </div>

              <div className="space-y-1.5">
                <button onClick={() => handleNav('projects')} className="block hover:text-orange-600 transition-colors cursor-pointer text-left">
                  › {t.nav_projects}
                </button>
                <button onClick={() => handleNav('blog')} className="block hover:text-orange-600 transition-colors cursor-pointer text-left">
                  › {t.nav_blog}
                </button>
                <button onClick={() => handleNav('contact')} className="block hover:text-orange-600 transition-colors cursor-pointer text-left">
                  › {t.nav_contact}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Rights & Dimmed Subtle Admin Entry */}
        <div className="pt-3.5 border-t border-slate-200/80 text-[11px] font-mono text-slate-500 flex items-center justify-between gap-3 flex-wrap">
          <div>
            {gen.footerCopyright || `© 2026 ${gen.brandName || 'Xuân Hiến'} ${gen.subBrandName || 'Media & Training'}. All rights reserved.`}
          </div>
          {onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="text-slate-400 hover:text-slate-600 opacity-50 hover:opacity-100 transition-all flex items-center gap-1 cursor-pointer font-medium text-[10px]"
              title="Truy cập giao diện Quản trị"
            >
              <Settings className="w-3 h-3" />
              <span>{isVi ? 'Quản Trị Viên' : 'Admin Portal'}</span>
            </button>
          )}
        </div>

      </div>
    </footer>
  );
}
