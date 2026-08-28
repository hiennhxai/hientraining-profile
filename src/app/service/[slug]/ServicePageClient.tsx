"use client";

import { ServiceGalleryModal } from "../../../components/ServiceGalleryModal";
import { useRouter } from "next/navigation";

export default function ServicePageClient({ service }: { service: any }) {
  const router = useRouter();
  
  return (
    <ServiceGalleryModal 
      service={service}
      lang="vi"
      onClose={() => router.push("/services")}
    />
  );
}
