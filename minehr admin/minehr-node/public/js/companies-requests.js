/**
 * Logic for Company Requests & Created Companies Submodules
 */

let allCompanies = [];
let currentPage = 1;
const recordsPerPage = 10;

document.addEventListener("DOMContentLoaded", async () => {
    const authRes = await fetch("/api/auth/me");
    if (!authRes.ok) {
        window.location.href = "/login";
        return;
    }
    const user = await authRes.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

    await loadPageData(1);
});

async function loadPageData(page = 1) {
    currentPage = page;
    const filename = window.location.pathname.split("/").pop();
    let statusFilter = '';

    if (filename === 'companies-requests-new.html') statusFilter = 'pending';
    else if (filename === 'companies-pending.html') statusFilter = 'pending';
    else if (filename === 'companies-requests-created.html') statusFilter = '';
    else if (filename === 'companies-requests-rejected.html') statusFilter = 'rejected';
    else if (filename === 'companies-my.html') statusFilter = 'verified';

    try {
        let url = `/api/companies?page=${currentPage}&limit=${recordsPerPage}`;
        if (statusFilter) url += `&status=${statusFilter}`;
        if (filename === 'companies-requests-created.html') url += `&status_group=created`;

        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            if (data && data.companies) {
                allCompanies = data.companies;
                renderTable(allCompanies);
                renderPagination(data.pages, data.currentPage);
            } else if (Array.isArray(data)) {
                allCompanies = data;
                renderTable(allCompanies);
            } else {
                renderTable([]);
            }
        } else {
            console.error('API error', res.status);
            renderTable([]);
        }
    } catch (err) {
        console.error("Failed to load companies:", err);
        renderTable([]);
    }
}


function renderTable(companies) {
    const tableBody = document.getElementById('companiesTableBody');
    if (!tableBody) return;

    if (!companies.length) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 60px; color: var(--text-muted); font-size: 15px;">No registration requests found.</td></tr>`;
        return;
    }

    const filename = window.location.pathname.split("/").pop();
    const isMainListView = filename === 'companies-requests-created.html' || filename === 'companies-my.html';

    tableBody.innerHTML = companies.map(c => {
        const admin = (c.users && c.users.length > 0) ? c.users[0] : null;
        const plan = c.plan_details;
        const remaining = (plan?.employee_limit || 0) - (c.employee_count || 0);
        const companyCode = c.company_code && c.company_code !== 'null' ? c.company_code : '-';
        const contactMobile = c.contact_mobile && c.contact_mobile !== 'null' ? c.contact_mobile : '-';

        return `
        <tr>
            <td style="font-weight: 700; color: var(--text-muted); font-family: 'Outfit', sans-serif;">#${String(c.id).padStart(4, '0')}</td>
            <td>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${c.name}</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Code: ${companyCode}</div>
            </td>
            <td>
                ${admin ? `
                    <div style="font-weight: 600; color: var(--text-primary);">${admin.name}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${admin.email}</div>
                ` : '<span style="color: var(--text-muted); font-style: italic;">No Admin Assigned</span>'}
            </td>
            <td>
                <div style="font-weight: 500;">${contactMobile}</div>
            </td>
            <td>
                <div style="font-weight: 700; color: var(--text-primary);">${c.employee_count || 0} / ${plan?.employee_limit || 0}</div>
                <div style="font-size: 11px; color: ${remaining <= 0 ? '#ef4444' : '#10b981'}; font-weight: 600;">${remaining} Slot${remaining === 1 ? '' : 's'} Available</div>
            </td>
            <td>
                <span class="badge ${getPlanBadge(c.plan)}">${(c.plan || 'BASIC').toUpperCase()}</span>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 5px; font-weight: 500;">Expires: ${plan?.expiry_date || 'N/A'}</div>
            </td>
            <td>
                <span class="badge ${getStatusBadge(c.status)}">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                    ${c.status === 'verified' ? 'ACTIVE' : c.status.toUpperCase()}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button class="btn btn-outline btn-sm" onclick="viewDetails(${c.id})" title="View Details">View</button>
                    ${isMainListView ? `
                        <button class="btn btn-outline btn-sm" onclick="editCompany(${c.id})" title="Edit">Edit</button>
                        <button class="btn btn-outline btn-sm ${c.status === 'inactive' ? 'success' : 'warning'}" 
                                onclick="suspendCompany(${c.id})" title="${c.status === 'inactive' ? 'Reactivate' : 'Suspend'}">
                            ${c.status === 'inactive' ? 'Reactivate' : 'Suspend'}
                        </button>
                    ` : ''}
                    ${c.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm" onclick="approveCompany(${c.id})">Approve</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `;
    }).join('');
}


function renderPagination(totalPages, activePage) {
    const controls = document.getElementById('paginationControls');
    if (!controls) return;

    if (totalPages <= 1) {
        controls.innerHTML = '';
        return;
    }

    let html = `<button onclick="loadPageData(${activePage - 1})" ${activePage === 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${activePage === i ? 'active' : ''}" onclick="loadPageData(${i})">${i}</button>`;
    }
    html += `<button onclick="loadPageData(${activePage + 1})" ${activePage === totalPages ? 'disabled' : ''}>Next</button>`;
    controls.innerHTML = html;
}

function getStatusBadge(status) {
    if (status === 'verified') return 'badge-success';
    if (status === 'rejected') return 'badge-danger';
    if (status === 'inactive') return 'badge-warning';
    return 'badge-info';
}

function getPlanBadge(plan) {
    if (plan === 'enterprise') return 'badge-success';
    if (plan === 'pro') return 'badge-warning';
    return 'badge-info';
}

function filterTable() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const planFilter = document.getElementById('planFilter')?.value || "";
    const statusFilter = document.getElementById('statusFilterSelect')?.value || "";

    const filtered = allCompanies.filter(c => {
        const admin = c.users?.[0];
        const matchesSearch = c.name.toLowerCase().includes(searchTerm) ||
            c.email?.toLowerCase().includes(searchTerm) ||
            (admin && (admin.name.toLowerCase().includes(searchTerm) || admin.email.toLowerCase().includes(searchTerm)));
        const matchesPlan = !planFilter || c.plan === planFilter;
        const matchesStatus = !statusFilter || c.status === statusFilter;
        return matchesSearch && matchesPlan && matchesStatus;
    });

    renderTable(filtered);
}

async function suspendCompany(id) {
    if (!confirm(`Are you sure you want to change this company's operating status?`)) return;

    try {
        const res = await fetch(`/api/companies/${id}/suspend`, { method: 'PATCH' });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            loadPageData(currentPage);
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        console.error(err);
    }
}

async function approveCompany(id) {
    if (!confirm(`Are you sure you want to APPROVE this company?`)) return;
    try {
        const res = await fetch(`/api/companies/${id}/approve`, { method: 'POST' });
        const data = await res.json();
        if (data.success) { alert('Company approved!'); loadPageData(currentPage); }
    } catch (err) { console.error(err); }
}

async function rejectCompany(id) {
    const reason = prompt("Enter rejection reason:");
    if (reason === null) return;
    try {
        const res = await fetch(`/api/companies/${id}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason })
        });
        if (res.ok) loadPageData(currentPage);
    } catch (err) { console.error(err); }
}

function viewDetails(id) { window.location.href = `companies.html?id=${id}`; }
function editCompany(id) { window.location.href = `companies.html?id=${id}&edit=true`; }
