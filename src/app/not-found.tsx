import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-9xl font-black text-slate-200 tracking-tighter">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-orange-100 p-4 rounded-full text-orange-600 animate-bounce">
              <AlertTriangle className="w-12 h-12" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900">Ối! Bạn đi lạc rồi.</h2>
          <p className="text-slate-600">
            Dường như trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Đừng lo, con đường thành công vẫn luôn ở phía trước.
          </p>
        </div>

        <Link 
          href="/" 
          className="btn-shine inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 hover:bg-orange-700 transition-all hover:-translate-y-1"
        >
          <Home className="w-5 h-5" />
          <span>Quay về Trang Chủ</span>
        </Link>
      </div>
    </div>
  );
}
