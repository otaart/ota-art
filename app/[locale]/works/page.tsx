import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n-config';
import { getDict } from '@/content/dictionaries';
import { getWorks, captionText } from '@/lib/content';
import { pageMeta, SITE_URL, ARTIST } from '@/lib/seo';
import WorksWall from '@/components/WorksWall';
import JsonLd from '@/components/JsonLd';

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params as { locale: Locale };
  const t = getDict(locale).meta;
  return pageMeta(locale, '/works', t.worksTitle, t.worksDescription, { url: '/media/w06_g.jpg', width: 1100, height: 464, alt: t.worksTitle });
}

export default async function WorksPage({ params }: P) {
  const { locale } = await params as { locale: Locale };
  const d = getDict(locale);
  const works = getWorks(locale);
  const list = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${ARTIST} · ${d.meta.worksTitle}`,
    url: `${SITE_URL}/${locale}/works`, inLanguage: locale,
    mainEntity: { '@type': 'ItemList', numberOfItems: works.length, itemListElement: works.map((w, i) => ({
      '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/${locale}/works/${w.slug}`, name: `${w.title}, ${captionText(w)}`,
    })) },
  };
  return (
    <>
      <JsonLd data={list} />
      <WorksWall locale={locale} works={works} t={{
        heading: d.works.heading, open: d.works.open, prev: d.works.prev, next: d.works.next, inquire: d.chrome.inquire,
        ticks: works.map((w, i) => d.works.tick(w.title, i + 1, works.length)), openWork: works.map((w) => d.works.openWork(w.title)),
      }} />
    </>
  );
}
