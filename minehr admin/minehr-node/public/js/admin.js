// --- THEME SYSTEM ---

function setTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  }
}

// Global Search Shortcut
document.addEventListener('keydown', function (e) {
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    document.querySelector('.search-box input')?.focus();
  }
});

function toggleTheme() {
  const isLight = document.documentElement.classList.contains('light');
  setTheme(isLight ? 'dark' : 'light');
}

// Automatic Theme based on Time
function applyTimeBasedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
    return;
  }

  const hour = new Date().getHours();
  // Default to dark at night (7 PM to 6 AM)
  if (hour >= 19 || hour < 6) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

// Highlight Active Menu Item
function highlightActiveMenu() {
  const currentPath = window.location.pathname.substring(1).replace('.html', '') || 'dashboard';

  document.querySelectorAll('.menu-item, .submenu a').forEach(link => {
    let href = link.getAttribute('href');
    if (!href) return;

    // Normalize href for comparison
    const normalizedHref = href.replace('.html', '');

    if (normalizedHref === currentPath || (currentPath.startsWith(normalizedHref) && normalizedHref !== 'dashboard')) {
      link.classList.add('active');
      // If it's in a submenu, open the parent
      const submenu = link.closest('.submenu');
      if (submenu) {
        submenu.parentElement.classList.add('open');
        submenu.parentElement.querySelector('.menu-item').classList.add('active');
      }
    }
  });
}

// Initialize on Load
// applyTimeBasedTheme(); // Handled by theme-init.js in <head>
highlightActiveMenu();


// --- SIDEBAR SYSTEM ---

const sidebarNav = document.querySelector('.sidebar nav');

function toggleSidebar() {
  if (window.innerWidth <= 768) {
    document.body.classList.toggle('sidebar-mobile-active');
  } else {
    document.body.classList.toggle('sidebar-collapsed');
    const isCollapsed = document.body.classList.contains('sidebar-collapsed');
    localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
  }
}

// Close mobile sidebar on overlay click
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 &&
    document.body.classList.contains('sidebar-mobile-active') &&
    !e.target.closest('.sidebar') &&
    !e.target.closest('.sidebar-toggle')) {
    document.body.classList.remove('sidebar-mobile-active');
  }
});

// Restore State & Scroll
(function () {
  const state = localStorage.getItem('sidebarState');
  if (state === 'collapsed') {
    document.body.classList.add('sidebar-collapsed');
  }

  // Restore Scroll
  const savedScroll = localStorage.getItem('sidebarScroll');
  if (savedScroll && sidebarNav) {
    sidebarNav.scrollTop = parseInt(savedScroll);
  }
})();

// Save scroll position on interaction
if (sidebarNav) {
  sidebarNav.addEventListener('scroll', () => {
    localStorage.setItem('sidebarScroll', sidebarNav.scrollTop);
  });
}


// --- DROPDOWNs ---

document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', function () {
    const parent = this.closest('.has-dropdown');
    const siblingDropdowns = parent.parentElement.querySelectorAll('.has-dropdown');

    siblingDropdowns.forEach(other => {
      if (other !== parent) other.classList.remove('open');
    });

    parent.classList.toggle('open');
  });
});


// --- PROFILE MENU ---

function toggleProfileMenu() {
  document.getElementById('profileDropdown')?.classList.toggle('active');
}

window.addEventListener('click', function (e) {
  if (!e.target.closest('.profile')) {
    document.getElementById('profileDropdown')?.classList.remove('active');
  }
});

// Global Logout Handler
document.addEventListener('click', async (e) => {
    if (e.target.closest('#logoutBtn')) {
        const confirmLogout = confirm('Are you sure you want to logout?');
        if (!confirmLogout) return;
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (err) { console.error(err); }
    }
});


// --- PREMIUM COUNTER EFFECTS ---

