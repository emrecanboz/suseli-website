import type { MetadataRoute } from "next";

import { sanityFetch } from "../../sanity/lib/client";
import { allProductSlugsQuery } from "../../sanity/lib/queries";
import { SITE_URL } from "@/lib/site";
import { getCategories, getFallbackProductSlugs } from "@/lib/getContent";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Sanity erişilemezse boş listeye düşer; site haritası yine üretilir.
  const [categories, sanitySlugs] = await Promise.all([
    getCategories(),
    sanityFetch<string[]>(allProductSlugsQuery, {}, []),
  ]);

  // Panelde ürün yoksa site koleksiyon çizimlerini gösteriyor;
  // site haritası da o adresleri içermeli.
  const productSlugs =
    sanitySlugs.length > 0 ? sanitySlugs : getFallbackProductSlugs();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...categories.map((c) => ({
      url: `${SITE_URL}/kategori/${c.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...productSlugs.map((slug) => ({
      url: `${SITE_URL}/urun/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
