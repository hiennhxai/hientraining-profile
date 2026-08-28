"use client";
import { useState, useEffect } from "react";
import { SubPageHeader } from "../../components/SubPageHeader";
import { BlogSection } from "../../components/BlogSection";
import { SubPageBottomCta } from "../../components/SubPageBottomCta";
import { Language } from "../../types";
import { useRouter } from "next/navigation";

export default function BlogPage() {
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
        title="Góc Kiến Thức & Kinh Nghiệm"
        lang={lang}
        onBackToHome={() => router.push("/")}
      />
      <BlogSection 
        lang={lang}
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
        
        onOpenArticle={(slug) => router.push(`/article/${slug}`)}
        
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