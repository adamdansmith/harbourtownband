# Harbour Town

Static site for Harbour Town, a Portsmouth band. Open `index.html` locally or serve this directory with a static file server. No build step is needed.

## Updating gigs

Add confirmed shows to the `gigs` array in `assets/gigs-data.js`:

```js
{ date: '2027-05-22', venue: 'The Golden Eagle', place: 'Southsea', url: 'https://example.com/event' }
```

Dates must use `YYYY-MM-DD`. The site sorts future shows by date on the homepage and gigs page. After a date has passed in UK time, the gig moves automatically to the expandable archive on the gigs page. To move a gig there early, add `archived: true` to its entry:

```js
{ date: '2027-05-22', venue: 'The Golden Eagle', place: 'Southsea', archived: true }
```

Remove `archived: true` to restore a future gig. Archived shows appear newest first; they do not appear in the homepage next-gig strip. `url`, `time` and `photo` are optional. Keep old entries in the array if you want them to remain in the archive. When there are no future dates, the homepage shows a neutral message.

The unlinked `manage-gigs.html` page has a `noindex` directive and takes editors to the GitHub editor for the preview branch. Editing requires a GitHub account with write access to this repository. Once this design branch is published, change its edit link to the production branch. `noindex` does not restrict access to the page itself; never store a password or secret in this static site. A form that saves directly on the site would need a protected server-side editor.

## Content

The album player uses the Harbour Town Bandcamp embed. The videos embed the three YouTube videos from the original site. All 31 photos from the original Google Site gallery are in `assets/gallery/` and displayed in `gallery.html`. The seven original member portraits are in `assets/people/` and used on the About page. The South Parade artwork comes from the band’s Bandcamp page. Add future photos to `assets/` and link them from `gallery.html` with an accurate caption and alt text.
