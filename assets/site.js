
const HT = {
  band: [
    { name: "Denis Reeve-Baker", role: "Guitar & vocals", blurb: "Songwriter for the band. Played in many groups including Reet Petite and Gone, The Red Sky Divers and Scarlet Town." },
    { name: "Jo Alldridge", role: "Vocals (& shaker!)", blurb: "Musical theatre background; performs lead and harmony vocals with warmth and clarity." },
    { name: "Dave Jordan", role: "Double bass & backing vocals", blurb: "Long-time south coast musician; previously The Polite Mechanicals and Scarlet Town. Ran Barebones and the Mayfly festival events in Portsmouth." },
    { name: "Paul Hookham", role: "Drums & percussion", blurb: "Friend of HT and former Scarlet Town collaborator. Professional work includes The English Subtitles, The Woodentops and The Redskins." },
    { name: "Scooby", role: "Clarinet, saxophones, cello, violin, & backing vocals", blurb: "Multi-instrumentalist; leads and arranges wind, brass and strings with great sensitivity." },
    { name: "Adam Smith", role: "Clarinet, saxophones, & flute", blurb: "Music graduate from Royal Holloway; plays with confidence and sensitivity." },
    { name: "Sue Ryder-Morgan", role: "Flute", blurb: "First played with Den in 1978; member of The Red Sky Divers and Scarlet Town before Harbour Town." }
  ],
  gigs: [
    { date: "8 March 2026", venue: "Golden Eagle, Southsea" },
    { date: "23 April 2026", venue: "Barley Mow, Southsea" },
    { date: "27 August 2026", venue: "Barley Mow, Southsea" },
    { date: "27 November 2025", venue: "Barley Mow, Southsea" },
    { date: "21 December 2025", venue: "Christmas special at the Golden Eagle!" }
  ],
  links: {
    email: "harbourtownuk@gmail.com",
    facebook: "https://www.facebook.com/harbourtownband1",
    bandcamp: "https://harbourtown.bandcamp.com/album/harbour-town"
  }
};

function setActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.setAttribute("aria-current","page");
  });
}

function renderGigs(selector){
  const el = document.querySelector(selector);
  if(!el) return;

  const gigs = (window.HT?.gigs || []).slice();
  el.innerHTML = gigs.map(g => `
    <div class="gig">
      <strong>${escapeHtml(g.date)}</strong>
      <span>${escapeHtml(g.venue)}</span>
    </div>
  `).join("");
}

function renderBand(selector){
  const el = document.querySelector(selector);
  if(!el) return;

  el.innerHTML = HT.band.map(m => `
    <div class="item">
      <div>
        <strong>${escapeHtml(m.name)}</strong>
        <small>${escapeHtml(m.role)}</small>
        <small>${escapeHtml(m.blurb)}</small>
      </div>
    </div>
  `).join("");
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  renderGigs("[data-gigs]");
  renderBand("[data-band]");
});
