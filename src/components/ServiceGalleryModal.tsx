import React, { useState, useEffect } from 'react';
import { ServiceItem, Language } from '../types';
import { X, ZoomIn, Image as ImageIcon, Sparkles, Phone, ArrowLeft } from 'lucide-react';

interface ServiceGalleryModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  lang?: Language;
}

// Custom curated showcase photo album gallery for each service category
const SERVICE_SHOWCASE_PHOTOS: Record<string, { url: string; title: string; caption: string }[]> = {
  'sv-1': [
    { url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1200&auto=format&fit=crop', title: 'Setup Studio 4K', caption: 'Góc máy Camera Sony 4K & Hệ thống đèn 3 điểm chuẩn Studio' },
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop', title: 'Bàn Trộn Âm Thanh', caption: 'Soundcard & Bàn điều khiển âm thanh chống nhiễu chuyên nghiệp' },
    { url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop', title: 'Micro Broadcast', caption: 'Hệ thống Micro Condenser lọc âm cao cấp cho phòng Livestream' },
    { url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop', title: 'Phòng Live Đa Năng', caption: 'Không gian setup thực tế cho phiên live bán hàng TikTok Shop' },
    { url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop', title: 'Kỹ Thuật Đèn Ánh Sáng', caption: 'Sơ đồ chiếu sáng Softbox & Spotlight tạo độ khối thần thái' },
    { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop', title: 'Tư Vấn Cấu Hình PC', caption: 'Máy tính livestream chuyên dụng card đồ họa RTX cân OBS / VMix' }
  ],
  'sv-2': [
    { url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop', title: 'Chuyển Cảnh Multi-Cam', caption: 'Đạo diễn kỹ thuật điều phối 3-4 góc máy camera trực tiếp' },
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop', title: 'Phòng Điều Hành Live', caption: 'Hệ thống Mixer Blackmagic ATEM Mini Pro & OBS Studio' },
    { url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1200&auto=format&fit=crop', title: 'Graphics Overlay', caption: 'Khung viền thương hiệu, voucher tự động chèn trên phiên live' },
    { url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop', title: 'Kiểm Soát Âm Thanh', caption: 'Cân bằng âm thanh micro MC và nhạc nền chống giật biên độ' }
  ],
  'sv-3': [
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop', title: 'Thiết Kế Profile', caption: 'Quyển hồ sơ năng lực chuyên nghiệp chuẩn nhận diện thương hiệu' },
    { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop', title: 'Kịch Bản Video Ngắn', caption: 'Tối ưu luồng kịch bản thu hút người xem trong 3 giây đầu' },
    { url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop', title: 'Landing Page Bán Hàng', caption: 'Thiết kế trang đích tối ưu tỷ lệ chuyển đổi chốt đơn' }
  ],
  'sv-4': [
    { url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop', title: 'Phòng Thu Voice Talent', caption: 'Đào tạo kỹ thuật đọc TVC, giọng lồng tiếng phim & đọc quảng cáo' },
    { url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop', title: 'Đào Tạo MC Chuyên Nghiệp', caption: 'Lớp kỹ năng tự tin trước ống kính và làm chủ sân khấu sự kiện' },
    { url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1200&auto=format&fit=crop', title: 'Đào Tạo Kỹ Sư Âm Thanh', caption: 'Thực hành setup và xử lý âm thanh kỹ thuật số phòng thu' }
  ]
};

export function ServiceGalleryModal({ service, onClose, lang = 'vi' }: ServiceGalleryModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPhoto !== null) {
          setSelectedPhoto(null);
        } else if (service) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [service, onClose, selectedPhoto]);

  if (!service) return null;
  const isVi = lang === 'vi';
  
  // Get photos for this specific service ID, fallback to general photos if not found
  const photos = SERVICE_SHOWCASE_PHOTOS[service.id] || SERVICE_SHOWCASE_PHOTOS['sv-1'];

  return (
    <>
      {/* Level 1: Service Showcase Gallery Modal (Matching ArticleReaderModal Structure Exactly) */}
      <div 
        className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
        id="service-gallery-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).id === 'service-gallery-overlay') {
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
              aria-label="Close modal"
            >
              <span className="text-base font-bold">←</span>
              <span>{isVi ? 'Quay lại danh sách' : 'Back to list'}</span>
            </button>
            <span className="font-mono text-xs font-bold text-slate-400">XUÂN HIẾN MEDIA / DỊCH VỤ</span>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Modal Content Panel */}
          <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
            
            {/* Service Header Info */}
            <div className="border-b border-slate-100 pb-5">
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                {service.title}
              </h2>
              <p className="mt-3 text-base text-slate-600 font-medium max-w-2xl">
                {service.description}
              </p>
            </div>

            {/* Gallery Masonry Layout */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                {isVi ? 'Album Ảnh Dự Án Thực Tế' : 'Showcase Album'}
              </h3>
              
              <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                {photos.map((photo, idx) => (
                  <div 
                    key={idx}
                    className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm border border-slate-200 bg-slate-100 break-inside-avoid"
                    onClick={() => setSelectedPhoto(idx)}
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase mb-1">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>{isVi ? 'Phóng to' : 'Zoom'}</span>
                      </div>
                      <h4 className="text-white font-bold text-sm line-clamp-1">{photo.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA Block */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  {isVi ? 'Bạn ấn tượng với dự án của chúng tôi?' : 'Impressed by our portfolio?'}
                </h4>
                <p className="text-slate-600 text-xs">
                  {isVi ? 'Liên hệ ngay để nhận báo giá chi tiết và tư vấn giải pháp' : 'Contact us for a detailed quotation & consultation'}
                </p>
              </div>
              <a 
                href="tel:0813131385" 
                className="shrink-0 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-700 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                {isVi ? 'Gọi Tư Vấn 0813.13.13.85' : 'Call Support'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Level 2: High-Res Fullscreen Lightbox Preview */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-[160] bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
          id="lightbox-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget || (e.target as HTMLElement).id === 'lightbox-overlay') {
              setSelectedPhoto(null);
            }
          }}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-white mb-3 px-2">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isVi ? 'Quay lại Album' : 'Back to Album'}</span>
              </button>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title="Đóng xem ảnh (Hoặc nhấp ra ngoài)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main High-Res Image Display */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black max-h-[75vh] flex items-center justify-center">
              <img
                src={photos[selectedPhoto].url}
                alt={photos[selectedPhoto].title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Photo Caption Footer */}
            <div className="mt-3 text-center text-white space-y-1">
              <h4 className="text-base font-extrabold text-white">{photos[selectedPhoto].title}</h4>
              <p className="text-xs text-slate-300 font-medium max-w-xl mx-auto">{photos[selectedPhoto].caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
