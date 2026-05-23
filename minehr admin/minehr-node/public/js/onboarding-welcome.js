/**
 * Onboarding Welcome Process Logic
 */

let currentPage = 1;
const limit = 10;

async function fetchOnboarding() {
    const loader = document.getElementById('obLoader');
    if (loader) loader.style.display = 'flex';
    
    const country = document.getElementById('filterCountry').value;
    const state = document.getElementById('filterState').value;
    const city = document.getElementById('filterCity').value;
    const product = document.getElementById('filterProduct').value;
    const search = document.getElementById('obSearch').value;

    try {
        const res = await fetch(`/api/onboarding?page=${currentPage}&limit=${limit}&country=${country}&state=${state}&city=${city}&product=${product}&search=${search}`);
        const result = await res.json();
        if (result.success) {
            renderTable(result.data);
            renderPagination(result.total);
            // Update stat chips
            const responding = result.data.filter(c => c.onboarding?.responding_status === 'Responding').length;
            const escalated  = result.data.filter(c => c.onboarding?.responding_status === 'Escalated').length;
            const statTotal = document.getElementById('statTotal');
            const statResponding = document.getElementById('statResponding');
            const statEscalated  = document.getElementById('statEscalated');
            if (statTotal) statTotal.textContent = result.total;
            if (statResponding) statResponding.textContent = responding;
            if (statEscalated)  statEscalated.textContent  = escalated;
        }
    } catch (err) {
        console.error('Fetch error:', err);
    } finally {
        if (loader) loader.style.display = 'none';
    }
}

function renderTable(data) {
    const tbody = document.getElementById('obBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="20" style="text-align:center; padding:50px; color:var(--text-muted);">No companies found in queue.</td></tr>';
        return;
    }

    data.forEach((item, index) => {
        const ob = item.onboarding || {};
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${(currentPage - 1) * limit + index + 1}</td>
            <td>MHR_${item.id}</td>
            <td>
                <div style="display:flex; align-items:center; gap:6px;">
                    <a href="companies.html?id=${item.id}" style="color:var(--primary-ob); font-weight:700; text-decoration:none; max-width:150px; overflow:hidden; text-overflow:ellipsis;" title="${item.name}">${item.name}</a>
                    <span class="timeline-tag" onclick="openTimeline(${item.id})">TM</span>
                </div>
            </td>
            <td>${item.city ? item.city.substring(0,10) : '-'}</td>
            <td>
                <div style="display:flex; align-items:center; gap:5px;">
                    <span style="max-width:80px; overflow:hidden; text-overflow:ellipsis;">${item.implementation_executive_name || '-'}</span>
                    <svg onclick="editExecutive(${item.id})" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="cursor:pointer; opacity:0.6;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </div>
            </td>
            <td>${formatDate(item.sales_closure_date)}</td>
            <td>${formatDate(item.created_at)}</td>
            <td style="text-align:center;">
                ${ob.welcome_email_sent_at ? renderStamp(ob.welcome_email_sent_at) : `
                <button class="btn-ob btn-ob-primary" onclick="openEmailModal(${item.id}, '${item.email}')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    EMAIL
                </button>`}
            </td>
            <td style="text-align:center;">
                ${ob.whatsapp_created_at ? renderStamp(ob.whatsapp_created_at) : `
                <button class="btn-ob btn-ob-icon" onclick="markWhatsApp(${item.id})" title="Mark WhatsApp Group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
                </button>`}
            </td>
            <td>
                <div class="badge-ob badge-${(ob.responding_status || 'Pending').toLowerCase().replace(' ', '-')}" style="cursor:pointer;" onclick="openStatusModal(${item.id}, '${ob.responding_status || 'Pending'}')">
                    ${ob.responding_status || 'Pending'}
                </div>
            </td>
            <td style="text-align:center;">
                <button class="btn-ob btn-ob-icon" onclick="copyFeedbackUrl(${item.id})" title="Copy Feedback URL">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </button>
            </td>
            <td style="text-align:center;">
                <div style="display:flex; align-items:center; justify-content:center; gap:5px;">
                    <button class="btn-ob btn-ob-primary" onclick="openSetupStatusModal(${item.id}, '${(item.name||'').replace(/'/g,"\\'")}', '${item.implementation_executive_name || ''}')" style="font-size:9px; padding:5px 8px; white-space:nowrap;">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                        Update
                    </button>
                    <button class="btn-ob btn-ob-icon" onclick="openSetupStatusView(${item.id}, '${(item.name||'').replace(/'/g,"\\'")}')" title="View Setup Status">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>
            </td>
            <td style="text-align:center;">
                <button class="btn-ob btn-ob-primary" data-id="${item.id}" data-name="${(item.name||'').replace(/"/g,'&quot;')}" onclick="openScheduleModal(this.dataset.id, this.dataset.name)" style="font-size:9px; padding:5px 10px; white-space:nowrap; background:linear-gradient(135deg,#0ea5e9,#0284c7);">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Schedule Setup
                </button>
            </td>
            <td style="text-align:center;">
                <button class="btn-ob btn-ob-primary" data-id="${item.id}" data-name="${(item.name||'').replace(/"/g,'&quot;')}" onclick="openTrainingModal(this.dataset.id, this.dataset.name)" style="font-size:9px; padding:5px 10px; white-space:nowrap; background:linear-gradient(135deg,#8b5cf6,#6d28d9);">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Product Training
                </button>
            </td>
            <td style="text-align:center;">${renderTrainingStatus(ob.hr_training_status)}</td>
            <td style="text-align:center;">${renderTrainingStatus(ob.it_training_status)}</td>
            <td style="text-align:center;">${renderTrainingStatus(ob.payroll_training_status)}</td>
            <td style="text-align:center;">${renderTrainingStatus(ob.admin_training_status)}</td>
            <td style="text-align:center;">
                <button class="btn-ob btn-ob-primary" data-id="${item.id}" data-name="${(item.name||'').replace(/"/g,'&quot;')}" onclick="openBatchModal(this.dataset.id, this.dataset.name)" style="font-size:9px; padding:5px 8px; white-space:nowrap; background:linear-gradient(135deg,#6366f1,#4f46e5);">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Schedule Batch
                </button>
            </td>
            <td style="text-align:center;">
                <button class="btn-ob btn-ob-icon" onclick="openTimeline(${item.id})" title="Stats & Timeline">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function renderStamp(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
    const day = d.toLocaleDateString('en-GB', { weekday: 'short' });
    const time = d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true });
    return `
        <div class="stamp-box">
            <span class="stamp-date">${date}</span>
            <span class="stamp-time">${day}, ${time}</span>
        </div>`;
}

