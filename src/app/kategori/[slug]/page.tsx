/**
 * Kategori sayfası — sunucu bileşeni.
 *
 * Kategori bilgisi ve ürünler Sanity'den burada çekilir.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategoryClient from "./CategoryClient";
import { getCategory, getProductsByCategory, getSettings } from "@/lib/getContent";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

// Google'da görünen sayfa başlıkları (kullanıcı onayı, 2 Ekim 2026).
// Sayfadaki büyük başlık panelden gelen kategori adı olarak kalır.
const SEO_BASLIK: Record<string, string> = {
  "yemek-masasi": "Cam Yemek Masası",
  "orta-sehpa": "Cam Orta Sehpa",
  ayna: "Ayna, Bursa'da Özel Ölçü",
  dekorasyon: "Cam ve Ayna Dekorasyon",
  tasarim: "Özel Tasarım Cam Mobilya",
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getCategory(slug);
  if (!meta) return { title: "Bulunamadı" };
  return {
    title: SEO_BASLIK[slug] ?? meta.title,
    description: meta.description || undefined,
    alternates: { canonical: `/kategori/${meta.id}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;

  const [meta, products, settings] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
    getSettings(),
  ]);

  // Tanımsız bir kategori adresi artık boş sayfa değil, düzgün 404 döner.
  if (!meta) notFound();

  return <CategoryClient meta={meta} products={products} whatsapp={settings.whatsapp} />;
}
