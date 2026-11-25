import manifest from '@/content/media-manifest.json';

type Entry = { w: number; h: number; widths: number[] };
const IMAGES = manifest.images as Record<string, Entry>;

export interface Img {
  /** JPEG fallback / default src */
  src: string;
  srcSet: string;
  width: number;
  height: number;
  /** true when the master is missing and a stand-in is used */
  standIn?: boolean;
}

const FALLBACKS: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^(w\d\d)$/, (m) => `${m[1]}_g`],          // full scan -> Works image
  [/^(w\d\d)_x$/, (m) => `${m[1]}_g`],        // close-up -> Works image
  [/^(scene_\d\d)$/, (m) => `${m[1]}_m`],     // desktop scene -> phone copy
  [/^(scene_\d\d)_m$/, (m) => m[1]],          // phone scene -> desktop scene
];

/** Responsive image set for a master name (e.g. "w01", "scene_02_m", "author"), or null if none exists. */
export function img(name: string): Img | null {
  let key = name, standIn = false;
  if (!IMAGES[key]) {
    for (const [re, to] of FALLBACKS) {
      const m = name.match(re);
      if (m && IMAGES[to(m)]) { key = to(m); standIn = true; break; }
    }
  }
  const e = IMAGES[key];
  if (!e) return null;
  return {
    src: `/media/${key}.jpg`,
    srcSet: e.widths.map((w) => `/media/${key}-${w}.webp ${w}w`).join(', '),
    width: e.w,
    height: e.h,
    ...(standIn ? { standIn } : {}),
  };
}

export const media = (file: string) => `/media/${file}`;
