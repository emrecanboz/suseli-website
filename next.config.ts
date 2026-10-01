import type { NextConfig } from "next";

// Güvenlik başlıkları (2 Ekim 2026). Tam bir CSP bilinçli olarak yok:
// Sanity Studio ve Vercel Analytics'i bozmamak için sadece
// frame-ancestors kuralı var (sitenin başka sitelerde iframe'e
// gömülmesini engeller, tıklama tuzağına karşı).
const guvenlikBasliklari = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // "X-Powered-By: Next.js" başlığını gizler.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: guvenlikBasliklari }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Sanity'ye yüklenen ürün fotoğrafları
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
