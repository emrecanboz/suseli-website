/**
 * Markalı "sayfa bulunamadı" ekranı.
 * Olmayan bir adrese girildiğinde (ya da silinmiş bir ürüne gidildiğinde)
 * ziyaretçiyi kaybetmek yerine koleksiyona ve WhatsApp'a yönlendirir.
 */
import Image from "next/image";
import Link from "next/link";

import { getSettings } from "@/lib/getContent";

export default async function NotFound() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#E3E3DB] antialiased flex flex-col selection:bg-[#0243C7] selection:text-[#E3E3DB]">
      <div className="border-b border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-5">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="SÜSELİ"
              width={628}
              height={216}
              priority
              sizes="128px"
              style={{ height: "36px", width: "auto", objectFit: "contain", display: "block" }}
            />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center">
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 py-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-12 h-px bg-[#0243C7]" />
            <span className="text-[#E3E3DB]/50 text-xs tracking-[0.4em] uppercase">
              404
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light tracking-[-0.03em] leading-[1.02] mb-8 max-w-4xl">
            Aradığınız sayfa
            <br />
            <span className="italic text-[#E3E3DB]/40">burada değil.</span>
          </h1>

          <p className="text-[#E3E3DB]/60 text-base md:text-lg font-light leading-relaxed mb-12 max-w-xl">
            Adres değişmiş ya da parça koleksiyondan kaldırılmış olabilir.
            Koleksiyona göz atabilir ya da aradığınızı bize doğrudan
            sorabilirsiniz.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/#koleksiyon"
              className="flex items-center justify-center px-8 py-4 rounded-full bg-[#0243C7] text-[#E3E3DB] text-xs tracking-[0.25em] uppercase hover:opacity-90 transition-opacity"
            >
              Koleksiyona Dön
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                "Merhaba, sitenizde bir parça arıyorum.",
              )}`}
              className="flex items-center justify-center px-8 py-4 rounded-full border border-[#E3E3DB]/25 text-[#E3E3DB] text-xs tracking-[0.25em] uppercase hover:border-[#E3E3DB]/60 transition-colors"
            >
              WhatsApp ile Sor
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
