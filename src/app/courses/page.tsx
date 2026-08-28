"use client";
import { useState, useEffect } from "react";
import { SubPageHeader } from "../../components/SubPageHeader";
import { CoursesSection } from "../../components/CoursesSection";
import { SubPageBottomCta } from "../../components/SubPageBottomCta";
import { Language } from "../../types";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
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
        title="Các Khóa Học Đào Tạo"
        lang={lang}
        onBackToHome={() => router.push("/")}
      />
      <CoursesSection 
        lang={lang}
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
        onOpenCourse={(c) => router.push(`/course/${c.id}`)}
        layout="grid"
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