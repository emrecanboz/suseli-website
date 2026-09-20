/**
 * Ana sayfa — sunucu bileşeni.
 *
 * İçerik Sanity'den burada çekilir ve HomeClient'a props olarak verilir.
 * Böylece ürünler arama motorları tarafından da görülür (eski localStorage
 * yönteminde görünmüyordu).
 */
import HomeClient from "./HomeClient";
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

  return (
    <HomeClient
      settings={settings}
      categories={categories}
      featured={featured}
    />
  );
}
