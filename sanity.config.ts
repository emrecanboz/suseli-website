/**
 * SÜSELİ içerik paneli (Sanity Studio).
 *
 * Panel sitenin içine gömülüdür: suselistudio.com/studio
 * Ayrı bir adrese veya uygulamaya gerek yok.
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";

export default defineConfig({
  name: "suseli",
  title: "SÜSELİ Creative Studio",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("İçerik")
          .items([
            S.listItem()
              .title("Ürünler")
              .schemaType("product")
              .child(S.documentTypeList("product").title("Ürünler")),
            S.listItem()
              .title("Kategoriler")
              .schemaType("category")
              .child(S.documentTypeList("category").title("Kategoriler")),
            S.divider(),
            // Site Ayarları tek kayıt — doğrudan düzenleme ekranını açar.
            S.listItem()
              .title("Site Ayarları")
              .schemaType("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Ayarları"),
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
