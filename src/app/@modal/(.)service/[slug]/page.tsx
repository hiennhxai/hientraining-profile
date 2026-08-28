"use client";
import { useState, use, useEffect } from "react";
import { ServiceGalleryModal } from "../../../../components/ServiceGalleryModal";
import { getAdminData } from "../../../../data/adminStore";
import { useRouter } from "next/navigation";

export default function ServiceModalIntercept({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const adminData = getAdminData();
    const found = adminData.services?.find((s: any) => s.id === slug); setData(found);
  }, [slug]);

  if (!data) return null;

  return (
    <ServiceGalleryModal 
      service={data}
      lang="vi"
      onClose={() => router.back()}
    />
  );
}