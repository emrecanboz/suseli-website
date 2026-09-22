#!/usr/bin/env python3
"""
SÜSELİ — koleksiyon teknik çizimleri.

Her parça için 1000x1250 (4:5) tek renkli çizgisel çizim üretir ve
public/cizim/ altına yazar.

Çalıştırmak için:
    pip install cairosvg
    python scripts/cizim.py

Ölçü YAZILMAZ: gerçek ölçüler bilinmiyor, uydurulmaz. Çizimler oran
ve kurgu anlatır, ölçü değil. Gerçek ölçüler belli olduğunda buraya
ölçü çizgisi eklenebilir.

Çizimler geçicidir: Midjourney render'ları ya da gerçek fotoğraflar
panele girildiğinde Sanity kazanır ve bu çizimler devre dışı kalır
(bkz. src/lib/getContent.ts).
"""
import math, os
import cairosvg

W, H = 1000, 1250
BG = "#0F0F0F"
INK = "#E3E3DB"
ACCENT = "#4A7DFF"
FONT = "DejaVu Sans"

# oblik izdüşüm: derinlik vektörü
DX, DY = 0.55, -0.32


def proj(x, y, d=0.0, z=0.0):
    """plan (x, y) + derinlik d + yükseklik z -> ekran noktası"""
    return (x + d * DX, y + d * DY - z)


def poly(pts, fill="none", stroke=INK, w=1.6, op=1.0, fop=1.0, dash=None):
    p = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<polygon points="{p}" fill="{fill}" fill-opacity="{fop}" '
            f'stroke="{stroke}" stroke-width="{w}" stroke-opacity="{op}"'
            f' stroke-linejoin="round"{d}/>')


def line(a, b, stroke=INK, w=1.4, op=1.0, dash=None, cap="round"):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" '
            f'y2="{b[1]:.1f}" stroke="{stroke}" stroke-width="{w}" '
            f'stroke-opacity="{op}" stroke-linecap="{cap}"{d}/>')


def ellipse(cx, cy, rx, ry, rot=0, stroke=INK, w=1.4, op=1.0, fill="none", fop=1.0):
    return (f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" '
            f'transform="rotate({rot:.1f} {cx:.1f} {cy:.1f})" fill="{fill}" '
            f'fill-opacity="{fop}" stroke="{stroke}" stroke-width="{w}" '
            f'stroke-opacity="{op}"/>')


def slab(x0, y0, wd, dp, th, fop=0.05, w=1.6):
    """Yatay cam düzlem: üst yüzey + ön/yan kalınlık."""
    t = [proj(x0, y0), proj(x0 + wd, y0), proj(x0 + wd, y0, dp), proj(x0, y0, dp)]
    s = []
    s.append(poly(t, fill=INK, fop=fop, w=w))
    # ön kalınlık
    s.append(poly([t[0], t[1], (t[1][0], t[1][1] + th), (t[0][0], t[0][1] + th)],
                  fill=INK, fop=fop + 0.03, w=w))
    # sağ kalınlık
    s.append(poly([t[1], t[2], (t[2][0], t[2][1] + th), (t[1][0], t[1][1] + th)],
                  fill=INK, fop=fop + 0.05, w=w))
    return "".join(s), t


def fin(x, y0, dp, hgt, skew=0.0, fop=0.06):
    """Dikey cam kanat: plan boyunca derinlikte uzanır, aşağı iner."""
    a = proj(x, y0)
    b = proj(x + skew, y0, dp)
    return poly([a, b, (b[0], b[1] + hgt), (a[0], a[1] + hgt)],
                fill=INK, fop=fop, w=1.6)


def wood(x0, y0, wd, dp, th):
    """Ahşap kiriş — tarama dolgulu kutu."""
    s = []
    t = [proj(x0, y0), proj(x0 + wd, y0), proj(x0 + wd, y0, dp), proj(x0, y0, dp)]
    s.append(poly([t[0], t[1], (t[1][0], t[1][1] + th), (t[0][0], t[0][1] + th)],
                  fill="url(#ahsap)", fop=1, w=1.6))
    s.append(poly(t, fill="url(#ahsap)", fop=1, w=1.6))
    return "".join(s)


def ground(y, x0=110, x1=890, op=0.16):
    return line((x0, y), (x1, y), op=op, w=1.2)


