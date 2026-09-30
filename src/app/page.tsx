/**
 * Ana sayfa — sunucu bileşeni.
 *
 * İçerik Sanity'den burada çekilir ve HomeClient'a props olarak verilir.
 * Böylece ürünler arama motorları tarafından da görülür (eski localStorage
 * yönteminde görünmüyordu).
 */
import HomeClient from "./HomeClient";
import JsonLd from "./JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import {
  getCategories,
  getFeaturedProducts,
  getSettings,
} from "@/lib/getContent";

// İçerik dakikada bir tazelenir: panelden ürün eklediğinde site kendiliğinden
// güncellenir, yeniden dağıtım gerekmez.
export const revalidate = 60;

export default async function Page() {
  const [settings, categories, featured] = await Promise.all([
    getSettings(),
    getCategories(),
    getFeaturedProducts(),
  ]);

  // Google için: işletme (Bursa, 2023, iletişim) + site adı.
  // Açık adres bilinmediği için sadece şehir/ülke yazılıyor — uydurulmuyor.
  const yapilandirilmisVeri = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#site`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "tr-TR",
      },
      {
        "@type": "FurnitureStore",
        "@id": `${SITE_URL}/#isletme`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        logo: `${SITE_URL}/icon-gunduz.png`,
        image: `${SITE_URL}/urun/sekiz-kapak.jpg`,
        foundingDate: "2023",
        telephone: settings.whatsapp ? `+${settings.whatsapp}` : undefined,
        email: settings.email || undefined,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bursa",
          addressCountry: "TR",
        },
        sameAs: [settings.instagram].filter(Boolean),
      },
    ],
  };

  return (
    <>
      <JsonLd data={yapilandirilmisVeri} />
      <HomeClient
        settings={settings}
        categories={categories}
        featured={featured}
      />
    </>
  );
}
