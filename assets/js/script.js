// Header shadow
window.addEventListener("scroll", () => {
  document.querySelector(".header")
    .classList.toggle("scrolled", window.scrollY > 10);

  document.querySelector(".whatsapp-btn").style.display =
    window.scrollY > 300 ? "block" : "none";
});

// Mobile menu
document.querySelector(".menu-toggle")
  .addEventListener("click", () => {
    document.querySelector(".mobile-nav")
      .classList.toggle("open");
  });

// Reveal animation
document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".hero-title");
  if (!title) return;

  title.style.opacity = "0";
  title.style.transform = "translateY(30px)";

  setTimeout(() => {
    title.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    title.style.opacity = "1";
    title.style.transform = "translateY(0)";
  }, 200);
});