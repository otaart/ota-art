import type { Metadata } from 'next';
import { LOCALES, type Locale } from './i18n-config';
import type { WorkView } from './content';
import { captionText } from './content';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ota.art').replace(/\/$/, '');
export const ARTIST = 'Ota Votoček';
const OG_LOCALE: Record<Locale, string> = { en: 'en_GB', cs: 'cs_CZ' };

/** Canonical address plus the same page in every language (hreflang), for a path like "/works". */
export function pageMeta(locale: Locale, path: string, title: string, description: string, image?: { url: string; width: number; height: number; alt: string }): Metadata {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${path}`;
  languages['x-default'] = `${SITE_URL}/en${path}`;
  const url = `${SITE_URL}/${locale}${path}`;
  return {
    title, description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: 'website', url, title, description, siteName: 'ota.art', locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      ...(image ? { images: [{ ...image, url: SITE_URL + image.url }] } : {}),
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description },
  };
}

export const personLd = (locale: Locale) => ({
  '@type': 'Person',
  '@id': `${SITE_URL}/#artist`,
  name: ARTIST,
  jobTitle: locale === 'cs' ? 'malíř' : 'Painter',
  url: `${SITE_URL}/${locale}/author`,
  image: `${SITE_URL}/media/author.jpg`,
});

export const websiteLd = (locale: Locale) => ({
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: 'ota.art', inLanguage: locale, publisher: { '@id': `${SITE_URL}/#artist` } },
    personLd(locale),
  ],
});

export function artworkLd(locale: Locale, w: WorkView) {
  const size = w.round
    ? {}
    : (() => {
        const m = w.dim.match(/^(\d+)\s*×\s*(\d+)/);
        return m ? {
          height: { '@type': 'QuantitativeValue', value: +m[1], unitCode: 'CMT' },
          width: { '@type': 'QuantitativeValue', value: +m[2], unitCode: 'CMT' },
        } : {};
      })();
  const [surface, ...rest] = w.medium.split(/ on | na /);
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    '@id': `${SITE_URL}/${locale}/works/${w.slug}#artwork`,
    name: w.title,
    url: `${SITE_URL}/${locale}/works/${w.slug}`,
    inLanguage: locale,
    creator: { '@id': `${SITE_URL}/#artist`, '@type': 'Person', name: ARTIST },
    artform: locale === 'cs' ? 'Malba' : 'Painting',
    artMedium: surface,
    artworkSurface: rest.join(' ') || undefined,
    ...size,
    description: w.description.length ? w.description.join(' ') : captionText(w),
    image: w.images.full ? `${SITE_URL}${w.images.full.src}` : undefined,
    copyrightHolder: { '@id': `${SITE_URL}/#artist` },
    offers: w.availability === 'available'
      ? { '@type': 'Offer', availability: 'https://schema.org/InStock', priceSpecification: { '@type': 'PriceSpecification', description: locale === 'cs' ? 'Cena na dotaz' : 'Price on request' } }
      : undefined,
  };
}

export function breadcrumbLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}/${locale}${it.path}` })),
  };
}
