"use client";

import { CourseModal } from "../../../components/CourseModal";
import { useRouter } from "next/navigation";

export default function CoursePageClient({ course }: { course: any }) {
  const router = useRouter();
  
  return (
    <CourseModal 
      course={course}
      lang="vi"
      onClose={() => router.push("/courses")}
    />
  );
}
