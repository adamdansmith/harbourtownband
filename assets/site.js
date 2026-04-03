const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");
const heroSlideshow = document.getElementById("heroSlideshow");
const buttons = document.querySelectorAll(".button");
const revealElements = document.querySelectorAll(".reveal");

const hero = document.querySelector(".hero");
const heroCopy = document.querySelector(".hero-copy");
const heroSlideshowEl = document.querySelector(".hero-slideshow");

/* mobile menu */

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

/* slideshow */

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
  ).then((results) => [...new Set(results.filter(Boolean))]);
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

/* header */

function updateHeaderState() {
  if (window.scrollY > 70) {
    document.body.classList.add("header-solid");
  } else {
    document.body.classList.remove("header-solid");
  }
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

/* reveal */

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

/* button magnetic effect */

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

/* subtle hero parallax */

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
