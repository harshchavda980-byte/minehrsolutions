// =============================================================
// MineHR Website – Dynamic Career Page
// Fetches live jobs from Master Admin Panel API
// API: https://master.minehrsolutions.com/api/jobs
// Applications: submitted to local server /api/apply
// =============================================================

const ADMIN_API = 'https://master.minehrsolutions.com';
// Apply endpoint: use local server (same origin) to avoid CORS and
// to ensure the route is always available regardless of master-server health.
const APPLY_API = '';  // empty string = same origin as the page

// Global state
let loadedJobs = [];
let currentJobId = null;

// =============================================================
// BODY SCROLL LOCK
// =============================================================
function updateBodyScroll() {
  const applyModal = document.getElementById('applyModal');
  const jobModal = document.getElementById('jobModal');
  const successModal = document.getElementById('successModal');
  const isAnyOpen =
    (applyModal && applyModal.style.display === 'flex') ||
    (jobModal && jobModal.style.display === 'flex') ||
    (successModal && successModal.style.display === 'flex');
  document.documentElement.classList.toggle('modal-open', isAnyOpen);
  document.body.classList.toggle('modal-open', isAnyOpen);
}

// =============================================================
// TOAST HELPER
// =============================================================
function showToast(msg, type) {
  const existing = document.getElementById('careerToast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'careerToast';
  toast.style.cssText = `
    position:fixed; bottom:30px; right:30px; z-index:9999;
    background:${type === 'info' ? '#6366f1' : type === 'error' ? '#ef4444' : '#10b981'};
    color:#fff; padding:14px 22px; border-radius:10px;
    font-size:14px; font-weight:600; box-shadow:0 4px 20px rgba(0,0,0,0.2);
    animation: fadeInUp 0.3s ease;
  `;
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// =============================================================
// APPLY FORM
// =============================================================
function openForm(jobId) {
  // Close JD modal if open
  const jobModal = document.getElementById('jobModal');
  if (jobModal) { jobModal.style.display = 'none'; }

  // Set the job id in the hidden field
  const hiddenJobId = document.getElementById('applyJobId');
  if (hiddenJobId) hiddenJobId.value = jobId || '';

  // Also set a human-readable title if we can look it up
  const job = loadedJobs.find(j => j.id == jobId);
  const titleEl = document.getElementById('appliedJobTitle');
  if (titleEl && job) titleEl.value = job.title;

  const applyModal = document.getElementById('applyModal');
  if (applyModal) { applyModal.style.display = 'flex'; updateBodyScroll(); }
}

function closeForm() {
  const applyModal = document.getElementById('applyModal');
  if (applyModal) { applyModal.style.display = 'none'; updateBodyScroll(); }
}

// =============================================================
// JOB DESCRIPTION MODAL
// =============================================================
function openJob(id) {
  const modal = document.getElementById('jobModal');
  const title = document.getElementById('jobTitle');
  const content = document.getElementById('jobContent');
  if (!modal || !title || !content) return;

  const job = loadedJobs.find(j => j.id == id);
  if (!job) return;
  currentJobId = id;

  title.innerText = job.title;
  modal.style.display = 'flex';
  updateBodyScroll();

  // Format description
  let desc = '';
  if (job.description) {
    desc = (job.description.includes('<') && job.description.includes('>'))
      ? job.description
      : job.description.split('\n').map(l => `<p style="margin-bottom:12px;">${l}</p>`).join('');
  } else {
    desc = '<p style="color:#555;">No description provided.</p>';
  }

  content.innerHTML = `
    <div style="margin-bottom:16px;">
      <span style="background:rgba(99,102,241,0.12);color:#6366f1;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;margin-right:8px;">
        ${job.employment_type || 'Full-time'}
      </span>
      <span style="background:rgba(16,185,129,0.12);color:#10b981;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;">
        ${job.department}
      </span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:22px;font-size:14px;color:#555;">
      <p>📍 <strong>Location:</strong> ${formatLocation(job.location)}</p>
      <p>💼 <strong>Experience:</strong> ${job.experience || 'Not Specified'}</p>
      <p>₹ <strong>Salary:</strong> ${job.salary || 'Competitive'}</p>
      <p>👥 <strong>Openings:</strong> ${job.openings || 1}</p>
      <p>📅 <strong>Deadline:</strong> ${job.deadline ? formatDate(job.deadline) : 'Open'}</p>
    </div>
    <h3 style="margin-bottom:12px;font-size:18px;">Role Overview &amp; Responsibilities</h3>
    <div style="line-height:1.7;color:#333;">${desc}</div>
  `;
}

function closeJob() {
  const jobModal = document.getElementById('jobModal');
  if (jobModal) { jobModal.style.display = 'none'; updateBodyScroll(); }
}

// =============================================================
// HELPERS
// =============================================================
function formatDate(d) {
  if (!d) return 'Open';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
}

function formatLocation(loc) {
  if (!loc) return 'Not Specified';
  const parts = [];
  if (loc.name) parts.push(loc.name);
  if (loc.state?.name) {
    parts.push(loc.state.name);
    if (loc.state.country?.name) parts.push(loc.state.country.name);
  }
  return parts.join(', ') || 'Not Specified';
}

// =============================================================
// LOAD JOBS FROM API
// =============================================================
async function loadWebsiteJobs() {
  const grid = document.getElementById('jobsGrid');
  if (!grid) return;

  // Show skeleton loader
  grid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:50px 20px;">
      <div style="display:inline-block;width:36px;height:36px;border:3px solid #e2e8f0;border-top-color:#6366f1;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
      <p style="margin-top:16px;color:#94a3b8;font-size:15px;">Loading opportunities...</p>
    </div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  `;

  try {
    const res = await fetch(`${ADMIN_API}/api/jobs`);
    const data = await res.json();

    if (data.success && data.jobs && data.jobs.length > 0) {
      loadedJobs = data.jobs;
      renderJobs(data.jobs);
    } else {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
          <div style="font-size:48px;margin-bottom:12px;">🔭</div>
          <h3 style="font-size:20px;color:#334155;margin-bottom:8px;">No Open Positions Right Now</h3>
          <p style="color:#64748b;font-size:15px;">We're always looking for great talent. Check back soon!</p>
        </div>
      `;
    }
  } catch (err) {
    console.error('Career page job load error:', err);
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
        <div style="font-size:48px;margin-bottom:12px;">⚠️</div>
        <p style="color:#ef4444;font-size:15px;">Unable to load job openings. Please refresh the page.</p>
      </div>
    `;
  }
}

// =============================================================
// RENDER JOB CARDS
// =============================================================
function renderJobs(jobs) {
  const grid = document.getElementById('jobsGrid');
  if (!grid) return;

  grid.innerHTML = jobs.map(j => `
    <div class="job-card" data-id="${j.id}">
      <div class="top-row">
        <button class="jd-btn" onclick="openJob(${j.id})">
          Job Description →
        </button>
      </div>

      <h3>${j.title}</h3>

      <div class="tags">
        <span>${j.department}</span>
        ${j.employment_type ? `<span>${j.employment_type}</span>` : ''}
        ${j.openings ? `<span>${j.openings} Opening${j.openings > 1 ? 's' : ''}</span>` : ''}
      </div>

      <div class="info">
        <p>📍 ${formatLocation(j.location)}</p>
        <p>${j.salary ? '₹ ' + j.salary : '💰 Competitive Package'}</p>
        <p>📅 ${j.deadline ? formatDate(j.deadline) : 'Open Deadline'}</p>
        <p>💼 ${j.experience || 'Exp. Not Specified'}</p>
      </div>

      <div class="action-buttons">
        <button class="apply-btn" onclick="openForm(${j.id})">Apply Now</button>
        <button class="chat-btn" onclick="chatRecruiter('${j.title.replace(/'/g, "\\'")}')">
          Chat With Recruiter
        </button>
      </div>
    </div>
  `).join('');
}

// =============================================================
// SUBMIT APPLICATION
// =============================================================
document.addEventListener('DOMContentLoaded', function () {
  // Boot job loader
  loadWebsiteJobs();

  const form = document.querySelector('.apply-form-box form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerText : 'Submit Application';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'Submitting...'; }

    const formData = new FormData(form);

    try {
      const response = await fetch(`${APPLY_API}/api/apply`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok && result.success) {
        closeForm();
        const successModal = document.getElementById('successModal');
        if (successModal) { successModal.style.display = 'flex'; updateBodyScroll(); }
        form.reset();
      } else {
        showToast(result.message || 'Application failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error. Please check your connection.', 'error');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = originalText; }
    }
  });
});

// =============================================================
// CLOSE SUCCESS MODAL
// =============================================================
function closeSuccess() {
  const m = document.getElementById('successModal');
  if (m) { m.style.display = 'none'; updateBodyScroll(); }
}

// =============================================================
// CLOSE MODAL ON OUTSIDE CLICK
// =============================================================
window.addEventListener('click', function (e) {
  ['applyModal', 'jobModal', 'successModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el && e.target === el) { el.style.display = 'none'; updateBodyScroll(); }
  });
});

// =============================================================
// WHATSAPP CHAT
// =============================================================
function chatRecruiter(jobTitle) {
  const number = '917574063353'; // MineHR Recruiter WhatsApp: +91 75740 63353
  const message = `Hello, I am interested in the ${jobTitle} position. Please share more details.`;
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
}
