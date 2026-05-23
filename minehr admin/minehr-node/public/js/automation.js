/**
 * Intimation Automation Logic
 */

let currentPage = 1;
const recordsPerPage = 10;
let editingIntmId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth & User Load
    const authRes = await fetch('/api/auth/me');
    if (!authRes.ok) { window.location.href = '/login'; return; }
    const user = await authRes.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userRole').innerText = user.role;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

    // 2. Initial Load
    loadIntimations(1);
});

async function loadIntimations(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const type = document.getElementById('typeFilter').value;
    const status = document.getElementById('statusFilter').value;

    let url = `/api/automation/intimations?page=${page}&limit=${recordsPerPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (type) url += `&type=${type}`;
    if (status) url += `&status=${status}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
            renderIntimationTable(data.intimations);
            renderPagination(data.pages, data.currentPage);
        }
    } catch (err) { console.error(err); }
}

function renderIntimationTable(intimations) {
    const tbody = document.getElementById('intimationTableBody');
    if (!intimations || !intimations.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--text-muted);">No intimations found.</td></tr>`;
        return;
    }

    tbody.innerHTML = intimations.map(i => `
        <tr>
            <td><code style="font-weight: 600;">${i.intimation_id}</code></td>
            <td><span class="badge type-${i.type.toLowerCase()}">${i.type}</span></td>
            <td><div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${i.recipients}</div></td>
            <td><code>${i.schedule_cron}</code></td>
            <td><span class="badge status-${i.status.toLowerCase()}">${i.status}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-icon btn-sm" onclick="testIntimation(${i.id})" title="Test Trigger">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </button>
                    <button class="btn btn-icon btn-sm" onclick="editIntimation(${JSON.stringify(i).replace(/"/g, '&quot;')})" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn btn-icon btn-sm danger" onclick="deleteIntimation(${i.id})" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function openIntimationModal() {
    editingIntmId = null;
    document.getElementById('intimationForm').reset();
    document.getElementById('modalTitle').textContent = 'Setup Automation';
    document.getElementById('intimationModal').classList.add('active');
    await loadCompanyChecklist();
}

async function loadCompanyChecklist(selectedIds = []) {
    const list = document.getElementById('companyChecklist');
    try {
        const res = await fetch('/api/companies?status=verified');
        const companies = await res.json();
        
        // Ensure selectedIds is an array of strings for easy comparison
        const normalizedSelected = Array.isArray(selectedIds) ? selectedIds.map(String) : [];

        if (!companies || companies.length === 0) {
            list.innerHTML = '<div style="color: var(--text-muted); font-size: 13px; grid-column: span 2;">No companies found.</div>';
            return;
        }

        list.innerHTML = companies.map(c => `
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer; padding: 6px 10px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid transparent; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--primary-glow)'" onmouseout="this.style.borderColor='transparent'">
                <input type="checkbox" name="company_id" value="${c.id}" ${normalizedSelected.includes(String(c.id)) ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--primary);">
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.name}</span>
            </label>
        `).join('');

        // Update Select All checkbox state
        const allCheckboxes = document.querySelectorAll('input[name="company_id"]');
        const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
        document.getElementById('selectAllCompanies').checked = allChecked && allCheckboxes.length > 0;

    } catch (err) {
        console.error('Error loading company checklist:', err);
        list.innerHTML = '<div style="color: #ef4444; font-size: 13px; grid-column: span 2;">Error loading companies. Please try again.</div>';
    }
}

function toggleAllCompanies(checked) {
    document.querySelectorAll('input[name="company_id"]').forEach(i => i.checked = checked);
}

async function editIntimation(i) {
    editingIntmId = i.id;
    document.getElementById('modalTitle').textContent = 'Update Automation';
    document.getElementById('intmType').value = i.type;
    document.getElementById('intmCron').value = i.schedule_cron;
    document.getElementById('intmRecipients').value = i.recipients;
    document.getElementById('intmTemplate').value = i.message_template;
    document.getElementById('intmStatus').value = i.status;
    document.getElementById('intimationModal').classList.add('active');
    
    // Pass existing company_ids to pre-check them
    await loadCompanyChecklist(i.company_ids || []);
}

async function handleIntimationSubmit(e) {
    e.preventDefault();
    const companyIds = Array.from(document.querySelectorAll('input[name="company_id"]:checked')).map(i => i.value);
    const payload = {
        type: document.getElementById('intmType').value,
        schedule_cron: document.getElementById('intmCron').value,
        recipients: document.getElementById('intmRecipients').value,
        message_template: document.getElementById('intmTemplate').value,
        status: document.getElementById('intmStatus').value,
        company_ids: companyIds
    };

    const url = editingIntmId ? `/api/automation/intimations/${editingIntmId}` : '/api/automation/intimations';
    const method = editingIntmId ? 'PATCH' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) { closeModal('intimationModal'); loadIntimations(currentPage); }
    } catch (err) { console.error(err); }
}

async function testIntimation(id) {
    if (!confirm('Do you want to trigger a test for this automation?')) return;
    try {
        const res = await fetch(`/api/automation/intimations/${id}/test`, { method: 'POST' });
        const data = await res.json();
        alert(data.message);
    } catch (err) { console.error(err); }
}

async function deleteIntimation(id) {
    if (!confirm('Are you certain you want to delete this automation setup?')) return;
    try {
        const res = await fetch(`/api/automation/intimations/${id}`, { method: 'DELETE' });
        if (res.ok) loadIntimations(currentPage);
    } catch (err) { console.error(err); }
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function resetFilters() { document.getElementById('searchInput').value = ''; document.getElementById('typeFilter').value = ''; document.getElementById('statusFilter').value = ''; loadIntimations(1); }

function renderPagination(total, current) {
    const controls = document.getElementById('paginationControls');
    if (!total || total <= 1) { controls.innerHTML = ''; return; }
    let html = `<button class="btn btn-outline btn-sm" onclick="loadIntimations(${current - 1})" ${current <= 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= total; i++) {
        html += `<button class="btn btn-sm ${current === i ? 'btn-primary' : 'btn-outline'}" onclick="loadIntimations(${i})">${i}</button>`;
    }
    html += `<button class="btn btn-outline btn-sm" onclick="loadIntimations(${current + 1})" ${current >= total ? 'disabled' : ''}>Next</button>`;
    controls.innerHTML = html;
}
