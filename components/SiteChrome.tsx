'use client';
// Top bar (menu, wordmark, Inquire on Works, language, sound), the full-screen menu,
// the language list and the ambient sound. Behaviour as in the accepted prototype.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { LANGUAGE_MENU, type Locale } from '@/lib/i18n-config';
import { useChrome, PHONE_MQ } from './ChromeContext';
import type { Dict } from '@/content/dictionaries';

type View = 'main' | 'works' | 'author' | 'contact' | 'inquire' | 'legal' | 'detail' | 'other';

function viewOf(path: string, locale: Locale): View {
  const rest = path.replace(new RegExp(`^/${locale}`), '') || '/';
  if (rest === '/') return 'main';
  if (rest === '/works') return 'works';
  if (rest.startsWith('/works/')) return 'detail';
  if (rest === '/author') return 'author';
  if (rest === '/contact') return 'contact';
  if (rest === '/inquire') return 'inquire';
  if (rest === '/legal') return 'legal';
  return 'other';
}

const TITLE: Partial<Record<View, string>> = { main: 'ota', works: 'art', inquire: 'ota', legal: 'ota', other: 'ota' };
const DARKBAR: Partial<Record<View, true>> = { works: true, contact: true, inquire: true, legal: true, other: true };

const SoundIcon = ({ size }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    <g className="wave"><path d="M16.5 9a4.5 4.5 0 0 1 0 6" /><path d="M19 6.5a8 8 0 0 1 0 11" /></g>
    <g className="slash"><path d="M17 10l4 4M21 10l-4 4" /></g>
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 34 34" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M8 8l18 18M26 8L8 26" /></svg>
);

