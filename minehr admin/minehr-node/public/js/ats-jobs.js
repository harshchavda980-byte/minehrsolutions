/**
 * ATS Job Listings Logic
 */

let currentPage = 1;
const recordsPerPage = 10;
let editingJobId = null;

let locHelper;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth & User Load
    const authRes = await fetch('/api/auth/me');
    if (!authRes.ok) { window.location.href = '/login'; return; }
    const user = await authRes.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userRole').innerText = user.role;
    document.getElementById('profileMenuName').innerText = user.name;
    document.getElementById('profileMenuEmail').innerText = user.email;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

    // 2. Load Dropdowns
    locHelper = new LocationDropdownHelper({
        countryId: 'countrySelect',
        stateId: 'stateSelect',
        cityId: 'citySelect',
        defaultText: { country: 'Select Country', state: 'Select State', city: 'Select City' },
        useValueAsId: true
    });
    
    loadRecruiters();

    // 3. Initial Load
    loadJobs(1);
});

async function loadRecruiters() {
    try {
        const res = await fetch('/api/users'); // Assuming users endpoint exists
        const users = await res.json();
        const select = document.getElementById('recruiterSelect');
        users.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id;
            opt.textContent = u.name;
            select.appendChild(opt);
        });
    } catch (e) { console.error(e); }
}

async function loadJobs(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusFilter').value;

    let url = `/api/ats/jobs?page=${page}&limit=${recordsPerPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
            renderJobTable(data.jobs);
            renderPagination(data.pages, data.currentPage);
        }
    } catch (err) { console.error(err); }
}

function renderJobTable(jobs) {
    const tbody = document.getElementById('jobTableBody');
    if (!jobs || !jobs.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: var(--text-muted);">No matching jobs found.</td></tr>`;
        return;
    }

    tbody.innerHTML = jobs.map(j => `
        <tr>
            <td><code style="font-weight: 600;">${j.job_id}</code></td>
            <td><strong>${j.title}</strong></td>
            <td><span class="badge" style="background: rgba(99,102,241,0.1); color: var(--primary);">${j.department}</span></td>
            <td>${j.location ? j.location.name : '-'}</td>
            <td>${j.recruiter ? j.recruiter.name : '-'}</td>
            <td><span class="badge status-${j.status.toLowerCase().replace(/ /g, '-')}">${j.status}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-icon btn-sm" onclick="editJob(${j.id})" title="Edit Job">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn btn-icon btn-sm danger" onclick="deleteJob(${j.id})" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openJobModal() {
    editingJobId = null;
    document.getElementById('jobForm').reset();
    document.getElementById('modalTitle').textContent = 'Post New Job';
    
    if (locHelper) {
        locHelper.resetSelect(locHelper.countrySelect, 'Select Country');
        locHelper.resetSelect(locHelper.stateSelect, 'Select State');
        locHelper.resetSelect(locHelper.citySelect, 'Select City');
        locHelper.init();
    }
    
    document.getElementById('jobModal').classList.add('active');
}

async function editJob(id) {
    editingJobId = id;
    try {
        const res = await fetch(`/api/ats/jobs/${id}`);
        const data = await res.json();
        if (data.success) {
            const j = data.job;
            document.getElementById('modalTitle').textContent = 'Edit Job Posting';
            document.getElementById('jobTitle').value = j.title;
            document.getElementById('jobDept').value = j.department;
            
            if (locHelper && j.location) {
                const countryId = j.location.state?.country_id;
                const stateId = j.location.state_id;
                await locHelper.selectValues(countryId, stateId, j.city_id);
            } else {
                document.getElementById('citySelect').value = j.city_id || '';
            }
            
            document.getElementById('recruiterSelect').value = j.recruiter_id || '';
            document.getElementById('jobStatus').value = j.status;
            document.getElementById('jobDesc').value = j.description || '';
            document.getElementById('jobModal').classList.add('active');
        }
    } catch (e) { console.error(e); }
}

async function handleJobSubmit(e) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('jobTitle').value,
        department: document.getElementById('jobDept').value,
        city_id: document.getElementById('citySelect').value,
        recruiter_id: document.getElementById('recruiterSelect').value,
        status: document.getElementById('jobStatus').value,
        description: document.getElementById('jobDesc').value
    };

    const url = editingJobId ? `/api/ats/jobs/${editingJobId}` : '/api/ats/jobs';
    const method = editingJobId ? 'PATCH' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) { closeModal('jobModal'); loadJobs(currentPage); }
    } catch (err) { console.error(err); }
}

async function deleteJob(id) {
    if (!confirm('Are you certain you want to delete this job posting?')) return;
    try {
        const res = await fetch(`/api/ats/jobs/${id}`, { method: 'DELETE' });
        if (res.ok) loadJobs(currentPage);
    } catch (err) { console.error(err); }
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function resetFilters() { document.getElementById('searchInput').value = ''; document.getElementById('statusFilter').value = ''; loadJobs(1); }

function renderPagination(total, current) {
    const controls = document.getElementById('paginationControls');
    if (!total || total <= 1) { controls.innerHTML = ''; return; }
    let html = `<button class="btn btn-outline btn-sm" onclick="loadJobs(${current - 1})" ${current <= 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= total; i++) {
        html += `<button class="btn btn-sm ${current === i ? 'btn-primary' : 'btn-outline'}" onclick="loadJobs(${i})">${i}</button>`;
    }
    html += `<button class="btn btn-outline btn-sm" onclick="loadJobs(${current + 1})" ${current >= total ? 'disabled' : ''}>Next</button>`;
    controls.innerHTML = html;
}
