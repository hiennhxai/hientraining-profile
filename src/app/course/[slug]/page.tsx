import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import CoursePageClient from './CoursePageClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function fetchCourse(slug: string) {
  if (!supabaseUrl || !supabaseKey) return null;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase.from('site_config').select('data').eq('id', 1).single();
  if (data?.data?.courses) {
    return data.data.courses.find((c: any) => c.slug === slug || c.id === slug);
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchCourse(slug);
  
  if (!course) return { title: 'Không tìm thấy khóa học' };

  return {
    title: `${course.title} | Khóa Học Xuân Hiến`,
    description: course.subtitle || course.title,
    openGraph: {
      images: [course.bannerImage || course.thumbnailUrl || 'https://hientraining.com/og-image.jpg'],
    }
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await fetchCourse(slug);

  if (!course) {
    redirect('/courses');
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <CoursePageClient course={course} />
    </div>
  );
}