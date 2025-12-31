/* ===== LOAD HEADER & FOOTER ===== */
fetch("partials/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  });

fetch("partials/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

/* ===== MOBILE MENU ===== */
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  }
}

/* ===== REVEAL ON SCROLL ===== */
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
