import { Language } from '../types';
import { translations } from '../data/translations';

interface ProcessSectionProps {
  lang: Language;
}

export function ProcessSection({ lang }: ProcessSectionProps) {
  const t = translations[lang];

  return (
    <section id="process" className="py-8 sm:py-10 bg-white relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{t.pr_title}</h2>
          </div>
          <p className="text-slate-600 text-sm max-w-xs mt-2 md:mt-0 font-medium">{t.pr_sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-orange-400 transition-all shadow-2xs hover:shadow-md">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 inline-block mb-4">STEP.01</span>
            <h4 className="text-lg font-extrabold text-slate-900 mb-2">{t.st1h}</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{t.st1p}</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all shadow-2xs hover:shadow-md">
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block mb-4">STEP.02</span>
            <h4 className="text-lg font-extrabold text-slate-900 mb-2">{t.st2h}</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{t.st2p}</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-orange-400 transition-all shadow-2xs hover:shadow-md">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 inline-block mb-4">STEP.03</span>
            <h4 className="text-lg font-extrabold text-slate-900 mb-2">{t.st3h}</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{t.st3p}</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-400 transition-all shadow-2xs hover:shadow-md">
            <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 inline-block mb-4">STEP.04</span>
            <h4 className="text-lg font-extrabold text-slate-900 mb-2">{t.st4h}</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{t.st4p}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
