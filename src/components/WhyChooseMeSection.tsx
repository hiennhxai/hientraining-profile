import { ShieldCheck, Target, HeartHandshake, Zap } from 'lucide-react';

export function WhyChooseMeSection() {
  return (
    <section className="py-10 md:py-12 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-orange-400 font-mono text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Triết Lý Đào Tạo</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Sự Chính Trực Là <span className="text-orange-500">Vũ Khí</span> Bán Hàng Mạnh Nhất
          </h2>
          <p className="text-lg text-slate-400">
            Không sáo rỗng, không lý thuyết suông. Với Xuân Hiến, mọi kỹ năng MC hay Livestream đều phải bắt nguồn từ sự thấu hiểu và chân thành.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="p-6 md:p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 transition-colors group text-center">
            <h3 className="text-xl font-bold mb-3 text-slate-100">Thực Chiến 100%</h3>
            <p className="text-slate-400 leading-relaxed">
              Học là làm được ngay. Giáo trình đúc kết từ 12 năm cần mẫn trên sân khấu và hàng ngàn giờ livestream thực tế.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 transition-colors group text-center">
            <h3 className="text-xl font-bold mb-3 text-slate-100">Đồng Hành Tận Tâm</h3>
            <p className="text-slate-400 leading-relaxed">
              Không bỏ con giữa chợ. Cam kết hỗ trợ 1 kèm 1, chỉnh sửa từng lỗi nhỏ nhất cho đến khi học viên tự tin cầm mic.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 transition-colors group text-center">
            <h3 className="text-xl font-bold mb-3 text-slate-100">Chất Lượng Premium</h3>
            <p className="text-slate-400 leading-relaxed">
              Từ hình ảnh, âm thanh đến phong thái. Mọi giải pháp setup studio và coaching đều đạt chuẩn khắt khe nhất.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
