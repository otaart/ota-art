import { Suspense } from 'react';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n-config';
import { getDict } from '@/content/dictionaries';
import { getWorks } from '@/lib/content';
import { pageMeta } from '@/lib/seo';
import InquiryForm from '@/components/InquiryForm';

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params as { locale: Locale };
  const t = getDict(locale).meta;
  return pageMeta(locale, '/inquire', t.inquireTitle, t.inquireDescription);
}

export default async function InquirePage({ params }: P) {
  const { locale } = await params as { locale: Locale };
  const d = getDict(locale);
  const titles = Object.fromEntries(getWorks(locale).map((w) => [w.slug, w.title]));
  return (
    <section className="view" id="v-inquire">
      <div className="tpage">
        <span className="slab">{d.inquire.label}</span><h1>{d.inquire.title}</h1><div className="hr" />
        <Suspense fallback={null}><InquiryForm locale={locale} t={{ ...d.inquire, regarding: d.inquire.regarding('{title}') }} titles={titles} /></Suspense>
      </div>
    </section>
  );
}
