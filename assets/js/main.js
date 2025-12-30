/* ================= MOBILE MENU ================= */
function toggleMenu(el) {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("active");
  el.classList.toggle("open");
  document.body.classList.toggle("menu-open");
}

/* CLOSE MENU ON LINK CLICK */
document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.remove("active");
    document.querySelector(".mobile-toggle").classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

/* ================= STICKY HEADER ================= */
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  header.classList.toggle("scrolled", window.scrollY > 20);
});

/* ================= AUTO ACTIVE MENU ================= */
const currentPage = location.pathname.split("/").pop();

document.querySelectorAll(".desktop-nav a, .mobile-menu a").forEach(link => {
  const linkPage = link.getAttribute("href");
  if (linkPage === currentPage || linkPage === "") {
    link.classList.add("active");
  }
});

/* ================= SCROLL REVEAL ================= */
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < windowHeight - 120) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
