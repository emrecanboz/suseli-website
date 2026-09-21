/**
 * Site içeriğinin ortak tipleri ve yedek değerleri.
 *
 * Sanity'de henüz içerik yoksa ya da bağlantı kurulamazsa site bu
 * yedek değerlerle çalışmaya devam eder — hiçbir zaman boş sayfa
 * göstermez.
 */

export interface SiteSettings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsapp: string;
  instagram: string;
  email: string;
  address: string;
  footerText: string;
  /** Çözümlenmiş görsel adresi; yoksa /logo.png kullanılır. */
  logo: string | null;
}

export interface CategoryItem {
  /** Adres parçası — /kategori/<id> */
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface ProductItem {
  id: string;
  /** Adres parçası — /urun/<slug> */
  slug: string;
  title: string;
  /** Kategori adı (kartlarda üst etiket olarak görünür). */
  category: string;
  categorySlug: string;
  description: string;
  /** Kapak görseli. */
  image: string | null;
  images: string[];
  /**
   * Görseller gerçek fotoğraf değil, bilgisayarda üretilmiş tasarım
   * görseliyse true olur. Sitede görselin yanında açıkça belirtilir —
   * render'ı fotoğraf gibi sunmayız.
   */
  isRender: boolean;
  /** Aşağıdakiler boşsa sitede hiç gösterilmez. */
  price: string;
  materials: string;
  dimensions: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "SÜSELİ",
  heroTitle: "ZAMANSIZ",
  heroSubtitle: "TASARIM",
  whatsapp: "905333896916",
  instagram: "https://instagram.com/suseli.studio",
  email: "info@suseli.studio",
  address: "İstanbul · Türkiye",
  footerText:
    "İstanbul merkezli, mimari oranlarda parça üreten yaratıcı stüdyo. Her tasarım atölyemizde ellerimizle hayata geçer.",
  logo: null,
};

/**
 * Sanity'de kategori tanımlanmadığı sürece kullanılan yedek liste.
 * Görseller geçici stok fotoğraflarıdır; panelden kendi fotoğrafların
 * yüklendiğinde otomatik olarak devre dışı kalır.
 */
export const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: "yemek-masasi",
    title: "Yemek Masası",
    subtitle: "01 — Sofra Mimarisi",
    description:
      "Cam, masif ahşap ve ayna detaylarıyla kurgulanmış ölçeklenebilir yemek masaları.",
    image:
      "https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "orta-sehpa",
    title: "Orta Sehpa",
    subtitle: "02 — Salon Odak Noktası",
    description:
      "Heykelsi formlar ve düşük profilli minimal silüetlerle tasarlanmış orta sehpalar.",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "dekorasyon",
    title: "Dekorasyon",
    subtitle: "03 — Atmosfer Objeleri",
    description:
      "Mekânın karakterini tanımlayan, sınırlı sayıda üretilmiş atölye objeleri.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "ayna",
    title: "Ayna",
    subtitle: "04 — Işık ve Yansıma",
    description:
      "Mimari oranlara göre tasarlanan, çerçevesiz ve heykelsi ayna koleksiyonu.",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "tasarim",
    title: "Tasarım",
    subtitle: "05 — Özel Projeler",
    description:
      "Konseptten üretime — mimari mekânlar için bütüncül iç mekân tasarım hizmeti.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85&auto=format&fit=crop",
  },
];

/**
 * Galeri — malzeme ve ışık çalışmaları.
 *
 * Bunlar ürün fotoğrafı DEĞİLDİR ve öyle sunulmaz: cam kenarı, beton,
 * sıva ve ışık izi gibi doku/atmosfer kareleridir. Galeri başlığının
 * altında bu açıkça yazar.
 *
 * Kaynak: stüdyonun kendi görsel çalışmalarından alınan kırpımlar.
 * Tanınabilir bir ürün formu bilinçli olarak dışarıda bırakıldı.
 */
export const GALLERY_IMAGES = [
  "/gorseller/galeri-1-cam-kenar.jpg",
  "/gorseller/galeri-2-beton.jpg",
  "/gorseller/galeri-3-isik-izi.jpg",
  "/gorseller/galeri-4-siva.jpg",
  "/gorseller/galeri-5-golge.jpg",
  "/gorseller/galeri-6-gece.jpg",
];

export const INSTAGRAM_POSTS = [
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=85&auto=format&fit=crop",
];
