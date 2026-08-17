import { useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { Language } from '../types';

interface FloatingActionButtonsProps {
  lang: Language;
  onToggleLang: () => void;
}

export function FloatingActionButtons({ lang, onToggleLang }: FloatingActionButtonsProps) {
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50 items-end">
      {/* Phone Icon */}
      <a 
        href="tel:0813131385" 
        className="relative flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 animate-float group overflow-hidden"
      >
        <Phone className="w-5 h-5 animate-wiggle" />
        {/* Shimmer/Light sweeping effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
      </a>

      {/* Message Options (Messenger / Zalo) */}
      <div className="relative flex flex-col items-end">
        <div 
          className={`flex flex-col gap-3 mb-4 transition-all duration-300 origin-bottom right-0 ${isMessageOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4 pointer-events-none'}`}
        >
          {/* Messenger */}
          <a
            href="https://m.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group overflow-hidden"
            title="Messenger"
          >
            {/* Simple SVG for Messenger */}
            <svg viewBox="0 0 36 36" className="w-6 h-6 fill-current">
              <path d="M18 2C9.163 2 2 8.784 2 17.15c0 4.793 2.408 9.043 6.138 11.838v5.525c0 .633.722.983 1.22.6l4.63-3.486a16.634 16.634 0 004.012.493c8.837 0 16-6.784 16-15.15C34 8.784 26.837 2 18 2zm1.096 20.315l-4.143-4.42c-.443-.473-1.18-.5-1.657-.06l-5.01 4.606c-.57.525-1.396-.15-1.077-.852l5.443-11.968c.45-.992 1.83-1.127 2.457-.24l4.14 5.8c.376.527 1.134.62 1.636.196l4.908-4.153c.594-.503 1.455.158 1.122.863l-5.45 11.758c-.46.994-1.87 1.082-2.368.468z" />
            </svg>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
          </a>

          {/* Zalo */}
          <a
            href="https://zalo.me/0813131385"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group overflow-hidden"
            title="Zalo"
          >
            <span className="font-bold text-sm">Zalo</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
          </a>
        </div>

        {/* Message Toggle Button */}
        <button 
          onClick={() => setIsMessageOpen(!isMessageOpen)}
          className="relative flex items-center justify-center w-12 h-12 bg-orange-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 animate-float group overflow-hidden"
          style={{ animationDelay: '0.2s' }}
        >
          <MessageCircle className="w-5 h-5" />
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
        </button>
      </div>

      {/* Language Toggle Icon */}
      <button 
        onClick={onToggleLang}
        className="relative flex items-center justify-center w-12 h-12 bg-white text-xl rounded-full shadow-lg border border-slate-200 hover:scale-110 transition-transform duration-300 animate-float group overflow-hidden"
        style={{ animationDelay: '0.4s' }}
        title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      >
        {/* If English, show VN flag. If Vietnamese, show UK flag. */}
        {lang === 'en' ? '🇻🇳' : '🇬🇧'}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:animate-shimmer" />
      </button>

    </div>
  );
}
