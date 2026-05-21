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

const ADMIN_PASSWORD = "suseli2026";
const STORAGE_KEY = "suseli_admin_products";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    image: null as string | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password. Try again.");
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setForm((f) => ({ ...f, image: result }));
    };
    reader.readAsDataURL(file);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    const newProduct: Product = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      image: form.image,
      createdAt: new Date().toISOString(),
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setForm({ title: "", category: "", description: "", image: null });
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";

    setSaveMsg("Product saved successfully.");
    setTimeout(() => setSaveMsg(""), 3000);
  }

  function handleDelete(id: string) {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // ── Login Screen ──────────────────────────────────────────────────────────
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
          <p style={{ color: "#888", fontSize: 12, letterSpacing: 3, marginBottom: 8, textTransform: "uppercase" }}>
            Suseli Studio
          </p>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 600, marginBottom: 32 }}>
            Admin Login
          </h1>

          <form onSubmit={handleLogin}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={inputStyle}
              autoFocus
            />
            {loginError && (
              <p style={{ color: "#f87171", fontSize: 13, marginBottom: 16 }}>{loginError}</p>
            )}
            <button type="submit" style={primaryBtn}>
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ───────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        fontFamily: "'Inter', sans-serif",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ color: "#888", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
              Suseli Studio
            </p>
            <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 600 }}>Product Manager</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} style={ghostBtn}>
            Log out
          </button>
        </div>

        {/* Add Product Form */}
        <div
          style={{
            background: "#141414",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: "32px",
            marginBottom: 40,
          }}
        >
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 500, marginBottom: 24 }}>
            Add New Product
          </h2>

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Product Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Mirror Console Table"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. Tables, Mirrors, Lighting"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the product..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Product Image</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                style={{
                  display: "block",
                  border: "1px dashed #3a3a3a",
                  borderRadius: 10,
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  color: "#888",
                  fontSize: 14,
                  transition: "border-color 0.2s",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxHeight: 180, maxWidth: "100%", borderRadius: 8, objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>📷</span>
                    Click to upload image
                  </>
                )}
              </label>
            </div>

            {saveMsg && (
              <p style={{ color: "#4ade80", fontSize: 13, marginBottom: 12 }}>{saveMsg}</p>
            )}

            <button type="submit" style={primaryBtn}>
              Save Product
            </button>
          </form>
        </div>

        {/* Product List */}
        <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 500, marginBottom: 20 }}>
          Saved Products{" "}
          <span style={{ color: "#555", fontWeight: 400, fontSize: 14 }}>({products.length})</span>
        </h2>

        {products.length === 0 ? (
          <div
            style={{
              background: "#141414",
              border: "1px solid #2a2a2a",
              borderRadius: 12,
              padding: "40px",
              textAlign: "center",
              color: "#555",
              fontSize: 14,
            }}
          >
            No products added yet.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <p style={{ color: "#fff", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{p.title}</p>
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
                    <button onClick={() => handleDelete(p.id)} style={deleteBtn}>
                      Delete
                    </button>
                  </div>
                  {p.description && (
                    <p style={{ color: "#666", fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>{p.description}</p>
                  )}
                  <p style={{ color: "#444", fontSize: 11, marginTop: 10 }}>
                    {new Date(p.createdAt).toLocaleDateString("en-GB", {
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
  );
}

// ── Shared Styles ──────────────────────────────────────────────────────────

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
