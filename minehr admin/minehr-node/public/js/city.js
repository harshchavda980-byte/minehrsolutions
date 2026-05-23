/**
 * City Management Logic
 */

let currentPage = 1;
const recordsPerPage = 10;
let editingCityId = null;
let sortField = 'name';
let sortOrder = 'ASC';
let locHelper;

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

    // 2. Load Countries via Helper
    locHelper = new LocationDropdownHelper({
        countryId: 'countrySelect',
        stateId: 'stateSelect',
        defaultText: { country: 'Select Country', state: 'Select State' },
        useValueAsId: true
    });

    // 3. Initial Load
    loadCities(1);
});

function handleSort(field) {
    if (sortField === field) {
        sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
        sortField = field;
        sortOrder = 'ASC';
    }
    loadCities(1);
}

function updateSortIndicators() {
    ['id', 'name', 'state_name', 'country_name', 'status'].forEach(field => {
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

async function loadCities(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusFilter').value;

    let url = `/api/locations?page=${page}&limit=${recordsPerPage}&sort=${sortField}&order=${sortOrder}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
            renderCityTable(data.cities);
            renderPagination(data.pages, data.currentPage, data.total);
            updateSortIndicators();
        }
    } catch (err) {
        console.error('Failed to fetch cities:', err);
    }
}

function renderCityTable(cities) {
    const tbody = document.getElementById('cityTableBody');
    if (!cities || !cities.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 60px; color: var(--text-muted);">No cities found in this region.</td></tr>`;
        return;
    }

    const startIdx = (currentPage - 1) * recordsPerPage;

    tbody.innerHTML = cities.map((c, index) => `
        <tr>
            <td style="color:var(--text-secondary); font-weight:700; font-size:13px;">#${String(startIdx + index + 1).padStart(3, '0')}</td>
            <td><strong style="color:var(--text-primary);">${c.name}</strong></td>
            <td style="color:var(--text-secondary);">${c.state ? c.state.name : '-'}</td>
            <td style="color:var(--text-secondary);">${c.state && c.state.country ? c.state.country.name : '-'}</td>
            <td>
                <span class="status-badge ${c.status.toLowerCase()}">${c.status}</span>
            </td>
            <td>
                <div class="action-group" style="justify-content: flex-end;">
                    <button class="btn-action" onclick="editCity(${c.id})" title="Edit City">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-action" onclick="toggleStatus(${c.id}, '${c.status}')" title="${c.status === 'Active' ? 'Deactivate' : 'Activate'}">
                        ${c.status === 'Active' ? 
                            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>' : 
                            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                        }
                    </button>
                    <button class="btn-action danger" onclick="deleteCity(${c.id})" title="Delete City">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openCityModal() {
    editingCityId = null;
    document.getElementById('cityForm').reset();
    document.getElementById('modalTitle').textContent = 'Add New City';
    if (locHelper) {
        locHelper.resetSelect(locHelper.countrySelect, 'Select Country');
        locHelper.resetSelect(locHelper.stateSelect, 'Select State');
        locHelper.init(); // Reload countries
    }
    document.getElementById('cityModal').classList.add('active');
}

async function editCity(id) {
    editingCityId = id;
    try {
        const res = await fetch(`/api/locations?limit=1000`); // Fetch more to find the one
        const data = await res.json();
        const city = data.cities.find(c => c.id === id);

        if (city) {
            document.getElementById('modalTitle').textContent = 'Update City';
            
            // Populate states and select the correct one
            if (locHelper) {
                await locHelper.selectValues(city.state.country_id, city.state_id, null);
            }
            
            document.getElementById('cityName').value = city.name;
            document.getElementById('cityStatus').value = city.status;
            document.getElementById('cityModal').classList.add('active');
        }
    } catch (e) { console.error(e); }
}

async function handleCitySubmit(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.innerText = 'Saving...';

    const payload = {
        name: document.getElementById('cityName').value,
        state_id: document.getElementById('stateSelect').value,
        status: document.getElementById('cityStatus').value
    };

    const url = editingCityId ? `/api/locations/${editingCityId}` : '/api/locations';
    const method = editingCityId ? 'PATCH' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            closeModal('cityModal');
            loadCities(currentPage);
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to save city');
        }
    } catch (err) { 
        console.error(err); 
        alert('An error occurred while saving.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = 'Save City Information';
    }
}

async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
        await fetch(`/api/locations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        loadCities(currentPage);
    } catch (e) { console.error(e); }
}

async function deleteCity(id) {
    if (!confirm('Are you sure you want to permanently delete this city?')) return;
    try {
        const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
        if (res.ok) loadCities(currentPage);
    } catch (err) { console.error(err); }
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    if (document.getElementById('globalSearch')) document.getElementById('globalSearch').value = '';
    loadCities(1);
}

function renderPagination(total, current, totalCount) {
    const controls = document.getElementById('paginationControls');
    if (!totalCount) {
        controls.innerHTML = '';
        return;
    }
    
    let html = `<div style="color:var(--text-muted); font-size:13px;">Showing page <strong>${current}</strong> of <strong>${total}</strong></div>`;
    html += `<div style="display:flex; gap:10px;">`;
    html += `<button class="btn btn-outline btn-sm" onclick="loadCities(${current - 1})" ${current <= 1 ? 'disabled' : ''}>Previous</button>`;
    
    // Page numbers
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
            html += `<button class="btn btn-sm ${current === i ? 'btn-primary' : 'btn-outline'}" onclick="loadCities(${i})">${i}</button>`;
        } else if (i === current - 2 || i === current + 2) {
            html += `<span style="color:var(--text-muted);">...</span>`;
        }
    }
    
    html += `<button class="btn btn-outline btn-sm" onclick="loadCities(${current + 1})" ${current >= total ? 'disabled' : ''}>Next</button>`;
    html += `</div>`;
    controls.innerHTML = html;
}
