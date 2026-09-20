/**
 * İçerik paneli — suselistudio.com/studio
 *
 * Arama motorlarına kapalıdır (robots.ts içinde /studio engelli).
 * Giriş Sanity hesabıyla yapılır; sitede ayrıca şifre tutulmaz.
 */
import type { Metadata, Viewport } from "next";

import Studio from "./Studio";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "İçerik Paneli",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  return <Studio />;
}
