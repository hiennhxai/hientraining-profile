import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jkyxajnlhlwfftgplwii.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreXhham5saGx3ZmZ0Z3Bsd2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTQ1NjUsImV4cCI6MjEwMDk5MDU2NX0.VQ5c6rUogRDfpjHyLB275NkQy3CYK12gRD2ncLVFcTQ';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data } = await supabase.from('site_config').select('data').eq('id', 1).single();
    if (data && data.data && data.data.services) {
      const service = data.data.services.find((s: any) => s.id === slug);
      if (service) {
        return {
          title: `${service.title} — Dịch Vụ MC Xuân Hiến`,
          description: service.description,
          openGraph: {
            title: `${service.title} — Dịch Vụ MC Xuân Hiến`,
            description: service.description,
            images: service.thumbnailUrl ? [{ url: service.thumbnailUrl }] : [],
          },
          twitter: {
            card: "summary_large_image",
            title: `${service.title} — Dịch Vụ MC Xuân Hiến`,
            description: service.description,
            images: service.thumbnailUrl ? [service.thumbnailUrl] : [],
          }
        };
      }
    }
  } catch (e) {}

  return { title: 'Dịch Vụ' };
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