function renderTrainingStatus(val) {
    const score = val || 0;
    return `<span style="font-weight:800; color:${score >= 5 ? '#10b981' : score > 0 ? '#f59e0b' : 'var(--text-muted)'};">${score}/5</span>`;
}

// ─── SETUP STATUS MODAL ─────────────────────────────────────────────────────

const SETUP_ROWS = [
    { key: 'employee',      label: 'Employee' },
    { key: 'device_setup',  label: 'Device Setup' },
    { key: 'data_migration',label: 'Data Migration from existing HRMS' }
];

function openSetupStatusModal(id, companyName, execName) {
    document.getElementById('setupCompanyId').value = id;
    document.getElementById('setupCompanyName').textContent = companyName.trim();

    // Populate executive dropdown
    const execSel = document.getElementById('setupExecutive');
    execSel.innerHTML = '<option value="">Select Executive</option>';
    if (execName && execName.trim()) {
        const opt = document.createElement('option');
        opt.value = execName.trim();
        opt.textContent = execName.trim();
        opt.selected = true;
        execSel.appendChild(opt);
    }

    // Build rows
    const tbody = document.getElementById('setupStatusRows');
    tbody.innerHTML = '';
    SETUP_ROWS.forEach((row, i) => {
        const rowEl = document.createElement('tr');
        rowEl.style.borderBottom = '1px solid rgba(255,255,255,0.04)';
        rowEl.innerHTML = `
            <td style="padding:13px 16px; font-size:13px; color:var(--text-secondary); font-weight:600;">${row.label}</td>
            <td style="text-align:center; border-left:1px solid rgba(255,255,255,0.05);">
                <label style="cursor:pointer; display:flex; justify-content:center;">
                    <input type="radio" name="recv_${row.key}" value="Received"
                        style="width:16px; height:16px; accent-color:#6366f1; cursor:pointer;">
                </label>
            </td>
            <td style="text-align:center;">
                <label style="cursor:pointer; display:flex; justify-content:center;">
                    <input type="radio" name="recv_${row.key}" value="Pending"
                        style="width:16px; height:16px; accent-color:#f59e0b; cursor:pointer;">
                </label>
            </td>
            <td style="text-align:center;">
                <label style="cursor:pointer; display:flex; justify-content:center;">
                    <input type="radio" name="recv_${row.key}" value="N/A"
                        style="width:16px; height:16px; accent-color:#64748b; cursor:pointer;">
                </label>
            </td>
            <td style="text-align:center; border-left:1px solid rgba(255,255,255,0.05);">
                <label style="cursor:pointer; display:flex; justify-content:center;">
                    <input type="radio" name="upload_${row.key}" value="Completed"
                        style="width:16px; height:16px; accent-color:#10b981; cursor:pointer;">
                </label>
            </td>
            <td style="text-align:center;">
                <label style="cursor:pointer; display:flex; justify-content:center;">
                    <input type="radio" name="upload_${row.key}" value="In Progress"
                        style="width:16px; height:16px; accent-color:#f59e0b; cursor:pointer;">
                </label>
            </td>
            <td style="text-align:center;">
                <label style="cursor:pointer; display:flex; justify-content:center;">
                    <input type="radio" name="upload_${row.key}" value="N/A"
                        style="width:16px; height:16px; accent-color:#64748b; cursor:pointer;">
                </label>
            </td>
        `;
        tbody.appendChild(rowEl);
    });

    document.getElementById('setupStatusModal').classList.add('open');
}

