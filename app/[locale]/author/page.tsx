import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n-config';
import { getDict } from '@/content/dictionaries';
import { pageMeta, personLd } from '@/lib/seo';
import { img } from '@/lib/media';
import AuthorView from '@/components/AuthorView';
import JsonLd from '@/components/JsonLd';

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params as { locale: Locale };
  const d = getDict(locale);
  return pageMeta(locale, '/author', d.meta.authorTitle, `${d.author.lead} ${d.author.p1}`, { url: '/media/author.jpg', width: 1600, height: 1068, alt: d.author.name });
}

export default async function AuthorPage({ params }: P) {
  const { locale } = await params as { locale: Locale };
  const d = getDict(locale);
  const ld = { '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: { ...personLd(locale), description: `${d.author.p1} ${d.author.p2}` } };
  return (
    <>
      <JsonLd data={ld} />
      <AuthorView photo={img('author')!} t={d.author} />
    </>
  );
}
