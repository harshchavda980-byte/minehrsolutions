console.log("Mine-HR loaded successfully");
// Smooth reveal on scroll (optional later)
document.addEventListener("scroll", () => {
  document.querySelectorAll(".fade-in").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.style.opacity = 1;
    }
  });
});
