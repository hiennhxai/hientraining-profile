import { useState, FormEvent } from 'react';
import { X, User, Phone, Mail, FileText, Download, Loader2, CheckCircle2 } from 'lucide-react';

import { submitLead } from '../actions/submitLead';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
  resourceFileUrl: string;
}

export function LeadCaptureModal({ isOpen, onClose, resourceTitle, resourceFileUrl }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Save data via server action
      const result = await submitLead(
        formData.name,
        formData.phone,
        `[Kho Tài Liệu] ${resourceTitle}`,
        formData.email
      );

      if (!result.success) {
        console.error('Failed to submit lead:', result.message);
      }

      // Show success briefly before redirecting
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
        // Open the file link
        window.open(resourceFileUrl, '_blank');
      }, 1500);

    } catch (error) {
      console.error('Error submitting form:', error);
      // Even if it fails, let them download it to not block user experience
      setIsSubmitting(false);
      onClose();
      window.open(resourceFileUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-orange-600">
            <div className="p-2 bg-orange-50 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Tải Miễn Phí</h3>
          </div>
          <button aria-label="Action button" onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {!isSuccess ? (
            <>
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4 items-start">
                <FileText className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tài liệu bạn chọn</div>
                  <div className="font-bold text-slate-900 leading-snug">{resourceTitle}</div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h4 className="font-bold text-slate-900 text-lg mb-2">Vui lòng điền thông tin</h4>
                <p className="text-slate-500 text-sm">Để nhận link tải trực tiếp và cập nhật các tài liệu mới nhất từ hệ thống của chúng tôi.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Họ và Tên <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="Nhập tên của bạn"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={isSubmitting}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Số Điện Thoại / Zalo <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      placeholder="09xx xxx xxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={isSubmitting}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email <span className="text-slate-400 font-normal">(Không bắt buộc)</span></label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={isSubmitting}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button aria-label="Action button" type="submit"
                    disabled={isSubmitting || !formData.name.trim() || !formData.phone.trim()}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/20 disabled:opacity-70 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        Xác nhận & Tải Xuống
                        <Download className="w-5 h-5 ml-1" />
                      </>
                    )}
                  </button>
                </div>
                
                <p className="text-center text-xs font-medium text-slate-400 mt-4 px-4">
                  Thông tin của bạn sẽ được bảo mật tuyệt đối và chỉ dùng để gửi tài liệu cập nhật mới nhất.
                </p>
              </form>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Thành công!</h4>
              <p className="text-slate-500 max-w-[250px]">
                File tài liệu sẽ được mở ra ngay sau đây...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


