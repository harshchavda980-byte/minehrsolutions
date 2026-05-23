/**
 * CRM Demo Requests Logic
 */

let currentPage = 1;
const recordsPerPage = 10;
let currentRequestId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth & User Load
    const authRes = await fetch('/api/auth/me');
    if (!authRes.ok) {
        window.location.href = '/login';
        return;
    }
    const user = await authRes.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userRole').innerText = user.role;
    document.getElementById('profileMenuName').innerText = user.name;
    document.getElementById('profileMenuEmail').innerText = user.email;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

    // 2. Load Sales Team for dropdown
    try {
        const userRes = await fetch('/api/users');
        const userData = await userRes.json();
        const assigneeSelect = document.getElementById('demoAssignee');
        assigneeSelect.innerHTML = '<option value="">Unassigned</option>';
        userData.users.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id;
            opt.textContent = u.name;
            assigneeSelect.appendChild(opt);
        });
    } catch (e) { console.error('Failed to load users:', e); }

    // 3. Initial Load
    loadDemoRequests(1);
});

async function loadDemoRequests(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusFilter').value;
    const source = document.getElementById('sourceFilter').value;

    let url = `/api/demo-requests?page=${page}&limit=${recordsPerPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;
    if (source) url += `&source=${source}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderDemoTable(data.requests);
        renderPagination(data.pages, data.currentPage);
    } catch (err) {
        console.error('Failed to fetch requests:', err);
    }
}

function renderDemoTable(requests) {
    const tbody = document.getElementById('demoTableBody');
    if (!requests || !requests.length) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color: var(--text-muted);">No demo requests found.</td></tr>`;
        return;
    }

    tbody.innerHTML = requests.map(r => `
        <tr>
            <td style="font-weight: 600;">#${r.request_id}</td>
            <td><strong>${r.name}</strong><br><small class="text-muted">${r.email}</small></td>
            <td>${r.company_name || '-'}</td>
            <td>${r.product_interest || '-'}</td>
            <td>${r.preferred_datetime ? new Date(r.preferred_datetime).toLocaleString() : '<span class="text-muted">Not Set</span>'}</td>
            <td><span class="badge status-${r.status.toLowerCase()}">${r.status}</span></td>
            <td>${r.assignee ? r.assignee.name : '<span class="text-muted">None</span>'}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-icon btn-sm" onclick="viewRequest(${r.id})" title="View / Schedule">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </button>
                    <button class="btn btn-icon btn-sm danger" onclick="deleteRequest(${r.id})" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function viewRequest(id) {
    currentRequestId = id;
    try {
        const res = await fetch(`/api/demo-requests/${id}`);
        const r = await res.json();

        document.getElementById('modalRequestId').textContent = `Request #${r.request_id}`;
        document.getElementById('requestDetails').innerHTML = `
            <div class="preview-item"><span>Name</span><p>${r.name}</p></div>
            <div class="preview-item"><span>Phone</span><p>${r.phone}</p></div>
            <div class="preview-item"><span>Email</span><p>${r.email}</p></div>
            <div class="preview-item"><span>Company</span><p>${r.company_name || '-'}</p></div>
            <div class="preview-item"><span>Interests</span><p>${r.product_interest || '-'}</p></div>
            <div class="preview-item"><span>Source</span><p>${r.request_source}</p></div>
        `;

        if (r.preferred_datetime) {
            const dt = new Date(r.preferred_datetime);
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            document.getElementById('demoDateTime').value = dt.toISOString().slice(0, 16);
        } else {
            document.getElementById('demoDateTime').value = '';
        }

        document.getElementById('demoAssignee').value = r.assigned_to || '';
        document.getElementById('demoNotes').value = r.notes || '';
        document.getElementById('requestStatus').value = r.status;

        document.getElementById('demoModal').classList.add('active');
    } catch (err) { console.error(err); }
}

async function saveDemoUpdate() {
    const payload = {
        preferred_datetime: document.getElementById('demoDateTime').value || null,
        assigned_to: document.getElementById('demoAssignee').value || null,
        notes: document.getElementById('demoNotes').value,
        status: document.getElementById('requestStatus').value
    };

    try {
        const res = await fetch(`/api/demo-requests/${currentRequestId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            closeModal('demoModal');
            loadDemoRequests(currentPage);
        }
    } catch (err) { console.error(err); }
}

function openCreateModal() {
    document.getElementById('createForm').reset();
    document.getElementById('createModal').classList.add('active');
}

async function handleCreateRequest(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('newName').value,
        email: document.getElementById('newEmail').value,
        phone: document.getElementById('newPhone').value,
        company_name: document.getElementById('newCompany').value,
        product_interest: document.getElementById('newInterest').value,
        request_source: document.getElementById('newSource').value
    };

    try {
        const res = await fetch('/api/demo-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            closeModal('createModal');
            loadDemoRequests(1);
        }
    } catch (err) { console.error(err); }
}

async function deleteRequest(id) {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
        const res = await fetch(`/api/demo-requests/${id}`, { method: 'DELETE' });
        if (res.ok) loadDemoRequests(currentPage);
    } catch (err) { console.error(err); }
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('sourceFilter').value = '';
    loadDemoRequests(1);
}

function renderPagination(total, current) {
    const controls = document.getElementById('paginationControls');
    if (!total || total <= 1) {
        controls.innerHTML = '';
        return;
    }
    let html = `<button class="btn btn-outline btn-sm" onclick="loadDemoRequests(${current - 1})" ${current <= 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= total; i++) {
        html += `<button class="btn btn-sm ${current === i ? 'btn-primary' : 'btn-outline'}" onclick="loadDemoRequests(${i})">${i}</button>`;
    }
    html += `<button class="btn btn-outline btn-sm" onclick="loadDemoRequests(${current + 1})" ${current >= total ? 'disabled' : ''}>Next</button>`;
    controls.innerHTML = html;
}
