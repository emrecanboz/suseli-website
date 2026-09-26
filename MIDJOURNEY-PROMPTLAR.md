# SÜSELİ — Midjourney çalışma sayfası

Aşağıdaki 9 prompt **birleştirilmiş** halde. Hiçbir şey eklemen gerekmiyor:
satırı kopyala, `/imagine` kutusuna yapıştır, çalıştır.

---

## Önce üç kural

1. **Prompt'a marka veya tasarımcı adı yazma.** "in the style of …" yok.
2. **`pin` klasöründeki görselleri Midjourney'e yükleme.** Ne görsel prompt,
   ne `--sref`, ne `/describe`. Yüklersen üretilen şey o işin türevi olur ve
   en baştaki telif sorununu geri getirirsin.
3. **Sürüm etiketi koyma.** V8 çıktı, hesabının varsayılanı zaten en iyisi.
   Zorlamak istersen `--v 8` ekle.

---

## Sıra

Önce **3 tanesini** üret: UFUK, MENZİL, ÇEKÜL. Bunlar en net formlar,
Midjourney'nin en iyi anladığı tipler. Beğendiğin ilk kareyi upscale et,
linkini al — kalan altıyı ona bağlayacağız (aşağıda).

---

## 1. UFUK — Ayna

```
a frameless rectangular full-length mirror leaning against a plaster wall, a thin concealed light line glowing only along the bottom edge, one warm horizontal glow line, sides and top completely frameless and unlit, evening interior, one soft ambient source, shot on medium format digital, 80mm lens, f/8, long soft shadows, warm off-white plaster wall, polished micro-cement floor, editorial furniture catalogue photography, muted natural palette, high microcontrast, no people --ar 4:5 --style raw --no text, watermark, logo, signage, plants, clutter
```

## 2. MENZİL — Dekorasyon

```
a vertical sculptural object made of stacked glass slices, each slice rotated a few degrees from the one below, forming a twisting translucent column on a low plinth, backlit by window light refracting through the cut edges, shot on medium format digital, 80mm lens, f/8, single large north-facing window, soft directional daylight, long soft shadows, warm off-white plaster wall, polished micro-cement floor, editorial furniture catalogue photography, muted natural palette, high microcontrast, no people --ar 4:5 --style raw --no text, watermark, logo, signage, plants, clutter
```

## 3. ÇEKÜL — Orta Sehpa

```
a low coffee table, a mirrored rectangular prism base reflecting the floor so the table appears to float, one clear glass top resting off-centre on the base, minimal, no metal, no hardware, shot on medium format digital, 80mm lens, f/8, single large north-facing window, soft directional daylight, long soft shadows, warm off-white plaster wall, polished micro-cement floor, editorial furniture catalogue photography, muted natural palette, high microcontrast, no people --ar 4:5 --style raw --no text, watermark, logo, signage, plants, clutter
```

## 4. AKS — Yemek Masası

```
a minimal dining table, one thick clear glass top with polished edges, supported by two vertical clear glass fins standing parallel but offset from one another and set at a slight angle to the short edge, no metal, no visible hardware, a single sharp shadow line cast across the floor beneath, centred in an empty room, shot on medium format digital, 80mm lens, f/8, single large north-facing window, soft directional daylight, long soft shadows, warm off-white plaster wall, polished micro-cement floor, editorial furniture catalogue photography, muted natural palette, high microcontrast, no people --ar 4:5 --style raw --no text, watermark, logo, signage, plants, clutter
```

## 5. FAY — Yemek Masası

```
a minimal dining table, clear glass top, one solid dark wood beam running the full length underneath but offset from the centre line, legs descending from that beam, the wood reading like a seam through the glass from above, no metal, no hardware, shot on medium format digital, 80mm lens, f/8, single large north-facing window, soft directional daylight, long soft shadows, warm off-white plaster wall, polished micro-cement floor, editorial furniture catalogue photography, muted natural palette, high microcontrast, no people --ar 4:5 --style raw --no text, watermark, logo, signage, plants, clutter
```

## 6. KATMAN — Orta Sehpa

