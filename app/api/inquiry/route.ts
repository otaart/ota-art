// Private viewing request: validates, emails Nini (reply goes straight to the visitor),
// and keeps a copy in the inquiry sheet when INQUIRY_SHEET_WEBHOOK is set.
import { NextResponse } from 'next/server';
import { resend, MAIL_FROM, INQUIRY_TO, esc, clip, EMAIL, limited, clientIp, turnstileOk } from '@/lib/server/mail';

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (limited(ip, 5, 10 * 60_000)) return NextResponse.json({ error: 'rate' }, { status: 429 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'bad' }, { status: 400 }); }
  if (clip(b.website, 200)) return NextResponse.json({ ok: true });   // spam trap filled in: pretend all is well

  const f = {
    locale: clip(b.locale, 5) || 'en', work: clip(b.work, 120), name: clip(b.name, 200), email: clip(b.email, 200),
    phone: clip(b.phone, 60), location: clip(b.location, 200),
    reasons: Array.isArray(b.reasons) ? b.reasons.map((x) => clip(x, 200)).filter(Boolean).slice(0, 10) : [],
    reasonOther: clip(b.reasonOther, 300),
    viewingFor: Array.isArray(b.viewingFor) ? b.viewingFor.map((x) => clip(x, 200)).filter(Boolean).slice(0, 10) : [],
    forOther: clip(b.forOther, 300), interest: clip(b.interest, 5000), when: clip(b.when, 300),
  };
  if (!f.name || !EMAIL.test(f.email) || !f.reasons.length || !f.viewingFor.length || !f.interest || !f.when) {
    return NextResponse.json({ error: 'missing' }, { status: 400 });
  }
  if (!(await turnstileOk(clip(b.turnstile, 4000) || undefined, ip))) return NextResponse.json({ error: 'check' }, { status: 400 });
  if (!resend) return NextResponse.json({ error: 'unavailable' }, { status: 503 });

  const list = (xs: string[], other: string) => xs.map((x) => (x === 'Other' && other ? `Other: ${other}` : x));
  const rows: [string, string][] = [
    ['Work', f.work], ['Name', f.name], ['Email', f.email], ['Phone', f.phone], ['Location', f.location],
    ['What brings them', list(f.reasons, f.reasonOther).join('; ')], ['Viewing for', list(f.viewingFor, f.forOther).join('; ')],
    ['Preferred date / period', f.when], ['Language', f.locale.toUpperCase()],
  ];
  const html = `<div style="font:15px/1.55 -apple-system,Segoe UI,sans-serif;color:#111">
    <p style="margin:0 0 16px;font-size:18px">Private viewing request${f.work ? ` · ${esc(f.work)}` : ''}</p>
    <table cellpadding="6" style="border-collapse:collapse">${rows.filter((r) => r[1]).map(([k, v]) => `<tr><td style="color:#6b6b6b;vertical-align:top">${k}</td><td>${esc(v)}</td></tr>`).join('')}</table>
    <p style="margin:20px 0 6px;color:#6b6b6b">Their interest</p><p style="margin:0;white-space:pre-wrap">${esc(f.interest)}</p></div>`;
  const text = rows.filter((r) => r[1]).map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nTheir interest:\n${f.interest}`;

  const { error } = await resend.emails.send({
    from: MAIL_FROM, to: INQUIRY_TO, replyTo: f.email,
    subject: `Private viewing request: ${f.name}${f.work ? ` · ${f.work}` : ''}`, html, text,
  });
  if (error) { console.error('inquiry mail', error); return NextResponse.json({ error: 'send' }, { status: 502 }); }

  const hook = process.env.INQUIRY_SHEET_WEBHOOK;
  if (hook) {
    try {
      await fetch(hook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ receivedAt: new Date().toISOString(), ...f }) });
    } catch (e) { console.error('inquiry sheet', e); }   // the email already reached Nini; the copy is best-effort
  }
  return NextResponse.json({ ok: true });
}
