/* ================= HERO SAFE ANIMATION ================= */
document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".hero-title");

  if (title) {
    title.style.opacity = "0";
    title.style.transform = "translateY(30px)";

    setTimeout(() => {
      title.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      title.style.opacity = "1";
      title.style.transform = "translateY(0)";
    }, 200);
  }
});

/* ================= HEADER SHADOW ON SCROLL ================= */
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 10);
});

/* ================= REVEAL ON SCROLL ================= */
const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 100) {
      el.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* ================= DEMO FORM ================= */
const demoForm = document.querySelector(".demo-form");
if (demoForm) {
  demoForm.addEventListener("submit", e => {
    e.preventDefault();
    alert("Thank you! Our team will contact you shortly.");
    demoForm.reset();
  });
}