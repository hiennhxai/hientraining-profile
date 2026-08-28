"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "../components/HeroSection";
import { StatsBar } from "../components/StatsBar";
import { TestimonialCarousel } from "../components/TestimonialCarousel";
import { ContactSection } from "../components/ContactSection";
import { getAdminData } from "../data/adminStore";
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
      <StatsBar 
        lang={lang}
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
      />
      <TestimonialCarousel 
        lang={lang}
        testimonials={getAdminData()?.testimonials || []}
      />
      <ContactSection 
        lang={lang}
        isEditActive={isAdminMode && isEditActive}
        onEditField={() => {}}
      />
    </main>
  );
}
