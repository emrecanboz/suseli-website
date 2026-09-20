import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Ürün",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Ürün Adı",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Adres (slug)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "images",
      title: "Fotoğraflar",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Görsel Açıklaması",
              type: "string",
            }),
          ],
        },
      ],
      description: "İlk fotoğraf kapak olarak kullanılır.",
      validation: (r) => r.min(1).error("En az bir fotoğraf gerekli."),
    }),
    defineField({
      name: "description",
      title: "Açıklama",
      type: "text",
      rows: 4,
    }),

    // ── Aşağıdaki alanlar isteğe bağlıdır ───────────────────────────────
    // Boş bırakılırsa sitede hiç gösterilmez. Emin olmadığın bir ölçü,
    // malzeme veya fiyat yazma — boş bırakmak yanlış bilgiden iyidir.
    defineField({
      name: "price",
      title: "Fiyat (isteğe bağlı)",
      type: "string",
      description:
        'Serbest metin. Boş bırakırsan sitede "Talep Üzerine" yazar. ' +
        "Emin değilsen boş bırak.",
    }),
    defineField({
      name: "materials",
      title: "Malzeme (isteğe bağlı)",
      type: "string",
      description:
        "Örn. Füme cam / masif ahşap. Doğrulamadığın malzeme yazma, boş bırak.",
    }),
    defineField({
      name: "dimensions",
      title: "Ölçüler (isteğe bağlı)",
      type: "string",
      description:
        "Örn. 180 × 90 × 75 cm. Ölçüyü bilmiyorsan boş bırak.",
    }),

    defineField({
      name: "featured",
      title: "Ana sayfada öne çıkar",
      type: "boolean",
      description:
        'İşaretlersen ana sayfadaki "Öne çıkan parçalar" bölümünde görünür.',
      initialValue: false,
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
    select: {
      title: "title",
      subtitle: "category.title",
      media: "images.0",
    },
  },
});
