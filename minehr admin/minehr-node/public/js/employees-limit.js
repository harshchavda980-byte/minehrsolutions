/**
 * Employee Limit Monitoring & Management Logic
 */

let currentPage = 1;
let currentHistoryPage = 1;
const limit = 10;
let allCompanies = [];

document.addEventListener("DOMContentLoaded", async () => {
    const authRes = await fetch("/api/auth/me");
    if (!authRes.ok) { window.location.href = "/login"; return; }

    initFilters();
    initForms();
    await fetchStats();
    await loadCompanyList();
});

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`${tab}Tab`).classList.add('active');

    if (tab === 'track') fetchHistory(1);
}

function initFilters() {
    const searchInput = document.getElementById('companySearch');
    const statusFilter = document.getElementById('limitStatusFilter');
    searchInput?.addEventListener('input', () => { currentPage = 1; fetchStats(); });
    statusFilter?.addEventListener('change', () => { currentPage = 1; fetchStats(); });
}

function initForms() {
    const form = document.getElementById('updateLimitForm');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const companyId = document.getElementById('updateCompanyId').value;
        const payload = {
            new_limit: document.getElementById('newLimitValue').value,
            reason: document.getElementById('updateReason').value
        };

        try {
            const res = await fetch(`/api/employee-count/${companyId}/limit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                alert('Limit updated!');
                form.reset();
                switchTab('crm');
                fetchStats();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (err) { console.error(err); }
    });
}

async function loadCompanyList() {
    try {
        const res = await fetch('/api/companies?status=verified');
        allCompanies = await res.json();
        const select = document.getElementById('updateCompanyId');
        select.innerHTML = '<option value="">Choose a company...</option>' + 
            allCompanies.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch (err) { console.error(err); }
}

async function fetchStats() {
    try {
        const search = document.getElementById('companySearch')?.value || '';
        const status = document.getElementById('limitStatusFilter')?.value || '';
        const res = await fetch(`/api/employee-count?search=${search}&status=${status}&page=${currentPage}`);
        const data = await res.json();
        if (data.success) { renderStats(data.data); }
    } catch (err) { console.error(err); }
}

function renderStats(stats) {
    const tbody = document.getElementById('statsTableBody');
    if (!tbody) return;
    if (!stats.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">No records found.</td></tr>';
        return;
    }
    tbody.innerHTML = stats.map(s => {
        const percent = Math.min(100, (s.current_count / s.employee_limit) * 100);
        let barColor = '#22c55e';
        if (s.status === 'Limit Reached') barColor = '#f59e0b';
        if (s.status === 'Limit Exceeded') barColor = '#ef4444';

        return `
            <tr>
                <td><strong>${s.name}</strong> <small style="color:var(--text-muted);">#${s.id}</small></td>
                <td>${s.employee_limit}</td>
                <td>${s.current_count}</td>
                <td>${s.remaining_slots}</td>
                <td><span class="limit-status ${getStatusClass(s.status)}">${s.status}</span></td>
                <td style="min-width: 150px;">
                    <div style="font-size: 11px; margin-bottom: 2px; color: var(--text-muted);">${Math.round(percent)}% used</div>
                    <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${percent}%; background: ${barColor};"></div></div>
                </td>
                <td style="text-align: right;">
                    <button class="btn btn-outline btn-sm" onclick="quickEditLimit(${s.id}, ${s.employee_limit})">Edit Limit</button>
                </td>
            </tr>
        `;
    }).join('');
}

function getStatusClass(status) {
    if (status === 'Within Limit') return 'status-within';
    if (status === 'Limit Reached') return 'status-reached';
    return 'status-exceeded';
}

function quickEditLimit(id, limit) {
    switchTab('update');
    document.getElementById('updateCompanyId').value = id;
    document.getElementById('newLimitValue').value = limit;
}

async function fetchHistory(page = 1) {
    currentHistoryPage = page;
    try {
        const res = await fetch(`/api/employee-count/history?page=${page}`);
        const data = await res.json();
        if (data.success) { renderHistory(data.history); }
    } catch (err) { console.error(err); }
}

function renderHistory(history) {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;
    if (!history.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted);">No history found.</td></tr>';
        return;
    }
    tbody.innerHTML = history.map(h => `
        <tr>
            <td><small>${new Date(h.changed_at).toLocaleString()}</small></td>
            <td><strong>${h.company?.name || 'N/A'}</strong></td>
            <td>${h.old_limit}</td>
            <td><span style="color: var(--primary); font-weight: 700;">${h.new_limit}</span></td>
            <td>${h.modifier?.name || 'System'}</td>
            <td><small>${h.reason || '-'}</small></td>
        </tr>
    `).join('');
}
