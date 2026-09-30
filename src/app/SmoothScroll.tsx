"use client";

/**
 * Yumuşak kaydırma (Lenis).
 *
 * - Sanity paneli (/studio) kendi kaydırma alanlarını kullanır; orada kapalı.
 * - "Hareketi azalt" ayarı açık olan ziyaretçilerde Lenis kendiliğinden
 *   yumuşatmayı kapatır (respectReducedMotion, varsayılan açık).
 * - #koleksiyon gibi sayfa içi bağlantılar da yumuşak kayar (anchors).
 * - Başka bir sayfaya geçildiğinde yeni sayfa en üstten açılır.
 */
import "lenis/dist/lenis.css";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function SayfaGecisindeBasaDon() {
  const pathname = usePathname();
  const lenis = useLenis();
  const oncekiSayfa = useRef(pathname);

  useEffect(() => {
    if (oncekiSayfa.current === pathname) return;
    oncekiSayfa.current = pathname;
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;

  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, anchors: true, stopInertiaOnNavigate: true }}
    >
      <SayfaGecisindeBasaDon />
    </ReactLenis>
  );
}
