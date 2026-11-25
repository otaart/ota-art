'use client';
// Medium and size on one line everywhere, and no caption line ever breaks onto a second line
// (Sophia, 22 Nov 2026). A line may run into the free space beside it (gap to the next work, or up
// to the screen margin); if even that is too narrow, its type shrinks just enough to fit.

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const SEL = '.gcap > span:not(.fpara), .dmeta > div:not(.fpara)';

export default function CaptionFit() {
  const pathname = usePathname();
  useEffect(() => {
    const fit = () => {
      const els = document.querySelectorAll<HTMLElement>(SEL);
      els.forEach((el) => { el.style.whiteSpace = 'nowrap'; el.style.fontSize = ''; });
      const vw = document.documentElement.clientWidth, M = Math.max(20, vw * 0.05);
      els.forEach((el) => {
        if (!el.offsetParent) return;
        const r = el.getBoundingClientRect();
        let right = vw - Math.min(M, 24);
        const fig = el.closest('.hitem');
        if (fig) {
          const nx = fig.nextElementSibling;
          right = nx ? nx.getBoundingClientRect().left - 24 : fig.parentElement!.getBoundingClientRect().right - Math.min(M, 24);
        }
        const avail = right - r.left, need = el.scrollWidth;
        if (need > avail && avail > 40) {
          const fs = parseFloat(getComputedStyle(el).fontSize);
          el.style.fontSize = Math.floor((fs * avail / need) * 10) / 10 + 'px';
        }
      });
    };
    let q = 0;
    const later = () => { if (q) return; q = requestAnimationFrame(() => { q = 0; fit(); }); };
    later();
    const t = setTimeout(later, 400);   // after the Works wall has sized its paintings
    addEventListener('resize', later);
    document.fonts?.ready.then(later);
    const mo = new MutationObserver(later);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    return () => { removeEventListener('resize', later); mo.disconnect(); clearTimeout(t); cancelAnimationFrame(q); };
  }, [pathname]);
  return null;
}
