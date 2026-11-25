'use client';
// Works: desktop shows one continuous wall scrolled sideways (wheel, arrows, ticks, keyboard);
// phones show one column. Nini's 17 Nov design: no button on the painting, OPEN appears on hover.

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CaptionLine } from './Caption';
import { PHONE_MQ, reducedMotion } from './ChromeContext';
import type { WorkView } from '@/lib/content';

const X_KEY = 'ota-works-x';

export default function WorksWall({ locale, works, t }: {
  locale: string; works: WorkView[];
  t: { heading: string; open: string; prev: string; next: string; inquire: string; ticks: string[]; openWork: string[] };
}) {
  const hgal = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const prevBtn = useRef<HTMLButtonElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const [curI, setCurI] = useState(0);
  const [ends, setEnds] = useState({ start: true, end: false });
  const [onArt, setOnArt] = useState({ prev: false, next: false });
  const snapT = useRef<number | null>(null);

  const items = () => [...(track.current?.querySelectorAll<HTMLElement>('.hitem') || [])];

  /* which work is in the middle, whether the arrows lie over a painting (then they turn light) */
  const hTrack = useCallback(() => {
    const hg = hgal.current;
    if (!hg || !hg.clientWidth) return;
    const max = hg.scrollWidth - hg.clientWidth;
    let best = 0;
    if (hg.scrollLeft >= 4) {
      const c = hg.scrollLeft + hg.clientWidth / 2;
      let bd = 1e9;
      items().forEach((it, i) => { const d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - c); if (d < bd) { bd = d; best = i; } });
    }
    setCurI(best);
    setEnds({ start: hg.scrollLeft < 4, end: hg.scrollLeft > max - 4 });
    const pics = [...hg.querySelectorAll('img')].map((i) => i.getBoundingClientRect());
    const over = (b: HTMLElement | null) => {
      if (!b) return false;
      const r = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      return pics.some((a) => a.left < cx && a.right > cx && a.top < cy && a.bottom > cy);
    };
    setOnArt({ prev: over(prevBtn.current), next: over(nextBtn.current) });
  }, []);

  /* every work at the same height on the wall; only a work wider than the screen is narrowed */
  const layout = useCallback(() => {
    const tr = track.current;
    if (!tr) return;
    const imgs = [...tr.querySelectorAll<HTMLImageElement>('img')];
    if (matchMedia(PHONE_MQ).matches) { imgs.forEach((i) => { i.style.width = ''; i.style.height = ''; }); return; }
    if (!tr.clientHeight) return;
    const hMax = tr.clientHeight * 0.97;
    const bm = document.querySelector('.bmenu') as HTMLElement | null;
    const margin = bm ? parseFloat(getComputedStyle(bm).left) || 20 : 20;
    imgs.forEach((img) => {
      const ar = +(img.dataset.ar || 1);
      let h = hMax * 0.92, w = h * ar;
      const wMax = innerWidth - 2 * margin;
      if (w > wMax) { w = wMax; h = w / ar; }
      img.style.height = Math.round(h) + 'px';
      img.style.width = Math.round(w) + 'px';
    });
    hTrack();
    requestAnimationFrame(hTrack);
  }, [hTrack]);

  useEffect(() => {
    layout();
    // coming back from a painting: the wall is where the visitor left it
    try {
      const x = +(sessionStorage.getItem(X_KEY) || 0);
      sessionStorage.removeItem(X_KEY);
      if (x && hgal.current) { hgal.current.scrollLeft = x; hTrack(); }
    } catch {}
    let rt: number | undefined;
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(layout, 120); };
    addEventListener('resize', onResize);
    return () => removeEventListener('resize', onResize);
  }, [layout, hTrack]);

  /* the mouse wheel moves the wall sideways; trackpads already scroll sideways */
  useEffect(() => {
    const hg = hgal.current;
    if (!hg) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { e.preventDefault(); hg.scrollLeft += e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY; }
    };
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(hTrack); };
    hg.addEventListener('wheel', onWheel, { passive: false });
    hg.addEventListener('scroll', onScroll, { passive: true });
    return () => { hg.removeEventListener('wheel', onWheel); hg.removeEventListener('scroll', onScroll); };
  }, [hTrack]);

  /* each arrow press always moves to the next resting position (a work centred, never past the ends) */
  const stops = () => {
    const hg = hgal.current!, max = hg.scrollWidth - hg.clientWidth;
    return items().map((it) => Math.round(Math.max(0, Math.min(max, it.offsetLeft + it.offsetWidth / 2 - hg.clientWidth / 2))));
  };
  const scrollToX = (x: number) => {
    const hg = hgal.current!;
    hg.style.scrollSnapType = 'none';      // let the smooth move finish without the snap pulling it back
    hg.scrollTo({ left: x, behavior: reducedMotion() ? 'auto' : 'smooth' });
    if (snapT.current) clearTimeout(snapT.current);
    snapT.current = window.setTimeout(() => { hg.style.scrollSnapType = ''; }, 700);
  };
  const step = useCallback((dir: number) => {
    const hg = hgal.current;
    if (!hg) return;
    const now = hg.scrollLeft, st = [...new Set(stops())].sort((a, b) => a - b);
    const tgt = dir > 0 ? st.find((s) => s > now + 8) : [...st].reverse().find((s) => s < now - 8);
    if (tgt !== undefined) scrollToX(tgt);
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (matchMedia(PHONE_MQ).matches || document.querySelector('#menu.on,#subPop.on')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [step]);

  const remember = () => {
    try {
      sessionStorage.setItem('ota-detail-from', 'works');
      if (hgal.current && !matchMedia(PHONE_MQ).matches) sessionStorage.setItem(X_KEY, String(hgal.current.scrollLeft));
    } catch {}
  };
  const href = (w: WorkView) => `/${locale}/works/${w.slug}`;

  return (
    <section className="view" id="v-gallery">
      <h1 className="vh">{t.heading}</h1>
      <div className="dk hgal" id="hgal" ref={hgal}>
        <div className="htrack" id="htrack" ref={track}>
          {works.map((w, i) => (
            <figure className="hitem" data-n={w.n} key={w.slug}>
              <Link className="hpic" href={href(w)} onClick={remember} aria-label={t.openWork[i]}>
                {w.images.wall ? (
                  <img src={w.images.wall.src} srcSet={w.images.wall.srcSet} sizes="(max-width:760px) 92vw, 50vw"
                    alt={w.title} data-ar={w.aspect}
                    loading={i > 1 ? 'lazy' : undefined} decoding="async" onLoad={hTrack}
                    style={w.round ? { borderRadius: '50%' } : undefined} />
                ) : null}
                <span className="hopen" aria-hidden="true">{t.open}</span>
              </Link>
              <figcaption><p className="gcap"><span className="gttl">{w.title}</span><CaptionLine w={w} /></p></figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="dk hchrome">
        <button ref={prevBtn} className={`narr l${ends.start ? ' off' : ''}${onArt.prev ? ' onart' : ''}`} aria-label={t.prev} onClick={() => step(-1)}>&larr;</button>
        <button ref={nextBtn} className={`narr r${ends.end ? ' off' : ''}${onArt.next ? ' onart' : ''}`} aria-label={t.next} onClick={() => step(1)}>&rarr;</button>
        <div className="hbot">
          <div className="ticks" id="hTicks" role="tablist" aria-label={t.heading}>
            {works.map((w, i) => (
              <button key={w.slug} role="tab" aria-label={t.ticks[i]} aria-selected={i === curI}
                className={`${i === curI ? 'on' : ''}${i < curI ? ' past' : ''}`}
                onClick={() => { const s = stops()[i]; if (s !== undefined) scrollToX(s); }} />
            ))}
          </div>
        </div>
      </div>
      <div className="m mgal">
        <div className="mgrp">
          {works.map((w) => (
            <div className="mitem" key={w.slug}>
              <Link href={href(w)} onClick={remember}>
                {w.images.wall ? (
                  <img src={w.images.wall.src} srcSet={w.images.wall.srcSet} sizes="92vw" width={w.images.wall.width} height={w.images.wall.height}
                    alt={w.title} loading="lazy" decoding="async" style={w.round ? { borderRadius: '50%' } : undefined} />
                ) : null}
              </Link>
              <p className="gcap"><span className="gttl">{w.title}</span><CaptionLine w={w} /></p>
            </div>
          ))}
        </div>
      </div>
      <Link className="m minq ginq" href={`/${locale}/inquire`}>{t.inquire}</Link>
    </section>
  );
}
