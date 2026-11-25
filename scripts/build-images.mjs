// Builds the web image set from the masters in media-src/ into public/media/.
//
//   npm run images
//
// For every source JPG it writes WebP copies at the widths below (never wider than the
// source) plus one JPEG fallback, and records sizes in content/media-manifest.json.
// Videos and audio are copied as they are.
//
// Masters expected in media-src/img/ (names as in the prototype):
//   wNN.jpg      full painting scan (zoom view), 2600 px long side
//   wNN_g.jpg    painting for the Works wall, 1100 px
//   wNN_x.jpg    close-up detail for "About the work"
//   scene_NN.jpg / scene_NN_m.jpg   painting in Salome's photo, desktop / phone
// A missing master falls back to the nearest one that exists (wNN -> wNN_g, scene -> scene_m)
// and is listed under "missing" in the manifest, so nothing breaks while files are added.

import { readdir, mkdir, copyFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'media-src/img';
const OUT = 'public/media';
const WIDTHS = [480, 960, 1600, 2400];
const QUALITY = 80;

const files = (await readdir(SRC)).sort();
await mkdir(OUT, { recursive: true });

const manifest = { images: {}, videos: [], audio: [], missing: [] };

for (const f of files) {
  const src = path.join(SRC, f);
  const ext = path.extname(f).toLowerCase();
  const base = path.basename(f, ext);
  if (ext === '.mp4' || ext === '.mp3') {
    await copyFile(src, path.join(OUT, f));
    (ext === '.mp4' ? manifest.videos : manifest.audio).push(f);
    continue;
  }
  if (ext === '.png') {                     // cursors: copied as they are
    await copyFile(src, path.join(OUT, f));
    continue;
  }
  if (ext !== '.jpg' && ext !== '.jpeg') continue;

  const img = sharp(src, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  const w0 = meta.width, h0 = meta.height;
  const widths = [...new Set(WIDTHS.filter((w) => w < w0).concat([Math.min(w0, 2400)]))].sort((a, b) => a - b);
  for (const w of widths) {
    const out = path.join(OUT, `${base}-${w}.webp`);
    if (await exists(out) && (await stat(out)).mtimeMs > (await stat(src)).mtimeMs) continue;
    await sharp(src, { failOn: 'none' }).rotate().resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
  }
  // one JPEG for old browsers, link previews and structured data
  const fbW = Math.min(w0, 1600);
  const fb = path.join(OUT, `${base}.jpg`);
  if (!(await exists(fb)) || (await stat(fb)).mtimeMs < (await stat(src)).mtimeMs) {
    await sharp(src, { failOn: 'none' }).rotate().resize({ width: fbW }).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(fb);
  }
  manifest.images[base] = { w: w0, h: h0, widths };
}

// expected masters, so the manifest can say what is still missing
for (let n = 1; n <= 19; n++) {
  const nn = String(n).padStart(2, '0');
  for (const k of [`w${nn}`, `w${nn}_g`, `w${nn}_x`, `scene_${nn}`, `scene_${nn}_m`]) {
    if (!manifest.images[k]) manifest.missing.push(k);
  }
}

await writeFile('content/media-manifest.json', JSON.stringify(manifest, null, 1) + '\n');
console.log(`images: ${Object.keys(manifest.images).length}, videos: ${manifest.videos.length}, missing masters: ${manifest.missing.length}`);

async function exists(p) { try { await stat(p); return true; } catch { return false; } }
