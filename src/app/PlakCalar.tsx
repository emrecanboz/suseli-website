"use client";

/**
 * SÜSELİ plak çalar.
 *
 * - Sağ üstte, ekranın kenarına yapışık küçük bir sekme. Tıklayınca sağdan
 *   cam bir panel kayarak açılır.
 * - Raftan bir plak sürüklenip (fare) ya da dokunularak (telefon) tablaya
 *   konur; kol iner, plak 33⅓ devirde döner, müzik başlar.
 * - layout.tsx içinde olduğu için sayfa değişince müzik kesilmez. Panel
 *   kapanınca sekmedeki minik plak döner.
 * - Parçalar public/muzik altında; hepsi SÜSELİ için sıfırdan üretildi,
 *   telif sorunu yok. Yeni plak eklemek için PLAKLAR listesine bir satır
 *   ve plak-calar.css içine kapak tasarımı eklemek yeter.
 * - Sanity paneli (/studio) içinde görünmez.
 */
import "./plak-calar.css";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type Plak = {
  ad: string;
  tur: string;
  dosya: string;
  renk: string;
  sinif: string;
  sanat: React.ReactNode;
};

const SANATCI = "SÜSELİ SEANSLARI";

const PLAKLAR: Plak[] = [
  { ad: "Gece Atölyesi", tur: "BALLAD", dosya: "/muzik/gece-atolyesi.mp3", renk: "#e8a54b", sinif: "pc-k1", sanat: <i className="pc-gunes" /> },
  { ad: "Füme Cam", tur: "SWING", dosya: "/muzik/fume-cam.mp3", renk: "#4a7dff", sinif: "pc-k2", sanat: <i className="pc-kare" /> },
  {
    ad: "Bursa, 23.40", tur: "SOUL", dosya: "/muzik/bursa-2340.mp3", renk: "#e0604f", sinif: "pc-k3",
    sanat: (<><i className="pc-saat">23.40</i><i className="pc-serit" /></>),
  },
  { ad: "Ayna Koridoru", tur: "MODAL", dosya: "/muzik/ayna-koridoru.mp3", renk: "#3fd1b5", sinif: "pc-k4", sanat: <i className="pc-halkalar" /> },
];

type Durum = "bos" | "yukleniyor" | "iniyor" | "caliyor" | "duruyor" | "hazir";
type SesliAudio = HTMLAudioElement & { mozPreservesPitch?: boolean; webkitPreservesPitch?: boolean };

