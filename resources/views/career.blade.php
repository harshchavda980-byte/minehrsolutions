@extends('layouts.app')

@section('content')
@push('styles')
<link rel="stylesheet" href="{{ asset('css/career.css') }}">
@endpush
@push('scripts')
<script src="{{ asset('js/career.js') }}"></script>
@endpush
<section class="hero">

  <!-- TOP TEXT CONTENT -->
  <div class="hero-text">
    <h1>
<span class="highlight-purple">Automate</span> your HR. 
Accelerate your 
<span class="highlight-blue">Growth.</span>
    </h1>

    <p>MineHR enhances employee engagement while simplifying HR operations.
Deliver seamless experiences and drive long-term organizational success.
    </p>
    

<a href="#recommendation" class="hero-btn">
  Explore Opportunities →
</a>
  </div>
<div class="circle-wrapper">

   <!-- LEFT CIRCLE -->
  <div class="circle">

    <!-- TOP WHITE -->
    <div class="half top-white"></div>

    <!-- 🔥 BOTTOM IMAGE HALF -->
    <div class="half bottom-image">
      <img src="images/left1.png" alt="">
      <div class="overlay-text">
        <h3>4.8 ★</h3>
        <p>Employee Rating</p>
      </div>
    </div>

  </div>

  <div class="connector">↗</div>

  <!-- CENTER CIRCLE -->
  <div class="circle circle-center">
    <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e" alt="">
  </div>

  <!-- CONNECTOR -->
  <div class="connector">⚙</div>
 <!-- RIGHT CIRCLE -->
  <div class="circle">

    <!-- 🔥 TOP IMAGE HALF -->
    <div class="half top-image">
      <img src="images/left.png" alt="">
    </div>

    <!-- BOTTOM WHITE -->
    <div class="half bottom-white">
      <h3>Top Workplace</h3>
      <p>Certified Company</p>
    </div>

  </div>
</section>

<section class="recommendation-section" id="recommendation">

  <h2 class="section-title">Recommendation</h2>

  <div class="job-grid">

    <!-- CARD 1 -->
    <div class="job-card">
      <div class="top-row">
<button class="jd-btn" onclick="openJob('ai')">
  Job Description →
</button>
      </div>

      <h3>59362_ Senior Staff Gen AI Engineer</h3>

      <div class="tags">
        <span>Machine Learning</span>
        <span>Artificial Intelligence</span>
        <span>Data Science</span>
        <span>SQL</span>
        <span>Python</span>
        <span>LLM (Large Language Model)</span>
      </div>

      <div class="info">
        <p>📍 Hyderabad</p>
        <p>₹ 416000 /Month</p>
        <p>📅 12/02/2026</p>
        <p>💼 10–20 Year Exp.</p>
      </div>

      <div class="action-buttons">
<button class="apply-btn" onclick="openForm()">Apply Now</button>
<button class="chat-btn" 
onclick="chatRecruiter('59362_ Senior Staff Gen AI Engineer')">
Chat With Recruiter
</button>
      </div>
    </div>


    <!-- CARD 2 -->
    <div class="job-card">
      <div class="top-row">
<button class="jd-btn" onclick="openJob('fullstack')">
  Job Description →
</button>
      </div>

      <h3>Full Stack Developer (Python & JavaScript) – AI</h3>

      <div class="tags">
        <span>Artificial Intelligence</span>
        <span>AWS</span>
        <span>Azure</span>
        <span>Django</span>
        <span>JavaScript</span>
        <span>Machine Learning</span>
        <span>HTML</span>
        <span>CSS</span>
        <span>MERN Stack</span>
        
      </div>

      <div class="info">
        <p>📍 Remote Work</p>
        <p>₹ 291000 /Month</p>
        <p>📅 11/02/2026</p>
        <p>💼 7–15 Year Exp.</p>
      </div>

      <div class="action-buttons">
<button class="apply-btn" onclick="openForm()">Apply Now</button>
<button class="chat-btn" 
onclick="chatRecruiter('Full Stack Developer (Python & JavaScript) – AI')">
Chat With Recruiter
</button>
      </div>
    </div>


    <!-- CARD 3 -->
    <div class="job-card">
      <div class="top-row">
<button class="jd-btn" onclick="openJob('sales')">
  Job Description →
</button>
      </div>

      <h3>Consultant (Sales) – Education & Immigration</h3>

      <div class="tags">
        <span>communication</span>
        <span>immigration</span>
        <span>Sales</span>
        <span>Customer Relationship</span>
        <span>Student Counseling</span>
        <span>English Speaking</span>
      </div>

      <div class="info">
        <p>📍 Ahmedabad</p>
        <p>₹ 30000 /Month</p>
        <p>📅 11/02/2026</p>
        <p>💼 2–5 Year Exp.</p>
      </div>

      <div class="action-buttons">
