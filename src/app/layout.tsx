import type { Metadata } from "next";
import "../index.css"; // Ensure this path is correct
import { ClientLayout } from "./ClientLayout";

import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600; // Force Next.js to cache this layout for 1 hour (Fast TTFB)

export async function generateMetadata(): Promise<Metadata> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  let title = "MC Nguyễn Hồng Xuân Hiến — Media & Training Studio";
  let desc = "12+ năm kinh nghiệm MC truyền hình, Á quân TV Face, chuyên gia đào tạo kỹ năng 1 kèm 1 và setup studio livestream chuyên nghiệp.";
  let ogImage = "https://hientraining.com/og-image.jpg";

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase.from('site_config').select('data').eq('id', 1).single();
      if (data && data.data && data.data.general) {
        const gen = data.data.general;
        if (gen.brandName) title = `${gen.brandName} ${gen.subBrandName ? `— ${gen.subBrandName}` : ''}`;
        if (gen.ctaDescription || gen.heroSub) desc = gen.ctaDescription || gen.heroSub || desc;
        if (gen.ogImage) ogImage = gen.ogImage;
      }
    } catch (e) {}
  }

  return {
    title,
    description: desc,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hientraining.com'),
    keywords: "MC Xuân Hiến, Đào tạo MC, Media Training Studio, Livestream chuyên nghiệp, Kỹ năng giao tiếp",
    openGraph: {
      title,
      description: desc,
      url: "https://hientraining.com/",
      images: [{ url: ogImage }],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  let fontHeading = 'Montserrat';
  let fontBody = 'Lora';
  let fontMono = 'Fira Code';
  let fontSizeScale = 100;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase.from('site_config').select('data').eq('id', 1).single();
      if (data && data.data && data.data.general) {
        fontHeading = data.data.general.fontHeading || fontHeading;
        fontBody = data.data.general.fontBody || fontBody;
        fontMono = data.data.general.fontMono || fontMono;
        fontSizeScale = data.data.general.fontSizeScale || fontSizeScale;
      }
    } catch (e) {}
  }

  const fontUrl = `https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap`;

  return (
    <html lang="vi" id="html-root" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href={fontUrl} />
        <link href={fontUrl} rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-heading: '${fontHeading}', sans-serif;
              --font-body: '${fontBody}', Georgia, serif;
              --font-mono: '${fontMono}', monospace;
              --font-size-scale: ${fontSizeScale}%;
              --disp: '${fontHeading}', sans-serif;
              --body: '${fontBody}', Georgia, serif;
              --mono: '${fontMono}', monospace;
            }
            body, button, input, textarea, select {
              font-family: '${fontBody}', Georgia, serif !important;
            }
            h1, h2, h3, h4, h5, h6, .font-extrabold, .font-black, .font-bold, .font-display, [class*="font-extrabold"], [class*="font-bold"] {
              font-family: '${fontHeading}', sans-serif !important;
            }
            .font-mono, [class*="font-mono"] {
              font-family: '${fontMono}', monospace !important;
            }
          `
        }} />
        
        {/* ==========================================
            MARKETING TRACKING SCRIPTS (PLACEHOLDERS)
            Thay thế G-XXXXXXXXXX và PIXEL_ID bằng ID thật của bạn
        ========================================== */}
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', { page_path: window.location.pathname });
          `
        }} />
        
        {/* Facebook Pixel */}
        <script dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'PIXEL_ID');
            fbq('track', 'PageView');
          `
        }} />
      </head>
      <body suppressHydrationWarning>
        {/* Facebook Pixel (NoScript) */}
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
               src="https://www.facebook.com/tr?id=PIXEL_ID&ev=PageView&noscript=1" />
        </noscript>
        <div id="google_translate_element" style={{ position: 'fixed', bottom: 0, left: 0, width: '1px', height: '1px', opacity: 0.0001, pointerEvents: 'none', zIndex: -1 }}></div>
        <script dangerouslySetInnerHTML={{
          __html: `
          if (!sessionStorage.getItem('xuanhien_keep_lang')) {
            var hostname = window.location.hostname;
            var domains = ['', '.' + hostname, hostname];
            var parts = hostname.split('.');
            if (parts.length > 1) {
              domains.push('.' + parts[parts.length - 2] + '.' + parts[parts.length - 1]);
            }
            domains.forEach(function(d) {
              var domainStr = d ? '; domain=' + d : '';
              document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' + domainStr;
            });
          }
          sessionStorage.removeItem('xuanhien_keep_lang');
          `
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'vi',
              includedLanguages: 'en,vi',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          }
          `
        }} />
        <script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

        <ClientLayout>
          {children}
          {modal}
        </ClientLayout>
      </body>
    </html>
  );
}
