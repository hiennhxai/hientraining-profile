import { Language } from '../types';
import { ArrowLeft } from 'lucide-react';

interface SubPageHeaderProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  lang: Language;
  onBackToHome: () => void;
}

export function SubPageHeader({ lang, onBackToHome }: SubPageHeaderProps) {
  const isVi = lang === 'vi';

  return (
    <div className="bg-slate-100/90 border-b border-slate-200/80 pt-20 sm:pt-24 pb-2 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-start">
        {/* Clean Return to Home Button on Left */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isVi ? 'Quay lại Trang Chủ' : 'Back to Home'}</span>
        </button>
      </div>
    </div>
  );
}