export default function SiteChrome({ locale, t }: { locale: Locale; t: Pick<Dict, 'nav' | 'chrome'> }) {
  const pathname = usePathname() || `/${locale}`;
  const view = viewOf(pathname, locale);
  const { menuBg } = useChrome();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [langOpen, setLangOpen] = useState<null | HTMLElement>(null);
  const langsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number | null>(null);

  /* canvas scale: Nini's 1440 x 1024 frame fitted to the screen (used by a few chrome positions) */
  useEffect(() => {
    const fit = () => {
      const r = document.documentElement, k = Math.min(innerWidth / 1440, innerHeight / 1024);
      r.style.setProperty('--k', String(k));
      r.style.setProperty('--ox', (innerWidth - 1440 * k) / 2 + 'px');
      r.style.setProperty('--oy', (innerHeight - 1024 * k) / 2 + 'px');
    };
    fit();
    let t: number | undefined;
    const on = () => { clearTimeout(t); t = window.setTimeout(fit, 120); };
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);

  /* theme: dark is the default; the visitor's choice is kept in this browser only */
  useEffect(() => { setThemeState(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'); }, []);
  const setTheme = (th: 'dark' | 'light') => {
    document.documentElement.dataset.theme = th;
    setThemeState(th);
    try { localStorage.setItem('ota-theme2', th); } catch {}
  };

  /* menu */
  useEffect(() => { setMenuOpen(false); setLangOpen(null); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  /* language list: drops straight under the EN that was clicked */
  const closeLangs = useCallback(() => setLangOpen(null), []);
  const toggleLangs = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const b = e.currentTarget;
    setLangOpen((cur) => (cur === b ? null : b));
  };
  useEffect(() => {
    const el = langsRef.current;
    if (!el || !langOpen) return;
    const r = langOpen.getBoundingClientRect();
    el.style.left = r.left + 'px';
    el.style.top = r.top + r.height * 1.25 + 'px';
    if (!matchMedia(PHONE_MQ).matches) {
      const w = el.offsetWidth;
      el.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
    }
  }, [langOpen]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (langsRef.current && !langsRef.current.contains(e.target as Node)) closeLangs(); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (langOpen) closeLangs(); else if (menuOpen) setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDoc); removeEventListener('keydown', onKey); };
  }, [langOpen, menuOpen, closeLangs]);

  /* ambient sound: 1.2 s fade in and out */
  const toggleSound = () => {
    const a = audioRef.current;
    if (!a) return;
    const on = !sound;
    setSound(on);
    if (fadeRef.current) clearInterval(fadeRef.current);
    if (on) { a.volume = 0; a.play().catch(() => {}); }
    const from = a.volume, to = on ? 0.5 : 0, t0 = performance.now();
    fadeRef.current = window.setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / 1200);
      a.volume = from + (to - from) * k;
      if (k === 1) { clearInterval(fadeRef.current!); fadeRef.current = null; if (!on) a.pause(); }
    }, 40);
  };

  const switchHref = (l: Locale) => pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${l}`);
  const current = LANGUAGE_MENU.find((x) => x.locale === locale)!;
  const onWhite = !menuOpen && !!DARKBAR[view];
  const menuLink = (v: View, href: string, label: string) => (
    <Link href={href} className={view === v ? 'cur' : undefined} aria-current={view === v ? 'page' : undefined}>{label}</Link>
  );

  const audio = <audio ref={audioRef} src="/media/amb.mp3" loop preload="none" />;
  return (
    <>
      {audio}
      {view === 'detail' ? null : (<>
      <a className="skip" href="#content">{t.chrome.skip}</a>
      <div className={`bar ${DARKBAR[view] ? 'dark' : 'light'}${view === 'works' ? ' works' : ''}${menuOpen ? ' hide' : ''}`} id="bar">
        <button className="bmenu" aria-label={t.chrome.openMenu} aria-expanded={menuOpen} aria-controls="menu" onClick={() => setMenuOpen(true)}><i /><i /><i /></button>
        {TITLE[view] ? <Link className="bword" href={`/${locale}`} aria-label={t.nav.main}>{TITLE[view]}</Link> : null}
        <div className="bctl">
          <Link className="binq ginq" href={`/${locale}/inquire`}>{t.chrome.inquire}</Link>
          <button className={`blang${langOpen ? ' open' : ''}`} aria-expanded={!!langOpen} aria-label={t.chrome.language} onClick={toggleLangs}>{current.label}</button>
          <button className="bsnd" aria-pressed={sound} aria-label={t.chrome.sound} onClick={toggleSound}><SoundIcon /></button>
        </div>
      </div>

      <div ref={langsRef} className={`langs${langOpen ? ' on' : ''}${onWhite ? ' ink' : ''}`} id="langs" role="menu">
        {LANGUAGE_MENU.map((l, i) => (
          <Fragment key={l.code}>
            {i ? <span aria-hidden="true">·</span> : null}
            {l.locale ? (
              <Link role="menuitem" href={switchHref(l.locale)} hrefLang={l.locale} className={l.locale === locale ? 'cur' : undefined} onClick={closeLangs}>{l.label}</Link>
            ) : (
              <button role="menuitem" aria-disabled="true" title={t.chrome.translationToCome}>{l.label}</button>
            )}
          </Fragment>
        ))}
      </div>
      <div id="menu" className={menuOpen ? 'on' : undefined} aria-hidden={!menuOpen} role="dialog" aria-modal="true" aria-label="Menu">
        {menuOpen ? (
          <img className="bg" alt="" src={view === 'main' && menuBg ? menuBg.src : '/media/menu_bg.jpg'}
            srcSet={view === 'main' && menuBg ? menuBg.srcSet : undefined} sizes="100vw"
            style={{ objectPosition: view === 'main' && menuBg ? menuBg.position : '50% 50%' }} />
        ) : null}
        <div className="veil" />
        <div className="cv mcv" id="menuCv" style={{ display: 'block' }}>
          <button className="ab mx" aria-label={t.chrome.closeMenu} onClick={() => setMenuOpen(false)}><CloseIcon /></button>
          <Link className="ab mword" href={`/${locale}`} onClick={() => setMenuOpen(false)}>ota</Link>
          <div className="ab mctl">
            <button className={`blang${langOpen ? ' open' : ''}`} aria-label={t.chrome.language} onClick={toggleLangs}>{current.label}</button>
            <button className="bsnd" aria-pressed={sound} aria-label={t.chrome.sound} onClick={toggleSound}><SoundIcon size={18} /></button>
          </div>
          <nav className="ab" id="mNav">
            {menuLink('main', `/${locale}`, t.nav.main)}
            {menuLink('works', `/${locale}/works`, t.nav.works)}
            {menuLink('author', `/${locale}/author`, t.nav.author)}
            {menuLink('contact', `/${locale}/contact`, t.nav.contact)}
          </nav>
          <div className="ab credit">{t.chrome.photoCredit}</div>
          <div className="ab theme">
            <button className={theme === 'dark' ? 'cur' : undefined} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>{t.chrome.dark}</button>
            <span>/</span>
            <button className={theme === 'light' ? 'cur' : undefined} aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>{t.chrome.light}</button>
          </div>
        </div>
      </div>
      </>)}
    </>
  );
}
