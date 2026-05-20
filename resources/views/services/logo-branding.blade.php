@extends('layouts.app')

@section('title', 'Logo & Branding – MineHR Solutions')

@section('content')
    <!-- ================= HERO SECTION ================= -->
    <section class="service-detail-hero">
        <div class="container">
            <h1 class="hero-title">Logo & Branding</h1>
            <p class="hero-subtitle">Visual identity that tells your story and connects with your audience.</p>
        </div>
    </section>

    <!-- ================= CONTENT SECTION ================= -->
    <section class="service-detail-content">
        <div class="container">
            <h2>Building Iconic Brands</h2>
            <p>Your brand is more than just a logo; it's the soul of your business. It's the gut feeling your customers
                have when they think of you. Our Logo & Branding service helps you craft a unique, professional visual
                identity that stands out in a crowded market and builds instant trust with your audience.</p>

            <div class="service-image-grid">
                <img src="{{ asset('assets/branding_mockup.png') }}" alt="Brand Identity Design" class="service-img">
                <img src="{{ asset('assets/designer_working.png') }}" alt="Logo Design Process" class="service-img">
            </div>

            <h3>Our Branding Package</h3>
            <p>We provide a comprehensive kit that ensures brand consistency across all touchpoints.</p>
            <ul>
                <li><strong>Logo Design:</strong> 3-5 unique concepts with unlimited revisions until you are 100%
                    satisfied.</li>
                <li><strong>Brand Guidelines:</strong> A "Brand Bible" defining your color palette, typography (Google
                    Fonts), and logo usage rules.</li>
                <li><strong>Stationery Design:</strong> Professional business cards, letterheads, and envelope designs.
                </li>
                <li><strong>Social Media Kit:</strong> Profile and cover images for LinkedIn, Facebook, and Instagram to
                    keep you looking sharp online.</li>
                <li><strong>Marketing Assets:</strong> Templates for brochures, flyers, or digital ads that align with
                    your new look.</li>
            </ul>

            <h3>Our Creative Process</h3>
            <ol>
                <li><strong>Discovery:</strong> We learn about your mission, values, and target demographic.</li>
                <li><strong>Sketching:</strong> Our artists brainstorm and sketch dozens of raw ideas.</li>
                <li><strong>Vectorizing:</strong> Bringing the best concepts to life using professional design tools.
                </li>
                <li><strong>Presentation:</strong> We present the concepts and explain the rationale behind each.</li>
                <li><strong>Finalization:</strong> Delivering files in all formats (AI, PNG, SVG, JPG, PDF).</li>
            </ol>

            <h3>Why a Solid Brand Matters</h3>
            <p>A professional brand identity can increase your perceived value by up to 80%. It makes your business
                memorable, fosters loyalty, and makes your marketing efforts significantly more effective.</p>

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
