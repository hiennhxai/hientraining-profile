/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd8j0ntlcm91z4.cloudfront.net',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
             key: 'Permissions-Policy',
             value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            // SECURITY FIX: Content-Security-Policy — tuyến phòng thủ thứ 2 chống XSS
            // Ngăn mã độc gọi ra ngoài hoặc load script từ nguồn lạ
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: Chỉ cho phép từ chính web, Google (Analytics/Tag), Facebook Pixel
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://translate.google.com https://translate.googleapis.com",
              // Styles: cho phép Google Fonts và inline styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: chỉ Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: cho phép supabase, unsplash, cloudfront, pravatar, và data URLs
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://d8j0ntlcm91z4.cloudfront.net https://i.pravatar.cc https://www.facebook.com",
              // API connections: cho phép gọi đến Supabase, Gemini, Facebook
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com https://api.gemini.google.com https://translate.googleapis.com",
              // Frames: chỉ YouTube embed
              "frame-src https://www.youtube.com https://drive.google.com",
              // Media: supabase storage và cloudfront
              "media-src 'self' https://*.supabase.co https://d8j0ntlcm91z4.cloudfront.net blob:",
            ].join('; ')
          }
        ],
      },
    ];
  },
};

export default nextConfig;