def frame(no, ad, kategori, alt):
    """Sayfa çerçevesi: ızgara, plaka no, isim, kategori, not."""
    g = [f'<rect width="{W}" height="{H}" fill="{BG}"/>']
    for i in range(0, W, 50):
        g.append(line((i, 0), (i, H), op=0.028, w=1, cap="butt"))
    for j in range(0, H, 50):
        g.append(line((0, j), (W, j), op=0.028, w=1, cap="butt"))
    g.append(f'<rect x="60" y="60" width="{W-120}" height="{H-120}" fill="none" '
             f'stroke="{INK}" stroke-width="1" stroke-opacity="0.12"/>')
    g.append(f'<text x="110" y="132" fill="{INK}" fill-opacity="0.45" '
             f'font-family="{FONT}" font-size="20" letter-spacing="6">{no}</text>')
    g.append(f'<text x="890" y="132" text-anchor="end" fill="{INK}" '
             f'fill-opacity="0.30" font-family="{FONT}" font-size="15" '
             f'letter-spacing="5">TASARIM ÇİZİMİ</text>')
    g.append(line((110, 152), (890, 152), op=0.14, w=1))
    # alt blok
    g.append(line((110, 1046), (890, 1046), op=0.14, w=1))
    g.append(f'<text x="110" y="1100" fill="{INK}" font-family="{FONT}" '
             f'font-size="46" letter-spacing="7">{ad}</text>')
    g.append(f'<text x="110" y="1136" fill="{INK}" fill-opacity="0.40" '
             f'font-family="{FONT}" font-size="16" letter-spacing="5">'
             f'{kategori.upper()}</text>')
    g.append(f'<text x="890" y="1100" text-anchor="end" fill="{INK}" '
             f'fill-opacity="0.35" font-family="{FONT}" font-size="16" '
             f'letter-spacing="3">{alt}</text>')
    g.append(f'<rect x="884" y="1120" width="6" height="18" fill="{ACCENT}" '
             f'fill-opacity="0.85"/>')
    return g


DEFS = f'''<defs>
<pattern id="ahsap" width="9" height="9" patternTransform="rotate(38)"
  patternUnits="userSpaceOnUse">
  <rect width="9" height="9" fill="{INK}" fill-opacity="0.07"/>
  <line x1="0" y1="0" x2="0" y2="9" stroke="{INK}" stroke-width="1.1"
    stroke-opacity="0.34"/>
</pattern>
<pattern id="ayna" width="14" height="14" patternTransform="rotate(-42)"
  patternUnits="userSpaceOnUse">
  <rect width="14" height="14" fill="{INK}" fill-opacity="0.05"/>
  <line x1="0" y1="0" x2="0" y2="14" stroke="{INK}" stroke-width="1"
    stroke-opacity="0.20"/>
</pattern>
<linearGradient id="isik" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="{ACCENT}" stop-opacity="0.30"/>
  <stop offset="45%" stop-color="{ACCENT}" stop-opacity="0.08"/>
  <stop offset="100%" stop-color="{ACCENT}" stop-opacity="0"/>
</linearGradient>
<radialGradient id="halo" cx="0.5" cy="0" r="0.9">
  <stop offset="0%" stop-color="{ACCENT}" stop-opacity="0.26"/>
  <stop offset="100%" stop-color="{ACCENT}" stop-opacity="0"/>
</radialGradient>
</defs>'''


# ── 01 AKS ────────────────────────────────────────────────────────────────
def aks():
    s, t = slab(230, 640, 470, 300, 11)
    g = [s]
    # iki paralel ama kaydırılmış kanat; biri hafif açılı
    g.append(fin(330, 640, 300, 210, skew=0))
    g.append(fin(575, 640, 300, 210, skew=26))
    # kaydırma ekseni — tasarımın tek hamlesi
    g.append(line(proj(330, 640, 300), proj(575, 640, 300), stroke=ACCENT,
                  w=1.6, op=0.75, dash="7 6"))
    g.append(ground(884))
    # gölge çizgisi
    g.append(line((372, 884), (688, 884), stroke=ACCENT, w=2.4, op=0.55))
    return g


# ── 02 FAY ────────────────────────────────────────────────────────────────
def fay():
    s, t = slab(230, 640, 470, 300, 11)
    g = [s]
    # merkezden kaydırılmış tek ahşap omurga
    g.append(wood(258, 640, 414, 46, 30))
    # omurgadan inen ayaklar
    for x in (300, 600):
        a = proj(x, 640, 46)
        g.append(poly([(a[0], a[1] + 30), (a[0] + 34, a[1] + 30),
                       (a[0] + 34, a[1] + 214), (a[0], a[1] + 214)],
                      fill="url(#ahsap)", w=1.6))
    g.append(line(proj(258, 640, 23), proj(672, 640, 23), stroke=ACCENT,
                  w=1.5, op=0.7, dash="7 6"))
    g.append(ground(884))
    return g


