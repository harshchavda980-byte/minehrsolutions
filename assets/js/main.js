/* ================= MOBILE MENU ================= */
function toggleMenu(el) {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("active");
  el.classList.toggle("open");
  document.body.classList.toggle("menu-open");
}

/* CLOSE MOBILE MENU ON CLICK */
document.addEventListener("click", e => {
  if (e.target.closest(".mobile-menu a")) {
    document.getElementById("mobileMenu").classList.remove("active");
    document.querySelector(".mobile-toggle").classList.remove("open");
    document.body.classList.remove("menu-open");
  }
});

/* ================= STICKY HEADER ================= */
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 20);
});

/* ================= ACTIVE MENU ================= */
const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".desktop-nav a, .mobile-menu a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

/* ================= SCROLL REVEAL ================= */
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const height = window.innerHeight;
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < height - 120) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
