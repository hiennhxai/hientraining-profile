import { useState, useEffect } from 'react';
import { CourseItem, Language } from '../types';
import { getAdminData } from '../data/adminStore';
import { translations } from '../data/translations';
import { CourseModal } from './CourseModal';
import { EditableWrapper } from './EditableWrapper';
import { BookOpen, CheckCircle, ChevronRight, Phone, Sparkles } from 'lucide-react';

interface CoursesSectionProps {
  lang: Language;
  onOpenCourse?: (course: CourseItem) => void;
  isEditActive?: boolean;
  onEditField?: (fieldKey: string, fieldLabel: string, currentValue: string) => void;
}

export function CoursesSection({ lang, onOpenCourse, isEditActive = false, onEditField }: CoursesSectionProps) {
  const [courses, setCourses] = useState<CourseItem[]>(getAdminData().courses);
  const t = translations[lang];
  const isVi = lang === 'vi';

  useEffect(() => {
    const handleUpdate = () => {
      setCourses(getAdminData().courses);
    };
    window.addEventListener('admin_data_updated', handleUpdate);
    return () => window.removeEventListener('admin_data_updated', handleUpdate);
  }, []);

  const triggerEdit = (key: string, label: string, currentVal: string) => {
    if (onEditField) onEditField(key, label, currentVal);
  };

  const defaultThumbnails = [
    "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
  ];

  return (
    <section id="courses" className="py-6 sm:py-8 bg-slate-50 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Tiêu Đề Khóa Học"
              onEdit={() => triggerEdit('coursesTitle', 'Tiêu Đề Các Khóa Học', t.cs_title)}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{t.cs_title}</h2>
            </EditableWrapper>

            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Mô Tả Phụ Khóa Học"
              onEdit={() => triggerEdit('coursesSub', 'Mô Tả Khối Khóa Học', t.cs_sub)}
            >
              <p className="text-slate-600 text-sm mt-1">{t.cs_sub}</p>
            </EditableWrapper>
          </div>
          <div className="shrink-0">
            <a 
              href="tel:0813131385" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isVi ? 'Báo Phí & Đăng Ký: 0813.13.13.85' : 'Tuition & Enrollment: 0813.13.13.85'}</span>
            </a>
          </div>
        </div>

        {/* Dynamic Centered 3-Column Grid */}
        <div className="flex flex-wrap items-stretch justify-center -mx-3">
          {courses.map((course, idx) => {
            const thumbUrl = course.thumbnailUrl || defaultThumbnails[idx % defaultThumbnails.length];

            return (
              <div 
                key={course.id}
                className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6 flex"
              >
                <div 
                  onClick={() => onOpenCourse?.(course)}
                  className="group w-full rounded-2xl bg-white border border-slate-200 hover:border-orange-400 overflow-hidden transition-all duration-300 shadow-sm interactive-card flex flex-col justify-between cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  
                  {/* 16:9 Aspect Ratio Thumbnail Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img 
                      src={thumbUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 text-xs font-mono font-bold bg-orange-600 text-white shadow-md rounded-lg">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-mono text-white bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 font-semibold truncate max-w-[170px]">
                        {course.badge}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <EditableWrapper
                        isEditActive={isEditActive}
                        label={`Sửa Tên Khóa ${idx + 1}`}
                        onEdit={() => triggerEdit(`course_${course.id}_title`, `Tên Khóa Học ${course.code}`, course.title)}
                      >
                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors mb-2 leading-snug">
                          {course.title}
                        </h3>
                      </EditableWrapper>

                      <EditableWrapper
                        isEditActive={isEditActive}
                        label={`Sửa Mô Tả Khóa ${idx + 1}`}
                        onEdit={() => triggerEdit(`course_${course.id}_subtitle`, `Mô Tả Khóa Học ${course.code}`, course.subtitle)}
                      >
                        <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed font-normal">
                          {course.subtitle}
                        </p>
                      </EditableWrapper>

                      <div className="space-y-1.5 mb-4 text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                          <span className="truncate"><strong>{isVi ? 'Thời lượng:' : 'Duration:'}</strong> {course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="truncate"><strong>{isVi ? 'Hình thức:' : 'Format:'}</strong> {isVi ? 'Offline 1-1 / Online Live' : 'Offline 1-1 / Online Live'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-700 font-semibold pt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{course.feeNotice}</span>
                        </div>
                      </div>

                      {/* Core Syllabus Bullet Points */}
                      <div className="space-y-1.5 text-xs text-slate-700">
                        <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1.5">
                          {isVi ? 'Nội dung cốt lõi:' : 'Core Syllabus:'}
                        </div>
                        {course.lessons.slice(0, 3).map((l, lIdx) => (
                          <div key={lIdx} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1 font-medium text-slate-800 text-[11px]">{l.lessonTitle}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenCourse?.(course)}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white font-bold text-xs tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs mt-3"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isVi ? 'Xem chi tiết khóa học' : 'View Syllabus Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
