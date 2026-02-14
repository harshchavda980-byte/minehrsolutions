@extends('layouts.app')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/services-premium.css') }}">
@endpush

@push('scripts')
    <script src="{{ asset('js/services-premium.js') }}"></script>
@endpush

@section('content')
<section class="services-hero-premium">
    <div class="container hero-content">
      <div class="hero-badge">
        <span class="badge-icon">✨</span>
        <span>Trusted by 100+ growing businesses</span>
      </div>
      <h1 class="hero-title">Solutions that Drive Growth</h1>
      <p class="hero-subtitle">
        From HR automation to custom software, we provide enterprise-grade services
        <br>tailored for startups, SMEs, and scaling organizations.
      </p>
      <div class="hero-actions">
        <a href="#services-section" class="btn-hero-primary">Explore Services</a>
        <a href="#" class="btn-hero-secondary">Talk to Sales</a>
      </div>
    </div>
  </section>

  <!-- ================= CATEGORY FILTER ================= -->
  <section class="filter-section">
    <div class="container">
      <div class="filter-tabs">
        <button class="filter-tab active" data-category="all">All Services</button>
        <button class="filter-tab" data-category="hr">HR & Payroll</button>
        <button class="filter-tab" data-category="tech">Technology</button>
        <button class="filter-tab" data-category="consulting">Consulting</button>
      </div>
    </div>
  </section>



  <!-- ================= SERVICES SECTION ================= -->
  <section class="services-premium-section" id="services-section">
    <div class="container-wide">

      <!-- Service 1: HRMS Software -->
      <div class="service-card-premium" id="hrms" data-category="hr">
        <div class="service-card-inner">
          <div class="service-icon-premium">
            <img src="{{ asset('assets/services icons/hrms.gif') }}" alt="HRMS Software" />
          </div>
          <div class="service-content">
            <div class="service-header-group">
              <h2 class="service-title">HRMS Software</h2>
              <span class="service-badge">Most Popular</span>
            </div>
            <p class="service-description">
              Complete HR management system with attendance tracking, leave management,
              employee lifecycle, payroll integration, and real-time analytics dashboard.
            </p>

            <div class="service-benefits">
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Saves 15+ hours per week</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>99.9% accuracy in records</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Reduces admin costs by 40%</span>
              </div>
            </div>

            <div class="service-meta">
              <span class="service-use-case">Perfect for companies with 10-500 employees</span>
              <span class="service-trust">• Used by 80+ companies</span>
            </div>
          </div>
          <div class="service-cta">
            <a href="{{ url('/services/hrms-software') }}" class="btn-service-primary">Book Now</a>
            <button class="btn-expand" data-expand="hrms">
              <span>Learn More</span>
              <svg class="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Expandable Details -->
        <div class="service-expanded-content" id="expand-hrms">
          <div class="expanded-inner">
            <h3>What's Included</h3>
            <ul class="features-list">
              <li>Employee database management</li>
              <li>Attendance & leave tracking</li>
              <li>Performance reviews & appraisals</li>
              <li>Document management</li>
              <li>Mobile app access</li>
              <li>Advanced reporting & analytics</li>
            </ul>
            <div class="expanded-cta">
              <a href="#" class="btn-demo">Schedule a Demo</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Service 2: Payroll Management -->
      <div class="service-card-premium" id="payroll" data-category="hr">
        <div class="service-card-inner">
          <div class="service-icon-premium">
            <img src="{{ asset('assets/services icons/payroll.gif') }}" alt="Payroll Management" />
          </div>
          <div class="service-content">
            <div class="service-header-group">
              <h2 class="service-title">Payroll Management</h2>
            </div>
            <p class="service-description">
              Automated payroll processing with tax compliance, statutory deductions,
              payslip generation, and seamless bank integration for direct deposits.
            </p>

            <div class="service-benefits">
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>100% tax compliance</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Zero calculation errors</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Saves 20 hours monthly</span>
              </div>
            </div>

            <div class="service-meta">
              <span class="service-use-case">Ideal for businesses with complex payroll needs</span>
              <span class="service-trust">• Enterprise-ready solution</span>
            </div>
          </div>
          <div class="service-cta">
            <a href="{{ url('/services/payroll-management') }}" class="btn-service-primary">Book Now</a>
            <button class="btn-expand" data-expand="payroll">
              <span>Learn More</span>
              <svg class="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div class="service-expanded-content" id="expand-payroll">
          <div class="expanded-inner">
            <h3>Key Features</h3>
            <ul class="features-list">
              <li>Automated salary calculations</li>
              <li>Tax deductions & compliance</li>
              <li>Employee self-service portal</li>
              <li>Bank file generation</li>
              <li>Payslip distribution</li>
              <li>Year-end tax reports</li>
            </ul>
            <div class="expanded-cta">
              <a href="#" class="btn-demo">Get a Quote</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Service 3: Recruitment & Staffing -->
      <div class="service-card-premium" id="recruitment" data-category="hr">
        <div class="service-card-inner">
          <div class="service-icon-premium">
            <img src="{{ asset('assets/services icons/recruitment.gif') }}" alt="Recruitment & Staffing" />
          </div>
          <div class="service-content">
            <div class="service-header-group">
              <h2 class="service-title">Recruitment & Staffing</h2>
            </div>
            <p class="service-description">
              End-to-end recruitment solutions from job posting to candidate onboarding.
              Includes ATS integration, screening, interviews, and offer management.
            </p>

            <div class="service-benefits">
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Faster hiring by 50%</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Better candidate quality</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>30% cost reduction</span>
              </div>
            </div>

            <div class="service-meta">
              <span class="service-use-case">Best for startups and growing teams</span>
              <span class="service-trust">• Placed 500+ candidates</span>
            </div>
          </div>
          <div class="service-cta">
            <a href="{{ url('/services/recruitment-staffing') }}" class="btn-service-primary">Book Now</a>
            <button class="btn-expand" data-expand="recruitment">
              <span>Learn More</span>
              <svg class="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div class="service-expanded-content" id="expand-recruitment">
          <div class="expanded-inner">
            <h3>Our Process</h3>
            <ul class="features-list">
              <li>Job description consultation</li>
              <li>Multi-channel candidate sourcing</li>
              <li>Resume screening & shortlisting</li>
              <li>Interview coordination</li>
              <li>Background verification</li>
              <li>Onboarding support</li>
            </ul>
            <div class="expanded-cta">
              <a href="#" class="btn-demo">Start Hiring</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Service 4: End-to-End HR Services -->
      <div class="service-card-premium" id="hr-services" data-category="consulting">
        <div class="service-card-inner">
          <div class="service-icon-premium">
            <img src="{{ asset('assets/services icons/end-to-end.gif') }}" alt="End-to-End HR Services" />
          </div>
          <div class="service-content">
            <div class="service-header-group">
              <h2 class="service-title">End-to-End HR Services</h2>
            </div>
            <p class="service-description">
              Complete HR outsourcing for organizations looking to delegate their entire
              HR function. Includes strategy, compliance, operations, and employee relations.
            </p>

            <div class="service-benefits">
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Full HR team access</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>60% cost vs in-house</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Scalable & flexible</span>
              </div>
            </div>

            <div class="service-meta">
              <span class="service-use-case">For companies wanting dedicated HR expertise</span>
              <span class="service-trust">• Trusted by SMEs & enterprises</span>
            </div>
          </div>
          <div class="service-cta">
            <a href="{{ url('/services/hr-services') }}" class="btn-service-primary">Book Now</a>
            <button class="btn-expand" data-expand="hr-services">
              <span>Learn More</span>
              <svg class="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div class="service-expanded-content" id="expand-hr-services">
          <div class="expanded-inner">
            <h3>Comprehensive Coverage</h3>
            <ul class="features-list">
              <li>HR strategy & planning</li>
              <li>Policy development</li>
              <li>Employee lifecycle management</li>
              <li>Compliance & legal support</li>
              <li>Training & development</li>
              <li>Employee engagement programs</li>
            </ul>
            <div class="expanded-cta">
              <a href="#" class="btn-demo">Discuss Your Needs</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Service 5: CRM Solutions -->
      <div class="service-card-premium" id="crm" data-category="tech">
        <div class="service-card-inner">
          <div class="service-icon-premium">
            <img src="{{ asset('assets/services icons/crm.gif') }}" alt="CRM Solutions" />
          </div>
          <div class="service-content">
            <div class="service-header-group">
              <h2 class="service-title">CRM Solutions</h2>
              <span class="service-badge badge-tech">New</span>
            </div>
            <p class="service-description">
              Customer relationship management platform to track leads, manage pipelines,
              automate follow-ups, and boost your sales performance with data-driven insights.
            </p>

            <div class="service-benefits">
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>35% higher conversions</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Never miss a follow-up</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>360° customer view</span>
              </div>
            </div>

            <div class="service-meta">
              <span class="service-use-case">Perfect for sales-driven organizations</span>
              <span class="service-trust">• Cloud-based & secure</span>
            </div>
          </div>
          <div class="service-cta">
            <a href="{{ url('/services/crm-solutions') }}" class="btn-service-primary">Book Now</a>
            <button class="btn-expand" data-expand="crm">
              <span>Learn More</span>
              <svg class="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div class="service-expanded-content" id="expand-crm">
          <div class="expanded-inner">
            <h3>Powerful Features</h3>
            <ul class="features-list">
              <li>Lead capture & tracking</li>
              <li>Sales pipeline management</li>
              <li>Email automation</li>
              <li>Contact management</li>
              <li>Reporting & analytics</li>
              <li>Mobile CRM app</li>
            </ul>
            <div class="expanded-cta">
              <a href="#" class="btn-demo">Try Free Demo</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Service 6: Web Development -->
      <div class="service-card-premium" id="web-dev" data-category="tech">
        <div class="service-card-inner">
          <div class="service-icon-premium">
            <img src="{{ asset('assets/services icons/web-developer.gif') }}" alt="Web Development" />
          </div>
          <div class="service-content">
            <div class="service-header-group">
              <h2 class="service-title">Web Development</h2>
            </div>
            <p class="service-description">
              High-performance, responsive websites and web applications built with modern
              technologies. From landing pages to complex SaaS platforms.
            </p>

            <div class="service-benefits">
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Lightning-fast performance</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Mobile-first design</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>SEO optimized</span>
              </div>
            </div>

            <div class="service-meta">
              <span class="service-use-case">For businesses wanting a strong online presence</span>
              <span class="service-trust">• 50+ websites delivered</span>
            </div>
          </div>
          <div class="service-cta">
            <a href="{{ url('/services/web-development') }}" class="btn-service-primary">Book Now</a>
            <button class="btn-expand" data-expand="web-dev">
              <span>Learn More</span>
              <svg class="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div class="service-expanded-content" id="expand-web-dev">
          <div class="expanded-inner">
            <h3>Technology Stack</h3>
            <ul class="features-list">
              <li>React, Next.js, Vue.js</li>
              <li>Node.js, Python backends</li>
              <li>Responsive & PWA</li>
              <li>E-commerce integration</li>
              <li>API development</li>
              <li>Hosting & maintenance</li>
            </ul>
            <div class="expanded-cta">
              <a href="#" class="btn-demo">View Portfolio</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Service 7: Logo & Branding -->
      <div class="service-card-premium" id="branding" data-category="tech">
        <div class="service-card-inner">
          <div class="service-icon-premium">
            <img src="{{ asset('assets/services icons/logo-branding.gif') }}" alt="Logo & Branding" />
          </div>
          <div class="service-content">
            <div class="service-header-group">
              <h2 class="service-title">Logo & Branding</h2>
            </div>
            <p class="service-description">
              Complete brand identity design including logos, color schemes, typography,
              brand guidelines, and marketing collateral for consistent visual storytelling.
            </p>

            <div class="service-benefits">
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Memorable brand identity</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Professional consistency</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Unlimited revisions</span>
              </div>
            </div>

            <div class="service-meta">
              <span class="service-use-case">Ideal for startups & rebranding projects</span>
              <span class="service-trust">• Award-winning designs</span>
            </div>
          </div>
          <div class="service-cta">
            <a href="{{ url('/services/logo-branding') }}" class="btn-service-primary">Book Now</a>
            <button class="btn-expand" data-expand="branding">
              <span>Learn More</span>
              <svg class="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div class="service-expanded-content" id="expand-branding">
          <div class="expanded-inner">
            <h3>Deliverables</h3>
            <ul class="features-list">
              <li>Custom logo design (3+ concepts)</li>
              <li>Brand style guide</li>
              <li>Business card design</li>
              <li>Letterhead & stationery</li>
              <li>Social media templates</li>
              <li>Source files (AI, PSD, SVG)</li>
            </ul>
            <div class="expanded-cta">
              <a href="#" class="btn-demo">See Examples</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Service 8: Custom Software -->
      <div class="service-card-premium" id="custom-soft" data-category="tech">
        <div class="service-card-inner">
          <div class="service-icon-premium">
            <img src="{{ asset('assets/services icons/custom-soft.gif') }}" alt="Custom Software" />
          </div>
          <div class="service-content">
            <div class="service-header-group">
              <h2 class="service-title">Custom Software Development</h2>
            </div>
            <p class="service-description">
              Tailor-made software solutions built from scratch to match your unique business
              processes, workflows, and requirements. Enterprise-grade & scalable.
            </p>

            <div class="service-benefits">
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Perfect fit for your needs</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Competitive advantage</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Long-term ROI</span>
              </div>
            </div>

            <div class="service-meta">
              <span class="service-use-case">For businesses with unique operational needs</span>
              <span class="service-trust">• Serving enterprises & SMEs</span>
            </div>
          </div>
          <div class="service-cta">
            <a href="{{ url('/services/custom-software') }}" class="btn-service-primary">Book Now</a>
            <button class="btn-expand" data-expand="custom-soft">
              <span>Learn More</span>
              <svg class="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div class="service-expanded-content" id="expand-custom-soft">
          <div class="expanded-inner">
            <h3>Development Process</h3>
            <ul class="features-list">
              <li>Requirements analysis</li>
              <li>UI/UX design & prototyping</li>
              <li>Agile development</li>
              <li>Quality assurance & testing</li>
              <li>Deployment & training</li>
              <li>Ongoing support</li>
            </ul>
            <div class="expanded-cta">
              <a href="#" class="btn-demo">Discuss Your Project</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Service 9: IT Support & Maintenance -->
      <div class="service-card-premium" id="it-support" data-category="tech">
        <div class="service-card-inner">
          <div class="service-icon-premium">
            <img src="{{ asset('assets/services icons/It.gif') }}" alt="IT Support & Maintenance" />
          </div>
          <div class="service-content">
            <div class="service-header-group">
              <h2 class="service-title">IT Support & Maintenance</h2>
            </div>
            <p class="service-description">
              Reliable IT infrastructure management, cybersecurity, helpdesk support,
              server maintenance, and 24/7 monitoring for uninterrupted business operations.
            </p>

            <div class="service-benefits">
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>99.9% uptime guarantee</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>24/7 monitoring</span>
              </div>
              <div class="benefit-item">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <span>Proactive security</span>
              </div>
            </div>

            <div class="service-meta">
              <span class="service-use-case">Essential for all modern businesses</span>
              <span class="service-trust">• ISO certified team</span>
            </div>
          </div>
          <div class="service-cta">
            <a href="{{ url('/services/it-support') }}" class="btn-service-primary">Book Now</a>
            <button class="btn-expand" data-expand="it-support">
              <span>Learn More</span>
              <svg class="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div class="service-expanded-content" id="expand-it-support">
          <div class="expanded-inner">
            <h3>Support Services</h3>
            <ul class="features-list">
              <li>Helpdesk ticketing system</li>
              <li>Network & server management</li>
              <li>Data backup & recovery</li>
              <li>Cybersecurity & firewall</li>
              <li>Software updates & patches</li>
              <li>Remote & on-site support</li>
            </ul>
            <div class="expanded-cta">
              <a href="#" class="btn-demo">Get Support Plan</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ================= TRUST SECTION ================= -->
  <section class="trust-section">
    <div class="container">
      <h2 class="section-title-center">Trusted by Industry Leaders</h2>
      <div class="trust-stats">
        <div class="trust-stat-item">
          <div class="trust-stat-number">100+</div>
          <div class="trust-stat-label">Happy Clients</div>
        </div>
        <div class="trust-stat-item">
          <div class="trust-stat-number">500+</div>
          <div class="trust-stat-label">Projects Delivered</div>
        </div>
        <div class="trust-stat-item">
          <div class="trust-stat-number">98%</div>
          <div class="trust-stat-label">Client Satisfaction</div>
        </div>
        <div class="trust-stat-item">
          <div class="trust-stat-number">3+</div>
          <div class="trust-stat-label">Years of Excellence</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= FINAL CTA ================= -->
  <section class="final-cta-section">
    <div class="container-narrow">
      <div class="final-cta-content">
        <h2 class="final-cta-title">Not sure which service you need?</h2>
        <p class="final-cta-subtitle">
          Our team of experts is here to help you find the perfect solution for your business.
          Book a free 30-minute consultation and let's discuss your goals.
        </p>
        <div class="final-cta-actions">
          <a href="{{ url('/contact') }}" class="btn-cta-primary">Talk to Our Team</a>
          <a href="#" class="btn-cta-secondary">View Case Studies</a>
        </div>
        <p class="final-cta-note">✓ No commitment required • ✓ Free consultation • ✓ Same-day response</p>
      </div>
    </div>
  </section>

  <!-- ================= FLOATING CTA ================= -->
  <div class="floating-cta">
    <a href="{{ url('/contact') }}" class="floating-cta-btn" id="floatingCta" style="text-decoration: none;">
      <svg class="cta-icon" viewBox="0 0 20 20" fill="currentColor">
        <path
          d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
      <span>Get Free Consultation</span>
    </a>
  </div>

  @endsection           