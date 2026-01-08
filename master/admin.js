// Active menu highlight
document.querySelectorAll(".sidebar nav a").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".sidebar nav a").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  });
});

function openModal() {
  document.getElementById("companyModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("companyModal").style.display = "none";
}
function toggleCompanyMenu() {
  const menu = document.getElementById("companySubmenu");
  const arrow = document.getElementById("companyArrow");

  menu.style.display = menu.style.display === "block" ? "none" : "block";
  arrow.classList.toggle("rotate");
}
