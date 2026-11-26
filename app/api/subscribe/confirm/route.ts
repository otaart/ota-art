// Newsletter sign-up, step 2: the visitor clicked the link in the confirmation email.
import { resend, readToken, esc } from '@/lib/server/mail';

const PAGE = (lang: string, title: string, text: string, back: string, href: string) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>ota.art</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#161616;color:#ededed;font:300 20px/1.6 Georgia,serif;text-align:center;padding:24px;box-sizing:border-box}
h1{font-weight:300;font-size:64px;margin:0 0 24px}a{color:#C9A96E;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;font:400 15px Arial,sans-serif}</style></head>
<body><div><h1>ota</h1><p>${title}</p><p style="color:#b3b3b3">${text}</p><p style="margin-top:32px"><a href="${href}">${back}</a></p></div></body></html>`;

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get('t') || '';
  const p = readToken<{ e: string; l: string; x: number }>(t);
  const cs = p?.l === 'cs';
  const html = (ok: boolean) => new Response(PAGE(cs ? 'cs' : 'en',
    ok ? (cs ? 'Děkujeme. Odběr je potvrzen.' : 'Thank you. Your subscription is confirmed.') : (cs ? 'Odkaz už neplatí.' : 'This link is no longer valid.'),
    ok ? (cs ? 'Ateliér se vám ozve.' : 'You will hear from the studio.') : (cs ? 'Přihlaste se prosím znovu na stránce Kontakt.' : 'Please sign up again on the Contact page.'),
    cs ? 'Zpět na ota.art' : 'Back to ota.art', ok ? `/${cs ? 'cs' : 'en'}` : `/${cs ? 'cs' : 'en'}/contact`),
    { status: ok ? 200 : 400, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });

  if (!p || !p.e || Date.now() > p.x || !resend) return html(false);
  // main list plus the list for the language the visitor subscribed in (Nini 26 Nov: newsletters go out per language)
  const ids = [process.env.RESEND_SEGMENT_ID, cs ? process.env.RESEND_SEGMENT_ID_CS : process.env.RESEND_SEGMENT_ID_EN].filter(Boolean) as string[];
  const { error } = await resend.contacts.create({ email: p.e, unsubscribed: false, ...(ids.length ? { segments: ids.map((id) => ({ id })) } : {}) });
  // a contact that already exists is fine: they confirmed twice
  if (error && !/exist/i.test(error.message || '')) { console.error('subscribe confirm', esc(error.message || '')); return html(false); }
  return html(true);
}