<button class="apply-btn" onclick="openForm()">Apply Now</button>
<button class="chat-btn" 
onclick="chatRecruiter('Consultant (Sales) – Education & Immigration')">
Chat With Recruiter
</button>
      </div>
    </div>


    <!-- Duplicate above 3 to make total 6 -->

   <!-- CARD 4 (Same as Card 1) -->
<div class="job-card">
  <div class="top-row">
<button class="jd-btn" onclick="openJob('ai')">
  Job Description →
</button>
  </div>

  <h3>59362_ Senior Staff Gen AI Engineer</h3>

  <div class="tags">
    <span>Machine Learning</span>
    <span>Artificial Intelligence</span>
    <span>Data Science</span>
    <span>SQL</span>
    <span>Python</span>
    <span>LLM (Large Language Model)</span>
  </div>

  <div class="info">
    <p>📍 Hyderabad</p>
    <p>₹ 416000 /Month</p>
    <p>📅 12/02/2026</p>
    <p>💼 10–20 Year Exp.</p>
  </div>

  <div class="action-buttons">
<button class="apply-btn" onclick="openForm()">Apply Now</button>
<button class="chat-btn" 
onclick="chatRecruiter('59362_ Senior Staff Gen AI Engineer')">
Chat With Recruiter
</button>
  </div>
</div>
<!-- CARD 5 (Same as Card 1) -->
<div class="job-card">
      <div class="top-row">
<button class="jd-btn" onclick="openJob('fullstack')">
  Job Description →
</button>
      </div>

      <h3>Full Stack Developer (Python & JavaScript) – AI</h3>

      <div class="tags">
        <span>Artificial Intelligence</span>
        <span>AWS</span>
        <span>Azure</span>
        <span>Django</span>
        <span>JavaScript</span>
        <span>Machine Learning</span>
        <span>HTML</span>
        <span>CSS</span>
        <span>MERN Stack</span>
      </div>

      <div class="info">
        <p>📍 Remote Work</p>
        <p>₹ 291000 /Month</p>
        <p>📅 11/02/2026</p>
        <p>💼 7–15 Year Exp.</p>
      </div>

      <div class="action-buttons">
<button class="apply-btn" onclick="openForm()">Apply Now</button>
<button class="chat-btn" 
onclick="chatRecruiter('Full Stack Developer (Python & JavaScript) – AI')">
Chat With Recruiter
</button>
      </div>
    </div>
<!-- CARD 6 (Same as Card 1) -->
 <div class="job-card">
      <div class="top-row">
<button class="jd-btn" onclick="openJob('sales')">
  Job Description →
</button>
      </div>

      <h3>Consultant (Sales) – Education & Immigration</h3>

      <div class="tags">
        <span>communication</span>
        <span>immigration</span>
        <span>Sales</span>
        <span>Customer Relationship</span>
        <span>Student Counseling</span>
        <span>English Speaking</span>
      </div>

      <div class="info">
        <p>📍 Ahmedabad</p>
        <p>₹ 30000 /Month</p>
        <p>📅 11/02/2026</p>
        <p>💼 2–5 Year Exp.</p>
      </div>

      <div class="action-buttons">
<button class="apply-btn" onclick="openForm()">Apply Now</button>
<button class="chat-btn" 
onclick="chatRecruiter('Consultant (Sales) – Education & Immigration')">
Chat With Recruiter
</button>
      </div>
    </div>


    <!-- Duplicate above 3 to make total 6 -->
</div>
</section>
<!-- APPLY FORM MODAL -->
<div class="apply-modal" id="applyModal">

  <div class="apply-form-box">
    <span class="close-btn" onclick="closeForm()">×</span>

    <h2>Job Application Form</h2>

    <form>
      <input type="text" placeholder="Full Name" required>
      <input type="email" placeholder="Email Address" required>
      <input type="tel" placeholder="Phone Number" required>

      <input type="text" placeholder="Current Location">

      <label>Upload Resume</label>
      <input type="file" accept=".pdf,.doc,.docx" required>

      <button type="submit" class="submit-btn">Submit Application</button>
    </form>
  </div>

</div>
<!-- SUCCESS POPUP -->
<div class="success-modal" id="successModal">
  <div class="success-box">
    <h2>🎉 Application Submitted Successfully!</h2>
    <p>Thank you for applying. Our team will contact you soon.</p>
    <button onclick="closeSuccess()">OK</button>
  </div>
</div>

<!-- JOB DESCRIPTION MODAL -->
<div class="job-modal" id="jobModal">

  <div class="job-modal-box">
    <span class="close-btn" onclick="closeJob()">×</span>

    <h2 id="jobTitle"></h2>

    <div id="jobContent">
      <!-- Description JS se aayega -->
    </div>

    <button class="apply-btn" onclick="openForm()">Apply Now</button>

  </div>
</div>
@endsection