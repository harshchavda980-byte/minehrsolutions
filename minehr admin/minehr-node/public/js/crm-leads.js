/**
 * CRM Leads Management Logic
 */

let currentPage = 1;
const recordsPerPage = 10;
let currentLeadId = null;

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
        const assigneeSelect = document.getElementById('leadAssignee');
        assigneeSelect.innerHTML = '<option value="">Unassigned</option>';
        userData.users.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id;
            opt.textContent = u.name;
            assigneeSelect.appendChild(opt);
        });
    } catch (e) { console.error('Failed to load users:', e); }

    // 3. Initial Load
    loadLeads(1);
});

async function loadLeads(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusFilter').value;
    const source = document.getElementById('sourceFilter').value;

    let url = `/api/crm/leads?page=${page}&limit=${recordsPerPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;
    if (source) url += `&source=${source}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderLeadsTable(data.leads);
        renderPagination(data.pages, data.currentPage);
    } catch (err) {
        console.error('Failed to fetch leads:', err);
    }
}

function renderLeadsTable(leads) {
    const tbody = document.getElementById('leadsTableBody');
    if (!leads || !leads.length) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color: var(--text-muted);">No leads found.</td></tr>`;
        return;
    }

    tbody.innerHTML = leads.map(l => `
        <tr>
            <td style="font-weight: 600;">#${l.lead_id}</td>
            <td><strong>${l.name}</strong></td>
            <td>${l.company_name || '-'}</td>
            <td>
                ${l.email || '-'}<br>
                <small class="text-muted">${l.phone || '-'}</small>
            </td>
            <td><span class="badge badge-source">${l.lead_source}</span></td>
            <td><span class="badge status-${l.status.toLowerCase()}">${l.status}</span></td>
            <td>${l.assignee ? l.assignee.name : '<span class="text-muted">None</span>'}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-icon btn-sm" onclick="viewLead(${l.id})" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button class="btn btn-icon btn-sm" onclick="editLead(${l.id})" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openLeadModal() {
    document.getElementById('leadForm').reset();
    document.getElementById('editLeadId').value = '';
    document.getElementById('modalTitle').textContent = 'Add New Lead';
    document.getElementById('leadFormModal').classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

async function handleLeadSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('editLeadId').value;
    const payload = {
        name: document.getElementById('leadName').value,
        email: document.getElementById('leadEmail').value,
        phone: document.getElementById('leadPhone').value,
        company_name: document.getElementById('leadCompany').value,
        lead_source: document.getElementById('leadSource').value,
        assigned_to: document.getElementById('leadAssignee').value || null
    };

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `/api/crm/leads/${id}` : '/api/crm/leads';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            closeModal('leadFormModal');
            loadLeads(currentPage);
        }
    } catch (err) { console.error(err); }
}

async function viewLead(id) {
    currentLeadId = id;
    try {
        const res = await fetch(`/api/crm/leads/${id}`);
        const l = await res.json();

        document.getElementById('detailLeadId').textContent = `Lead Detail #${l.lead_id}`;
        document.getElementById('leadBasics').innerHTML = `
            <div class="preview-item"><span>Name</span><p>${l.name}</p></div>
            <div class="preview-item"><span>Company</span><p>${l.company_name || '-'}</p></div>
            <div class="preview-item"><span>Email</span><p>${l.email || '-'}</p></div>
            <div class="preview-item"><span>Phone</span><p>${l.phone || '-'}</p></div>
            <div class="preview-item"><span>Source</span><p>${l.lead_source}</p></div>
            <div class="preview-item"><span>Assigned To</span><p>${l.assignee ? l.assignee.name : 'Unassigned'}</p></div>
        `;

        document.getElementById('detailStatus').value = l.status;
        renderTimeline(l.interactions);

        if (l.status === 'Converted') {
            document.getElementById('conversionSection').style.display = 'block';
            document.getElementById('conversionNotesDisplay').textContent = l.conversion_notes || 'Conversion successful.';
        } else {
            document.getElementById('conversionSection').style.display = 'none';
        }

        document.getElementById('leadDetailModal').classList.add('active');
    } catch (err) { console.error(err); }
}

function renderTimeline(interactions) {
    const container = document.getElementById('interactionTimeline');
    if (!interactions || !interactions.length) {
        container.innerHTML = '<p class="text-muted">No activities logged yet.</p>';
        return;
    }

    container.innerHTML = interactions.map(i => `
        <div class="timeline-item">
            <div class="timeline-icon"></div>
            <div class="interaction-card">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <strong>${i.type}</strong>
                    <small class="text-muted">${new Date(i.created_at).toLocaleString()}</small>
                </div>
                <p style="font-size: 13px;">${i.content}</p>
                <div style="margin-top: 8px; font-size: 11px; color: var(--text-muted);">
                    Logged by: ${i.creator ? i.creator.name : 'System'}
                </div>
            </div>
        </div>
    `).join('');
}

async function saveInteraction() {
    const content = document.getElementById('noteContent').value;
    const type = document.getElementById('noteType').value;
    if (!content) return;

    try {
        const res = await fetch(`/api/crm/leads/${currentLeadId}/interactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, content })
        });
        if (res.ok) {
            document.getElementById('noteContent').value = '';
            viewLead(currentLeadId);
        }
    } catch (err) { console.error(err); }
}

async function updateLeadStatus() {
    const status = document.getElementById('detailStatus').value;
    let conversion_notes = "";
    if (status === 'Converted') {
        conversion_notes = prompt("Enter conversion details (e.g. Account Package, Contract ID):");
        if (conversion_notes === null) return;
    }

    try {
        const res = await fetch(`/api/crm/leads/${currentLeadId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, conversion_notes })
        });
        if (res.ok) {
            alert('Lead status updated!');
            loadLeads(currentPage);
            viewLead(currentLeadId);
        }
    } catch (err) { console.error(err); }
}

async function editLead(id) {
    try {
        const res = await fetch(`/api/crm/leads/${id}`);
        const l = await res.json();

        document.getElementById('editLeadId').value = l.id;
        document.getElementById('leadName').value = l.name;
        document.getElementById('leadEmail').value = l.email || '';
        document.getElementById('leadPhone').value = l.phone || '';
        document.getElementById('leadCompany').value = l.company_name || '';
        document.getElementById('leadSource').value = l.lead_source;
        document.getElementById('leadAssignee').value = l.assigned_to || '';

        document.getElementById('modalTitle').textContent = 'Edit Lead';
        document.getElementById('leadFormModal').classList.add('active');
    } catch (err) { console.error(err); }
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('sourceFilter').value = '';
    loadLeads(1);
}

function renderPagination(total, current) {
    const controls = document.getElementById('paginationControls');
    let html = `<button class="btn btn-outline btn-sm" onclick="loadLeads(${current - 1})" ${current <= 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= total; i++) {
        html += `<button class="btn btn-sm ${current === i ? 'btn-primary' : 'btn-outline'}" onclick="loadLeads(${i})">${i}</button>`;
    }
    html += `<button class="btn btn-outline btn-sm" onclick="loadLeads(${current + 1})" ${current >= total ? 'disabled' : ''}>Next</button>`;
    controls.innerHTML = html;
}
