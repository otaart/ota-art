import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, type Locale } from '@/lib/i18n-config';
import { getDict } from '@/content/dictionaries';
import { getWork, getSlugs, captionText } from '@/lib/content';
import { pageMeta, artworkLd, breadcrumbLd } from '@/lib/seo';
import WorkDetail from '@/components/WorkDetail';
import JsonLd from '@/components/JsonLd';

type P = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap((locale) => getSlugs().map((slug) => ({ locale, slug }))); }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params as { locale: Locale; slug: string };
  const w = getWork(locale, slug);
  if (!w) return {};
  const t = getDict(locale).meta;
  const img = w.images.wall;
  return pageMeta(locale, `/works/${slug}`, w.title, t.workDescription(w.title, captionText(w)),
    img ? { url: img.src, width: Math.min(img.width, 1600), height: Math.round(Math.min(img.width, 1600) * img.height / img.width), alt: w.title } : undefined);
}

export default async function WorkPage({ params }: P) {
  const { locale, slug } = await params as { locale: Locale; slug: string };
  const w = getWork(locale, slug);
  if (!w) notFound();
  const d = getDict(locale);
  return (
    <>
      <JsonLd data={artworkLd(locale, w)} />
      <JsonLd data={breadcrumbLd(locale, [{ name: 'ota.art', path: '' }, { name: d.meta.worksTitle, path: '/works' }, { name: w.title, path: `/works/${w.slug}` }])} />
      <WorkDetail locale={locale} w={w} t={{
        label: d.detail.label, close: d.detail.close, zoom: d.detail.zoom, zoomIn: d.detail.zoomIn, zoomOut: d.detail.zoomOut,
        detailOfArtwork: d.detail.detailOfArtwork, detailOf: d.detail.detailOf(w.title), descriptionToCome: d.detail.descriptionToCome,
        inquire: d.detail.inquire, toAbout: d.detail.toAbout, toSetting: d.detail.toSetting, toPainting: d.detail.toPainting,
        backToPainting: d.detail.backTo(d.detail.thePainting), backToAbout: d.detail.backTo(d.detail.aboutTheWork),
        viewFull: d.detail.viewFull, inLandscape: d.landing.inLandscape(w.title), regarding: d.inquire.regarding(w.title),
      }} />
    </>
  );
}
