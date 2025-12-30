document.addEventListener("DOMContentLoaded", () => {

  /* ===== LOAD HEADER ===== */
  fetch("partials/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("site-header").innerHTML = html;
      activateMenu();
      setupMobileMenu();
    });

  /* ===== ACTIVE MENU ===== */
  function activateMenu() {
    const currentPage =
      location.pathname.split("/").pop() || "index.html";

    document
      .querySelectorAll(".desktop-nav a, .mobile-menu a")
      .forEach(link => {
        if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
        }
      });
  }

  /* ===== MOBILE MENU ===== */
  function setupMobileMenu() {
    const toggle = document.querySelector(".mobile-toggle");
    const menu = document.getElementById("mobileMenu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* ===== STICKY HEADER ===== */
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
  });

  /* ===== SCROLL REVEAL ===== */
  const reveals = document.querySelectorAll(".reveal");
  function revealOnScroll() {
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 120) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

});
const cta = document.querySelector(".sticky-cta");

window.addEventListener("scroll", () => {
  if (window.scrollY > document.body.scrollHeight * 0.3) {
    cta.style.opacity = "1";
    cta.style.pointerEvents = "auto";
  } else {
    cta.style.opacity = "0";
    cta.style.pointerEvents = "none";
  }
});

