"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "../components/HeroSection";
import { BrandMarquee } from "../components/BrandMarquee";
import { StatsBar } from "../components/StatsBar";
import { CoursesSection } from "../components/CoursesSection";
import { TestimonialCarousel } from "../components/TestimonialCarousel";
import { ContactSection } from "../components/ContactSection";
import { getAdminData, defaultAdminData } from "../data/adminStore";
import { Language } from "../types";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("vi");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const router = useRouter();
  
  // Note: Admin Mode and Inline Edit logic will be handled later
  const isAdminMode = false;
  const isEditActive = false;

  useEffect(() => {
    // Trigger any client-side only logic here
    setIsDataLoaded(true);
  }, []);

  return (
    <main suppressHydrationWarning>
      <HeroSection 
        lang={lang} 
        onNavigatePage={(page) => router.push(`/${page}`)} 
        onSelectCourse={(c) => router.push(`/course/${c.id}`)}
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
      />
      <BrandMarquee lang={lang} />
      <StatsBar 
        lang={lang}
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
      />
      <CoursesSection 
        lang={lang}
        onOpenCourse={(c) => router.push(`/course/${c.id}`)}
      />
      <TestimonialCarousel 
        lang={lang}
        testimonials={getAdminData()?.testimonials?.length ? getAdminData().testimonials : defaultAdminData.testimonials}
      />
      <ContactSection 
        lang={lang}
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
      />
    </main>
  );
}
