import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jkyxajnlhlwfftgplwii.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreXhham5saGx3ZmZ0Z3Bsd2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTQ1NjUsImV4cCI6MjEwMDk5MDU2NX0.VQ5c6rUogRDfpjHyLB275NkQy3CYK12gRD2ncLVFcTQ';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data } = await supabase.from('site_config').select('data').eq('id', 1).single();
    if (data && data.data && data.data.courses) {
      const course = data.data.courses.find((c: any) => c.id === slug);
      if (course) {
        return {
          title: `${course.title} — Khóa học MC Xuân Hiến`,
          description: course.subtitle,
          openGraph: {
            title: `${course.title} — Khóa học MC Xuân Hiến`,
            description: course.subtitle,
            images: course.bannerImage ? [{ url: course.bannerImage }] : [],
          },
          twitter: {
            card: "summary_large_image",
            title: `${course.title} — Khóa học MC Xuân Hiến`,
            description: course.subtitle,
            images: course.bannerImage ? [course.bannerImage] : [],
          }
        };
      }
    }
  } catch (e) {}

  return { title: 'Khóa Học' };
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
