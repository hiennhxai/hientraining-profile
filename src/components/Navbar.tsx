import { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Logo } from './Logo';
import { PhoneCall, Menu, X, Home, User, GraduationCap, FolderDown, Wrench, Video, BookOpen, MessageSquare, Settings } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  isDetecting: boolean;
  activePage: string;
  onSelectPage: (page: string) => void;
  onOpenAdmin?: () => void;
}

import { getAdminData } from '../data/adminStore';

export function Navbar({ lang, onToggleLang, isDetecting, activePage, onSelectPage, onOpenAdmin }: NavbarProps) {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gen, setGen] = useState(getAdminData().general);

  useEffect(() => {
    const handleUpdate = () => setGen(getAdminData().general);
    window.addEventListener('admin_data_updated', handleUpdate);
    window.addEventListener('supabase_realtime_update', handleUpdate);
    return () => {
      window.removeEventListener('admin_data_updated', handleUpdate);
      window.removeEventListener('supabase_realtime_update', handleUpdate);
    };
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'home', label: gen.navHome || t.nav_home || (lang === 'vi' ? 'Trang chủ' : 'Home'), icon: Home },
    { id: 'about', label: gen.navAbout || t.nav_about || (lang === 'vi' ? 'Về tôi' : 'My Story'), icon: User },
    { id: 'courses', label: gen.navCourses || t.nav_courses || (lang === 'vi' ? 'Khóa học' : 'Courses'), icon: GraduationCap },
    { id: 'resources', label: lang === 'vi' ? 'Kho Tài Liệu' : 'Resources', icon: FolderDown },
    { id: 'services', label: gen.navServices || t.nav_services || (lang === 'vi' ? 'Dịch vụ' : 'Services'), icon: Wrench },
    { id: 'projects', label: gen.navProjects || t.nav_projects || (lang === 'vi' ? 'Dự án & Showcase' : 'Projects'), icon: Video },
    { id: 'blog', label: gen.navBlog || t.nav_blog || (lang === 'vi' ? 'Kiến thức' : 'Knowledge'), icon: BookOpen },
    { id: 'contact', label: gen.navContact || t.nav_contact || (lang === 'vi' ? 'Đăng ký tư vấn' : 'Contact'), icon: MessageSquare },
  ];

  const handleNavClick = (id: string) => {
    onSelectPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200/80 px-4 md:px-8 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with clean branding */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group text-left cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <Logo className="h-9 sm:h-10" showText={true} textColor="text-slate-900" />
          </button>

          {/* Desktop Nav Items - Clean typography without cluttered inline icons */}
          <ul className="hidden lg:flex items-center space-x-1 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer font-medium ${
                      isActive
                        ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200/80 shadow-2xs'
                        : 'text-slate-700 hover:text-orange-600 hover:bg-slate-100/70'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Controls: Language Toggle & Hotline & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language toggle removed in favor of Google Translate widget */}

            <a
              href="tel:0813131385"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-sm hover:shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>0813.13.13.85</span>
            </a>

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-orange-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-orange-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation with Dark Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Panel */}
          <div className="fixed inset-x-0 top-[64px] bg-white border-b border-slate-200 p-5 shadow-2xl max-h-[calc(100vh-68px)] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-500 border-t border-r border-b border-orange-200'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-orange-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <span className="text-xs font-mono text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md font-bold">[Đang xem]</span>}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="tel:0813131385"
                className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Hotline/Zalo: 0813.13.13.85</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