function animateNumbers() {
  document.querySelectorAll('.card p').forEach(p => {
    const textValue = p.innerText.replace(/,/g, '');
    const target = parseInt(textValue);
    if (isNaN(target)) return;

    let count = 0;
    const duration = 1500;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (OutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      count = Math.floor(easeProgress * target);
      p.innerText = count.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    requestAnimationFrame(updateCount);
  });
}

// animateNumbers() is called from pages after data loads
// Global Search Logic
document.addEventListener('DOMContentLoaded', () => {
    const searchInputs = document.querySelectorAll('.search-box input');
    
    searchInputs.forEach(input => {
        // Create dropdown container
        const dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(dropdown);

        const handleSearch = async () => {
            const q = input.value.trim();
            if (q.length < 3) {
                dropdown.style.display = 'none';
                return;
            }

            try {
                const res = await fetch(`/api/dashboard/search?q=${encodeURIComponent(q)}`);
                if (!res.ok) return;
                const data = await res.json();
                
                if (data.results && data.results.length > 0) {
                    dropdown.innerHTML = data.results.map(r => {
                        let icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
                        if (r.type === 'User') icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                        else if (r.type === 'Company') icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>';
                        
                        const displayUrl = r.url.startsWith('/') ? r.url : `/${r.url}`;
                        
                        return `
                        <a href="${displayUrl}" class="search-result-item">
                            <div class="search-result-icon">${icon}</div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="font-weight: 600; font-size: 14px;">${r.label}</span>
                                <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${r.type}</span>
                            </div>
                        </a>
                        `;
                    }).join('');
                    dropdown.style.display = 'block';
                } else {
                    dropdown.innerHTML = `<div style="padding: 20px; color: var(--text-muted); font-size: 13px; text-align: center;">No results matching "<strong>${q}</strong>"</div>`;
                    dropdown.style.display = 'block';
                }
            } catch (err) {
                console.error('Search error', err);
            }
        };

        input.addEventListener('input', handleSearch);
        input.addEventListener('focus', () => { if (input.value.length >= 3) dropdown.style.display = 'block'; });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.parentElement.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    });
});

// Global Date Formatter (DD-MM-YYYY)
window.formatDate = (dateVal) => {
    if (!dateVal) return 'Never';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'Invalid Date';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Global DateTime Formatter (DD-MM-YYYY HH:mm AM/PM)
window.formatDateTime = (dateVal) => {
    if (!dateVal) return 'Never';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = String(hours).padStart(2, '0') + ':' + minutes + ' ' + ampm;
    
    return `${day}-${month}-${year}, ${strTime}`;
};

/**
 * Global Authentication Check
 * Updates the topbar with user information and handles redirection
 */
async function checkAuth() {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      if (!window.location.pathname.includes('login')) {
        window.location.href = '/login';
      }
      return;
    }
    const user = await res.json();

    // Safely update DOM elements if they exist
    const updates = {
      'userName': user.name,
      'userRole': user.role,
      'profileMenuName': user.name,
      'profileMenuEmail': user.email
    };

    Object.entries(updates).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.innerText = value;
    });

    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl) {
      avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;
    }
    
    return user;
  } catch (err) {
    console.error('Auth Check Error:', err);
  }
}

// --- AUTO CUSTOM DROPDOWNS ---

