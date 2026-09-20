import { createClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

const isDev = process.env.NODE_ENV === "development";

const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Yayında CDN kullanılır (hızlı ve ücretsiz); geliştirmede kapalı,
      // böylece panelde yapılan değişiklik anında görünür.
      useCdn: !isDev,
      perspective: "published",
    })
  : null;

/**
 * Sanity'den veri çeker. Kurulum tamamlanmamışsa ya da sorgu hata
 * verirse siteyi çökertmez — verilen yedek değeri döndürür.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!client) return fallback;
  try {
    const data = await client.fetch<T>(query, params, {
      // Geliştirmede önbellek yok: panelde yayınladığın an sayfayı
      // yenilediğinde görürsün. Yayında 60 saniyelik önbellek var.
      ...(isDev ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
    });
    return data ?? fallback;
  } catch (err) {
    console.error("[sanity] sorgu başarısız:", err);
    return fallback;
  }
}

export { client as sanityClient };
