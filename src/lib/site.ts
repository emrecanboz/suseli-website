/**
 * Site genelinde kullanılan tek kaynak.
 *
 * Domain: suselistudio.com (Spaceship'te kayıtlı, Vercel'e bağlı).
 * Farklı bir domaine geçilirse Vercel'de NEXT_PUBLIC_SITE_URL ortam
 * değişkenini tanımlamak yeterli; kodu değiştirmeye gerek yok.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://suselistudio.com"
).replace(/\/$/, "");

export const SITE_NAME = "SÜSELİ Creative Studio";

export const SITE_DESCRIPTION =
  "Bursa merkezli yaratıcı stüdyo. Yemek masası, orta sehpa, dekorasyon, ayna ve özel tasarım projeleri.";

/** Kategori slug'ları — src/app/kategori/[slug]/page.tsx içindeki CATEGORY_META ile aynı. */
export const CATEGORY_SLUGS = [
  "yemek-masasi",
  "orta-sehpa",
  "dekorasyon",
  "ayna",
  "tasarim",
] as const;
