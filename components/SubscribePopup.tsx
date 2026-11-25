'use client';
// Subscription pop-up, option D "Veil" (Sophia, 22 Nov 2026).
// Opens after 45 s of active time (tab in view), only after the visitor has interacted;
// never over the detail view, the menu, the language list, the Inquire/Contact/Legal pages
// or while typing. After X: hidden 30 days. After subscribing: never again.

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { subscribe, type SubState } from './SubscribeForm';

const KEY = 'ota-sub', DELAY = 45, DAYS = 30;

export default function SubscribePopup({ locale, t }: {
  locale: string;
  t: { email: string; sendCaps: string; invalid: string; privacy: string; checkInbox: string; unavailable: string; dialog: string; text: string; close: string };
}) {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SubState>('idle');
  const [email, setEmail] = useState('');
  const pop = useRef<HTMLDivElement>(null);
  const back = useRef<Element | null>(null);
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  useEffect(() => {
    const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
    const st = get(KEY);
    if (st === 'done') return;
    if (st && /^closed:\d+$/.test(st) && Date.now() - +st.split(':')[1] < DAYS * 864e5) return;
    let secs = 0;
    try { secs = +(sessionStorage.getItem(KEY + '-t') || 0); } catch {}
    let acted = false;
    const act = () => { acted = true; };
    const evs = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    evs.forEach((e) => addEventListener(e, act, { passive: true, capture: true }));
    const busy = () => {
      if (document.querySelector('#detail.on,#menu.on,#langs.on')) return true;
      if (/\/(inquire|contact|legal)$/.test(pathRef.current)) return true;
      const a = document.activeElement;
      return !!a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
    };
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      if (secs < DELAY) { secs++; try { sessionStorage.setItem(KEY + '-t', String(secs)); } catch {} return; }
      if (acted && !busy()) { clearInterval(timer); back.current = document.activeElement; setOpen(true); }
    }, 1000);
    return () => { clearInterval(timer); evs.forEach((e) => removeEventListener(e, act, { capture: true })); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => pop.current?.querySelector<HTMLElement>('.sp')?.focus({ preventScroll: true }), 60);
    // while open, keys belong to the pop-up only
    const onKey = (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Tab' && pop.current) {
        const f = [...pop.current.querySelectorAll<HTMLElement>('button,input')].filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === a || document.activeElement === pop.current.querySelector('.sp'))) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    addEventListener('keydown', onKey, true);
    return () => { document.body.style.overflow = prev; removeEventListener('keydown', onKey, true); };
  }, [open]);   // eslint-disable-line react-hooks/exhaustive-deps

  function close() {
    setOpen(false);
    if (state !== 'done') { try { localStorage.setItem(KEY, 'closed:' + Date.now()); } catch {} }
    (back.current as HTMLElement | null)?.focus?.({ preventScroll: true });
  }

  const done = state === 'done';
  return (
    <div id="subPop" ref={pop} className={`${open ? 'on' : ''}${done ? ' done' : ''}`} aria-hidden={!open}
      onClick={(e) => { if (e.target === pop.current) close(); }}>
      <button className="sx" type="button" aria-label={t.close} onClick={close} />
      <div className="sp" role="dialog" aria-modal="true" aria-label={t.dialog} tabIndex={-1}>
        <p className="sw">ota</p>
        <p className="st">{t.text}</p>
        <form noValidate onSubmit={async (e) => {
          e.preventDefault();
          setState('sending');
          const r = await subscribe(email, locale);
          setState(r);
          if (r === 'done') { try { localStorage.setItem(KEY, 'done'); } catch {} }
        }}>
          <label className="vh" htmlFor="subEm">{t.email}</label>
          <input id="subEm" type="email" placeholder={t.email} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="sb" type="submit" disabled={state === 'sending'}>{t.sendCaps}</button>
        </form>
        <p className="se" aria-live="polite">{state === 'invalid' ? t.invalid : state === 'unavailable' ? t.unavailable : ''}</p>
        <p className="spv">{t.privacy}</p>
        <p className="sok">{t.checkInbox}</p>
      </div>
    </div>
  );
}
