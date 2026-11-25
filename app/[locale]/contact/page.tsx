import Link from 'next/link';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n-config';
import { getDict } from '@/content/dictionaries';
import { pageMeta } from '@/lib/seo';
import { img } from '@/lib/media';
import SubscribeForm from '@/components/SubscribeForm';

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params as { locale: Locale };
  const t = getDict(locale).meta;
  return pageMeta(locale, '/contact', t.contactTitle, t.contactDescription);
}

export default async function ContactPage({ params }: P) {
  const { locale } = await params as { locale: Locale };
  const d = getDict(locale), c = d.contact;
  const strip = img('contact_strip')!, bg = img('contact_bg')!;
  const sub = { email: d.subscribe.email, send: d.subscribe.send, invalid: d.subscribe.invalid, checkInbox: d.subscribe.checkInbox, unavailable: d.subscribe.unavailable, noted: d.subscribe.noted };
  const inq = `/${locale}/inquire`, legal = `/${locale}/legal`;
  const Mail = () => <a className="cmail" href="mailto:nini@ota.art">nini@ota.art</a>;
  return (
    <section className="view" id="v-contact">
      <h1 className="vh">{d.meta.contactTitle}</h1>
      <div className="stage" id="cstage">
        <div className="dk cgrid">
          <div className="cleft">
            <div className="blk"><div className="slab">{c.exhibitions}</div>
              <h2 className="sttl">{c.exhibitionsTitle}</h2>
              <p className="stxt">{c.exhibitionsText}</p>
              <SubscribeForm locale={locale} t={sub} style={{ maxWidth: 600 }} />
              <img className="cstrip" src={strip.src} srcSet={strip.srcSet} sizes="600px" alt={c.stripAlt} loading="lazy" /></div>
            <div className="blk"><div className="slab">{c.correspondence}</div>
              <p className="ctext">{c.corrText}</p>
              <p className="ctext">{c.representative}</p>
              <p style={{ margin: 0 }}><Mail /></p></div>
          </div>
          <div className="cpanel"><div className="cright"><img src={bg.src} alt="" /></div>
            <div className="cpin"><div className="slab">{c.privateViewing}</div>
              <h2 className="sttl">{c.privateViewingTitle}</h2>
              <div style={{ width: 92, borderTop: '1px solid var(--gold)' }} />
              <p className="stxt">{c.pv1}</p>
              <p className="stxt">{c.pv2}</p>
              <p className="stxt">{c.pv3}</p>
              <p style={{ margin: '8px 0 0' }}><Link className="lnk" href={inq}>{c.inquire}</Link></p>
              <p style={{ margin: 'auto 0 0' }}><Link className="stxt" style={{ fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', textDecoration: 'none' }} href={legal}>{c.copyright}</Link></p></div></div>
        </div>
        <div className="m mcon">
          <div className="slab">{c.exhibitions}</div>
          <h2 className="sttl" style={{ marginTop: 14 }}>{c.exhibitionsTitle}</h2>
          <p className="stxt" style={{ marginTop: 16 }}>{c.exhibitionsText}</p>
          <SubscribeForm locale={locale} t={sub} style={{ marginTop: 16 }} />
          <img src={strip.src} srcSet={strip.srcSet} sizes="100vw" alt={c.stripAlt} loading="lazy" style={{ marginTop: 16, width: '100%', height: 96, objectFit: 'cover' }} />
          <div className="pv"><div className="cright"><img src={bg.src} alt="" /></div>
            <div className="slab">{c.privateViewing}</div>
            <h2 className="sttl" style={{ marginTop: 16 }}>{c.privateViewingTitle}</h2>
            <div style={{ width: 80, borderTop: '1px solid var(--gold)', margin: '18px 0' }} />
            <p className="stxt">{c.pv1}</p>
            <p className="stxt" style={{ marginTop: 14 }}>{c.pv2}</p>
            <p style={{ margin: '18px 0 0' }}><Link className="lnk" href={inq}>{c.inquire}</Link></p></div>
          <div className="slab">{c.correspondence}</div>
          <p className="ctext" style={{ margin: '12px 0 0' }}>{c.corrText}</p>
          <p className="ctext" style={{ margin: '10px 0 0' }}>{c.representative}</p>
          <p style={{ margin: '12px 0 0' }}><Mail /></p>
          <p style={{ margin: '40px 0 0' }}><Link className="stxt" style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', textDecoration: 'none' }} href={legal}>{c.copyright}</Link></p>
        </div>
      </div>
    </section>
  );
}
