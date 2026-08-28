"use client";

import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LiveSocialProof } from "../components/LiveSocialProof";
import { AiAssistantWidget } from "../components/AiAssistantWidget";
import { FloatingActionButtons } from "../components/FloatingActionButtons";
import { getAdminData } from "../data/adminStore";
import { applyTypography } from "../utils/typographyEngine";
import { Language } from "../types";
import { usePathname, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const AdminLoginModal = dynamic(() => import('../components/AdminLoginModal').then(mod => mod.AdminLoginModal), { ssr: false });
const AdminPortalModal = dynamic(() => import('../components/AdminPortalModal').then(mod => mod.AdminPortalModal), { ssr: false });
const InlineTextEditorModal = dynamic(() => import('../components/InlineTextEditorModal').then(mod => mod.InlineTextEditorModal), { ssr: false });

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("vi");
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isEditActive, setIsEditActive] = useState<boolean>(true);
  const [activeInlineField, setActiveInlineField] = useState<{ key: string; label: string; initialValue: string } | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  
  // Extract active page from pathname (e.g. /courses -> courses)
  const activePage = pathname === "/" ? "home" : pathname.split("/")[1] || "home";

  useEffect(() => {
    try {
      if (sessionStorage.getItem('xuanhien_admin_mode') === 'true') {
        setIsAdminMode(true);
      }
    } catch (e) {}
    
    // Fetch fresh data from Supabase on initial load (fixes F5 stale data issue)
    import("../data/adminStore").then(({ loadAdminDataAsync, getAdminData }) => {
      // 1. Release UI immediately with local/default data
      const data = getAdminData();
      applyTypography(
        data.general.fontHeading || 'Space Grotesk',
        data.general.fontBody || 'Be Vietnam Pro',
        data.general.fontMono || 'IBM Plex Mono',
        data.general.fontSizeScale || 100
      );
      setIsDataLoaded(true);

      // 2. Fetch fresh data in the background silently
      loadAdminDataAsync().catch(err => {
        console.error("Failed to load admin data silently:", err);
      });
    });

    const handleUpdate = () => {
      const data = getAdminData();
      applyTypography(
        data.general.fontHeading || 'Space Grotesk',
        data.general.fontBody || 'Be Vietnam Pro',
        data.general.fontMono || 'IBM Plex Mono',
        data.general.fontSizeScale || 100
      );
    };

    window.addEventListener('admin_data_updated', handleUpdate);
    window.addEventListener('supabase_realtime_update', handleUpdate);
    
    return () => {
      window.removeEventListener('admin_data_updated', handleUpdate);
      window.removeEventListener('supabase_realtime_update', handleUpdate);
    };
  }, []);

  const handleToggleLang = () => {};

  const handleOpenEditField = (key: string, label: string, currentValue: string) => {
    setActiveInlineField({ key, label, initialValue: currentValue });
  };

  const handleSaveInlineField = (newValue: string) => {
    // ... logic for saving inline field, adapted from App.tsx
    setActiveInlineField(null);
  };

  // Bỏ return null để Googlebot đọc được HTML (SEO)
  // if (!isDataLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-500/30">
      <Navbar 
        lang={lang} 
        onToggleLang={handleToggleLang} 
        isDetecting={isDetecting}
        activePage={activePage}
        onSelectPage={(page) => router.push(page === "home" ? "/" : `/${page}`)}
        onOpenAdmin={() => {
          if (isAdminMode) setIsAdminOpen(true);
          else setIsAdminLoginOpen(true);
        }}
      />

      <main>
        <AiAssistantWidget />
      {children}
      </main>

      <Footer 
        lang={lang} 
        onNavigatePage={(page) => router.push(page === "home" ? "/" : `/${page}`)}
        isEditActive={isAdminMode && isEditActive}
        onEditField={handleOpenEditField}
      />

      <FloatingActionButtons 
        lang={lang} 
        onToggleLang={handleToggleLang} 
        isEditActive={isAdminMode && isEditActive}
        onEditField={handleOpenEditField}
      />

      {isAdminLoginOpen && (
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
      )}

      {isAdminOpen && (
        <AdminPortalModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {activeInlineField && (
        <InlineTextEditorModal
          isOpen={!!activeInlineField}
          title={`SỬA ${activeInlineField.label.toUpperCase()}`}
          initialValue={activeInlineField.initialValue}
          onClose={() => setActiveInlineField(null)}
          onSave={handleSaveInlineField}
        />
      )}

      {/* Removed blocking splash screen to ensure 0ms TTFB and no white screen */}
      {/* Fallback khi tải dữ liệu thất bại */}
      {loadError && (
        <div className="fixed inset-0 z-[999999] bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-3">Rất tiếc! Có lỗi xảy ra.</h2>
            <p className="text-slate-600 mb-8 text-sm">Hệ thống đang gặp gián đoạn kết nối dữ liệu. Vui lòng thử lại sau.</p>
            <button onClick={() => window.location.reload()} className="w-full bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-orange-700">
              Tải Lại Trang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
