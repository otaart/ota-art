// The one place the site reads content from. Today: the files in /content.
// When the Sanity admin panel is connected, these functions query Sanity instead
// and every page keeps working unchanged.

import { WORKS, WORKS_ORDER, LANDING, LIVING, type Work } from '@/content/works';
import { getDict } from '@/content/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { img, type Img } from '@/lib/media';

export interface WorkView {
  n: number;
  slug: string;
  title: string;
  /** "Oil on canvas" */
  medium: string;
  /** "188 × 80 cm (74.02 × 31.50 inches)" */
  dim: string;
  /** "framed size 37 × 47 cm (14.57 × 18.50 inches), with a solid oak frame" */
  framed: string | null;
  note: string | null;
  description: string[];
  aspect: number;
  round: boolean;
  /** real height in cm (framed works: frame), used for sizing on the wall */
  heightCm: number;
  availability: Work['availability'];
  images: { full: Img | null; wall: Img | null; detail: Img | null };
  scene: null | {
    desktop: Img | null; phone: Img | null; box: [number, number, number, number]; fx: number; fy: number;
    videoDesktop: string | null; videoPhone: string | null;
  };
}

const nn = (n: number) => String(n).padStart(2, '0');

function num(x: number, decimal: string) {
  return x.toFixed(2).replace('.', decimal);
}

function dims(h: number, w: number, locale: Locale) {
  const c = getDict(locale).caption;
  return `${h} × ${w} cm (${num(h / 2.54, c.decimal)} × ${num(w / 2.54, c.decimal)} ${c.inches})`;
}

export function toView(w: Work, locale: Locale): WorkView {
  const c = getDict(locale).caption;
  const dim = 'd' in w.size
    ? `Ø ${w.size.d} cm (Ø ${num(w.size.d / 2.54, c.decimal)} ${c.inches})`
    : dims(w.size.h, w.size.w, locale);
  const framed = w.framed ? `${c.framedSize} ${dims(w.framed.h, w.framed.w, locale)}, ${c.solidOak}` : null;
  const heightCm = w.framed ? w.framed.h : 'd' in w.size ? w.size.d : w.size.h;
  const name = `w${nn(w.n)}`;
  return {
    n: w.n, slug: w.slug, title: w.title[locale], medium: c.medium[w.medium], dim, framed,
    note: w.note ? w.note[locale] : null,
    description: w.description ? w.description[locale] : [],
    aspect: w.aspect, round: 'd' in w.size, heightCm, availability: w.availability,
    images: { full: img(name), wall: img(`${name}_g`), detail: img(`${name}_x`) },
    scene: w.scene && (img(w.scene.image) || img(`${w.scene.image}_m`)) ? {
      desktop: img(w.scene.image), phone: img(`${w.scene.image}_m`),
      box: w.scene.box, fx: w.scene.fx, fy: w.scene.fy,
      videoDesktop: LIVING[w.scene.image] ? `/media/${LIVING[w.scene.image]}` : null,
      videoPhone: LIVING[`${w.scene.image}_m`] ? `/media/${LIVING[`${w.scene.image}_m`]}` : null,
    } : null,
  };
}

const byN = new Map(WORKS.map((w) => [w.n, w]));

export function getWorks(locale: Locale): WorkView[] {
  return WORKS_ORDER.map((n) => toView(byN.get(n)!, locale));
}

export function getWork(locale: Locale, slug: string): WorkView | null {
  const w = WORKS.find((x) => x.slug === slug);
  return w ? toView(w, locale) : null;
}

export function getSlugs(): string[] {
  return WORKS.map((w) => w.slug);
}

export function getLanding(locale: Locale) {
  const pick = (ns: number[]) => ns.map((n) => toView(byN.get(n)!, locale)).filter((v) => v.scene);
  return { desktop: pick(LANDING.desktop), phone: pick(LANDING.phone) };
}

/** One-line caption: "Oil on canvas, 188 × 80 cm (74.02 × 31.50 inches)" (+ framed size) */
export function captionText(v: WorkView) {
  return v.framed ? `${v.medium}, ${v.dim}, ${v.framed}` : `${v.medium}, ${v.dim}`;
}
