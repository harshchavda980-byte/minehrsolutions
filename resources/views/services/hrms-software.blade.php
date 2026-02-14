@extends('layouts.app')

@section('title', 'HRMS Software – MineHR Solutions')

@section('content')
    <!-- ================= HERO SECTION ================= -->
    <section class="service-detail-hero">
        <div class="container">
            <h1 class="hero-title">HRMS Software</h1>
            <p class="hero-subtitle">Comprehensive Human Resource Management System for the modern enterprise.</p>
        </div>
    </section>

    <!-- ================= CONTENT SECTION ================= -->
    <section class="service-detail-content">
        <div class="container">
            <h2>Complete HR Management</h2>
            <p>Our Human Resource Management System (HRMS) Software provides a complete, 360-degree solution for
                managing your workforce. In today's fast-paced business environment, manual HR processes are a
                bottleneck. Our digital solution automates the mundane, allowing your HR team to focus on strategic
                initiatives and employee well-being.</p>

            <div class="service-image-grid">
                <img src="{{ asset('assets/hr_meeting.png') }}" alt="HR Team Meeting" class="service-img">
                <img src="{{ asset('assets/hrms_dashboard.png') }}" alt="HRMS Dashboard" class="service-img">
            </div>

            <h3>Key Modules & Features</h3>
            <ul>
                <li><strong>Smart Attendance Tracking:</strong> Automated attendance marking with geolocation fencing
                    and biometric integration. Say goodbye to proxy attendance.</li>
                <li><strong>Leave Management:</strong> Simplified leave requests and approvals workflow. Employees can
                    apply for leave via mobile app, and managers can approve in one click.</li>
                <li><strong>Employee Lifecycle Management:</strong> Manage everything from onboarding to exit interviews
                    seamlessly. Keep digital records of all employee documents.</li>
                <li><strong>Payroll Integration:</strong> Directly link attendance and leave data to payroll for
                    error-free monthly salary processing.</li>
                <li><strong>Real-time Analytics:</strong> Interactive dashboard for instant insights into workforce
                    trends, attrition rates, and productivity metrics.</li>
            </ul>

            <h3>Why Choose Our HRMS?</h3>
            <p>Designed for companies with 10-500 employees, our system is trusted by over 80 businesses. It helps save
                15+ hours per week on administrative tasks, ensures 99.9% accuracy in records, and reduces overall admin
                costs by 40%.</p>

            <h3>Implementation Process</h3>
            <p>We ensure a smooth transition with our 4-step process:</p>
            <ol>
                <li><strong>Requirement Analysis:</strong> We map your current HR processes.</li>
                <li><strong>Data Migration:</strong> Securely move your existing employee data to our cloud.</li>
                <li><strong>Training:</strong> Comprehensive training sessions for your HR team and employees.</li>
                <li><strong>Go-Live & Support:</strong> Dedicated support manager to assist you during the launch.</li>
            </ol>

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
