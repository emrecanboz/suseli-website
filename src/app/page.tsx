"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionLink = motion(Link);

/** Converts a display name to a URL-safe slug: "ATELIER N°7" → "atelier-n7" */
function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ── Admin product type (mirrors admin/page.tsx) ───────────────────────────
interface AdminProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string | null;
  createdAt: string;
}
const ADMIN_STORAGE_KEY = "suseli_admin_products";

// ============================================================
// SÜSELİ Creative Studio — Ultra Premium Catalog Homepage
// Brand Palette: #E3E3DB (cream)  #0243C7 (cobalt)  #2B2B2B (graphite)
// ============================================================

const categories = [
  {
    id: "yemek-masasi",
    title: "Yemek Masası",
    subtitle: "01 — Sofra Mimarisi",
    description: "Mermer, masif ahşap ve cam dokunuşlarıyla kurgulanmış ölçeklenebilir yemek masaları.",
    image: "https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "orta-sehpa",
    title: "Orta Sehpa",
    subtitle: "02 — Salon Odak Noktası",
    description: "Heykelsi formlar ve düşük profilli minimal silüetlerle tasarlanmış orta sehpalar.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "dekorasyon",
    title: "Dekorasyon",
    subtitle: "03 — Atmosfer Objeleri",
    description: "Mekânın karakterini tanımlayan, sınırlı sayıda üretilmiş atölye objeleri.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "ayna",
    title: "Ayna",
    subtitle: "04 — Işık ve Yansıma",
    description: "Mimari oranlara göre tasarlanan, çerçevesiz ve heykelsi ayna koleksiyonu.",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "tasarim",
    title: "Tasarım",
    subtitle: "05 — Özel Projeler",
    description: "Konseptten üretime — mimari mekânlar için bütüncül iç mekân tasarım hizmeti.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85&auto=format&fit=crop",
  },
];

