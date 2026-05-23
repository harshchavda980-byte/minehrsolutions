/**
 * Activity Logs Logic
 */

let currentPage = 1;
const limit = 10;

document.addEventListener("DOMContentLoaded", async () => {
    const authRes = await fetch("/api/auth/me");
    if (!authRes.ok) { window.location.href = "/login"; return; }

    const user = await authRes.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userRole').innerText = user.role;
    document.getElementById('profileMenuName').innerText = user.name;
    document.getElementById('profileMenuEmail').innerText = user.email;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

    if (user.role !== 'Super Admin') {
        alert('Access Denied: Master Admin only.');
        window.location.href = "/dashboard";
        return;
    }

    initFilters();
    await fetchLogs();
});

const triggerFilter = () => {
    currentPage = 1;
    fetchLogs();
};

function initFilters() {
    const searchInput = document.getElementById('logSearch');
    const moduleFilter = document.getElementById('moduleFilter');
    const resetBtn = document.getElementById('resetFilters');

    // Initialize Custom Premium Calendar
    const fpStart = new MineHRDatePicker('startDate', { onSelect: triggerFilter });
    const fpEnd = new MineHRDatePicker('endDate', { onSelect: triggerFilter });

    searchInput?.addEventListener('input', debounce(triggerFilter, 500));
    moduleFilter?.addEventListener('change', triggerFilter);

    resetBtn?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (moduleFilter) moduleFilter.value = '';
        if (fpStart) fpStart.clear();
        if (fpEnd) fpEnd.clear();
        triggerFilter();
    });
}

async function fetchLogs() {
    try {
        const search = document.getElementById('logSearch')?.value || '';
        const module = document.getElementById('moduleFilter')?.value || '';
        const start = document.getElementById('startDate')?.value || '';
        const end = document.getElementById('endDate')?.value || '';

        const params = new URLSearchParams({
            page: currentPage,
            limit: limit,
            search,
            module,
            start_date: start,
            end_date: end
        });

        const res = await fetch(`/api/activities?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            renderLogs(data.logs);
            renderPagination(data.totalPages);
        }
    } catch (err) {
        console.error('Error fetching logs:', err);
    }
}

function renderLogs(logs) {
    const tbody = document.getElementById('logsTableBody');
    if (!tbody) return;

    if (!logs.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">No activity logs found.</td></tr>';
        return;
    }

    tbody.innerHTML = logs.map((l, idx) => {
        const date = formatDateTime(l.createdAt || l.created_at);
        const userName = l.User ? l.User.name : 'System';
        const companyName = l.Company ? l.Company.name : 'General';
        const serialNumber = (currentPage - 1) * limit + idx + 1;

        return `
            <tr onclick="showDetails(${l.id})" style="cursor:pointer;">
                <td style="color:var(--text-muted); font-size: 12px;">#${serialNumber}</td>
                <td style="white-space:nowrap;">${date}</td>
                <td><strong style="color:var(--text-primary);">${userName}</strong></td>
                <td><span style="color:var(--text-secondary);">${companyName}</span></td>
                <td><span class="log-badge module-${l.module.toLowerCase()}">${l.module}</span></td>
                <td><span style="font-weight:600;">${l.action}</span></td>
                <td style="text-align: right;"><span class="ip-text">${l.ip_address || '-'}</span></td>
            </tr>
        `;
    }).join('');
}

let activeLogs = []; // Stores logs for detail view lookup

async function showDetails(id) {
    window.location.href = `activity-details.html?id=${id}`;
}

function closeModal() {}

function renderPagination(totalPages) {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    let html = `
        <div class="pagination-info">Showing page ${currentPage} of ${totalPages}</div>
        <div class="pagination-controls">
            <button class="btn btn-sm ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
            <button class="btn btn-sm btn-primary" onclick="changePage(${currentPage})">${currentPage}</button>
            <button class="btn btn-sm ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        </div>
    `;
    container.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    fetchLogs();
}

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
