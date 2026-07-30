import { useEffect, useRef } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Logo } from './Logo';
import { BrandMarquee } from './BrandMarquee';
import { CourseBannerCarousel } from './CourseBannerCarousel';
import { HeroPortraitShowcase } from './HeroPortraitShowcase';
import { Phone, Mail, Award, CheckCircle2, ChevronRight, Mic, Video, Sparkles, History, Users, Tv } from 'lucide-react';

interface HeroSectionProps {
  lang: Language;
  onNavigatePage?: (page: string) => void;
  onSelectCourse?: (course: any) => void;
}

export function HeroSection({ lang, onNavigatePage, onSelectCourse }: HeroSectionProps) {
  const t = translations[lang];
  const isVi = lang === 'vi';
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    let rafId: number;
    const FD = 600;

    const fadeIn = () => {
      const s = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - s) / FD, 1);
        vid.style.opacity = (progress * 0.35).toString();
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        }
      };
      rafId = requestAnimationFrame(step);
    };

    const fadeOut = (cb: () => void) => {
      const b = parseFloat(vid.style.opacity) || 0.35;
      const s = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - s) / FD, 1);
        vid.style.opacity = (b * (1 - p)).toString();
        if (p < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          cb();
        }
      };
      rafId = requestAnimationFrame(step);
    };

    const replay = () => {
      vid.style.opacity = '0';
      setTimeout(() => {
        vid.currentTime = 0;
        vid.play().catch(() => {});
        fadeIn();
      }, 120);
    };

    const handleCanPlay = () => fadeIn();
    const handleTimeUpdate = () => {
      const r = vid.duration - vid.currentTime;
      if (r <= FD / 1000 && parseFloat(vid.style.opacity) > 0.01) {
        cancelAnimationFrame(rafId);
        fadeOut(replay);
      }
    };
    const handleEnded = () => {
      cancelAnimationFrame(rafId);
      replay();
    };

    vid.addEventListener('canplay', handleCanPlay, { once: true });
    vid.addEventListener('timeupdate', handleTimeUpdate);
    vid.addEventListener('ended', handleEnded);

    vid.play().catch(() => {});

    return () => {
      cancelAnimationFrame(rafId);
      vid.removeEventListener('timeupdate', handleTimeUpdate);
      vid.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center pt-22 pb-8 sm:pb-10 overflow-hidden bg-gradient-to-b from-orange-50/40 via-amber-50/20 to-white">
      {/* Background Video with Subtle Brightness Control */}
      <video
        ref={videoRef}
        id="hero-video"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-25 z-0 mix-blend-multiply"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-1 pointer-events-none" />

      <div className="hero-in relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

          {/* Mobile-only Portrait (shown above text on small screens) */}
          <div className="lg:hidden flex justify-center -mb-2">
            <div className="w-56 sm:w-64">
              <HeroPortraitShowcase lang={lang} />
            </div>
          </div>
          
          <div className="lg:col-span-8">
            {/* Section Tag Badge */}
            <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 text-xs font-mono font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isVi ? 'ĐÀO TẠO KỸ NĂNG CÁ NHÂN HÓA 1 KÈM 1' : '1-ON-1 PERSONAL SKILL COACHING'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              <span className="block text-slate-900">{t.hero_h1a}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 mt-2 font-black">
                {t.hero_h1b}
              </span>
            </h1>

            {/* Badges / Key Roles */}
            <div className="flex flex-wrap items-center gap-2.5 mb-8 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-orange-200 shadow-2xs text-slate-800">
                <Mic className="w-4 h-4 text-orange-600" />
                <span>{isVi ? 'MC Truyền Hình (10+ Năm)' : 'TV Presenter (10+ Yrs)'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-amber-200 shadow-2xs text-slate-800">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{isVi ? 'Á quân TV Face 2017' : 'TV Face Runner-up 2017'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-red-200 shadow-2xs text-slate-800">
                <Video className="w-4 h-4 text-red-600" />
                <span>{isVi ? 'Producer Livestream Studio' : 'Livestream Studio Producer'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isVi ? 'Đào Tạo 1 kèm 1 Thực Chiến' : 'Practical 1-on-1 Coaching'}</span>
              </div>
            </div>

            {/* Subtitle & CTA buttons */}
            <div className="max-w-3xl">
              <p
                className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 font-normal"
                dangerouslySetInnerHTML={{ __html: t.hero_sub }}
              />

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button 
                  onClick={() => onNavigatePage ? onNavigatePage('courses') : window.location.href = '#courses'} 
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
                >
                  <span>{t.hero_btn1}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => onNavigatePage ? onNavigatePage('services') : window.location.href = '#services'} 
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-800 bg-white border border-slate-300 hover:border-orange-400 hover:text-orange-600 transition-all duration-200 flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>{t.hero_btn2}</span>
                </button>
              </div>

              {/* Direct Contact Info Box */}
              <div className="p-4 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm backdrop-blur-md inline-flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-600" />
                  <span className="text-slate-500">{isVi ? 'Tư vấn trực tiếp:' : 'Direct Hotline:'}</span>
                  <a href="tel:0813131385" className="font-mono font-bold text-slate-900 hover:text-orange-600 transition-colors">0813 13 13 85</a>
                </div>
                <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span className="text-slate-500">{isVi ? 'Email liên hệ:' : 'Email Inquiry:'}</span>
                  <a href="mailto:admin@xuanhien.info" className="font-mono font-bold text-slate-900 hover:text-orange-600 transition-colors">admin@xuanhien.info</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Brand Portrait Showcase (Frameless Faded Edge + Floating Hover) */}
          <div className="lg:col-span-4 hidden lg:block">
            <HeroPortraitShowcase lang={lang} />
          </div>

        </div>

        {/* Auto-scrolling Brand Marquee Bar right under Hotline 0813 13 13 85 */}
        <BrandMarquee lang={lang} />

        {/* Auto-sliding Course Banner Carousel (4s) */}
        <CourseBannerCarousel lang={lang} onSelectCourse={onSelectCourse} />
      </div>
    </section>
  );
}

