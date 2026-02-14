@extends('layouts.app')

@section('title', 'Custom Software – MineHR Solutions')

@section('content')
    <!-- ================= HERO SECTION ================= -->
    <section class="service-detail-hero">
        <div class="container">
            <h1 class="hero-title">Custom Software Development</h1>
            <p class="hero-subtitle">Bespoke software solutions crafted to fit your unique business needs.</p>
        </div>
    </section>

    <!-- ================= CONTENT SECTION ================= -->
    <section class="service-detail-content">
        <div class="container">
            <h2>Solutions That Fit Perfectly</h2>
            <p>Every business is unique, and sometimes off-the-shelf software just doesn't fit. Our custom software
                development service builds scalable, enterprise-grade applications from the ground up, tailored
                specifically to your workflows and business goals. We solve complex problems with elegant code.</p>

            <div class="service-image-grid">
                <img src="{{ asset('assets/software_architecture.png') }}" alt="Custom Server Solutions" class="service-img">
                <img src="{{ asset('assets/web_coding.png') }}" alt="Code Development" class="service-img">
            </div>

            <h3>Our Development Process</h3>
            <ol>
                <li><strong>Requirements Analysis:</strong> We conduct workshops to deeply understand your business
                    logic, pain points, and user needs.</li>
                <li><strong>UI/UX Design & Prototyping:</strong> We create interactive prototypes to visualize the
                    solution before writing a single line of code.</li>
                <li><strong>Agile Development:</strong> We use Scrum/Kanban methodologies with 2-week sprints, ensuring
                    regular feedback and flexibility.</li>
                <li><strong>Quality Assurance (QA):</strong> Rigorous manual and automated testing to ensure a bug-free,
                    secure, and performant product.</li>
                <li><strong>Deployment & Training:</strong> Smooth rollout to your servers and comprehensive training
                    for your staff.</li>
                <li><strong>Maintenance & Support:</strong> We don't just leave; we provide ongoing updates, bug fixes,
                    and improvements.</li>
            </ol>

            <h3>Why Go Custom?</h3>
            <ul>
                <li><strong>Competitive Advantage:</strong> Unique features that your competitors don't have.</li>
                <li><strong>Scalability:</strong> Built to grow with your business, handling millions of users if
                    needed.</li>
                <li><strong>Ownership:</strong> You own the code and IP, unlike rented SaaS solutions.</li>
                <li><strong>Integration:</strong> Seamlessly connects with your existing tools (ERP, CRM, Accounting).
                </li>
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
