import { useState, useEffect, useCallback } from 'react';
import { TestimonialItem, Language } from '../types';
import { translations } from '../data/translations';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

interface TestimonialCarouselProps {
  lang: Language;
  testimonials: TestimonialItem[];
}

export function TestimonialCarousel({ lang, testimonials }: TestimonialCarouselProps) {
  const t = translations[lang];
  const isVi = lang === 'vi';
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'center', 
      skipSnaps: false,
      dragFree: true,
      breakpoints: {
        '(min-width: 768px)': { align: 'start' }
      }
    },
    [AutoScroll({ speed: 1.5, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 reveal-init">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-orange-400 font-mono text-xs font-bold uppercase tracking-widest mb-4">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{isVi ? 'Đánh Giá & Lời Khuyên' : 'Testimonials'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {isVi ? 'Học Viên & Đối Tác' : 'What People Say'} <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              {isVi ? 'Nói Gì Về Xuân Hiến?' : 'About Xuan Hien'}
            </span>
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto reveal-init">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -ml-4 md:-ml-6">
              {testimonials.map((item, idx) => (
                <div key={item.id} className="flex-[0_0_85%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6">
                  <div className="h-full p-8 rounded-3xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 flex flex-col hover:bg-slate-800 transition-colors duration-300">
                    <Quote className="w-10 h-10 text-orange-500/20 mb-4" />
                    
                    <p className="text-slate-300 text-base lg:text-lg italic font-medium leading-relaxed flex-grow mb-8">
                      "{item.content}"
                    </p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      {item.avatarUrl ? (
                        <img loading="lazy" decoding="async" src={item.avatarUrl} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-lg">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      
                      <div>
                        <div className="font-bold text-white text-base leading-tight">{item.name}</div>
                        <div className="text-xs font-mono text-orange-400 font-medium mt-0.5">{item.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className="p-3 rounded-full bg-slate-800 text-white hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button key={idx}
                  onClick={() => scrollTo(idx)}
                  className="p-2 cursor-pointer flex items-center justify-center"
                  aria-label={`Go to testimonial ${idx + 1}`}
                >
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === selectedIndex ? 'w-6 bg-orange-500' : 'bg-slate-700 hover:bg-slate-500'
                  }`} />
                </button>
              ))}
            </div>

            <button onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className="p-3 rounded-full bg-slate-800 text-white hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}




