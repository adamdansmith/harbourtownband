const encoder = new TextEncoder();
const cookieName = 'ht_gig_session';
const sameOrigin = request => request.headers.get('Origin') === new URL(request.url).origin;
const encode = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const decode = text => Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), char => char.charCodeAt(0));
const signature = async (secret, payload) => {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return encode(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
};
const equal = (a, b) => {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
};
export const configured = env => Boolean(env.GIGS && env.GIG_EDITOR_PASSWORD && env.GIG_SESSION_SECRET && env.GIG_SESSION_SECRET.length >= 32);
export const validOrigin = sameOrigin;
export const passwordMatches = async (input, expected) => {
  const [a, b] = await Promise.all([crypto.subtle.digest('SHA-256', encoder.encode(input)), crypto.subtle.digest('SHA-256', encoder.encode(expected))]);
  return equal(encode(a), encode(b));
};
export const issueSession = async env => {
  const payload = encode(encoder.encode(JSON.stringify({ expires: Date.now() + 8 * 60 * 60 * 1000 })));
  const value = `${payload}.${await signature(env.GIG_SESSION_SECRET, payload)}`;
  return `${cookieName}=${value}; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Strict`;
};
export const clearSession = `${cookieName}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
export const authenticated = async (request, env) => {
  if (!configured(env)) return false;
  const value = request.headers.get('Cookie')?.split(';').map(item => item.trim()).find(item => item.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!value) return false;
  const [payload, mac] = value.split('.');
  if (!payload || !mac || !equal(mac, await signature(env.GIG_SESSION_SECRET, payload))) return false;
  try { return JSON.parse(new TextDecoder().decode(decode(payload))).expires > Date.now(); } catch { return false; }
};
export const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });
