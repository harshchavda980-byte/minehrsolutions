@extends('layouts.app')

@section('title', 'Recruitment & Staffing – MineHR Solutions')

@section('content')
    <!-- ================= HERO SECTION ================= -->
    <section class="service-detail-hero">
        <div class="container">
            <h1 class="hero-title">Recruitment & Staffing</h1>
            <p class="hero-subtitle">Comprehensive hiring solutions to find the best talent.</p>
        </div>
    </section>

    <!-- ================= CONTENT SECTION ================= -->
    <section class="service-detail-content">
        <div class="container">
            <h2>Expert Hiring Made Easy</h2>
            <p>Finding the right talent is crucial for business success. Our Recruitment & Staffing service covers the
                entire candidate journey, using advanced Applicant Tracking Systems (ATS) to streamline the process.
                From executive search to mass hiring, we ensure you get the right people for the right roles quickly and
                efficiently.</p>

            <div class="service-image-grid">
                <img src="{{ asset('assets/consulting.png') }}" alt="Successful Recruitment" class="service-img">
                <img src="{{ asset('assets/recruitment_interview.png') }}" alt="Candidate Interview" class="service-img">
            </div>

            <h3>Our Strategic Process</h3>
            <ul>
                <li><strong>Job Role Analysis:</strong> We work closely with your hiring managers to create accurate and
                    appealing job descriptions.</li>
                <li><strong>Multi-Channel Sourcing:</strong> Using diverse platforms (LinkedIn, Job Boards, Social
                    Media) to find hidden talent pools.</li>
                <li><strong>Advanced Screening:</strong> Rigorous pre-screening, aptitude tests, and initial interviews
                    to filter the best candidates.</li>
                <li><strong>Background Verification:</strong> Complete background checks (employment history, criminal
                    record) to ensure candidate integrity.</li>
                <li><strong>Onboarding Support:</strong> Assisting in offer negotiation and smooth integration of new
                    hires into your team culture.</li>
            </ul>

            <h3>Performance Stats</h3>
            <p>With over 500 successful placements across various industries, we help you hire 50% faster while reducing
                recruitment costs by 30%. Our focus on quality ensures long-term retention and higher team productivity.
            </p>

            <h3>Why Us?</h3>
            <ul>
                <li>Dedicated Account Managers</li>
                <li>Replacement Guarantee</li>
                <li>Extensive Talent Database</li>
            </ul>

            <div style="margin-top: 60px; text-align: center;">
                <a href="{{ url('/contact') }}" class="btn-book-now">Book Now</a>
                <br>
                <a href="{{ url('/services') }}" class="back-link" style="margin-top: 20px;">← Back to Services</a>
            </div>
        </div>
    </section>
@endsection

@push('styles')
    <style>
        .service-detail-hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 120px 0 60px;
            text-align: center;
        }

        .service-detail-content {
            padding: 60px 0;
            max-width: 900px;
            margin: 0 auto;
        }

        .service-detail-content h2 {
            font-size: 2.2rem;
            margin-bottom: 24px;
            color: #1e293b;
        }

        .service-detail-content h3 {
            font-size: 1.5rem;
            margin-top: 40px;
            margin-bottom: 16px;
            color: #334155;
        }

        .service-detail-content p {
            margin-bottom: 20px;
            line-height: 1.7;
            color: #475569;
            font-size: 1.05rem;
        }

        .service-detail-content ul,
        .service-detail-content ol {
            margin-bottom: 24px;
            padding-left: 20px;
        }

        .service-detail-content li {
            margin-bottom: 12px;
            color: #475569;
            line-height: 1.6;
        }

        .back-link {
            display: inline-block;
            margin-top: 20px;
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
        }

        .back-link:hover {
            text-decoration: underline;
        }

        .service-image-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 40px 0;
        }

        .service-img {
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            object-fit: cover;
            height: 300px;
        }

        @media (max-width: 768px) {
            .service-image-grid {
                grid-template-columns: 1fr;
            }
        }

        .btn-book-now {
            display: inline-block;
            padding: 16px 48px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
        }

        .btn-book-now:hover {
            background-color: #1d4ed8;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
        }
    </style>
@endpush
