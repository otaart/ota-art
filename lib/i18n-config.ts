export const LOCALES = ['en', 'cs'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const isLocale = (s: string): s is Locale => (LOCALES as readonly string[]).includes(s);

/** Languages shown in the selector. Only those in LOCALES are live; the rest read "Translation to come". */
export const LANGUAGE_MENU: { code: string; label: string; locale?: Locale }[] = [
  { code: 'EN', label: 'EN', locale: 'en' },
  { code: 'CZ', label: 'CZ', locale: 'cs' },
  { code: 'IT', label: 'IT' }, { code: 'ES', label: 'ES' }, { code: 'FR', label: 'FR' },
  { code: 'DE', label: 'DE' }, { code: 'GR', label: 'GR' }, { code: 'RU', label: 'RU' }, { code: 'JA', label: 'JA' },
];
