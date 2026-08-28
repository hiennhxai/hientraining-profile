import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const baseUrl = 'https://hientraining.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    }
  ];

  if (!supabaseUrl || !supabaseKey) {
    return routes;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data } = await supabase.from('site_config').select('data').eq('id', 1).single();
    
    if (data && data.data) {
      const config = data.data;

      // Add Courses
      if (Array.isArray(config.courses)) {
        config.courses.forEach((c: any) => {
          if (c.slug) {
            routes.push({
              url: `${baseUrl}/course/${c.slug}`,
              lastModified: new Date(),
              changeFrequency: 'monthly',
              priority: 0.8,
            });
          }
        });
      }

      // Add Services
      if (Array.isArray(config.services)) {
        config.services.forEach((s: any) => {
          if (s.slug) {
            routes.push({
              url: `${baseUrl}/service/${s.slug}`,
              lastModified: new Date(),
              changeFrequency: 'monthly',
              priority: 0.8,
            });
          }
        });
      }

      // Add Articles
      if (Array.isArray(config.articles)) {
        config.articles.forEach((a: any) => {
          if (a.slug) {
            routes.push({
              url: `${baseUrl}/article/${a.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        });
      }
    }
  } catch (e) {
    console.error('Error generating dynamic sitemap', e);
  }

  return routes;
}
