function toggleMenu(el) {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("active");

  el.classList.toggle("open");
}
window.addEventListener("scroll", function () {
  const header = document.getElementById("siteHeader");

  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
<script>
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("active");
}

/* STICKY HEADER SHADOW */
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  header.classList.toggle("scrolled", window.scrollY > 10);
});

/* ACTIVE MENU ON SCROLL */
const sections = document.querySelectorAll("section, footer");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
</script>
