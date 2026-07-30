import { useState, useEffect } from 'react';
import { Language, CourseItem, ServiceItem } from './types';
import { HudFrame } from './components/HudFrame';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsBar } from './components/StatsBar';
import { AboutSection } from './components/AboutSection';
import { CoursesSection } from './components/CoursesSection';
import { ServicesSection } from './components/ServicesSection';
import { ProductsSection } from './components/ProductsSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { CourseModal } from './components/CourseModal';
import { ServiceGalleryModal } from './components/ServiceGalleryModal';
import { SubPageHeader } from './components/SubPageHeader';
import { SubPageBottomCta } from './components/SubPageBottomCta';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { applyTypography } from './utils/typographyEngine';
import { getAdminData, loadAdminDataAsync } from './data/adminStore';
import { Loader } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [isDetecting, setIsDetecting] = useState<boolean>(true);
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);
  const [activePage, setActivePage] = useState<string>('home');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  // Load data from Supabase
  useEffect(() => {
    loadAdminDataAsync().then(() => {
      setIsDataLoaded(true);
    });

    const handleRealtimeUpdate = () => {
      console.log('App: received realtime update, re-rendering...');
      setUpdateTrigger(prev => prev + 1);
    };

    window.addEventListener('supabase_realtime_update', handleRealtimeUpdate);
    return () => window.removeEventListener('supabase_realtime_update', handleRealtimeUpdate);
  }, []);

  // Apply typography settings & document title dynamically
  useEffect(() => {
    const updateSiteMetadata = () => {
      const gen = getAdminData().general;
      applyTypography(
        gen.fontHeading || 'Space Grotesk',
        gen.fontBody || 'Be Vietnam Pro',
        gen.fontMono || 'IBM Plex Mono',
        gen.fontSizeScale || 100
      );

      // Dynamic Browser Tab Title
      const brand = gen.brandName || 'MC NGUYỄN HỒNG XUÂN HIẾN';
      const sub = gen.subBrandName || 'MEDIA & TRAINING STUDIO';
      document.title = `${brand} ${sub} — Đào Tạo Kỹ Năng & Setup Studio Livestream`;
    };

    updateSiteMetadata();
    window.addEventListener('admin_data_updated', updateSiteMetadata);
    return () => window.removeEventListener('admin_data_updated', updateSiteMetadata);
  }, [lang]);

  // Language initialization
  useEffect(() => {
    let savedLang: string | null = null;
    try {
      savedLang = localStorage.getItem('xuanhien_lang');
    } catch {
      // ignore
    }

    if (savedLang === 'vi' || savedLang === 'en') {
      setLang(savedLang);
      setIsDetecting(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const country = (data.country_code || '').toUpperCase();
        if (country === 'VN') {
          setLang('vi');
        } else {
          setLang('vi'); // default to Vietnamese for Xuân Hiến website
        }
      })
      .catch(() => setLang('vi'))
      .finally(() => {
        clearTimeout(timeoutId);
        setIsDetecting(false);
      });
  }, []);

  const handleToggleLang = () => {
    const nextLang: Language = lang === 'en' ? 'vi' : 'en';
    setLang(nextLang);
    try {
      localStorage.setItem('xuanhien_lang', nextLang);
    } catch {
      // ignore
    }
  };

  const handleSelectPage = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update HTML lang attribute
  useEffect(() => {
    const htmlElem = document.getElementById('html-root');
    if (htmlElem) {
      htmlElem.setAttribute('lang', lang);
    }
  }, [lang]);

  // Global Scroll Reveal Observer for UI/UX Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    const observeElements = () => {
      const targets = document.querySelectorAll(
        'section, .reveal-init, .interactive-card, .hover-float, article'
      );
      targets.forEach((el) => {
        if (!el.classList.contains('reveal-init')) {
          el.classList.add('reveal-init');
        }
        observer.observe(el);
      });
    };

    observeElements();
    const timeoutId = setTimeout(observeElements, 400);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [activePage]);

  if (!isDataLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white flex-col gap-4">
        <Loader className="w-10 h-10 animate-spin text-orange-500" />
        <p className="text-sm font-mono tracking-widest uppercase text-slate-400">Loading Supabase Data...</p>
      </div>
    );
  }

  return (
    <>
      <HudFrame />
      <Navbar 
        lang={lang} 
        onToggleLang={handleToggleLang} 
        isDetecting={isDetecting}
        activePage={activePage}
        onSelectPage={handleSelectPage}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        {/* HOMEPAGE VIEW: Streamlined hero header and contact section */}
        {activePage === 'home' && (
          <>
            <HeroSection lang={lang} onNavigatePage={handleSelectPage} onSelectCourse={(c) => setActiveCourse(c)} />
            <ContactSection lang={lang} />
          </>
        )}

        {/* SUB-PAGE 1: ABOUT (Đôi lời chia sẻ) */}
        {activePage === 'about' && (
          <>
            <SubPageHeader 
              title={lang === 'vi' ? 'Câu Chuyện Của Xuân Hiến' : 'My Story'}
              lang={lang}
              onBackToHome={() => handleSelectPage('home')}
            />
            <AboutSection lang={lang} />
            <SubPageBottomCta lang={lang} onNavigatePage={handleSelectPage} />
          </>
        )}

        {/* SUB-PAGE 2: COURSES (Khóa học) */}
        {activePage === 'courses' && (
          <>
            <SubPageHeader 
              title={lang === 'vi' ? 'Các Khóa Học Đào Tạo' : 'Training Courses'}
              lang={lang}
              onBackToHome={() => handleSelectPage('home')}
            />
            <CoursesSection lang={lang} onOpenCourse={(c) => setActiveCourse(c)} />
            <SubPageBottomCta lang={lang} onNavigatePage={handleSelectPage} />
          </>
        )}

        {/* SUB-PAGE 3: SERVICES (Dịch vụ & Giải pháp) */}
        {activePage === 'services' && (
          <>
            <SubPageHeader 
              title={lang === 'vi' ? 'Dịch Vụ Studio & Truyền Thông' : 'Services & Solutions'}
              lang={lang}
              onBackToHome={() => handleSelectPage('home')}
            />
            <ServicesSection lang={lang} onOpenService={(s) => setActiveService(s)} />
            <SubPageBottomCta lang={lang} onNavigatePage={handleSelectPage} />
          </>
        )}

        {/* SUB-PAGE 4: PROJECTS (Dự án & Showcase) */}
        {activePage === 'projects' && (
          <>
            <SubPageHeader 
              title={lang === 'vi' ? 'Dự Án & Showcase Thực Tế' : 'Projects & Portfolio'}
              lang={lang}
              onBackToHome={() => handleSelectPage('home')}
            />
            <ProductsSection lang={lang} />
            <SubPageBottomCta lang={lang} onNavigatePage={handleSelectPage} />
          </>
        )}

        {/* SUB-PAGE 5: BLOG (Kiến thức & Kinh nghiệm) */}
        {activePage === 'blog' && (
          <>
            <SubPageHeader 
              title={lang === 'vi' ? 'Góc Kiến Thức & Kinh Nghiệm' : 'Knowledge & Insights'}
              lang={lang}
              onBackToHome={() => handleSelectPage('home')}
            />
            <BlogSection lang={lang} onOpenArticle={(slug) => setActiveArticleSlug(slug)} />
            <SubPageBottomCta lang={lang} onNavigatePage={handleSelectPage} />
          </>
        )}

        {/* SUB-PAGE 6: CONTACT (Đăng ký tư vấn) */}
        {activePage === 'contact' && (
          <>
            <SubPageHeader 
              title={lang === 'vi' ? 'Đăng Ký Tư Vấn' : 'Contact & Register'}
              lang={lang}
              onBackToHome={() => handleSelectPage('home')}
            />
            <ContactSection lang={lang} />
          </>
        )}
      </main>

      <Footer 
        lang={lang} 
        onNavigatePage={handleSelectPage} 
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      <ArticleReaderModal
        slug={activeArticleSlug}
        lang={lang}
        onClose={() => setActiveArticleSlug(null)}
      />

      <CourseModal
        course={activeCourse}
        onClose={() => setActiveCourse(null)}
        lang={lang}
      />

      <ServiceGalleryModal
        service={activeService}
        onClose={() => setActiveService(null)}
        lang={lang}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        lang={lang}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminOpen(true);
        }}
      />

      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </>
  );
}
