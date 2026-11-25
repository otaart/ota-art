'use client';
// Author page, Nini's Figma of 20 Nov 2026 (desktop frame Author 1, phone frame 75:57).
// Rule (Sophia, 20 Nov): the texts never cover the light strip where Ota is visible, nor the light
// brick edge, on any screen. Shapes are in author.jpg pixels (2048 x 1367) with a safety margin; each
// text block keeps Nini's position when clear, otherwise moves the shortest distance onto the dark
// stone, and only if nothing fits shrinks a little (down to 70%).

import { useEffect, useRef } from 'react';
import type { Img } from '@/lib/media';

const STRIP: [number, number][] = [[1335, 285], [1395, 285], [1395, 500], [400, 1367], [40, 1367]];
const BRICK: [number, number][] = [[1760, 620], [2048, 620], [2048, 1367], [1760, 1367]];
const GAP = 12;
// shapes above are in pixels of the 2048 x 1367 master; naturalWidth cannot be used because the
// browser picks a responsive copy (and reports its size adjusted for screen density)
const SRC_W = 2048, SRC_H = 1367;
type R = { l: number; t: number; r: number; b: number };

function poly2screen(P: [number, number][], r: DOMRect, iw: number, ih: number) {
  const s = Math.max(r.width / iw, r.height / ih), ox = r.left + (r.width - iw * s) / 2, oy = r.top + (r.height - ih * s) / 2;
  return P.map(([x, y]) => [ox + x * s, oy + y * s] as [number, number]);
}
function axes(P: [number, number][]) { return P.map((p, i) => { const q = P[(i + 1) % P.length]; return [q[1] - p[1], p[0] - q[0]] as [number, number]; }); }
function proj(P: [number, number][], ax: [number, number]) { let mn = 1e9, mx = -1e9; for (const p of P) { const d = p[0] * ax[0] + p[1] * ax[1]; if (d < mn) mn = d; if (d > mx) mx = d; } return [mn, mx]; }
function hitPoly(R: R, P: [number, number][]) {
  const RP: [number, number][] = [[R.l, R.t], [R.r, R.t], [R.r, R.b], [R.l, R.b]];
  for (const ax of axes(P).concat([[1, 0], [0, 1]])) { const a = proj(RP, ax), b = proj(P, ax); if (a[1] <= b[0] || b[1] <= a[0]) return false; }
  return true;
}
const hitRect = (A: R, B: R) => !(A.r + GAP <= B.l || B.r + GAP <= A.l || A.b + GAP <= B.t || B.b + GAP <= A.t);
function boxOf(els: HTMLElement[]): R {   // measures the actual text lines, not the empty box around them
  let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
  for (const e of els) { const rg = document.createRange(); rg.selectNodeContents(e); for (const q of rg.getClientRects()) { if (!q.width) continue; l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); } }
  return { l, t, r, b };
}

