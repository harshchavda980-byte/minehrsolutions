<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'MineHR Solutions')</title>
    
    <!-- Merged Stylesheet -->
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/navbar-premium.css') }}">
    
    <!-- Secondary Stylesheets (If any additional are needed) -->
    @stack('styles')
</head>
<body>

    <!-- ================= PREMIUM NAVBAR ================= -->
    <header class="site-header-premium" id="navbar">
        <div class="navbar-container">
            <div class="navbar-inner">
                <!-- Logo -->
                <div class="navbar-logo">
                    <a href="{{ url('/') }}" class="logo-link">
                        <img src="{{ asset('assets/logo.png') }}" alt="MineHR Logo" class="logo-img" />
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <nav class="navbar-menu" id="navMenu">
                    <a href="{{ url('/') }}" class="nav-link {{ Request::is('/') ? 'active' : '' }}">Home</a>
                    <a href="{{ url('/services') }}" class="nav-link {{ Request::is('services*') ? 'active' : '' }}">Services</a>
                    <a href="{{ url('/career') }}" class="nav-link {{ Request::is('career*') ? 'active' : '' }}">Career</a>
                    <a href="{{ url('/trust') }}" class="nav-link {{ Request::is('trust*') ? 'active' : '' }}">Trust</a>
                    <a href="{{ url('/blog') }}" class="nav-link {{ Request::is('blog*') ? 'active' : '' }}">Blog</a>
                </nav>

                <!-- Right Side Actions -->
                <div class="navbar-actions">
                    <!-- Search Icon -->
                    <button class="nav-icon-btn" id="searchToggle" aria-label="Search">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                            stroke="currentColor">
                            <circle cx="9" cy="9" r="6" stroke-width="2" />
                            <path d="M14 14L18 18" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </button>

                    <!-- Theme Toggle -->
                    <button class="nav-icon-btn theme-toggle" id="themeToggle" aria-label="Toggle theme">
                        <!-- Sun Icon (Light Mode) -->
                        <svg class="theme-icon sun-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                            stroke="currentColor">
                            <circle cx="10" cy="10" r="3" stroke-width="2" />
                            <line x1="10" y1="1" x2="10" y2="3" stroke-width="2" stroke-linecap="round" />
                            <line x1="10" y1="17" x2="10" y2="19" stroke-width="2" stroke-linecap="round" />
                            <line x1="1" y1="10" x2="3" y2="10" stroke-width="2" stroke-linecap="round" />
                            <line x1="17" y1="10" x2="19" y2="10" stroke-width="2" stroke-linecap="round" />
                            <line x1="3.5" y1="3.5" x2="5" y2="5" stroke-width="2" stroke-linecap="round" />
                            <line x1="15" y1="15" x2="16.5" y2="16.5" stroke-width="2" stroke-linecap="round" />
                            <line x1="16.5" y1="3.5" x2="15" y2="5" stroke-width="2" stroke-linecap="round" />
                            <line x1="5" y1="15" x2="3.5" y2="16.5" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        <!-- Moon Icon (Dark Mode) -->
                        <svg class="theme-icon moon-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    </button>

                    <!-- Contact Us CTA -->
                    <a href="{{ url('/contact') }}" class="nav-cta-btn">
                        <span>Contact Us</span>
                        <svg class="cta-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </a>

                    <!-- Mobile Menu Toggle -->
                    <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Search Overlay -->
        <div class="search-overlay" id="searchOverlay">
            <div class="search-container">
                <div class="search-box">
                    <svg class="search-box-icon" width="24" height="24" viewBox="0 0 20 20" fill="none"
                        stroke="currentColor">
                        <circle cx="9" cy="9" r="6" stroke-width="2" />
                        <path d="M14 14L18 18" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <input type="text" class="search-input" placeholder="Search services, blog posts..." id="searchInput"
                        autocomplete="off" />
                    <button class="search-close" id="searchClose" aria-label="Close search">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path d="M4 4L16 16M16 4L4 16" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </button>
                </div>
                <div class="search-suggestions">
                    <div class="search-suggestion-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        </svg>
                        <span>HRMS Software</span>
                    </div>
                    <div class="search-suggestion-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        </svg>
                        <span>Payroll Management</span>
                    </div>
                    <div class="search-suggestion-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        </svg>
                        <span>Web Development</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    @yield('content')

    <!-- ================= FOOTER ================= -->
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-top">
                <div class="footer-brand">
                    <a href="{{ url('/') }}">
                        <img src="{{ asset('assets/logo.png') }}" alt="MineHR Logo" class="footer-logo">
                    </a>
                </div>

                <div class="footer-links-grid">
                    <div class="footer-column">
                        <h3 class="footer-heading">Quick Links</h3>
                        <ul class="footer-menu">
                            <li><a href="{{ url('/') }}">Home</a></li>
                            <li><a href="{{ url('/trust') }}">Trust</a></li>
                            <li><a href="{{ url('/services') }}">Services</a></li>
                            <li><a href="{{ url('/contact') }}">Contact Us</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3 class="footer-heading">Services</h3>
                        <ul class="footer-menu">
                            <li><a href="{{ url('/services/hr-services') }}">End-to-End HR Services</a></li>
                            <li><a href="{{ url('/services/payroll-management') }}">Payroll Management</a></li>
                            <li><a href="{{ url('/services/recruitment-staffing') }}">Recruitment & Staffing</a></li>
                            <li><a href="{{ url('/services/hrms-software') }}">HRMS Software</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3 class="footer-heading">Contact Us</h3>
                        <ul class="footer-contact-list">
                            <li class="contact-item">
                                <a href="mailto:contact@minehrsolutions.com">contact@minehrsolutions.com</a>
                            </li>
                            <li class="contact-item">
                                <a href="tel:+919876543210">+91 98765 43210</a>
                            </li>
                            <li class="contact-item">
                                <span>Ahmedabad, Gujarat – India</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 MineHR Solutions Pvt. Ltd. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Merged Script -->
    <script src="{{ asset('js/navbar-premium.js') }}"></script>
    <script src="{{ asset('js/script.js') }}"></script>
    
    @stack('scripts')
</body>
</html>
