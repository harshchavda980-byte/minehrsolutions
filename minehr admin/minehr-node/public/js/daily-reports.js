let currentType = 'Setup';
let selectedDate = new Date().toISOString().split('T')[0];

async function fetchReports() {
    const tableBody = document.getElementById('dailyReportTableBody');
    const loader = document.getElementById('tableLoader');
    
    selectedDate = document.getElementById('reportDateFilter').value;

    try {
        loader.style.display = 'block';
        tableBody.innerHTML = '';

        const res = await fetch(`/api/work-reports?date=${selectedDate}&type=${currentType}`);
        const result = await res.json();
        
        if (result.success) {
            renderTable(result.data);
        }
    } catch (err) {
        console.error(err);
    } finally {
        loader.style.display = 'none';
    }
}

function renderTable(reports) {
    const tableBody = document.getElementById('dailyReportTableBody');
    if (reports.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:40px; color:var(--text-muted);">No reports found for this category and date.</td></tr>`;
        return;
    }

    tableBody.innerHTML = reports.map((r, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>
                <button class="btn-ob btn-ob-outline" style="padding:5px;" onclick="viewReport(${r.id})">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </button>
            </td>
            <td style="font-weight:700;">${r.Trainer?.name || 'Unknown'}</td>
            <td>${r.report_date}</td>
            <td><span class="status-badge" style="background:rgba(99,102,241,0.1); color:var(--primary-ob);">${r.report_type}</span></td>
            <td>${r.no_of_calls}</td>
            <td>${r.no_of_lined_up}</td>
            <td>${(r.company_ids || []).length} Companies</td>
            <td style="font-size:10px; color:var(--text-muted);">${new Date(r.created_at).toLocaleDateString()}</td>
            <td style="font-size:11px; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${r.report_description || ''}">${r.report_description || '--'}</td>
        </tr>
    `).join('');
}

function viewReport(id) {
    // Redirect to the main reports page with an edit trigger or just show an alert with details for now
    window.location.href = `onboarding-work-reports.html?editId=${id}`;
}

// Tab Switching
document.querySelectorAll('.ob-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.ob-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentType = tab.getAttribute('data-type');
        fetchReports();
    });
});

document.getElementById('reportDateFilter').addEventListener('change', fetchReports);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('reportDateFilter').value = selectedDate;
    fetchReports();
});