function initializeCustomDropdowns() {
    const selects = document.querySelectorAll('select.form-control, select.premium-filter');
    selects.forEach(select => {
        if (select.dataset.customInitialized || select.id === 'country_code') return;
        select.dataset.customInitialized = 'true';
        
        select.style.display = 'none';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.width = select.style.width || '100%';
        wrapper.style.flexShrink = select.style.flexShrink || 'unset';
        if (select.className.includes('premium-filter')) {
            wrapper.style.minWidth = '120px';
        }
        
        const trigger = document.createElement('div');
        trigger.className = select.className; // inherits form-control or premium-filter classes exactly!
        trigger.style.cursor = 'pointer';
        trigger.style.display = 'flex';
        trigger.style.justifyContent = 'space-between';
        trigger.style.alignItems = 'center';
        trigger.style.background = 'var(--bg-body)';
        trigger.style.borderRadius = '16px';
        trigger.style.height = select.className.includes('premium-filter') ? '38px' : '42px';
        trigger.style.padding = '0 16px';
        trigger.style.fontSize = '14px';
        
        const displaySpan = document.createElement('span');
        displaySpan.className = 'custom-select-value';
        
        const caret = document.createElement('span');
        caret.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        
        trigger.appendChild(displaySpan);
        trigger.appendChild(caret);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-select-options';
        optionsContainer.style.display = 'none';
        optionsContainer.style.position = 'absolute';
        optionsContainer.style.top = 'calc(100% + 4px)';
        optionsContainer.style.left = '0';
        optionsContainer.style.right = '0';
        optionsContainer.style.background = 'var(--bg-body)';
        optionsContainer.style.border = '1px solid var(--glass-border)';
        optionsContainer.style.borderRadius = '12px';
        optionsContainer.style.maxHeight = '220px';
        optionsContainer.style.overflowY = 'auto';
        optionsContainer.style.zIndex = '9999';
        optionsContainer.style.boxShadow = 'var(--panel-shadow)';
        
        wrapper.appendChild(trigger);
        wrapper.appendChild(optionsContainer);
        
        select.parentNode.insertBefore(wrapper, select.nextSibling);
        
        function renderOptions() {
            optionsContainer.innerHTML = '';
            Array.from(select.options).forEach(opt => {
                const item = document.createElement('div');
                item.className = 'custom-option';
                item.style.padding = '10px 16px';
                item.style.cursor = 'pointer';
                item.style.color = 'var(--text-primary)';
                item.style.fontSize = '14px';
                item.style.transition = 'background 0.2s';
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.alignItems = 'center';
                
                item.innerHTML = `<span>${opt.text}</span>`;
                
                if (opt.value === select.value) {
                    item.style.background = 'rgba(99, 102, 241, 0.2)';
                    const check = document.createElement('span');
                    check.style.color = '#818cf8';
                    check.style.fontWeight = 'bold';
                    check.textContent = '✓';
                    item.appendChild(check);
                }
                
                item.addEventListener('mouseenter', () => {
                    if (opt.value !== select.value) {
                        item.style.background = 'var(--glass-bg)';
                    }
                });
                item.addEventListener('mouseleave', () => {
                    if (opt.value !== select.value) {
                        item.style.background = 'transparent';
                    }
                });
                
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    select.value = opt.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    syncUI();
                    optionsContainer.style.display = 'none';
                });
                
                optionsContainer.appendChild(item);
            });
        }
        
        function syncUI() {
            const activeOpt = select.options[select.selectedIndex];
            if (activeOpt) {
                displaySpan.textContent = activeOpt.text;
            } else {
                displaySpan.textContent = '';
            }
            renderOptions();
        }
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-select-options').forEach(el => {
                if (el !== optionsContainer) el.style.display = 'none';
            });
            const isVisible = optionsContainer.style.display === 'block';
            optionsContainer.style.display = isVisible ? 'none' : 'block';
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-select-wrapper')) {
                optionsContainer.style.display = 'none';
            }
        });
        
        syncUI();
        
        // Listen for programmatic value sets
        const descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
        Object.defineProperty(select, 'value', {
            get: function() {
                return descriptor.get.call(this);
            },
            set: function(val) {
                descriptor.set.call(this, val);
                syncUI();
            }
        });
        
        // Listen for programmatic child option changes
        const observer = new MutationObserver(() => {
            syncUI();
        });
        observer.observe(select, { childList: true });
        
        select.addEventListener('change', syncUI);
    });
}

// Automatically initialize on load
document.addEventListener('DOMContentLoaded', () => {
    elevateFilterPanels();
    // Wait a brief tick to ensure any dynamic options have loaded, then initialize
    setTimeout(() => {
        initializeCustomDropdowns();
        initializeCustomDatePickers();
        elevateFilterPanels();
    }, 100);
});

// Expose globally so dynamic pages can call it again if select options are updated dynamically
window.initializeCustomDropdowns = initializeCustomDropdowns;

/**
 * Automatically elevates all filter panels (e.g. grids, rows, or panels with inputs followed by tables)
 * to prevent select dropdowns and datepicker popups from being cut off by adjacent stacking contexts.
 */
function elevateFilterPanels() {
    // 1. Elevate standard filter-grid, filter-row, and city-filter-row classes
    document.querySelectorAll('.filter-grid, .filter-row, .city-filter-row').forEach(el => {
        el.style.position = 'relative';
        el.style.zIndex = '100';
    });

    // 2. Elevate panels that contain select/input elements and are positioned right before lists/tables
    document.querySelectorAll('.panel').forEach(panel => {
        const hasInputs = panel.querySelector('input, select, .custom-select-wrapper');
        const isFollowedByTableOrPanel = panel.nextElementSibling && 
            (panel.nextElementSibling.classList.contains('premium-table-wrapper') || 
             panel.nextElementSibling.classList.contains('premium-table-container') ||
             panel.nextElementSibling.querySelector('table') || 
             panel.nextElementSibling.classList.contains('panel'));
             
        if (hasInputs && isFollowedByTableOrPanel) {
            panel.style.position = 'relative';
            panel.style.zIndex = '100';
        }
    });
}

window.elevateFilterPanels = elevateFilterPanels;

/**
 * MineHR Premium Custom Datepicker Component
 * Synced globally inside admin.js for project-wide use.
 */
