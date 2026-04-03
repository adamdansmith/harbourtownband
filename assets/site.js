const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");
const heroSlideshow = document.getElementById("heroSlideshow");
const routeEls = document.querySelectorAll(".route");
const buttons = document.querySelectorAll(".button");
const revealElements = document.querySelectorAll(".reveal");
const releaseTitle = document.querySelector(".release-title-bounce");

const hero = document.querySelector(".hero");
const heroCopy = document.querySelector(".hero-copy");
const heroSlideshowEl = document.querySelector(".hero-slideshow");

const artLayers = document.querySelectorAll(".section-art");
const gulls = document.querySelectorAll(".gull");
const waveBands = document.querySelectorAll(".wave-band");
const stitchedLines = document.querySelectorAll(".stitched-line");

/* =========================
   MOBILE MENU
   ========================= */

function openMenu() {
  if (!mobileMenu || !menuOverlay || !menuToggle) return;

  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuOverlay.classList.add("active");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  if (!mobileMenu || !menuOverlay || !menuToggle) return;

  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuOverlay.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

if (menuToggle) menuToggle.addEventListener("click", openMenu);
if (menuClose) menuClose.addEventListener("click", closeMenu);
if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* =========================
   HERO SLIDESHOW
   ========================= */

const slideshowCandidates = [];
for (let i = 1; i <= 10; i += 1) {
  slideshowCandidates.push(`assets/slideshow_${i}.jpg`);
  slideshowCandidates.push(`assets/slideshow_${i}.JPG`);
  slideshowCandidates.push(`assets/slideshow_${i}.jpeg`);
  slideshowCandidates.push(`assets/slideshow_${i}.JPEG`);
  slideshowCandidates.push(`assets/slideshow_${i}.png`);
  slideshowCandidates.push(`assets/slideshow_${i}.PNG`);
}

function preloadExistingSlides(paths) {
  return Promise.all(
    paths.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    })
  ).then((results) => {
    return [...new Set(results.filter(Boolean))];
  });
}

function buildSlideshow(slides) {
  if (!heroSlideshow || !slides.length) return;

  heroSlideshow.innerHTML = slides
    .map((src, index) => {
      return `
        <div class="hero-slide ${index === 0 ? "is-active" : ""}">
          <img src="${src}" alt="">
        </div>
      `;
    })
    .join("");

  const slideEls = heroSlideshow.querySelectorAll(".hero-slide");
  if (slideEls.length <= 1) return;

  let activeIndex = 0;

  window.setInterval(() => {
    slideEls[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % slideEls.length;
    slideEls[activeIndex].classList.add("is-active");
  }, 4200);
}

preloadExistingSlides(slideshowCandidates).then((slides) => {
  buildSlideshow(slides);
});

/* =========================
   HEADER ON SCROLL
   ========================= */

function updateHeaderState() {
  if (window.scrollY > 70) {
    document.body.classList.add("header-solid");
  } else {
    document.body.classList.remove("header-solid");
  }
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

/* =========================
   REVEAL ANIMATIONS
   ========================= */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => revealObserver.observe(element));

/* =========================
   ROUTE ANIMATIONS
   ========================= */

const routeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.3 }
);

routeEls.forEach((route) => routeObserver.observe(route));

/* =========================
   RELEASE TITLE BOUNCE
   ========================= */

if (releaseTitle) {
  const releaseTitleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          releaseTitle.classList.add("is-live");
        }
      });
    },
    { threshold: 0.5 }
  );

  releaseTitleObserver.observe(releaseTitle);
}

/* =========================
   BUTTON MAGNETIC EFFECT
   ========================= */

buttons.forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const moveX = (x - rect.width / 2) * 0.05;
    const moveY = (y - rect.height / 2) * 0.08;

    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

/* =========================
   HERO PARALLAX
   ========================= */

function updateHeroParallax() {
  if (!hero || !heroCopy || !heroSlideshowEl) return;

  const scrollY = window.scrollY;
  const heroHeight = hero.offsetHeight;

  if (scrollY <= heroHeight) {
    const copyShift = scrollY * 0.04;
    const bgShift = scrollY * 0.02;

    heroCopy.style.transform = `translateY(${copyShift}px)`;
    heroSlideshowEl.style.transform = `translateY(${bgShift}px) scale(1.03)`;
  } else {
    heroCopy.style.transform = "";
    heroSlideshowEl.style.transform = "";
  }
}

