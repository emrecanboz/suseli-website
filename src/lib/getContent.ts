import "server-only";

import type { Image } from "sanity";

import { sanityFetch } from "../../sanity/lib/client";
import { urlForImage } from "../../sanity/lib/image";
import {
  categoriesQuery,
  categoryBySlugQuery,
  featuredProductsQuery,
  productBySlugQuery,
  productsByCategoryQuery,
  siteSettingsQuery,
} from "../../sanity/lib/queries";
import {
  DEFAULT_SETTINGS,
  FALLBACK_CATEGORIES,
  type CategoryItem,
  type ProductItem,
  type SiteSettings,
} from "./content";

// ── Sanity'den dönen ham şekiller ────────────────────────────────────────
interface RawSettings {
  siteName?: string;
  logo?: Image;
  heroTitle?: string;
  heroSubtitle?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  address?: string;
  footerText?: string;
}

interface RawCategory {
  _id: string;
  title?: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  image?: Image;
}

interface RawProduct {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  price?: string;
  materials?: string;
  dimensions?: string;
  categoryTitle?: string;
  categorySlug?: string;
  images?: Image[];
}

// ── Dönüştürücüler ───────────────────────────────────────────────────────
function toCategory(c: RawCategory): CategoryItem | null {
  if (!c.slug || !c.title) return null;
  // Panelde kapak görseli yüklenmemişse, aynı slug'a sahip yedek
  // kategorinin görseline düşeriz. Böylece kart boş kalmaz.
  const fallback = FALLBACK_CATEGORIES.find((f) => f.id === c.slug);
  return {
    id: c.slug,
    title: c.title,
    subtitle: c.subtitle ?? "",
    description: c.description ?? "",
    image: urlForImage(c.image, 1400) ?? fallback?.image ?? "",
  };
}

function toProduct(p: RawProduct): ProductItem | null {
  if (!p.slug || !p.title) return null;
  const images = (p.images ?? [])
    .map((img) => urlForImage(img, 1600))
    .filter((u): u is string => Boolean(u));
  return {
    id: p._id,
    slug: p.slug,
    title: p.title,
    category: p.categoryTitle ?? "",
    categorySlug: p.categorySlug ?? "",
    description: p.description ?? "",
    image: images[0] ?? null,
    images,
    price: p.price ?? "",
    materials: p.materials ?? "",
    dimensions: p.dimensions ?? "",
  };
}

// ── Dışa açılan okuyucular ───────────────────────────────────────────────

export async function getSettings(): Promise<SiteSettings> {
  const raw = await sanityFetch<RawSettings | null>(siteSettingsQuery, {}, null);
  if (!raw) return DEFAULT_SETTINGS;

  // Panelde boş bırakılan her alan varsayılana düşer — böylece yarım
  // doldurulmuş ayarlar siteyi boşaltmaz.
  return {
    siteName: raw.siteName || DEFAULT_SETTINGS.siteName,
    heroTitle: raw.heroTitle || DEFAULT_SETTINGS.heroTitle,
    heroSubtitle: raw.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle,
    whatsapp: raw.whatsapp || DEFAULT_SETTINGS.whatsapp,
    instagram: raw.instagram || DEFAULT_SETTINGS.instagram,
    // E-posta bilinçli olarak boşaltılabilmeli: boşsa sitede gösterilmez.
    email: raw.email ?? DEFAULT_SETTINGS.email,
    address: raw.address || DEFAULT_SETTINGS.address,
    footerText: raw.footerText || DEFAULT_SETTINGS.footerText,
    logo: urlForImage(raw.logo, 320),
  };
}

export async function getCategories(): Promise<CategoryItem[]> {
  const raw = await sanityFetch<RawCategory[]>(categoriesQuery, {}, []);
  const mapped = raw.map(toCategory).filter((c): c is CategoryItem => c !== null);
  // Panelde hiç kategori yoksa yedek listeyi göster.
  return mapped.length > 0 ? mapped : FALLBACK_CATEGORIES;
}

export async function getCategory(slug: string): Promise<CategoryItem | null> {
  const raw = await sanityFetch<RawCategory | null>(
    categoryBySlugQuery,
    { slug },
    null,
  );
  const mapped = raw ? toCategory(raw) : null;
  if (mapped) return mapped;
  return FALLBACK_CATEGORIES.find((c) => c.id === slug) ?? null;
}

export async function getFeaturedProducts(): Promise<ProductItem[]> {
  const raw = await sanityFetch<RawProduct[]>(featuredProductsQuery, {}, []);
  return raw.map(toProduct).filter((p): p is ProductItem => p !== null);
}

export async function getProductsByCategory(
  slug: string,
): Promise<ProductItem[]> {
  const raw = await sanityFetch<RawProduct[]>(
    productsByCategoryQuery,
    { slug },
    [],
  );
  return raw.map(toProduct).filter((p): p is ProductItem => p !== null);
}

export async function getProduct(slug: string): Promise<ProductItem | null> {
  const raw = await sanityFetch<RawProduct | null>(
    productBySlugQuery,
    { slug },
    null,
  );
  return raw ? toProduct(raw) : null;
}
