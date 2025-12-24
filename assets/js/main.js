/* ================= MOBILE MENU TOGGLE ================= */
function toggleMenu(el) {
  const menu = document.getElementById("mobileMenu");

  if (!menu) return;

  menu.classList.toggle("active");
  el.classList.toggle("open");
}

/* ================= STICKY HEADER ================= */
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* ================= CLOSE MOBILE MENU ON LINK CLICK ================= */
document.querySelectorAll(".mobile-menu a, .mobile-menu button").forEach(item => {
  item.addEventListener("click", () => {
    const menu = document.getElementById("mobileMenu");
    const toggle = document.querySelector(".mobile-toggle");

    if (menu) menu.classList.remove("active");
    if (toggle) toggle.classList.remove("open");
  });
});

/* ================= SMOOTH SCROLL WITH OFFSET ================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();

    const headerOffset = 90;
    const offsetPosition = target.offsetTop - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  });
});

/* ================= INTRO SPLASH (ONLY IF EXISTS) ================= */
window.addEventListener("load", () => {
  const splash = document.getElementById("intro-splash");
  if (!splash) return;

  setTimeout(() => {
    splash.classList.add("hide");
  }, 1800);
});

/* ================= SCROLL REVEAL ================= */
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 120;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