export default function AuthorView({ photo, t }: {
  photo: Img;
  t: { name: string; lead: string; p1: string; p2: string; quote: string; quoteLines: string[]; attribution: string };
}) {
  const view = useRef<HTMLElement>(null);

  useEffect(() => {
    const v = view.current!;
    const run = (force?: number) => {
      const stage = v.querySelector<HTMLElement>('.stage')!, img = v.querySelector<HTMLImageElement>('.bg');
      if (!img || !img.naturalWidth) return;
      const mob = getComputedStyle(v.querySelector('.mauth')!).display !== 'none';
      const groups = mob ? [['.mauth .aname'], ['.mauth .abio:not(.abio2)'], ['.mauth .aquote', '.mauth .aatt'], ['.mauth .abio2']] : [['.aleft'], ['.aright']];
      const G = groups.map((g) => g.map((s) => v.querySelector<HTMLElement>(s)).filter(Boolean) as HTMLElement[]);
      G.flat().forEach((e) => { e.style.transform = ''; e.style.transformOrigin = ''; });
      if (mob) {
        stage.style.minHeight = '';
        const q = v.querySelector<HTMLElement>('.mauth .aquote'), a = v.querySelector<HTMLElement>('.mauth .aatt');
        if (q && a) a.style.top = q.offsetTop + q.offsetHeight + 6 + 'px';   // author line close to the quote
      }
      const ir = img.getBoundingClientRect(), iw = SRC_W, ih = SRC_H;
      const bad = [poly2screen(STRIP, ir, iw, ih), poly2screen(BRICK, ir, iw, ih)];
      const sr = stage.getBoundingClientRect(), W = document.documentElement.clientWidth;
      const bm = document.querySelector('.bmenu'), bq = bm && bm.getBoundingClientRect();
      const top0 = Math.max(sr.top + (mob ? 60 : 56), bq && bq.height ? bq.bottom + 16 : 0), bot0 = mob ? 1e9 : sr.bottom - 16;
      const placed: R[] = [];
      let maxB = 0;
      for (const els of G) {
        if (!els.length) continue;
        let best: null | { dx: number; dy: number; c: number; Q: R; s: number } = null;
        for (let sc = force || 1; sc >= 0.7 && !best; sc = Math.round((sc - 0.05) * 100) / 100) {
          els.forEach((e) => { e.style.transformOrigin = getComputedStyle(e).textAlign === 'right' ? 'right top' : 'left top'; e.style.transform = sc < 1 ? `scale(${sc})` : ''; });
          const Rb = boxOf(els);
          for (let dy = -240; dy <= 420; dy += 4) for (let dx = -240; dx <= 240; dx += 4) {
            if (mob && dx && els[0].classList.contains('abio')) continue;   // both paragraphs keep the same left edge
            const c = Math.abs(dx) * 1.5 + Math.abs(dy);
            if (best && c >= best.c) continue;
            const Q = { l: Rb.l + dx, r: Rb.r + dx, t: Rb.t + dy, b: Rb.b + dy };
            if (Q.l < 12 || Q.r > W - 12 || Q.t < top0 || Q.b > bot0) continue;
            if (bad.some((P) => hitPoly(Q, P))) continue;
            if (placed.some((P) => hitRect(Q, P))) continue;
            best = { dx, dy, c, Q, s: sc };
          }
        }
        if (!best) { els.forEach((e) => { e.style.transform = ''; }); best = { dx: 0, dy: 0, c: 0, s: 1, Q: boxOf(els) }; }
        const b = best;
        els.forEach((e) => { e.style.transform = (b.dx || b.dy ? `translate(${b.dx}px,${b.dy}px) ` : '') + (b.s < 1 ? `scale(${b.s})` : ''); });
        placed.push(b.Q);
        maxB = Math.max(maxB, b.Q.b - sr.top);
      }
      if (mob) {   // both paragraphs identical in size
        const ps = [v.querySelector<HTMLElement>('.mauth .abio:not(.abio2)'), v.querySelector<HTMLElement>('.mauth .abio2')].filter(Boolean) as HTMLElement[];
        const scl = (e: HTMLElement) => { const m = (e.style.transform || '').match(/scale\(([\d.]+)\)/); return m ? +m[1] : 1; };
        const mn = Math.min(...ps.map(scl));
        ps.forEach((e) => { e.style.transformOrigin = 'left top'; const tr = (e.style.transform || '').replace(/scale\([\d.]+\)/, '').trim(); e.style.transform = (tr + (mn < 1 ? ` scale(${mn})` : '')).trim(); });
        if (maxB + 44 > sr.height) stage.style.minHeight = Math.ceil(maxB + 44) + 'px';
      }
      if (!mob && !force) {   // equal sizes
        const s = G.map((els) => { const m = (els[0].style.transform || '').match(/scale\(([\d.]+)\)/); return m ? +m[1] : 1; });
        const mn = Math.min(...s);
        if (s.some((x) => x !== mn)) run(mn);
      }
    };
    let raf = 0;
    const go = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => run()); };
    const img = v.querySelector<HTMLImageElement>('.bg');
    if (img?.complete) go(); else img?.addEventListener('load', go);
    addEventListener('resize', go);
    const ro = new ResizeObserver(go); ro.observe(v);
    document.fonts?.ready.then(go);
    return () => { removeEventListener('resize', go); ro.disconnect(); img?.removeEventListener('load', go); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="view" id="v-author" ref={view}>
      <div className="stage">
        <img className="bg" src={photo.src} srcSet={photo.srcSet} sizes="100vw" alt={t.name} fetchPriority="high" />
        <div className="dk aleft">
          <h1 className="aname">{t.name}</h1>
          <p className="abio"><span className="gold">{t.lead}</span> {t.p1}</p>
          <p className="abio abio2">{t.p2}</p>
        </div>
        <div className="dk aright">
          <blockquote className="aquote" style={{ margin: 0 }}>{t.quote}</blockquote>
          <div className="aatt">{t.attribution}</div>
        </div>
        <div className="m mauth">
          <div className="aname">{t.name}</div>
          <p className="abio"><span className="gold">{t.lead}</span> {t.p1}</p>
          <p className="abio abio2">{t.p2}</p>
          <div className="aquote">{t.quoteLines.map((l, i) => <span key={i}>{l}</span>)}</div>
          <div className="aatt">{t.attribution}</div>
        </div>
      </div>
    </section>
  );
}
