/**
 * Google için yapılandırılmış veri (schema.org, JSON-LD).
 * Sayfada görünmez; arama motorları okur.
 * "<" karakteri kaçırılır ki içerik script etiketini kapatamasın.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
