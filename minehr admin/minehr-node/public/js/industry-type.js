/**
 * Industry Type Management Logic
 */

let currentPage = 1;
const recordsPerPage = 10;
let editingIndustryId = null;
let sortField = 'sequence';
let sortOrder = 'ASC';

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

    // 2. Initial Load
    loadIndustries(1);
});

function handleSort(field) {
    if (sortField === field) {
        sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
        sortField = field;
        sortOrder = 'ASC';
    }
    loadIndustries(1);
}

function updateSortIndicators() {
    ['id', 'sequence', 'name', 'status'].forEach(field => {
        const el = document.getElementById(`sort_${field}`);
        if (el) {
            if (sortField === field) {
                el.innerHTML = sortOrder === 'ASC' ? ' ↑' : ' ↓';
                el.style.color = 'var(--primary)';
            } else {
                el.innerHTML = '';
            }
        }
    });
}

async function loadIndustries(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusFilter').value;

    let url = `/api/settings/industry-types?page=${page}&limit=${recordsPerPage}&sort=${sortField}&order=${sortOrder}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
            renderIndustryTable(data.industryTypes);
            renderPagination(data.pages, data.currentPage, data.total);
            updateSortIndicators();
        }
    } catch (err) { console.error(err); }
}

function renderIndustryTable(industries) {
    const tbody = document.getElementById('industryTableBody');
    if (!industries || !industries.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--text-muted);">No industry types found.</td></tr>`;
        return;
    }

    const startIdx = (currentPage - 1) * recordsPerPage;

    tbody.innerHTML = industries.map((i, index) => `
        <tr>
            <td style="color:var(--text-secondary); font-weight:700; font-size:13px;">#${String(startIdx + index + 1).padStart(3, '0')}</td>
            <td><span class="badge badge-info">${i.sequence || 0}</span></td>
            <td><strong>${i.name}</strong></td>
            <td><div style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${i.description || ''}">${i.description || '-'}</div></td>
            <td><span class="badge ${i.status === 'Active' ? 'badge-success' : 'badge-danger'}">${i.status}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-icon btn-sm" onclick="editIndustry(${JSON.stringify(i).replace(/"/g, '&quot;')})" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn btn-icon btn-sm danger" onclick="deleteIndustry(${i.id})" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openIndustryModal() {
    editingIndustryId = null;
    document.getElementById('industryForm').reset();
    document.getElementById('modalTitle').textContent = 'Add Industry Type';
    document.getElementById('industryModal').classList.add('active');
}

function editIndustry(i) {
    editingIndustryId = i.id;
    document.getElementById('modalTitle').textContent = 'Update Industry Type';
    document.getElementById('industryName').value = i.name;
    document.getElementById('industryDesc').value = i.description || '';
    document.getElementById('industryStatus').value = i.status;
    document.getElementById('industrySeq').value = i.sequence || 0;
    document.getElementById('industryModal').classList.add('active');
}

async function handleIndustrySubmit(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('industryName').value,
        description: document.getElementById('industryDesc').value,
        status: document.getElementById('industryStatus').value,
        sequence: parseInt(document.getElementById('industrySeq').value) || 0
    };

    const url = editingIndustryId ? `/api/settings/industry-types/${editingIndustryId}` : '/api/settings/industry-types';
    const method = editingIndustryId ? 'PATCH' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) { closeModal('industryModal'); loadIndustries(currentPage); }
        else {
            const data = await res.json();
            alert(data.message || 'An error occurred');
        }
    } catch (err) { console.error(err); }
}

async function deleteIndustry(id) {
    if (!confirm('Are you certain you want to delete this industry type?')) return;
    try {
        const res = await fetch(`/api/settings/industry-types/${id}`, { method: 'DELETE' });
        if (res.ok) loadIndustries(currentPage);
    } catch (err) { console.error(err); }
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function resetFilters() { document.getElementById('searchInput').value = ''; document.getElementById('statusFilter').value = ''; loadIndustries(1); }

function renderPagination(total, current, totalCount) {
    const controls = document.getElementById('paginationControls');
    if (!totalCount || total <= 1) { controls.innerHTML = ''; return; }
    let html = `<div style="color:var(--text-muted); font-size:13px; margin-right: 15px;">Page ${current} of ${total}</div>`;
    html += `<div style="display:flex; gap:8px;">`;
    html += `<button class="btn btn-outline btn-sm" onclick="loadIndustries(${current - 1})" ${current <= 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
            html += `<button class="btn btn-sm ${current === i ? 'btn-primary' : 'btn-outline'}" onclick="loadIndustries(${i})">${i}</button>`;
        }
    }
    html += `<button class="btn btn-outline btn-sm" onclick="loadIndustries(${current + 1})" ${current >= total ? 'disabled' : ''}>Next</button>`;
    html += `</div>`;
    controls.innerHTML = html;
}
