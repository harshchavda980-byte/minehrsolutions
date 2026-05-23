document.addEventListener('DOMContentLoaded', () => {
    loadDevices();
    loadCities();
    setupAuth();
});

let currentPage = 1;
const limit = 10;
let searchTimeout;

async function loadDevices() {
    const type = document.getElementById('filterType').value;
    const city = document.getElementById('filterCity').value;
    const status = document.getElementById('filterStatus').value;
    const search = document.getElementById('deviceSearch').value;

    const params = new URLSearchParams({
        type, city, status, search,
        page: currentPage,
        limit
    });

    try {
        const res = await fetch(`/api/devices?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            renderTable(data.devices, (currentPage - 1) * limit);
            renderPagination(data.total, data.pages);
        }
    } catch (err) {
        console.error('Failed to load devices:', err);
    }
}

function renderTable(devices, startSrNo) {
    const tbody = document.getElementById('deviceTableBody');
    if (!devices || devices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center">No devices found.</td></tr>';
        return;
    }

    tbody.innerHTML = devices.map((d, index) => {
        const statusClass = d.status.toLowerCase().replace(' ', '-');
        return `
            <tr>
                <td>${startSrNo + index + 1}</td>
                <td><strong>${d.device_id}</strong></td>
                <td>${d.imei_no || 'N/A'}</td>
                <td>${d.device_type}</td>
                <td><span class="device-status status-${statusClass}">${d.status}</span></td>
                <td>${d.city_name || 'Ahmedabad'}</td>
                <td>${d.company ? d.company.name : 'N/A'}</td>
                <td>${d.installed_by || 'N/A'}</td>
                <td>${d.admin ? d.admin.name : 'N/A'}</td>
                <td>${d.installation_date ? window.formatDate(d.installation_date) : 'N/A'}</td>
                <td style="text-align: right;">
                    <div class="action-btns">
                        <button class="btn-device-action btn-edit" onclick="editDevice(${d.id})">
                             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                        </button>
                        <button class="btn-device-action btn-status" onclick="changeStatus(${d.id})">STATUS</button>
                        <button class="btn-device-action btn-timeline" onclick="viewTimeline(${d.id})">TIMELINE</button>
                        <button class="btn-device-action btn-delete" onclick="deleteDevice(${d.id})">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderPagination(total, pages) {
    const container = document.getElementById('pagination');
    if (pages <= 1) {
        container.innerHTML = `<div style="font-size: 12px; color: var(--text-muted);">Showing 1 to ${total} of ${total} entries</div>`;
        return;
    }

    let html = `<div style="font-size: 12px; color: var(--text-muted);">Showing ${(currentPage - 1) * limit + 1} to ${Math.min(currentPage * limit, total)} of ${total} entries</div>`;
    html += '<div class="pagination-btns">';
    for (let i = 1; i <= pages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    html += '</div>';
    container.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    loadDevices();
}

function debounceLoad() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage = 1;
        loadDevices();
    }, 500);
}

async function loadCities() {
    try {
        const res = await fetch('/api/locations/cities');
        const data = await res.json();
        if (data.success) {
            const select = document.getElementById('filterCity');
            data.cities.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.name;
                opt.textContent = c.name;
                select.appendChild(opt);
            });
        }
    } catch (err) { console.error(err); }
}

function setupAuth() {
    fetch('/api/auth/me').then(res => res.json()).then(user => {
        const profile = document.getElementById('profileDropdown');
        if (profile) {
            profile.innerHTML = `
                <div class="profile-trigger" onclick="toggleProfileMenu()">
                    <div style="text-align: right;">
                        <span style="font-weight:700; display: block;">${user.name}</span>
                        <span style="font-size:11px;color:var(--text-muted);font-weight:600;">${user.role}</span>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff" style="width:40px;height:40px;border-radius:12px;" />
                </div>
            `;
        }
    });
}

function deleteDevice(id) {
    if (!confirm('Move this device to Recycle Bin?')) return;
    fetch(`/api/devices/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            if (data.success) loadDevices();
            else alert(data.message);
        });
}

// Stubs for modal logic
function openAddDeviceModal() { alert('Add Device Modal - To be implemented'); }
function editDevice(id) { alert('Edit Device: ' + id); }
function changeStatus(id) { alert('Change Status: ' + id); }
function viewTimeline(id) { alert('View Timeline: ' + id); }