# ── 03 KATMAN ─────────────────────────────────────────────────────────────
def katman():
    g = []
    # üç düzlem, üç yükseklik, planda kademeli olarak kayar ve örtüşür
    katlar = [(228, 812, 340, 210, 0.13, 250),   # alt — füme
              (330, 742, 340, 210, 0.055, 180),  # orta — şeffaf
              (432, 672, 340, 210, 0.095, 110)]  # üst — bronz
    for x, y, wd, dp, fop, h in katlar:
        # taşıyıcı cam kanat (düzlemin altında, arkaya yakın)
        g.append(fin(x + 40, y, dp - 40, h, fop=fop * 0.7))
        g.append(fin(x + wd - 40, y, dp - 40, h, fop=fop * 0.7))
        s_, _ = slab(x, y, wd, dp, 9, fop=fop)
        g.append(s_)
    g.append(ground(884))
    # üst üste binen bölge — tasarımın tek hamlesi
    g.append(line(proj(432, 672, 210), proj(568, 812, 210), stroke=ACCENT,
                  w=1.5, op=0.6, dash="7 6"))
    return g


# ── 04 ÇEKÜL ──────────────────────────────────────────────────────────────
def cekul():
    g = []
    # aynalı prizma taban
    x, y, wd, dp, h = 340, 800, 250, 190, 190
    top = [proj(x, y, 0, h), proj(x + wd, y, 0, h),
           proj(x + wd, y, dp, h), proj(x, y, dp, h)]
    g.append(poly(top, fill="url(#ayna)", w=1.7))
    g.append(poly([top[0], top[1], (top[1][0], top[1][1] + h),
                   (top[0][0], top[0][1] + h)], fill="url(#ayna)", w=1.7))
    g.append(poly([top[1], top[2], (top[2][0], top[2][1] + h),
                   (top[1][0], top[1][1] + h)], fill="url(#ayna)", w=1.7))
    # merkezden kaydırılmış cam tabla
    s, _ = slab(258, 700, 400, 270, 10, fop=0.07)
    g.append(s)
    # yansıma: taban zemini yansıtır
    g.append(line(proj(x, y, dp), proj(x + wd, y, dp), stroke=ACCENT,
                  w=1.6, op=0.6, dash="6 6"))
    g.append(ground(884))
    return g


# ── 05 UFUK ───────────────────────────────────────────────────────────────
def ufuk():
    g = []
    x0, y0, wd, ht = 360, 250, 280, 610
    g.append(f'<rect x="{x0}" y="{y0}" width="{wd}" height="{ht}" '
             f'fill="url(#ayna)" stroke="{INK}" stroke-width="1.8"/>')
    # ışık yalnızca alt kenardan
    g.append(f'<rect x="{x0}" y="{y0+ht-4}" width="{wd}" height="5" '
             f'fill="{ACCENT}"/>')
    g.append(f'<rect x="{x0-150}" y="{y0+ht}" width="{wd+300}" height="150" '
             f'fill="url(#halo)"/>')
    g.append(f'<rect x="{x0-20}" y="{y0+ht}" width="{wd+40}" height="90" '
             f'fill="url(#isik)"/>')
    # dört tarafı saran çerçeve YOK — bunu çizimde de vurgula
    for yy in (y0, y0 + ht):
        g.append(line((x0 - 34, yy), (x0 - 12, yy), op=0.3, w=1.2))
    g.append(line((x0 - 23, y0), (x0 - 23, y0 + ht), op=0.3, w=1.2, dash="5 7"))
    g.append(ground(884))
    return g


# ── 06 EŞİK ───────────────────────────────────────────────────────────────
def esik():
    g = []
    x0, y0, wd, ht = 350, 230, 300, 640
    g.append(f'<rect x="{x0}" y="{y0}" width="{wd}" height="{ht}" '
             f'fill="url(#ayna)" stroke="{INK}" stroke-width="1.8"/>')
    # alt üçte birde önden geçen ahşap raf
    ry = y0 + ht * 0.66
    g.append(poly([(x0 - 40, ry), (x0 + wd + 40, ry),
                   (x0 + wd + 22, ry + 16), (x0 - 22, ry + 16)],
                  fill="url(#ahsap)", w=1.7))
    # rafın yansımada devam ettiği izlenimi
    g.append(line((x0, ry - 2), (x0 + wd, ry - 2), stroke=ACCENT, w=1.5,
                  op=0.6, dash="6 6"))
    g.append(ground(884))
    return g


