const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");
const heroSlideshow = document.getElementById("heroSlideshow");
const recordWrap = document.getElementById("recordWrap");

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

/* slideshow supports jpg/JPG/jpeg/JPEG */
const slideshowCandidates = [];
for (let i = 1; i <= 10; i += 1) {
  slideshowCandidates.push(`assets/slideshow_${i}.jpg`);
  slideshowCandidates.push(`assets/slideshow_${i}.JPG`);
  slideshowCandidates.push(`assets/slideshow_${i}.jpeg`);
  slideshowCandidates.push(`assets/slideshow_${i}.JPEG`);
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
    const existing = results.filter(Boolean);
    return [...new Set(existing)];
  });
}

function buildSlideshow(slides) {
  if (!heroSlideshow || !slides.length) return;

  heroSlideshow.innerHTML = slides
    .map((src, index) => `
      <div class="hero-slide ${index === 0 ? "is-active" : ""}">
        <img src="${src}" alt="">
      </div>
    `)
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

/* header reveal */
window.addEventListener("scroll", () => {
  if (window.scrollY > 70) {
    document.body.classList.add("header-visible");
  } else {
    document.body.classList.remove("header-visible");
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
  { threshold: 0.16 }
);

revealElements.forEach((element) => revealObserver.observe(element));

/* album animation */
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
    { threshold: 0.35 }
  );

  recordObserver.observe(recordWrap);
}
