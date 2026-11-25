'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';

/** The landing tells the menu which scene is showing, so the menu opens over the same photo. */
export interface MenuBg { src: string; srcSet?: string; position: string }

const Ctx = createContext<{ menuBg: MenuBg | null; setMenuBg: (b: MenuBg | null) => void }>({
  menuBg: null,
  setMenuBg: () => {},
});

export function ChromeProvider({ children }: { children: ReactNode }) {
  const [menuBg, setMenuBg] = useState<MenuBg | null>(null);
  return <Ctx.Provider value={{ menuBg, setMenuBg }}>{children}</Ctx.Provider>;
}

export const useChrome = () => useContext(Ctx);

/** Same media query as the prototype: phones, and tablets held upright */
export const PHONE_MQ = '(max-width:760px), (orientation:portrait) and (max-width:1100px)';
export const isPhone = () => typeof window !== 'undefined' && window.matchMedia(PHONE_MQ).matches;
export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
