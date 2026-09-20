import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Ayarları",
  type: "document",
  // Tek kayıtlık belge — yenisini oluşturmaya veya silmeye gerek yok.
  fields: [
    defineField({
      name: "siteName",
      title: "Marka Adı",
      type: "string",
      initialValue: "SÜSELİ",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Boş bırakılırsa sitedeki mevcut logo kullanılır.",
    }),
    defineField({
      name: "heroTitle",
      title: "Ana Başlık (üst satır)",
      type: "string",
      initialValue: "ZAMANSIZ",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Ana Başlık (alt satır)",
      type: "string",
      initialValue: "TASARIM",
    }),

    defineField({
      name: "whatsapp",
      title: "WhatsApp Numarası",
      type: "string",
      description:
        "Ülke koduyla, boşluksuz ve artısız. Örn. 905333896916",
      validation: (r) =>
        r.regex(/^\d{10,15}$/, {
          name: "telefon",
          invert: false,
        }).warning("Sadece rakam olmalı, örn. 905333896916"),
    }),
    defineField({
      name: "email",
      title: "E-posta",
      type: "string",
      description:
        "Boş bırakırsan sitede e-posta hiç gösterilmez. " +
        "Çalıştığından emin olmadığın adresi yazma.",
    }),
    defineField({
      name: "instagram",
      title: "Instagram Adresi",
      type: "url",
      description: "Tam adres. Örn. https://instagram.com/suseli.studio",
    }),
    defineField({
      name: "address",
      title: "Adres (isteğe bağlı)",
      type: "string",
      description:
        'Boş bırakırsan sitede "İstanbul · Türkiye" yazar. ' +
        "Doğrulamadığın adresi yazma.",
    }),

    defineField({
      name: "footerText",
      title: "Alt Bilgi Metni",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Ayarları" }),
  },
});