class MineHRDatePicker {
    constructor(elementId, options = {}) {
        this.input = document.getElementById(elementId);
        if (!this.input) return;

        this.options = {
            onSelect: null,
            ...options
        };

        this.currentDate = new Date(); // Date being viewed in calendar
        this.selectedDate = null;      // Date selected by the user
        this.view = 'days';            // 'days' or 'months'
        
        // Try parsing initial input value
        if (this.input.value) {
            const parsed = new Date(this.input.value);
            if (!isNaN(parsed.getTime())) {
                this.selectedDate = parsed;
                this.currentDate = new Date(parsed);
            }
        }

        this.initDOM();
        this.initEvents();
        this.render();
    }

    initDOM() {
        // Wrap input in a container for absolute positioning of picker
        const wrapper = document.createElement('div');
        wrapper.className = 'minehr-datepicker-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';

        this.input.parentNode.insertBefore(wrapper, this.input);
        wrapper.appendChild(this.input);

        // Hide default browser picker if any, and make readonly to prevent manual editing issues
        this.input.setAttribute('autocomplete', 'off');
        this.input.style.cursor = 'pointer';

        // Create the Datepicker Panel
        this.panel = document.createElement('div');
        this.panel.className = 'minehr-datepicker-panel';
        this.panel.style.display = 'none';
        
        wrapper.appendChild(this.panel);

        // Append stylesheet dynamically if not present
        if (!document.getElementById('minehr-datepicker-styles')) {
            const styles = document.createElement('style');
            styles.id = 'minehr-datepicker-styles';
            styles.innerHTML = `
                .minehr-datepicker-panel {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    width: 320px;
                    background: #11141e; /* Solid Opaque Deep Dark background */
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                    padding: 20px;
                    z-index: 10000;
                    user-select: none;
                    font-family: 'Outfit', 'Poppins', sans-serif;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0;
                    transform: translateY(10px);
                }

                /* Solid Light Mode Adaptability */
                .light .minehr-datepicker-panel {
                    background: #ffffff !important;
                    border: 1px solid rgba(0, 0, 0, 0.1) !important;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12) !important;
                }

                .light .minehr-datepicker-title-btn {
                    background: rgba(0, 0, 0, 0.06) !important;
                    color: #0f172a !important;
                }

                .light .minehr-datepicker-arrow {
                    color: #0f172a !important;
                }

                .light .minehr-datepicker-cell {
                    color: #0f172a !important;
                }

                .light .minehr-datepicker-month-cell {
                    color: #0f172a !important;
                }

                .light .minehr-datepicker-today-btn {
                    color: #0f172a !important;
                }

                .light .minehr-datepicker-today-btn:hover {
                    color: #d97706 !important;
                }

                .light .minehr-datepicker-cell.other-month {
                    color: #94a3b8 !important;
                    opacity: 0.5 !important;
                }

                .light .minehr-datepicker-cell.selected {
                    background: #fbd38d !important;
                    color: #0f172a !important;
                }

                .minehr-datepicker-panel.active {
                    opacity: 1;
                    transform: translateY(0);
                }

                .minehr-datepicker-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .minehr-datepicker-arrow {
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: bold;
                    color: var(--text-primary, #ffffff);
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .minehr-datepicker-arrow:hover {
                    background: rgba(255,255,255,0.08);
                    color: var(--primary, #6366f1);
                }

                .minehr-datepicker-title-btn {
                    cursor: pointer;
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-primary, #ffffff);
                    padding: 6px 16px;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 15px;
                    transition: all 0.2s;
                }

                .minehr-datepicker-title-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: scale(1.03);
                }

                /* Days Grid View */
                .minehr-datepicker-weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    font-size: 12px;
                    font-weight: 800;
                    color: var(--text-muted, #94a3b8);
                    margin-bottom: 10px;
                    text-transform: uppercase;
                }

                .minehr-datepicker-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 6px;
                    margin-bottom: 15px;
                }

                .minehr-datepicker-cell {
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13.5px;
                    font-weight: 600;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--text-primary, #ffffff);
                }

                .minehr-datepicker-cell:hover:not(.empty):not(.disabled) {
                    background: rgba(99, 102, 241, 0.15);
                    color: #fff;
                    transform: scale(1.05);
                }

                .minehr-datepicker-cell.other-month {
                    color: var(--text-muted, #4b5563);
                    opacity: 0.4;
                }

                .minehr-datepicker-cell.selected {
                    background: #fbd38d !important; /* Premium Warm Gold / Orange */
                    color: #121520 !important;
                    font-weight: 800;
                    box-shadow: 0 4px 12px rgba(251, 211, 141, 0.3);
                }

                .minehr-datepicker-cell.today-marker {
                    border: 1px solid rgba(251, 211, 141, 0.5);
                }

                /* Months View */
                .minehr-datepicker-months-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 15px;
                    padding: 5px 0;
                }

                .minehr-datepicker-month-cell {
                    padding: 14px 0;
                    text-align: center;
                    font-size: 14px;
                    font-weight: 700;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--text-primary, #ffffff);
                }

                .minehr-datepicker-month-cell:hover {
                    background: rgba(99, 102, 241, 0.15);
                    color: #fff;
                }

                .minehr-datepicker-month-cell.selected {
                    background: var(--primary, #6366f1);
                    color: white;
                }

                /* Footer */
                .minehr-datepicker-footer {
                    border-top: 1px solid var(--glass-border, rgba(255,255,255,0.06));
                    padding-top: 12px;
                    text-align: center;
                }

                .minehr-datepicker-today-btn {
                    cursor: pointer;
                    display: inline-block;
                    font-size: 13.5px;
                    font-weight: 700;
                    color: var(--text-primary, #ffffff);
                    transition: all 0.2s;
                }

                .minehr-datepicker-today-btn:hover {
                    color: #fbd38d;
                    transform: scale(1.03);
                }
            `;
            document.head.appendChild(styles);
        }
    }

