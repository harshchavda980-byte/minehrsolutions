/**
 * Company Not Found Requests Logic
 */

let currentStatus = 'Pending';
let currentPage = 1;
const limit = 10;

document.addEventListener('DOMContentLoaded', async () => {
    // Auth check
    const authRes = await fetch('/api/auth/me');
    if (!authRes.ok) {
        window.location.href = '/login';
        return;
    }
    const user = await authRes.json();
    document.getElementById('userName').innerText = user.name;

    loadRequests();
});

async function loadRequests(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const type = document.getElementById('typeFilter').value;

    let url = `/api/company-requests?status=${currentStatus}&page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (type) url += `&request_type=${type}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderTable(data.requests);
        renderPagination(data.pages, data.currentPage);
    } catch (err) {
        console.error('Error loading requests:', err);
    }
}

function renderTable(requests) {
    const tbody = document.getElementById('requestTableBody');
    if (!requests.length) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color: var(--text-muted);">No records found in ${currentStatus}.</td></tr>`;
        return;
    }

    tbody.innerHTML = requests.map(r => `
        <tr>
            <td style="font-weight: 600;">#${r.request_id}</td>
            <td><strong>${r.name}</strong></td>
            <td>
                <strong>${r.company_name}</strong><br>
                <small>${r.employees_count || 0} Employees</small>
            </td>
            <td>
                ${r.email}<br>
                <small>${r.mobile}</small>
            </td>
            <td>
                <span class="badge badge-info">${r.request_type || 'N/A'}</span><br>
                <small>${r.source}</small>
            </td>
            <td>${r.city || '-'}<br><small>${r.country || '-'}</small></td>
            <td><span class="badge ${r.status === 'Solved' ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-icon btn-sm" onclick="viewDetails(${r.id})" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    ${r.status === 'Pending' ? `
                        <button class="btn btn-icon btn-sm success" onclick="solveRequest(${r.id})" title="Mark Solved">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function switchTab(status) {
    currentStatus = status;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    loadRequests(1);
}

function filterRequests() {
    loadRequests(1);
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = '';
    loadRequests(1);
}

async function solveRequest(id) {
    if (!confirm('Mark this request as solved?')) return;
    try {
        const res = await fetch(`/api/company-requests/${id}/solve`, { method: 'PATCH' });
        if (res.ok) loadRequests(currentPage);
    } catch (err) { console.error(err); }
}

async function viewDetails(id) {
    try {
        const res = await fetch(`/api/company-requests/${id}`);
        const r = await res.json();

        document.getElementById('modalReqId').textContent = `Request #${r.request_id}`;
        document.getElementById('modalBody').innerHTML = `
            <div class="preview-item"><span>Requester Name</span><p>${r.name}</p></div>
            <div class="preview-item"><span>Mobile</span><p>${r.mobile}</p></div>
            <div class="preview-item"><span>Email</span><p>${r.email}</p></div>
            <div class="preview-item"><span>Company Name</span><p>${r.company_name}</p></div>
            <div class="preview-item"><span>Employees</span><p>${r.employees_count || 0}</p></div>
            <div class="preview-item"><span>Request Type</span><p>${r.request_type || 'N/A'}</p></div>
            <div class="preview-item"><span>Location</span><p>${r.city}, ${r.country}</p></div>
            <div class="preview-item"><span>Source</span><p>${r.source}</p></div>
            <div class="preview-item"><span>Date</span><p>${new Date(r.created_at).toLocaleString()}</p></div>
            <div class="preview-item"><span>Status</span><p>${r.status}</p></div>
        `;

        const solveBtn = document.getElementById('modalSolveBtn');
        if (r.status === 'Solved') {
            solveBtn.style.display = 'none';
        } else {
            solveBtn.style.display = 'block';
            solveBtn.onclick = () => { closeModal(); solveRequest(r.id); };
        }

        document.getElementById('requestModal').classList.add('active');
    } catch (err) { console.error(err); }
}

function closeModal() {
    document.getElementById('requestModal').classList.remove('active');
}

function renderPagination(total, current) {
    const controls = document.getElementById('paginationControls');
    let html = `<button class="btn btn-outline btn-sm" onclick="loadRequests(${current - 1})" ${current <= 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= total; i++) {
        html += `<button class="btn btn-sm ${current === i ? 'btn-primary' : 'btn-outline'}" onclick="loadRequests(${i})">${i}</button>`;
    }
    html += `<button class="btn btn-outline btn-sm" onclick="loadRequests(${current + 1})" ${current >= total ? 'disabled' : ''}>Next</button>`;
    controls.innerHTML = html;
}