```
a low coffee table built from three overlapping glass planes at three different heights, bottom plane smoked grey glass, middle plane clear glass, top plane bronze tinted glass, the overlapping areas creating a fourth darker tone, raised three-quarter view, shot on medium format digital, 80mm lens, f/8, single large north-facing window, soft directional daylight, long soft shadows, warm off-white plaster wall, polished micro-cement floor, editorial furniture catalogue photography, muted natural palette, high microcontrast, no people --ar 4:5 --style raw --no text, watermark, logo, signage, plants, clutter
```

## 7. EŞİK — Ayna

```
a frameless full-length mirror mounted flush to the wall, a slim solid dark wood shelf crossing in front of it at one third height, the shelf appearing to continue inside the reflection, one small ceramic object on the shelf, entrance hall, shot on medium format digital, 80mm lens, f/8, single large north-facing window, soft directional daylight, long soft shadows, warm off-white plaster wall, polished micro-cement floor, editorial furniture catalogue photography, muted natural palette, high microcontrast, no people --ar 4:5 --style raw --no text, watermark, logo, signage, plants, clutter
```

## 8. KIYI — Dekorasyon (konsol)

```
a narrow console table made of three interlocking smoked grey glass planes, one leg plane noticeably wider than the other, asymmetric, standing against a plaster wall in a hallway, no metal, no hardware, shot on medium format digital, 80mm lens, f/8, single large north-facing window, soft directional daylight, long soft shadows, warm off-white plaster wall, polished micro-cement floor, editorial furniture catalogue photography, muted natural palette, high microcontrast, no people --ar 4:5 --style raw --no text, watermark, logo, signage, plants, clutter
```

## 9. ARALIK — Tasarım (bölücü panel)

```
an architectural room divider of two parallel mirrored panels with one thin vertical light line between them creating infinite depth, floor to ceiling, minimal empty interior, shot on medium format digital, 80mm lens, f/8, soft directional daylight, long soft shadows, warm off-white plaster wall, polished micro-cement floor, editorial furniture catalogue photography, muted natural palette, high microcontrast, no people --ar 4:5 --style raw --no text, watermark, logo, signage, plants, clutter
```

---

## Koleksiyonu tek bir dile bağlamak

İlk üçten en beğendiğini upscale et, görselin linkini kopyala. Sonra kalan
prompt'ların **sonuna** şunu ekle:

```
--sref <kopyaladığın link> --sw 60
```

`--sw` stil ağırlığı: 60 civarı iyi bir başlangıç. Çok yüksek verirsen
Midjourney formu değil, o karenin kompozisyonunu tekrarlamaya başlar.

Böylece dokuz parça aynı ışıkta, aynı mekânda, aynı fotoğrafçının elinden
çıkmış gibi durur — katalog hissi buradan geliyor.

---

## Beğenmediğinde ne değiştirmeli

| Sorun | Ne yapmalı |
|---|---|
| Cam plastik gibi çıkıyor | `polished edges` → `thick polished low-iron glass, visible green edge` |
| Çok kalabalık mekân | `empty room, nothing else in frame` ekle |
| Metal ayak uyduruyor | `--no metal, chrome, brass, hardware, screws` ekle |
| Sahne fazla karanlık | `f/8` → `f/5.6`, `bright overcast daylight` ekle |
| Form yanlış anlaşıldı | O cümleyi kısalt. Uzun tarif Midjourney'i şaşırtır. |

---

## Sonra ne olacak

Beğendiğin kareleri bana at. Ben:

1. Kadrajı siteye uygun orana getirir, boyutu optimize ederim
2. Üzerinde yazı/filigran var mı diye yakınlaştırıp kontrol ederim
   (geçen sefer bir karenin zemininde "ELEVATE MODERN" yazısı çıkmıştı)
3. Panele **"Görseller tasarım görselidir"** işaretiyle ürün olarak girerim
4. O parçanın teknik çizimi kendiliğinden yerini bırakır — kodda hiçbir şey
   silmeye gerek yok

Tek tek de olur, dokuzu birden de. Sıra sende.
