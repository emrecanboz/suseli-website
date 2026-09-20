"use client";

/**
 * Panelin kendisi. "use client" burada zorunlu: Sanity Studio tamamen
 * tarayıcıda çalışır ve sanity.config sunucu tarafına sızarsa build
 * kırılır (swr paketinin react-server sürümünde default export yok).
 */
import { NextStudio } from "next-sanity/studio";

import { isSanityConfigured } from "../../../../sanity/env";
import config from "../../../../sanity.config";

export default function Studio() {
  if (!isSanityConfigured) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2B2B2B",
          color: "#E3E3DB",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 500, marginBottom: "1rem" }}>
            İçerik paneli henüz bağlanmadı
          </h1>
          <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
            Sanity proje kimliği tanımlanmamış. Vercel proje ayarlarında{" "}
            <code style={{ color: "#8FB2FF" }}>NEXT_PUBLIC_SANITY_PROJECT_ID</code>{" "}
            ve{" "}
            <code style={{ color: "#8FB2FF" }}>NEXT_PUBLIC_SANITY_DATASET</code>{" "}
            değişkenlerini ekleyip yeniden dağıtım yapın.
          </p>
        </div>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
