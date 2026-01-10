// PAGE LOADER
function showLoader() {
  document.getElementById("pageLoader").style.display = "block";
}

function hideLoader() {
  document.getElementById("pageLoader").style.display = "none";
}

// LOAD PAGE CONTENT
function loadPage(page) {
  showLoader();

  setTimeout(() => {
    const content = document.getElementById("contentArea");

    content.innerHTML = `
      <div class="page-title">
        <h1>${page.replace("-", " ").toUpperCase()}</h1>
        <p>This section will be implemented next.</p>
      </div>
      <div class="panel">
        <p>UI ready for ${page} module.</p>
      </div>
    `;

    document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
    hideLoader();
  }, 700);
}

// DROPDOWN TOGGLE
document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const parent = toggle.closest(".has-dropdown");

    document.querySelectorAll(".has-dropdown").forEach(item => {
      if (item !== parent) item.classList.remove("open");
    });

    parent.classList.toggle("open");
  });
});
// BAR CHART DATA
function renderEmployeeChart() {
  const data = [40, 55, 70, 90, 120, 150];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const chart = document.getElementById("employeeChart");

  if (!chart) return;

  chart.innerHTML = "";

  data.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.setProperty("--h", value + "px");

    const label = document.createElement("span");
    label.innerText = labels[index];

    bar.appendChild(label);
    chart.appendChild(bar);
  });
}

// Run on load
window.addEventListener("load", renderEmployeeChart);

// DARK MODE TOGGLE
function toggleTheme() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// Load saved theme
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
});
// SIDEBAR TOGGLE
function toggleSidebar() {
  document.body.classList.toggle("sidebar-collapsed");

  if (document.body.classList.contains("sidebar-collapsed")) {
    localStorage.setItem("sidebar", "collapsed");
  } else {
    localStorage.setItem("sidebar", "expanded");
  }
}

// Load saved state
window.addEventListener("load", () => {
  if (localStorage.getItem("sidebar") === "collapsed") {
    document.body.classList.add("sidebar-collapsed");
  }
});
function toggleSidebar() {
  if (window.innerWidth < 768) {
    document.body.classList.toggle("sidebar-open");
  } else {
    document.body.classList.toggle("sidebar-collapsed");
  }
}

