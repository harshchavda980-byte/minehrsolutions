@extends('layouts.app')

@section('title', 'MineHR Solutions - Home')

@section('content')
    <section class="hero-banner">
    <div class="hero-inner">
      <div class="hero-content">

        <h1>
          Smart HR & Payroll for <br />
          <span class="animated-words">
            <span>Growing Businesses</span>
            <span>Startups</span>
            <span>Modern Teams</span>
            <span>Enterprises</span>
          </span>
        </h1>

        <p class="hero-typing">
          <span id="hero-typing-text"></span>
          <span id="hero-cursor">|</span>
        </p>

        <div id="hero-signature" class="hero-signature">
          — MineHR Solutions.
        </div>

      </div>
    </div>
  </section>


  <!-- ================= STATS ================= -->
  <section class="stats-section">
    <div class="stats-container">
      <h2 class="stats-title">Boosting Businesses</h2>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number" data-target="1800">0</div>
          <div class="stat-label">Payrolls Processed</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" data-target="48">0</div>
          <div class="stat-label">YoY Growth (%)</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" data-target="11">0</div>
          <div class="stat-label">Business Partners</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" data-target="3">0</div>
          <div class="stat-label">Years of Experience</div>
        </div>
      </div>
    </div>
  </section>



  <!-- ================= WHY CHOOSE ================= -->
  <section class="why-section">
    <div class="why-container">

      <h2 class="why-title">Why Choose MineHR?</h2>

      <p class="why-desc">
        MineHR Solutions is a technology-driven HR services company providing complete workforce and business management
        solutions.
        We specialize in HRMS & Payroll software, web development, CRM solutions, recruitment services, and end-to-end
        HR operations support.
      </p>

      <div class="why-cards">
        <!-- Card 1 -->
        <div class="why-card">
          <div class="card-header">
            <!-- Icon: Clipboard Check (Compliance) -->
            <svg class="card-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div class="card-body">
            <h3>Compliance Expertise</h3>
            <p>PF, ESI, TDS, labour laws handled accurately.</p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="why-card">
          <div class="card-header">
            <!-- Icon: User / Support -->
            <svg class="card-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="card-body">
            <h3>Dedicated HR Support</h3>
            <p>Real HR professionals, not just software.</p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="why-card">
          <div class="card-header">
            <!-- Icon: Cost / Wallet -->
            <svg class="card-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="card-body">
            <h3>Cost Effective</h3>
            <p>Affordable plans for startups & SMEs.</p>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="why-card">
          <div class="card-header">
            <!-- Icon: Secure Data / Shield Lock -->
            <svg class="card-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="card-body">
            <h3>Secure Data</h3>
            <p>Payroll & employee data fully protected.</p>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ================= SERVICES ================= -->
  <section class="services-section">
    <div class="services-container services-grid">

      <div class="services-text">
        <h2 class="services-title">Our Services</h2>
        <p class="services-desc">
          Our goal is to help businesses simplify HR processes, improve efficiency, and scale faster through smart
          technology and expert HR services.
          We work with startups, SMEs, and growing organizations to deliver customized, reliable, and cost-effective
          solutions.
        </p>
        <a href="#" class="services-btn">Book Now</a>
      </div>

      <div class="services-image">
        <img src="assets/db-ourservicees.jpg" alt="Dashboard Preview" />
      </div>

    </div>
  </section>

  <!-- ================= SERVICES SCROLL ================= -->
  <section class="services-scroll-section">
    <div class="services-scroll-container">
      <!-- Service 1: HRMS Software -->
      <div class="why-card service-card-scroll">
        <div class="card-header">
          <div class="card-icon">
            <img src="assets/services%20icons/hrms.gif" alt="HRMS Software"
              style="width:100%; height:100%; object-fit:contain;" />
          </div>
        </div>
        <div class="card-body">
          <h3>HRMS Software</h3>
          <p>Smart HRMS with attendance, leave, employee lifecycle, and analytics.</p>
          <a href="#" class="card-btn">Book Now</a>
        </div>
      </div>

      <!-- Service 2: Payroll Management -->
      <div class="why-card service-card-scroll">
        <div class="card-header">
          <div class="card-icon">
            <img src="assets/services%20icons/payroll.gif" alt="Payroll Management"
              style="width:100%; height:100%; object-fit:contain;" />
          </div>
        </div>
        <div class="card-body">
          <h3>Payroll Management</h3>
          <p>Accurate payroll, tax compliance, payslips, and automated calculations.</p>
          <a href="#" class="card-btn">Book Now</a>
        </div>
      </div>

      <!-- Service 3: Recruitment & Staffing -->
      <div class="why-card service-card-scroll">
        <div class="card-header">
          <div class="card-icon">
            <img src="assets/services%20icons/recruitment.gif" alt="Recruitment & Staffing"
              style="width:100%; height:100%; object-fit:contain;" />
          </div>
        </div>
        <div class="card-body">
          <h3>Recruitment & Staffing</h3>
          <p>End-to-end hiring solutions from sourcing to onboarding.</p>
          <a href="#" class="card-btn">Book Now</a>
        </div>
      </div>

      <!-- Service 4: End-to-End HR Services -->
      <div class="why-card service-card-scroll">
        <div class="card-header">
          <div class="card-icon">
            <img src="assets/services%20icons/end-to-end.gif" alt="End-to-End HR Services"
              style="width:100%; height:100%; object-fit:contain;" />
          </div>
        </div>
        <div class="card-body">
          <h3>End-to-End HR Services</h3>
          <p>Complete HR outsourcing for growing organizations.</p>
          <a href="#" class="card-btn">Book Now</a>
        </div>
      </div>

      <!-- Service 5: CRM Solutions -->
      <div class="why-card service-card-scroll">
        <div class="card-header">
          <div class="card-icon">
            <img src="assets/services%20icons/crm.gif" alt="CRM Solutions"
              style="width:100%; height:100%; object-fit:contain;" />
          </div>
        </div>
        <div class="card-body">
          <h3>CRM Solutions</h3>
          <p>Customer relationship tools to track leads and boost sales.</p>
          <a href="#" class="card-btn">Book Now</a>
        </div>
      </div>

      <!-- Service 6: Web Development -->
      <div class="why-card service-card-scroll">
        <div class="card-header">
          <div class="card-icon">
            <img src="assets/services%20icons/web-developer.gif" alt="Web Development"
              style="width:100%; height:100%; object-fit:contain;" />
          </div>
        </div>
        <div class="card-body">
          <h3>Web Development</h3>
          <p>High-performance, responsive websites with modern tech stack.</p>
          <a href="#" class="card-btn">Book Now</a>
        </div>
      </div>

      <!-- Service 7: Logo & Branding -->
      <div class="why-card service-card-scroll">
        <div class="card-header">
          <div class="card-icon">
            <img src="assets/services%20icons/logo-branding.gif" alt="Logo & Branding"
              style="width:100%; height:100%; object-fit:contain;" />
          </div>
        </div>
        <div class="card-body">
          <h3>Logo & Branding</h3>
          <p>Brand identity, logos, UI kits, and visual storytelling.</p>
          <a href="#" class="card-btn">Book Now</a>
        </div>
      </div>

      <!-- Service 8: Custom Software -->
      <div class="why-card service-card-scroll">
        <div class="card-header">
          <div class="card-icon">
            <img src="assets/services%20icons/custom-soft.gif" alt="Custom Software"
              style="width:100%; height:100%; object-fit:contain;" />
          </div>
        </div>
        <div class="card-body">
          <h3>Custom Software</h3>
          <p>Tailor-made software solutions aligned with your business needs.</p>
          <a href="#" class="card-btn">Book Now</a>
        </div>
      </div>

      <!-- Service 9: IT Support & Maintenance -->
      <div class="why-card service-card-scroll">
        <div class="card-header">
          <div class="card-icon">
            <img src="assets/services%20icons/It.gif" alt="IT Support & Maintenance"
              style="width:100%; height:100%; object-fit:contain;" />
          </div>
        </div>
        <div class="card-body">
          <h3>IT Support & Maintenance</h3>
          <p>Reliable IT infrastructure, security, and ongoing support.</p>
          <a href="#" class="card-btn">Book Now</a>
        </div>
      </div>
    </div>
  </section>
@endsection
