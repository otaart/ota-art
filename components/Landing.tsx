'use client';
// Landing: full-screen carousel of the paintings in Salome's photos.
// Desktop shows the horizontal photos, phones the vertical ones (Nini's frames).
// 8 s autoplay, arrows in the bottom corners, ticks, swipe, keyboard; living photos.

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChrome, PHONE_MQ, reducedMotion } from './ChromeContext';
import { placeScene, type Box } from './placeCover';
import type { Img } from '@/lib/media';

export interface LandingScene {
  slug: string; title: string; img: Img; box: Box; fx: number; fy: number; video: string | null;
}

const RET_KEY = 'ota-land-ret';

export default function Landing({ locale, desktop, phone, t }: {
  locale: string; desktop: LandingScene[]; phone: LandingScene[];
  t: { tagline: string; prevScene: string; nextScene: string; sceneD: string[]; sceneM: string[]; openD: string[]; openM: string[]; altD: string[]; altM: string[] };
}) {
  const [dev, setDev] = useState<'d' | 'm' | null>(null);
  const [cur, setCur] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1]));
  const [live, setLive] = useState<Set<number>>(() => new Set());
  const stage = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timer = useRef<number | null>(null);
  const { setMenuBg } = useChrome();
  const list = dev === 'm' ? phone : desktop;
  const n = list.length;
  const living = useRef(true);
  const lastBg = useRef('');

  /* device: rebuilt when the screen switches between phone and desktop layout */
  useEffect(() => {
    const mq = matchMedia(PHONE_MQ);
    living.current = !reducedMotion() && location.hash !== '#still';   // #still: test address without the moving photos
    const set = () => setDev(mq.matches ? 'm' : 'd');
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  /* back from a painting: show the scene the visitor clicked, then carry on from there */
  useEffect(() => {
    if (!dev) return;
    let i = 0;
    try {
      const r = JSON.parse(sessionStorage.getItem(RET_KEY) || 'null');
      if (r && r.dev === dev && r.i < n) i = r.i;
      sessionStorage.removeItem(RET_KEY);
    } catch {}
    setCur(i);
    setLoaded(new Set([i, (i + 1) % n, (i - 1 + n) % n]));
  }, [dev, n]);

  const go = useCallback((i: number) => {
    if (!n) return;
    const c = (i + n) % n;
    setCur(c);
    setLoaded((s) => new Set([...s, c, (c + 1) % n, (c - 1 + n) % n]));   // each next scene is fetched just before it is shown
  }, [n]);

  const play = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (reducedMotion() || n < 2) return;
    timer.current = window.setInterval(() => setCur((c) => {
      const nx = (c + 1) % n;
      setLoaded((s) => new Set([...s, nx, (nx + 1) % n]));
      return nx;
    }), 8000);
  }, [n]);

  useEffect(() => { if (dev) play(); return () => { if (timer.current) clearInterval(timer.current); }; }, [dev, play]);

  /* layout: photo fills the screen, click area over the painting, video on top of the photo */
  const place = useCallback((i: number) => {
    const s = slideRefs.current[i], host = stage.current;
    if (!s || !host) return;
    const im = s.querySelector<HTMLImageElement>('img.ph');
    if (!im || !im.complete || !im.naturalWidth) return;
    placeScene(host, im, s.querySelector('.hit'), s.querySelector('video'), list[i].box, true);
    if (i === cur) {
      const bg = { src: im.currentSrc || im.src, srcSet: im.srcset, position: im.dataset.cover || '50% 50%' };
      const key = bg.src + bg.position;
      if (key !== lastBg.current) { lastBg.current = key; setMenuBg(bg); }
    }
    if (list[i].video && living.current && i === cur) setLive((v) => (v.has(i) ? v : new Set([...v, i])));
  }, [list, cur, setMenuBg]);

  useEffect(() => { place(cur); }, [cur, place, dev]);
  useEffect(() => {
    if (!stage.current) return;
    const ro = new ResizeObserver(() => list.forEach((_, i) => place(i)));
    ro.observe(stage.current);
    return () => ro.disconnect();
  }, [list, place]);
  useEffect(() => () => { lastBg.current = ''; setMenuBg(null); }, [setMenuBg]);

  /* keyboard and swipe */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('#menu.on,#subPop.on')) return;
      if (e.key === 'ArrowRight') { go(cur + 1); play(); }
      if (e.key === 'ArrowLeft') { go(cur - 1); play(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [cur, go, play]);
  const sx = useRef<number | null>(null);

  const remember = (i: number) => {
    if (timer.current) clearInterval(timer.current);
    try {
      sessionStorage.setItem(RET_KEY, JSON.stringify({ i, dev }));
      sessionStorage.setItem('ota-detail-from', 'land');
    } catch {}
  };

  const first = { d: desktop[0], m: phone[0] };
  const labels = dev === 'm' ? { scene: t.sceneM, open: t.openM, alt: t.altM } : { scene: t.sceneD, open: t.openD, alt: t.altD };

  return (
    <section className="view" id="v-main">
      <div className="stage" id="land" ref={stage}
        onTouchStart={(e) => { sx.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (sx.current === null) return;
          const d = e.changedTouches[0].clientX - sx.current; sx.current = null;
          if (Math.abs(d) > 40) { go(cur + (d < 0 ? 1 : -1)); play(); }
        }}>
        {/* first paint, before the script runs: the first scene for this screen type */}
        {!dev && first.d && (
          <picture className="lposter">
            {first.m ? <source media={PHONE_MQ} srcSet={first.m.img.srcSet} sizes="100vw" /> : null}
            <img src={first.d.img.src} srcSet={first.d.img.srcSet} sizes="100vw" alt={t.altD[0]} fetchPriority="high" />
          </picture>
        )}
        {dev && list.map((s, i) => (
          <div key={`${dev}-${s.slug}`} className={`slide${i === cur ? ' on' : ''}`} ref={(el) => { slideRefs.current[i] = el; }} aria-hidden={i !== cur}>
            {loaded.has(i) ? (
              <>
                <img className="fillbg" src={s.img.src} srcSet={s.img.srcSet} sizes="40vw" alt="" aria-hidden="true" />
                <img className="ph" src={s.img.src} srcSet={s.img.srcSet} sizes="100vw" alt={labels.alt[i]}
                  data-fx={s.fx} data-fy={s.fy} decoding="async" fetchPriority={i === cur ? 'high' : 'auto'}
                  onLoad={() => place(i)} />
                {s.video && live.has(i) ? (
                  <video className="phv" src={s.video} muted loop playsInline autoPlay preload="auto" aria-hidden="true"
                    onLoadedMetadata={(e) => { place(i); e.currentTarget.play().catch(() => {}); }}
                    onPlaying={(e) => e.currentTarget.classList.add('go')} />
                ) : null}
              </>
            ) : null}
            <Link className="hit" href={`/${locale}/works/${s.slug}`} aria-label={labels.open[i]} tabIndex={i === cur ? 0 : -1} onClick={() => remember(i)} />
          </div>
        ))}
      </div>
      <div className="lfoot">
        <div className="dots" id="ldots">
          {list.map((s, i) => (
            <button key={s.slug} className={`${i === cur ? 'on' : ''}${i < cur ? ' past' : ''}`} aria-label={labels.scene[i]} aria-current={i === cur}
              onClick={() => { go(i); play(); }} />
          ))}
        </div>
        <div className="tag">{t.tagline}</div>
      </div>
      <button className="narr l" aria-label={t.prevScene} onClick={() => { go(cur - 1); play(); }}>&larr;</button>
      <button className="narr r" aria-label={t.nextScene} onClick={() => { go(cur + 1); play(); }}>&rarr;</button>
    </section>
  );
}
