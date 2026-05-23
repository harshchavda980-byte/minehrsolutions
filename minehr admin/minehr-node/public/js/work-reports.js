let currentReports = [];
let allCompanies = [];
let selectedCompanyIds = [];

async function fetchReports() {
    const tableBody = document.getElementById('reportTableBody');
    const loader = document.getElementById('tableLoader');
    
    const date = document.getElementById('filterDate').value;
    const type = document.getElementById('filterType').value;
    const search = document.getElementById('reportSearch').value;

    const queryParams = new URLSearchParams({ date, type, search });

    try {
        loader.style.display = 'block';
        tableBody.innerHTML = '';

        const res = await fetch(`/api/work-reports?${queryParams}`);
        const result = await res.json();
        
        if (result.success) {
            currentReports = result.data;
            renderTable(currentReports);
        }
    } catch (err) {
        console.error(err);
    } finally {
        loader.style.display = 'none';
    }
}

async function fetchCompanies() {
    try {
        const res = await fetch('/api/crm/companies'); 
        const result = await res.json();
        if (result.success) {
            allCompanies = result.data;
            renderCompanyList();
        }
    } catch (err) {
        console.error('Error fetching companies', err);
    }
}

function renderCompanyList() {
    const list = document.getElementById('companySelectList');
    list.innerHTML = allCompanies.map(c => `
        <div class="company-option ${selectedCompanyIds.includes(c.id) ? 'selected' : ''}" 
             onclick="toggleCompany(${c.id})" id="comp-opt-${c.id}">
            ${c.company_name}
        </div>
    `).join('');
    updateSelectedCount();
}

function toggleCompany(id) {
    const idx = selectedCompanyIds.indexOf(id);
    if (idx === -1) {
        selectedCompanyIds.push(id);
    } else {
        selectedCompanyIds.splice(idx, 1);
    }
    renderCompanyList();
}

function updateSelectedCount() {
    document.getElementById('selectedCount').innerText = `${selectedCompanyIds.length} Companies Selected`;
}

function renderTable(reports) {
    const tableBody = document.getElementById('reportTableBody');
    tableBody.innerHTML = reports.map((r, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>
                <div style="display:flex; gap:6px;">
                    <button class="btn-ob btn-ob-outline" style="padding:5px;" onclick="editReport(${r.id})">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                    </button>
                    <button class="btn-ob btn-ob-outline" style="padding:5px; color:#ef4444; border-color:rgba(239, 68, 68, 0.2);" onclick="deleteReport(${r.id})">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
            <td style="font-weight:700;">${r.Trainer?.name || 'Unknown'}</td>
            <td>${r.report_date}</td>
            <td><span class="status-badge" style="background:rgba(99,102,241,0.1); color:var(--primary-ob);">${r.report_type}</span></td>
            <td>${r.no_of_calls}</td>
            <td>${r.no_of_lined_up}</td>
            <td>
                ${(r.company_ids || []).length} Companies
            </td>
            <td style="font-size:10px; color:var(--text-muted);">${new Date(r.created_at).toLocaleDateString()}</td>
            <td style="font-size:11px; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${r.report_description || ''}">${r.report_description || '--'}</td>
        </tr>
    `).join('');
}

function openAddModal() {
    document.getElementById('reportId').value = '';
    document.getElementById('reportForm').reset();
    document.getElementById('reportDate').valueAsDate = new Date();
    selectedCompanyIds = [];
    renderCompanyList();
    document.getElementById('modalTitle').innerText = 'Add Report';
    document.getElementById('saveReportBtn').innerText = 'ADD REPORT';
    document.getElementById('reportModal').classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

async function saveReport() {
    const id = document.getElementById('reportId').value;
    const btn = document.getElementById('saveReportBtn');
    
    if (selectedCompanyIds.length === 0) {
        alert('Please select at least one company.');
        return;
    }

    const payload = {
        report_date: document.getElementById('reportDate').value,
        report_type: document.getElementById('reportType').value,
        no_of_calls: parseInt(document.getElementById('noOfCalls').value),
        no_of_lined_up: parseInt(document.getElementById('noOfLinedUp').value),
        company_ids: selectedCompanyIds,
        report_description: document.getElementById('reportDescription').value
    };

    btn.disabled = true;
    btn.innerText = 'SAVING...';

    try {
        const url = id ? `/api/work-reports/${id}` : '/api/work-reports';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
            closeModal('reportModal');
            fetchReports();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (err) {
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.innerText = id ? 'UPDATE REPORT' : 'ADD REPORT';
    }
}

async function editReport(id) {
    const r = currentReports.find(item => item.id === id);
    if (!r) return;

    document.getElementById('reportId').value = r.id;
    document.getElementById('reportDate').value = r.report_date;
    document.getElementById('reportType').value = r.report_type;
    document.getElementById('noOfCalls').value = r.no_of_calls;
    document.getElementById('noOfLinedUp').value = r.no_of_lined_up;
    document.getElementById('reportDescription').value = r.report_description || '';
    
    selectedCompanyIds = r.company_ids || [];
    renderCompanyList();

    document.getElementById('modalTitle').innerText = 'Edit Report';
    document.getElementById('saveReportBtn').innerText = 'UPDATE REPORT';
    document.getElementById('reportModal').classList.add('open');
}

async function deleteReport(id) {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
        const res = await fetch(`/api/work-reports/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) fetchReports();
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('reportSearch')?.addEventListener('input', fetchReports);

document.addEventListener('DOMContentLoaded', () => {
    fetchReports();
    fetchCompanies();
});
