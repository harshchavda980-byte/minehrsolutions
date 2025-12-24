const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("navMenu");
const header = document.getElementById("siteHeader");

/* Mobile toggle */
toggle.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("show");
});

/* Close menu on outside click */
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove("show");
  }
});

/* Header shadow on scroll */
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

/* Scroll reveal animation */
const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      el.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
