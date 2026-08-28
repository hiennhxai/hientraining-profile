import { useState, useEffect, FormEvent } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Logo } from './Logo';
import { EditableWrapper } from './EditableWrapper';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { getAdminData } from '../data/adminStore';

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
  const [formData, setFormData] = useState({ name: '', phone: '', service: 'Khóa học Setup Livestream', note: '' });
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
      const formBody = Object.keys(formData)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent((formData as any)[key]))
        .join('&');

      await fetch('https://script.google.com/macros/s/AKfycbz6L0gVATSHZP-3ocYhbp2Pavki4P_HoSaAz7RZFn4yYL9vIJejFk51mI4yG3gMK1R1/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      });

      setSubmitted(true);
      setFormData({ name: '', phone: '', service: 'Khóa học Setup Livestream', note: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Submit error:', error);
      alert(isVi ? 'Có lỗi xảy ra khi gửi đăng ký. Xin vui lòng liên hệ hotline.' : 'Error submitting form. Please call our hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-6 sm:py-8 bg-slate-50 relative border-b border-slate-200">
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
                <div className="flex items-center gap-4 p-4.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                      {isVi ? 'Địa điểm Đào tạo & Studio' : 'Training Location & Studio'}
                    </span>
                    <strong className="text-sm font-sans text-slate-900 font-bold">
                      {gen.studioLocation || (isVi ? 'TP. Hồ Chí Minh (Đào tạo Offline 1-1 & Online)' : 'Ho Chi Minh City (1-on-1 Offline & Online Live)')}
                    </strong>
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