const featuredItems = [
  {
    name: "MONOLITH",
    type: "Yemek Masası",
    material: "Calacatta Mermer / Bronz",
    price: "Talep Üzerine",
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200&q=85&auto=format&fit=crop",
  },
  {
    name: "ORBIT",
    type: "Orta Sehpa",
    material: "Travertin / Cam",
    price: "₺ 48.500",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=85&auto=format&fit=crop",
  },
  {
    name: "LUNA",
    type: "Ayna",
    material: "Pirinç / Füme Cam",
    price: "₺ 22.900",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=85&auto=format&fit=crop",
  },
  {
    name: "ATELIER N°7",
    type: "Dekoratif Obje",
    material: "El Üretimi Seramik",
    price: "₺ 9.400",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&q=85&auto=format&fit=crop",
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?w=1600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1600&q=85&auto=format&fit=crop",
];

const instagramPosts = [
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=85&auto=format&fit=crop",
];

// ============================================================
// Navigation
// ============================================================
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-2xl bg-[#0a0a0a]/60 border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <motion.a
          href="#"
          whileHover={{ letterSpacing: "0.35em" }}
          transition={{ duration: 0.6 }}
          className="text-[#E3E3DB] text-xl md:text-2xl font-light tracking-[0.3em]"
        >
          SÜSEL<span className="text-[#0243C7]">İ</span>
        </motion.a>

        <div className="hidden md:flex items-center gap-10">
          {["Koleksiyon", "Galeri", "Stüdyo", "İletişim"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
              className="text-[#E3E3DB]/70 hover:text-[#E3E3DB] text-sm tracking-[0.2em] uppercase transition-colors duration-500 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#0243C7] group-hover:w-full transition-all duration-500" />
            </motion.a>
          ))}
        </div>

        <motion.a
          href="https://wa.me/905555555555"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E3E3DB]/[0.04] border border-[#E3E3DB]/10 backdrop-blur-xl text-[#E3E3DB] text-xs tracking-[0.2em] uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0243C7] animate-pulse" />
          Randevu
        </motion.a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#E3E3DB] flex flex-col gap-1.5"
        >
          <span className={`w-6 h-px bg-[#E3E3DB] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-px bg-[#E3E3DB] transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-px bg-[#E3E3DB] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/[0.06]"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {["Koleksiyon", "Galeri", "Stüdyo", "İletişim"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#E3E3DB] text-lg tracking-[0.2em] uppercase"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ============================================================
// Hero Section
// ============================================================
function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const text = "ZAMANSIZ".split("");
  const subtext = "TASARIM".split("");

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#1a1a1a]"
    >
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1615529182904-14819c35db37?w=2400&q=90&auto=format&fit=crop"
          alt="SÜSELİ Atelier"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/30 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/40" />
      </motion.div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-[#E3E3DB]/[0.05] to-transparent" />
        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-gradient-to-b from-transparent via-[#E3E3DB]/[0.08] to-transparent" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gradient-to-b from-transparent via-[#E3E3DB]/[0.05] to-transparent" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative h-full flex flex-col justify-center px-6 md:px-16 lg:px-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-12 h-px bg-[#0243C7]" />
          <span className="text-[#E3E3DB]/60 text-xs md:text-sm tracking-[0.4em] uppercase">
            İstanbul · Atölye · 2018
          </span>
        </motion.div>

        <div className="overflow-hidden mb-2">
          <motion.h1 className="flex flex-wrap text-[#E3E3DB] font-light leading-[0.9] text-[18vw] md:text-[14vw] lg:text-[12vw] tracking-[-0.04em]">
            {text.map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  delay: 0.4 + i * 0.06,
                  duration: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-12">
          <motion.h1 className="flex flex-wrap text-[#E3E3DB] font-light leading-[0.9] text-[18vw] md:text-[14vw] lg:text-[12vw] tracking-[-0.04em] italic">
            {subtext.map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  delay: 0.9 + i * 0.06,
                  duration: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
                style={{ color: i === 0 ? "#0243C7" : "#E3E3DB" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1.2 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 max-w-6xl"
        >
          <p className="text-[#E3E3DB]/70 text-base md:text-lg max-w-md leading-relaxed font-light">
            Mimari oranlarda kurgulanmış, her parçası elle üretilen yaşam mekânı objeleri. SÜSELİ; lüksü zamanın ötesine taşıyan İstanbul merkezli yaratıcı stüdyodur.
          </p>

          <div className="flex items-center gap-6">
            <motion.a
              href="#koleksiyon"
              whileHover={{ x: 6 }}
              className="group flex items-center gap-4 text-[#E3E3DB] text-sm tracking-[0.3em] uppercase"
            >
              Koleksiyonu Keşfet
              <span className="w-12 h-px bg-[#E3E3DB] group-hover:w-20 transition-all duration-500" />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[#E3E3DB]/40 text-[10px] tracking-[0.4em] uppercase">
          Kaydır
        </span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-[#E3E3DB]/60 to-transparent"
        />
      </motion.div>

      {/* Corner marks */}
      <div className="absolute top-24 right-6 md:right-12 text-[#E3E3DB]/40 text-[10px] tracking-[0.3em] uppercase hidden md:block">
        <div>N° 2026 · Kış Koleksiyonu</div>
      </div>
    </section>
  );
}

// ============================================================
// Animated Marquee / Typography Section
// ============================================================
function MarqueeSection() {
  return (
    <section className="relative py-16 md:py-24 bg-[#0a0a0a] overflow-hidden border-y border-white/[0.04]">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-12 px-12">
            <span className="text-[#E3E3DB] text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em]">
              Atölye
            </span>
            <span className="text-[#0243C7] text-5xl md:text-7xl lg:text-8xl font-light italic tracking-[-0.02em]">
              Mimari
            </span>
            <span className="text-[#E3E3DB]/40 text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em]">
              Mermer
            </span>
            <span className="text-[#E3E3DB] text-5xl md:text-7xl lg:text-8xl font-light italic tracking-[-0.02em]">
              Pirinç
            </span>
            <span className="text-[#0243C7] text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em]">
              Ahşap
            </span>
            <span className="text-[#E3E3DB]/40 text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em]">
              Cam
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// ============================================================
// Categories — Luxury Cards
// ============================================================
function Categories() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="koleksiyon" ref={ref} className="relative py-32 md:py-48 bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 md:mb-28 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-12 h-px bg-[#0243C7]" />
              <span className="text-[#E3E3DB]/60 text-xs tracking-[0.4em] uppercase">
                Koleksiyon · 2026
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-[#E3E3DB] text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-[-0.03em]"
            >
              Kategoriler
              <br />
              <span className="italic text-[#E3E3DB]/40">arasında dolaşın</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-[#E3E3DB]/60 max-w-sm text-sm md:text-base leading-relaxed font-light"
          >
            Her koleksiyon, mimari bir disiplin ile el işçiliğinin kesişiminde doğar. Aşağıdaki beş alanda parçalarımızı keşfedin.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  index,
  inView,
}: {
  category: typeof categories[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <MotionLink
      href={`/kategori/${category.id}`}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: 0.2 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group relative overflow-hidden rounded-2xl bg-[#161616] border border-white/[0.04] cursor-pointer ${
        index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <div className={`relative ${index === 0 ? "h-[500px] md:h-[640px]" : "h-[460px]"} w-full overflow-hidden`}>
        <motion.div
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />

        {/* Hover glass overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 backdrop-blur-[2px] bg-[#0243C7]/[0.08]"
        />

        {/* Content */}
        <div className="absolute inset-0 p-7 md:p-10 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[#E3E3DB]/50 text-[10px] md:text-xs tracking-[0.4em] uppercase">
              {category.subtitle}
            </span>
            <motion.div
              animate={{ rotate: hovered ? 45 : 0, scale: hovered ? 1.1 : 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-10 h-10 rounded-full bg-[#E3E3DB]/[0.08] backdrop-blur-xl border border-[#E3E3DB]/10 flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 11L11 3M11 3H5M11 3V9" stroke="#E3E3DB" strokeWidth="1" strokeLinecap="square" />
              </svg>
            </motion.div>
          </div>

          <div>
            <motion.h3
              animate={{ y: hovered ? -4 : 0 }}
              transition={{ duration: 0.5 }}
              className={`text-[#E3E3DB] font-light tracking-[-0.02em] mb-3 ${
                index === 0 ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"
              }`}
            >
              {category.title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: hovered ? 1 : 0.7,
                height: hovered ? "auto" : "auto",
              }}
              transition={{ duration: 0.5 }}
              className="text-[#E3E3DB]/60 text-sm md:text-base font-light leading-relaxed max-w-md"
            >
              {category.description}
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: hovered ? "100%" : "30%" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-gradient-to-r from-[#0243C7] to-transparent mt-6"
            />
          </div>
        </div>
      </div>
    </MotionLink>
  );
}

// ============================================================
// Featured Furniture — reads admin products from localStorage
// ============================================================
function Featured() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) setAdminProducts(JSON.parse(stored));
    } catch {}
  }, []);

  const hasAdmin = adminProducts.length > 0;

  return (
    <section className="relative py-32 md:py-48 bg-gradient-to-b from-[#0a0a0a] to-[#111111]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20 md:mb-28">
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-12 h-px bg-[#0243C7]" />
              <span className="text-[#E3E3DB]/60 text-xs tracking-[0.4em] uppercase">
                {hasAdmin ? "Ürünler · Admin Koleksiyonu" : "Seçki · İmza Parçalar"}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-[#E3E3DB] text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-[-0.03em]"
            >
              Öne çıkan
              <br />
              <span className="italic text-[#0243C7]">parçalar</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="md:col-span-6 md:col-start-7 flex items-end"
          >
            <p className="text-[#E3E3DB]/60 text-sm md:text-base leading-relaxed font-light">
              SÜSELİ atölyesinde her parça, doğal malzemenin karakterine saygı duyarak şekillendirilir.
              Aşağıdaki seçki, koleksiyonumuzun en çok talep gören imza parçalarından oluşmaktadır.
            </p>
          </motion.div>
        </div>

        {hasAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {adminProducts.map((product, i) => (
              <AdminProductCard key={product.id} product={product} index={i} inView={inView} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {featuredItems.map((item, i) => (
              <FeaturedCard key={item.name} item={item} index={i} inView={inView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Static fallback card (unchanged design) ───────────────────────────────
function FeaturedCard({
  item,
  index,
  inView,
}: {
  item: typeof featuredItems[0];
  index: number;
  inView: boolean;
}) {
  return (
    <MotionLink
      href={`/urun/${toSlug(item.name)}`}
      initial={{ opacity: 0, y: 80 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: 0.2 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative block"
    >
      <div className="relative h-[480px] md:h-[600px] w-full overflow-hidden rounded-2xl bg-[#161616]">
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
          <div className="backdrop-blur-2xl bg-[#0a0a0a]/40 border border-white/[0.08] rounded-2xl p-6 md:p-7">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-[#E3E3DB]/50 text-[10px] tracking-[0.3em] uppercase mb-2">
                  {item.type}
                </div>
                <h3 className="text-[#E3E3DB] text-2xl md:text-3xl font-light tracking-[-0.02em]">
                  {item.name}
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="shrink-0 w-11 h-11 rounded-full border border-[#E3E3DB]/20 flex items-center justify-center group-hover:bg-[#0243C7] group-hover:border-[#0243C7] transition-all duration-500"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H5M11 3V9" stroke="#E3E3DB" strokeWidth="1" />
                </svg>
              </motion.button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <span className="text-[#E3E3DB]/60 text-xs md:text-sm font-light">
                {item.material}
              </span>
              <span className="text-[#E3E3DB] text-xs md:text-sm tracking-[0.1em]">
                {item.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </MotionLink>
  );
}

// ── Live admin product card ───────────────────────────────────────────────
function AdminProductCard({
  product,
  index,
  inView,
}: {
  product: AdminProduct;
  index: number;
  inView: boolean;
}) {
  return (
    <MotionLink
      href={`/urun/${product.id}`}
      initial={{ opacity: 0, y: 80 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: 0.2 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative block"
    >
      <div className="relative h-[480px] md:h-[600px] w-full overflow-hidden rounded-2xl bg-[#161616]">

        {/* Image or gradient placeholder */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)",
              }}
            />
          )}
        </motion.div>

        {/* Gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/20 to-transparent" />

        {/* Glass info card */}
        <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
          <div className="backdrop-blur-2xl bg-[#0a0a0a]/50 border border-white/[0.08] rounded-2xl p-6 md:p-7">

            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0 flex-1">
                {product.category && (
                  <div className="text-[#E3E3DB]/50 text-[10px] tracking-[0.35em] uppercase mb-2">
                    {product.category}
                  </div>
                )}
                <h3 className="text-[#E3E3DB] text-2xl md:text-3xl font-light tracking-[-0.02em] leading-tight">
                  {product.title}
                </h3>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="shrink-0 w-11 h-11 rounded-full border border-[#E3E3DB]/20 flex items-center justify-center group-hover:bg-[#0243C7] group-hover:border-[#0243C7] transition-all duration-500"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H5M11 3V9" stroke="#E3E3DB" strokeWidth="1" />
                </svg>
              </motion.div>
            </div>

            {product.description && (
              <p className="text-[#E3E3DB]/55 text-xs md:text-sm font-light leading-relaxed line-clamp-2 pt-4 border-t border-white/[0.06]">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </MotionLink>
  );
}

// ============================================================
// Premium Gallery
// ============================================================
function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section id="galeri" ref={ref} className="relative py-32 md:py-48 bg-[#111111] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-12 h-px bg-[#0243C7]" />
            <span className="text-[#E3E3DB]/60 text-xs tracking-[0.4em] uppercase">
              Premium Galeri
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-[#E3E3DB] text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-[-0.03em] max-w-5xl"
          >
            Mekânın
            <br />
            <span className="italic text-[#E3E3DB]/40">yeni sessizliği.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <motion.div style={{ y: y1 }} className="col-span-12 md:col-span-7 relative h-[400px] md:h-[680px] rounded-2xl overflow-hidden">
            <Image src={galleryImages[0]} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a]/40 to-transparent" />
          </motion.div>

          <motion.div style={{ y: y2 }} className="col-span-12 md:col-span-5 grid grid-cols-1 gap-4 md:gap-6">
            <div className="relative h-[300px] md:h-[330px] rounded-2xl overflow-hidden">
              <Image src={galleryImages[1]} alt="" fill className="object-cover" />
            </div>
            <div className="relative h-[300px] md:h-[330px] rounded-2xl overflow-hidden">
              <Image src={galleryImages[2]} alt="" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="col-span-6 md:col-span-4 relative h-[280px] md:h-[440px] rounded-2xl overflow-hidden">
            <Image src={galleryImages[3]} alt="" fill className="object-cover" />
          </motion.div>

          <motion.div style={{ y: y1 }} className="col-span-6 md:col-span-4 relative h-[280px] md:h-[440px] rounded-2xl overflow-hidden">
            <Image src={galleryImages[4]} alt="" fill className="object-cover" />
          </motion.div>

          <motion.div style={{ y: y2 }} className="col-span-12 md:col-span-4 relative h-[280px] md:h-[440px] rounded-2xl overflow-hidden">
            <Image src={galleryImages[5]} alt="" fill className="object-cover" />
            <div className="absolute inset-0 backdrop-blur-sm bg-[#0243C7]/20 flex flex-col items-center justify-center text-center px-6">
              <span className="text-[#E3E3DB]/60 text-[10px] tracking-[0.3em] uppercase mb-3">
                Daha fazlası
              </span>
              <h4 className="text-[#E3E3DB] text-2xl md:text-3xl font-light mb-6">
                Tüm Galeri
              </h4>
              <motion.a
                whileHover={{ x: 4 }}
                href="#"
                className="text-[#E3E3DB] text-xs tracking-[0.3em] uppercase flex items-center gap-3"
              >
                Keşfet
                <span className="w-8 h-px bg-[#E3E3DB]" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// About Studio
// ============================================================
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const stats = [
    { value: "08", label: "Yıllık Tecrübe" },
    { value: "140+", label: "Tamamlanan Proje" },
    { value: "12", label: "Uluslararası Ödül" },
    { value: "06", label: "Atölye Ustası" },
  ];

  return (
    <section id="stüdyo" ref={ref} className="relative py-32 md:py-48 bg-[#E3E3DB] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative h-[500px] md:h-[700px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1400&q=85&auto=format&fit=crop"
                alt="SÜSELİ Stüdyo"
                fill
                className="object-cover"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute -bottom-6 -right-4 md:-bottom-10 md:-right-10 backdrop-blur-2xl bg-[#0a0a0a]/80 border border-white/10 rounded-2xl p-6 md:p-8 max-w-[280px]"
            >
              <div className="text-[#E3E3DB]/50 text-[10px] tracking-[0.3em] uppercase mb-3">
                Atölye Konumu
              </div>
              <div className="text-[#E3E3DB] text-lg md:text-xl font-light leading-snug">
                Çukurcuma · Beyoğlu
                <br />
                İstanbul · Türkiye
              </div>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-7 lg:pl-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-12 h-px bg-[#0243C7]" />
              <span className="text-[#2B2B2B]/60 text-xs tracking-[0.4em] uppercase">
                Stüdyo · Hakkımızda
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-[#2B2B2B] text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-[-0.03em] mb-10"
            >
              Form,
              <br />
              <span className="italic text-[#0243C7]">malzeme</span>
              <br />
              ve sessizlik.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="space-y-5 text-[#2B2B2B]/80 text-base md:text-lg leading-relaxed font-light max-w-2xl mb-12"
            >
              <p>
                SÜSELİ, 2018 yılında İstanbul'da kurulan; mimari oranlar ve doğal malzemelerin diliyle konuşan bir yaratıcı stüdyodur. Her bir parça, atölyemizde ustalarımızın elleriyle tasarlanır ve üretilir.
              </p>
              <p>
                Tasarım anlayışımız; geçici eğilimlerden uzak, zamansız bir estetiği hedefler. Mekânın ihtiyaç duyduğu sessizliği yakalayan, ölçülü ve heykelsi parçalar üretiyoruz.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 border-t border-[#2B2B2B]/10 pt-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                >
                  <div className="text-[#2B2B2B] text-4xl md:text-5xl font-light tracking-[-0.03em] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[#2B2B2B]/50 text-[10px] tracking-[0.25em] uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// WhatsApp CTA
// ============================================================
function WhatsAppCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="iletişim" ref={ref} className="relative py-32 md:py-48 bg-[#0243C7] overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #E3E3DB 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
      </div>

      {/* Light orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#E3E3DB]/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#E3E3DB]/10 blur-3xl"
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-3 mb-10 px-5 py-2.5 rounded-full backdrop-blur-xl bg-[#E3E3DB]/10 border border-[#E3E3DB]/20"
        >
          <span className="w-2 h-2 rounded-full bg-[#E3E3DB] animate-pulse" />
          <span className="text-[#E3E3DB] text-xs tracking-[0.3em] uppercase">
            Şu an aktif · WhatsApp
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[#E3E3DB] text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-[-0.03em] mb-8 max-w-5xl mx-auto"
        >
          Hayalinizdeki mekân
          <br />
          <span className="italic">birlikte başlasın.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-[#E3E3DB]/80 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-14"
        >
          Özel projeler, katalog talepleri ve tasarım danışmanlığı için bizimle hızlıca WhatsApp üzerinden iletişime geçebilirsiniz.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-5"
        >
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/905555555555"
            className="group flex items-center gap-4 px-8 py-5 rounded-full bg-[#E3E3DB] text-[#0243C7] text-sm tracking-[0.2em] uppercase font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp ile İletişim
            <span className="w-10 h-px bg-[#0243C7] group-hover:w-16 transition-all duration-500" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:atelier@suseli.com"
            className="flex items-center gap-3 px-8 py-5 rounded-full border border-[#E3E3DB]/30 text-[#E3E3DB] text-sm tracking-[0.2em] uppercase backdrop-blur-xl"
          >
            atelier@suseli.com
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// Instagram Showcase
// ============================================================
function Instagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="relative py-32 md:py-44 bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-20 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-12 h-px bg-[#0243C7]" />
              <span className="text-[#E3E3DB]/60 text-xs tracking-[0.4em] uppercase">
                @suseli.studio · Instagram
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-[#E3E3DB] text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-[-0.03em]"
            >
              Atölyeden
              <span className="italic text-[#E3E3DB]/40"> anlar.</span>
            </motion.h2>
          </div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            href="https://instagram.com/suseli.studio"
            whileHover={{ x: 6 }}
            className="group flex items-center gap-4 text-[#E3E3DB] text-xs tracking-[0.3em] uppercase"
          >
            Takip Et
            <span className="w-10 h-px bg-[#0243C7] group-hover:w-16 transition-all duration-500" />
          </motion.a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {instagramPosts.map((src, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/suseli.studio"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-[#161616]"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image src={src} alt="" fill className="object-cover" />
              </motion.div>

              <div className="absolute inset-0 bg-[#0243C7]/0 group-hover:bg-[#0243C7]/40 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-500 flex items-center justify-center">
                <svg
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E3E3DB"
                  strokeWidth="1.2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#E3E3DB" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Footer
// ============================================================
function Footer() {
  return (
    <footer className="relative bg-[#2B2B2B] pt-24 md:pt-32 pb-10 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 mb-20">
          <div className="col-span-2 md:col-span-5">
            <div className="text-[#E3E3DB] text-3xl md:text-4xl font-light tracking-[0.2em] mb-6">
              SÜSEL<span className="text-[#0243C7]">İ</span>
            </div>
            <p className="text-[#E3E3DB]/50 text-sm leading-relaxed max-w-md font-light mb-8">
              İstanbul merkezli, mimari oranlarda parça üreten yaratıcı stüdyo. Her tasarım atölyemizde ellerimizle hayata geçer.
            </p>
            <div className="flex items-center gap-3">
              {["IG", "WA", "PI", "BE"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 rounded-full border border-[#E3E3DB]/15 flex items-center justify-center text-[#E3E3DB]/60 text-[10px] tracking-widest hover:bg-[#0243C7] hover:border-[#0243C7] hover:text-[#E3E3DB] transition-all duration-500"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <div className="text-[#E3E3DB]/40 text-[10px] tracking-[0.3em] uppercase mb-5">
              Koleksiyon
            </div>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="text-[#E3E3DB]/80 hover:text-[#E3E3DB] text-sm font-light transition-colors"
                  >
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="text-[#E3E3DB]/40 text-[10px] tracking-[0.3em] uppercase mb-5">
              Stüdyo
            </div>
            <ul className="space-y-3">
              {["Hakkımızda", "Atölye", "Basın", "Kariyer"].map((c) => (
                <li key={c}>
                  <a href="#" className="text-[#E3E3DB]/80 hover:text-[#E3E3DB] text-sm font-light transition-colors">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <div className="text-[#E3E3DB]/40 text-[10px] tracking-[0.3em] uppercase mb-5">
              İletişim
            </div>
            <div className="space-y-3 text-[#E3E3DB]/80 text-sm font-light">
              <div>Çukurcuma Cad. No: 24</div>
              <div>Beyoğlu · İstanbul</div>
              <div className="pt-3">+90 555 555 55 55</div>
              <div>atelier@suseli.com</div>
            </div>
          </div>
        </div>

        {/* Big mark */}
        <div className="border-t border-[#E3E3DB]/10 pt-10">
          <div className="text-[#E3E3DB]/[0.04] text-[20vw] md:text-[18vw] font-light text-center leading-none tracking-[-0.04em] select-none -mb-4 md:-mb-8">
            SÜSELİ
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#E3E3DB]/5">
          <div className="text-[#E3E3DB]/40 text-xs font-light">
            © 2026 SÜSELİ Creative Studio · Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-6 text-[#E3E3DB]/40 text-xs font-light">
            <a href="#" className="hover:text-[#E3E3DB] transition-colors">
              Gizlilik
            </a>
            <a href="#" className="hover:text-[#E3E3DB] transition-colors">
              Kullanım Şartları
            </a>
            <a href="#" className="hover:text-[#E3E3DB] transition-colors">
              KVKK
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// Floating WhatsApp Button
// ============================================================
function FloatingWhatsApp() {
  return (
    <motion.a
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      href="https://wa.me/905555555555"
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0243C7] backdrop-blur-xl border border-[#E3E3DB]/20 flex items-center justify-center shadow-2xl shadow-[#0243C7]/40"
    >
      <span className="absolute inset-0 rounded-full bg-[#0243C7] animate-ping opacity-30" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#E3E3DB" className="relative">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </motion.a>
  );
}

// ============================================================
// Page Component
// ============================================================
export default function Page() {
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <main className="bg-[#0a0a0a] text-[#E3E3DB] antialiased overflow-x-hidden selection:bg-[#0243C7] selection:text-[#E3E3DB]">
      <Navigation />
      <Hero />
      <MarqueeSection />
      <Categories />
      <Featured />
      <Gallery />
      <About />
      <WhatsAppCTA />
      <Instagram />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
