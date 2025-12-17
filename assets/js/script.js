function toggleMenu(el) {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("active");

  el.classList.toggle("open");
}
