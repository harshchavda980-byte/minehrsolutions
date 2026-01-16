// PAGE LOADER
function showLoader() {
  document.getElementById("pageLoader").classList.add("active");
}

function hideLoader() {
  document.getElementById("pageLoader").classList.remove("active");
}

// LOAD PAGE CONTENT
function loadPage(page, event) {
  if (event) {
    event.preventDefault();
  }
  
  showLoader();

  setTimeout(() => {
    const content = document.getElementById("contentArea");

    content.innerHTML = `
      <div class="page-title">
        <h1>${page.replace(/-/g, " ").toUpperCase()}</h1>
        <p>This section will be implemented next.</p>
      </div>
      <div class="panel">
        <p>UI ready for ${page} module.</p>
      </div>
    `;

    document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
    if (event && event.target) {
      event.target.classList.add("active");
    }
    
    // Close sidebar on mobile after selecting
    if (window.innerWidth < 768) {
      document.body.classList.remove("sidebar-open");
    }
    
    hideLoader();
  }, 700);
}

// DROPDOWN TOGGLE
function toggleDropdown(element) {
  const parent = element.closest(".has-dropdown");
  
  // Close all other dropdowns first
  document.querySelectorAll(".has-dropdown").forEach(dropdown => {
    if (dropdown !== parent) {
      dropdown.classList.remove("open");
    }
  });
  
  // Toggle the clicked dropdown
  parent.classList.toggle("open");
}

// Initialize dropdown listeners
document.addEventListener("DOMContentLoaded", () => {
  // Add click listeners to all dropdown toggles
  document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
    toggle.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(this);
    });
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

// DARK MODE TOGGLE
function toggleTheme() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// SIDEBAR TOGGLE - FIXED
function toggleSidebar() {
  if (window.innerWidth < 768) {
    document.body.classList.toggle("sidebar-open");
  } else {
    document.body.classList.toggle("sidebar-collapsed");
    
    if (document.body.classList.contains("sidebar-collapsed")) {
      localStorage.setItem("sidebar", "collapsed");
    } else {
      localStorage.setItem("sidebar", "expanded");
    }
  }
}

// Load saved preferences
window.addEventListener("load", () => {
  // Load theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
  
  // Load sidebar state (desktop only)
  if (window.innerWidth >= 768 && localStorage.getItem("sidebar") === "collapsed") {
    document.body.classList.add("sidebar-collapsed");
  }
  
  // Render chart
  renderEmployeeChart();
});

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    document.body.classList.remove("sidebar-open");
  }
});