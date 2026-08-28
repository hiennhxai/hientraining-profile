"use client";
import { useState, use, useEffect } from "react";
import { CourseModal } from "../../../../components/CourseModal";
import { getAdminData } from "../../../../data/adminStore";
import { useRouter } from "next/navigation";

export default function CourseModalIntercept({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const adminData = getAdminData();
    const found = adminData.courses?.find((c: any) => c.id === slug); setData(found);
  }, [slug]);

  if (!data) return null;

  return (
    <CourseModal 
      course={data}
      lang="vi"
      onClose={() => router.back()}
    />
  );
}