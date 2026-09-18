import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import ArticlePageClient from './ArticlePageClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function fetchArticle(slug: string) {
  if (!supabaseUrl || !supabaseKey) return null;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase.from('site_config').select('data').eq('id', 1).single();
  if (data?.data?.articles) {
    return data.data.articles.find((a: any) => a.slug === slug || a.id === slug);
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  
  if (!article) return { title: 'Không tìm thấy bài viết' };

  return {
    title: `${article.title} | Blog Xuân Hiến`,
    description: article.excerpt || article.title,
    openGraph: {
      images: [article.coverImage || 'https://hientraining.com/og-image.jpg'],
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {article && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": article.title,
              "image": article.coverImage || 'https://hientraining.com/og-image.jpg',
              "description": article.excerpt || article.title,
              "author": {
                "@type": "Person",
                "name": "MC Xuân Hiến",
                "url": "https://hientraining.com/"
              },
              "publisher": {
                "@type": "Organization",
                "name": "MC Nguyễn Hồng Xuân Hiến — Media & Training Studio",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://hientraining.com/og-image.jpg"
                }
              },
              "datePublished": article.createdAt || new Date().toISOString(),
            })
          }}
        />
      )}
      <ArticlePageClient slug={slug} />
    </div>
  );
}