export default function PlakCalar() {
  const pathname = usePathname();
  const kokRef = useRef<HTMLDivElement>(null);
  const studio = pathname?.startsWith("/studio") ?? false;

  useEffect(() => {
    const kok = kokRef.current;
    if (!kok || studio) return;
    const $ = <T extends Element = HTMLElement>(s: string) => kok.querySelector(s) as T;

    const sekme = $<HTMLButtonElement>(".pc-sekme"), perde = $(".pc-perde"), kapatBtn = $<HTMLButtonElement>(".pc-kapat");
    const calar = $(".pc-calar"), plakEl = $(".pc-plak"), plakAd = $(".pc-plak-ad"), kolG = $<SVGGElement>(".pc-kol-g"), mini = $(".pc-mini");
    const baslik = $(".pc-baslik"), altyazi = $(".pc-altyazi"), simdiEl = $(".pc-simdi"), toplamEl = $(".pc-toplam"), dolu = $(".pc-dolu"), cubuk = $(".pc-cubuk");
    const oynatBtn = $<HTMLButtonElement>(".pc-oynat"), ikonCal = $(".pc-ikon-cal"), ikonDur = $(".pc-ikon-dur");
    const cikarBtn = $<HTMLButtonElement>(".pc-cikar"), hacimEl = $<HTMLInputElement>(".pc-hacim"), raf = $(".pc-raf");
    const eqBars = Array.from(sekme.querySelectorAll<HTMLElement>(".pc-eq i"));
    const kapaklar = Array.from(raf.querySelectorAll<HTMLButtonElement>(".pc-kapak"));
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const temizlik: Array<() => void> = [];
    const dinle = (hedef: EventTarget, tur: string, fn: (e: never) => void, opt?: AddEventListenerOptions) => {
      hedef.addEventListener(tur, fn as EventListener, opt);
      temizlik.push(() => hedef.removeEventListener(tur, fn as EventListener, opt));
    };

    // ---- panel ----
    const acikMi = () => kok.classList.contains("pc-acik");
    const ac = () => {
      kok.classList.add("pc-acik"); sekme.setAttribute("aria-expanded", "true"); sekme.classList.remove("pc-davet");
      setTimeout(() => kapatBtn.focus({ preventScroll: true }), 80);
    };
    const kapat = () => { kok.classList.remove("pc-acik"); sekme.setAttribute("aria-expanded", "false"); sekme.focus({ preventScroll: true }); };
    dinle(sekme, "click", ac); dinle(kapatBtn, "click", kapat); dinle(perde, "click", kapat);
    dinle(window, "keydown", (e: KeyboardEvent) => { if (e.key === "Escape" && acikMi()) kapat(); });
    const davet1 = setTimeout(() => {
      if (!acikMi()) sekme.classList.add("pc-davet");
      setTimeout(() => sekme.classList.remove("pc-davet"), 3200);
    }, 4200);
    temizlik.push(() => clearTimeout(davet1));

    // ---- ses ----
    const audio = new Audio() as SesliAudio; audio.preload = "none";
    let ctx: AudioContext | null = null, anaGain: GainNode | null = null, cizGain: GainNode | null = null;
    let analiz: AnalyserNode | null = null, frek: Uint8Array<ArrayBuffer> | null = null, hacim = +hacimEl.value;
    const sesKur = () => {
      if (ctx) { if (ctx.state === "suspended") void ctx.resume(); return; }
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctx = new AC();
        const kaynak = ctx.createMediaElementSource(audio);
        anaGain = ctx.createGain(); anaGain.gain.value = 0;
        analiz = ctx.createAnalyser(); analiz.fftSize = 256; analiz.smoothingTimeConstant = 0.78;
        kaynak.connect(anaGain); anaGain.connect(analiz); analiz.connect(ctx.destination);
        frek = new Uint8Array(new ArrayBuffer(analiz.frequencyBinCount));
        const sr = ctx.sampleRate, L = sr * 4, buf = ctx.createBuffer(1, L, sr), d = buf.getChannelData(0);
        for (let i = 0; i < L; i++) d[i] = (Math.random() * 2 - 1) * 0.05;
        for (let n = 0; n < L;) {
          n += Math.floor(sr * (0.03 + Math.random() * 0.3));
          const a = Math.pow(Math.random(), 3) * 0.8 + 0.04, len = Math.floor(sr * 0.0025);
          for (let k = 0; k < len && n + k < L; k++) d[n + k] += a * (Math.random() * 2 - 1) * Math.exp(-k / (len / 4));
        }
        const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 650;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 6500;
        cizGain = ctx.createGain(); cizGain.gain.value = 0;
        src.connect(hp); hp.connect(lp); lp.connect(cizGain); cizGain.connect(ctx.destination); src.start();
        void ctx.resume();
      } catch { ctx = null; }
    };
    const rampa = (g: GainNode | null, v: number, s: number) => {
      if (!ctx || !g) return; const t = ctx.currentTime;
      g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(v, t + s);
    };
    const sesSeviye = (v: number) => { if (ctx) rampa(anaGain, v, 0.25); else audio.volume = Math.max(0, Math.min(1, v)); };
    const sustur = () => { if (ctx && anaGain) { anaGain.gain.cancelScheduledValues(ctx.currentTime); anaGain.gain.value = 0; } else audio.volume = 0; };
    const hazirla = () => { sustur(); audio.playbackRate = 1; audio.play().catch(() => {}); };
    const igneSesi = () => {
      if (!ctx) return; const t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(85, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.14);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3 * hacim + 0.0001, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.22);
      const L = Math.floor(ctx.sampleRate * 0.09), b = ctx.createBuffer(1, L, ctx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < L; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (L / 7)) * 0.45;
      const s = ctx.createBufferSource(), g2 = ctx.createGain(); s.buffer = b; g2.gain.value = 0.55 * hacim; s.connect(g2); g2.connect(ctx.destination); s.start(t);
    };
    dinle(hacimEl, "input", () => {
      hacim = +hacimEl.value;
      if (durum === "caliyor") { sesSeviye(hacim); rampa(cizGain, hacim * 0.32, 0.1); }
    });

    // ---- kol geometrisi ----
    const MERKEZ = { x: 128, y: 125 }, PIVOT = { x: 292, y: 52 }, IGNE = { x: -6, y: 177 };
    const tablo: Array<[number, number]> = [];
    for (let a = 0; a < 70; a += 0.05) {
      const r = (a * Math.PI) / 180;
      const x = PIVOT.x + IGNE.x * Math.cos(r) - IGNE.y * Math.sin(r), y = PIVOT.y + IGNE.x * Math.sin(r) + IGNE.y * Math.cos(r);
      const dd = Math.hypot(x - MERKEZ.x, y - MERKEZ.y);
      if (tablo.length && dd > tablo[tablo.length - 1][1]) break;
      tablo.push([a, dd]);
    }
    const aciIcin = (rad: number) => {
      for (let i = 1; i < tablo.length; i++) {
        if (tablo[i][1] <= rad) { const [a0, d0] = tablo[i - 1], [a1, d1] = tablo[i]; return a0 + ((a1 - a0) * (d0 - rad)) / (d0 - d1); }
      }
      return tablo[tablo.length - 1][0];
    };
    const DIS = 95, IC = 43, HEDEF_HIZ = 200; // 33⅓ devir/dk = 200°/sn

    // ---- durum ----
    let plakIdx: number | null = null, durum: Durum = "bos", konum = 0, donus = 0, miniDonus = 0, hiz = 0, kolAci = 0, kalkik = 1, seviye = 0, inisSaat = 0;
    const sure = () => (isFinite(audio.duration) ? audio.duration : 0);
    const yuzde = () => { const s = sure(); return s ? Math.min(1, (durum === "caliyor" ? audio.currentTime : konum) / s) : 0; };
    const fmt = (t: number) => { if (!isFinite(t) || t < 0) return "—:—"; t = Math.floor(t); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); };

    const arayuz = () => {
      const p = plakIdx === null ? null : PLAKLAR[plakIdx];
      baslik.textContent = p ? p.ad : "Bir plak seçin";
      altyazi.textContent = p ? `${SANATCI} · ${p.tur}` : "RAFTAN BİR PLAĞI TABLAYA KOYUN";
      const calisiyor = durum === "caliyor" || durum === "iniyor";
      oynatBtn.disabled = !p; cikarBtn.disabled = !p;
      oynatBtn.setAttribute("aria-label", calisiyor ? "Durdur" : "Çal");
      ikonCal.toggleAttribute("hidden", calisiyor); ikonDur.toggleAttribute("hidden", !calisiyor);
      kapaklar.forEach((k, i) => k.classList.toggle("pc-tablada", i === plakIdx));
      sekme.classList.toggle("pc-caliyor", durum === "caliyor");
      sekme.setAttribute("aria-label", durum === "caliyor" && p ? `Plak çalar: ${p.ad} çalıyor` : "Plak çaları aç");
      const renk = p ? p.renk : "#e3e3db";
      calar.style.setProperty("--pc-renk", renk); mini.style.setProperty("--pc-renk", renk);
    };
    const plakGoster = (p: Plak) => { plakEl.style.setProperty("--pc-renk", p.renk); plakAd.textContent = p.ad.toLocaleUpperCase("tr"); plakEl.classList.add("pc-var"); };
    const plakGizle = () => plakEl.classList.remove("pc-var");
    const tablaKutu = () => plakEl.getBoundingClientRect();

    // ---- uçuş ----
    const ucanYap = (renk: string, w: number) => {
      const el = document.createElement("div"); el.className = "pc-vinil pc-ucan"; el.style.setProperty("--pc-renk", renk);
      el.style.width = el.style.height = w + "px"; el.innerHTML = '<span class="pc-orta"></span>'; kok.appendChild(el); return el;
    };
    const ucur = (den: DOMRect, hedef: DOMRect, renk: string, bitti: () => void) => {
      if (azHareket) { bitti(); return; }
      const el = ucanYap(renk, hedef.width); el.style.left = hedef.left + "px"; el.style.top = hedef.top + "px";
      const s = den.width / hedef.width, dx = den.left - hedef.left + (den.width - hedef.width) / 2, dy = den.top - hedef.top + (den.height - hedef.height) / 2;
      const an = el.animate([{ transform: `translate(${dx}px,${dy}px) scale(${s}) rotate(-50deg)` }, { transform: "none" }], { duration: 720, easing: "cubic-bezier(.2,.75,.2,1)" });
      an.onfinish = () => { el.remove(); bitti(); };
    };

    // ---- akış ----
    const cal = (akista?: boolean) => {
      if (plakIdx === null) return;
      if (!akista) { sesKur(); hazirla(); }
      if (sure() && konum >= sure() - 0.3) konum = 0;
      durum = "iniyor"; inisSaat = 0; arayuz();
    };
    const plakSec = (i: number, den: DOMRect) => {
      sesKur();
      if (plakIdx === i) { if (durum === "hazir") cal(); return; }
      if (plakIdx !== null) { hemenDur(); plakGizle(); }
      plakIdx = i; const p = PLAKLAR[i];
      audio.src = p.dosya; audio.preload = "auto"; konum = 0; durum = "yukleniyor";
      hazirla(); arayuz();
      ucur(den, tablaKutu(), p.renk, () => { plakGoster(p); if (durum === "yukleniyor") cal(true); });
    };
    const inis = () => {
      durum = "caliyor";
      if (audio.paused) audio.play().catch(() => {});
      try { audio.currentTime = konum; } catch { /* yok */ }
      igneSesi();
      setTimeout(() => { if (durum !== "caliyor") return; sesSeviye(hacim); rampa(cizGain, hacim * 0.32, 0.4); }, 140);
      arayuz();
    };
    const durdur = () => {
      if (durum === "iniyor") { durum = "hazir"; audio.pause(); sustur(); arayuz(); return; }
      if (durum !== "caliyor") return;
      durum = "duruyor"; konum = audio.currentTime; rampa(cizGain, 0, 0.25);
      audio.preservesPitch = false; audio.mozPreservesPitch = false; audio.webkitPreservesPitch = false;
      const t0 = performance.now();
      const adim = () => {
        const k = Math.min(1, (performance.now() - t0) / 700);
        try { audio.playbackRate = Math.max(0.3, 1 - k * 0.7); } catch { /* yok */ }
        if (ctx && anaGain) { anaGain.gain.cancelScheduledValues(ctx.currentTime); anaGain.gain.value = hacim * Math.pow(1 - k, 1.6); } else audio.volume = hacim * (1 - k);
        if (k < 1 && durum === "duruyor") requestAnimationFrame(adim);
        else { audio.pause(); audio.playbackRate = 1; if (durum === "duruyor") durum = "hazir"; arayuz(); }
      };
      adim(); arayuz();
    };
    const hemenDur = () => { audio.pause(); sustur(); rampa(cizGain, 0, 0.05); audio.playbackRate = 1; durum = "bos"; konum = 0; };
    const cikar = () => {
      if (plakIdx === null) return;
      const i = plakIdx, den = tablaKutu(); hemenDur(); plakGizle(); plakIdx = null; kapaklar[i].classList.add("pc-havada"); arayuz();
      ucur(den, kapaklar[i].querySelector(".pc-vinil")!.getBoundingClientRect(), PLAKLAR[i].renk, () => kapaklar[i].classList.remove("pc-havada"));
    };
    dinle(audio, "ended", () => { durum = "hazir"; konum = 0; sustur(); rampa(cizGain, 0, 0.3); arayuz(); });
    dinle(oynatBtn, "click", () => { if (durum === "caliyor" || durum === "iniyor") durdur(); else cal(); });
    dinle(cikarBtn, "click", cikar);
    dinle(kolG.querySelector(".pc-kol-tut")!, "click", () => { if (durum === "caliyor" || durum === "iniyor") durdur(); else if (plakIdx !== null) cal(); });

    const ilerle = (e: PointerEvent) => {
      const r = cubuk.getBoundingClientRect(), f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), s = sure();
      if (!s) return; konum = f * s;
      if (durum === "caliyor") { try { audio.currentTime = konum; } catch { /* yok */ } }
    };
    dinle(cubuk, "pointerdown", (e: PointerEvent) => { ilerle(e); cubuk.setPointerCapture(e.pointerId); });
    dinle(cubuk, "pointermove", (e: PointerEvent) => { if (cubuk.hasPointerCapture(e.pointerId)) ilerle(e); });
    dinle(cubuk, "keydown", (e: KeyboardEvent) => {
      const s = sure(); if (!s) return;
      const d = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0; if (!d) return; e.preventDefault();
      konum = Math.max(0, Math.min(s, (durum === "caliyor" ? audio.currentTime : konum) + d)); if (durum === "caliyor") audio.currentTime = konum;
    });

    // ---- sürükle bırak (fare) ve dokunma ----
    type Surukleme = { k: HTMLButtonElement; i: number; x: number; y: number; aktif: boolean; el: HTMLDivElement | null; w: number; id: number };
    let sur: Surukleme | null = null, tikEngel = false;
    const tablaUstunde = (x: number, y: number) => { const r = tablaKutu(); return Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) < r.width * 0.62; };
    dinle(raf, "pointerdown", (e: PointerEvent) => {
      const k = (e.target as HTMLElement).closest<HTMLButtonElement>(".pc-kapak");
      if (!k || e.pointerType === "touch" || e.button !== 0) return;
      sur = { k, i: +(k.dataset.i ?? 0), x: e.clientX, y: e.clientY, aktif: false, el: null, w: 0, id: e.pointerId };
    });
    dinle(window, "pointermove", (e: PointerEvent) => {
      if (!sur || e.pointerId !== sur.id) return;
      if (!sur.aktif && Math.hypot(e.clientX - sur.x, e.clientY - sur.y) > 7) {
        sur.aktif = true; sur.w = tablaKutu().width * 0.7 || 140;
        sur.el = ucanYap(PLAKLAR[sur.i].renk, sur.w); sur.k.classList.add("pc-havada"); calar.classList.add("pc-hedef"); document.body.style.cursor = "grabbing";
      }
      if (sur.aktif && sur.el) {
        sur.el.style.left = e.clientX - sur.w / 2 + "px"; sur.el.style.top = e.clientY - sur.w / 2 + "px";
        calar.classList.toggle("pc-uzerinde", tablaUstunde(e.clientX, e.clientY));
      }
    });
    const birak = (e: PointerEvent, iptal: boolean) => {
      if (!sur || e.pointerId !== sur.id) return; const s = sur; sur = null; if (!s.aktif || !s.el) return;
      tikEngel = true; setTimeout(() => (tikEngel = false), 60); calar.classList.remove("pc-hedef", "pc-uzerinde"); document.body.style.cursor = "";
      const r = s.el.getBoundingClientRect(); s.el.remove(); s.k.classList.remove("pc-havada");
      if (!iptal && tablaUstunde(e.clientX, e.clientY)) plakSec(s.i, r);
      else { s.k.classList.add("pc-havada"); ucur(r, s.k.querySelector(".pc-vinil")!.getBoundingClientRect(), PLAKLAR[s.i].renk, () => s.k.classList.remove("pc-havada")); }
    };
    dinle(window, "pointerup", (e: PointerEvent) => birak(e, false));
    dinle(window, "pointercancel", (e: PointerEvent) => birak(e, true));
    dinle(raf, "click", (e: MouseEvent) => {
      const k = (e.target as HTMLElement).closest<HTMLButtonElement>(".pc-kapak"); if (!k || tikEngel) return;
      plakSec(+(k.dataset.i ?? 0), k.querySelector(".pc-vinil")!.getBoundingClientRect());
    });

    // ---- döngü ----
    let onceki = performance.now(), sahteFaz = 0, raf_id = 0;
    const dongu = (simdi: number) => {
      const dt = Math.min(0.05, (simdi - onceki) / 1000); onceki = simdi;
      const donsun = durum === "iniyor" || durum === "caliyor";
      hiz += ((donsun ? HEDEF_HIZ : 0) - hiz) * Math.min(1, dt * (donsun ? 2.4 : durum === "duruyor" ? 2.2 : 1.6));
      if (hiz < 0.5 && !donsun) hiz = 0;
      donus = (donus + hiz * dt) % 360;
      // sekmedeki minik plak: çalarken tablayla aynı hızda, boşta yavaşça döner
      miniDonus = (miniDonus + Math.max(hiz, azHareket ? 0 : 22) * dt) % 360;
      plakEl.style.transform = `rotate(${donus}deg)`;
      mini.style.transform = `rotate(${miniDonus}deg)`;
      calar.classList.toggle("pc-donuyor", hiz > 20);

      let hedefAci = 0;
      if (plakIdx !== null && donsun) hedefAci = aciIcin(DIS - (DIS - IC) * yuzde());
      const fark = hedefAci - kolAci;
      kolAci += Math.sign(fark) * Math.min(Math.abs(fark), Math.max(0.02, Math.abs(fark) * dt * 3.4), (azHareket ? 120 : 34) * dt);
      kalkik += ((durum === "caliyor" ? 0 : 1) - kalkik) * Math.min(1, dt * 6);
      kolG.setAttribute("transform", `rotate(${kolAci.toFixed(3)} 292 52)`);
      kolG.style.filter = `drop-shadow(${(2 + kalkik * 5).toFixed(1)}px ${(3 + kalkik * 7).toFixed(1)}px ${(2.5 + kalkik * 4).toFixed(1)}px rgba(0,0,0,.6))`;
      if (durum === "iniyor" && Math.abs(hedefAci - kolAci) < 0.25 && hiz > HEDEF_HIZ * 0.9) { inisSaat += dt; if (inisSaat > 0.18) inis(); }

      let bantlar = [0, 0, 0];
      if (durum === "caliyor") {
        if (analiz && frek) {
          analiz.getByteFrequencyData(frek);
          const ort = (a: number, b: number) => { let s = 0; for (let i = a; i < b; i++) s += frek![i]; return s / (b - a) / 255; };
          bantlar = [ort(1, 5), ort(5, 22), ort(22, 64)];
        } else { sahteFaz += dt * 7; bantlar = [0.5 + 0.4 * Math.sin(sahteFaz), 0.45 + 0.4 * Math.sin(sahteFaz * 1.3 + 1), 0.4 + 0.35 * Math.sin(sahteFaz * 1.7 + 2)]; }
      }
      const hedefSeviye = durum === "caliyor" ? 0.38 + Math.min(1, bantlar[0] * 0.9 + bantlar[1] * 0.5) * 0.62 : plakIdx !== null ? 0.16 : 0;
      seviye += (hedefSeviye - seviye) * Math.min(1, dt * (hedefSeviye > seviye ? 14 : 4));
      calar.style.setProperty("--isik", seviye.toFixed(3));
      eqBars.forEach((b, i) => { b.style.height = (20 + Math.min(1, bantlar[i] * 1.5) * 80).toFixed(0) + "%"; });

      const s = sure(), t = durum === "caliyor" ? audio.currentTime : konum;
      simdiEl.textContent = fmt(plakIdx === null ? 0 : t); toplamEl.textContent = plakIdx === null ? "—:—" : fmt(s);
      const f = s ? Math.min(1, t / s) : 0; dolu.style.width = f * 100 + "%"; cubuk.setAttribute("aria-valuenow", String(Math.round(f * 100)));
      raf_id = requestAnimationFrame(dongu);
    };
    raf_id = requestAnimationFrame(dongu);
    arayuz();

    return () => {
      cancelAnimationFrame(raf_id); temizlik.forEach((f) => f());
      audio.pause(); audio.removeAttribute("src");
      if (ctx) void ctx.close();
      kok.querySelectorAll(".pc-ucan").forEach((el) => el.remove());
    };
  }, [studio]);

  if (studio) return null;

  return (
    <div className="pc-kok" ref={kokRef}>
      <button className="pc-sekme" aria-label="Plak çaları aç" aria-expanded="false" aria-controls="pc-panel">
        <span className="pc-sekme-yazi">SÜSELİ PLAKLARI</span>
        <span className="pc-mini pc-vinil"><span className="pc-orta" /></span>
        <span className="pc-eq" aria-hidden="true"><i /><i /><i /></span>
      </button>
      <div className="pc-perde" />

      <aside className="pc-panel" id="pc-panel" role="dialog" aria-label="SÜSELİ plak çalar" data-lenis-prevent>
        <div className="pc-panel-ust">
          <div className="pc-etiket-ust">SÜSELİ PLAKLARI</div>
          <button className="pc-kapat" aria-label="Paneli kapat">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" /></svg>
          </button>
        </div>

        <div className="pc-calar">
          <div className="pc-govde" />
          <div className="pc-marka">SÜSELİ</div>
          <div className="pc-hiz"><i />33⅓</div>
          <div className="pc-halka" />
          <div className="pc-tabla" />
          <div className="pc-vinil pc-plak"><span className="pc-orta"><b className="pc-plak-ad" /><small>33⅓ · A</small></span></div>
          <div className="pc-parlama" />
          <svg className="pc-kol" viewBox="0 0 340 250" aria-hidden="true">
            <defs>
              <linearGradient id="pc-metal" x1="0" x2="1"><stop offset="0" stopColor="#66666b" /><stop offset=".45" stopColor="#e2e2e5" /><stop offset="1" stopColor="#76767c" /></linearGradient>
              <radialGradient id="pc-taban"><stop offset="0" stopColor="#3a3a40" /><stop offset="1" stopColor="#17171a" /></radialGradient>
            </defs>
            <circle cx="292" cy="52" r="22" fill="url(#pc-taban)" stroke="rgba(255,255,255,.14)" />
            <circle cx="292" cy="52" r="14" fill="none" stroke="rgba(255,255,255,.08)" />
            <rect x="304" y="174" width="8" height="20" rx="3" fill="#1c1c20" stroke="rgba(255,255,255,.13)" />
            <g className="pc-kol-g">
              <rect x="284" y="15" width="16" height="23" rx="5" fill="url(#pc-metal)" />
              <rect x="290" y="38" width="4" height="168" rx="2" fill="url(#pc-metal)" />
              <path d="M287 200 L299 204 L294 234 L279 231 Z" fill="#202024" stroke="url(#pc-metal)" strokeWidth="1.2" />
              <rect x="297" y="205" width="10" height="2.6" rx="1.3" fill="url(#pc-metal)" transform="rotate(20 297 206)" />
              <circle cx="292" cy="52" r="7.5" fill="url(#pc-metal)" />
              <circle cx="292" cy="52" r="2.2" fill="#2a2a2e" />
              <rect className="pc-kol-tut" x="276" y="150" width="30" height="90" fill="transparent" />
            </g>
          </svg>
        </div>

        <div className="pc-calan" aria-live="polite">
          <h2 className="pc-baslik">Bir plak seçin</h2>
          <div className="pc-alt pc-altyazi">RAFTAN BİR PLAĞI TABLAYA KOYUN</div>
          <div className="pc-sure">
            <span className="pc-simdi">0:00</span>
            <div className="pc-cubuk" role="slider" aria-label="Parçada ilerle" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} tabIndex={0}><i className="pc-dolu" /></div>
            <span className="pc-toplam">—:—</span>
          </div>
        </div>

        <div className="pc-kontroller">
          <button className="pc-oynat" aria-label="Çal" disabled>
            <span className="pc-ikon-cal"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 2.5v13l11-6.5z" fill="currentColor" /></svg></span>
            <span className="pc-ikon-dur" hidden><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5h3.5v13H4zM10.5 2.5H14v13h-3.5z" fill="currentColor" /></svg></span>
          </button>
          <button className="pc-cikar" disabled aria-label="Plağı rafa geri koy">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5L11 7H1zM1 9h10v1.5H1z" fill="currentColor" /></svg>RAFA
          </button>
          <label className="pc-ses">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" /><path d="M11.5 5.5a3.5 3.5 0 010 5" stroke="currentColor" fill="none" /></svg>
            <input className="pc-hacim" type="range" min="0" max="1" step="0.01" defaultValue="0.8" aria-label="Ses düzeyi" />
          </label>
        </div>

        <div className="pc-raf-ust"><span>RAF</span><small>{PLAKLAR.length} PLAK</small></div>
        <div className="pc-raf" role="list" data-lenis-prevent>
          {PLAKLAR.map((p, i) => (
            <button key={p.dosya} className={`pc-kapak ${p.sinif}`} data-i={i} role="listitem" aria-label={`${p.ad} plağını tablaya koy`}>
              <span className="pc-vinil" style={{ "--pc-renk": p.renk } as React.CSSProperties}><span className="pc-orta" /></span>
              <span className="pc-yuz">{p.sanat}<b>{p.ad}</b><small>{SANATCI}</small><em>TABLADA</em></span>
            </button>
          ))}
        </div>
        <p className="pc-ipucu">Bir plağı kapaktan tablaya sürükleyin ya da kapağa dokunun. Kola dokunarak durdurabilirsiniz.</p>
      </aside>
    </div>
  );
}
