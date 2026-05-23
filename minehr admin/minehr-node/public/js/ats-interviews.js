/**
 * ATS Interview Management Logic
 */

let currentPage = 1;
const recordsPerPage = 10;
let currentIntId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth & User Load
    const authRes = await fetch('/api/auth/me');
    if (!authRes.ok) { window.location.href = '/login'; return; }
    const user = await authRes.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userRole').innerText = user.role;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

    // 2. Load Applications for scheduling
    loadApplications();

    // 3. Initial Load
    loadInterviews(1);
});

async function loadApplications() {
    try {
        const res = await fetch('/api/ats/applications?limit=100');
        const data = await res.json();
        const select = document.getElementById('appSelect');
        data.applications.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.id;
            opt.textContent = `${a.candidate_name} - ${a.job?.title || 'Unknown'}`;
            select.appendChild(opt);
        });
    } catch (e) { console.error(e); }
}

async function loadInterviews(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusFilter').value;

    let url = `/api/ats/interviews?page=${page}&limit=${recordsPerPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
            renderInterviewTable(data.interviews);
            renderPagination(data.pages, data.currentPage);
        }
    } catch (err) { console.error(err); }
}

function renderInterviewTable(ints) {
    const tbody = document.getElementById('interviewTableBody');
    if (!ints || !ints.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: var(--text-muted);">No interviews scheduled.</td></tr>`;
        return;
    }

    tbody.innerHTML = ints.map(i => `
        <tr>
            <td><code style="font-weight: 600;">${i.interview_id}</code></td>
            <td>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 600;">${i.application?.candidate_name || 'Deleted'}</span>
                    <span style="font-size: 11px; color: var(--text-muted);">${i.application?.email || ''}</span>
                </div>
            </td>
            <td><strong>${i.application?.job?.title || '-'}</strong></td>
            <td>${i.type}</td>
            <td>${new Date(i.scheduled_at).toLocaleString()}</td>
            <td><span class="badge status-${i.status.toLowerCase()}">${i.status}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-icon btn-sm" onclick="openStatusModal(${i.id}, '${i.status}')" title="Update Status">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 11.08V12a8 8 0 1 1-4.24-7.06"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </button>
                    <button class="btn btn-icon btn-sm danger" onclick="deleteInterview(${i.id})" title="Cancel">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openInterviewModal() {
    document.getElementById('interviewForm').reset();
    document.getElementById('interviewModal').classList.add('active');
}

function openStatusModal(id, currentStatus) {
    currentIntId = id;
    document.getElementById('updateStatusSelect').value = currentStatus;
    document.getElementById('statusModal').classList.add('active');
}

async function confirmStatusUpdate() {
    const status = document.getElementById('updateStatusSelect').value;
    try {
        const res = await fetch(`/api/ats/interviews/${currentIntId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (res.ok) { closeModal('statusModal'); loadInterviews(currentPage); }
    } catch (e) { console.error(e); }
}

async function handleInterviewSubmit(e) {
    e.preventDefault();
    const payload = {
        application_id: document.getElementById('appSelect').value,
        type: document.getElementById('intType').value,
        scheduled_at: document.getElementById('intDateTime').value,
        interviewer_ids: document.getElementById('intViewers').value,
        notes: document.getElementById('intNotes').value
    };

    try {
        const res = await fetch('/api/ats/interviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) { closeModal('interviewModal'); loadInterviews(currentPage); }
    } catch (err) { console.error(err); }
}

async function deleteInterview(id) {
    if (!confirm('Are you certain you want to cancel this interview?')) return;
    try {
        const res = await fetch(`/api/ats/interviews/${id}`, { method: 'DELETE' });
        if (res.ok) loadInterviews(currentPage);
    } catch (err) { console.error(err); }
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function resetFilters() { document.getElementById('searchInput').value = ''; document.getElementById('statusFilter').value = ''; loadInterviews(1); }

function renderPagination(total, current) {
    const controls = document.getElementById('paginationControls');
    if (!total || total <= 1) { controls.innerHTML = ''; return; }
    let html = `<button class="btn btn-outline btn-sm" onclick="loadInterviews(${current - 1})" ${current <= 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= total; i++) {
        html += `<button class="btn btn-sm ${current === i ? 'btn-primary' : 'btn-outline'}" onclick="loadInterviews(${i})">${i}</button>`;
    }
    html += `<button class="btn btn-outline btn-sm" onclick="loadInterviews(${current + 1})" ${current >= total ? 'disabled' : ''}>Next</button>`;
    controls.innerHTML = html;
}
