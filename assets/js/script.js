// Simple fade-in animation on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".feature-card").forEach(card => {
  card.style.opacity = 0;
  card.style.transform = "translateY(20px)";
  card.style.transition = "0.6s ease";
  observer.observe(card);
});
