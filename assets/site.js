const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");
const recordWrap = document.getElementById("recordWrap");
const heroSlideshow = document.getElementById("heroSlideshow");

function openMenu() {
  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuOverlay.classList.add("active");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuOverlay.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

if (menuToggle) menuToggle.addEventListener("click", openMenu);
if (menuClose) menuClose.addEventListener("click", closeMenu);
if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* hero slideshow: looks for slideshow_1.jpg ... slideshow_10.jpg */
const slideshowImages = [];
for (let i = 1; i <= 10; i += 1) {
  slideshowImages.push(`assets/slideshow_${i}.jpg`);
}

let validSlides = [];
let activeSlideIndex = 0;
let slideshowInterval = null;

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
  ).then((results) => results.filter(Boolean));
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

  if (slides.length <= 1) return;

  slideshowInterval = setInterval(() => {
    slideEls[activeSlideIndex].classList.remove("is-active");
    activeSlideIndex = (activeSlideIndex + 1) % slideEls.length;
    slideEls[activeSlideIndex].classList.add("is-active");
  }, 4200);
}

preloadExistingSlides(slideshowImages).then((slides) => {
  validSlides = slides;
  buildSlideshow(validSlides);
});

/* header + title dock on scroll */
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (scrollY > 70) {
    document.body.classList.add("header-visible");
  } else {
    document.body.classList.remove("header-visible");
  }

  if (scrollY > 120) {
    document.body.classList.add("hero-docked");
  } else {
    document.body.classList.remove("hero-docked");
  }
});

/* reveal animations */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

/* record animation */
if (recordWrap) {
  const scene = recordWrap.querySelector(".record-scene");

  const recordObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && scene) {
          scene.classList.add("in-view");
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  recordObserver.observe(recordWrap);
}
