"use client";
import { useState, useEffect } from "react";
import { SubPageHeader } from "../../components/SubPageHeader";
import { ResourceLibrarySection } from "../../components/ResourceLibrarySection";
import { SubPageBottomCta } from "../../components/SubPageBottomCta";
import { Language } from "../../types";
import { useRouter } from "next/navigation";

export default function ResourcesPage() {
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
        title="Kho Tài Liệu & Biểu Mẫu Thực Chiến"
        lang={lang}
        onBackToHome={() => router.push("/")}
      />
      <ResourceLibrarySection 
        lang={lang}
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
        isSubpage={true}
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