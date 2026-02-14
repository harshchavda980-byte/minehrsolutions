@extends('layouts.app')

@section('title', 'Contact Us | MineHR')
@push('styles')
    <link rel="stylesheet" href="{{ asset('css/contact.css') }}">
@endpush

@section('content')
    <div class="contact-split">
        <!-- LEFT CARD -->
        <div class="contact-left-card">
            <div class="left-slider">
                <!-- SLIDE 1 -->
                <div class="left-slide active">
                    <h4 class="small-title">GET IN TOUCH</h4>
                    <h1 class="main-title">Let’s Talk About Your HR Needs</h1>
                    <p class="intro">
                        Tell us about your company and challenges — our HR experts will guide you with the right solution.
                    </p>
                    <div class="feature-list">
                        <div class="feature-item">✔ Indian compliance expertise — Payroll, labour laws & statutory support</div>
                        <div class="feature-item">✔ Dedicated HR professionals — Hands-on support for growing teams</div>
                        <div class="feature-item">✔ Transparent pricing — No hidden costs, clear plans</div>
                    </div>
                    <button id="continueBtn" class="primary-btn">Continue →</button>
                    <p class="support-text">
                        Or email us directly at <a href="mailto:info@corehrx.in">info@corehrx.in</a>
                    </p>
                </div>

                <!-- SLIDE 2 -->
                <div class="left-slide">
                    <h4 class="small-title">GET IN TOUCH</h4>
                    <h1 class="main-title">Let’s Chat, Reach Out to Us</h1>
                    <p class="intro">Have questions or feedback? We’re here to help.</p>

                    @if(session('success'))
                        <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                            {{ session('success') }}
                        </div>
                    @endif

                    <form action="{{ route('contact.store') }}" method="POST" class="contact-form">
                        @csrf
                        <div class="row">
                            <input type="text" name="name" placeholder="Name" required>
                            <input type="email" name="email" placeholder="Email address" required>
                        </div>
                        <div class="row">
                            <input type="text" name="company" placeholder="Company Name">
                            <input type="tel" name="contact_number" placeholder="Contact Number" maxlength="10" required>
                        </div>
                        <textarea name="message" placeholder="Your message" rows="5" required></textarea>
                        <div class="form-footer">
                            <div class="checkbox-row">
                                <input type="checkbox" id="privacy" required>
                                <label for="privacy">I agree to the privacy policy</label>
                            </div>
                            <button type="submit" class="submit-btn">Send Message →</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- RIGHT IMAGE -->
        <div class="image-wrapper">
            <img src="{{ asset('images/hr-team.png') }}" alt="MineHR Team">
            <div class="image-blur"></div>
            <div class="image-text">
                <span>📍 Location Ahmedabad, Gujarat – India</span>
                <span>📧 Email info@corehrx.in</span>
                <span>📞 Phone +91 9XXXXXXXXX</span>
            </div>
            <div class="contact-map">
                <iframe src="https://www.google.com/maps?q=Ahmedabad,Gujarat,India&output=embed" allowfullscreen="" loading="lazy"></iframe>
            </div>
        </div>
    </div>
@endsection
