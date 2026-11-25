'use client';
// Private viewing request. Sends to /api/inquiry, which emails Nini (and keeps a copy in the sheet).
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Dict } from '@/content/dictionaries';

type T = Omit<Dict['inquire'], 'regarding'> & { regarding: string };   // "Regarding: {title}"
type Status = 'idle' | 'sending' | 'sent' | 'error' | 'failed';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TURNSTILE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;   // spam check, active once the key is set

export default function InquiryForm({ locale, t, titles }: { locale: string; t: T; titles: Record<string, string> }) {
  const params = useSearchParams();
  const slug = params.get('work') || '';
  const workTitle = titles[slug] || '';
  const [status, setStatus] = useState<Status>('idle');
  const [bad, setBad] = useState<Set<string>>(new Set());
  const [otherA, setOtherA] = useState(false);
  const [otherB, setOtherB] = useState(false);

  useEffect(() => {
    if (!TURNSTILE || document.getElementById('cf-ts')) return;
    const sc = document.createElement('script');
    sc.id = 'cf-ts'; sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'; sc.async = true; sc.defer = true;
    document.head.appendChild(sc);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) || '').trim();
    const data = {
      locale, work: workTitle, name: get('name'), email: get('email'), phone: get('phone'), location: get('location'),
      reasons: f.getAll('reason').map(String), reasonOther: get('reasonOther'),
      viewingFor: f.getAll('for').map(String), forOther: get('forOther'),
      interest: get('interest'), when: get('when'), website: get('website'), turnstile: get('cf-turnstile-response'),
    };
    const missing = new Set<string>();
    if (!data.name) missing.add('name');
    if (!EMAIL.test(data.email)) missing.add('email');
    if (!data.reasons.length) missing.add('reason');
    if (!data.viewingFor.length) missing.add('for');
    if (!data.interest) missing.add('interest');
    if (!data.when) missing.add('when');
    setBad(missing);
    if (missing.size) {
      setStatus('error');
      const first = e.currentTarget.querySelector<HTMLElement>(missing.has('name') ? '#f-name' : missing.has('email') ? '#f-email' : missing.has('reason') ? 'input[name=reason]' : missing.has('for') ? 'input[name=for]' : missing.has('interest') ? '#f-int' : '#f-when');
      first?.focus();
      return;
    }
    setStatus('sending');
    try {
      const r = await fetch('/api/inquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      setStatus(r.ok ? 'sent' : 'failed');
    } catch { setStatus('failed'); }
  }

  const inv = (k: string) => (bad.has(k) ? true : undefined);
  if (status === 'sent') return <p className="fsent" role="status" style={{ fontSize: 20, maxWidth: 768, margin: '0 auto' }}>{t.sent}</p>;

  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      {workTitle ? <p className="fregard">{t.regarding.replace('{title}', workTitle)}</p> : null}
      {/* spam trap: people never see or fill this field */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="vh" aria-hidden="true" />
      <div className="frow">
        <div className="fld"><label htmlFor="f-name">{t.name}<span className="req">*</span></label><input id="f-name" name="name" required autoComplete="name" aria-invalid={inv('name')} /></div>
        <div className="fld"><label htmlFor="f-email">{t.email}<span className="req">*</span></label><input id="f-email" name="email" type="email" required autoComplete="email" aria-invalid={inv('email')} /></div>
      </div>
      <div className="frow">
        <div className="fld"><label htmlFor="f-phone">{t.phone}</label><input id="f-phone" name="phone" type="tel" autoComplete="tel" /></div>
        <div className="fld"><label htmlFor="f-loc">{t.location}</label><input id="f-loc" name="location" autoComplete="country-name" /></div>
      </div>
      <div className="fsep" />
      <fieldset className="fgrp" aria-invalid={inv('reason')} style={{ border: 0, padding: 0 }}>
        <p>{t.whatBrings}<span className="req">*</span></p>
        {t.reasons.map((r) => <label key={r}><input type="checkbox" name="reason" value={r} />{r}</label>)}
        <label><input type="checkbox" name="reason" value="Other" onChange={(e) => setOtherA(e.target.checked)} />{t.other}</label>
        {otherA ? <input className="fother" style={{ display: 'block' }} type="text" name="reasonOther" placeholder={t.specify} aria-label={t.specify} /> : null}
      </fieldset>
      <fieldset className="fgrp" aria-invalid={inv('for')} style={{ border: 0, padding: 0 }}>
        <p>{t.viewingFor}<span className="req">*</span></p>
        {t.forOptions.map((r) => <label key={r}><input type="checkbox" name="for" value={r} />{r}</label>)}
        <label><input type="checkbox" name="for" value="Other" onChange={(e) => setOtherB(e.target.checked)} />{t.other}</label>
        {otherB ? <input className="fother" style={{ display: 'block' }} type="text" name="forOther" placeholder={t.specify} aria-label={t.specify} /> : null}
      </fieldset>
      <div className="fsep" />
      <div className="fld"><label htmlFor="f-int">{t.interest}<span className="req">*</span></label><textarea id="f-int" name="interest" aria-invalid={inv('interest')} /></div>
      <div className="fld" style={{ marginTop: 40 }}><label htmlFor="f-when">{t.when}<span className="req">*</span></label><input id="f-when" name="when" aria-invalid={inv('when')} /></div>
      {TURNSTILE ? <div className="cf-turnstile" data-sitekey={TURNSTILE} data-theme="auto" style={{ marginTop: 32 }} /> : null}
      <button className="fbtn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? t.sending : t.submit}</button>
      <p className={`fsent${status === 'error' || status === 'failed' ? ' ferr' : ''}`} aria-live="polite">
        {status === 'error' ? t.error : status === 'failed' ? t.failed : ''}
      </p>
      <p className="fnote">{t.note} {t.consent}</p>
    </form>
  );
}
