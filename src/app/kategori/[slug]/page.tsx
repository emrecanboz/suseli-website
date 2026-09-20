/**
 * Kategori sayfası — sunucu bileşeni.
 *
 * Kategori bilgisi ve ürünler Sanity'den burada çekilir.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategoryClient from "./CategoryClient";
import { getCategory, getProductsByCategory } from "@/lib/getContent";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getCategory(slug);
  if (!meta) return { title: "Bulunamadı" };
  return {
    title: meta.title,
    description: meta.description || undefined,
    alternates: { canonical: `/kategori/${meta.id}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;

  const [meta, products] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
  ]);

  // Tanımsız bir kategori adresi artık boş sayfa değil, düzgün 404 döner.
  if (!meta) notFound();

  return <CategoryClient meta={meta} products={products} />;
}