# ── 07 MENZİL ─────────────────────────────────────────────────────────────
def menzil():
    g = []
    taban, tepe = 858, 330
    n = 19
    for i in range(n):
        t = i / (n - 1)
        cy = taban - (taban - tepe) * t
        rx = 122 - 10 * t                      # neredeyse sabit: sütun, koni değil
        op = 0.34 + 0.34 * (1 - abs(0.5 - t) * 2)
        g.append(ellipse(500, cy, rx, rx * 0.26, rot=i * 9,
                         op=op, w=1.5, fill=INK, fop=0.03))
    # sütunun iki yan hattı — dilimleri tek gövdede toplar
    for sgn in (-1, 1):
        g.append(line((500 + sgn * 122, taban), (500 + sgn * 112, tepe),
                      op=0.22, w=1.3))
    g.append(line((500, tepe - 30), (500, taban + 18), stroke=ACCENT, w=1.4,
                  op=0.5, dash="6 8"))
    g.append(ground(884))
    return g


# ── 08 KIYI ───────────────────────────────────────────────────────────────
def kiyi():
    g = []
    s, t = slab(220, 690, 520, 190, 10, fop=0.08)
    g.append(s)
    # bir bacak düzlemi belirgin geniş, diğeri dar
    g.append(fin(268, 690, 190, 200, fop=0.10))
    g.append(fin(300, 690, 190, 200, fop=0.10))
    g.append(poly([proj(268, 690), proj(300, 690),
                   (proj(300, 690)[0], proj(300, 690)[1] + 200),
                   (proj(268, 690)[0], proj(268, 690)[1] + 200)],
                  fill=INK, fop=0.10, w=1.6))
    g.append(fin(672, 690, 190, 200, fop=0.07))
    # asimetri ekseni
    g.append(line(proj(284, 690, 190), proj(672, 690, 190), stroke=ACCENT,
                  w=1.5, op=0.65, dash="7 6"))
    g.append(ground(884))
    return g


# ── 09 ARALIK ─────────────────────────────────────────────────────────────
def aralik():
    g = []
    x0, y0, wd, ht = 300, 220, 400, 650
    g.append(f'<rect x="{x0}" y="{y0}" width="{wd}" height="{ht}" '
             f'fill="url(#ayna)" stroke="{INK}" stroke-width="1.8"/>')
    # aradaki tek ışık hattı + sonsuz derinlik
    cx = x0 + wd / 2
    g.append(line((cx, y0 + 26), (cx, y0 + ht - 26), stroke=ACCENT, w=4, op=0.95))
    for i in range(1, 8):
        o = 0.55 * (1 - i / 8)
        for sgn in (-1, 1):
            g.append(line((cx + sgn * i * 22, y0 + 26 + i * 12),
                          (cx + sgn * i * 22, y0 + ht - 26 - i * 12),
                          stroke=ACCENT, w=2, op=o))
    g.append(ground(884))
    return g


PARCALAR = [
    ("01", "AKS", "Yemek Masası", "cam", aks),
    ("02", "FAY", "Yemek Masası", "cam · ahşap", fay),
    ("03", "KATMAN", "Orta Sehpa", "cam", katman),
    ("04", "ÇEKÜL", "Orta Sehpa", "cam · ayna", cekul),
    ("05", "UFUK", "Ayna", "ayna · ışık", ufuk),
    ("06", "EŞİK", "Ayna", "ayna · ahşap", esik),
    ("07", "MENZİL", "Dekorasyon", "cam", menzil),
    ("08", "KIYI", "Dekorasyon", "cam", kiyi),
    ("09", "ARALIK", "Tasarım", "ayna · ışık", aralik),
]

SLUG = {"AKS": "aks", "FAY": "fay", "KATMAN": "katman", "ÇEKÜL": "cekul",
        "UFUK": "ufuk", "EŞİK": "esik", "MENZİL": "menzil", "KIYI": "kiyi",
        "ARALIK": "aralik"}

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "cizim")
os.makedirs(out, exist_ok=True)

for no, ad, kat, alt, fn in PARCALAR:
    body = frame(no, ad, kat, alt) + fn()
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
           f'viewBox="0 0 {W} {H}">{DEFS}{"".join(body)}</svg>')
    p = f"{out}/{SLUG[ad]}.png"
    cairosvg.svg2png(bytestring=svg.encode(), write_to=p,
                     output_width=W, output_height=H)
    print(p)
