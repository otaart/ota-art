import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { Resend } from 'resend';

const key = process.env.RESEND_API_KEY;
export const resend = key ? new Resend(key) : null;
export const MAIL_FROM = process.env.MAIL_FROM || 'ota.art <studio@send.ota.art>';
export const INQUIRY_TO = process.env.INQUIRY_TO || 'nini@ota.art';

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export const clip = (s: unknown, n: number) => (typeof s === 'string' ? s.trim().slice(0, n) : '');
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* --- simple per-instance rate limit: enough to stop a script hammering one server instance --- */
const hits = new Map<string, number[]>();
export function limited(ip: string, max: number, windowMs: number) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}
export const clientIp = (req: Request) => (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';

/* --- Cloudflare Turnstile: required once its secret is set --- */
export async function turnstileOk(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const j = (await r.json()) as { success?: boolean };
    return !!j.success;
  } catch { return false; }
}

/* --- signed, expiring tokens for the newsletter confirmation link (no database needed) --- */
const SECRET = process.env.SUBSCRIBE_SECRET || '';
export function signToken(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}
export function readToken<T>(token: string): T | null {
  if (!SECRET) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const want = createHmac('sha256', SECRET).update(body).digest();
  const got = Buffer.from(sig, 'base64url');
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  try { return JSON.parse(Buffer.from(body, 'base64url').toString()) as T; } catch { return null; }
}
export const subscribeReady = () => !!(resend && SECRET && process.env.RESEND_SEGMENT_ID);
