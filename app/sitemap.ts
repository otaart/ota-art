import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n-config';
import { getSlugs } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/works', '/author', '/contact', '/inquire', '/legal', ...getSlugs().map((s) => `/works/${s}`)];
  const now = new Date();
  return paths.flatMap((p) => LOCALES.map((l) => ({
    url: `${SITE_URL}/${l}${p}`,
    lastModified: now,
    changeFrequency: p.startsWith('/works') ? 'monthly' as const : 'yearly' as const,
    priority: p === '' ? 1 : p === '/works' ? 0.9 : p.startsWith('/works/') ? 0.8 : 0.5,
    alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${SITE_URL}/${x}${p}`])) },
  })));
}
