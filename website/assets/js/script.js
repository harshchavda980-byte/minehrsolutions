/* =============================================
   SCRIPT.JS - INDEX.HTML JAVASCRIPT
   Contains common functions + index-specific code
============================================= */

/* ===== LOAD HEADER & FOOTER ===== */
fetch("partials/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    // ✅ HIDE HOME LINK ON HOME PAGE
    hideHomeLinkOnHomePage();

    // ✅ SET ACTIVE NAV AFTER HEADER LOAD
    setActiveNav();

    // ✅ ADD GET STARTED BUTTON LISTENERS
    addGetStartedListeners();
  });

fetch("partials/footer-index.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

/* ===== MOBILE MENU ===== */
function toggleMenu(toggle) {
  const menu = document.getElementById("mobileMenu");
  if (!menu) return;
  menu.classList.toggle("open");
  toggle.classList.toggle("open");
}

/* ===== REVEAL ON SCROLL ===== */
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* ===== ACTIVE NAV LINK ===== */
function setActiveNav() {
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  // Desktop links
  document.querySelectorAll(".desktop-nav a").forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  // Mobile links
  document.querySelectorAll(".mobile-menu a").forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

/* ===== HIDE HOME LINK ON HOME PAGE ===== */
function hideHomeLinkOnHomePage() {
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  if (currentPage === "index.html") {
    // Desktop Home link
    document
      .querySelectorAll('.desktop-nav a[href="index.html"]')
      .forEach(link => link.remove());

    // Mobile Home link
    document
      .querySelectorAll('.mobile-menu a[href="index.html"]')
      .forEach(link => link.remove());
  }
}

/* ===== GET STARTED BUTTON LISTENERS ===== */
function addGetStartedListeners() {
  // Header "Get Started" button
  document.querySelectorAll(".demo-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = "contact.html";
    });
  });
}

/* =============================================
   INDEX.HTML SPECIFIC CODE
============================================= */

/* ===== INTRO SPLASH HIDE ===== */
window.addEventListener("load", () => {
  const splash = document.getElementById("intro-splash");
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = "0";
      splash.style.visibility = "hidden";
    }, 1500);
  }

  // ✅ ADD LISTENERS FOR HERO BUTTONS
  document.querySelectorAll(".btn.primary").forEach(btn => {
    if (btn.textContent.includes("Request Demo")) {
      btn.addEventListener("click", () => {
        window.location.href = "contact.html";
      });
    }
  });

  // ✅ ADD LISTENER FOR CTA BUTTON
  document.querySelectorAll(".cta .btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = "contact.html";
    });
  });
});