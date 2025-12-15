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