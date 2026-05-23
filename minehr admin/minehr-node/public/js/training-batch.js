/**
 * Manage Training Batch Logic
 */

let allBatches = [];

async function fetchBatches() {
    try {
        const res = await fetch('/api/onboarding/batches'); 
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.success) {
            allBatches = data.data;
            renderBatchTable();
        }
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

function renderBatchTable() {
    const tbody = document.getElementById('batchTableBody');
    if (!tbody) return;

    if (allBatches.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:40px; color:var(--text-muted);">No training batches found. Click "Add New" to create one.</td></tr>`;
        return;
    }

    tbody.innerHTML = allBatches.map((batch, index) => `
        <tr>
            <td style="font-weight:700; color:var(--text-muted);">${index + 1}</td>
            <td>
                <div style="font-weight:700; color:var(--text-primary);">${batch.name}</div>
            </td>
            <td><span class="badge" style="background:rgba(99,102,241,0.1); color:var(--primary-ob); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;">${batch.training_days} Days</span></td>
            <td style="font-weight:600; color:var(--text-secondary);">${batch.type}</td>
            <td><span style="font-weight:700; color:#fff; background:rgba(255,255,255,0.05); padding:4px 10px; border-radius:6px; font-size:11px;">${batch.participant_type}</span></td>
            <td style="font-size:12px; color:var(--text-muted);">${new Date(batch.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
            <td><span class="status-badge ${batch.status === 'Active' ? 'success' : 'danger'}">${batch.status}</span></td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="btn-ob btn-ob-icon" onclick="editBatch(${batch.id})" title="Edit Batch">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-ob btn-ob-icon" style="color:#ef4444;" onclick="deleteBatch(${batch.id})" title="Delete Batch">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

const defaultTopics = [
    { title: "VISIT 1", modules: "Dashboard, Company Settings, Employee & Management, Attendance, Shift Management, Face app, Whatsapp Analytical, item Report" },
    { title: "VISIT 2", modules: "Leave, Holiday, Company Recruitment, Employee Engagement, Background Verification, Documents, WFH Management, Daily Work Report, Template, Task Management, Assets & inventory" },
    { title: "VISIT 3", modules: "Finance Dashboard, Payroll, Advance Salary, Employee Loan, Assets, Assets, Tax Projection, Performance, Bonus, Incentives & Reports, Consolidated Salary, Order..." },
    { title: "VISIT 4", modules: "Employee Tracking, Visit Management, Shake product, Payments, Task Sheet, List & Report, B2B alert, Contact, Waste/Scrap/Mtrl Handover, Segment/Vendor..." },
    { title: "VISIT 5", modules: "Vendors, Quotation, Documents, Effective Communication, Site Management, Work Allocation, Delivery Reports, Targets & Achievements, CRM, Contact Support Team, Employee nominee, Loss Doc Transactions, Balance Sheet, JvS, CRM, Entry Pic/wd for them, Testimonial Video, References Gathered?" },
    { title: "VISIT 6", modules: "Employee Job Training" }
];

function openAddModal() {
    document.getElementById('modalTitle').innerText = 'Add New Training Batch';
    document.getElementById('batchId').value = '';
    document.getElementById('batchForm').reset();
    renderTopics(defaultTopics);
    document.getElementById('batchModal').classList.add('open');
}

function renderTopics(topics, selectedConfig = {}) {
    const container = document.getElementById('topicGrid');
    if (!container) return;

    container.innerHTML = topics.map((topic, index) => `
        <div class="topic-card">
            <div class="topic-header">
                <span class="topic-title">Topic: ${topic.title}</span>
                <select class="topic-day-select" data-topic="${topic.title}">
                    <option value="">Assign to day</option>
                    ${Array.from({ length: 10 }, (_, i) => `<option value="Day ${i + 1}" ${selectedConfig[topic.title] === `Day ${i + 1}` ? 'selected' : ''}>Day ${i + 1}</option>`).join('')}
                </select>
            </div>
            <div class="topic-modules">${topic.modules}</div>
        </div>
    `).join('');
}

async function saveBatch() {
    const btn = document.getElementById('saveBatchBtn');
    const id = document.getElementById('batchId').value;
    const name = document.getElementById('batchName').value.trim();
    const type = document.getElementById('batchType').value;
    const pType = document.getElementById('participantType').value;
    const days = parseInt(document.getElementById('trainingDays').value);

    if (!name) { alert('Please enter a Batch Name.'); return; }
    if (isNaN(days) || days < 1) { alert('Please enter valid Training Days.'); return; }

    const topicConfig = {};
    document.querySelectorAll('.topic-day-select').forEach(sel => {
        if (sel.value) topicConfig[sel.getAttribute('data-topic')] = sel.value;
    });

    const body = {
        name,
        type,
        participant_type: pType,
        training_days: days,
        topic_config: topicConfig
    };

    btn.disabled = true;
    const originalText = btn.innerText;
    btn.innerHTML = '<span class="spinner"></span> SAVING...';

    try {
        const url = id ? `/api/onboarding/batches/${id}` : '/api/onboarding/batches';
        const res = await fetch(url, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await res.json();
        if (data.success) {
            alert('Batch saved successfully!');
            closeModal('batchModal');
            fetchBatches();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        console.error('Save error:', err);
        alert('Failed to save batch. Please check connection.');
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

async function editBatch(id) {
    const batch = allBatches.find(b => b.id == id);
    if (!batch) return;

    document.getElementById('modalTitle').innerText = 'Edit Training Batch';
    document.getElementById('batchId').value = batch.id;
    document.getElementById('batchName').value = batch.name;
    document.getElementById('batchType').value = batch.type;
    document.getElementById('participantType').value = batch.participant_type;
    document.getElementById('trainingDays').value = batch.training_days;
    
    renderTopics(defaultTopics, batch.topic_config || {});
    document.getElementById('batchModal').classList.add('open');
}

async function deleteBatch(id) {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    try {
        const res = await fetch(`/api/onboarding/batches/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) fetchBatches();
    } catch (err) {
        console.error('Delete error:', err);
    }
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

// Search functionality
document.getElementById('batchSearch')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#batchTableBody tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
});

document.addEventListener('DOMContentLoaded', fetchBatches);
