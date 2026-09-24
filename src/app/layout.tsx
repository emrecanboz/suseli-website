import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  // Sekme ikonu: logodaki ters E. Cihaz açık temadaysa koyu kare + mavi E,
  // koyu temadaysa mavi kare + krem E. (Tema desteği olmayan tarayıcılar
  // public/favicon.ico'yu kullanır.)
  icons: {
    icon: [
      {
        url: "/icon-gunduz.png",
        type: "image/png",
        sizes: "192x192",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-gece.png",
        type: "image/png",
        sizes: "192x192",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    // iPhone/iPad "Ana ekrana ekle" ikonu (src/app/apple-icon.png)
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Google Search Console sahiplik doğrulaması (HTML etiketi yöntemi).
  // Silinirse Search Console erişimi kaybolur.
  verification: {
    google: "BFtzg4Rcu6CzamJaXYAMemgvePTrdJd9Me-5SrD2W_g",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
