# Harbour Town

Static site for Harbour Town, a Portsmouth band. Open `index.html` locally or serve this directory with a static file server. No build step is needed.

## Updating gigs

Add confirmed shows to the `gigs` array at the top of `assets/site.js`:

```js
{ date: '2027-05-22', venue: 'The Golden Eagle', place: 'Southsea', url: 'https://example.com/event' }
```

Dates must use `YYYY-MM-DD`. The site sorts them and removes past shows from the homepage and gigs page. `url` is optional. Until a date is confirmed, the site shows the Facebook link rather than an invented gig.

## Content

The album player uses the Harbour Town Bandcamp embed. The videos embed the three YouTube videos from the original site. Live photos in `assets/` were already in this repository. Add future photos to `assets/` and link them from `gallery.html` with an accurate caption and alt text.
