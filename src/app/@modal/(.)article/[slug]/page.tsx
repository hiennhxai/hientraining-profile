"use client";
import { useState, use, useEffect } from "react";
import { ArticleReaderModal } from "../../../../components/ArticleReaderModal";
import { getAdminData } from "../../../../data/adminStore";
import { useRouter } from "next/navigation";

export default function ArticleModalIntercept({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const adminData = getAdminData();
    setData(slug);
  }, [slug]);

  if (!data) return null;

  return (
    <ArticleReaderModal 
      slug={data}
      lang="vi"
      onClose={() => router.back()}
    />
  );
}