    initEvents() {
        // Show panel on input focus/click
        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            this.show();
        });

        // Hide panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.panel.contains(e.target) && e.target !== this.input) {
                this.hide();
            }
        });
    }

    show() {
        // Hide other open pickers
        document.querySelectorAll('.minehr-datepicker-panel').forEach(p => {
            if (p !== this.panel) {
                p.style.display = 'none';
                p.classList.remove('active');
            }
        });

        this.view = 'days'; // Default to days view on open
        this.panel.style.display = 'block';
        
        // Prevent right-edge window clipping dynamically
        const rect = this.panel.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            this.panel.style.left = 'auto';
            this.panel.style.right = '0';
        } else {
            this.panel.style.left = '0';
            this.panel.style.right = 'auto';
        }

        setTimeout(() => this.panel.classList.add('active'), 10);
        this.render();
    }

    hide() {
        this.panel.classList.remove('active');
        setTimeout(() => {
            this.panel.style.display = 'none';
        }, 200);
    }

    prev() {
        if (this.view === 'days') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else {
            this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        }
        this.render();
    }

    next() {
        if (this.view === 'days') {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        } else {
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        }
        this.render();
    }

    selectDay(day) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        this.selectedDate = new Date(year, month, day);
        this.currentDate = new Date(this.selectedDate);
        
        // Format as YYYY-MM-DD
        const formatted = this.formatDateISO(this.selectedDate);
        this.input.value = formatted;
        
        // Trigger default input events to notify frameworks / other scripts
        this.input.dispatchEvent(new Event('input'));
        this.input.dispatchEvent(new Event('change'));

        if (this.options.onSelect) {
            this.options.onSelect(formatted, this.selectedDate);
        }

        this.hide();
    }

    selectMonth(monthIndex) {
        this.currentDate.setMonth(monthIndex);
        this.view = 'days';
        this.render();
    }

    selectToday() {
        const today = new Date();
        this.selectedDate = today;
        this.currentDate = new Date(today);
        
        const formatted = this.formatDateISO(today);
        this.input.value = formatted;

        this.input.dispatchEvent(new Event('input'));
        this.input.dispatchEvent(new Event('change'));

        if (this.options.onSelect) {
            this.options.onSelect(formatted, today);
        }

        this.hide();
    }

    toggleView() {
        this.view = this.view === 'days' ? 'months' : 'days';
        this.render();
    }

    clear() {
        this.selectedDate = null;
        this.input.value = '';
        this.render();
    }

    formatDateISO(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    formatDisplayDate(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    }

    render() {
        this.panel.innerHTML = '';

        // 1. Header Row
        const header = document.createElement('div');
        header.className = 'minehr-datepicker-header';

        const prevBtn = document.createElement('div');
        prevBtn.className = 'minehr-datepicker-arrow';
        prevBtn.innerHTML = '«';
        prevBtn.onclick = (e) => { e.stopPropagation(); this.prev(); };

        const titleBtn = document.createElement('div');
        titleBtn.className = 'minehr-datepicker-title-btn';
        
        if (this.view === 'days') {
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            titleBtn.innerHTML = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        } else {
            titleBtn.innerHTML = `${this.currentDate.getFullYear()}`;
        }
        titleBtn.onclick = (e) => { e.stopPropagation(); this.toggleView(); };

        const nextBtn = document.createElement('div');
        nextBtn.className = 'minehr-datepicker-arrow';
        nextBtn.innerHTML = '»';
        nextBtn.onclick = (e) => { e.stopPropagation(); this.next(); };

        header.appendChild(prevBtn);
        header.appendChild(titleBtn);
        header.appendChild(nextBtn);
        this.panel.appendChild(header);

        // 2. View Rendering
        if (this.view === 'days') {
            this.renderDaysView();
        } else {
            this.renderMonthsView();
        }

        // 3. Footer Row (Today Button)
        const footer = document.createElement('div');
        footer.className = 'minehr-datepicker-footer';

        const todayBtn = document.createElement('div');
        todayBtn.className = 'minehr-datepicker-today-btn';
        todayBtn.innerHTML = `Today : ${this.formatDisplayDate(new Date())}`;
        todayBtn.onclick = (e) => { e.stopPropagation(); this.selectToday(); };

        footer.appendChild(todayBtn);
        this.panel.appendChild(footer);
    }

    renderDaysView() {
        // Weekday Headers
        const weekdays = document.createElement('div');
        weekdays.className = 'minehr-datepicker-weekdays';
        const daysLabel = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        weekdays.innerHTML = daysLabel.map(d => `<div>${d}</div>`).join('');
        this.panel.appendChild(weekdays);

        // Days Grid
        const grid = document.createElement('div');
        grid.className = 'minehr-datepicker-grid';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Get first day of the month & total days
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const prevMonthTotalDays = new Date(year, month, 0).getDate();

        const today = new Date();

        // 1. Fill previous month's trailing days
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNum = prevMonthTotalDays - i;
            const cell = document.createElement('div');
            cell.className = 'minehr-datepicker-cell other-month';
            cell.innerHTML = dayNum;
            cell.onclick = (e) => {
                e.stopPropagation();
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.selectDay(dayNum);
            };
            grid.appendChild(cell);
        }

        // 2. Fill current month's days
        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement('div');
            cell.className = 'minehr-datepicker-cell';
            cell.innerHTML = day;

            // Check if selected
            if (this.selectedDate && 
                this.selectedDate.getDate() === day && 
                this.selectedDate.getMonth() === month && 
                this.selectedDate.getFullYear() === year) {
                cell.classList.add('selected');
            }

            // Check if today
            if (today.getDate() === day && 
                today.getMonth() === month && 
                today.getFullYear() === year) {
                cell.classList.add('today-marker');
            }

            cell.onclick = (e) => {
                e.stopPropagation();
                this.selectDay(day);
            };

            grid.appendChild(cell);
        }

        // 3. Fill next month's leading days
        const totalCellsFilled = firstDayIndex + totalDays;
        const remainingCells = (totalCellsFilled % 7 === 0) ? 0 : (7 - (totalCellsFilled % 7));
        for (let day = 1; day <= remainingCells; day++) {
            const cell = document.createElement('div');
            cell.className = 'minehr-datepicker-cell other-month';
            cell.innerHTML = day;
            cell.onclick = (e) => {
                e.stopPropagation();
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.selectDay(day);
            };
            grid.appendChild(cell);
        }

        this.panel.appendChild(grid);
    }

    renderMonthsView() {
        const grid = document.createElement('div');
        grid.className = 'minehr-datepicker-months-grid';

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        months.forEach((m, idx) => {
            const cell = document.createElement('div');
            cell.className = 'minehr-datepicker-month-cell';
            cell.innerHTML = m;

            if (this.selectedDate && 
                this.selectedDate.getMonth() === idx && 
                this.selectedDate.getFullYear() === this.currentDate.getFullYear()) {
                cell.classList.add('selected');
            }

            cell.onclick = (e) => {
                e.stopPropagation();
                this.selectMonth(idx);
            };

            grid.appendChild(cell);
        });

        this.panel.appendChild(grid);
    }
}
window.MineHRDatePicker = MineHRDatePicker;

