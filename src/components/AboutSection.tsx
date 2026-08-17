import { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { getAdminData } from '../data/adminStore';
import { EditableWrapper } from './EditableWrapper';
import { Heart, Users, Mic, Sparkles, Award, History, Tv, Video } from 'lucide-react';

interface AboutSectionProps {
  lang: Language;
  isEditActive?: boolean;
  onEditField?: (fieldKey: string, fieldLabel: string, currentValue: string) => void;
}

export function AboutSection({ lang, isEditActive = false, onEditField }: AboutSectionProps) {
  const t = translations[lang];
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
    <section id="about" className="py-6 sm:py-8 bg-slate-50/50 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div>
          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Tiêu Đề Về Tôi"
            onEdit={() => triggerEdit('storyTitle', 'Tiêu Đề Về Tôi', gen.storyTitle || t.a_title)}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{gen.storyTitle || t.a_title}</h2>
          </EditableWrapper>

          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Thẻ Tag"
            onEdit={() => triggerEdit('storyTag', 'Thẻ Tag Về Tôi', gen.storyTag || t.a_tag)}
          >
            <p className="text-orange-600 font-semibold text-sm mt-1">{gen.storyTag || t.a_tag}</p>
          </EditableWrapper>
        </div>

        {/* Top Grid: Self-Narrative with Portrait Photo (Left) & Achievements/Milestones (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Main Story Paragraphs + Integrated Portrait Image (Left 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 text-slate-700 text-sm sm:text-base leading-relaxed">
            
            <div className="p-5 rounded-xl bg-orange-50/80 border border-orange-200/80 shadow-2xs">
              <EditableWrapper
                isEditActive={isEditActive}
                label="Sửa Trích Dẫn"
                onEdit={() => triggerEdit('storyQuote', 'Trích Dẫn Nổi Bật', gen.storyQuote || '"Mỗi người trong chúng ta đều sở hữu những năng lực tuyệt vời..."')}
              >
                <p className="font-bold text-orange-700 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>{gen.storyQuote || (isVi ? '"Mỗi người trong chúng ta đều sở hữu những năng lực tuyệt vời..."' : '"Every person possesses remarkable innate potential..."')}</span>
                </p>
              </EditableWrapper>

              <EditableWrapper
                isEditActive={isEditActive}
                label="Sửa Đoạn Văn 1"
                onEdit={() => triggerEdit('storyP1', 'Đoạn Văn Giới Thiệu 1', gen.storyP1 || t.a_p1)}
              >
                <p className="font-medium text-slate-800" dangerouslySetInnerHTML={{ __html: gen.storyP1 || t.a_p1 }} />
              </EditableWrapper>
            </div>

            {/* Profile Image & Content Side-by-Side / Wrap Layout */}
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Profile Image Frame */}
              <div className="w-full sm:w-48 shrink-0 relative group">
                <EditableWrapper
                  isEditActive={isEditActive}
                  type="image"
                  label="Đổi Ảnh Chân Dung"
                  onEdit={() => triggerEdit('heroPortraitUrl', 'URL Ảnh Chân Dung', gen.heroPortraitUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop")}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-orange-200 shadow-md bg-slate-100 relative">
                    <img 
                      src={gen.heroPortraitUrl || ""} 
                      alt="MC Nguyễn Hồng Xuân Hiến" 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                      <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                        MC Xuân Hiến
                      </span>
                    </div>
                  </div>
                </EditableWrapper>
                <div className="mt-1.5 text-center">
                  <span className="text-[11px] font-mono text-slate-500 font-semibold block">
                    {isVi ? 'MC · Specialist Trainer' : 'MC & Senior Trainer'}
                  </span>
                </div>
              </div>

              {/* Text Narrative Beside Image */}
              <div className="space-y-4 flex-1">
                <EditableWrapper
                  isEditActive={isEditActive}
                  label="Sửa Đoạn Văn 2"
                  onEdit={() => triggerEdit('storyP2', 'Đoạn Văn Giới Thiệu 2', gen.storyP2 || t.a_p2)}
                >
                  <p className="font-normal text-slate-700" dangerouslySetInnerHTML={{ __html: gen.storyP2 || t.a_p2 }} />
                </EditableWrapper>

                <EditableWrapper
                  isEditActive={isEditActive}
                  label="Sửa Đoạn Văn 3"
                  onEdit={() => triggerEdit('storyP3', 'Đoạn Văn Giới Thiệu 3', gen.storyP3 || t.a_p3)}
                >
                  <p className="font-normal text-slate-700" dangerouslySetInnerHTML={{ __html: gen.storyP3 || t.a_p3 }} />
                </EditableWrapper>
              </div>
            </div>

          </div>

          {/* Right Column: TV Host Milestones & Achievements Panel (Right 5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm flex flex-col justify-between">
            <div>
              <EditableWrapper
                isEditActive={isEditActive}
                label="Sửa Tiêu Đề Thành Tựu"
                onEdit={() => triggerEdit('achievementsTitle', 'Tiêu Đề Thành Tựu', gen.achievementsTitle || t.a_achievements_title)}
              >
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5 border-b border-slate-200 pb-3.5 mb-4">
                  <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <span>{gen.achievementsTitle || t.a_achievements_title}</span>
                </h3>
              </EditableWrapper>

              <div className="space-y-3.5 text-xs sm:text-sm font-sans text-slate-700">
                <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                  <span className="text-orange-600 font-bold shrink-0">2012</span>
                  <span className="text-right text-slate-800 font-medium ml-4">{t.a_m1_desc}</span>
                </div>
                <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                  <span className="text-orange-600 font-bold shrink-0">2014</span>
                  <span className="text-right text-slate-800 font-medium ml-4">{t.a_m2_desc}</span>
                </div>
                <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                  <span className="text-amber-600 font-extrabold shrink-0">2017</span>
                  <span className="text-right text-orange-700 font-extrabold ml-4">{t.a_m3_desc}</span>
                </div>
                <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                  <span className="text-orange-600 font-bold shrink-0">2017</span>
                  <span className="text-right text-slate-800 font-medium ml-4">{t.a_m4_desc}</span>
                </div>
                <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                  <span className="text-red-600 font-bold shrink-0">2016 – 2026</span>
                  <span className="text-right text-slate-800 font-medium ml-4">{t.a_m5_desc}</span>
                </div>
              </div>
            </div>

            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Trích Dẫn Đồng Hành"
              onEdit={() => triggerEdit('mentorQuote', 'Trích Dẫn Mentor Đồng Hành', gen.mentorQuote || t.a_mentor_quote)}
            >
              <div className="pt-3 border-t border-slate-200 bg-orange-50/70 p-4 rounded-xl">
                <p className="text-xs text-orange-900 font-medium leading-relaxed">
                  {gen.mentorQuote || t.a_mentor_quote}
                </p>
              </div>
            </EditableWrapper>
          </div>
        </div>

        {/* Middle Section: Dàn trải đều 3 giá trị cốt lõi / triết lý (Full Width Grid) */}
        <div className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Giá Trị 1"
              onEdit={() => triggerEdit('p1h', 'Tiêu Đề Thấu Hiểu Cốt Lõi 1', gen.p1h || t.p1h)}
            >
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm interactive-card flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-2">{gen.p1h || t.p1h}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{gen.p1p || t.p1p}</p>
                </div>
              </div>
            </EditableWrapper>

            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Giá Trị 2"
              onEdit={() => triggerEdit('p2h', 'Tiêu Đề Thấu Hiểu Cốt Lõi 2', gen.p2h || t.p2h)}
            >
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm interactive-card flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-2">{gen.p2h || t.p2h}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{gen.p2p || t.p2p}</p>
                </div>
              </div>
            </EditableWrapper>

            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Giá Trị 3"
              onEdit={() => triggerEdit('p3h', 'Tiêu Đề Thấu Hiểu Cốt Lõi 3', gen.p3h || t.p3h)}
            >
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm interactive-card flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                    <Mic className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-2">{gen.p3h || t.p3h}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{gen.p3p || t.p3p}</p>
                </div>
              </div>
            </EditableWrapper>
          </div>
        </div>

        {/* Bottom Section: Hành Trình Kinh Nghiệm & Lịch Sử Hoạt Động (Image Content) */}
        <div className="pt-4 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-md">
          <EditableWrapper
            isEditActive={isEditActive}
            label="Sửa Tiêu Đề Hành Trình"
            onEdit={() => triggerEdit('careerTitle', 'Tiêu Đề Hành Trình Kinh Nghiệm', gen.careerTitle || (isVi ? 'Hành Trình Kinh Nghiệm & Lịch Sử Hoạt Động' : 'Career Milestones & Proven Experience'))}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 font-bold">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {gen.careerTitle || (isVi ? 'Hành Trình Kinh Nghiệm & Lịch Sử Hoạt Động' : 'Career Milestones & Proven Experience')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  {isVi ? 'Hơn 10 năm kinh nghiệm truyền hình, dẫn chương trình & sản xuất Livestream thương hiệu' : '10+ years of television hosting, presenter coaching & brand livestream production'}
                </p>
              </div>
            </div>
          </EditableWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex flex-col justify-between interactive-card">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-extrabold text-orange-600">{isVi ? '10+ NĂM' : '10+ YRS'}</span>
                  <Tv className="w-5 h-5 text-orange-500" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base mb-2">
                  {isVi ? 'MC Truyền Hình Trực Tiếp' : 'Live TV Presenter'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {isVi 
                    ? 'Dẫn trực tiếp show lớn "Giai điệu Phương Nam" phát trên 14 đài truyền hình Miền Nam, "Chuyện trưa 12h" & TVO Báo Tuổi Trẻ.'
                    : 'Live host for major national broadcast "Giai dieu Phuong Nam" across 14 Southern TV channels, "Chuyen trua 12h" & Tuoi Tre TV.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between interactive-card">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-extrabold text-amber-600">{isVi ? '8+ NĂM' : '8+ YRS'}</span>
                  <Video className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base mb-2">
                  {isVi ? 'Producer Setup Studio' : 'Studio Setup Producer'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {isVi 
                    ? 'Tư vấn kỹ thuật góc quay 4K, 3 đèn studio, âm thanh chống nhiễu & vận hành phòng live bán hàng cho các thương hiệu lớn.'
                    : 'Consultant for 4K cameras, 3-point studio lighting, noise-free audio & e-commerce livestream production for top brands.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200/80 flex flex-col justify-between interactive-card">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-extrabold text-red-600">2017</span>
                  <Award className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base mb-2">
                  {isVi ? 'Á Quân TV Face' : 'TV Face Runner-up'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {isVi 
                    ? 'Giải thưởng Gương Mặt Truyền Hình toàn quốc, khẳng định năng lực biên tập kịch bản & phong thái sân khấu đỉnh cao.'
                    : 'National TV Host Competition Runner-up award, demonstrating master script writing & high-end stage presence.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between interactive-card">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-extrabold text-emerald-600">500+</span>
                  <Users className="w-5 h-5 text-emerald-500" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base mb-2">
                  {isVi ? 'Đào Tạo 1-1 Thực Chiến' : 'Practical 1-on-1 Coaching'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {isVi 
                    ? 'Đồng hành cá nhân hóa giúp học viên, doanh nghiệp & KOLs bứt phá thần thái lên hình, giọng nói & tối ưu doanh số.'
                    : 'Personalized 1-on-1 mentoring helping students, enterprise hosts & creators boost camera presence, voice & sales.'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
