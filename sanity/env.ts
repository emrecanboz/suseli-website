/**
 * Sanity bağlantı ayarları.
 *
 * Proje kimliği ve veri kümesi ortam değişkenlerinden okunur. Vercel'de
 * bu iki değişkeni tanımlamak yeterli; kodu değiştirmeye gerek yok.
 *
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *
 * ÖNEMLİ: Değişkenler tanımlı değilse hata fırlatılmaz. Site yine build
 * alır ve çalışır; sadece Sanity'den içerik çekilmez. Böylece yarım
 * kurulum canlı siteyi çökertmez.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-01";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Sanity kurulumu tamamlanmış mı? */
export const isSanityConfigured = projectId.length > 0;
