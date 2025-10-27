// ------------------------
// Preloader - remove on load
// ------------------------
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  if (!pre) return;
  pre.style.opacity = "0";
  setTimeout(() => pre.remove(), 600);
});

// ------------------------
// Theme toggle (two toggles for responsive navbar)
// ------------------------
const toggles = document.querySelectorAll("#theme-toggle, #theme-toggle-2");
toggles.forEach((btn) => {
  btn?.addEventListener("click", () => {
    const on = document.body.classList.toggle("dark-mode");
    toggles.forEach((b) => (b.textContent = on ? "☀️" : "🌙"));
    toggles.forEach((b) => b.setAttribute("aria-pressed", on));
  });
});

// ------------------------
// Scroll reveal for feature boxes + skills
// ------------------------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.18 }
);

document
  .querySelectorAll(".feature-box, .skill, .gallery-card")
  .forEach((el) => observer.observe(el));

// ------------------------
// Animated counters
// ------------------------
const counters = document.querySelectorAll(".count");
let countersStarted = false;
function startCounters() {
  if (countersStarted) return;
  const top =
    document.getElementById("skills").offsetTop - window.innerHeight + 150;
  if (window.scrollY >= top) {
    countersStarted = true;
    counters.forEach((c) => {
      const target = +c.dataset.target;
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 60));
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          c.textContent = target;
          clearInterval(timer);
        } else c.textContent = current;
      }, 15);
    });
  }
}
window.addEventListener("scroll", startCounters);
startCounters();

// ------------------------
// Skills bars animate when visible
// ------------------------
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector(".fill");
        if (fill)
          fill.style.width = fill.style.getPropertyValue("--level") || "80%";
        e.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.25 }
);

document.querySelectorAll(".skill").forEach((s) => skillObserver.observe(s));

// ------------------------
// Typing effect for hero
// ------------------------
const heroWords = [
  "Built with Bootstrap 5",
  "Powered by SASS",
  "Designed with ❤️ for learning",
];
let hi = 0,
  hj = 0,
  isDeleting = false;
const typedEl = document.querySelector(".typed-text");

function typeLoop() {
  if (!typedEl) return;
  const word = heroWords[hi];
  typedEl.textContent = word.substring(0, hj);
  if (!isDeleting && hj < word.length) hj++;
  else if (isDeleting && hj > 0) hj--;
  else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(typeLoop, 1000);
      return;
    } else {
      isDeleting = false;
      hi = (hi + 1) % heroWords.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 40 : 100);
}
typeLoop();

// ------------------------
// Hero chips: when clicked, scroll to #details and inject content
// ------------------------
const chips = document.querySelectorAll(".btn-chip");
const detailsContent = document.getElementById("details-content");

const featureMap = {
  "feature-1": {
    title: "Responsive Grid — Deep Dive",
    body: "<p>The Bootstrap grid is a 12-column system that adapts to screen sizes. Use <code>.row</code> and <code>.col-*</code> classes to arrange content. Mix column sizes for layouts that respond gracefully to mobile, tablet, and desktop.</p>",
    img: "images/gallery1.jpg",
  },
  "feature-2": {
    title: "SASS Power & Theming",
    body: "<p>SASS adds variables, mixins, and nesting to CSS. Override Bootstrap's variables (colors, spacing) in your <code>style.scss</code> before importing Bootstrap to customize the entire framework.</p>",
    img: "images/gallery2.jpg",
  },
  "feature-3": {
    title: "Interactive UI & Accessibility",
    body: "<p>Create better UIs with small JS interactions: typed text, scroll reveals, accessible modals, keyboard focus states, and progressive enhancement so the site works without JS too.</p>",
    img: "images/gallery3.jpg",
  },
};

chips.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const key = btn.dataset.target;
    const data = featureMap[key];
    if (!data || !detailsContent) return;

    // inject content
    detailsContent.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.body}</p>
      <img class="detail-image" src="${data.img}" alt="${data.title}">
    `;

    // smooth scroll to details
    document
      .getElementById("details")
      .scrollIntoView({ behavior: "smooth", block: "start" });

    // set focus for accessibility
    setTimeout(() => detailsContent.querySelector("h3")?.focus(), 700);
  });
});

// Also allow hero title click to show a summary and scroll:
document.querySelector(".hero-title")?.addEventListener("click", () => {
  detailsContent.innerHTML = `
    <h3>About this Project</h3>
    <p>This showcase demonstrates Bootstrap + SASS techniques, animations, a polished hero and interactive elements. Click any chip above to load feature-specific content here.</p>
  `;
  document
    .getElementById("details")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});

// ------------------------
// Gallery lightbox (simple accessible modal)
// ------------------------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");

document.querySelectorAll(".gallery-card").forEach((card) => {
  card.addEventListener("click", () => {
    const src = card.dataset.src || card.querySelector("img")?.src;
    if (!src) return;
    lightboxImg.src = src;
    lightbox.style.display = "flex";
    lightbox.removeAttribute("aria-hidden");
    lightboxClose.focus();
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") card.click();
  });
});

lightboxClose?.addEventListener("click", () => {
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");
});
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
  }
});

// ------------------------
// Contact form: basic validation + faux submit + toast
// ------------------------
const form = document.getElementById("contact-form");
const toast = document.getElementById("toast");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    if (!name || !email || !message)
      return showToast("Please fill all fields.");

    // show loading-ish state
    const btn = form.querySelector("button[type='submit']");
    const old = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending...";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = old;
      form.reset();
      showToast("Message sent! Thanks — this is a demo response.");
    }, 1000);
  });
}

function showToast(txt = "") {
  if (!toast) return;
  toast.textContent = txt;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 10);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => (toast.style.display = "none"), 300);
  }, 2800);
}

// ------------------------
// Scroll to top button
// ------------------------
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) toTop.style.display = "block";
  else toTop.style.display = "none";
});
toTop?.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ------------------------
// Parallax subtle effect for hero overlay on scroll
// ------------------------
const heroOverlay = document.querySelector(".hero .overlay");
window.addEventListener("scroll", () => {
  if (!heroOverlay) return;
  const scrolled = window.scrollY / 6;
  heroOverlay.style.transform = `translateY(${scrolled}px) scale(1.03)`;
});

// ------------------------
// Active nav link highlight (scrollspy-lite)
// ------------------------
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
function onScrollSpy() {
  const scrollPos = window.scrollY + 120;
  let current = sections[0];
  for (const sec of sections) {
    if (sec.offsetTop <= scrollPos) current = sec;
  }
  navLinks.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === `#${current?.id}`)
  );
}
window.addEventListener("scroll", onScrollSpy);
onScrollSpy();

// ------------------------
// Keyboard accessibility improvements for chip buttons
// ------------------------
chips.forEach((ch) => {
  ch.setAttribute("role", "button");
  ch.tabIndex = 0;
  ch.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") ch.click();
  });
});
