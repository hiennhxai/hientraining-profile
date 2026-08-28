import React, { useState, useEffect } from 'react';
import { Language, CourseItem } from '../types';
import { getAdminData } from '../data/adminStore';
import { ChevronLeft, ChevronRight, Mic, Clock, ArrowRight, Radio } from 'lucide-react';
import Image from 'next/image';

interface CourseBannerCarouselProps {
  lang: Language;
  onSelectCourse?: (course: CourseItem) => void;
}

export function CourseBannerCarousel({ lang, onSelectCourse }: CourseBannerCarouselProps) {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const isVi = lang === 'vi';

  // Sync courses data from admin store
  useEffect(() => {
    const loadData = () => {
      const data = getAdminData().courses;
      setCourses(data);
    };
    loadData();
    window.addEventListener('admin_data_updated', loadData);
    return () => window.removeEventListener('admin_data_updated', loadData);
  }, []);

  // Auto slide every 4 seconds unless paused
  useEffect(() => {
    if (courses.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % courses.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [courses.length, isPaused]);

  if (courses.length === 0) return null;

  const currentCourse = courses[currentIndex];
  const activeBannerImg = currentCourse.bannerImage || currentCourse.bgImage;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % courses.length);
  };

  const handleBannerClick = () => {
    if (onSelectCourse) {
      onSelectCourse(currentCourse);
    }
  };

  return (
    <div className="w-full my-2 sm:my-3 relative">

      {/* Main Fixed Height & Fixed Ratio Banner Card */}
      <div 
        onClick={handleBannerClick}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative group cursor-pointer overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-10 transition-all duration-300 hover:border-orange-500/50 min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex flex-col justify-between"
      >
        {/* Custom Image Banner Render if provided */}
        {activeBannerImg ? (
          <>
            <Image src={activeBannerImg} 
              alt={currentCourse.title || "Course Banner"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover z-0 transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark Gradient Overlay for Maximum Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 z-1 pointer-events-none" />
          </>
        ) : (
          /* Fallback Ambient Lighting for text-only banner */
          <>
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-orange-600/20 via-amber-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        {/* Top Badges Row */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{currentCourse.code} • {currentCourse.badge}</span>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
            {isVi ? 'ĐÀO TẠO 1-1 THỰC CHIẾN' : 'PRACTICAL 1-ON-1 COACHING'}
          </div>
        </div>

        {/* Course Sub-header & Title */}
        <div className="relative z-10 max-w-3xl my-auto">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2 drop-shadow-sm">
            <Mic className="w-4 h-4 text-emerald-400" />
            <span>MC XUÂN HIẾN MEDIA & TRAINING — SPECIALIST COACHING</span>
          </div>

          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3 group-hover:text-orange-400 transition-colors drop-shadow-md">
            {currentCourse.title}
          </h3>

          <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mb-6 drop-shadow-sm">
            {currentCourse.subtitle}
          </p>

          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-300 font-mono text-xs sm:text-sm font-medium">
              <Clock className="w-4 h-4 text-amber-400" />
              <span><strong>{isVi ? 'Thời lượng:' : 'Duration:'}</strong> {currentCourse.duration}</span>
            </div>

            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-extrabold shadow-lg transition-transform group-hover:scale-105 cursor-pointer">
              <span>{isVi ? 'Nhấp để xem lộ trình khóa học' : 'Click to view full course syllabus'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        <button onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-orange-600 hover:border-orange-500 transition-all shadow-lg cursor-pointer z-20 opacity-80 hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-orange-600 hover:border-orange-500 transition-all shadow-lg cursor-pointer z-20 opacity-80 hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Right Pagination Dots Indicator */}
        <div className="absolute bottom-4 right-6 hidden sm:flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-800 z-20">
          {courses.map((_, idx) => (
            <button key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className="p-2 cursor-pointer flex items-center justify-center"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div className={`h-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'w-6 bg-orange-500' 
                  : 'w-2 bg-slate-600 hover:bg-slate-400'
              }`} />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}