/**
 * Global Automatic Input Upgrade Engine
 * Detects all <input type="date"> on any page and upgrades them synchronously!
 */
function initializeCustomDatePickers() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (input.dataset.customDateInitialized) return;
        input.dataset.customDateInitialized = 'true';

        // Auto-assign safe ID if none exists
        if (!input.id) {
            input.id = 'minehr-picker-' + Math.random().toString(36).substring(2, 9);
        }

        // Convert input type to prevent native OS date dropdown triggers
        input.setAttribute('type', 'text');
        input.setAttribute('readonly', 'true');
        if (!input.getAttribute('placeholder')) {
            input.setAttribute('placeholder', 'YYYY-MM-DD');
        }

        // Initialize MineHRDatePicker on it
        const picker = new MineHRDatePicker(input.id, {
            onSelect: (val) => {
                // Ensure inline onchange attribute executes correctly
                const inlineOnChange = input.getAttribute('onchange');
                if (inlineOnChange) {
                    try {
                        const fn = new Function(inlineOnChange);
                        fn.call(input);
                    } catch (e) {
                        console.error('Inline onchange execution error:', e);
                    }
                }
            }
        });

        // Store custom picker instance for page accessibility
        input.pickerInstance = picker;
    });
}

window.initializeCustomDatePickers = initializeCustomDatePickers;

