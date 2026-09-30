"use client";

/**
 * Ziyaretçi istatistiği (Vercel Web Analytics).
 * Çerez kullanmaz; KVKK için çerez onay penceresi gerektirmez.
 * İçerik paneli (/studio) ziyaretleri sayılmaz.
 * Vercel panelinde proje → Analytics → Enable yapılınca veri gelmeye başlar.
 */
import { Analytics } from "@vercel/analytics/next";

export default function Analitik() {
  return (
    <Analytics
      beforeSend={(olay) =>
        new URL(olay.url).pathname.startsWith("/studio") ? null : olay
      }
    />
  );
}
