@extends('layouts.app')

@section('title', 'End-to-End HR Services – MineHR Solutions')

@section('content')
    <!-- ================= HERO SECTION ================= -->
    <section class="service-detail-hero">
        <div class="container">
            <h1 class="hero-title">End-to-End HR Services</h1>
            <p class="hero-subtitle">Comprehensive HR outsourcing for complete peace of mind.</p>
        </div>
    </section>

    <!-- ================= CONTENT SECTION ================= -->
    <section class="service-detail-content">
        <div class="container">
            <h2>Your Full-Service HR Partner</h2>
            <p>Outsource your entire HR function to us and focus on your core business. We cover everything from setting
                HR strategies to managing day-to-day operations. Whether you are a startup without an HR team or a large
                enterprise needing specialized support, our End-to-End solutions are designed to scale with you.</p>

            <div class="service-image-grid">
                <img src="{{ asset('assets/hr_strategy_board.png') }}" alt="HR Consulting" class="service-img">
                <img src="{{ asset('assets/analytics.png') }}" alt="Strategic Planning" class="service-img">
            </div>

            <h3>Scope of Services</h3>
            <ul>
                <li><strong>Strategy & Planning:</strong> Aligning human resource goals with your long-term business
                    objectives.</li>
                <li><strong>Policy Development:</strong> Creating clear, fair, and legally sound company handbooks and
                    policies.</li>
                <li><strong>Employee Lifecycle:</strong> Managing the complete journey from hiring, onboarding,
                    engagement, to retirement/exit.</li>
                <li><strong>Compliance & Legal:</strong> Navigating complex labor laws, PF, ESIC compliance, and
                    statutory filings.</li>
                <li><strong>Training & Development:</strong> Identifying skill gaps and conducting training programs to
                    upskill your workforce.</li>
                <li><strong>Employee Relations:</strong> Managing grievances, fostering a positive work culture, and
                    improving retention.</li>
            </ul>

            <h3>Business Impact</h3>
            <p>Gain access to a full team of HR experts (Generalists, Recruiters, Payroll Specialists, Legal Advisors)
                at 60% less cost compared to building an in-house department. Our scalable solutions grow with you,
                providing flexibility and expertise when you need it most.</p>

            <h3>Client Success Story</h3>
            <p>We helped a mid-sized logistics firm reduce their attrition rate by 25% within 6 months through our
                structured employee engagement and policy revamps.</p>

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
