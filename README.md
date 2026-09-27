# Harbour Town

Static site for Harbour Town, a Portsmouth band. Open `index.html` locally or serve this directory with a static file server. No build step is needed.

## Updating gigs

The public site reads gigs from the `GIGS` Cloudflare KV namespace. Until that binding is configured, it uses the bundled entries in `assets/gigs-data.js`. The same starting entries are in `assets/gigs-default.json`, which seeds the editor when the KV namespace is empty.

Once the password editor is configured, add confirmed shows at `/manage-gigs`. The underlying entry format is:

```js
{ date: '2027-05-22', venue: 'The Golden Eagle', place: 'Southsea', url: 'https://example.com/event' }
```

Dates must use `YYYY-MM-DD`. The site sorts future shows by date on the homepage and gigs page. After a date has passed in UK time, the gig moves automatically to the expandable archive on the gigs page. To move a gig there early, add `archived: true` to its entry:

```js
{ date: '2027-05-22', venue: 'The Golden Eagle', place: 'Southsea', archived: true }
```

Remove `archived: true` to restore a future gig. Archived shows appear newest first; they do not appear in the homepage next-gig strip. `url`, `time` and `photo` are optional. Keep old entries in the array if you want them to remain in the archive. When there are no future dates, the homepage shows a neutral message.

## Password editor setup

The unlinked `/manage-gigs` route is served by a Cloudflare Pages Function. It checks the password on the server and uses an HttpOnly, Secure, SameSite cookie for an eight-hour editing session. The page and API return `noindex` and `no-store` headers. Set up both the preview and production environments before relying on it:

1. Create a Cloudflare Workers KV namespace for the gigs, then bind it to this Pages project as `GIGS` in **Settings → Bindings**. Bind the same namespace to preview and production so edits on the preview appear on the live site when this branch is published.
2. In **Settings → Variables and Secrets**, add a strong `GIG_EDITOR_PASSWORD` as an encrypted secret and a separate random `GIG_SESSION_SECRET` of at least 32 characters as an encrypted secret. Set both in the environments where the editor should work. Do not commit either value to the repository.
3. Redeploy the Pages project, visit `/manage-gigs`, sign in and save. The first save copies the starting gig list into KV. Thereafter the editor updates KV without GitHub accounts or code edits.

Cloudflare KV is eventually consistent across locations, so a saved gig may take a short while to appear in every region. Back up the list before removing the KV namespace. `noindex` alone does not make a page private; the server-side password and session checks protect the editing route and write API.

## Content

The album player uses the Harbour Town Bandcamp embed. The videos embed the three YouTube videos from the original site. All 31 photos from the original Google Site gallery are in `assets/gallery/` and displayed in `gallery.html`. The seven original member portraits are in `assets/people/` and used on the About page. The South Parade artwork comes from the band’s Bandcamp page. Add future photos to `assets/` and link them from `gallery.html` with an accurate caption and alt text.
