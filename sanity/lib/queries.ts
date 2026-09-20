import { groq } from "next-sanity";

/** Ana sayfada öne çıkan ürünler. */
export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(order asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    price,
    materials,
    dimensions,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    images
  }
`;

/** Bir kategorideki tüm ürünler. */
export const productsByCategoryQuery = groq`
  *[_type == "product" && category->slug.current == $slug]
    | order(order asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    price,
    materials,
    dimensions,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    images
  }
`;

/** Tüm kategoriler. */
export const categoriesQuery = groq`
  *[_type == "category"] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    description,
    image
  }
`;

/** Tek kategori. */
export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    description,
    image
  }
`;

/** Site ayarları (tek kayıt). */
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    logo,
    heroTitle,
    heroSubtitle,
    whatsapp,
    email,
    instagram,
    address,
    footerText
  }
`;

/** Tek ürün (ürün detay sayfası). */
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    price,
    materials,
    dimensions,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    images
  }
`;

/** Tüm ürün adresleri (statik sayfa üretimi için). */
export const allProductSlugsQuery = groq`
  *[_type == "product" && defined(slug.current)].slug.current
`;