async function saveSetupStatus() {
    const id = document.getElementById('setupCompanyId').value;
    const executive = document.getElementById('setupExecutive').value;

    const statusData = {};
    SETUP_ROWS.forEach(row => {
        const recv  = document.querySelector(`input[name="recv_${row.key}"]:checked`)?.value || null;
        const upload = document.querySelector(`input[name="upload_${row.key}"]:checked`)?.value || null;
        statusData[row.key] = { receive: recv, upload };
    });

    try {
        const res = await fetch(`/api/onboarding/setup-status/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ executive, statusData })
        });
        const result = await res.json();
        if (result.success) {
            closeModal('setupStatusModal');
            notifyDataChanged();
        } else {
            alert('Error: ' + (result.message || 'Could not save'));
        }
    } catch (err) {
        alert('Error saving setup status');
    }
}

// ─── SETUP STATUS VIEW ────────────────────────────────────────────────────────

async function openSetupStatusView(id, companyName) {
    document.getElementById('viewSetupCompanyName').textContent = companyName;
    document.getElementById('viewSetupCompanyId').value = id;

    const tbody = document.getElementById('viewSetupRows');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-muted);">Loading...</td></tr>';
    document.getElementById('setupViewModal').classList.add('open');

    try {
        const res = await fetch(`/api/onboarding/setup-status/${id}`);
        const result = await res.json();
        tbody.innerHTML = '';

        const LABELS = {
            employee: 'Employee (P1)',
            device_setup: 'Device Setup (P1)',
            data_migration: 'Data Migration from existing HRMS (P1)'
        };

        const data = result.data || {};
        Object.keys(LABELS).forEach(key => {
            const row = data[key] || {};
            const recvStatus = row.receive || 'Not Received';
            const uploadStatus = row.upload || 'In Progress';
            const recvColor = recvStatus === 'Received' ? '#10b981' : recvStatus === 'Pending' ? '#f59e0b' : '#ef4444';
            const uploadColor = uploadStatus === 'Completed' ? '#10b981' : uploadStatus === 'In Progress' ? '#f59e0b' : '#64748b';

            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid rgba(255,255,255,0.04)';
            tr.innerHTML = `
                <td style="padding:13px 16px; font-size:13px; color:var(--text-secondary); font-weight:600;">${LABELS[key]}</td>
                <td style="padding:13px 16px; text-align:center;"><span style="color:${recvColor}; font-weight:700; font-size:12px;">${recvStatus}</span></td>
                <td style="padding:13px 16px; text-align:center; color:var(--text-muted); font-size:12px;">${row.receive_date || '—'}</td>
                <td style="padding:13px 16px; text-align:center; color:var(--text-muted); font-size:12px;">${row.receive_by || '—'}</td>
                <td style="padding:13px 16px; text-align:center;"><span style="color:${uploadColor}; font-weight:700; font-size:12px;">${uploadStatus}</span></td>
                <td style="padding:13px 16px; text-align:center; color:var(--text-muted); font-size:12px;">${row.upload_date || '—'}</td>
                <td style="padding:13px 16px; text-align:center; color:var(--text-muted); font-size:12px;">${row.upload_by || '—'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:#ef4444;">Error loading data</td></tr>';
    }
}

function exportSetupStatusExcel() {
    const id = document.getElementById('viewSetupCompanyId').value;
    window.open(`/api/onboarding/setup-status-export/${id}?format=excel`, '_blank');
}

function exportSetupStatusPDF() {
    const id = document.getElementById('viewSetupCompanyId').value;
    window.open(`/api/onboarding/setup-status-export/${id}?format=pdf`, '_blank');
}

// ─── MODAL ACTIONS ───────────────────────────────────────────────────────────

// ── Schedule Setup Modal ──────────────────────────────────────────────────────

const SESSION_OPTIONS = [
    'Data Onboarding (Monday - 09:00 AM - 06:00 PM)',
    'Data Onboarding (Tuesday - 09:00 AM - 06:00 PM)',
    'Data Onboarding (Wednesday - 09:00 AM - 06:00 PM)',
    'Data Onboarding (Thursday - 09:00 AM - 06:00 PM)',
    'Data Onboarding (Friday - 09:00 AM - 06:00 PM)',
    'Product Training (Monday - 10:00 AM - 05:00 PM)',
    'Product Training (Wednesday - 10:00 AM - 05:00 PM)',
    'Implementation Session (Any Day - 11:00 AM - 04:00 PM)',
];

let meetingCount = 0;

function openScheduleModal(id, companyName) {
    document.getElementById('scheduleCompanyId').value = id;
    document.getElementById('scheduleCompanyLabel').textContent = companyName || '';

    // Reset date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('scheduleDate').value = today;

    // Reset meeting list
    meetingCount = 0;
    document.getElementById('meetingList').innerHTML = '';

    // Populate session options
    const sel = document.getElementById('scheduleSession');
    sel.innerHTML = SESSION_OPTIONS.map(s => `<option value="${s}">${s}</option>`).join('');

    document.getElementById('scheduleMeetingModal').classList.add('open');
}

function addMeetingRow() {
    meetingCount++;
    const list = document.getElementById('meetingList');
    const row = document.createElement('div');
    row.className = 'meeting-row';
    row.id = `meeting-row-${meetingCount}`;
    row.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; background:rgba(99,102,241,0.06); border:1px solid rgba(99,102,241,0.15); border-radius:10px; padding:10px 14px; margin-top:10px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.845v6.311a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/></svg>
            <input type="text" placeholder="Meeting Name / Link" class="ob-input" style="flex:1; font-size:12px;"
                id="meeting-name-${meetingCount}" value="">
            <button onclick="document.getElementById('meeting-row-${meetingCount}').remove(); meetingCount--;"
                style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444; border-radius:8px; padding:4px 8px; cursor:pointer; font-size:11px; font-weight:700;">✕</button>
        </div>`;
    list.appendChild(row);
}

async function saveScheduleSetup() {
    const id = document.getElementById('scheduleCompanyId').value;
    const date = document.getElementById('scheduleDate').value;
    const session = document.getElementById('scheduleSession').value;

    if (!date || !session) {
        alert('Please fill in Training Date and Session.');
        return;
    }

    // Collect meeting names
    const meetings = [];
    document.querySelectorAll('[id^="meeting-name-"]').forEach(inp => {
        if (inp.value.trim()) meetings.push(inp.value.trim());
    });

    const btn = document.getElementById('scheduleSubmitBtn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        const res = await fetch(`/api/onboarding/schedule/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                setup_date: date,
                training_type: session,
                meetings,
                setup_status: 'In Progress'
            })
        });
        const result = await res.json();
        if (result.success) {
            closeModal('scheduleMeetingModal');
            notifyDataChanged();
        } else {
            alert('Error: ' + (result.message || 'Could not save'));
        }
    } catch (err) {
        alert('Error saving schedule');
    } finally {
        btn.disabled = false;
        btn.textContent = 'SUBMIT';
    }
}