window.addEventListener("scroll", updateHeroParallax, { passive: true });
updateHeroParallax();

/* =========================
   SITE ART PARALLAX
   ========================= */

function updateArtParallax() {
  const scrollY = window.scrollY;

  artLayers.forEach((layer, index) => {
    const speed = 0.012 + index * 0.003;
    const y = scrollY * speed;
    layer.style.transform = `translateY(${y}px)`;
  });

  waveBands.forEach((band, index) => {
    const speed = 0.01 + index * 0.002;
    const y = scrollY * speed;
    band.style.transform = `translateY(${y}px)`;
  });

  stitchedLines.forEach((line, index) => {
    const speed = 0.014 + index * 0.002;
    const y = scrollY * speed;
    line.style.transform = `translateY(${y}px)`;
  });

  gulls.forEach((gull, index) => {
    const speed = 0.018 + index * 0.004;
    const y = scrollY * speed;
    gull.style.transform += ` translateY(${y * 0.15}px)`;
  });
}

/* reset-and-apply version for gulls so transforms do not stack */
function updateGulls() {
  const scrollY = window.scrollY;

  gulls.forEach((gull) => {
    let baseTransform = "";

    if (gull.classList.contains("gull-a")) {
      baseTransform = "rotate(6deg)";
    } else if (gull.classList.contains("gull-b")) {
      baseTransform = "scale(0.82) rotate(-8deg)";
    } else if (gull.classList.contains("gull-c")) {
      baseTransform = "scale(0.9) rotate(10deg)";
    } else if (gull.classList.contains("gull-d")) {
      baseTransform = "scale(1.04) rotate(-10deg)";
    } else if (gull.classList.contains("gull-e")) {
      baseTransform = "scale(0.86) rotate(8deg)";
    }

    const offset = scrollY * 0.02;
    gull.style.transform = `${baseTransform} translateY(${offset}px)`;
  });
}

function updateSectionArt() {
  const scrollY = window.scrollY;

  waveBands.forEach((band, index) => {
    const offset = scrollY * (0.008 + index * 0.0015);
    band.style.transform = `translateY(${offset}px)`;
  });

  stitchedLines.forEach((line, index) => {
    const offset = scrollY * (0.012 + index * 0.0015);
    line.style.transform = `translateY(${offset}px)`;
  });

  updateGulls();
}

window.addEventListener("scroll", updateSectionArt, { passive: true });
updateSectionArt();

/* =========================
   LIGHT FLOAT ANIMATION VIA JS
   ========================= */

let floatTick = 0;

function animateArtwork() {
  floatTick += 0.012;

  gulls.forEach((gull, index) => {
    const extraY = Math.sin(floatTick + index) * 4;
    const extraX = Math.cos(floatTick * 0.8 + index) * 2;

    let baseTransform = "";

    if (gull.classList.contains("gull-a")) {
      baseTransform = "rotate(6deg)";
    } else if (gull.classList.contains("gull-b")) {
      baseTransform = "scale(0.82) rotate(-8deg)";
    } else if (gull.classList.contains("gull-c")) {
      baseTransform = "scale(0.9) rotate(10deg)";
    } else if (gull.classList.contains("gull-d")) {
      baseTransform = "scale(1.04) rotate(-10deg)";
    } else if (gull.classList.contains("gull-e")) {
      baseTransform = "scale(0.86) rotate(8deg)";
    }

    const scrollOffset = window.scrollY * 0.02;
    gull.style.transform = `${baseTransform} translate(${extraX}px, ${scrollOffset + extraY}px)`;
  });

  waveBands.forEach((band, index) => {
    const drift = Math.sin(floatTick * 0.7 + index) * 3;
    const scrollOffset = window.scrollY * (0.008 + index * 0.0015);
    band.style.transform = `translateY(${scrollOffset + drift}px)`;
  });

  stitchedLines.forEach((line, index) => {
    const drift = Math.cos(floatTick * 0.6 + index) * 2;
    const scrollOffset = window.scrollY * (0.012 + index * 0.0015);
    line.style.transform = `translateY(${scrollOffset + drift}px)`;
  });

  window.requestAnimationFrame(animateArtwork);
}

window.requestAnimationFrame(animateArtwork);
