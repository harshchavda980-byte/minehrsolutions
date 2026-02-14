@extends('layouts.app')

@section('title', 'Web Development – MineHR Solutions')

@section('content')
    <!-- ================= HERO SECTION ================= -->
    <section class="service-detail-hero">
        <div class="container">
            <h1 class="hero-title">Web Development</h1>
            <p class="hero-subtitle">Creating digital experiences that are fast, modern, and user-centric.</p>
        </div>
    </section>

    <!-- ================= CONTENT SECTION ================= -->
    <section class="service-detail-content">
        <div class="container">
            <h2>Expert Web Solutions</h2>
            <p>In the digital age, your website is your most powerful marketing tool. It’s often the first interaction a
                potential customer has with your brand. We design and develop high-performance, responsive websites and
                web applications tailored to your business goals. From simple landing pages that convert to complex SaaS
                platforms that scale, we’ve got you covered.</p>

            <div class="service-image-grid">
                <img src="{{ asset('assets/web_coding.png') }}" alt="Web Development Coding" class="service-img">
                <img src="{{ asset('assets/server_room.png') }}" alt="Server Architecture" class="service-img">
            </div>

            <h3>Our Technology Stack</h3>
            <p>We use the latest technologies to ensure your site is fast, secure, and future-proof.</p>
            <ul>
                <li><strong>Frontend:</strong> React.js, Next.js, Vue.js, Tailwind CSS for dynamic and interactive user
                    interfaces.</li>
                <li><strong>Backend:</strong> Node.js, Python (Django/Flask), PHP (Laravel) for robust server-side logic
                    and API management.</li>
                <li><strong>Database:</strong> PostgreSQL, MongoDB, MySQL for secure and scalable data storage.</li>
                <li><strong>Mobile-First:</strong> Every site we build is responsive by default, looking perfect on
                    phones, tablets, and desktops.</li>
            </ul>

            <h3>Performance & SEO</h3>
            <p>A beautiful site is useless if no one sees it. We prioritize speed (Core Web Vitals) and technical Search
                Engine Optimization (SEO) from the very first line of code. This ensures your website ranks higher on
                Google, loads instantly, and retains more visitors.</p>

            <h3>Our Process</h3>
            <ol>
                <li><strong>Discovery:</strong> Understanding your audience and goals.</li>
                <li><strong>Design:</strong> Creating wireframes and high-fidelity mockups.</li>
                <li><strong>Development:</strong> Clean, semantic coding.</li>
                <li><strong>Testing:</strong> Cross-browser and device testing.</li>
                <li><strong>Launch:</strong> Deployment and post-launch support.</li>
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
