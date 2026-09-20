/**
 * Ürün detay sayfası — sunucu bileşeni.
 *
 * Bu sayfa daha önce hiç yoktu: ürün kartları /urun/... adresine link
 * veriyordu ama tıklayan 404 alıyordu.
 *
 * Fiyat, malzeme ve ölçü yalnızca panelde doldurulmuşsa gösterilir.
 * Boş bırakılan hiçbir alan uydurulmaz.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProduct, getSettings } from "@/lib/getContent";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Ürün bulunamadı" };
  return {
    title: product.title,
    description: product.description || undefined,
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: product.image
      ? { images: [{ url: product.image }], title: product.title }
      : undefined,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()]);

  if (!product) notFound();

  const specs = [
    { label: "Malzeme", value: product.materials },
    { label: "Ölçüler", value: product.dimensions },
    { label: "Fiyat", value: product.price || "Talep Üzerine" },
  ].filter((s) => s.value);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#E3E3DB] antialiased selection:bg-[#0243C7] selection:text-[#E3E3DB]">
      {/* Üst bar */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-[#E3E3DB] text-lg font-semibold tracking-[0.25em] uppercase"
          >
            SÜSEL<span className="text-[#0243C7]">İ</span>
          </Link>
          <Link
            href={`/kategori/${product.categorySlug}`}
            className="text-[#E3E3DB]/60 hover:text-[#E3E3DB] text-xs tracking-[0.25em] uppercase transition-colors"
          >
            ← {product.category || "Koleksiyon"}
          </Link>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Görseller */}
          <div className="space-y-4">
            {product.images.length > 0 ? (
              product.images.map((src, i) => (
                <div
                  key={src}
                  className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#161616]"
                >
                  <Image
                    src={src}
                    alt={product.title}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="w-full aspect-[4/5] rounded-2xl bg-[#161616] flex items-center justify-center">
                <span className="text-[#E3E3DB]/20 text-6xl font-light">
                  {product.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Bilgiler */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {product.category && (
              <div className="text-[#E3E3DB]/50 text-[10px] tracking-[0.35em] uppercase mb-4">
                {product.category}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.05] mb-8">
              {product.title}
            </h1>

            {product.description && (
              <p className="text-[#E3E3DB]/70 text-base md:text-lg font-light leading-relaxed mb-12 max-w-xl">
                {product.description}
              </p>
            )}

            {specs.length > 0 && (
              <dl className="border-t border-white/[0.08] mb-12">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-baseline justify-between gap-6 py-4 border-b border-white/[0.06]"
                  >
                    <dt className="text-[#E3E3DB]/40 text-[10px] tracking-[0.25em] uppercase">
                      {s.label}
                    </dt>
                    <dd className="text-[#E3E3DB] text-sm md:text-base font-light text-right">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                  `Merhaba, "${product.title}" hakkında bilgi almak istiyorum.`,
                )}`}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#0243C7] text-[#E3E3DB] text-xs tracking-[0.25em] uppercase hover:opacity-90 transition-opacity"
              >
                WhatsApp ile Sor
              </a>
              {settings.email && (
                <a
                  href={`mailto:${settings.email}?subject=${encodeURIComponent(product.title)}`}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-[#E3E3DB]/25 text-[#E3E3DB] text-xs tracking-[0.25em] uppercase hover:border-[#E3E3DB]/60 transition-colors"
                >
                  E-posta Gönder
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
