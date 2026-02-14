// ===== FIREBASE AUTHENTICATION =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCmgWJY67GEiJFZgVFOdy5loBRvZ1-yQY",
  authDomain: "my-website-backend-62788.firebaseapp.com",
  projectId: "my-website-backend-62788",
  appId: "1:799302822506:web:654449e7b3432685bdf813"
};

let app, auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  alert("System initialization failed. Please refresh the page.");
}

// Protect page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    setTimeout(() => window.location.href = "login.html", 100);
  }
}, (error) => {
  console.error("Auth error:", error);
});

// Logout function
window.logout = async function() {
  try {
    showLoader();
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Logout failed. Please try again.");
    hideLoader();
  }
}

// ===== PAGE LOADER =====
function showLoader() {
  const loader = document.getElementById("pageLoader");
  if (loader) loader.classList.add("active");
}

function hideLoader() {
  const loader = document.getElementById("pageLoader");
  if (loader) loader.classList.remove("active");
}

// ===== VALID PAGES =====
const VALID_PAGES = [
  'dashboard', 'manage-user', 'add-user', 'admins-roles', 'app-usage',
  'companies', 'company-requests', 'plans-expire', 'employee-count', 
  'recent-activity', 'add-new-company', 'new-company-request', 
  'created-company', 'rejected-company', 'my-company', 'tickets', 
  'escalations', 'feedback', 'leads', 'demo-requests', 'xyz-reports',
  'city', 'state', 'country', 'ats', 'whatsapp', 'gmail', 'sms',
  'onboarding-process', 'engagement-process', 'manage-device', 'settings'
];

// ===== SANITIZE HTML =====
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// ===== CREATE PAGE CONTENT =====
function createPageContent(page) {
  const container = document.createElement('div');
  
  if (page === 'dashboard') {
    container.innerHTML = `
      <div class="page-title">
        <h1>Dashboard</h1>
        <p>Overview of MineHR internal operations</p>
      </div>

      <div class="cards">
        <div class="card purple">
          <h3>Total Companies</h3>
          <p>48</p>
        </div>
        <div class="card blue">
          <h3>Total Employees</h3>
          <p>1,260</p>
        </div>
        <div class="card green">
          <h3>Active Clients</h3>
          <p>42</p>
        </div>
        <div class="card orange">
          <h3>Pending Tasks</h3>
          <p>7</p>
        </div>
      </div>

      <div class="panel">
        <h2>System Status</h2>
        <p>All services are running smoothly.</p>
      </div>

      <div class="analytics-grid">
        <div class="panel chart-box">
          <h3>Employee Growth</h3>
          <div class="bar-chart" id="employeeChart"></div>
        </div>

        <div class="panel chart-box">
          <h3>Company Status</h3>
          <div class="donut-chart">
            <svg viewBox="0 0 36 36">
              <path class="donut-bg"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="donut-fill"
                stroke-dasharray="75, 25"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="donut-text">
              <strong>75%</strong>
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    const pageName = page
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const sanitizedPageName = sanitizeHTML(pageName);
    
    container.innerHTML = `
      <div class="page-title">
        <h1>${sanitizedPageName}</h1>
        <p>Manage and view ${sanitizedPageName.toLowerCase()} information</p>
      </div>
      <div class="panel">
        <h2>${sanitizedPageName}</h2>
        <p>This section will be implemented next. UI is ready for the ${sanitizedPageName} module.</p>
      </div>
    `;
  }
  
  return container;
}

// ===== LOAD PAGE =====
function loadPage(page, event) {
  if (event) event.preventDefault();
  
  if (!VALID_PAGES.includes(page)) {
    console.error(`Invalid page: ${page}`);
    return;
  }
  
  showLoader();

  setTimeout(() => {
    try {
      const content = document.getElementById("contentArea");
      if (!content) throw new Error("Content area not found");

      content.innerHTML = '';
      content.appendChild(createPageContent(page));

      // Update active states
      document.querySelectorAll(".menu-item, .submenu a").forEach(i => i.classList.remove("active"));
      if (event && event.target) event.target.classList.add("active");
      
      // Close sidebar on mobile
      if (window.innerWidth < 768) {
        document.body.classList.remove("sidebar-open");
        document.body.style.overflow = "";
      }
      
      // Render chart for dashboard
      if (page === 'dashboard') {
        setTimeout(renderEmployeeChart, 100);
      }
      
    } catch (error) {
      console.error("Error loading page:", error);
      const content = document.getElementById("contentArea");
      if (content) {
        content.innerHTML = `
          <div class="panel">
            <h2>Error</h2>
            <p>Failed to load page. Please try again.</p>
          </div>
        `;
      }
    } finally {
      hideLoader();
    }
  }, 700);
}

window.loadPage = loadPage;

// ===== DROPDOWN TOGGLE =====
function toggleDropdown(element) {
  const parent = element.closest(".has-dropdown");
  if (!parent) return;
  
  document.querySelectorAll(".has-dropdown").forEach(dropdown => {
    if (dropdown !== parent) dropdown.classList.remove("open");
  });
  
  parent.classList.toggle("open");
}

// ===== BAR CHART =====
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
    label.textContent = labels[index];

    bar.appendChild(label);
    chart.appendChild(bar);
  });
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  try {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  } catch (error) {
    console.error("Theme toggle error:", error);
  }
}

window.toggleTheme = toggleTheme;

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
  try {
    if (window.innerWidth < 768) {
      document.body.classList.toggle("sidebar-open");
      document.body.style.overflow = document.body.classList.contains("sidebar-open") ? "hidden" : "";
    } else {
      document.body.classList.toggle("sidebar-collapsed");
      const state = document.body.classList.contains("sidebar-collapsed") ? "collapsed" : "expanded";
      localStorage.setItem("sidebar", state);
    }
  } catch (error) {
    console.error("Sidebar toggle error:", error);
  }
}

window.toggleSidebar = toggleSidebar;

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
  // Dropdown toggles
  document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
    toggle.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(this);
    });
  });

  // Close sidebar on mobile when clicking outside
  document.addEventListener("click", (e) => {
    if (window.innerWidth < 768 && document.body.classList.contains("sidebar-open")) {
      const sidebar = document.querySelector(".sidebar");
      const toggle = document.querySelector(".sidebar-toggle");
      
      if (sidebar && toggle && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        document.body.classList.remove("sidebar-open");
        document.body.style.overflow = "";
      }
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    }
  });
}

// ===== LOAD PREFERENCES =====
function loadSavedPreferences() {
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.body.classList.add("dark");
    
    if (window.innerWidth >= 768 && localStorage.getItem("sidebar") === "collapsed") {
      document.body.classList.add("sidebar-collapsed");
    }
  } catch (error) {
    console.error("Error loading preferences:", error);
  }
}

// ===== INITIALIZE =====
window.addEventListener("load", () => {
  try {
    loadSavedPreferences();
    initializeEventListeners();
    renderEmployeeChart();
  } catch (error) {
    console.error("Initialization error:", error);
  }
});