import '@fontsource/jost/300.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { LOCALES, isLocale } from '@/lib/i18n-config';
import { getDict } from '@/content/dictionaries';
import { SITE_URL, websiteLd } from '@/lib/seo';
import { ChromeProvider } from '@/components/ChromeContext';
import SiteChrome from '@/components/SiteChrome';
import SubscribePopup from '@/components/SubscribePopup';
import CaptionFit from '@/components/CaptionFit';
import JsonLd from '@/components/JsonLd';

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })); }

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#161616' }, { color: '#161616' }],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale).meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.homeTitle, template: '%s · ota.art' },
    description: t.homeDescription,
    applicationName: 'ota.art',
    authors: [{ name: 'Ota Votoček' }],
    creator: 'Ota Votoček',
    formatDetection: { telephone: false, email: false, address: false },
  };
}

// Dark is the default; a visitor's own choice (kept in this browser) is applied before first paint.
const THEME = "try{if(localStorage.getItem('ota-theme2')==='light')document.documentElement.dataset.theme='light'}catch(e){}";

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME }} />
        <JsonLd data={websiteLd(locale)} />
      </head>
      <body>
        <ChromeProvider>
          <SiteChrome locale={locale} t={{ nav: d.nav, chrome: d.chrome }} />
          <main id="content">{children}</main>
          <SubscribePopup locale={locale} t={{ ...d.subscribe, text: d.contact.exhibitionsText, close: d.detail.close }} />
          <CaptionFit />
        </ChromeProvider>
        <Analytics />
      </body>
    </html>
  );
}
