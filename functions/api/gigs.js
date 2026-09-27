import { authenticated, configured, json, validOrigin } from '../../lib/gig-auth.js';
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
const field = (value, max) => typeof value === 'string' && value.trim().length <= max ? value.trim() : null;
const validUrl = value => { if (!value) return true; try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } };
const validate = input => {
  if (!Array.isArray(input) || input.length > 100) return null;
  const result = [];
  for (const item of input) {
    if (!item || !validDate(item.date)) return null;
    const venue = field(item.venue, 120), place = field(item.place, 120), time = field(item.time || '', 100), url = field(item.url || '', 500), photo = field(item.photo || '', 500);
    if (!venue || !place || time === null || url === null || photo === null || !validUrl(url) || (photo && !(photo.startsWith('assets/') || validUrl(photo)))) return null;
    result.push({ date: item.date, venue, place, ...(time && { time }), ...(url && { url }), ...(photo && { photo }), ...(item.archived === true && { archived: true }) });
  }
  return result;
};
export const onRequestGet = async ({ request, env }) => {
  if (!env.GIGS) return json({ error: 'Gig storage is not configured.' }, 503);
  let data = await env.GIGS.get('gigs', 'json');
  if (!data) {
    const response = await env.ASSETS.fetch(new URL('/assets/gigs-default.json', request.url));
    data = await response.json();
  }
  return json(data);
};
export const onRequestPut = async ({ request, env }) => {
  if (!validOrigin(request)) return json({ error: 'Invalid origin.' }, 403);
  if (!configured(env) || !await authenticated(request, env)) return json({ error: 'Please sign in.' }, 401);
  if (Number(request.headers.get('Content-Length')) > 60000) return json({ error: 'Request too large.' }, 413);
  let data;
  try { data = validate(await request.json()); } catch { /* invalid body */ }
  if (!data) return json({ error: 'Check the dates, venues and links before saving.' }, 400);
  await env.GIGS.put('gigs', JSON.stringify(data));
  return json({ ok: true, gigs: data });
};
