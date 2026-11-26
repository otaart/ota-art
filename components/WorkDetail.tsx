'use client';
// Detailed view of one work, its own address (/en/works/immortality).
// Pages, in this order everywhere (Sophia, 20 Nov 2026):
//   1 the painting alone, full screen, with zoom (buttons, wheel, drag, pinch, double tap; up to 4x)
//   2 the painting with its description (close-up detail, title, medium and size, text, Inquire)
//   3 the painting in Salome's photo, only for works that have a scene
// Next link bottom right names where it goes; a lone back arrow bottom left; X returns to where
// the visitor came from (the same landing scene, or the same place on the Works wall).

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MetaBlock } from './Caption';
import { PHONE_MQ, reducedMotion } from './ChromeContext';
import { placeScene } from './placeCover';
import type { WorkView } from '@/lib/content';

type Page = 'full' | 'info' | 'set';
const HASH: Record<Page, string> = { full: '', info: '#about', set: '#setting' };
const ZMAX = 4;

export default function WorkDetail({ locale, w, t }: {
  locale: string; w: WorkView;
  t: {
    label: string; close: string; zoom: string; zoomIn: string; zoomOut: string; detailOfArtwork: string; detailOf: string;
    descriptionToCome: string; inquire: string; toAbout: string; toSetting: string; toPainting: string;
    backToPainting: string; backToAbout: string; viewFull: string; inLandscape: string; regarding: string;
  };
}) {
  const router = useRouter();
  const pages: Page[] = w.scene ? ['full', 'info', 'set'] : ['full', 'info'];
  const [dp, setDp] = useState(0);
  const [from, setFrom] = useState<'works' | 'land'>('works');
  const [cameFromSite, setCameFromSite] = useState(false);
  const [loadedFull, setLoadedFull] = useState(false);
  const [hiRes, setHiRes] = useState(false);
  const [zPct, setZPct] = useState(100);
  const [ctlOnArt, setCtlOnArt] = useState(false);
  const [live, setLive] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const zbox = useRef<HTMLDivElement>(null);
  const zimg = useRef<HTMLImageElement>(null);
  const zctl = useRef<HTMLDivElement>(null);
  const setHost = useRef<HTMLDivElement>(null);
  const dpRef = useRef(0);
  const z = useRef({ s: 1, x: 0, y: 0, base: null as DOMRect | null, pinching: false });
  const api = useRef({ reset: () => {}, at: (_s: number, _x: number, _y: number) => {} });

  const page = pages[dp];
  const fill = from === 'land';

  /* where the visitor came from decides how the photo page is framed and where X leads */
  useEffect(() => {
    try {
      const f = sessionStorage.getItem('ota-detail-from');
      sessionStorage.removeItem('ota-detail-from');
      if (f === 'land' || f === 'works') { setFrom(f); setCameFromSite(true); }
    } catch {}
    const h = location.hash;
    const i = pages.findIndex((p) => HASH[p] && HASH[p] === h);
    if (i > 0) setDp(i);
    setLive(!reducedMotion() && h !== '#still');
    if (zimg.current?.complete && zimg.current.naturalWidth) setLoadedFull(true);   // loaded before the script ran
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  const show = useCallback((i: number) => {
    const n = pages.length;
    const k = ((i % n) + n) % n;
    dpRef.current = k;
    setDp(k);
    history.replaceState(history.state, '', location.pathname + HASH[pages[k]]);
  }, [pages.length]);   // eslint-disable-line react-hooks/exhaustive-deps
  const next = useCallback(() => show(dpRef.current + 1 < pages.length ? dpRef.current + 1 : 0), [show, pages.length]);
  const back = useCallback(() => { if (dpRef.current > 0) show(dpRef.current - 1); }, [show]);

  const close = useCallback(() => {
    if (cameFromSite && history.length > 1) router.back();
    else router.push(`/${locale}/works`);
  }, [cameFromSite, router, locale]);

  useEffect(() => { dpRef.current = dp; api.current.reset(); }, [dp]);

  /* ---------- zoom on the full painting ---------- */
  useEffect(() => {
    const box = zbox.current!, im = zimg.current!, ctl = zctl.current!;
    const Z = z.current;
    const measure = () => { const tr = im.style.transform; im.style.transform = 'none'; Z.base = im.getBoundingClientRect(); im.style.transform = tr; };
    const over = () => {
      const a = im.getBoundingClientRect(), b = ctl.getBoundingClientRect();
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      setCtlOnArt(a.width > 0 && a.left < cx && a.right > cx && a.top < cy && a.bottom > cy);
    };
    const clamp = () => {
      if (!Z.base) measure();
      const B = Z.base!, bw = B.width * Z.s, bh = B.height * Z.s, vw = box.clientWidth, vh = box.clientHeight;
      Z.x = bw <= vw ? (vw - bw) / 2 - B.left : Math.min(-B.left, Math.max(vw - bw - B.left, Z.x));
      Z.y = bh <= vh ? (vh - bh) / 2 - B.top : Math.min(-B.top, Math.max(vh - bh - B.top, Z.y));
    };
    const apply = () => {
      clamp();
      im.style.transform = `translate(${Z.x}px,${Z.y}px) scale(${Z.s})`;
      setZPct(Math.round(Z.s * 100));
      if (Z.s > 1.2) setHiRes(true);
      over();
    };
    const at = (ns: number, cx: number, cy: number) => {
      if (!Z.base) measure();
      ns = Math.max(1, Math.min(ZMAX, ns));
      const B = Z.base!, px = (cx - B.left - Z.x) / Z.s, py = (cy - B.top - Z.y) / Z.s;   // the point under the pointer stays put
      Z.s = ns; Z.x = cx - B.left - px * Z.s; Z.y = cy - B.top - py * Z.s;
      apply();
    };
    const reset = () => { Z.s = 1; Z.x = 0; Z.y = 0; Z.base = null; im.style.transform = 'none'; setZPct(100); over(); };
    api.current = { reset, at };

    const full = box.parentElement!;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      d = Math.max(-60, Math.min(60, d));
      at(Z.s * Math.exp(-d * 0.0022), e.clientX, e.clientY);
    };
    let drag: null | { x: number; y: number; zx: number; zy: number } = null;
    let down: null | { x: number; y: number } = null;
    let clickT: number | undefined;
    const pDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') down = { x: e.clientX, y: e.clientY };
      if (e.pointerType === 'touch' || Z.s <= 1) return;
      drag = { x: e.clientX, y: e.clientY, zx: Z.x, zy: Z.y };
      box.setPointerCapture(e.pointerId);
    };
    const pMove = (e: PointerEvent) => { if (!drag) return; Z.x = drag.zx + e.clientX - drag.x; Z.y = drag.zy + e.clientY - drag.y; apply(); };
    const pUp = () => { drag = null; };
    // desktop: a click on the painting goes on to the next page; a double click zooms instead
    const onClick = (e: MouseEvent) => {
      if (!down || matchMedia('(hover:none)').matches) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5;
      down = null;
      if (moved || Z.s > 1.01 || e.detail > 1) { clearTimeout(clickT); return; }
      if (e.target !== im) return;
      clearTimeout(clickT);
      clickT = window.setTimeout(next, 280);
    };
    const onDbl = (e: MouseEvent) => { clearTimeout(clickT); if (Z.s > 1.01) reset(); else at(2.5, e.clientX, e.clientY); };
    // touch: pinch, pan, double tap
    let t0: null | { d?: number; s?: number; lx?: number; ly?: number; px?: number; py?: number; x?: number; y?: number; one?: boolean } = null;
    let lastTap = 0;
    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const mid = (t: TouchList) => [(t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2];
    const tStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        Z.pinching = true; if (!Z.base) measure();
        const m = mid(e.touches), B = Z.base!;
        t0 = { d: dist(e.touches), s: Z.s, lx: (m[0] - B.left - Z.x) / Z.s, ly: (m[1] - B.top - Z.y) / Z.s };
      } else if (e.touches.length === 1) {
        t0 = { px: e.touches[0].clientX, py: e.touches[0].clientY, x: Z.x, y: Z.y, one: true };
        const now = Date.now();
        if (now - lastTap < 300) { if (Z.s > 1.01) reset(); else at(2.5, e.touches[0].clientX, e.touches[0].clientY); lastTap = 0; } else lastTap = now;
      }
    };
    const tMove = (e: TouchEvent) => {
      if (!t0) return;
      if (e.touches.length === 2 && t0.d) {
        e.preventDefault();
        const m = mid(e.touches), B = Z.base!;
        Z.s = Math.max(1, Math.min(ZMAX, t0.s! * dist(e.touches) / t0.d));
        Z.x = m[0] - B.left - t0.lx! * Z.s; Z.y = m[1] - B.top - t0.ly! * Z.s; apply();
      } else if (e.touches.length === 1 && t0.one && Z.s > 1) {
        e.preventDefault();
        Z.x = t0.x! + e.touches[0].clientX - t0.px!; Z.y = t0.y! + e.touches[0].clientY - t0.py!; apply();
      }
    };
    const tEnd = (e: TouchEvent) => {
      if (e.touches.length === 1) t0 = { px: e.touches[0].clientX, py: e.touches[0].clientY, x: Z.x, y: Z.y, one: true };
      else if (e.touches.length === 0) { t0 = null; setTimeout(() => { Z.pinching = false; }, 60); }
    };
    full.addEventListener('wheel', onWheel, { passive: false });
    box.addEventListener('pointerdown', pDown);
    box.addEventListener('pointermove', pMove);
    box.addEventListener('pointerup', pUp);
    box.addEventListener('click', onClick);
    box.addEventListener('dblclick', onDbl);
    box.addEventListener('touchstart', tStart, { passive: true });
    box.addEventListener('touchmove', tMove, { passive: false });
    box.addEventListener('touchend', tEnd);
    const onResize = () => reset();
    addEventListener('resize', onResize);
    return () => {
      full.removeEventListener('wheel', onWheel);
      box.removeEventListener('pointerdown', pDown); box.removeEventListener('pointermove', pMove); box.removeEventListener('pointerup', pUp);
      box.removeEventListener('click', onClick); box.removeEventListener('dblclick', onDbl);
      box.removeEventListener('touchstart', tStart); box.removeEventListener('touchmove', tMove); box.removeEventListener('touchend', tEnd);
      removeEventListener('resize', onResize);
      clearTimeout(clickT);
    };
  }, [next]);

  const ctr = (): [number, number] => { const r = zbox.current!.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  /* ---------- phones: a sideways swipe moves between the pages ---------- */
  useEffect(() => {
    const el = root.current!;
    let sx: number | null = null, sy = 0, lx = 0, ly = 0, multi = false;
    const end = () => {
      if (sx === null) return;
      const dx = lx - sx, dy = ly - sy; sx = null;
      if (multi || z.current.pinching || z.current.s > 1.01) return;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { if (dx < 0) next(); else back(); }
    };
    const ts = (e: TouchEvent) => {
      if (e.touches.length > 1) { multi = true; return; }
      if (pages[dpRef.current] === 'full' && z.current.s > 1.01) { sx = null; return; }
      multi = false; sx = lx = e.touches[0].clientX; sy = ly = e.touches[0].clientY;
    };
    const tm = (e: TouchEvent) => { if (sx === null) return; if (e.touches.length > 1) { multi = true; return; } lx = e.touches[0].clientX; ly = e.touches[0].clientY; };
    const te = (e: TouchEvent) => { if (sx === null) return; if (e.changedTouches[0]) { lx = e.changedTouches[0].clientX; ly = e.changedTouches[0].clientY; } if (e.touches.length === 0) end(); };
    el.addEventListener('touchstart', ts, { passive: true });
    el.addEventListener('touchmove', tm, { passive: true });
    el.addEventListener('touchend', te);
    el.addEventListener('touchcancel', end);
    return () => { el.removeEventListener('touchstart', ts); el.removeEventListener('touchmove', tm); el.removeEventListener('touchend', te); el.removeEventListener('touchcancel', end); };
  }, [next, back]);   // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('#subPop.on')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(dpRef.current + 1);
      else if (e.key === 'ArrowLeft') show(dpRef.current - 1);
      else if (pages[dpRef.current] === 'full' && (e.key === '+' || e.key === '=')) api.current.at(z.current.s * 1.5, ...ctr());
      else if (pages[dpRef.current] === 'full' && e.key === '-') api.current.at(z.current.s / 1.5, ...ctr());
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [close, show]);   // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- the painting in its setting ---------- */
  const placeSet = useCallback(() => {
    const host = setHost.current, sc = w.scene;
    if (!host || !sc) return;
    const im = host.querySelector<HTMLImageElement>('img.ph');
    if (!im) return;
    placeScene(host, im, host.querySelector('.hit'), host.querySelector('video'), sc.box, fill, true);
  }, [w.scene, fill]);
  useEffect(() => {
    if (page !== 'set') return;
    requestAnimationFrame(placeSet);
    const ro = new ResizeObserver(placeSet);
    if (setHost.current) ro.observe(setHost.current);
    return () => ro.disconnect();
  }, [page, placeSet]);

  /* keep the page from scrolling under the view */
  useEffect(() => { const p = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = p; }; }, []);

  const full = w.images.full;
  const largest = full ? full.srcSet.split(', ').pop()!.split(' ')[0] : '';
  const nextLabel = pages[dp + 1] === 'info' ? t.toAbout : pages[dp + 1] === 'set' ? t.toSetting : t.toPainting;
  const prevPage = dp > 0 ? pages[dp - 1] : null;
  const prevLabel = prevPage === 'full' ? t.backToPainting : prevPage === 'info' ? t.backToAbout : '';
  const onPhoto = page === 'set';
  const inquireHref = `/${locale}/inquire?work=${w.slug}`;
  const sc = w.scene;
  const video = sc ? (sc.videoPhone || sc.videoDesktop) : null;

  return (
    <div id="detail" className="on navlinks" role="dialog" aria-modal="true" aria-label={t.label} ref={root}>
      <button className="dclose" aria-label={t.close} onClick={close} style={{ color: onPhoto ? '#fff' : 'var(--text)' }}>
        <svg viewBox="0 0 34 34" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M8 8l18 18M26 8L8 26" /></svg>
      </button>

      {sc ? (
        <div className={`dp dp-set${page === 'set' ? ' on' : ''}${fill ? '' : ' whole'}`} id="dpSet" ref={setHost} aria-hidden={page !== 'set'}>
          {page === 'set' || dp > 0 ? (
            <div className="slide on" style={{ position: 'absolute', inset: 0 }}>
              <picture>
                {sc.phone ? <source media={PHONE_MQ} srcSet={sc.phone.srcSet} sizes="40vw" /> : null}
                <img className="fillbg" src={(sc.desktop || sc.phone)!.src} srcSet={(sc.desktop || sc.phone)!.srcSet} sizes="40vw" alt="" aria-hidden="true" />
              </picture>
              <picture>
                {sc.phone ? <source media={PHONE_MQ} srcSet={sc.phone.srcSet} sizes="100vw" /> : null}
                <img className="ph" src={(sc.desktop || sc.phone)!.src} srcSet={(sc.desktop || sc.phone)!.srcSet} sizes="100vw"
                  alt={t.inLandscape} data-fx={sc.fx} data-fy={sc.fy} onLoad={placeSet} />
              </picture>
              {video && live && page === 'set' ? (
                <video className="phv" src={video} muted loop playsInline autoPlay preload="auto" aria-hidden="true"
                  onLoadedMetadata={(e) => { placeSet(); e.currentTarget.play().catch(() => {}); }}
                  onPlaying={(e) => e.currentTarget.classList.add('go')} />
              ) : null}
              <button className="hit" aria-label={t.viewFull} onClick={() => show(0)} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={`dp dp-full${page === 'full' ? ' on' : ''}`} id="dpFull" aria-hidden={page !== 'full'}>
        <div className="zbox" id="zbox" ref={zbox}>
          {full ? (
            <img className="zimg" id="zimg" ref={zimg} draggable={false} alt={w.title}
              src={hiRes ? largest : full.src} srcSet={hiRes ? undefined : full.srcSet}
              sizes="(max-width:760px) 100vw, 80vw"
              style={{ opacity: loadedFull ? 1 : 0, ...(w.round ? { borderRadius: '50%' } : {}) }}
              onLoad={() => { setLoadedFull(true); }} />
          ) : <img ref={zimg} alt="" />}
        </div>
        <div className={`zctl${ctlOnArt ? ' onart' : ''}`} id="zctl" ref={zctl}>
          <span className="zl">{t.zoom}</span>
          <button aria-label={t.zoomIn} onClick={(e) => { e.stopPropagation(); api.current.at(z.current.s * 1.5, ...ctr()); }}>+</button>
          <hr />
          <span className="zp" aria-live="polite">{zPct}%</span>
          <hr />
          <button aria-label={t.zoomOut} onClick={(e) => { e.stopPropagation(); api.current.at(z.current.s / 1.5, ...ctr()); }}>−</button>
        </div>
      </div>

      <div className={`dp dp-info${page === 'info' ? ' on' : ''}`} id="dpInfo" aria-hidden={page !== 'info'}>
        <div className="dk dinfo">
          <figure>
            {w.images.detail ? (
              <img src={w.images.detail.src} srcSet={w.images.detail.srcSet} sizes="40vw" alt={t.detailOf} className="dgo" loading="lazy"
                onClick={() => { if (!matchMedia('(hover:none)').matches) next(); }} />
            ) : null}
            <figcaption className="dlab">{t.detailOfArtwork}</figcaption>
          </figure>
          <div className="dtext">
            <h1 className="dttl">{w.title}</h1>
            <MetaBlock w={w} />
            <div className="ddesc">{w.description.length ? w.description.map((p, i) => <p key={i}>{p}</p>) : t.descriptionToCome}</div>
            <Link className="dinq" href={inquireHref}>{t.inquire} →</Link>
          </div>
        </div>
        <div className="m mdet">
          <div className="row"><span /></div>
          {w.images.detail ? <img className="strip" src={w.images.detail.src} srcSet={w.images.detail.srcSet} sizes="100vw" alt={t.detailOf} loading="lazy" /> : null}
          <div className="dlab mlab">{t.detailOfArtwork}</div>
          <div className="dttl">{w.title}</div>
          <MetaBlock w={w} />
          <div className="ddesc">{w.description.length ? w.description.map((p, i) => <p key={i}>{p}</p>) : t.descriptionToCome}</div>
          <Link className="dinq" href={inquireHref}><span>{t.inquire}</span><span>→</span></Link>
        </div>
      </div>

      <div className="ddots" id="ddots" />
      <button className={`dnext dprev${prevPage ? '' : ' none'}${onPhoto ? ' onphoto' : ''}`} aria-label={prevLabel} onClick={back}>{prevPage ? '←' : ''}</button>
      <button className={`dnext${onPhoto ? ' onphoto' : ''}`} onClick={next}>{nextLabel}</button>
    </div>
  );
}

