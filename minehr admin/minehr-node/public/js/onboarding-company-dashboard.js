/**
 * Company Dashboard Logic
 */

let currentTab = 'COMPANY';
let currentPage = 1;
const limit = 10;

async function fetchStats() {
    try {
        const res = await fetch('/api/onboarding/dashboard-stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await res.json();
        if (result.success) {
            const d = result.data;
            
            // Overview Cards
            document.getElementById('stat_total_companies').textContent = d.overview.total.toLocaleString();
            document.getElementById('stat_total_year').textContent = d.overview.total_year;
            document.getElementById('stat_total_month').textContent = d.overview.total_month;

            document.getElementById('stat_imp_done').textContent = d.overview.imp_done.toLocaleString();
            document.getElementById('stat_imp_done_year').textContent = d.overview.imp_done_year;
            document.getElementById('stat_imp_done_month').textContent = d.overview.imp_done_month;

            document.getElementById('stat_pending_imp').textContent = d.overview.pending_imp.toLocaleString();
            document.getElementById('stat_pending_year').textContent = d.overview.pending_imp_year;
            document.getElementById('stat_pending_month').textContent = d.overview.pending_imp_month;

            document.getElementById('stat_key_total').textContent = d.overview.key_accounts.toLocaleString();
            document.getElementById('stat_key_done').textContent = d.overview.key_imp_done.toLocaleString();
            document.getElementById('stat_key_pending').textContent = d.overview.key_pending.toLocaleString();

            // Trial Cards
            document.getElementById('stat_trial_total').textContent = d.trial.total.toLocaleString();
            document.getElementById('stat_trial_year').textContent = d.trial.total_year;
            document.getElementById('stat_trial_month').textContent = d.trial.total_month;

            document.getElementById('stat_trial_done').textContent = d.trial.imp_done.toLocaleString();
            document.getElementById('stat_trial_pending').textContent = d.trial.imp_pending.toLocaleString();
            document.getElementById('stat_trial_key').textContent = d.trial.key_accounts.toLocaleString();
            document.getElementById('stat_trial_key_done').textContent = d.trial.key_done.toLocaleString();
            document.getElementById('stat_trial_expired').textContent = d.trial.expired.toLocaleString();
        }
    } catch (err) {
        console.error('Stats fetch error:', err);
    }
}

async function fetchDashboardData() {
    const accType = document.getElementById('filterAccountType').value;
    const planFilter = document.getElementById('filterPlan').value;
    const search = document.getElementById('dashSearch').value;

    // Adjust plan filter based on current tab if "All" is selected
    let activePlan = planFilter;
    if (planFilter === 'All') {
        activePlan = currentTab === 'TRIAL' ? 'Trial' : '';
    }

    try {
        const res = await fetch(`/api/onboarding?page=${currentPage}&limit=${limit}&search=${search}&account_type=${accType}&plan=${activePlan}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await res.json();
        if (result.success) {
            renderDashboardTable(result.data);
            renderDashboardPagination(result.total);
        }
    } catch (err) {
        console.error('Data fetch error:', err);
    }
}

function renderDashboardTable(data) {
    const tbody = document.getElementById('dashRows');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align:center; padding:50px; color:var(--text-muted);">No records found.</td></tr>';
        return;
    }

    data.forEach((item, index) => {
        const ob = item.onboarding || {};
        const tr = document.createElement('tr');
        
        const startDate = item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
        
        let endDate = '-';
        if (item.plan === 'Trial') {
            const exp = new Date(item.created_at);
            exp.setDate(exp.getDate() + (item.trial_days || 0));
            endDate = exp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        const impStatus = ob.setup_status === 'Done' ? '<span class="badge badge-done">Done</span>' : '<span class="badge badge-pending">Pending</span>';

        tr.innerHTML = `
            <td style="color:var(--text-muted); font-size:11px;">${(currentPage - 1) * limit + index + 1}</td>
            <td class="company-id">MHR_${item.id}</td>
            <td style="font-weight:700; color:#fff;">${item.name}</td>
            <td>${item.city || '-'}</td>
            <td><span style="font-size:11px; font-weight:700; color:#94a3b8;">${item.account_type || 'Normal Account'}</span></td>
            <td><span style="font-size:11px; font-weight:700; color:${item.plan === 'Trial' ? '#f59e0b' : '#3b82f6'};">${item.plan || 'Basic'}</span></td>
            <td style="font-size:11px; color:var(--text-muted);">${startDate}</td>
            <td style="font-size:11px; color:var(--text-muted);">${endDate}</td>
            <td style="text-align:center; font-weight:700; color:#fff;">${item.trial_days || 0}</td>
            <td style="text-align:center; font-weight:700; color:var(--primary-ob);">${item.employee_registration_limit || 10}</td>
            <td style="text-align:center;">${impStatus}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderDashboardPagination(total) {
    const totalPages = Math.ceil(total / limit);
    const container = document.getElementById('dashPagination');
    container.innerHTML = '';

    const info = document.createElement('div');
    info.style.cssText = 'font-size:12px; color:var(--text-muted); font-weight:600;';
    info.textContent = `Showing ${(currentPage - 1) * limit + 1} to ${Math.min(currentPage * limit, total)} of ${total} entries`;
    container.appendChild(info);

    const btns = document.createElement('div');
    btns.style.cssText = 'display:flex; gap:5px;';

    for (let i = 1; i <= totalPages; i++) {
        if (i > 5 && i < totalPages) continue; // Basic ellipsis logic
        const btn = document.createElement('button');
        btn.className = `wr-page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => { currentPage = i; fetchDashboardData(); };
        btns.appendChild(btn);
    }
    container.appendChild(btns);
}

function switchTab(tab) {
    currentTab = tab;
    currentPage = 1;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab_${tab}`).classList.add('active');
    fetchDashboardData();
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    fetchStats();
    fetchDashboardData();
});

async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) { window.location.href = '/login'; return; }
        const user = await res.json();
        
        // Update header profile details
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const menuNameEl = document.getElementById('profileMenuName');
        const menuEmailEl = document.getElementById('profileMenuEmail');
        const avatarEl = document.getElementById('userAvatar');

        if (userNameEl) userNameEl.innerText = user.name || 'Admin';
        if (userRoleEl) userRoleEl.innerText = user.role || 'Super Admin';
        if (menuNameEl) menuNameEl.innerText = user.name || 'Admin';
        if (menuEmailEl) menuEmailEl.innerText = user.email || 'admin@minehr.com';
        if (avatarEl) avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'A')}&background=6366f1&color=fff`;
        
    } catch (err) {
        console.error('Auth check error:', err);
    }
}
