import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n-config';
import { getDict } from '@/content/dictionaries';
import { LEGAL } from '@/content/legal';
import { pageMeta } from '@/lib/seo';

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params as { locale: Locale };
  const d = getDict(locale);
  return { ...pageMeta(locale, '/legal', d.meta.legalTitle, LEGAL[locale][0].text) };
}

export default async function LegalPage({ params }: P) {
  const { locale } = await params as { locale: Locale };
  const d = getDict(locale);
  return (
    <section className="view" id="v-legal">
      <div className="tpage"><span className="slab">{d.legal.appendix}</span><h1>{d.legal.title}</h1><div className="hr" />
        <div className="legal">
          {LEGAL[locale].map((s, i) => (
            <div key={i}>{s.heading ? <h3>{s.heading}</h3> : null}<p>{s.text}</p></div>
          ))}
          <p className="lfoot2"><span>© Ota Votoček</span><a href="mailto:nini@ota.art">nini@ota.art</a></p>
        </div>
      </div>
    </section>
  );
}
