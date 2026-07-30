import { Language } from '../types';
import { ArrowLeft, Home } from 'lucide-react';

interface SubPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  lang: Language;
  onBackToHome: () => void;
}

export function SubPageHeader({ title, lang, onBackToHome }: SubPageHeaderProps) {
  const isVi = lang === 'vi';

  return (
    <div className="bg-slate-100/90 border-b border-slate-200/80 pt-20 pb-2.5 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-bold transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{isVi ? 'Trang chủ' : 'Home'}</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">{title}</span>
        </div>

        {/* Return button */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 hover:bg-orange-50 hover:text-orange-600 transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isVi ? 'Quay lại Trang Chủ' : 'Back to Home'}</span>
        </button>
      </div>
    </div>
  );
}
