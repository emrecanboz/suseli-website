import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Kategori",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Kategori Adı",
      type: "string",
      description: "Örn. Yemek Masası, Ayna",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Adres (slug)",
      type: "slug",
      description:
        "Sitedeki adres. Mevcut kategoriler için birebir aynı kalmalı: " +
        "yemek-masasi · orta-sehpa · dekorasyon · ayna · tasarim",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Üst Başlık",
      type: "string",
      description: "Örn. 01 — Sofra Mimarisi",
    }),
    defineField({
      name: "description",
      title: "Açıklama",
      type: "text",
      rows: 3,
      description:
        "Kategoriyi anlatan kısa metin. Doğrulamadığın teknik bilgi yazma.",
    }),
    defineField({
      name: "image",
      title: "Kapak Görseli",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Görsel Açıklaması",
          type: "string",
          description: "Görme engelliler ve arama motorları için.",
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Sıra",
      type: "number",
      description: "Küçük sayı önce gösterilir.",
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: "Sıraya göre",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image" },
  },
});
