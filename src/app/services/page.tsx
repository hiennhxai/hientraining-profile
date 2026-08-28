"use client";
import { useState, useEffect } from "react";
import { SubPageHeader } from "../../components/SubPageHeader";
import { ServicesSection } from "../../components/ServicesSection";
import { SubPageBottomCta } from "../../components/SubPageBottomCta";
import { Language } from "../../types";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const [lang] = useState<Language>("vi");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const router = useRouter();
  const isAdminMode = false;
  const isEditActive = false;

  useEffect(() => setIsDataLoaded(true), []);
  if (!isDataLoaded) return null;

  return (
    <>
      <SubPageHeader 
        title="Dịch Vụ Studio & Truyền Thông"
        lang={lang}
        onBackToHome={() => router.push("/")}
      />
      <ServicesSection 
        lang={lang}
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
        
        
        onOpenService={(s) => router.push(`/service/${s.id}`)}
      />
      <SubPageBottomCta 
        lang={lang} 
        onNavigatePage={(page) => router.push(page === "home" ? "/" : `/${page}`)} 
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
      />
    </>
  );
}