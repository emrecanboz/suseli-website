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
  address: "Bursa · Türkiye",
  footerText:
    "Bursa merkezli, mimari oranlarda parça üreten yaratıcı stüdyo. Her tasarım atölyemizde ellerimizle hayata geçer.",
  logo: null,
};

/**
 * Sanity'de kategori tanımlanmadığı sürece kullanılan yedek liste.
 *
 * Kapak görselleri ürün fotoğrafı değil, malzeme ve ışık kareleridir
 * (beton, cam kenarı, yansıma). Panelden kategori kapağı yüklediğinde
 * bunlar otomatik olarak devre dışı kalır.
 */
export const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: "yemek-masasi",
    title: "Yemek Masası",
    subtitle: "01 — Sofra Mimarisi",
    description:
      "Cam, masif ahşap ve ayna detaylarıyla kurgulanmış ölçeklenebilir yemek masaları.",
    image:
      "/gorseller/kat-yemek-masasi.jpg",
  },
  {
    id: "orta-sehpa",
    title: "Orta Sehpa",
    subtitle: "02 — Salon Odak Noktası",
    description:
      "Heykelsi formlar ve düşük profilli minimal silüetlerle tasarlanmış orta sehpalar.",
    image:
      "/gorseller/kat-orta-sehpa.jpg",
  },
  {
    id: "dekorasyon",
    title: "Dekorasyon",
    subtitle: "03 — Atmosfer Objeleri",
    description:
      "Mekânın karakterini tanımlayan, sınırlı sayıda üretilmiş atölye objeleri.",
    image:
      "/gorseller/kat-dekorasyon.jpg",
  },
  {
    id: "ayna",
    title: "Ayna",
    subtitle: "04 — Işık ve Yansıma",
    description:
      "Mimari oranlara göre tasarlanan, çerçevesiz ve heykelsi ayna koleksiyonu.",
    image:
      "/gorseller/kat-ayna.jpg",
  },
  {
    id: "tasarim",
    title: "Tasarım",
    subtitle: "05 — Özel Projeler",
    description:
      "Konseptten üretime — mimari mekânlar için bütüncül iç mekân tasarım hizmeti.",
    image:
      "/gorseller/kat-tasarim.jpg",
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

/**
 * Instagram şeridi — sahte bir akış göstermiyoruz.
 *
 * Buradaki kareler stüdyonun kendi malzeme/ışık çalışmalarıdır; bölüm
 * başlığı da "atölyeden fotoğraf" iddiası taşımayacak şekilde yazıldı.
 * Gerçek Instagram gönderileri bağlandığında burası değişecek.
 */
export const INSTAGRAM_POSTS = [
  "/gorseller/galeri-1-cam-kenar.jpg",
  "/gorseller/kat-dekorasyon.jpg",
  "/gorseller/galeri-4-siva.jpg",
  "/gorseller/kat-ayna.jpg",
  "/gorseller/galeri-5-golge.jpg",
  "/gorseller/kat-tasarim.jpg",
];
