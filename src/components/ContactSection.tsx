import { useState, useEffect, FormEvent } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Logo } from './Logo';
import { EditableWrapper } from './EditableWrapper';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { getAdminData } from '../data/adminStore';
import Script from 'next/script';

interface ContactSectionProps {
  lang: Language;
  isEditActive?: boolean;
  onEditField?: (fieldKey: string, fieldLabel: string, currentValue: string) => void;
}

export function ContactSection({ lang, isEditActive = false, onEditField }: ContactSectionProps) {
  const t = translations[lang];
  const isVi = lang === 'vi';
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', phone: '', email: '', service: 'Khóa học Setup Livestream', note: '',
    bookingDate: '', bookingTime: '', meetingType: 'Online', meetingLocation: ''
  });
  const [adminData, setAdminData] = useState(getAdminData());
  const gen = adminData.general;

  useEffect(() => {
    const handleUpdate = () => setAdminData(getAdminData());
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let recaptchaToken = '';
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      
      if (siteKey && (window as any).grecaptcha) {
        recaptchaToken = await new Promise<string>((resolve) => {
          (window as any).grecaptcha.ready(async () => {
            try {
              const token = await (window as any).grecaptcha.execute(siteKey, { action: 'contact_submit' });
              resolve(token);
            } catch (err) {
              resolve('');
            }
          });
        });
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      });

      if (!response.ok) {
        throw new Error('Submit failed or spam detected');
      }

      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', service: 'Khóa học Setup Livestream', note: '', bookingDate: '', bookingTime: '', meetingType: 'Online', meetingLocation: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Submit error:', error);
      alert(isVi ? 'Có lỗi xảy ra hoặc nghi ngờ Spam. Xin vui lòng liên hệ Hotline.' : 'Error submitting form or Spam detected. Please call our hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-6 sm:py-8 bg-slate-50 relative border-b border-slate-200">
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} strategy="lazyOnload" />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column Contact Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <EditableWrapper
                isEditActive={isEditActive}
                label="Sửa Tiêu Đề Khối Đồng Hành"
                onEdit={() => triggerEdit('heroCtaText', 'Tiêu Đề Khối Đồng Hành', gen.heroCtaText || t.ct_title)}
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {gen.heroCtaText || t.ct_title}
                </h2>
              </EditableWrapper>

              <EditableWrapper
                isEditActive={isEditActive}
                label="Sửa Mô Tả Khối Đồng Hành"
                onEdit={() => triggerEdit('heroCtaSub', 'Mô Tả Khối Đồng Hành', gen.heroCtaSub || t.ct_sub)}
              >
                <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
                  {gen.heroCtaSub || t.ct_sub}
                </p>
              </EditableWrapper>
            </div>

            <div className="space-y-4 pt-2">
              <EditableWrapper
                isEditActive={isEditActive}
                label="Sửa Số Hotline / Zalo"
                onEdit={() => triggerEdit('phoneHotline', 'Số Điện Thoại Hotline / Zalo', gen.phoneHotline || '0813 13 13 85')}
              >
                <a 
                  href={`tel:${(gen.phoneHotline || '0813131385').replace(/\s+/g, '')}`} 
                  className="flex items-center gap-4 p-4.5 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 transition-all duration-200 shadow-2xs hover:shadow-md group"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                      {isVi ? 'Hotline Trực Tiếp / Zalo' : 'Direct Hotline / Zalo'}
                    </span>
                    <strong className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {gen.phoneHotline || '0813 13 13 85'}
                    </strong>
                  </div>
                </a>
              </EditableWrapper>

              <EditableWrapper
                isEditActive={isEditActive}
                label="Sửa Địa Chỉ Email"
                onEdit={() => triggerEdit('emailContact', 'Địa Chỉ Email Dịch Vụ', gen.emailContact || 'admin@xuanhien.info')}
              >
                <a 
                  href={`mailto:${gen.emailContact || 'admin@xuanhien.info'}`} 
                  className="flex items-center gap-4 p-4.5 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 transition-all duration-200 shadow-2xs hover:shadow-md group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                      {isVi ? 'Email trao đổi dự án' : 'Project Email Inquiries'}
                    </span>
                    <strong className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {gen.emailContact || 'admin@xuanhien.info'}
                    </strong>
                  </div>
                </a>
              </EditableWrapper>

              <EditableWrapper
                isEditActive={isEditActive}
                label="Sửa Địa Điểm Đào Tạo & Studio"
                onEdit={() => triggerEdit('studioLocation', 'Địa Điểm Đào Tạo & Studio', gen.studioLocation || 'TP. Hồ Chí Minh (Đào tạo Offline 1-1 & Online)')}
              >
                <div className="flex flex-col gap-4 p-4.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <MapPin className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                        {isVi ? 'Địa điểm Đào tạo & Studio' : 'Training Location & Studio'}
                      </span>
                      <strong className="text-sm font-sans text-slate-900 font-bold">
                        {gen.studioLocation || (isVi ? 'BILY STUDIO (TP.HCM)' : 'BILY STUDIO (HCMC)')}
                      </strong>
                    </div>
                  </div>
                  <div className="w-full h-[200px] sm:h-[250px] rounded-xl overflow-hidden border border-slate-200">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.7260914371486!2d106.74949361074479!3d10.678356089420632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175259195733cad%3A0x1c88eb1ddfb11ac2!2sBILY%20STUDIO!5e0!3m2!1svi!2s!4v1789749959365!5m2!1svi!2s" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </EditableWrapper>
            </div>
          </div>

          {/* Right Column Quick Inquiry Form */}
          <div className="lg:col-span-6 p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-xl relative">
            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Tiêu Đề Form"
              onEdit={() => triggerEdit('contactTitle', 'Tiêu Đề Khối Đăng Ký', gen.contactTitle || 'ĐĂNG KÝ TƯ VẤN KHÓA HỌC / DỰ ÁN')}
            >
              <h3 className="text-xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <span>{gen.contactTitle || (isVi ? 'ĐĂNG KÝ TƯ VẤN KHÓA HỌC / DỰ ÁN' : 'ENROLL / CONSULTATION INQUIRY')}</span>
              </h3>
            </EditableWrapper>

            <EditableWrapper
              isEditActive={isEditActive}
              label="Sửa Mô Tả Form"
              onEdit={() => triggerEdit('contactSubtitle', 'Mô Tả Phụ Khối Đăng Ký', gen.contactSubtitle || (isVi ? 'Xuân Hiến sẽ gọi lại trực tiếp cho bạn trong vòng 24h...' : 'Xuan Hien will contact you...'))}
            >
              <p className="text-xs text-slate-600 mb-6 font-medium">
                {gen.contactSubtitle || (isVi 
                  ? 'Xuân Hiến sẽ gọi lại trực tiếp cho bạn trong vòng 24h để trao đổi lộ trình cá nhân hóa.'
                  : 'Xuan Hien will contact you within 24h for a personalized roadmap.')}
              </p>
            </EditableWrapper>

            <div className="mb-6 flex flex-col gap-3">
               <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
                 <p className="text-xs font-bold text-slate-500 mb-2 uppercase text-center">{isVi ? 'Xem lịch trống của Hiến Training' : 'Check Hien Training Availability'}</p>
                 <iframe 
                   src="https://calendar.google.com/calendar/embed?src=xuanhien.info%40gmail.com&ctz=Asia%2FHo_Chi_Minh&mode=AGENDA&showPrint=0&showTabs=0&showCalendars=0&showTz=0" 
                   style={{ border: 0 }} 
                   width="100%" 
                   height="300" 
                   frameBorder="0" 
                   scrolling="no"
                 ></iframe>
               </div>
               
               <div className="flex items-center gap-4 py-2 mt-2">
                 <div className="h-px bg-slate-200 flex-1"></div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isVi ? 'Và để lại thông tin bên dưới' : 'And leave your details below'}</span>
                 <div className="h-px bg-slate-200 flex-1"></div>
               </div>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">
                  {isVi ? 'Gửi Thông Tin Thành Công!' : 'Inquiry Submitted Successfully!'}
                </h4>
                <p className="text-xs text-slate-700 font-medium">
                  {isVi 
                    ? 'Cảm ơn bạn. Xuân Hiến sẽ liên hệ tư vấn trực tiếp qua số điện thoại của bạn sớm nhất.'
                    : 'Thank you! Xuan Hien will reach out to you via your phone number shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isVi ? 'Họ và tên của bạn' : 'Your Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isVi ? "Nguyễn Văn A" : "John Doe"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isVi ? 'Số điện thoại / Zalo' : 'Phone / Zalo Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0813131385"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isVi ? 'Email của bạn' : 'Your Email'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isVi ? 'Ngày hẹn (tuỳ chọn)' : 'Date (Optional)'}
                    </label>
                    <input
                      type="date"
                      value={formData.bookingDate}
                      onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isVi ? 'Giờ hẹn' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={formData.bookingTime}
                      onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isVi ? 'Hình thức gặp' : 'Meeting Type'}
                  </label>
                  <select
                    value={formData.meetingType}
                    onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition-all"
                  >
                    <option value="Online">🌐 Online (Google Meet)</option>
                    <option value="Offline">☕ Offline (Gặp trực tiếp)</option>
                  </select>
                </div>

                {formData.meetingType === 'Offline' && (
                  <div className="animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isVi ? 'Địa điểm đề xuất' : 'Suggested Location'}
                    </label>
                    <input
                      type="text"
                      placeholder={isVi ? "Ví dụ: Quán cà phê XYZ hoặc BILY Studio..." : "e.g., XYZ Cafe or BILY Studio..."}
                      value={formData.meetingLocation}
                      onChange={(e) => setFormData({ ...formData, meetingLocation: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isVi ? 'Dịch vụ hoặc Khóa học quan tâm' : 'Interested Course or Service'}
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition-all"
                  >
                    <optgroup label={isVi ? "Các Khóa Học" : "Courses"}>
                      {adminData.courses?.map((course, idx) => (
                        <option key={`course-${course.id}`} value={course.title}>
                          {isVi ? `Khóa ${idx + 1}: ${course.title}` : `Course ${idx + 1}: ${course.title}`}
                        </option>
                      ))}
                    </optgroup>
                    
                    <optgroup label={isVi ? "Các Dịch Vụ Tư Vấn" : "Consulting Services"}>
                      {adminData.services?.map((service, idx) => (
                        <option key={`service-${service.id}`} value={service.title}>
                          {isVi ? `Dịch vụ: ${service.title}` : `Service: ${service.title}`}
                        </option>
                      ))}
                    </optgroup>
                    
                    <option value="Khác">
                      {isVi ? 'Tư vấn nhu cầu khác (Vui lòng ghi chú)' : 'Other Custom Inquiry'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isVi ? 'Ghi chú hoặc câu hỏi thêm (không bắt buộc)' : 'Additional Notes / Questions (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={isVi ? "Ví dụ: Tôi muốn học offline vào buổi tối..." : "e.g., I would like evening offline sessions..."}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition-all"
                  />
                </div>

                <button aria-label="Action button" type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    isVi ? 'Đang gửi...' : 'Sending...'
                  ) : (
                    <>
                      {isVi ? 'GỬI ĐĂNG KÝ NGAY' : 'SEND INQUIRY'}
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


