@extends('layouts.app')

@section('title', 'CRM Solutions – MineHR Solutions')

@section('content')
    <!-- ================= HERO SECTION ================= -->
    <section class="service-detail-hero">
        <div class="container">
            <h1 class="hero-title">CRM Solutions</h1>
            <p class="hero-subtitle">Boost sales and manage customer relationships effortlessly.</p>
        </div>
    </section>

    <!-- ================= CONTENT SECTION ================= -->
    <section class="service-detail-content">
        <div class="container">
            <h2>Smart Customer Relationship Management (CRM)</h2>
            <p>Transform how you interact with customers using our powerful CRM platform. Designed for modern sales
                teams, it helps you track every interaction, manage leads, and close deals faster. Stop losing sales to
                disorganization and start building lasting relationships.</p>

            <div class="service-image-grid">
                <img src="{{ asset('assets/sales_meeting.png') }}" alt="Sales Analytics" class="service-img">
                <img src="{{ asset('assets/crm_dashboard_laptop.png') }}" alt="Customer Success" class="service-img">
            </div>

            <h3>Why You Need a CRM</h3>
            <p>In today's competitive market, knowing your customer is everything. Our CRM centralizes all customer
                data, communication history, and sales pipeline information into one intuitive dashboard.</p>

            <h3>Powerful Features</h3>
            <ul>
                <li><strong>Lead Capture & Tracking:</strong> Automatically capture leads from your website, email, and
                    social media. Assign them to sales reps instantly.</li>
                <li><strong>Visual Pipeline Management:</strong> Drag-and-drop deals across stages (New, Qualified,
                    Proposal, Won) to visualize your sales funnel.</li>
                <li><strong>Email Automation:</strong> Set up automated follow-up sequences and nurture campaigns to
                    keep leads warm without manual effort.</li>
                <li><strong>Contact Management:</strong> Store unlimited contacts with custom fields. View complete
                    history of calls, emails, and notes.</li>
                <li><strong>Advanced Reporting:</strong> Get real-time reports on sales performance, conversion rates,
                    and revenue forecasts.</li>
                <li><strong>Mobile CRM App:</strong> Access your data from anywhere. Log calls and update deals on the
                    go.</li>
            </ul>

            <h3>Results that Matter</h3>
            <p>Our CRM is proven to increase conversion rates by 35% by ensuring you never miss a follow-up. Gain a
                complete 360-degree view of your customers and drive growth with data-backed decisions.</p>

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
