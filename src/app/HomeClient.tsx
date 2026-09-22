"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionLink = motion(Link);

import type {
  CategoryItem,
  ProductItem,
  SiteSettings,
} from "@/lib/content";
import { GALLERY_IMAGES, INSTAGRAM_POSTS } from "@/lib/content";

// ============================================================
// SÜSELİ Creative Studio — Ultra Premium Catalog Homepage
// Brand Palette: #E3E3DB (cream)  #0243C7 (cobalt)  #2B2B2B (graphite)
// ============================================================

// ============================================================
// Navigation
// ============================================================
function Navigation({
  logo,
  siteName,
  whatsapp,
}: {
  logo: string | null;
  siteName: string;
  whatsapp: string;
}) {
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
          href="/"
          whileHover={{ opacity: 0.8 }}
          transition={{ duration: 0.4 }}
          className="flex items-center"
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={siteName}
              style={{ height: "36px", width: "auto", objectFit: "contain", display: "block" }}
            />
          ) : (
            <Image
              src="/logo.png"
              alt={siteName}
              width={628}
              height={216}
              priority
              sizes="128px"
              style={{ height: "36px", width: "auto", objectFit: "contain", display: "block" }}
            />
          )}
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
          href={`https://wa.me/${whatsapp}`}
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
function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const text = (title || "ZAMANSIZ").split("");
  const subtext = (subtitle || "TASARIM").split("");

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#1a1a1a]"
    >
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src="/gorseller/hero.jpg"
          alt=""
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
            Bursa · Atölye · 2023
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
            Mimari oranlarda kurgulanmış, her parçası elle üretilen yaşam mekânı objeleri. SÜSELİ; lüksü zamanın ötesine taşıyan Bursa merkezli yaratıcı stüdyodur.
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
              Cam
            </span>
            <span className="text-[#E3E3DB] text-5xl md:text-7xl lg:text-8xl font-light italic tracking-[-0.02em]">
              Ayna
            </span>
            <span className="text-[#0243C7] text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em]">
              Ahşap
            </span>
            <span className="text-[#E3E3DB]/40 text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em]">
              Işık
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
function Categories({ categories }: { categories: CategoryItem[] }) {
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
  category: CategoryItem;
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
          {category.image ? (
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover"
            />
          ) : (
            // Kapak görseli yoksa boş adres yerine sade bir zemin gösterilir.
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#0f0f0f] flex items-center justify-center">
              <span className="text-[#E3E3DB]/10 text-7xl font-light select-none">
                {category.title.charAt(0)}
              </span>
            </div>
          )}
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
function Featured({ products }: { products: ProductItem[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const hasAdmin = products.length > 0;

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
                {hasAdmin ? "Ürünler · Koleksiyon" : "Koleksiyon"}
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
              SÜSELİ atölyesinde her parça; camın, aynanın ve ahşabın
              karakterine saygı duyarak şekillendirilir.
            </p>
          </motion.div>
        </div>

        {hasAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} inView={inView} />
            ))}
          </div>
        ) : (
          /* Admin panelinde henüz ürün yok. Uydurma ürün göstermek yerine
             sade bir boş durum gösteriliyor. */
          <div className="border border-[#E3E3DB]/10 rounded-2xl py-20 md:py-28 px-6 text-center">
            <div className="text-[#E3E3DB]/40 text-[10px] tracking-[0.35em] uppercase mb-5">
              Koleksiyon
            </div>
            <p className="text-[#E3E3DB] text-2xl md:text-3xl font-light tracking-[-0.02em] mb-4">
              Parçalar yakında burada.
            </p>
            <p className="text-[#E3E3DB]/50 text-sm md:text-base font-light max-w-md mx-auto mb-10">
              Koleksiyon hazırlanıyor. Bu süreçte kategorileri inceleyebilir ya da
              bizimle doğrudan iletişime geçebilirsiniz.
            </p>
            <a
              href="#koleksiyon"
              className="inline-flex items-center gap-3 text-[#E3E3DB] text-xs tracking-[0.25em] uppercase border-b border-[#0243C7] pb-2 hover:gap-5 transition-all duration-500"
            >
              Kategorileri Gör
              <span className="text-[#0243C7]">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Live admin product card ───────────────────────────────────────────────
function ProductCard({
  product,
  index,
  inView,
}: {
  product: ProductItem;
  index: number;
  inView: boolean;
}) {
  return (
    <MotionLink
      href={`/urun/${product.slug}`}
      initial={{ opacity: 0, y: 80 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: 0.2 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative block"
    >
      <div
        className={`relative h-[480px] md:h-[600px] w-full overflow-hidden rounded-2xl ${
          product.isRender ? "bg-[#0F0F0F]" : "bg-[#161616]"
        }`}
      >

        {/* Image or gradient placeholder */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            // Teknik çizim/render kırpılmamalı; fotoğraf ise kaplasın.
            <img
              src={product.image}
              alt={product.title}
              className={`w-full h-full ${
                product.isRender ? "object-contain" : "object-cover"
              }`}
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

        {/* Render'ı fotoğraf gibi göstermiyoruz — panelde işaretliyse
            kartın üstünde ince bir etiket çıkar. */}
        {product.isRender && product.image && (
          <div className="absolute top-5 left-5 md:top-6 md:left-6 backdrop-blur-xl bg-[#0a0a0a]/45 border border-white/[0.12] rounded-full px-3 py-1.5">
            <span className="text-[#E3E3DB]/70 text-[9px] tracking-[0.28em] uppercase">
              Tasarım Görseli
            </span>
          </div>
        )}

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

          {/* Bu kareler ürün fotoğrafı değil; malzeme ve ışık çalışması.
              Ziyaretçiyi yanıltmamak için açıkça yazıyoruz. */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[#E3E3DB]/35 text-xs md:text-sm font-light mt-8 max-w-md leading-relaxed"
          >
            Malzeme ve ışık çalışmaları — cam kenarı, beton, sıva.
            Ürün görselleri koleksiyon bölümünde.
          </motion.p>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <motion.div style={{ y: y1 }} className="col-span-12 md:col-span-7 relative h-[400px] md:h-[680px] rounded-2xl overflow-hidden">
            <Image src={GALLERY_IMAGES[0]} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a]/40 to-transparent" />
          </motion.div>

          <motion.div style={{ y: y2 }} className="col-span-12 md:col-span-5 grid grid-cols-1 gap-4 md:gap-6">
            <div className="relative h-[300px] md:h-[330px] rounded-2xl overflow-hidden">
              <Image src={GALLERY_IMAGES[1]} alt="" fill className="object-cover" />
            </div>
            <div className="relative h-[300px] md:h-[330px] rounded-2xl overflow-hidden">
              <Image src={GALLERY_IMAGES[2]} alt="" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="col-span-6 md:col-span-4 relative h-[280px] md:h-[440px] rounded-2xl overflow-hidden">
            <Image src={GALLERY_IMAGES[3]} alt="" fill className="object-cover" />
          </motion.div>

          <motion.div style={{ y: y1 }} className="col-span-6 md:col-span-4 relative h-[280px] md:h-[440px] rounded-2xl overflow-hidden">
            <Image src={GALLERY_IMAGES[4]} alt="" fill className="object-cover" />
          </motion.div>

          <motion.div style={{ y: y2 }} className="col-span-12 md:col-span-4 relative h-[280px] md:h-[440px] rounded-2xl overflow-hidden">
            <Image src={GALLERY_IMAGES[5]} alt="" fill className="object-cover" />
            <div className="absolute inset-0 backdrop-blur-sm bg-[#0243C7]/20 flex flex-col items-center justify-center text-center px-6">
              <span className="text-[#E3E3DB]/60 text-[10px] tracking-[0.3em] uppercase mb-3">
                Daha fazlası
              </span>
              <h4 className="text-[#E3E3DB] text-2xl md:text-3xl font-light mb-6">
                Koleksiyon
              </h4>
              {/* Eskiden href="#" idi, hiçbir yere gitmiyordu. */}
              <motion.a
                whileHover={{ x: 4 }}
                href="#koleksiyon"
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
                src="/gorseller/hakkimizda.jpg"
                alt=""
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
                Bursa · Türkiye
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
              className="space-y-5 text-[#2B2B2B]/80 text-base md:text-lg leading-relaxed font-light max-w-2xl"
            >
              <p>
                SÜSELİ, 2023 yılında Bursa’da kurulan; mimari oranların; camın, aynanın ve ahşabın diliyle konuşan bir yaratıcı stüdyodur. Her bir parça, atölyemizde ustalarımızın elleriyle tasarlanır ve üretilir.
              </p>
              <p>
                Tasarım anlayışımız; geçici eğilimlerden uzak, zamansız bir estetiği hedefler. Mekânın ihtiyaç duyduğu sessizliği yakalayan, ölçülü ve heykelsi parçalar üretiyoruz.
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// WhatsApp CTA
// ============================================================
function WhatsAppCTA({ whatsapp, email }: { whatsapp: string; email: string }) {
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
            href={`https://wa.me/${whatsapp}`}
            className="group flex items-center gap-4 px-8 py-5 rounded-full bg-[#E3E3DB] text-[#0243C7] text-sm tracking-[0.2em] uppercase font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp ile İletişim
            <span className="w-10 h-px bg-[#0243C7] group-hover:w-16 transition-all duration-500" />
          </motion.a>

          {email && (
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${email}`}
              className="flex items-center gap-3 px-8 py-5 rounded-full border border-[#E3E3DB]/30 text-[#E3E3DB] text-sm tracking-[0.2em] uppercase backdrop-blur-xl"
            >
              {email}
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// Instagram Showcase
// ============================================================
function Instagram({ instagram }: { instagram: string }) {
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
              {/* Eskiden "Atölyeden anlar." yazıyordu ama kareler atölye
                  fotoğrafı değil; başlık iddiaya uygun hale getirildi. */}
              Malzeme
              <span className="italic text-[#E3E3DB]/40"> ve ışık.</span>
            </motion.h2>
          </div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            href={instagram}
            whileHover={{ x: 6 }}
            className="group flex items-center gap-4 text-[#E3E3DB] text-xs tracking-[0.3em] uppercase"
          >
            Takip Et
            <span className="w-10 h-px bg-[#0243C7] group-hover:w-16 transition-all duration-500" />
          </motion.a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {INSTAGRAM_POSTS.map((src, i) => (
            <motion.a
              key={i}
              href={instagram}
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
function Footer({
  logo,
  siteName,
  footerText,
  email,
  whatsapp,
  instagram,
  address,
  categories,
}: {
  logo: string | null;
  siteName: string;
  footerText: string;
  email: string;
  whatsapp: string;
  instagram: string;
  address: string;
  categories: CategoryItem[];
}) {
  return (
    <footer className="relative bg-[#2B2B2B] pt-24 md:pt-32 pb-10 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 mb-20">
          <div className="col-span-2 md:col-span-5">
            <div className="mb-6">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={siteName}
                  style={{ height: "44px", width: "auto", objectFit: "contain", display: "block" }}
                />
              ) : (
                <Image
                  src="/logo.png"
                  alt={siteName}
                  width={628}
                  height={216}
                  sizes="160px"
                  style={{ height: "44px", width: "auto", objectFit: "contain", display: "block" }}
                />
              )}
            </div>
            <p className="text-[#E3E3DB]/50 text-sm leading-relaxed max-w-md font-light mb-8">
              {footerText}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#E3E3DB]/15 flex items-center justify-center text-[#E3E3DB]/60 text-[10px] tracking-widest hover:bg-[#0243C7] hover:border-[#0243C7] hover:text-[#E3E3DB] transition-all duration-500"
              >
                IG
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#E3E3DB]/15 flex items-center justify-center text-[#E3E3DB]/60 text-[10px] tracking-widest hover:bg-[#0243C7] hover:border-[#0243C7] hover:text-[#E3E3DB] transition-all duration-500"
              >
                WA
              </a>
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
                    href={`/kategori/${c.id}`}
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
              <div>{address}</div>
              <div className="pt-3">+{whatsapp}</div>
              {email && <div>{email}</div>}
            </div>
          </div>
        </div>

        {/* Big mark */}
        <div className="border-t border-[#E3E3DB]/10 pt-12 flex justify-center">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              style={{
                width: "40vw",
                maxWidth: "520px",
                height: "auto",
                objectFit: "contain",
                opacity: 0.06,
                userSelect: "none",
                display: "block",
                marginBottom: "-24px",
              }}
            />
          ) : (
            <Image
              src="/logo.png"
              alt=""
              width={628}
              height={216}
              sizes="(max-width: 768px) 80vw, 520px"
              aria-hidden="true"
              style={{
                width: "40vw",
                maxWidth: "520px",
                height: "auto",
                objectFit: "contain",
                opacity: 0.06,
                userSelect: "none",
                display: "block",
                marginBottom: "-24px",
              }}
            />
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#E3E3DB]/5">
          <div className="text-[#E3E3DB]/40 text-xs font-light">
            © 2026 {siteName} · Tüm hakları saklıdır.
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
function FloatingWhatsApp({ whatsapp }: { whatsapp: string }) {
  return (
    <motion.a
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      href={`https://wa.me/${whatsapp}`}
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
// HomeClient — tüm veri sunucudan props olarak gelir
// ============================================================
export default function HomeClient({
  settings,
  categories,
  featured,
}: {
  settings: SiteSettings;
  categories: CategoryItem[];
  featured: ProductItem[];
}) {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <main className="bg-[#0a0a0a] text-[#E3E3DB] antialiased overflow-x-hidden selection:bg-[#0243C7] selection:text-[#E3E3DB]">
      <Navigation logo={settings.logo} siteName={settings.siteName} whatsapp={settings.whatsapp} />
      <Hero title={settings.heroTitle} subtitle={settings.heroSubtitle} />
      <MarqueeSection />
      <Categories categories={categories} />
      <Featured products={featured} />
      <Gallery />
      <About />
      <WhatsAppCTA whatsapp={settings.whatsapp} email={settings.email} />
      <Instagram instagram={settings.instagram} />
      <Footer
        logo={settings.logo}
        siteName={settings.siteName}
        footerText={settings.footerText}
        email={settings.email}
        whatsapp={settings.whatsapp}
        instagram={settings.instagram}
        address={settings.address}
        categories={categories}
      />
      <FloatingWhatsApp whatsapp={settings.whatsapp} />
    </main>
  );
}
