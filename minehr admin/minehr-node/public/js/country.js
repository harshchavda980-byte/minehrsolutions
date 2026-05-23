/**
 * Country Management Logic
 */

let currentPage = 1;
const recordsPerPage = 10;
let editingId = null;
let sortField = 'name';
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
    loadCountries(1);
});

function handleSort(field) {
    if (sortField === field) {
        sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
        sortField = field;
        sortOrder = 'ASC';
    }
    loadCountries(1);
}

function updateSortIndicators() {
    ['id', 'name', 'code', 'status'].forEach(field => {
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

async function loadCountries(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusFilter').value;

    let url = `/api/locations/countries?page=${page}&limit=${recordsPerPage}&sort=${sortField}&order=${sortOrder}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
            renderTable(data.countries);
            renderPagination(data.pages, data.currentPage, data.total);
            updateSortIndicators();
        }
    } catch (err) { console.error(err); }
}

function renderTable(countries) {
    const tbody = document.getElementById('countryTableBody');
    if (!countries || !countries.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 60px; color: var(--text-muted);">No countries found.</td></tr>`;
        return;
    }

    const startIdx = (currentPage - 1) * recordsPerPage;

    tbody.innerHTML = countries.map((c, index) => `
        <tr>
            <td style="color:var(--text-secondary); font-weight:700; font-size:13px;">#${String(startIdx + index + 1).padStart(3, '0')}</td>
            <td><strong style="color:var(--text-primary);">${c.name}</strong></td>
            <td><code>${c.code}</code></td>
            <td><span class="status-badge ${c.status.toLowerCase()}">${c.status}</span></td>
            <td>
                <div class="action-group" style="justify-content: flex-end;">
                    <button class="btn-action" onclick="editCountry(${c.id}, '${c.name}', '${c.code}', '${c.status}')" title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-action" onclick="toggleStatus(${c.id}, '${c.status === 'Active' ? 'Inactive' : 'Active'}')" title="Toggle Status">
                        ${c.status === 'Active' ? 
                            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>' : 
                            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                        }
                    </button>
                    <button class="btn-action danger" onclick="deleteCountry(${c.id})" title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openCountryModal() {
    editingId = null;
    document.getElementById('countryForm').reset();
    document.getElementById('modalTitle').textContent = 'Add New Country';
    document.getElementById('countryModal').classList.add('active');
}

function editCountry(id, name, code, status) {
    editingId = id;
    document.getElementById('modalTitle').textContent = 'Update Country';
    document.getElementById('countryName').value = name;
    document.getElementById('countryCode').value = code;
    document.getElementById('countryStatus').value = status;
    document.getElementById('countryModal').classList.add('active');
}

async function handleCountrySubmit(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.innerText = 'Saving...';

    const payload = {
        name: document.getElementById('countryName').value,
        code: document.getElementById('countryCode').value,
        status: document.getElementById('countryStatus').value
    };

    const url = editingId ? `/api/locations/countries/${editingId}` : '/api/locations/countries';
    const method = editingId ? 'PATCH' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) { closeModal('countryModal'); loadCountries(currentPage); }
    } catch (err) { console.error(err); }
    finally { saveBtn.disabled = false; saveBtn.innerText = 'Save Country Information'; }
}

async function toggleStatus(id, newStatus) {
    try {
        await fetch(`/api/locations/countries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        loadCountries(currentPage);
    } catch (e) { console.error(e); }
}

async function deleteCountry(id) {
    if (!confirm('Permanently delete this country?')) return;
    try {
        const res = await fetch(`/api/locations/countries/${id}`, { method: 'DELETE' });
        if (res.ok) loadCountries(currentPage);
    } catch (err) { console.error(err); }
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function resetFilters() { document.getElementById('searchInput').value = ''; document.getElementById('statusFilter').value = ''; loadCountries(1); }

function renderPagination(total, current, totalCount) {
    const controls = document.getElementById('paginationControls');
    if (!totalCount || total <= 1) { controls.innerHTML = ''; return; }
    let html = `<div style="color:var(--text-muted); font-size:13px;">Page ${current} of ${total}</div>`;
    html += `<div style="display:flex; gap:8px;">`;
    html += `<button class="btn btn-outline btn-sm" onclick="loadCountries(${current - 1})" ${current <= 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
            html += `<button class="btn btn-sm ${current === i ? 'btn-primary' : 'btn-outline'}" onclick="loadCountries(${i})">${i}</button>`;
        }
    }
    html += `<button class="btn btn-outline btn-sm" onclick="loadCountries(${current + 1})" ${current >= total ? 'disabled' : ''}>Next</button>`;
    html += `</div>`;
    controls.innerHTML = html;
}
