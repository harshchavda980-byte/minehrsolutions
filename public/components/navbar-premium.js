/* =========================================================
   PREMIUM NAVBAR - JAVASCRIPT
   Features: Theme Toggle, Search, Mobile Menu, Scroll Effects
   ========================================================= */

(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', initNavbar);

    function initNavbar() {
        console.log('🚀 Premium Navbar initialized');

        // ===== ELEMENTS =====
        const navbar = document.getElementById('navbar');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        const themeToggle = document.getElementById('themeToggle');
        const searchToggle = document.getElementById('searchToggle');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');

        // ===== THEME TOGGLE =====

        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);

            // Add click animation
            themeToggle.style.transform = 'rotate(360deg) scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        }

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            console.log(`🎨 Theme switched to: ${theme}`);

            // Update Navbar Logo
            const logoImg = document.querySelector('.logo-img');
            if (logoImg) {
                const isServicePage = window.location.pathname.includes('/services/');
                const basePath = isServicePage ? '../public/assets/' : 'public/assets/';
                
                if (theme === 'dark') {
                    logoImg.src = `${basePath}logo-footer.png`;
                } else {
                    logoImg.src = `${basePath}logo.png`;
                }
            }
        }

        // ===== SEARCH FUNCTIONALITY =====

        if (searchToggle && searchOverlay) {
            searchToggle.addEventListener('click', openSearch);
        }

        if (searchClose) {
            searchClose.addEventListener('click', closeSearch);
        }

        if (searchOverlay) {
            // Close when clicking overlay background
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    closeSearch();
                }
            });
        }

        // Close search with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });

        function openSearch() {
            if (searchOverlay) {
                searchOverlay.classList.add('active');
                // Removed document.body.style.overflow = 'hidden' to allow scrolling as requested

                // Focus input after animation
                setTimeout(() => {
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 100);
            }
        }

        function closeSearch() {
            if (searchOverlay) {
                searchOverlay.classList.remove('active');
                // Removed document.body.style.overflow = '' to maintain normal scroll behavior

                // Clear input
                if (searchInput) {
                    searchInput.value = '';
                }
            }
        }

        // Dynamic Search Database
        const searchDatabase = [
            { title: 'Home', url: '/index.html', keywords: ['home', 'main', 'index', 'start'] },
            { title: 'ATS / Recruiter CRM', url: '/ats.html', keywords: ['ats', 'recruiter', 'hiring', 'tracking'] },
            { title: 'HRMS Software', url: '/services/hrms-software.html', keywords: ['hrms', 'hr', 'human resources'] },
            { title: 'Payroll Management', url: '/services/payroll-management.html', keywords: ['payroll', 'salary', 'compensation'] },
            { title: 'Web Development', url: '/services/web-development.html', keywords: ['web', 'development', 'website', 'design'] },
            { title: 'Logo & Branding', url: '/services/logo-branding.html', keywords: ['logo', 'branding', 'design'] },
            { title: 'CRM Solutions', url: '/services/crm-solutions.html', keywords: ['crm', 'customer', 'relationship'] },
            { title: 'Custom Software', url: '/services/custom-software.html', keywords: ['custom', 'software', 'app'] },
            { title: 'IT Support', url: '/services/it-support.html', keywords: ['it', 'support', 'helpdesk'] },
            { title: 'Contact Us', url: '/contact.html', keywords: ['contact', 'support', 'help'] },
            { title: 'Blog', url: '/blog.html', keywords: ['blog', 'news', 'articles'] },
            { title: 'Career', url: '/career.html', keywords: ['career', 'jobs', 'hiring', 'work'] },
            { title: 'Trust & Security', url: '/trust.html', keywords: ['trust', 'security', 'privacy'] },
            { title: 'All Services', url: '/services.html', keywords: ['services', 'solutions'] }
        ];

        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = ''; // Clear hardcoded "duplicate" data
            suggestionsContainer.style.display = 'none';
        }

        function performSearch(query) {
            query = query.toLowerCase().trim();
            if (!query) return;

            // Find best match in database
            const match = searchDatabase.find(item => 
                item.title.toLowerCase().includes(query) || 
                item.keywords.some(k => k.includes(query))
            );

            if (match) {
                window.location.href = match.url;
            } else {
                window.location.href = '/index.html'; // default fallback
            }
        }

        // Handle typing for dynamic suggestions
        if (searchInput) {
            searchInput.placeholder = 'Search services, products, blog posts...';
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                
                if (query.length >= 3) {
                    const matches = searchDatabase.filter(item => 
                        item.title.toLowerCase().includes(query) || 
                        item.keywords.some(k => k.includes(query))
                    ).slice(0, 5); // Limit to 5 results

                    if (matches.length > 0) {
                        suggestionsContainer.innerHTML = matches.map(item => `
                            <div class="search-suggestion-item" data-url="${item.url}">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                                </svg>
                                <span>${item.title}</span>
                            </div>
                        `).join('');
                        suggestionsContainer.style.display = 'block';

                        // Add click listeners to new suggestions
                        suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach(item => {
                            item.addEventListener('click', () => {
                                window.location.href = item.dataset.url;
                            });
                        });
                    } else {
                        suggestionsContainer.style.display = 'none';
                    }
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch(searchInput.value);
                }
            });
        }

        // ===== STICKY NAVBAR WITH SCROLL EFFECTS =====

        let lastScrollTop = 0;
        let scrollThreshold = 50;

        window.addEventListener('scroll', handleScroll);

        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add scrolled class when scrolling down
            if (scrollTop > scrollThreshold) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
        }

        // ===== MOBILE MENU TOGGLE =====

        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        function toggleMobileMenu() {
            const isOpening = !navMenu?.classList.contains('active');
            mobileMenuToggle?.classList.toggle('active');
            navMenu?.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (isOpening) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
                // Collapse any open dropdowns when closing menu
                closeAllDropdowns();
            }
        }

        function closeAllDropdowns() {
            document.querySelectorAll('.nav-dropdown.active').forEach(dd => {
                dd.classList.remove('active');
            });
        }

        // Close mobile menu when clicking on a link (excluding the dropdown toggles)
        if (navMenu) {
            const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item, .nav-cta-btn');
            navLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }
        function closeMobileMenu() {
            mobileMenuToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
            closeAllDropdowns();
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navbar && !navbar.contains(e.target) && navMenu?.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // ===== MOBILE DROPDOWN TOGGLE =====
        const dropdownToggles = document.querySelectorAll('.nav-dropdown .dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            // Remove inline onclick to avoid conflicts with our handler
            toggle.removeAttribute('onclick');
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Only toggle dropdown in mobile view
                if (window.innerWidth <= 900) {
                    const parent = toggle.closest('.nav-dropdown');
                    if (parent) {
                        const isAlreadyOpen = parent.classList.contains('active');
                        // Close all first, then open this one if it was closed
                        closeAllDropdowns();
                        if (!isAlreadyOpen) {
                            parent.classList.add('active');
                        }
                    }
                }
            });
        });

        // ===== ACTIVE LINK HIGHLIGHTING =====

        updateActiveLink();

        function updateActiveLink() {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-item');

            allNavLinks.forEach(link => {
                const linkPage = link.getAttribute('href') ? link.getAttribute('href').split('/').pop() : '';

                // Remove active from all
                link.classList.remove('active');

                // Add active to current page
                if (linkPage === currentPage ||
                    (currentPage === '' && linkPage === 'index.html') ||
                    (currentPage === 'index.html' && linkPage === 'index.html')) {
                    link.classList.add('active');
                }
            });

            // If current page is ats.html or crm.html, highlight the Product toggle
            // but do NOT open the dropdown (do not add 'active' to .nav-dropdown parent)
            if (currentPage === 'ats.html' || currentPage === 'crm.html') {
                const productToggle = document.querySelector('.nav-dropdown .dropdown-toggle');
                if (productToggle) {
                    productToggle.classList.add('active');
                    // Explicitly ensure the parent .nav-dropdown does NOT have 'active'
                    const navDropdown = productToggle.closest('.nav-dropdown');
                    if (navDropdown) {
                        navDropdown.classList.remove('active');
                    }
                }
            }
        }

        // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleAnchorClick);
        });

        function handleAnchorClick(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    closeMobileMenu();
                }
            }
        }

        // ===== KEYBOARD SHORTCUTS =====

        document.addEventListener('keydown', handleKeyboardShortcuts);

        function handleKeyboardShortcuts(e) {
            // Ctrl/Cmd + K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }

            // Ctrl/Cmd + D to toggle theme
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                toggleTheme();
            }
        }

        // ===== PERFORMANCE: DEBOUNCE SCROLL =====

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Apply debounce to scroll for better performance
        const debouncedScroll = debounce(handleScroll, 10);
        window.removeEventListener('scroll', handleScroll);
        window.addEventListener('scroll', debouncedScroll);

        // ===== FOOTER: AUTO-HIDE CURRENT PAGE LINK FROM QUICK LINKS =====
        try {
            const pathParts = window.location.pathname.split('/');
            let currentPage = pathParts[pathParts.length - 1] || 'index.html';
            
            // Normalize current page (e.g. "trust.html" -> "trust", or "trust/" -> "trust")
            let currentPageBase = currentPage.replace(/\.html$/, '').trim();
            if (!currentPageBase || currentPageBase === 'index') {
                currentPageBase = 'index';
            }

            const footerLinks = document.querySelectorAll('[data-footer-link]');
            footerLinks.forEach(link => {
                const footerVal = link.getAttribute('data-footer-link');
                if (footerVal) {
                    const footerValBase = footerVal.replace(/\.html$/, '').trim();
                    if (footerValBase === currentPageBase) {
                        // Hide the parent <li> element to keep the list clean
                        const parentLi = link.closest('li');
                        if (parentLi) {
                            parentLi.style.display = 'none';
                        } else {
                            link.style.display = 'none';
                        }
                    }
                }
            });
        } catch (e) {
            console.error('Error auto-hiding footer link:', e);
        }

        // ===== INITIALIZATION COMPLETE =====

        console.log('✅ Premium Navbar ready');
        console.log('💡 Keyboard shortcuts: Ctrl+K (Search), Ctrl+D (Theme)');
    }

})();
