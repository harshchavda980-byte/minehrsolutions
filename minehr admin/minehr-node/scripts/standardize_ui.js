const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

const filesToStandardize = [
    'users-create.html', 'settings.html', 'roles.html', 'role-create.html', 'reports.html',
    'operations-tickets.html', 'operations-feedback.html', 'operations-escalations.html',
    'onboarding.html', 'index.html', 'geo-state.html', 'geo-country.html', 'geo-city.html',
    'engagement.html', 'devices.html', 'crm-leads.html', 'crm-demo.html', 'companies-requests.html',
    'companies-plans.html', 'companies-employees.html', 'companies-create.html',
    'companies-activity.html', 'backup.html', 'automation-whatsapp.html', 'automation-sms.html',
    'automation-gmail.html', 'ats.html', 'companies-analytics.html', 'companies.html', 'dashboard.html',
    'users.html', 'activities.html', 'app-usage.html', 'companies-employee-limit.html',
    'companies-my.html', 'companies-pending.html', 'companies-requests-created.html',
    'companies-requests-new.html', 'operations-tickets-create.html'
];

const standardizedAside = `        <aside class="sidebar">
            <div class="brand">
                <img src="logo.png" alt="MineHR Logo" class="brand-logo" />
            </div>
            <nav id="sidebarNav">
                <!-- Sidebar content injected by sidebar.js -->
            </nav>
        </aside>`;

const standardizedHeader = `            <header class="topbar">
                <div class="topbar-left">
                    <div class="sidebar-toggle" onclick="toggleSidebar()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </div>
                    <a href="dashboard.html" class="topbar-logo">
                        <img src="logo.png" alt="MineHR Logo" />
                    </a>
                    <div class="search-box">
                        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Search operations, companies..." />
                        <span class="search-key">/</span>
                    </div>
                </div>
                <div class="topbar-right">
                    <div class="theme-toggle" onclick="toggleTheme()">
                        <span class="sun">☀️</span>
                        <span class="moon">🌙</span>
                        <div class="toggle-ball"></div>
                    </div>
                    <div class="profile" id="profileDropdown">
                        <div class="profile-trigger" onclick="toggleProfileMenu()">
                            <div style="text-align: right; display: flex; flex-direction: column;">
                                <span id="userName" style="font-size: 14px; font-weight: 600;">Admin</span>
                                <span id="userRole" style="font-size: 11px; color: var(--text-muted);">Super Admin</span>
                            </div>
                            <img id="userAvatar" src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff" alt="Admin"
                                style="width: 42px; height: 42px; border-radius: 14px; border: 2px solid var(--glass-border);" />
                        </div>
                        <div class="profile-menu">
                            <div class="profile-info">
                                <strong id="profileMenuName">Admin</strong>
                                <p id="profileMenuEmail">admin@minehr.com</p>
                            </div>
                            <a href="settings.html" class="profile-menu-item">Settings</a>
                            <button class="profile-menu-item" onclick="window.location.reload()">Refresh Page</button>
                            <div class="profile-divider"></div>
                            <button id="logoutBtn" class="profile-menu-item danger">Logout System</button>
                        </div>
                    </div>
                </div>
            </header>`;

filesToStandardize.forEach(file => {
    const filePath = path.join(publicDir, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace <aside> block
    content = content.replace(/<aside class="sidebar">[\s\S]*?<\/aside>/i, standardizedAside);

    // Replace <header> block
    content = content.replace(/<header class="topbar">[\s\S]*?<\/header>/i, standardizedHeader);

    // Ensure scripts are included
    if (!content.includes('<script src="js/sidebar.js"></script>')) {
        content = content.replace('</body>', '    <script src="js/sidebar.js"></script>\n</body>');
    }
    if (!content.includes('<script src="js/admin.js"></script>')) {
        content = content.replace('</body>', '    <script src="js/admin.js"></script>\n</body>');
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
});
