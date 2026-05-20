@extends('layouts.app')

@section('title', 'IT Support & Maintenance – MineHR Solutions')

@section('content')
    <!-- ================= HERO SECTION ================= -->
    <section class="service-detail-hero">
        <div class="container">
            <h1 class="hero-title">IT Support & Maintenance</h1>
            <p class="hero-subtitle">Proactive IT management to keep your business running 24/7.</p>
        </div>
    </section>

    <!-- ================= CONTENT SECTION ================= -->
    <section class="service-detail-content">
        <div class="container">
            <h2>Reliable IT Operations</h2>
            <p>In the digital world, downtime costs money and reputation. Our IT Support & Maintenance services ensure
                your infrastructure is always securely managed and running smoothly. From helpdesk support to complex
                server management, we act as your dedicated IT department.</p>

            <div class="service-image-grid">
                <img src="{{ asset('assets/server_room.png') }}" alt="Datacenter Operations" class="service-img">
                <img src="{{ asset('assets/network_cabling.png') }}" alt="Hardware Support" class="service-img">
            </div>

            <h3>Our Service Portfolio</h3>
            <ul>
                <li><strong>24/7 Monitoring:</strong> We monitor your servers, networks, and applications
                    round-the-clock to detect issues before they impact your business.</li>
                <li><strong>Helpdesk Support:</strong> Instant assistance for your employees via phone, email, or chat
                    for hardware/software issues.</li>
                <li><strong>Data Backup & Recovery:</strong> Automated daily backups and robust disaster recovery plans
                    to safeguard your critical data against loss or ransomware.</li>
                <li><strong>Cybersecurity:</strong> Comprehensive protection including firewalls, antivirus, intrusion
                    detection, and regular vulnerability assessments.</li>
                <li><strong>Asset Management:</strong> Tracking and maintaining all hardware and software licenses to
                    optimize costs and compliance.</li>
                <li><strong>Cloud Management:</strong> Expert management of AWS, Azure, or Google Cloud environments to
                    ensure performance and cost efficiency.</li>
            </ul>

            <h3>Why Partner with Us?</h3>
            <ul>
                <li>99.9% Uptime Guarantee</li>
                <li>Certified Experts (CCNA, AWS, Microsoft)</li>
                <li>Predictable Monthly Pricing</li>
                <li>Fast Response Times (Less than 15 mins for critical issues)</li>
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
