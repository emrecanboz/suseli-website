"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";

const MotionLink = motion(Link);

// ── Types ─────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string | null;
  createdAt: string;
}

// ── Category metadata ─────────────────────────────────────────────────────
const CATEGORY_META: Record<
  string,
  { title: string; subtitle: string; description: string; accent: string }
> = {
  "yemek-masasi": {
    title: "Yemek Masası",
    subtitle: "01 — Sofra Mimarisi",
    description:
      "Cam, masif ahşap ve ayna detaylarıyla kurgulanmış ölçeklenebilir yemek masaları. Her parça, sofrayı bir ritüele dönüştürmek için tasarlanmıştır.",
    accent: "#0243C7",
  },
  "orta-sehpa": {
    title: "Orta Sehpa",
    subtitle: "02 — Salon Odak Noktası",
    description:
      "Heykelsi formlar ve düşük profilli minimal silüetlerle tasarlanmış orta sehpalar. Salonun kalbine yerleşen, sessiz ama güçlü bir varlık.",
    accent: "#0243C7",
  },
  dekorasyon: {
    title: "Dekorasyon",
    subtitle: "03 — Atmosfer Objeleri",
    description:
      "Mekânın karakterini tanımlayan, sınırlı sayıda üretilmiş atölye objeleri. Her nesne, sadeliğin en derin ifadesini taşır.",
    accent: "#0243C7",
  },
  ayna: {
    title: "Ayna",
    subtitle: "04 — Işık ve Yansıma",
    description:
      "Mimari oranlara göre tasarlanan, çerçevesiz ve heykelsi ayna koleksiyonu. Işığı yeniden yorumlayan, mekânı ikiye katlayan formlar.",
    accent: "#0243C7",
  },
  tasarim: {
    title: "Tasarım",
    subtitle: "05 — Özel Projeler",
    description:
      "Konseptten üretime — mimari mekânlar için bütüncül iç mekân tasarım hizmeti. Hayal ettiğiniz mekânı birlikte inşa ediyoruz.",
    accent: "#0243C7",
  },
};

// Keywords used to fuzzy-match product.category against the slug
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "yemek-masasi": ["yemek masası", "yemek-masasi", "yemek masa", "dining"],
  "orta-sehpa": ["orta sehpa", "orta-sehpa", "sehpa", "coffee table", "center"],
  dekorasyon: ["dekorasyon", "dekor", "obje", "aksesuar", "decoration"],
  ayna: ["ayna", "aynalar", "mirror"],
  tasarim: ["tasarım", "tasarim", "design", "özel", "proje"],
};

function matchesSlug(productCategory: string, slug: string): boolean {
  if (!productCategory) return false;
  const norm = productCategory.toLowerCase().trim();
  const keywords = CATEGORY_KEYWORDS[slug] ?? [slug];
  return keywords.some((kw) => norm.includes(kw));
}

const STORAGE_KEY = "suseli_admin_products";

// ── Page ──────────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug ?? "");

  const meta = CATEGORY_META[slug] ?? {
    title: slug,
    subtitle: "Koleksiyon",
    description: "",
    accent: "#0243C7",
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const all: Product[] = JSON.parse(raw);
        // localStorage yalnızca tarayıcıda okunabilir; SSR/prerender sırasında
        // erişilemediği için bu senkronizasyon effect içinde yapılmak zorunda.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProducts(all.filter((p) => matchesSlug(p.category, slug)));
      }
    } catch {}
    setLoaded(true);
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#E3E3DB] antialiased overflow-x-hidden selection:bg-[#0243C7] selection:text-[#E3E3DB]"
      style={{ fontFamily: "var(--font-geist-sans, 'Inter', sans-serif)" }}
    >
      <TopBar />
      <CategoryHero meta={meta} />
      <ProductGrid products={products} loaded={loaded} meta={meta} />
      <BottomCTA />
    </main>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────
function TopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-2xl bg-[#0a0a0a]/70 border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        {/* Back */}
        <motion.a
          href="/"
          whileHover={{ x: -4 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 text-[#E3E3DB]/70 hover:text-[#E3E3DB] text-xs tracking-[0.25em] uppercase transition-colors duration-300"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M13 4L7 10L13 16"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Ana Sayfa
        </motion.a>

        {/* Logo */}
        <motion.a
          href="/"
          whileHover={{ opacity: 0.8 }}
          transition={{ duration: 0.4 }}
          className="flex items-center"
        >
          <Image
            src="/logo.png"
            alt="SÜSELİ"
            width={160}
            height={44}
            priority
            unoptimized
            style={{ height: "36px", width: "auto", objectFit: "contain", display: "block" }}
          />
        </motion.a>

        {/* WhatsApp pill */}
        <motion.a
          href="https://wa.me/905333896916"
          whileHover={{ scale: 1.04 }}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E3E3DB]/[0.04] border border-[#E3E3DB]/10 text-[#E3E3DB] text-xs tracking-[0.2em] uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0243C7] animate-pulse" />
          Randevu
        </motion.a>
      </div>
    </motion.header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
function CategoryHero({
  meta,
}: {
  meta: { title: string; subtitle: string; description: string };
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const titleChars = meta.title.split("");

  return (
    <section
      ref={heroRef}
      className="relative h-[70vh] min-h-[520px] flex items-end overflow-hidden bg-[#0f0f0f]"
    >
      {/* Subtle grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-[#E3E3DB]/[0.04] to-transparent" />
        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-gradient-to-b from-transparent via-[#E3E3DB]/[0.06] to-transparent" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gradient-to-b from-transparent via-[#E3E3DB]/[0.04] to-transparent" />
      </div>

      {/* Cobalt orb */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#0243C7] blur-[160px] pointer-events-none"
      />

      <motion.div
        style={{ y, opacity }}
        className="relative w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-16 md:pb-24"
      >
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-10 h-px bg-[#0243C7]" />
          <span className="text-[#E3E3DB]/50 text-xs tracking-[0.45em] uppercase">
            {meta.subtitle}
          </span>
        </motion.div>

        {/* Animated title */}
        <div className="overflow-hidden mb-8">
          <h1 className="flex flex-wrap text-[#E3E3DB] font-light leading-[0.9] text-[14vw] md:text-[10vw] lg:text-[9vw] tracking-[-0.04em]">
            {titleChars.map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  delay: 0.3 + i * 0.06,
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
                style={char === " " ? { width: "0.3em" } : {}}
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="text-[#E3E3DB]/60 text-base md:text-lg max-w-xl leading-relaxed font-light"
        >
          {meta.description}
        </motion.p>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}

// ── Product grid ──────────────────────────────────────────────────────────
function ProductGrid({
  products,
  loaded,
  meta,
}: {
  products: Product[];
  loaded: boolean;
  meta: { title: string };
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section ref={ref} className="relative py-24 md:py-36 bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">

        {/* Section label + count */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-16 md:mb-20"
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-px bg-[#0243C7]" />
            <span className="text-[#E3E3DB]/50 text-xs tracking-[0.4em] uppercase">
              {meta.title} Koleksiyonu
            </span>
          </div>
          {loaded && (
            <span className="text-[#E3E3DB]/30 text-xs tracking-[0.3em]">
              {products.length} ürün
            </span>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {!loaded ? (
            // Loading skeleton
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[420px] rounded-2xl bg-[#161616] animate-pulse"
                />
              ))}
            </motion.div>
          ) : products.length === 0 ? (
            // Empty state
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#161616] border border-white/[0.06] flex items-center justify-center mb-8">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  className="text-[#E3E3DB]/30"
                >
                  <rect
                    x="4"
                    y="4"
                    width="20"
                    height="20"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M9 14h10M14 9v10"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-[#E3E3DB]/40 text-sm tracking-[0.3em] uppercase mb-3">
                Bu kategoride henüz ürün yok
              </p>
              <p className="text-[#E3E3DB]/25 text-xs max-w-xs leading-relaxed">
                Admin panelinden ürün ekleyerek bu sayfayı doldurun.
              </p>
              <MotionLink
                href="/admin"
                whileHover={{ scale: 1.04 }}
                className="mt-10 px-8 py-3.5 rounded-full border border-[#E3E3DB]/15 text-[#E3E3DB]/60 text-xs tracking-[0.25em] uppercase hover:border-[#0243C7] hover:text-[#E3E3DB] transition-all duration-500"
              >
                Admin Panele Git
              </MotionLink>
            </motion.div>
          ) : (
            // Product grid
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  inView={inView}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Product card ──────────────────────────────────────────────────────────
function ProductCard({
  product,
  index,
  inView,
}: {
  product: Product;
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <MotionLink
      href={`/urun/${product.id}`}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: 0.1 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#141414] border border-white/[0.04] cursor-pointer"
    >
      {/* Image area */}
      <div className="relative h-[300px] md:h-[340px] overflow-hidden bg-[#0f0f0f] flex-shrink-0">
        {product.image ? (
          <motion.div
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          // Gradient placeholder when no image
          <motion.div
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #111827 0%, #1e3a5f 50%, #0f172a 100%)",
            }}
          >
            {/* Subtle pattern */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #E3E3DB 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#E3E3DB]/10 text-7xl font-light tracking-[-0.04em]">
                {product.title.charAt(0)}
              </span>
            </div>
          </motion.div>
        )}

        {/* Top overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/60 via-transparent to-transparent pointer-events-none" />

        {/* Category badge */}
        {product.category && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + index * 0.12, duration: 0.7 }}
            className="absolute top-5 left-5"
          >
            <span className="px-3 py-1.5 rounded-full bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/[0.08] text-[#E3E3DB]/70 text-[10px] tracking-[0.3em] uppercase">
              {product.category}
            </span>
          </motion.div>
        )}

        {/* Hover arrow */}
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0,
            scale: hovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.4 }}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#0243C7] flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 11L11 3M11 3H5M11 3V9"
              stroke="#E3E3DB"
              strokeWidth="1.2"
              strokeLinecap="square"
            />
          </svg>
        </motion.div>
      </div>

      {/* Text content */}
      <div className="flex flex-col flex-1 p-6 md:p-7">
        <h3 className="text-[#E3E3DB] text-xl md:text-2xl font-light tracking-[-0.02em] leading-tight mb-3 group-hover:text-white transition-colors duration-300">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-[#E3E3DB]/50 text-sm font-light leading-relaxed line-clamp-3 flex-1">
            {product.description}
          </p>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.05]">
          <span className="text-[#E3E3DB]/30 text-[10px] tracking-[0.25em] uppercase">
            {new Date(product.createdAt).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>

          <motion.span
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-[#0243C7] text-xs tracking-[0.25em] uppercase"
          >
            İncele
            <span className="w-6 h-px bg-[#0243C7]" />
          </motion.span>
        </div>

        {/* Animated underline */}
        <motion.div
          animate={{ width: hovered ? "100%" : "0%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-gradient-to-r from-[#0243C7] to-transparent mt-4"
        />
      </div>
    </MotionLink>
  );
}

// ── Bottom CTA ────────────────────────────────────────────────────────────
function BottomCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-44 bg-[#0f0f0f] overflow-hidden border-t border-white/[0.04]"
    >
      {/* Orb */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#0243C7] blur-[180px] pointer-events-none"
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 justify-center mb-8"
        >
          <span className="w-8 h-px bg-[#0243C7]" />
          <span className="text-[#E3E3DB]/50 text-xs tracking-[0.4em] uppercase">
            SÜSELİ Atölye · İstanbul
          </span>
          <span className="w-8 h-px bg-[#0243C7]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.15 }}
          className="text-[#E3E3DB] text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-[-0.03em] mb-8 max-w-4xl mx-auto"
        >
          Hayalinizdeki parçayı
          <br />
          <span className="italic text-[#E3E3DB]/50">birlikte tasarlayalım.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.35 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://wa.me/905333896916"
            className="flex items-center gap-4 px-8 py-4 rounded-full bg-[#0243C7] text-[#E3E3DB] text-xs tracking-[0.2em] uppercase font-medium"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp ile İletişim
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="/"
            className="flex items-center gap-3 px-8 py-4 rounded-full border border-[#E3E3DB]/15 text-[#E3E3DB]/70 text-xs tracking-[0.2em] uppercase hover:border-[#E3E3DB]/30 hover:text-[#E3E3DB] transition-all duration-500"
          >
            Tüm Koleksiyona Dön
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
