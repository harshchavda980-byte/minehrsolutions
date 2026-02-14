@extends('layouts.app')

@section('title', 'Payroll Management – MineHR Solutions')

@section('content')
    <!-- ================= HERO SECTION ================= -->
    <section class="service-detail-hero">
        <div class="container">
            <h1 class="hero-title">Payroll Management</h1>
            <p class="hero-subtitle">Automated, error-free payroll for your peace of mind.</p>
        </div>
    </section>

    <!-- ================= CONTENT SECTION ================= -->
    <section class="service-detail-content">
        <div class="container">
            <h2>Efficient Payroll Processing</h2>
            <p>Ensure accuracy and compliance with our Payroll Management service. We handle everything from basic
                salary calculations to complex tax deductions, freeing you from cumbersome manual work. Our system is
                updated regularly to ensure 100% compliance with current government regulations.</p>

            <div class="service-image-grid">
                <img src="{{ asset('assets/payroll_calculation.png') }}" alt="Payroll Analytics" class="service-img">
                <img src="{{ asset('assets/tax_compliance.png') }}" alt="Payroll Processing" class="service-img">
            </div>

            <h3>Comprehensive Features</h3>
            <ul>
                <li><strong>Automated Calculation:</strong> Eliminate human error with precise salary computations based
                    on attendance and leave data.</li>
                <li><strong>Tax Compliance:</strong> Stay up-to-date with all statutory deductions, income tax slabs,
                    and labor laws.</li>
                <li><strong>Payslip Generation:</strong> Automatically generate and distribute secure digital payslips
                    to employees via email or portal.</li>
                <li><strong>Bank Integration:</strong> Seamlessly integrate with major bank portals for one-click direct
                    salary deposits.</li>
                <li><strong>Year-end Reports:</strong> Get detailed reports (Form 16, etc.) for tax filing and internal
                    audits.</li>
            </ul>

            <h3>Benefits</h3>
            <p>Our solution ensures 100% tax compliance and zero calculation errors. It is designed to save you at least
                20 hours monthly, making it the ideal choice for businesses with complex payroll needs.</p>

            <h3>How It Works</h3>
            <ol>
                <li><strong>Data Sync:</strong> We pull attendance and leave data from your HRMS.</li>
                <li><strong>Processing:</strong> Our engine calculates earnings, deductions, and taxes.</li>
                <li><strong>Review:</strong> You get a detailed sheet to review and approve.</li>
                <li><strong>Disbursement:</strong> Salaries are credited, and payslips are sent.</li>
            </ol>

            <div style="margin-top: 60px; text-align: center;">
                <a href="{{ url('/contact') }}" class="btn-book-now">Book Now</a>
                <br>
                <a href="{{ url('/services') }}" class="back-link" style="margin-top: 20px;">← Back to Services</a>
            </div>
        </div>
    </section>
@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const servicesLink = document.querySelector('a[href="{{ url('/services') }}"]');
                if (servicesLink) servicesLink.classList.add('active');
            }, 100);
        });
    </script>
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
