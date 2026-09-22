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

/**
 * Koleksiyon — sipariş üzerine üretilen 9 parça.
 *
 * SÜSELİ stoktan satmıyor: her parça sipariş üzerine üretiliyor. Bu yüzden
 * katalogda ürün fotoğrafı değil, parçanın kendi teknik çizimi duruyor.
 * `isRender: true` olduğu için sitede "Tasarım görseli" etiketiyle gösterilir
 * — çizimi fotoğraf gibi sunmuyoruz.
 *
 * Fiyat, ölçü ve malzeme alanları BİLEREK boş: gerçek değerler üretim
 * kararına bağlı ve uydurulmaz. Boş kaldıkları sürece sitede hiç görünmez,
 * fiyat yerine "Talep Üzerine" yazar.
 *
 * Panelden aynı adresle (slug) bir ürün yayınlandığında Sanity kazanır ve
 * bu liste tamamen devre dışı kalır.
 */
export const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: "koleksiyon-aks",
    slug: "aks",
    title: "AKS",
    category: "Yemek Masası",
    categorySlug: "yemek-masasi",
    description:
      "Tek parça cam tabla, altında birbirine göre kaydırılmış iki cam kanat üzerinde durur. Masanın deseni eklenmez; gün ilerledikçe tablanın altında yer değiştiren gölge çizgisiyle kendiliğinden oluşur.",
    image: "/cizim/aks.png",
    images: ["/cizim/aks.png"],
    isRender: true,
    price: "",
    materials: "",
    dimensions: "",
  },
  {
    id: "koleksiyon-fay",
    slug: "fay",
    title: "FAY",
    category: "Yemek Masası",
    categorySlug: "yemek-masasi",
    description:
      "Camın altında, merkezden kaydırılmış tek bir masif ahşap omurga uzanır. Üstten bakıldığında ahşap, camın içinden geçen bir fay hattı gibi okunur; masayı taşıyan şey aynı zamanda onu tanımlar.",
    image: "/cizim/fay.png",
    images: ["/cizim/fay.png"],
    isRender: true,
    price: "",
    materials: "",
    dimensions: "",
  },
  {
    id: "koleksiyon-katman",
    slug: "katman",
    title: "KATMAN",
    category: "Orta Sehpa",
    categorySlug: "orta-sehpa",
    description:
      "Üç cam düzlem, üç farklı yükseklikte birbirini kısmen örter. Renk boyayarak değil üst üste koyarak elde edilir: örtüşen bölgelerde dördüncü bir ton kendiliğinden doğar.",
    image: "/cizim/katman.png",
    images: ["/cizim/katman.png"],
    isRender: true,
    price: "",
    materials: "",
    dimensions: "",
  },
  {
    id: "koleksiyon-cekul",
    slug: "cekul",
    title: "ÇEKÜL",
    category: "Orta Sehpa",
    categorySlug: "orta-sehpa",
    description:
      "Aynalı taban zemini yansıtır, cam tabla merkezden kayar. Sehpanın yere değmiyormuş gibi durması için hiçbir parça eklenmez; bunu yapan tek şey aynanın kendisidir.",
    image: "/cizim/cekul.png",
    images: ["/cizim/cekul.png"],
    isRender: true,
    price: "",
    materials: "",
    dimensions: "",
  },
  {
    id: "koleksiyon-ufuk",
    slug: "ufuk",
    title: "UFUK",
    category: "Ayna",
    categorySlug: "ayna",
    description:
      "Çerçevesiz bir ayna ve yalnızca alt kenarından sızan tek bir ışık hattı. Duvarda kalan şey aynanın kendisi değil, altındaki yatay çizgidir.",
    image: "/cizim/ufuk.png",
    images: ["/cizim/ufuk.png"],
    isRender: true,
    price: "",
    materials: "",
    dimensions: "",
  },
  {
    id: "koleksiyon-esik",
    slug: "esik",
    title: "EŞİK",
    category: "Ayna",
    categorySlug: "ayna",
    description:
      "Tam boy aynanın önünden, alt üçte birde ince bir ahşap raf geçer. Raf yansımada devam ediyormuş gibi görünür; ayna bir yüzey olmaktan çıkıp eşiğe dönüşür.",
    image: "/cizim/esik.png",
    images: ["/cizim/esik.png"],
    isRender: true,
    price: "",
    materials: "",
    dimensions: "",
  },
  {
    id: "koleksiyon-menzil",
    slug: "menzil",
    title: "MENZİL",
    category: "Dekorasyon",
    categorySlug: "dekorasyon",
    description:
      "Üst üste bindirilmiş cam dilimlerin her biri bir öncekinden birkaç derece döner. Işık içinden geçtiğinde sabit duran gövde, bakan kişi hareket ettikçe burulur.",
    image: "/cizim/menzil.png",
    images: ["/cizim/menzil.png"],
    isRender: true,
    price: "",
    materials: "",
    dimensions: "",
  },
  {
    id: "koleksiyon-kiyi",
    slug: "kiyi",
    title: "KIYI",
    category: "Dekorasyon",
    categorySlug: "dekorasyon",
    description:
      "Üç cam düzlem geçmeli olarak birleşir; bacak düzlemlerinden biri diğerinden belirgin geniştir. Asimetri gizlenmez, parçanın tek kararı olarak öne çıkar.",
    image: "/cizim/kiyi.png",
    images: ["/cizim/kiyi.png"],
    isRender: true,
    price: "",
    materials: "",
    dimensions: "",
  },
  {
    id: "koleksiyon-aralik",
    slug: "aralik",
    title: "ARALIK",
    category: "Tasarım",
    categorySlug: "tasarim",
    description:
      "İki paralel ayna yüzey ve aralarındaki tek ışık hattı. Bölücü panel ya da duvar yüzeyi olarak, ölçüsü ve konumu mekâna göre belirlenir.",
    image: "/cizim/aralik.png",
    images: ["/cizim/aralik.png"],
    isRender: true,
    price: "",
    materials: "",
    dimensions: "",
  },
];

/** Ana sayfada öne çıkan yedek parçalar — her kategoriden biri. */
export const FALLBACK_FEATURED_SLUGS = ["aks", "katman", "ufuk", "menzil"];
