/**
 * MineHR Solutions — Professional Form Handler
 * Premium modal popup on form submission
 */

/* ============================================================
   INJECT PREMIUM MODAL STYLES
   ============================================================ */
(function injectModalStyles() {
  if (document.getElementById('mhr-modal-styles')) return;
  const style = document.createElement('style');
  style.id = 'mhr-modal-styles';
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    /* ── Overlay ── */
    #mhr-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(2, 6, 23, 0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      opacity: 0;
      transition: opacity 0.35s ease;
    }
    #mhr-overlay.mhr-visible { opacity: 1; }

    /* ── Modal Card ── */
    #mhr-modal {
      position: relative;
      width: 100%;
      max-width: 480px;
      background: #ffffff;
      border-radius: 28px;
      overflow: hidden;
      box-shadow:
        0 32px 80px rgba(0, 0, 0, 0.25),
        0 8px 24px rgba(0, 0, 0, 0.12),
        0 0 0 1px rgba(255,255,255,0.06);
      transform: translateY(40px) scale(0.94);
      transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: 'Inter', sans-serif;
    }
    #mhr-overlay.mhr-visible #mhr-modal {
      transform: translateY(0) scale(1);
    }

    /* ── Hero Header Band ── */
    .mhr-modal-header {
      position: relative;
      padding: 40px 40px 32px;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4f46e5 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
    }

    /* Decorative blobs */
    .mhr-modal-header::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 160px; height: 160px;
      background: radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%);
      border-radius: 50%;
    }
    .mhr-modal-header::after {
      content: '';
      position: absolute;
      bottom: -30px; left: -30px;
      width: 120px; height: 120px;
      background: radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%);
      border-radius: 50%;
    }

    /* ── Animated Icon Circle ── */
    .mhr-icon-ring {
      position: relative;
      width: 88px;
      height: 88px;
      margin-bottom: 20px;
    }
    .mhr-icon-ring svg.mhr-ring-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    .mhr-ring-bg {
      fill: none;
      stroke: rgba(255,255,255,0.15);
      stroke-width: 3;
    }
    .mhr-ring-progress {
      fill: none;
      stroke: #a5f3fc;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 251;
      stroke-dashoffset: 251;
      transform: rotate(-90deg);
      transform-origin: center;
      animation: mhrRingFill 0.8s ease 0.3s forwards;
    }
    @keyframes mhrRingFill {
      to { stroke-dashoffset: 0; }
    }

    .mhr-icon-inner {
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.12);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Checkmark SVG animation */
    .mhr-check-svg {
      width: 40px;
      height: 40px;
    }
    .mhr-check-bg {
      fill: none;
      stroke: rgba(255,255,255,0.2);
      stroke-width: 2;
    }
    .mhr-check-draw {
      fill: none;
      stroke: #ffffff;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 60;
      stroke-dashoffset: 60;
      animation: mhrCheckDraw 0.5s ease 0.9s forwards;
    }
    @keyframes mhrCheckDraw {
      to { stroke-dashoffset: 0; }
    }

    /* Error X icon */
    .mhr-x-draw {
      fill: none;
      stroke: #ffffff;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 40;
      stroke-dashoffset: 40;
      animation: mhrCheckDraw 0.4s ease 0.5s forwards;
    }

    .mhr-modal-header-title {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 6px;
      letter-spacing: -0.3px;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    .mhr-modal-header-sub {
      font-size: 13.5px;
      color: rgba(255,255,255,0.72);
      margin: 0;
      text-align: center;
      position: relative;
      z-index: 1;
      line-height: 1.5;
    }

    /* ── Body ── */
    .mhr-modal-body {
      padding: 28px 32px 32px;
    }

    /* Thank you message box */
    .mhr-thanks-box {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      border: 1px solid #bae6fd;
      border-radius: 16px;
      padding: 18px 20px;
      margin-bottom: 20px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .mhr-thanks-box .mhr-tb-emoji {
      font-size: 24px;
      line-height: 1;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .mhr-thanks-box p {
      margin: 0;
      font-size: 14px;
      color: #0c4a6e;
      line-height: 1.65;
    }
    .mhr-thanks-box p strong { color: #0369a1; font-weight: 700; }

    /* Divider label */
    .mhr-divider {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .mhr-divider::before,
    .mhr-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }
    .mhr-divider span {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      white-space: nowrap;
    }

    /* Contact cards grid */
    .mhr-contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    .mhr-contact-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 14px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: border-color 0.2s, background 0.2s;
      text-decoration: none;
      cursor: default;
    }
    .mhr-contact-card:hover {
      border-color: #c7d2fe;
      background: #eef2ff;
    }
    .mhr-cc-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    .mhr-cc-icon.email-ic { background: #ede9fe; }
    .mhr-cc-icon.phone-ic { background: #dcfce7; }
    .mhr-cc-text { overflow: hidden; }
    .mhr-cc-label {
      display: block;
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      margin-bottom: 2px;
    }
    .mhr-cc-value {
      display: block;
      font-size: 11.5px;
      font-weight: 700;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* CTA Button */
    .mhr-cta-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 15px 24px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff;
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      letter-spacing: 0.2px;
      transition: all 0.25s ease;
      box-shadow: 0 4px 16px rgba(79,70,229,0.35), 0 1px 4px rgba(79,70,229,0.2);
      position: relative;
      overflow: hidden;
    }
    .mhr-cta-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
      opacity: 0;
      transition: opacity 0.25s;
    }
    .mhr-cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(79,70,229,0.45), 0 2px 8px rgba(79,70,229,0.25);
    }
    .mhr-cta-btn:hover::before { opacity: 1; }
    .mhr-cta-btn:active { transform: translateY(0); }

    .mhr-cta-btn.error-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 4px 16px rgba(239,68,68,0.35);
    }
    .mhr-cta-btn.error-btn:hover {
      box-shadow: 0 8px 28px rgba(239,68,68,0.45);
    }

    /* Close X top-right */
    .mhr-modal-xbtn {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: none;
      color: rgba(255,255,255,0.9);
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      z-index: 5;
      line-height: 1;
    }
    .mhr-modal-xbtn:hover { background: rgba(255,255,255,0.3); }

    /* Error header variant */
    .mhr-modal-header.error-header {
      background: linear-gradient(135deg, #450a0a 0%, #7f1d1d 45%, #dc2626 100%);
    }
    .mhr-modal-header.error-header .mhr-ring-progress { stroke: #fca5a5; }
    .mhr-thanks-box.error-box {
      background: linear-gradient(135deg, #fff1f2, #fee2e2);
      border-color: #fecaca;
    }
    .mhr-thanks-box.error-box p { color: #7f1d1d; }
    .mhr-thanks-box.error-box p strong { color: #b91c1c; }

    /* Dark mode */
    [data-theme="dark"] #mhr-modal {
      background: #0f172a;
    }
    [data-theme="dark"] .mhr-modal-body {
      background: #0f172a;
    }
    [data-theme="dark"] .mhr-thanks-box {
      background: linear-gradient(135deg, #0c1929, #0f2744);
      border-color: #1e3a5f;
    }
    [data-theme="dark"] .mhr-thanks-box p { color: #7dd3fc; }
    [data-theme="dark"] .mhr-thanks-box p strong { color: #38bdf8; }
    [data-theme="dark"] .mhr-divider::before,
    [data-theme="dark"] .mhr-divider::after { background: #1e293b; }
    [data-theme="dark"] .mhr-divider span { color: #475569; }
    [data-theme="dark"] .mhr-contact-card {
      background: #1e293b;
      border-color: #334155;
    }
    [data-theme="dark"] .mhr-contact-card:hover {
      background: #1e2a45;
      border-color: #4f46e5;
    }
    [data-theme="dark"] .mhr-cc-value { color: #e2e8f0; }
    [data-theme="dark"] .mhr-cc-icon.email-ic { background: #2d2060; }
    [data-theme="dark"] .mhr-cc-icon.phone-ic { background: #052e16; }

    /* Responsive */
    @media (max-width: 480px) {
      #mhr-modal { border-radius: 22px; max-width: 100%; }
      .mhr-modal-header { padding: 32px 24px 24px; }
      .mhr-modal-body { padding: 22px 20px 24px; }
      .mhr-contact-grid { grid-template-columns: 1fr; gap: 10px; }
      .mhr-cc-value { font-size: 12px; }
      .mhr-modal-header-title { font-size: 20px; }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   SHOW MODAL
   ============================================================ */
function showModal({ type = 'success', name = '', errorMsg = '' }) {
  const existing = document.getElementById('mhr-overlay');
  if (existing) existing.remove();

  const isSuccess = type === 'success';

  /* ── Icon SVG ── */
  const iconSVG = isSuccess
    ? `<svg class="mhr-check-svg" viewBox="0 0 48 48">
         <circle class="mhr-check-bg" cx="24" cy="24" r="22"/>
         <polyline class="mhr-check-draw" points="13,25 21,33 36,16"/>
       </svg>`
    : `<svg class="mhr-check-svg" viewBox="0 0 48 48">
         <circle class="mhr-check-bg" cx="24" cy="24" r="22"/>
         <line class="mhr-x-draw" x1="16" y1="16" x2="32" y2="32"/>
         <line class="mhr-x-draw" x1="32" y1="16" x2="16" y2="32" style="animation-delay:0.15s"/>
       </svg>`;

  const headerTitle = isSuccess ? 'Message Sent!' : 'Submission Failed';
  const headerSub   = isSuccess ? 'We\'ve received your enquiry' : 'Something went wrong';

  const bodyBox = isSuccess
    ? `<div class="mhr-thanks-box">
         <span class="mhr-tb-emoji">🎉</span>
         <p>Thank you, <strong>${name || 'there'}</strong>! Our HR team will review your message and get back to you within <strong>24 business hours</strong>.</p>
       </div>`
    : `<div class="mhr-thanks-box error-box">
         <span class="mhr-tb-emoji">⚠️</span>
         <p>${errorMsg || 'Unable to send your message. Please try again or reach us directly.'}</p>
       </div>`;

  const contactGrid = isSuccess
    ? `<div class="mhr-divider"><span>You can also reach us at</span></div>
       <div class="mhr-contact-grid">
         <div class="mhr-contact-card">
           <div class="mhr-cc-icon email-ic">📧</div>
           <div class="mhr-cc-text">
             <span class="mhr-cc-label">Email</span>
             <span class="mhr-cc-value">hr@minehrsolutions.com</span>
           </div>
         </div>
         <div class="mhr-contact-card">
           <div class="mhr-cc-icon phone-ic">📞</div>
           <div class="mhr-cc-text">
             <span class="mhr-cc-label">Phone</span>
             <span class="mhr-cc-value">+91 75740 63353</span>
           </div>
         </div>
       </div>` : '';

  const btnLabel = isSuccess ? '✓&nbsp; Done, Close Window' : 'Close';

  const overlay = document.createElement('div');
  overlay.id = 'mhr-overlay';
  overlay.innerHTML = `
    <div id="mhr-modal">
      <!-- Header -->
      <div class="mhr-modal-header ${isSuccess ? '' : 'error-header'}">
        <button class="mhr-modal-xbtn" id="mhrXBtn">✕</button>

        <div class="mhr-icon-ring">
          <svg class="mhr-ring-svg" viewBox="0 0 88 88">
            <circle class="mhr-ring-bg" cx="44" cy="44" r="40"/>
            <circle class="mhr-ring-progress" cx="44" cy="44" r="40"/>
          </svg>
          <div class="mhr-icon-inner">
            ${iconSVG}
          </div>
        </div>

        <h2 class="mhr-modal-header-title">${headerTitle}</h2>
        <p class="mhr-modal-header-sub">${headerSub}</p>
      </div>

      <!-- Body -->
      <div class="mhr-modal-body">
        ${bodyBox}
        ${contactGrid}
        <button class="mhr-cta-btn ${isSuccess ? '' : 'error-btn'}" id="mhrCloseBtn">
          ${btnLabel}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('mhr-visible')));

  const close = () => {
    overlay.classList.remove('mhr-visible');
    setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 350);
  };

  document.getElementById('mhrCloseBtn').addEventListener('click', close);
  document.getElementById('mhrXBtn').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  window.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { close(); window.removeEventListener('keydown', esc); }
  });
}

/* ============================================================
   FORM SUBMISSION HANDLER
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const contactForms = document.querySelectorAll('.contact-form, .ats-contact-form');

  contactForms.forEach(form => {
    // Prevent browser default validation tooltips
    form.setAttribute('novalidate', 'true');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending…';
      }

      // ── HTML5 / Custom Field Validation ──
      // Clear existing validation errors
      form.querySelectorAll('.error-text').forEach(err => err.remove());
      form.querySelectorAll('.invalid-input').forEach(input => input.classList.remove('invalid-input'));

      let isValid = true;
      let firstInvalidInput = null;

      function showError(input, message) {
        input.classList.add('invalid-input');
        
        let errorSpan = document.createElement('span');
        errorSpan.className = 'error-text';
        errorSpan.innerHTML = message;
        errorSpan.style.color = '#ef4444';
        errorSpan.style.fontSize = '0.85rem';
        errorSpan.style.marginTop = '0.35rem';
        errorSpan.style.display = 'block';
        errorSpan.style.fontWeight = '500';
        
        if (input.tagName === 'SELECT' && input.closest('.custom-select-wrapper')) {
          const wrapper = input.closest('.custom-select-wrapper');
          wrapper.after(errorSpan);
        } else if (input.type === 'checkbox') {
          const row = input.closest('.checkbox-row') || input;
          row.after(errorSpan);
        } else {
          input.after(errorSpan);
        }
      }

      // Add input event listeners to clear error dynamically
      if (!form.dataset.validationInitialized) {
        form.dataset.validationInitialized = 'true';
        const allRequired = form.querySelectorAll('[required]');
        allRequired.forEach(input => {
          const clearError = () => {
            input.classList.remove('invalid-input');
            let errorSpan;
            if (input.tagName === 'SELECT' && input.closest('.custom-select-wrapper')) {
              const wrapper = input.closest('.custom-select-wrapper');
              errorSpan = wrapper.nextElementSibling;
            } else if (input.type === 'checkbox') {
              errorSpan = (input.closest('.checkbox-row') || {}).nextElementSibling;
            } else {
              errorSpan = input.nextElementSibling;
            }
            if (errorSpan && errorSpan.classList.contains('error-text')) {
              errorSpan.remove();
            }
          };
          input.addEventListener('input', clearError);
          input.addEventListener('change', clearError);
        });
      }

      // Validate required elements
      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (input.type === 'checkbox') {
          if (!input.checked) {
            isValid = false;
            showError(input, 'Please agree to the Privacy Policy before submitting.');
            if (!firstInvalidInput) firstInvalidInput = input;
          }
        } else {
          if (!input.value.trim()) {
            isValid = false;
            showError(input, 'Please fill out this field.');
            if (!firstInvalidInput) firstInvalidInput = input;
          }
        }
      });

      const fd = new FormData(form);
      const data = {
        name: fd.get('name') || `${fd.get('first_name') || ''} ${fd.get('last_name') || ''}`.trim(),
        email: fd.get('email'),
        contact_number: fd.get('contact_number') || fd.get('phone'),
        company: fd.get('company') || fd.get('company_name'),
        message: fd.get('message') || (form.querySelector('textarea') || {}).value || ''
      };

      // Validate email format if populated
      const emailInput = form.querySelector('[name="email"]');
      if (emailInput && emailInput.value.trim() && isValid) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          isValid = false;
          showError(emailInput, 'Please enter a valid email address (e.g. name@example.com).');
          if (!firstInvalidInput) firstInvalidInput = emailInput;
        }
      }

      // Validate phone format if populated
      const phoneInput = form.querySelector('[name="phone"], [name="contact_number"]');
      if (phoneInput && phoneInput.value.trim() && isValid) {
        const phoneRegex = /^(\+?\d{1,4}[\s-]?)?\d{10}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
          isValid = false;
          showError(phoneInput, 'Please enter a valid 10-digit contact number.');
          if (!firstInvalidInput) firstInvalidInput = phoneInput;
        }
      }

      if (!isValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
          firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
        return;
      }

      // ── Subject Dropdown prefill ──
      const subject = fd.get('subject');
      if (subject) {
        data.message = `Subject: ${subject}\n\nMessage:\n${data.message}`;
      }

      try {
        const res  = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();

        if (res.ok && json.success) {
          form.reset();
          showModal({ type: 'success', name: data.name });
        } else {
          showModal({ type: 'error', errorMsg: json.error || 'Please try again.' });
        }
      } catch {
        showModal({
          type: 'error',
          errorMsg: 'Connection error. Please email us at <strong>hr@minehrsolutions.com</strong>.'
        });
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = originalText; }
      }
    });
  });

  // ===== CUSTOM SELECT DROPDOWN FUNCTIONALITY =====
  const customSelects = document.querySelectorAll(".custom-select");
  customSelects.forEach(select => {
    const trigger = select.querySelector(".custom-select-trigger");
    const options = select.querySelectorAll(".custom-option");
    const hiddenSelect = select.closest(".custom-select-wrapper").querySelector("select");

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close all other custom selects first
      customSelects.forEach(otherSelect => {
        if (otherSelect !== select) otherSelect.classList.remove("open");
      });
      select.classList.toggle("open");
    });

    options.forEach(opt => {
      opt.addEventListener("click", () => {
        options.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        
        // Update trigger text and style
        trigger.querySelector("span").textContent = opt.textContent;
        trigger.style.color = "var(--dark)"; // Make text dark since value is selected
        
        // Update hidden select
        hiddenSelect.value = opt.getAttribute("data-value");
        
        // Trigger native change event
        hiddenSelect.dispatchEvent(new Event("change"));

        select.classList.remove("open");
      });
    });
  });

  // Close custom dropdown when clicking outside
  window.addEventListener("click", () => {
    customSelects.forEach(select => select.classList.remove("open"));
  });
});
