// Active menu highlight
document.querySelectorAll(".sidebar nav a").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".sidebar nav a").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  });
});
