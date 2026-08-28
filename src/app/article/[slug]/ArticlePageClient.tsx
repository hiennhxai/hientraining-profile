"use client";

import { ArticleReaderModal } from "../../../components/ArticleReaderModal";
import { useRouter } from "next/navigation";

export default function ArticlePageClient({ slug }: { slug: string }) {
  const router = useRouter();
  
  return (
    <ArticleReaderModal 
      slug={slug}
      lang="vi"
      onClose={() => router.push("/blog")}
    />
  );
}
