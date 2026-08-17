import { useState, useRef, useEffect } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { Language } from '../types';

interface FloatingActionButtonsProps {
  lang: Language;
  onToggleLang: () => void;
}

const VNFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-7 h-7 rounded-[4px] shadow-sm object-cover overflow-hidden">
    <rect width="900" height="600" fill="#da251d"/>
    <polygon fill="#ffcd00" points="450,114 532,367 317,210 583,210 368,367"/>
  </svg>
);

const UKFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-7 h-7 rounded-[4px] shadow-sm object-cover overflow-hidden">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

export function FloatingActionButtons({ lang, onToggleLang }: FloatingActionButtonsProps) {
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMessageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSwitch = () => {
    const targetLang = lang === 'en' ? 'vi' : 'en';
    
    // Toggle internal state (saves to localStorage)
    onToggleLang();
    
    // Trigger Google Translate dropdown in place without reloading!
    // This translates the dynamically loaded Supabase data immediately.
    setTimeout(() => {
      const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectField) {
        selectField.value = targetLang;
        selectField.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      }
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 items-end" ref={containerRef}>
      
      {/* Phone Icon */}
      <a 
        href="tel:0813131385" 
        className="relative flex items-center justify-center w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 animate-float group overflow-hidden"
      >
        <Phone className="w-5 h-5 animate-wiggle" />
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
      </a>

      {/* Message Options (Messenger / Zalo) */}
      <div className="relative flex items-center justify-end">
        <div 
          className={`absolute right-[56px] flex items-center gap-3 transition-all duration-300 origin-right ${isMessageOpen ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-4 pointer-events-none'}`}
        >
          <a
            href="https://zalo.me/0813131385"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
            title="Zalo"
          >
            <span className="font-bold text-sm tracking-wide">Zalo</span>
          </a>

          <a
            href="https://m.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0084FF] text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
            title="Messenger"
          >
            <svg viewBox="0 0 36 36" className="w-5 h-5 fill-current">
              <path d="M18 2C9.163 2 2 8.784 2 17.15c0 4.793 2.408 9.043 6.138 11.838v5.525c0 .633.722.983 1.22.6l4.63-3.486a16.634 16.634 0 004.012.493c8.837 0 16-6.784 16-15.15C34 8.784 26.837 2 18 2zm1.096 20.315l-4.143-4.42c-.443-.473-1.18-.5-1.657-.06l-5.01 4.606c-.57.525-1.396-.15-1.077-.852l5.443-11.968c.45-.992 1.83-1.127 2.457-.24l4.14 5.8c.376.527 1.134.62 1.636.196l4.908-4.153c.594-.503 1.455.158 1.122.863l-5.45 11.758c-.46.994-1.87 1.082-2.368.468z" />
            </svg>
            <span className="font-bold text-sm tracking-wide">Messenger</span>
          </a>
        </div>

        <button 
          onClick={() => setIsMessageOpen(!isMessageOpen)}
          className={`relative flex items-center justify-center w-12 h-12 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 animate-float group overflow-hidden ${isMessageOpen ? 'bg-slate-700' : 'bg-orange-500'}`}
          style={{ animationDelay: '0.2s' }}
        >
          {isMessageOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
        </button>
      </div>

      {/* Language Toggle Icon */}
      <button 
        onClick={handleLanguageSwitch}
        className="relative flex items-center justify-center w-12 h-12 bg-white text-xl rounded-full shadow-lg border border-slate-200 hover:scale-110 transition-transform duration-300 animate-float group overflow-hidden"
        style={{ animationDelay: '0.4s' }}
        title={lang === 'vi' ? 'Chuyển sang Tiếng Anh' : 'Chuyển sang Tiếng Việt'}
      >
        {lang === 'en' ? <VNFlag /> : <UKFlag />}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-200/50 to-transparent group-hover:animate-shimmer" />
      </button>

    </div>
  );
}
