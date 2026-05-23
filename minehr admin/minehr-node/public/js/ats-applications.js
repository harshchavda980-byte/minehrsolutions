/**
 * ATS Applications Logic
 */

let currentPage = 1;
const recordsPerPage = 10;
let editingAppId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth & User Load
    const authRes = await fetch('/api/auth/me');
    if (!authRes.ok) { window.location.href = '/login'; return; }
    const user = await authRes.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userRole').innerText = user.role;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

    // 2. Load Jobs for filters and dropdowns
    loadJobs();

    // 3. Initial Load
    loadApplications(1);
});

async function loadJobs() {
    try {
        const res = await fetch('/api/ats/jobs?limit=100');
        const data = await res.json();
        const filter = document.getElementById('jobFilter');
        const select = document.getElementById('jobSelect');
        
        data.jobs.forEach(j => {
            const opt = document.createElement('option');
            opt.value = j.id;
            opt.textContent = j.title;
            filter.appendChild(opt.cloneNode(true));
            select.appendChild(opt);
        });
    } catch (e) { console.error(e); }
}

async function loadApplications(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusFilter').value;
    const job_id = document.getElementById('jobFilter').value;

    let url = `/api/ats/applications?page=${page}&limit=${recordsPerPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;
    if (job_id) url += `&job_id=${job_id}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
            renderAppTable(data.applications);
            renderPagination(data.pages, data.currentPage);
        }
    } catch (err) { console.error(err); }
}

function renderAppTable(apps) {
    const tbody = document.getElementById('appTableBody');
    if (!apps || !apps.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: var(--text-muted);">No applications found.</td></tr>`;
        return;
    }

    tbody.innerHTML = apps.map(a => `
        <tr>
            <td><code style="font-weight: 600;">${a.application_id}</code></td>
            <td>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 600;">${a.candidate_name}</span>
                    <span style="font-size: 11px; color: var(--text-muted);">${a.email}</span>
                </div>
            </td>
            <td><strong>${a.job?.title || 'Unknown Job'}</strong></td>
            <td>${a.source}</td>
            <td><span class="badge status-${a.status.toLowerCase().replace(/ /g, '-')}">${a.status}</span></td>
            <td>${formatDate(a.created_at)}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-icon btn-sm" onclick="viewDetails(${a.id})" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button class="btn btn-icon btn-sm danger" onclick="deleteApp(${a.id})" title="Remove">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function viewDetails(id) {
    try {
        const res = await fetch(`/api/ats/applications/${id}`);
        const data = await res.json();
        if (data.success) {
            const a = data.application;
            const notes = data.notes;
            
            let notesHtml = notes.map(n => `
                <div class="note-item">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 5px;">
                        <span>By: ${n.author?.name || 'System'}</span>
                        <span>${new Date(n.created_at).toLocaleString()}</span>
                    </div>
                    <div>${n.note}</div>
                </div>
            `).join('');

            document.getElementById('detailsContent').innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h3>Candidate Info</h3>
                        <p><strong>Name:</strong> ${a.candidate_name}</p>
                        <p><strong>Email:</strong> ${a.email}</p>
                        <p><strong>Phone:</strong> ${a.phone || '-'}</p>
                        <p><strong>Source:</strong> ${a.source}</p>
                    </div>
                    <div>
                        <h3>Status Management</h3>
                        <div class="form-group">
                            <label>Current Status</label>
                            <select class="form-control" onchange="updateStatus(${a.id}, this.value)">
                                <option value="New" ${a.status === 'New' ? 'selected' : ''}>New</option>
                                <option value="Reviewed" ${a.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
                                <option value="Interview Scheduled" ${a.status === 'Interview Scheduled' ? 'selected' : ''}>Interview Scheduled</option>
                                <option value="Hired" ${a.status === 'Hired' ? 'selected' : ''}>Hired</option>
                                <option value="Rejected" ${a.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>
                <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--glass-border);">
                <h3>Recruitment Notes</h3>
                <div id="notesList" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px;">
                    ${notesHtml || '<p style="color: var(--text-muted);">No notes yet.</p>'}
                </div>
                <div class="form-group">
                    <textarea id="newNote" class="form-control" rows="2" placeholder="Add a note..."></textarea>
                    <button class="btn btn-primary btn-sm" style="margin-top: 10px;" onclick="addNote(${a.id})">Add Note</button>
                </div>
            `;
            document.getElementById('detailsModal').classList.add('active');
        }
    } catch (e) { console.error(e); }
}

async function updateStatus(id, status) {
    try {
        await fetch(`/api/ats/applications/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        loadApplications(currentPage);
    } catch (e) { console.error(e); }
}

async function addNote(app_id) {
    const note = document.getElementById('newNote').value;
    if (!note) return;
    try {
        const res = await fetch('/api/ats/applications/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ application_id: app_id, note })
        });
        if (res.ok) {
            viewDetails(app_id); // Refresh details
        }
    } catch (e) { console.error(e); }
}

function openApplicationModal() {
    editingAppId = null;
    document.getElementById('appForm').reset();
    document.getElementById('modalTitle').textContent = 'Add New Lead';
    document.getElementById('appModal').classList.add('active');
}

async function handleAppSubmit(e) {
    e.preventDefault();
    const payload = {
        candidate_name: document.getElementById('candName').value,
        email: document.getElementById('candEmail').value,
        phone: document.getElementById('candPhone').value,
        job_id: document.getElementById('jobSelect').value,
        source: document.getElementById('candSource').value
    };

    try {
        const res = await fetch('/api/ats/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) { closeModal('appModal'); loadApplications(currentPage); }
    } catch (err) { console.error(err); }
}

async function deleteApp(id) {
    if (!confirm('Are you sure you want to remove this application?')) return;
    try {
        const res = await fetch(`/api/ats/applications/${id}`, { method: 'DELETE' });
        if (res.ok) loadApplications(currentPage);
    } catch (err) { console.error(err); }
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function resetFilters() { document.getElementById('searchInput').value = ''; document.getElementById('statusFilter').value = ''; document.getElementById('jobFilter').value = ''; loadApplications(1); }

function renderPagination(total, current) {
    const controls = document.getElementById('paginationControls');
    if (!total || total <= 1) { controls.innerHTML = ''; return; }
    let html = `<button class="btn btn-outline btn-sm" onclick="loadApplications(${current - 1})" ${current <= 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= total; i++) {
        html += `<button class="btn btn-sm ${current === i ? 'btn-primary' : 'btn-outline'}" onclick="loadApplications(${i})">${i}</button>`;
    }
    html += `<button class="btn btn-outline btn-sm" onclick="loadApplications(${current + 1})" ${current >= total ? 'disabled' : ''}>Next</button>`;
    controls.innerHTML = html;
}
