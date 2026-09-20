"use client";

import { useState, useEffect, useRef } from "react";

interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string | null;
  createdAt: string;
}

interface SiteSettings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsapp: string;
  instagram: string;
  email: string;
  footerText: string;
  logo: string | null;
}

const ADMIN_PASSWORD = "suseli2026";
const PRODUCTS_KEY = "suseli_admin_products";
const SETTINGS_KEY = "suseli_site_settings";

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "SUSELI",
  heroTitle: "ZAMANSIZ",
  heroSubtitle: "TASARIM",
  whatsapp: "905333896916",
  instagram: "https://instagram.com/suseli.studio",
  email: "info@suseli.studio",
  footerText:
    "Istanbul merkezli, mimari oranlarda parca ureten yaratici studyo. Her tasarim atolyemizde ellerimizle hayata gecer.",
  logo: null,
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState({
    title: "",
    category: "",
    description: "",
    image: null as string | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [settingsMsg, setSettingsMsg] = useState("");
  const logoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem(PRODUCTS_KEY);
      // localStorage yalnızca tarayıcıda okunabilir; SSR/prerender sırasında
      // erişilemediği için bu senkronizasyon effect içinde yapılmak zorunda.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (p) setProducts(JSON.parse(p));
    } catch {}
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) {
        const parsed: SiteSettings = JSON.parse(s);
        setSettings(parsed);
        if (parsed.logo) setLogoPreview(parsed.logo);
      }
    } catch {}
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError("");
    } else setLoginError("Hatali sifre. Tekrar deneyin.");
  }

  function handleProductImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      setImagePreview(r);
      setProductForm((f) => ({ ...f, image: r }));
    };
    reader.readAsDataURL(file);
  }

  function handleProductSave(e: React.FormEvent) {
    e.preventDefault();
    if (!productForm.title.trim()) return;
    const newProduct: Product = {
      id: crypto.randomUUID(),
      title: productForm.title.trim(),
      category: productForm.category.trim(),
      description: productForm.description.trim(),
      image: productForm.image,
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    setProductForm({ title: "", category: "", description: "", image: null });
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
    setSaveMsg("Urun basariyla kaydedildi.");
    setTimeout(() => setSaveMsg(""), 3000);
  }

  function handleProductDelete(id: string) {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      setLogoPreview(r);
      setSettings((s) => ({ ...s, logo: r }));
    };
    reader.readAsDataURL(file);
  }

  function handleLogoRemove() {
    setLogoPreview(null);
    setSettings((s) => ({ ...s, logo: null }));
    if (logoRef.current) logoRef.current.value = "";
  }

  function handleSettingsSave(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSettingsMsg("Ayarlar kaydedildi.");
    setTimeout(() => setSettingsMsg(""), 3000);
  }

  function handleSettingsReset() {
    if (!confirm("Tum ayarlari sifirlamak istediginizden emin misiniz?")) return;
    localStorage.removeItem(SETTINGS_KEY);
    setSettings(DEFAULT_SETTINGS);
    setLogoPreview(null);
    if (logoRef.current) logoRef.current.value = "";
    setSettingsMsg("Ayarlar varsayilana sifirlandi.");
    setTimeout(() => setSettingsMsg(""), 3000);
  }

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            background: "#141414",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: "48px 40px",
            width: "100%",
            maxWidth: 380,
          }}
        >
          <p
            style={{
              color: "#888",
              fontSize: 11,
              letterSpacing: 3,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Suseli Studio
          </p>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 600, marginBottom: 32 }}>
            Admin Girisi
          </h1>
          <form onSubmit={handleLogin}>
            <label style={labelStyle}>Sifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sifrenizi girin"
              style={inputStyle}
              autoFocus
            />
            {loginError && (
              <p style={{ color: "#f87171", fontSize: 13, marginBottom: 16 }}>{loginError}</p>
            )}
            <button type="submit" style={primaryBtn}>
              Panele Gir
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        fontFamily: "'Inter', sans-serif",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 36,
          }}
        >
          <div>
            <p
              style={{
                color: "#888",
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Suseli Studio
            </p>
            <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 600 }}>Admin Paneli</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} style={ghostBtn}>
            Cikis Yap
          </button>
        </div>

        {/* ===================== GENEL AYARLAR ===================== */}
        <div style={{ marginBottom: 56 }}>

          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "linear-gradient(135deg, #0d1a30 0%, #141414 100%)",
              border: "1px solid #0243C7",
              borderRadius: 14,
              padding: "20px 28px",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "#0243C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              &#9881;
            </div>
            <div>
              <h2
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 700,
                  margin: "0 0 4px 0",
                  letterSpacing: 0.4,
                }}
              >
                Genel Ayarlar
              </h2>
              <p style={{ color: "#7aa3d4", fontSize: 13, margin: 0 }}>
                Logo, site adi ve iletisim bilgilerini buradan yonetin.
                Kaydettiginizde anasayfa navbar ve footer canli olarak guncellenir.
              </p>
            </div>
          </div>

          <form onSubmit={handleSettingsSave}>

            {/* Logo */}
            <div style={cardStyle}>
              <h3 style={sectionTitle}>Logo</h3>
              <p style={sectionDesc}>Ana sayfada ve menude gorunecek logo gorseli.</p>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ display: "none" }}
                id="logo-upload"
              />
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div
                  style={{
                    width: 200,
                    height: 80,
                    background: "#0f0f0f",
                    border: "1px solid #2a2a2a",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {logoPreview ? (
                    // Logo base64 data-URL; next/image optimize edemez.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoPreview}
                      alt="Logo"
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <span style={{ color: "#555", fontSize: 12 }}>Logo Yok</span>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label
                    htmlFor="logo-upload"
                    style={{
                      ...ghostBtn,
                      display: "inline-block",
                      textAlign: "center",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    Logo Yukle
                  </label>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleLogoRemove}
                      style={{ ...deleteBtn, fontSize: 13, padding: "8px 18px" }}
                    >
                      Logoyu Kaldir
                    </button>
                  )}
                  <p style={{ color: "#555", fontSize: 11 }}>PNG, SVG veya WEBP onerilir.</p>
                </div>
              </div>
            </div>

            {/* Site Info */}
            <div style={cardStyle}>
              <h3 style={sectionTitle}>Site Bilgileri</h3>
              <p style={sectionDesc}>Site basligi ve ana sayfa hero metinleri.</p>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Site Basligi</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
                  placeholder="SUSELI"
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Hero Baslik (1. Satir)</label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, heroTitle: e.target.value.toUpperCase() }))
                    }
                    placeholder="ZAMANSIZ"
                    style={inputStyle}
                  />
                  <p style={{ color: "#555", fontSize: 11, marginTop: 6 }}>Buyuk harflerle gosterilir.</p>
                </div>
                <div>
                  <label style={labelStyle}>Hero Alt Baslik (2. Satir, Italik)</label>
                  <input
                    type="text"
                    value={settings.heroSubtitle}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, heroSubtitle: e.target.value.toUpperCase() }))
                    }
                    placeholder="TASARIM"
                    style={inputStyle}
                  />
                  <p style={{ color: "#555", fontSize: 11, marginTop: 6 }}>
                    Ilk harf mavi renkte gosterilir.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div style={cardStyle}>
              <h3 style={sectionTitle}>Iletisim</h3>
              <p style={sectionDesc}>WhatsApp, Instagram ve diger iletisim linkleri.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>WhatsApp Numarasi</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings((s) => ({ ...s, whatsapp: e.target.value }))}
                    placeholder="905555555555"
                    style={inputStyle}
                  />
                  <p style={{ color: "#555", fontSize: 11, marginTop: 6 }}>Basinda + olmadan yazin.</p>
                </div>
                <div>
                  <label style={labelStyle}>E-posta Adresi</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings((s) => ({ ...s, email: e.target.value }))}
                    placeholder="atelier@suseli.com"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Instagram URL</label>
                <input
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => setSettings((s) => ({ ...s, instagram: e.target.value }))}
                  placeholder="https://instagram.com/suseli.studio"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Footer Text */}
            <div style={cardStyle}>
              <h3 style={sectionTitle}>Footer Metni</h3>
              <p style={sectionDesc}>Footer bolumunde gorunecek kisa sirket aciklamasi.</p>
              <textarea
                value={settings.footerText}
                onChange={(e) => setSettings((s) => ({ ...s, footerText: e.target.value }))}
                rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>

            {/* Save / Reset */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button type="submit" style={{ ...primaryBtn, width: "auto", padding: "12px 36px" }}>
                Ayarlari Kaydet
              </button>
              <button
                type="button"
                onClick={handleSettingsReset}
                style={{ ...ghostBtn, color: "#f87171", borderColor: "#3a1a1a" }}
              >
                Sifirla
              </button>
              {settingsMsg && <p style={{ color: "#4ade80", fontSize: 13 }}>{settingsMsg}</p>}
            </div>

          </form>
        </div>

        <div style={{ borderTop: "1px solid #2a2a2a", marginBottom: 40 }} />

        {/* ===================== URUN YONETIMI ===================== */}
        <div>

          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "#141414",
              border: "1px solid #2a2a2a",
              borderRadius: 14,
              padding: "20px 28px",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "#1e1e1e",
                border: "1px solid #333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              &#128230;
            </div>
            <div>
              <h2
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 700,
                  margin: "0 0 4px 0",
                  letterSpacing: 0.4,
                }}
              >
                Urun Yonetimi
              </h2>
              <p style={{ color: "#666", fontSize: 13, margin: 0 }}>
                Yeni urun ekleyin veya mevcut urunleri silin. Urunler anasayfada otomatik gosterilir.
              </p>
            </div>
          </div>

          {/* Add product form */}
          <div style={cardStyle}>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 500, marginBottom: 24 }}>
              Yeni Urun Ekle
            </h3>
            <form onSubmit={handleProductSave}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <div>
                  <label style={labelStyle}>Urun Adi *</label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="orn. Yemek Masasi"
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Kategori</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="orn. Ayna, Sehpa"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Aciklama</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Urunu aciklayin..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Urun Gorseli</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageChange}
                  style={{ display: "none" }}
                  id="product-image"
                />
                <label htmlFor="product-image" style={uploadLabelStyle}>
                  {imagePreview ? (
                    // Yüklenen görsel base64 data-URL; next/image optimize edemez.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt=""
                      style={{
                        maxHeight: 180,
                        maxWidth: "100%",
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <>
                      <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>+</span>
                      Gorsel yuklemek icin tiklayin
                    </>
                  )}
                </label>
              </div>
              {saveMsg && (
                <p style={{ color: "#4ade80", fontSize: 13, marginBottom: 12 }}>{saveMsg}</p>
              )}
              <button type="submit" style={primaryBtn}>
                Urunu Kaydet
              </button>
            </form>
          </div>

          {/* Product list */}
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 500, marginBottom: 20 }}>
            Kayitli Urunler{" "}
            <span style={{ color: "#555", fontWeight: 400, fontSize: 14 }}>({products.length})</span>
          </h3>
          {products.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: "center", color: "#555", fontSize: 14 }}>
              Henuz urun eklenmedi.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16, marginBottom: 60 }}>
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "#141414",
                    border: "1px solid #2a2a2a",
                    borderRadius: 12,
                    padding: "20px 24px",
                    display: "flex",
                    gap: 20,
                    alignItems: "flex-start",
                  }}
                >
                  {p.image && (
                    // Ürün görseli base64 data-URL; next/image optimize edemez.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                        flexShrink: 0,
                        border: "1px solid #2a2a2a",
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div>
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                          {p.title}
                        </p>
                        {p.category && (
                          <span
                            style={{
                              background: "#1e1e1e",
                              border: "1px solid #333",
                              color: "#aaa",
                              fontSize: 11,
                              padding: "2px 10px",
                              borderRadius: 20,
                              letterSpacing: 1,
                              textTransform: "uppercase",
                            }}
                          >
                            {p.category}
                          </span>
                        )}
                      </div>
                      <button onClick={() => handleProductDelete(p.id)} style={deleteBtn}>
                        Sil
                      </button>
                    </div>
                    {p.description && (
                      <p style={{ color: "#666", fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
                        {p.description}
                      </p>
                    )}
                    <p style={{ color: "#444", fontSize: 11, marginTop: 10 }}>
                      {new Date(p.createdAt).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#888",
  fontSize: 12,
  letterSpacing: 1,
  textTransform: "uppercase",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0f0f0f",
  border: "1px solid #2a2a2a",
  borderRadius: 8,
  padding: "10px 14px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const primaryBtn: React.CSSProperties = {
  background: "#fff",
  color: "#000",
  border: "none",
  borderRadius: 8,
  padding: "12px 28px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  width: "100%",
  fontFamily: "inherit",
};

const ghostBtn: React.CSSProperties = {
  background: "transparent",
  color: "#666",
  border: "1px solid #2a2a2a",
  borderRadius: 8,
  padding: "8px 18px",
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
};

const deleteBtn: React.CSSProperties = {
  background: "transparent",
  color: "#f87171",
  border: "1px solid #3a1a1a",
  borderRadius: 6,
  padding: "5px 14px",
  fontSize: 12,
  cursor: "pointer",
  flexShrink: 0,
  fontFamily: "inherit",
};

const cardStyle: React.CSSProperties = {
  background: "#141414",
  border: "1px solid #2a2a2a",
  borderRadius: 16,
  padding: "32px",
  marginBottom: 24,
};

const uploadLabelStyle: React.CSSProperties = {
  display: "block",
  border: "1px dashed #3a3a3a",
  borderRadius: 10,
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  color: "#888",
  fontSize: 14,
};

const sectionTitle: React.CSSProperties = {
  color: "#fff",
  fontSize: 17,
  fontWeight: 600,
  marginBottom: 6,
};

const sectionDesc: React.CSSProperties = {
  color: "#666",
  fontSize: 13,
  marginBottom: 20,
  lineHeight: 1.5,
};