// ─── PRODUCT TRAINING MODAL ──────────────────────────────────────────────────

const TRAINING_TOPICS = [
    {
        visit: "VISIT 1",
        modules: [
            { id: 1, name: "Dashboard (P1)", participant: "HR", days: 1, due: "08 May 2026", overdue: "1 days over", subtopics: 0 },
            { id: 2, name: "Reports(Along with WhatsApp Report Push) ()", participant: "HR", days: "-", due: "", subtopics: 0 },
            { id: 3, name: "Company Settings (P1)", participant: "HR", days: 1, due: "", subtopics: 19 },
            { id: 4, name: "Employee & Management (P1)", participant: "HR", days: 1, due: "", subtopics: 14 },
            { id: 5, name: "Face App (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 6, name: "Attendance (P1)", participant: "HR", days: 1, due: "", subtopics: 21 },
            { id: 7, name: "Shift Management (P1)", participant: "HR", days: 1, due: "", subtopics: 14 },
            { id: 8, name: "WhatsApp Analytical Alert Report (P1)", participant: "HR", days: 1, due: "", subtopics: 0 }
        ]
    },
    {
        visit: "VISIT 2",
        modules: [
            { id: 9, name: "Leave (P1)", participant: "HR", days: 1, due: "", subtopics: 20 },
            { id: 10, name: "Holidays (P1)", participant: "HR", days: 1, due: "", subtopics: 7 },
            { id: 11, name: "Documents (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 12, name: "Task Management (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 13, name: "Daily Work Report (P1)", participant: "HR", days: 1, due: "", subtopics: 2 },
            { id: 14, name: "Template ()", participant: "HR", days: "-", due: "", subtopics: 0 },
            { id: 15, name: "Assets & Inventory (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 16, name: "Company Recruitment (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 17, name: "Employee Engagement (P1)", participant: "HR", days: 1, due: "", subtopics: 0 }
        ]
    },
    {
        visit: "VISIT 3",
        modules: [
            { id: 20, name: "Payroll (P1)", participant: "HR", days: 1, due: "", subtopics: 21 },
            { id: 21, name: "Employee App Training (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 22, name: "Testimonial Video (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 23, name: "Analytics & Reports (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 24, name: "Advance Salary (P1)", participant: "HR", days: 1, due: "", subtopics: 6 },
            { id: 25, name: "App Banner (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 26, name: "CRM Demo Pitched for them (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 27, name: "References Gathered? (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 28, name: "Contract Salary (P1)", participant: "HR", days: 1, due: "", subtopics: 2 },
            { id: 29, name: "Finance Dashboard (P1)", participant: "HR", days: 1, due: "", subtopics: 1 },
            { id: 30, name: "Tax Exemption (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 31, name: "Employee Loan (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 32, name: "Income (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 33, name: "Penalty (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 34, name: "Performance Matrix (P1)", participant: "HR", days: 1, due: "", subtopics: 2 },
            { id: 35, name: "Visitors (P1)", participant: "HR", days: 1, due: "", subtopics: 0 }
        ]
    },
    {
        visit: "VISIT 4",
        modules: [
            { id: 36, name: "Employee Tracking (P1)", participant: "HR", days: 1, due: "", subtopics: 4 },
            { id: 37, name: "Order product (P1)", participant: "HR", days: 1, due: "", subtopics: 12 },
            { id: 38, name: "Visit Management (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 39, name: "Expenses (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 40, name: "SOS Alert (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 41, name: "Canteen (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 42, name: "Task Sheet (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 43, name: "Mobile Device Bind (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 44, name: "Employee Vehicles (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 45, name: "Separation (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 46, name: "Lost & Found (P1)", participant: "HR", days: 1, due: "", subtopics: 0 }
        ]
    },
    {
        visit: "VISIT 5",
        modules: [
            { id: 47, name: "CRM (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 48, name: "Equipments (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 49, name: "Effective Communication (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 50, name: "Delivery Reports (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 51, name: "Vendors (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 52, name: "Quotation (P1)", participant: "HR", days: 1, due: "", subtopics: 0 },
            { id: 53, name: "Site Management (P1)", participant: "HR", days: 1, due: "", subtopics: 4 },
            { id: 54, name: "Balance Sheet (P1)", participant: "HR", days: 1, due: "", subtopics: 0 }
        ]
    }
];

async function openTrainingModal(id, companyName) {
    const modal = document.getElementById('trainingStatusModal');
    document.getElementById('trainingCompanyName').textContent = companyName;
    
    const tbody = document.getElementById('trainingStatusRows');
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">Loading Training Data...</td></tr>';
    modal.classList.add('open');

    try {
        const res = await fetch(`/api/onboarding/${id}`);
        const result = await res.json();
        const ob = result.data || {};
        
        tbody.innerHTML = '';
        TRAINING_TOPICS.forEach(topic => {
            const headerRow = document.createElement('tr');
            headerRow.style.background = 'rgba(255,255,255,0.02)';
            headerRow.innerHTML = `<td colspan="8" style="padding:14px 20px; font-weight:700; font-size:11px; color:#94a3b8; border-bottom:1px solid rgba(255,255,255,0.05); text-transform:uppercase;">Topic: ${topic.visit}</td>`;
            tbody.appendChild(headerRow);

            topic.modules.forEach(mod => {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
                
                // Map the module to the DB fields (this is a simplified mapping for now)
                let status = 'Pending';
                let date = '-';
                
                // Example mapping logic for the first few modules
                if (mod.id === 1) { status = ob.hr_training_status >= 1 ? 'Completed' : 'Pending'; date = ob.updated_at ? formatDate(ob.updated_at) : '-'; }
                // ... more mapping can be added here if needed
                
                let subtopicsBtn = mod.subtopics > 0 
                    ? `<button style="background:rgba(30,41,59,0.7); color:#94a3b8; border:1px solid rgba(148,163,184,0.15); border-radius:8px; padding:6px 14px; font-size:10px; font-weight:700; cursor:pointer;" onclick="openSubtopicsModal(${mod.id}, '${mod.name.replace(/'/g, "\\'")}')">VIEW SUBTOPICS (${mod.subtopics})</button>` 
                    : '<span style="color:var(--text-muted); font-size:11px;">None</span>';

                row.innerHTML = `
                    <td style="padding:16px 20px; font-size:12px; color:var(--text-muted);">${mod.id}</td>
                    <td style="padding:16px 20px; font-size:14px; color:#fff; font-weight:700;">${mod.name}</td>
                    <td style="padding:16px 20px; font-size:12px; color:var(--text-secondary);">${mod.participant}</td>
                    <td style="padding:16px 20px; font-size:12px; color:var(--text-secondary); text-align:center;">${mod.days}</td>
                    <td style="padding:16px 20px; font-size:13px; color:var(--text-secondary);">${mod.due}</td>
                    <td style="padding:16px 20px; font-size:13px; color:${status === 'Completed' ? '#10b981' : 'var(--text-muted)'}; text-align:center; font-weight:700;">${status}</td>
                    <td style="padding:16px 20px; font-size:13px; color:var(--text-muted); text-align:center;">${date}</td>
                    <td style="padding:16px 20px; text-align:center;">${subtopicsBtn}</td>
                `;
                tbody.appendChild(row);
            });
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:#ef4444;">Error loading record</td></tr>';
    }
}

function exportTrainingExcel() {
    alert('Exporting Excel...');
}

function exportTrainingPDF() {
    alert('Exporting PDF...');
}

// ─── BATCH MEETING MODAL ─────────────────────────────────────────────────────

function openBatchModal(id, companyName) {
    document.getElementById('batchCompanyId').value = id;
    document.getElementById('batchCompanyLabel').textContent = companyName || '';
    
    // Reset inputs
    document.getElementById('batchDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('batchMeetingType').value = 'Batch Wise';
    
    // Show first view by default
    toggleBatchView();
    
    document.getElementById('batchMeetingModal').classList.add('open');
}

function toggleBatchView() {
    const type = document.getElementById('batchMeetingType').value;
    const batchWiseView = document.getElementById('batchWiseView');
    const slotWiseView = document.getElementById('slotWiseView');
    
    if (type === 'Batch Wise') {
        batchWiseView.style.display = 'block';
        slotWiseView.style.display = 'none';
    } else {
        batchWiseView.style.display = 'none';
        slotWiseView.style.display = 'block';
        renderBatchSlots();
    }
}

function renderBatchSlots() {
    const container = document.getElementById('batchSlotContainer');
    // Mock data for slots as per new structure
    const slots = [
        { id: 1, name: 'V1 - CORE SETUP BATCH', host: 'RAJESH KUMAR', date: 'SAT, 16-MAY-2026', time: '10:00 AM - 1:00 PM' },
        { id: 2, name: 'V2 - LEAVE & ATTENDANCE', host: 'AMIT SHARMA', date: 'MON, 18-MAY-2026', time: '11:00 AM - 1:30 PM' },
        { id: 3, name: 'V3 - PAYROLL MASTERCLASS', host: 'NEHA GUPTA', date: 'TUE, 19-MAY-2026', time: '02:00 PM - 5:00 PM' },
        { id: 4, name: 'V4 - OPERATIONS FLOW', host: 'SANDEEP SINGH', date: 'WED, 20-MAY-2026', time: '10:00 AM - 12:30 PM' },
        { id: 5, name: 'V5 - CRM & REPORTS', host: 'PRIYA VERMA', date: 'THU, 21-MAY-2026', time: '03:00 PM - 5:30 PM' }
    ];

    container.innerHTML = slots.map(slot => `
        <label class="slot-card" style="display:flex; flex-direction:column; gap:6px; background:rgba(99,102,241,0.04); border:1px solid rgba(99,102,241,0.15); border-radius:12px; padding:12px; cursor:pointer; position:relative; transition:all 0.2s;">
            <input type="checkbox" style="position:absolute; top:12px; left:12px;" name="selectedSlots" value="${slot.id}">
            <div style="margin-left:24px;">
                <div style="color:#6366f1; font-weight:800; font-size:11px; margin-bottom:2px;">${slot.name}</div>
                <div style="color:var(--text-secondary); font-size:10px; font-weight:700;">HOST: ${slot.host}</div>
                <div style="color:#3b82f6; font-size:10px; font-weight:800; margin-top:4px;">${slot.date} <br> (${slot.time})</div>
            </div>
        </label>
    `).join('');
}

async function saveBatchMeeting() {
    const id = document.getElementById('batchCompanyId').value;
    const type = document.getElementById('batchMeetingType').value;
    const date = document.getElementById('batchDate').value;
    
    let payload = { company_id: id, meeting_type: type, training_date: date };
    
    if (type === 'Batch Wise') {
        payload.batch_name = document.getElementById('batchNameSelect').value;
    } else {
        const checked = Array.from(document.querySelectorAll('input[name="selectedSlots"]:checked')).map(el => el.value);
        payload.slot_ids = checked;
    }

    const btn = document.getElementById('batchSubmitBtn');
    btn.disabled = true;
    btn.textContent = 'Scheduling...';

    try {
        const res = await fetch(`/api/onboarding/batch-meeting/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
            closeModal('batchMeetingModal');
            notifyDataChanged();
        } else {
            alert('Error scheduling batch: ' + (result.message || 'Unknown error'));
        }
    } catch (err) {
        alert('Error connecting to server');
    } finally {
        btn.disabled = false;
        btn.textContent = 'SUBMIT';
    }
}

// ─── SUBTOPICS DATA ──────────────────────────────────────────────────────────

const SUB_MODULES = {
    1: ["Global Stats Overview", "Quick Filter System", "Company Activity Feed", "Notification Center"],
    3: ["Company Profile", "Branch Configuration", "Department Setup", "Designation Mapping", "Grade/Level Management", "Policy Configuration", "Document Type Setup", "Bank Master", "Category Master"],
    4: ["Employee Import/Export", "KYC Verification Flow", "Profile Management", "Management Hierarchy", "Asset Assignment", "Family Details", "Educational Records", "Previous Experience", "Separation Workflow"],
    6: ["Geo-fencing Setup", "Biometric Integration", "Shift Roster", "Overtime Policies", "Regularization Flow", "Early/Late Rules", "Holiday Attendance", "On-Duty Requests"],
    7: ["Fixed Shift Setup", "Rotational Shift Config", "Break Timing Rules", "Auto-shift Detection", "Night Shift Allowance", "Shift Swap Approval"],
    9: ["Leave Type Definition", "Accrual Rules", "Leave Encashment", "Carry Forward Policy", "Approval Hierarchy", "Holiday Clubbing Rules", "Short Leave Settings"],
    10: ["National Holidays", "Regional Holidays", "Restricted Holidays", "Holiday Calendar Sync"],
    13: ["Submission Workflow", "Client Visit Tracking", "Task Association", "Manager Review", "DWR Analytical Reports"],
    20: ["Salary Structure Config", "Component Definitions", "PF/ESI/LWF Rules", "Income Tax (TDS)", "Bonus & Arrears", "Bank Transfer Format", "Salary Slip Customization", "Loan Recovery Sync"]
};

function openSubtopicsModal(moduleId, moduleName) {
    const modal = document.getElementById('subtopicsModal');
    document.getElementById('subtopicModuleName').textContent = moduleName;
    
    const container = document.getElementById('subtopicList');
    container.innerHTML = '';
    
    const subtopics = SUB_MODULES[moduleId] || ["Standard Module Training", "Process Workflow", "Data Verification", "Q&A Session"];
    
    subtopics.forEach((text, index) => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex; align-items:center; gap:12px; padding:12px 16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:10px; margin-bottom:8px; transition:all 0.2s;';
        item.innerHTML = `
            <div style="width:24px; height:24px; border-radius:6px; background:var(--primary-ob); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:#fff;">${index + 1}</div>
            <div style="font-size:13px; color:var(--text-primary); font-weight:500;">${text}</div>
            <div style="margin-left:auto; color:var(--text-muted); font-size:11px; font-weight:600;">PENDING</div>
        `;
        container.appendChild(item);
    });

    modal.classList.add('open');
}

function openEmailModal(id, email) {
    document.getElementById('emailCompanyId').value = id;
    document.getElementById('emailTo').value = email || '';
    document.getElementById('emailModal').classList.add('open');
}

async function sendEmail(e) {
    e.preventDefault();
    const id = document.getElementById('emailCompanyId').value;
    const btn = e.submitter;
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = 'Sending...';

    const formData = new FormData();
    formData.append('receiver', document.getElementById('emailTo').value);
    formData.append('cc', document.getElementById('emailCC').value);
    formData.append('with_invoice', document.querySelector('input[name="withInvoice"]:checked').value);
    formData.append('amount', document.getElementById('emailAmount').value);
    formData.append('payment_method', document.getElementById('emailPaymentMethod').value);
    
    const fileInput = document.getElementById('emailFile');
    if (fileInput.files[0]) {
        formData.append('attachment', fileInput.files[0]);
    }

    try {
        const res = await fetch(`/api/onboarding/welcome-email/${id}`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        const result = await res.json();
        if (result.success) {
            closeModal('emailModal');
            notifyDataChanged();
            alert('Welcome email sent successfully!');
        } else {
            alert('Error: ' + result.message);
        }
    } catch (err) {
        alert('Error sending email');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function markWhatsApp(id) {
    if (!confirm('Mark WhatsApp group as created?')) return;
    try {
        const res = await fetch(`/api/onboarding/whatsapp/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await res.json();
        if (result.success) notifyDataChanged();
    } catch (err) {
        alert('Error marking WhatsApp');
    }
}

function openStatusModal(id, currentStatus) {
    document.getElementById('statusCompanyId').value = id;
    document.getElementById('statusSelect').value = currentStatus;
    document.getElementById('statusModal').classList.add('open');
}

async function saveStatus() {
    const id = document.getElementById('statusCompanyId').value;
    const status = document.getElementById('statusSelect').value;
    try {
        const res = await fetch(`/api/onboarding/status/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status })
        });
        const result = await res.json();
        if (result.success) {
            closeModal('statusModal');
            notifyDataChanged();
        }
    } catch (err) {
        alert('Error updating status');
    }
}

async function copyFeedbackUrl(id) {
    try {
        const res = await fetch(`/api/onboarding/feedback-url/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await res.json();
        if (result.success) {
            navigator.clipboard.writeText(result.url);
            alert('Feedback URL copied to clipboard!');
        }
    } catch (err) {
        alert('Error generating URL');
    }
}

async function openTimeline(id) {
    try {
        const res = await fetch(`/api/onboarding/timeline/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await res.json();
        if (result.success) {
            renderTimeline(result.events, result.company);
            document.getElementById('timelineModal').classList.add('open');
        }
    } catch (err) {
        alert('Error loading timeline');
    }
}

function renderTimeline(events, company) {
    const container = document.getElementById('timelineContent');
    let html = `
        <div style="margin-bottom:25px; padding:15px; background:rgba(255,255,255,0.03); border-radius:12px;">
            <div style="font-weight:800; font-family:'Outfit'; font-size:18px; color:var(--primary-ob);">${company.name}</div>
            <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">${company.code} &bull; ${company.city}</div>
        </div>
        <div style="position:relative; padding-left:40px; border-left:2px dashed var(--glass-border); margin-left:15px;">
    `;

    events.forEach(ev => {
        const color = ev.status === 'done' ? '#10b981' : ev.status === 'progress' ? '#f59e0b' : 'var(--text-muted)';
        html += `
            <div style="position:relative; margin-bottom:25px;">
                <div style="position:absolute; left:-49px; top:0; width:16px; height:16px; border-radius:50%; background:${color}; box-shadow:0 0 10px ${color}44;"></div>
                <div style="font-weight:700; font-size:14px; color:var(--text-primary);">${ev.label}</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">
                    ${ev.date ? renderStamp(ev.date) : 'Pending'}
                    ${ev.by ? ` &bull; By ${ev.by}` : ''}
                    ${ev.value !== undefined ? ` &bull; Progress: ${ev.value}/${ev.maxValue}` : ''}
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

// ─── INITIALIZATION ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    fetchOnboarding();
    // Fill location filters if helper available
    if (window.populateFilters) populateFilters();
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

// Helper for location dropdowns
async function populateFilters() {
    // Basic implementation if location-helper.js isn't fully compatible
    try {
        const res = await fetch('/api/locations/countries', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        const sel = document.getElementById('filterCountry');
        data.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = c.name;
            sel.appendChild(opt);
        });
    } catch(e) {}
}

function renderPagination(total) {
    const totalPages = Math.ceil(total / limit);
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);

    const infoEl = document.getElementById('obPaginationInfo');
    const btnsEl = document.getElementById('obPaginationBtns');

    if (infoEl) infoEl.textContent = total > 0 ? `Showing ${start} to ${end} of ${total.toLocaleString()} entries` : '';
    if (!btnsEl) return;
    btnsEl.innerHTML = '';

    // Prev button
    const prev = document.createElement('button');
    prev.className = 'wr-page-btn';
    prev.innerHTML = '&laquo;';
    prev.disabled = currentPage === 1;
    prev.onclick = () => { if (currentPage > 1) { currentPage--; fetchOnboarding(); } };
    btnsEl.appendChild(prev);

    // Page buttons (show max 7)
    const range = 3;
    for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
        const btn = document.createElement('button');
        btn.className = `wr-page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => { currentPage = i; fetchOnboarding(); };
        btnsEl.appendChild(btn);
    }

    // Next button
    const next = document.createElement('button');
    next.className = 'wr-page-btn';
    next.innerHTML = '&raquo;';
    next.disabled = currentPage === totalPages;
    next.onclick = () => { if (currentPage < totalPages) { currentPage++; fetchOnboarding(); } };
    btnsEl.appendChild(next);
}

// Global notification for data changes
function notifyDataChanged() {
    console.log("Data changed, refreshing views...");
    if (typeof fetchOnboarding === 'function') fetchOnboarding();
    if (typeof fetchTrainingData === 'function') fetchTrainingData();
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
}

function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderStamp(date) {
    return `<div style="font-size:10px; font-weight:700; color:#10b981; line-height:1.2;">
                DONE<br/><span style="opacity:0.7; font-weight:500;">${formatDate(date)}</span>
            </div>`;
}
