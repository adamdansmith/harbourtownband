import { authenticated, clearSession, configured, issueSession, json, passwordMatches, validOrigin } from '../../lib/gig-auth.js';
export const onRequestGet = async ({ request, env }) => json({ authenticated: await authenticated(request, env), available: configured(env) });
export const onRequestPost = async ({ request, env }) => {
  if (!validOrigin(request)) return json({ error: 'Invalid origin.' }, 403);
  if (!configured(env)) return json({ error: 'Gig editing has not been configured yet.' }, 503);
  if (Number(request.headers.get('Content-Length')) > 1024) return json({ error: 'Request too large.' }, 413);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  if (body.action === 'logout') return json({ ok: true }, 200, { 'Set-Cookie': clearSession });
  if (body.action !== 'login' || typeof body.password !== 'string' || body.password.length > 256) return json({ error: 'Invalid request.' }, 400);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `login:${ip}`;
  const attempts = Number(await env.GIGS.get(key) || 0);
  if (attempts >= 5) return json({ error: 'Too many attempts. Try again in 15 minutes.' }, 429);
  if (!await passwordMatches(body.password, env.GIG_EDITOR_PASSWORD)) {
    await env.GIGS.put(key, String(attempts + 1), { expirationTtl: 900 });
    return json({ error: 'Incorrect password.' }, 401);
  }
  await env.GIGS.delete(key);
  return json({ ok: true }, 200, { 'Set-Cookie': await issueSession(env) });
};
