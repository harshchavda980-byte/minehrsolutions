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

    /* ── Inline validation styles ── */
    .field-wrap {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .error-msg {
      display: none;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      font-weight: 500;
      color: #ef4444;
      margin-top: 5px;
      padding-left: 2px;
      line-height: 1.4;
      animation: errFadeIn 0.2s ease;
    }
    .error-msg.visible {
      display: flex;
    }
    .error-msg::before {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23ef4444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='10' cy='10' r='8'/%3E%3Cline x1='10' y1='6' x2='10' y2='10'/%3E%3Ccircle cx='10' cy='14' r='0.5' fill='%23ef4444'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      margin-top: 1px;
    }
    @keyframes errFadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .invalid-input,
    input.invalid-input,
    textarea.invalid-input {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
      background-color: #fff8f8 !important;
    }

    .custom-select-trigger.invalid-input {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
      background-color: #fff8f8 !important;
    }

    .checkbox-field-wrap .checkbox-row label {
      transition: color 0.2s;
    }
    .checkbox-field-wrap.invalid-check label {
      color: #ef4444 !important;
    }

    [data-theme="dark"] .invalid-input,
    [data-theme="dark"] input.invalid-input,
    [data-theme="dark"] textarea.invalid-input {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
      background-color: rgba(239, 68, 68, 0.08) !important;
    }
    [data-theme="dark"] .custom-select-trigger.invalid-input {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
      background-color: rgba(239, 68, 68, 0.08) !important;
    }
    [data-theme="dark"] .error-msg {
      color: #fca5a5;
    }
    [data-theme="dark"] .error-msg::before {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23fca5a5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='10' cy='10' r='8'/%3E%3Cline x1='10' y1='6' x2='10' y2='10'/%3E%3Ccircle cx='10' cy='14' r='0.5' fill='%23fca5a5'/%3E%3C/svg%3E");
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
    // Always suppress browser native validation tooltips
    form.setAttribute('novalidate', 'true');

    /* ── Helper: find error-msg span for a given input ── */
    function getErrorSpan(input) {
      const id = input.id;
      if (id) {
        const span = form.querySelector(`.error-msg[data-for="${id}"]`);
        if (span) return span;
      }
      // Fallback: sibling or closest field-wrap child
      const wrap = input.closest('.field-wrap');
      if (wrap) return wrap.querySelector('.error-msg');
      return null;
    }

    /* ── Show an error on an input ── */
    function showError(input, message) {
      // Mark the visual element
      if (input.tagName === 'SELECT' && input.closest('.custom-select-wrapper')) {
        const trigger = input.closest('.custom-select-wrapper').querySelector('.custom-select-trigger');
        if (trigger) trigger.classList.add('invalid-input');
      } else if (input.type === 'checkbox') {
        const wrap = input.closest('.checkbox-field-wrap');
        if (wrap) wrap.classList.add('invalid-check');
      } else {
        input.classList.add('invalid-input');
      }

      // Show the error message span
      const span = getErrorSpan(input);
      if (span) {
        span.textContent = message;
        span.classList.add('visible');
      }
    }

    /* ── Clear an error from an input ── */
    function clearError(input) {
      if (input.tagName === 'SELECT' && input.closest('.custom-select-wrapper')) {
        const trigger = input.closest('.custom-select-wrapper').querySelector('.custom-select-trigger');
        if (trigger) trigger.classList.remove('invalid-input');
      } else if (input.type === 'checkbox') {
        const wrap = input.closest('.checkbox-field-wrap');
        if (wrap) wrap.classList.remove('invalid-check');
      } else {
        input.classList.remove('invalid-input');
      }

      const span = getErrorSpan(input);
      if (span) {
        span.textContent = '';
        span.classList.remove('visible');
      }
    }

    /* ── Attach live clear-on-input listeners once ── */
    if (!form.dataset.validationInitialized) {
      form.dataset.validationInitialized = 'true';

      // Regular inputs & textarea
      form.querySelectorAll('input:not([type="checkbox"]), textarea').forEach(input => {
        input.addEventListener('input', () => clearError(input));
        input.addEventListener('focus', () => clearError(input));
      });

      // Checkbox
      const cb = form.querySelector('#privacy');
      if (cb) {
        cb.addEventListener('change', () => clearError(cb));
      }

      // Hidden select — clear when custom option is picked (change event fired by custom select JS)
      const hiddenSelect = form.querySelector('select[name="subject"]');
      if (hiddenSelect) {
        hiddenSelect.addEventListener('change', () => clearError(hiddenSelect));
      }
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Send Message →';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending…';
      }

      let isValid = true;
      let firstInvalidInput = null;

      // Clear all existing errors first
      form.querySelectorAll('input, textarea, select').forEach(inp => clearError(inp));

      /* ── Validate each required field ── */
      const nameInput    = form.querySelector('[name="name"], [name="first_name"]');
      const emailInput   = form.querySelector('[name="email"]');
      const companyInput = form.querySelector('[name="company"], [name="company_name"]');
      const phoneInput   = form.querySelector('[name="contact_number"], [name="phone"]');
      const subjectInput = form.querySelector('[name="subject"]');
      const messageInput = form.querySelector('[name="message"]');
      const privacyCb    = form.querySelector('#privacy');

      function flagEmpty(input, label) {
        if (input && input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          let labelText = label;
          if (input.name === 'first_name') labelText = 'First name';
          else if (input.name === 'phone') labelText = 'Phone number';
          showError(input, `${labelText} is required.`);
          if (!firstInvalidInput) firstInvalidInput = input;
        }
      }

      flagEmpty(nameInput,    'Name');
      flagEmpty(emailInput,   'Email address');
      flagEmpty(companyInput, 'Company name');
      flagEmpty(phoneInput,   'Contact number');
      flagEmpty(messageInput, 'Message');

      // Subject (custom select — hidden select)
      if (subjectInput && !subjectInput.value) {
        isValid = false;
        showError(subjectInput, 'Please select a subject / service.');
        if (!firstInvalidInput) firstInvalidInput = subjectInput;
      }

      // Checkbox
      if (privacyCb && !privacyCb.checked) {
        isValid = false;
        showError(privacyCb, 'Please agree to the privacy policy.');
        if (!firstInvalidInput) firstInvalidInput = privacyCb;
      }

      // Email format
      if (emailInput && emailInput.value.trim() && isValid) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          isValid = false;
          showError(emailInput, 'Please enter a valid email address.');
          if (!firstInvalidInput) firstInvalidInput = emailInput;
        }
      }

      // Phone format
      if (phoneInput && phoneInput.value.trim() && isValid) {
        const phoneRegex = /^(\+?\d{1,4}[\s-]?)?\d{10}$/;
        if (!phoneRegex.test(phoneInput.value.trim().replace(/[\s-]/g, ''))) {
          isValid = false;
          showError(phoneInput, 'Please enter a valid 10-digit number.');
          if (!firstInvalidInput) firstInvalidInput = phoneInput;
        }
      }

      if (!isValid) {
        if (firstInvalidInput) {
          // For hidden select, scroll to the custom trigger instead
          const scrollTarget = (firstInvalidInput.tagName === 'SELECT')
            ? (firstInvalidInput.closest('.custom-select-wrapper') || firstInvalidInput)
            : firstInvalidInput;
          scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (firstInvalidInput.type !== 'checkbox' && firstInvalidInput.tagName !== 'SELECT') {
            firstInvalidInput.focus();
          }
        }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = originalText; }
        return;
      }

      /* ── Build data payload ── */
      const fd = new FormData(form);
      const subject = fd.get('subject');
      const data = {
        name:           fd.get('name') || `${fd.get('first_name') || ''} ${fd.get('last_name') || ''}`.trim(),
        email:          fd.get('email'),
        contact_number: fd.get('contact_number') || fd.get('phone'),
        company:        fd.get('company') || fd.get('company_name'),
        message:        subject
          ? `Subject: ${subject}\n\nMessage:\n${fd.get('message') || ''}`
          : (fd.get('message') || ''),
        visitor_id:     localStorage.getItem('mhr_visitor_id'),
        session_id:     sessionStorage.getItem('mhr_session_id'),
        page:           window.location.pathname + window.location.search,
        host:           window.location.hostname
      };

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
