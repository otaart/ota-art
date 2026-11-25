import Link from 'next/link';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/lib/i18n-config';
import { getDict } from '@/content/dictionaries';
import { getLanding, getWorks } from '@/lib/content';
import { pageMeta } from '@/lib/seo';
import Landing, { type LandingScene } from '@/components/Landing';

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params as { locale: Locale };
  const t = getDict(locale).meta;
  const m = pageMeta(locale, '', t.homeTitle, t.homeDescription, { url: '/media/scene_06.jpg', width: 1600, height: 902, alt: t.homeTitle });
  return { ...m, title: { absolute: t.homeTitle } };
}

export default async function Home({ params }: P) {
  const { locale: l } = await params;
  if (!isLocale(l)) return null;
  const locale = l;
  const d = getDict(locale);
  const { desktop, phone } = getLanding(locale);
  const scenes = (list: typeof desktop, dev: 'd' | 'm'): LandingScene[] => list.flatMap((w) => {
    const sc = w.scene!, img = dev === 'm' ? sc.phone : sc.desktop;
    return img ? [{ slug: w.slug, title: w.title, img, box: sc.box, fx: sc.fx, fy: sc.fy, video: dev === 'm' ? sc.videoPhone : sc.videoDesktop }] : [];
  });
  const D = scenes(desktop, 'd'), M = scenes(phone, 'm');
  const all = getWorks(locale);
  return (
    <>
      <Landing locale={locale} desktop={D} phone={M} t={{
        tagline: d.landing.tagline, prevScene: d.landing.prevScene, nextScene: d.landing.nextScene,
        sceneD: D.map((_, i) => d.landing.scene(i + 1)), sceneM: M.map((_, i) => d.landing.scene(i + 1)),
        openD: D.map((s) => d.landing.open(s.title)), openM: M.map((s) => d.landing.open(s.title)),
        altD: D.map((s) => d.landing.inLandscape(s.title)), altM: M.map((s) => d.landing.inLandscape(s.title)),
      }} />
      {/* for search engines and screen readers: what this site is and where the works are */}
      <div className="vh">
        <h1>Ota Votoček · {d.landing.tagline}</h1>
        <p>{d.meta.homeDescription}</p>
        <nav aria-label={d.nav.works}>
          <ul>{all.map((w) => <li key={w.slug}><Link href={`/${locale}/works/${w.slug}`}>{w.title}</Link></li>)}</ul>
        </nav>
      </div>
    </>
  );
}
