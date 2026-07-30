import { Language } from '../types';
import { translations } from '../data/translations';

interface StatsBarProps {
  lang: Language;
}

export function StatsBar({ lang }: StatsBarProps) {
  const t = translations[lang];

  return (
    <div className="stats border-y border-slate-200 bg-white shadow-xs py-7 relative z-10">
      <div className="stats-in max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        <div className="stat p-4 rounded-xl hover:bg-orange-50/50 transition-colors">
          <b className="text-3xl sm:text-4xl font-black font-mono text-orange-600">12<i className="text-amber-500 not-italic">+</i></b>
          <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">{t.s1}</span>
        </div>
        <div className="stat p-4 rounded-xl hover:bg-amber-50/50 transition-colors">
          <b className="text-3xl sm:text-4xl font-black font-mono text-amber-600">8<i className="text-orange-500 not-italic">+</i></b>
          <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">{t.s2}</span>
        </div>
        <div className="stat p-4 rounded-xl hover:bg-orange-50/50 transition-colors">
          <b className="text-3xl sm:text-4xl font-black font-mono text-orange-600">14<i className="text-amber-500 not-italic">+</i></b>
          <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">{t.s3}</span>
        </div>
        <div className="stat p-4 rounded-xl hover:bg-red-50/50 transition-colors">
          <b className="text-3xl sm:text-4xl font-black font-mono text-red-600">100<i className="text-amber-500 not-italic">%</i></b>
          <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">{t.s4}</span>
        </div>
        <div className="stat col-span-2 md:col-span-1 p-4 rounded-xl hover:bg-orange-50/50 transition-colors">
          <b className="text-3xl sm:text-4xl font-black font-mono text-orange-600">1000<i className="text-amber-500 not-italic">+</i></b>
          <span className="block text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">{t.s5}</span>
        </div>
      </div>
    </div>
  );
}
