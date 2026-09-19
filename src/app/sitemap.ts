import type { MetadataRoute } from "next";
import { CATEGORY_SLUGS, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...CATEGORY_SLUGS.map((slug) => ({
      url: `${SITE_URL}/kategori/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
