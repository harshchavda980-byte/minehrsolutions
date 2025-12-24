const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("navMenu");
const header = document.getElementById("siteHeader");

/* Toggle menu */
toggle.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("show");
});

/* Click outside to close */
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove("show");
  }
});

/* Sticky shadow on scroll */
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
