// Positions one of Salome's photos inside its host, exactly as the prototype does.
//
// fill = true (landing, and the photo page opened from the landing): the photo fills the screen;
//   what does not fit is cut half from the top and half from the bottom (and half from each side).
//   The crop only moves off centre when it would otherwise cut into the painting. If even that
//   cannot keep the painting whole, the photo is scaled down a little and the soft blur of the
//   same photo fills the edge.
// fill = false (photo page opened from Works): the whole photo at its own proportions, centred.
//
// Returns the drawn rectangle so the click area can be laid exactly over the painting.

export type Box = [number, number, number, number];
export interface Placed { ox: number; oy: number; dw: number; dh: number }

export function placeCover(img: HTMLImageElement, host: HTMLElement, box: Box | null, fill: boolean, keepGround = false): Placed {
  const hw = host.clientWidth, hh = host.clientHeight;
  const iw = img.naturalWidth || 1, ih = img.naturalHeight || 1;
  let s = Math.min(hw / iw, hh / ih);
  if (fill) {
    const s0 = Math.max(hw / iw, hh / ih);
    const fx = +(img.dataset.fx || 0.5), fy = +(img.dataset.fy || 0.5);
    s = s0;
    if (box) s = Math.max(Math.min(hw / iw, hh / ih), Math.min(s0, (hw * 0.92) / (box[2] * iw), (hh * 0.84) / (box[3] * ih)));
    const dw = iw * s, dh = ih * s;
    const keep = (o: boolean, len: number, full: number, b0: number, b1: number, mA: number, mB: number) => {
      if (len <= full) return (full - len) / 2;
      let v = o ? full - len : (full - len) / 2;           // centred crop (o: keep the bottom, cut from the top)
      const p0 = v + b0 * len, p1 = v + b1 * len;
      if (p0 < mA) v += mA - p0; else if (p1 > full - mB) v -= p1 - (full - mB);   // nudge only to keep the painting in
      return Math.min(0, Math.max(full - len, v));
    };
    const ox = box ? keep(false, dw, hw, box[0], box[0] + box[2], hw * 0.04, hw * 0.04) : (hw - dw) / 2;
    const oy = box ? keep(keepGround, dh, hh, box[1], box[1] + box[3], Math.min(hh * 0.14, 90), hh * 0.1) : (hh - dh) / 2;
    const cw = iw * s0, ch = ih * s0;
    // the menu background keeps the full-bleed framing of the same scene
    img.dataset.cover = `${Math.min(0, Math.max(hw - cw, hw / 2 - fx * cw))}px ${Math.min(0, Math.max(hh - ch, hh / 2 - fy * ch))}px`;
    Object.assign(img.style, {
      position: 'absolute', left: ox + 'px', top: oy + 'px', width: dw + 'px', height: dh + 'px',
      maxWidth: 'none', maxHeight: 'none', objectFit: 'fill', objectPosition: '0 0',
    });
    return { ox, oy, dw, dh };
  }
  const dw = iw * s, dh = ih * s, ox = (hw - dw) / 2, oy = (hh - dh) / 2;
  img.style.cssText = '';
  img.style.objectPosition = '50% 50%';
  return { ox, oy, dw, dh };
}

/** Lays the click area over the painting and keeps a living-photo video exactly on top of the photo. */
export function placeScene(host: HTMLElement, img: HTMLImageElement, hit: HTMLElement | null, video: HTMLVideoElement | null, box: Box, fill: boolean, keepGround = false) {
  if (!host.clientWidth || !img.naturalWidth) return;
  const r = placeCover(img, host, box, fill, keepGround);
  if (hit) Object.assign(hit.style, {
    left: r.ox + box[0] * r.dw + 'px', top: r.oy + box[1] * r.dh + 'px',
    width: box[2] * r.dw + 'px', height: box[3] * r.dh + 'px',
  });
  if (video) { video.style.cssText = img.style.cssText; video.style.pointerEvents = 'none'; }
}
