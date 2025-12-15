// Hero title animation
document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".hero-title");
  title.style.opacity = "0";
  title.style.transform = "translateY(30px)";

  setTimeout(() => {
    title.style.transition = "0.8s ease";
    title.style.opacity = "1";
    title.style.transform = "translateY(0)";
  }, 200);
});
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  nav.classList.toggle("scrolled", window.scrollY > 10);
});

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

document.querySelector(".demo-form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thank you! Our team will contact you shortly.");
  this.reset();
});
