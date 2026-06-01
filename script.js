// ---------- Плавный скролл (Lenis) ----------
let lenis = null;
if (window.Lenis) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  const raf = (t) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// плавный переход по якорным ссылкам меню
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href === "#") { e.preventDefault(); return; } // плитка-заглушка без ссылки
    if (href.length <= 1) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -40 });
    else target.scrollIntoView({ behavior: "smooth" });
  });
});

// ---------- Reveal при скролле ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---------- Highlight services on scroll (touch only) ----------
if (window.matchMedia("(hover: none)").matches) {
  const svcObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-highlighted");
          svcObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".svc__item").forEach((item) => svcObs.observe(item));
}

// ---------- Активный пункт меню (scroll-spy) ----------
const navLinks = [...document.querySelectorAll('.nav__links a[href^="#"]')];
const sections = ["info", "work", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function updateActive() {
  const mid = window.scrollY + window.innerHeight / 2;
  // активен последний раздел, чью верхнюю границу прошёл центр экрана
  // (секция services без пункта меню засчитывается в «Información»)
  let current = null;
  sections.forEach((sec) => {
    if (mid >= sec.offsetTop) current = sec.id;
  });
  navLinks.forEach((l) =>
    l.classList.toggle("is-active", l.getAttribute("href") === "#" + current)
  );
}

if (lenis) lenis.on("scroll", updateActive);
else window.addEventListener("scroll", updateActive, { passive: true });
updateActive();

// ---------- Переключение языка ES / EN ----------
const langBtn = document.getElementById("langBtn");
const i18nNodes = document.querySelectorAll("[data-es], [data-en]");

function setLang(lang) {
  i18nNodes.forEach((el) => {
    const val = el.dataset[lang];
    if (val != null) el.innerHTML = val;
  });
  document.documentElement.lang = lang;
  langBtn.querySelectorAll(".lang__opt").forEach((opt) => {
    opt.classList.toggle("is-active", opt.dataset.lang === lang);
  });
}

langBtn.addEventListener("click", () => {
  setLang(document.documentElement.lang === "es" ? "en" : "es");
});
