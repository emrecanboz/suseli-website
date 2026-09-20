import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Sanity görselinden URL üretir. Genişlik verirsen görsel o ölçüye göre
 * sunucuda küçültülür — telefonla çekilmiş 5 MB'lık fotoğraf siteye
 * 200 KB olarak iner.
 */
export function urlForImage(source: Image | undefined | null, width?: number) {
  if (!source) return null;
  let img = builder.image(source).auto("format").fit("max");
  if (width) img = img.width(width);
  return img.url();
}
