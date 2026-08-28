import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import ServicePageClient from './ServicePageClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function fetchService(slug: string) {
  if (!supabaseUrl || !supabaseKey) return null;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase.from('site_config').select('data').eq('id', 1).single();
  if (data?.data?.services) {
    return data.data.services.find((s: any) => s.slug === slug || s.id === slug);
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await fetchService(slug);
  
  if (!service) return { title: 'Không tìm thấy dịch vụ' };

  return {
    title: `${service.title} | Dịch Vụ Xuân Hiến`,
    description: service.subtitle || service.title,
    openGraph: {
      images: [service.photos?.[0]?.url || 'https://xuanhien.com/og-image.jpg'],
    }
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await fetchService(slug);

  if (!service) {
    redirect('/services');
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <ServicePageClient service={service} />
    </div>
  );
}