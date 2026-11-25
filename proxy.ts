import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, DEFAULT_LOCALE, type Locale } from './lib/i18n-config';

// Sends visitors who arrive without a language in the address (ota.art, ota.art/works)
// to the same page under /en or /cs, chosen from the browser's preferred languages.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req.headers.get('accept-language'))}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url, 307);
}

/** First supported language in Accept-Language order of preference; Slovak readers get Czech. */
function pickLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const prefs = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { lang: tag.toLowerCase().split('-')[0], q: q ? parseFloat(q.split('=')[1]) || 0 : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of prefs) {
    if (lang === 'cs' || lang === 'sk') return 'cs';
    if (lang === 'en') return 'en';
  }
  return DEFAULT_LOCALE;
}

export const config = {
  // everything except API routes, Next internals, static files and the crawler files
  matcher: ['/((?!api|_next|media|.*\\..*).*)'],
};
