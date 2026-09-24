# Harbour Town

Static site for Harbour Town, a Portsmouth band. Open `index.html` locally or serve this directory with a static file server. No build step is needed.

## Updating gigs

The two current entries in `assets/site.js` are **example dates for design review only**. They are labelled as examples on the site and must be replaced or removed before public release. Add confirmed shows to the `gigs` array at the top of `assets/site.js`:

```js
{ date: '2027-05-22', venue: 'The Golden Eagle', place: 'Southsea', url: 'https://example.com/event' }
```

Dates must use `YYYY-MM-DD`. The site sorts them and removes past shows from the homepage and gigs page. `url` is optional. For confirmed dates, omit `demo: true`. Example dates retain `demo: true` so they are clearly labelled and never get a booking link. When there are no future dates, the homepage shows a neutral message.

## Content

The album player uses the Harbour Town Bandcamp embed. The videos embed the three YouTube videos from the original site. The site includes the original live photos in this repository, plus images from the band’s original Google Site and South Parade artwork from the band’s Bandcamp page. Add future photos to `assets/` and link them from `gallery.html` with an accurate caption and alt text.