/* ─────────────────────────────────────────────────────────────────────────────
   REAL-TIME NOTIFICATIONS ENGINE
   ────────────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject the Notification Bell Markup dynamically inside .topbar-right
    const topbarRight = document.querySelector('.topbar-right');
    if (topbarRight && !document.getElementById('notificationDropdown')) {
        const profile = topbarRight.querySelector('.profile');
        const bellContainer = document.createElement('div');
        bellContainer.className = 'notification-bell-container';
        bellContainer.id = 'notificationDropdown';
        bellContainer.innerHTML = `
            <button class="notification-bell-btn" id="notificationBellBtn" onclick="toggleNotificationMenu(event)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span class="notification-badge" id="notificationBadge" style="display: none;">0</span>
            </button>
            <div class="notification-dropdown-menu" id="notificationMenu">
                <div class="notification-dropdown-header">
                    <strong>Notifications</strong>
                    <button id="clearAllNotificationsBtn" class="clear-all-btn" onclick="clearNotifications(event)">Clear all</button>
                </div>
                <div class="notification-dropdown-list" id="notificationList">
                    <div class="notification-empty-state">No new notifications</div>
                </div>
            </div>
        `;
        if (profile) {
            topbarRight.insertBefore(bellContainer, profile);
        } else {
            topbarRight.appendChild(bellContainer);
        }
    }

    // 2. Initialize Toast Container
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // 3. Connect to Real-time Notification Event Stream (SSE) with Polling Fallback
    connectNotifications();
    updateNotificationUI();
});

// Stored notifications in localStorage (holds up to 30 history items)
let localNotifications = [];
try {
    localNotifications = JSON.parse(localStorage.getItem('sys_notifications') || '[]');
} catch (e) {}

function saveNotifications() {
    localStorage.setItem('sys_notifications', JSON.stringify(localNotifications));
}

function showLiveToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `live-toast ${type}`;
    
    let icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    if (type === 'success') {
        icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'danger') {
        icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    }
    
    toast.innerHTML = `
        <div class="toast-accent-bar"></div>
        <div class="toast-icon-circle">${icon}</div>
        <div class="toast-body">${message}</div>
        <button class="toast-close-btn">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 6 seconds
    const removeTimer = setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 6000);
    
    toast.querySelector('.toast-close-btn').onclick = (e) => {
        e.stopPropagation();
        clearTimeout(removeTimer);
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => toast.remove());
    };
}

function updateNotificationUI() {
    const list = document.getElementById('notificationList');
    const badge = document.getElementById('notificationBadge');
    if (!list || !badge) return;

    const unreadCount = localNotifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }

    if (localNotifications.length === 0) {
        list.innerHTML = `<div class="notification-empty-state">No new notifications</div>`;
        return;
    }

    list.innerHTML = localNotifications.map(n => {
        let title = n.action;
        let typeClass = 'info';
        
        const actionLower = n.action.toLowerCase();
        if (actionLower.includes('delete') || actionLower.includes('remove') || actionLower.includes('reject') || actionLower.includes('suspend')) {
            typeClass = 'danger';
        } else if (actionLower.includes('create') || actionLower.includes('add') || actionLower.includes('register') || actionLower.includes('approve') || actionLower.includes('save') || actionLower.includes('update')) {
            typeClass = 'success';
        }
        
        let detailsText = '';
        if (n.details) {
            if (typeof n.details === 'string') {
                detailsText = `: ${n.details}`;
            } else if (n.details.description) {
                detailsText = `: ${n.details.description}`;
            } else if (n.details.message) {
                detailsText = `: ${n.details.message}`;
            } else if (n.details.name) {
                detailsText = `: ${n.details.name}`;
            }
        }

        const dateStr = window.formatDateTime ? window.formatDateTime(n.created_at) : new Date(n.created_at).toLocaleString();

        let icon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        if (typeClass === 'success') {
            icon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else if (typeClass === 'danger') {
            icon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        }

        return `
            <a href="#" class="notification-item ${n.read ? 'read' : 'unread'}" onclick="markAsRead('${n.id}', event)">
                <div class="notification-item-icon ${typeClass}">${icon}</div>
                <div class="notification-item-details">
                    <span class="notification-item-title">${title}${detailsText}</span>
                    <span class="notification-item-time">${dateStr}</span>
                </div>
            </a>
        `;
    }).join('');
}

window.markAsRead = (id, event) => {
    if (event) event.preventDefault();
    const notif = localNotifications.find(n => String(n.id) === String(id));
    if (notif) {
        notif.read = true;
        saveNotifications();
        updateNotificationUI();
    }
};

window.clearNotifications = (event) => {
    if (event) event.stopPropagation();
    localNotifications = [];
    saveNotifications();
    updateNotificationUI();
};

window.toggleNotificationMenu = (event) => {
    if (event) event.stopPropagation();
    const menu = document.getElementById('notificationMenu');
    if (!menu) return;
    
    // Close other dropdowns
    document.getElementById('profileDropdown')?.classList.remove('active');
    
    menu.classList.toggle('active');
};

// Global click listener to dismiss the dropdown on outside click
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        document.getElementById('notificationMenu')?.classList.remove('active');
    }
});

let sseConnected = false;
let pollingTimer = null;

function connectNotifications() {
    if (typeof EventSource !== 'undefined') {
        const sse = new EventSource('/api/activities/live');
        
        sse.onopen = () => {
            sseConnected = true;
            if (pollingTimer) {
                clearInterval(pollingTimer);
                pollingTimer = null;
            }
        };
        
        sse.onmessage = (event) => {
            handleNewNotificationData(event.data);
        };
        
        sse.onerror = () => {
            sseConnected = false;
            sse.close();
            startFallbackPolling();
        };
    } else {
        startFallbackPolling();
    }
}

function startFallbackPolling() {
    if (pollingTimer) return;
    
    // Poll immediately, then every 3 seconds
    pollNotifications();
    pollingTimer = setInterval(pollNotifications, 3000);
}

async function pollNotifications() {
    try {
        const res = await fetch('/api/dashboard/recent-activity');
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.success && data.activities && data.activities.length > 0) {
            // Sort to process oldest activities first so toasts build chronological stack
            const sorted = [...data.activities].reverse();
            sorted.forEach(act => {
                handleNewNotificationData(JSON.stringify(act));
            });
        }
    } catch (err) {
        console.error('Polling error:', err);
    }
}

function handleNewNotificationData(rawString) {
    try {
        const data = JSON.parse(rawString);
        
        // Avoid duplicate additions
        if (localNotifications.some(n => String(n.id) === String(data.id))) return;
        
        data.read = false;
        localNotifications.unshift(data);
        if (localNotifications.length > 30) localNotifications.pop(); // Hold up to 30 items
        saveNotifications();
        updateNotificationUI();
        
        // Dynamic, high-end Toast semantic parsing
        let title = data.action;
        let toastType = 'info';
        
        const actionLower = data.action.toLowerCase();
        if (actionLower.includes('delete') || actionLower.includes('remove') || actionLower.includes('reject') || actionLower.includes('suspend')) {
            toastType = 'danger'; // Red accent
        } else if (actionLower.includes('create') || actionLower.includes('add') || actionLower.includes('register') || actionLower.includes('approve') || actionLower.includes('save') || actionLower.includes('update')) {
            toastType = 'success'; // Green accent
        }
        
        let desc = '';
        if (data.details) {
            if (typeof data.details === 'string') {
                desc = data.details;
            } else if (data.details.description) {
                desc = data.details.description;
            } else if (data.details.message) {
                desc = data.details.message;
            } else if (data.details.name) {
                desc = data.details.name;
            }
        }
        
        if (!desc) {
            desc = `Successful operation under ${data.module}`;
        }
        
        showLiveToast(`<strong>${title}</strong><br><span style="font-size: 12px; opacity: 0.9;">${desc}</span>`, toastType);
        
    } catch (err) {
        console.error('Error parsing notification data:', err);
    }
}
