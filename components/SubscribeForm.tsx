'use client';
// Newsletter sign-up used on Contact and in the pop-up. Double opt-in: the visitor confirms
// from an email before being added (handled by /api/subscribe).
import { useState } from 'react';

export type SubState = 'idle' | 'sending' | 'done' | 'invalid' | 'unavailable';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function subscribe(email: string, locale: string): Promise<SubState> {
  if (!EMAIL.test(email.trim())) return 'invalid';
  try {
    const r = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: email.trim(), locale }) });
    return r.ok ? 'done' : r.status === 400 ? 'invalid' : 'unavailable';
  } catch { return 'unavailable'; }
}

export default function SubscribeForm({ locale, t, style }: {
  locale: string; style?: React.CSSProperties;
  t: { email: string; send: string; invalid: string; checkInbox: string; unavailable: string; noted: string };
}) {
  const [state, setState] = useState<SubState>('idle');
  const [email, setEmail] = useState('');
  const msg = state === 'invalid' ? t.invalid : state === 'done' ? t.checkInbox : state === 'unavailable' ? t.unavailable : '';
  return (
    <form className="efield" style={style} noValidate onSubmit={async (e) => {
      e.preventDefault();
      setState('sending');
      setState(await subscribe(email, locale));
    }}>
      <input type="email" placeholder={t.email} aria-label={t.email} autoComplete="email" value={email}
        onChange={(e) => setEmail(e.target.value)} aria-invalid={state === 'invalid'} disabled={state === 'done'} />
      <button disabled={state === 'sending' || state === 'done'}>{state === 'done' ? t.noted : t.send}</button>
      <p className="emsg" aria-live="polite">{msg}</p>
    </form>
  );
}
