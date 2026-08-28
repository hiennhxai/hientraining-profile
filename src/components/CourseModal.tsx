import { useEffect } from 'react';
import { Language, CourseItem } from '../types';
import { X, CheckCircle2, Phone, Calendar, Clock, Award, MapPin, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface CourseModalProps {
  course: CourseItem | null;
  onClose: () => void;
  lang?: Language;
}

export function CourseModal({ course, onClose, lang = 'vi' }: CourseModalProps) {
  useEffect(() => {
    if (course) {
      document.body.style.overflow = 'hidden';
      document.title = `${course.title} — Khóa học MC Xuân Hiến`;
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && course) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [course, onClose]);

  if (!course) return null;
  const isVi = lang === 'vi';
  
  return (
    <>
      {/* SEO Title Handled via useEffect */}
      <div 
      className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      id="course-modal-overlay"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'course-modal-overlay') {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative animate-scaleUp text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <button
            className="text-orange-400 hover:text-orange-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            onClick={onClose}
            aria-label="Action button" >
            <span className="text-base font-bold">←</span>
            <span>{isVi ? 'Quay lại danh sách' : 'Back to list'}</span>
          </button>
          <span className="font-mono text-xs font-bold text-slate-400">XUÂN HIẾN MEDIA / KHÓA HỌC</span>
          <button aria-label="Action button" onClick={onClose}
            className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">

          {/* Optional Wide Banner */}
          {course.bannerImage && (
            <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 mb-6">
              <Image src={course.bannerImage} alt={`${course.title} Banner`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 1024px" />
            </div>
          )}

          {/* Meta Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold">
              {course.code}
            </span>
            <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold">
              {course.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">{course.title}</h1>
          <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed font-medium">{course.subtitle}</p>

          {/* Course Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wider">
                    {isVi ? 'Hình thức Offline' : 'Offline Format'}
                  </strong>
                  <span className="text-slate-600 text-sm">{course.formatOffline}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2 border-t border-slate-200">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wider">
                    {isVi ? 'Hình thức Online' : 'Online Format'}
                  </strong>
                  <span className="text-slate-600 text-sm">{course.formatOnline}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 text-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-700 font-bold">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>{isVi ? 'Thời lượng:' : 'Duration:'} {course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-orange-700 font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{course.feeNotice}</span>
                </div>
              </div>
              <a 
                href="tel:0813131385" 
                className="mt-3 py-2.5 px-4 text-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{isVi ? 'Gọi 0813.13.13.85 để nhận học phí & xếp lịch' : 'Call 0813.13.13.85 for tuition & scheduling'}</span>
              </a>
            </div>
          </div>

          {/* Full Detailed Curriculum */}
          <div className="space-y-4 mt-4">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Award className="w-5 h-5 text-orange-600" />
              <span>{isVi ? 'Nội dung chương trình học chi tiết' : 'Full Curriculum & Syllabus'}</span>
            </h3>

            <div className="space-y-4">
              {course.lessons.map((lesson, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-orange-600 text-sm sm:text-base flex items-center justify-between">
                    <span>{lesson.lessonTitle}</span>
                    {lesson.duration && <span className="text-xs font-mono text-slate-500 font-semibold">{lesson.duration}</span>}
                  </h5>
                  <ul className="space-y-1.5 pl-1">
                    {lesson.points.map((pt, pIdx) => (
                      <li key={pIdx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 p-6 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-800 text-sm font-semibold">
              {isVi ? 'Liên hệ ngay để được tư vấn lộ trình học phù hợp nhất!' : 'Contact us for a personalized learning roadmap!'}
            </p>
            <a href="tel:0813131385" className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-700 transition-colors shadow-sm">
              {isVi ? 'Gọi Tư Vấn 0813.13.13.85' : 'Call 0813.13.13.85'}
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}



