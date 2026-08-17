import { useState, useEffect } from 'react';
import { Language, CourseItem, ServiceItem } from './types';
import { HudFrame } from './components/HudFrame';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsBar } from './components/StatsBar';
import { AboutSection } from './components/AboutSection';
import { CoursesSection } from './components/CoursesSection';
import { ResourceLibrarySection } from './components/ResourceLibrarySection';
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
import { InlineEditToolbar } from './components/InlineEditToolbar';
import { InlineTextEditorModal } from './components/InlineTextEditorModal';
import { applyTypography } from './utils/typographyEngine';
import { getAdminData, loadAdminDataAsync, saveAdminData } from './data/adminStore';
import { FloatingActionButtons } from './components/FloatingActionButtons';

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

  // Live Inline Editing State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('xuanhien_admin_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [isEditActive, setIsEditActive] = useState<boolean>(true);
  const [isSavingInline, setIsSavingInline] = useState<boolean>(false);
  const [activeInlineField, setActiveInlineField] = useState<{ key: string; label: string; initialValue: string } | null>(null);

  // Load data from Supabase
  useEffect(() => {
    loadAdminDataAsync().then(() => {
      setIsDataLoaded(true);
      // If language is English, auto-trigger Google Translate after data is injected
      if (lang === 'en') {
        setTimeout(() => {
          const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (selectField) {
            selectField.value = 'en';
            selectField.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
          }
        }, 500);
      }
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

  // Inline edit field trigger
  const handleOpenEditField = (key: string, label: string, currentValue: string) => {
    setActiveInlineField({ key, label, initialValue: currentValue });
  };

  // Inline edit field save handler
  const handleSaveInlineField = (newValue: string) => {
    if (!activeInlineField) return;
    const currentData = getAdminData();
    const key = activeInlineField.key;

    if (key.startsWith('service_')) {
      // Format: service_{id}_{field}
      const parts = key.split('_');
      const serviceId = parts[1];
      const field = parts.slice(2).join('_');
      const targetService = currentData.services.find(s => s.id === serviceId);
      if (targetService) {
        (targetService as any)[field] = newValue;
      }
    } else if (key.startsWith('course_')) {
      // Format: course_{id}_{field}
      const parts = key.split('_');
      const courseId = parts[1];
      const field = parts.slice(2).join('_');
      const targetCourse = currentData.courses.find(c => c.id === courseId);
      if (targetCourse) {
        (targetCourse as any)[field] = newValue;
      }
    } else {
      (currentData.general as any)[key] = newValue;
    }

    window.dispatchEvent(new Event('admin_data_updated'));
    setActiveInlineField(null);
  };

  // Save all inline changes to Supabase
  const handleSaveAllInline = async () => {
    setIsSavingInline(true);
    const success = await saveAdminData(getAdminData());
    setIsSavingInline(false);
    if (success) {
      alert('Đã lưu tất cả thay đổi trực quan lên Supabase thành công!');
    } else {
      alert('Có lỗi xảy ra khi lưu dữ liệu lên Supabase.');
    }
  };

  // Logout admin mode
  const handleAdminLogout = () => {
    sessionStorage.removeItem('xuanhien_admin_mode');
    setIsAdminMode(false);
  };

  return (
    <>
      <HudFrame />
      
      {/* Floating Admin Live Edit Control Toolbar */}
      <InlineEditToolbar
        isAdminMode={isAdminMode}
        isEditActive={isEditActive}
        onToggleEditActive={() => setIsEditActive(!isEditActive)}
        onOpenAdminPortal={() => setIsAdminOpen(true)}
        onSaveAll={handleSaveAllInline}
        onLogout={handleAdminLogout}
        isSaving={isSavingInline}
      />

      <Navbar 
        lang={lang} 
        onToggleLang={handleToggleLang} 
        isDetecting={isDetecting}
        activePage={activePage}
        onSelectPage={handleSelectPage}
        onOpenAdmin={() => {
          if (isAdminMode) {
            setIsAdminOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      <main>
        {/* HOMEPAGE VIEW: Streamlined hero header, stats bar, and contact section */}
        {activePage === 'home' && (
          <>
            <HeroSection 
              lang={lang} 
              onNavigatePage={handleSelectPage} 
              onSelectCourse={(c) => setActiveCourse(c)}
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
            <StatsBar 
              lang={lang}
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
            <ContactSection 
              lang={lang}
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
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
            <AboutSection 
              lang={lang}
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
            <SubPageBottomCta 
              lang={lang} 
              onNavigatePage={handleSelectPage} 
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
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
            <CoursesSection 
              lang={lang} 
              onOpenCourse={(c) => setActiveCourse(c)}
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
            <SubPageBottomCta 
              lang={lang} 
              onNavigatePage={handleSelectPage} 
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
          </>
        )}

        {/* SUB-PAGE 2.5: RESOURCES (Kho Tài Liệu & Biểu Mẫu) */}
        {activePage === 'resources' && (
          <>
            <SubPageHeader 
              title={lang === 'vi' ? 'Kho Tài Liệu & Biểu Mẫu Thực Chiến' : 'Resources & Downloads'}
              lang={lang}
              onBackToHome={() => handleSelectPage('home')}
            />
            <ResourceLibrarySection 
              lang={lang} 
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
            <SubPageBottomCta 
              lang={lang} 
              onNavigatePage={handleSelectPage} 
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
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
            <ServicesSection 
              lang={lang} 
              onOpenService={(s) => setActiveService(s)}
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
            <SubPageBottomCta 
              lang={lang} 
              onNavigatePage={handleSelectPage} 
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
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
            <ProductsSection 
              lang={lang}
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
            <SubPageBottomCta 
              lang={lang} 
              onNavigatePage={handleSelectPage} 
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
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
            <BlogSection 
              lang={lang} 
              onOpenArticle={(slug) => setActiveArticleSlug(slug)}
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
            <SubPageBottomCta 
              lang={lang} 
              onNavigatePage={handleSelectPage} 
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
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
            <ContactSection 
              lang={lang}
              isEditActive={isAdminMode && isEditActive}
              onEditField={handleOpenEditField}
            />
          </>
        )}
      </main>

      <Footer 
        lang={lang} 
        onNavigatePage={handleSelectPage} 
        isEditActive={isAdminMode && isEditActive}
        onEditField={handleOpenEditField}
        onOpenAdminLogin={() => {
          if (isAdminMode) {
            setIsAdminOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      <FloatingActionButtons lang={lang} onToggleLang={handleToggleLang} />

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
          sessionStorage.setItem('xuanhien_admin_mode', 'true');
          setIsAdminMode(true);
          setIsEditActive(true);
          setIsAdminOpen(true);
        }}
      />

      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Mini Inline Text Editor Modal */}
      {activeInlineField && (
        <InlineTextEditorModal
          isOpen={!!activeInlineField}
          title={`SỬA ${activeInlineField.label.toUpperCase()}`}
          initialValue={activeInlineField.initialValue}
          onClose={() => setActiveInlineField(null)}
          onSave={handleSaveInlineField}
        />
      )}
    </>
  );
}
