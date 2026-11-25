// Newsletter sign-up, step 1 of the double opt-in: sends a confirmation email with a signed link.
// Nobody is added to the list until they click it (GDPR, and it keeps the list clean).
import { NextResponse } from 'next/server';
import { resend, MAIL_FROM, clip, EMAIL, limited, clientIp, signToken, subscribeReady } from '@/lib/server/mail';
import { SITE_URL } from '@/lib/seo';

const COPY = {
  en: { subject: 'Please confirm your subscription to ota.art', hello: 'Thank you for your interest in the work of Ota Votoček.', ask: 'Please confirm that you would like to receive exhibition updates and occasional news from the studio:', button: 'Confirm subscription', ignore: 'If you did not ask for this, simply ignore this email; you will not be added.' },
  cs: { subject: 'Potvrďte prosím odběr novinek ota.art', hello: 'Děkujeme za váš zájem o tvorbu Oty Votočka.', ask: 'Potvrďte prosím, že chcete dostávat novinky o výstavách a občasné zprávy z ateliéru:', button: 'Potvrdit odběr', ignore: 'Pokud jste o odběr nežádali, tento e-mail ignorujte; nebudete přidáni.' },
};

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (limited(ip, 5, 10 * 60_000)) return NextResponse.json({ error: 'rate' }, { status: 429 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'bad' }, { status: 400 }); }
  const email = clip(b.email, 200).toLowerCase();
  const locale = clip(b.locale, 5) === 'cs' ? 'cs' : 'en';
  if (!EMAIL.test(email)) return NextResponse.json({ error: 'email' }, { status: 400 });
  if (!subscribeReady() || !resend) return NextResponse.json({ error: 'unavailable' }, { status: 503 });

  const token = signToken({ e: email, l: locale, x: Date.now() + 7 * 864e5 });   // valid 7 days
  const link = `${SITE_URL}/api/subscribe/confirm?t=${encodeURIComponent(token)}`;
  const c = COPY[locale];
  const { error } = await resend.emails.send({
    from: MAIL_FROM, to: email, subject: c.subject,
    text: `${c.hello}\n\n${c.ask}\n${link}\n\n${c.ignore}`,
    html: `<div style="font:16px/1.6 Georgia,serif;color:#111;max-width:520px">
      <p style="font-size:34px;margin:0 0 24px">ota</p><p>${c.hello}</p><p>${c.ask}</p>
      <p style="margin:28px 0"><a href="${link}" style="background:#C9A96E;color:#fff;padding:14px 26px;text-decoration:none;letter-spacing:.14em;font-family:Arial,sans-serif;font-size:14px;text-transform:uppercase">${c.button}</a></p>
      <p style="color:#6b6b6b;font-size:14px">${c.ignore}</p></div>`,
  });
  if (error) { console.error('subscribe mail', error); return NextResponse.json({ error: 'send' }, { status: 502 }); }
  return NextResponse.json({ ok: true });
}
