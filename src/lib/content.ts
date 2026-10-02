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

/** Ürün sayfasındaki teknik detay satırı. */
export interface ProductSpec {
  label: string;
  value: string;
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
  /**
   * Doluysa ürün sayfasında Malzeme/Ölçüler yerine bu liste gösterilir.
   * Fiyat satırı her zaman en alta ayrıca eklenir.
   */
  specs?: ProductSpec[];
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
  address: "Reyhan Mah. 3. Hoşgör Sk. No: 6/1, Osmangazi / Bursa",
  footerText:
    "Bursa merkezli, mimari oranlarda parça üreten yaratıcı stüdyo. Her tasarım atölyemizde ellerimizle hayata geçer.",
  logo: null,
};

/**
 * Sanity'de kategori tanımlanmadığı sürece kullanılan yedek liste.
 *
 * Yemek Masası kapağı SEKİZ'dir; diğerleri şimdilik malzeme ve ışık
 * kareleri (beton, cam kenarı, yansıma). Panelden kategori kapağı
 * yüklediğinde bunlar otomatik olarak devre dışı kalır.
 */
export const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: "yemek-masasi",
    title: "Yemek Masası",
    subtitle: "01 — Sofra Mimarisi",
    description:
      "Cam, masif ahşap ve ayna detaylarıyla kurgulanmış ölçeklenebilir yemek masaları.",
    // SEKİZ'in görselinden kare kapak: masanın etrafına düz fon eklendi.
    // Bu kart ekrana göre yatay (tablet), kareye yakın (geniş ekran) ya da
    // dikey (telefon) oluyor; kare + bol boşluk her durumda masayı kesmeden
    // gösteriyor.
    image: "/urun/sekiz-kapak.jpg",
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
    image: "/urun/yanki-kapak.jpg",
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
    // Atölyede gerçekten üretilmiş bir parça. Görseli, dükkânda çekilen
    // fotoğraftan yapay zekâ ile arka planı temizlenerek üretildi; bu yüzden
    // şimdilik "Tasarım görseli" etiketiyle duruyor. Stüdyo çekimi gelince
    // isRender false yapılacak.
    id: "koleksiyon-sekiz",
    slug: "sekiz",
    title: "SEKİZ",
    category: "Yemek Masası",
    categorySlug: "yemek-masasi",
    // İlk cümle kartlarda da görünür (2-3 satır), en güçlü cümle başta.
    // Paragraflar \n\n ile ayrılır; ürün sayfası satır sonlarını korur.
    description:
      "Sekiz kenarlı cam tabla, birbirine geçen üç cam panelin üzerinde durur. Üstten bakıldığında ayaklar bir çark gibi döner; yandan bakıldığında neredeyse kaybolur, tabla havada asılı gibi görünür.\n\nMutfakta sabah kahvesine, yemek odasında kalabalık bir sofraya aynı sadelikle eşlik eder. Sekizgen formu sayesinde masada kimse köşeye sıkışmaz.",
    image: "/urun/sekiz.jpg",
    images: ["/urun/sekiz.jpg"],
    isRender: true,
    price: "",
    // Aşağıdaki tüm teknik bilgiler kullanıcıdan (27 Eylül). Cam temperli
    // değil — bu bilerek yazılmadı ("temperli" yazmak yanlış olurdu).
    // Bakım satırındaki sıcak kap uyarısı bu yüzden önemli: temperli
    // olmayan cam ani ısı farkında çatlayabilir.
    materials: "15 mm cam — tabla ve ayaklar",
    dimensions: "Genişlik 120 cm · Yükseklik 76 cm",
    specs: [
      { label: "Ölçüler", value: "Genişlik 120 cm · Yükseklik 76 cm" },
      { label: "Malzeme", value: "15 mm cam — tabla ve ayaklar" },
      { label: "Renk", value: "Şeffaf · Folyo uygulamasıyla farklı renk seçenekleri" },
      { label: "Kapasite", value: "4–6 kişi" },
      { label: "Özel üretim", value: "Ölçü ve renk isteğe göre uyarlanır" },
      { label: "Teslim süresi", value: "3–4 hafta" },
      {
        label: "Bakım",
        value:
          "Yumuşak bez ve cam temizleyiciyle silinir. Sıcak kapları doğrudan cama koymayın.",
      },
    ],
  },
  {
    // YANKI — gerçek ürün (sonsuzluk aynası). Metin ve teknik bilgiler
    // kullanıcıdan, onaylı (2 Ekim 2026). Görsel: atölye fotoğrafından
    // Leonardo AI ile mekân içine yerleştirildi → "Tasarım görseli".
    // Gerçekte ön cam bronz tonlu; final (RGB) çekim gelince isRender false.
    id: "koleksiyon-yanki",
    slug: "yanki",
    title: "YANKI",
    category: "Ayna",
    categorySlug: "ayna",
    description:
      "Bronz reflekte camın ardında ışık katman katman çoğalır ve derinleşir. Yalnızca 8 santimetrelik bir kasanın içinde, duvarın ötesine uzanan bir koridor açılır.\n\nIşık kapalıyken sıcak tonlu bir bronz ayna, açıkken mekânın odak noktası. Rengini kumandadan ya da telefondan değiştirebilirsiniz. Yere dayanabilir, duvara da asılabilir.",
    image: "/urun/yanki.jpg",
    images: ["/urun/yanki.jpg"],
    isRender: true,
    price: "",
    materials: "Bronz cam, ayna ve LED ışık",
    dimensions: "180 × 70 cm · Derinlik 8 cm",
    specs: [
      { label: "Ölçüler", value: "180 × 70 cm · Derinlik 8 cm" },
      // Kullanıcı isteği: üretim katmanları (cam/ayna kalınlıkları, LED
      // kanalları) sitede anlatılmıyor, sadece malzemeler yazıyor.
      { label: "Malzeme", value: "Bronz cam, ayna ve LED ışık" },
      { label: "Kasa", value: "MDF" },
      { label: "Işık", value: "RGB LED · Kumanda ve telefondan kontrol" },
      { label: "Elektrik", value: "Fişe takılır" },
      { label: "Kullanım", value: "Yere dayalı ya da duvara asılı" },
      { label: "Özel üretim", value: "İstenilen ölçüde üretilir" },
      {
        label: "Teslim süresi",
        value: "3–4 hafta (atölye yoğunluğuna göre daha erken olabilir)",
      },
      { label: "Bakım", value: "Yumuşak bez ve cam temizleyiciyle silinir." },
    ],
  },
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
export const FALLBACK_FEATURED_SLUGS = ["sekiz", "yanki", "aks", "katman", "ufuk"];
