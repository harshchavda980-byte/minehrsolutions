/**
 * Manage Training Slots Logic
 */

let allMeetings = [];
let currentTab = 'today';
let availableBatches = [];
let availableCompanies = [];

// Trainers list (Hardcoded as per requirement/screenshots)
const trainers = ["Harsh Rathod", "Rajesh Medlkonda", "Sohan bhiyajiya", "Mohammad Tariq Tansujwala", "Sumanth Goud Varni", "Vijay prakash"];

async function initPage() {
    await fetchBatches();
    await fetchCompanies();
    await fetchMeetings();
}

async function fetchMeetings() {
    const loader = document.getElementById('tableLoader');
    const tbody = document.getElementById('slotTableBody');
    if(loader) loader.style.display = 'block';
    if(tbody) tbody.innerHTML = '';

    try {
        const res = await fetch(`/api/training-meetings?type=${currentTab}`);
        const data = await res.json();
        
        if(loader) loader.style.display = 'none';
        
        if (data.success) {
            allMeetings = data.data;
            renderMeetingTable();
        }
    } catch (err) {
        console.error('Fetch meetings error:', err);
        if(loader) loader.innerText = 'Failed to load meetings.';
    }
}

function renderMeetingTable() {
    const tbody = document.getElementById('slotTableBody');
    if (!tbody) return;

    if (allMeetings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:40px; color:var(--text-muted);">No meetings found for this category.</td></tr>`;
        return;
    }

    tbody.innerHTML = allMeetings.map((meeting, index) => `
        <tr>
            <td style="font-weight:700; color:var(--text-muted);">${index + 1}</td>
            <td>
                <div style="display:flex; gap:8px;">
                    ${meeting.status === 'Pending' ? `
                        <button class="btn-ob btn-primary" style="padding: 4px 8px; font-size: 11px;" onclick="startMeeting(${meeting.id})">START MEETING</button>
                    ` : ''}
                    <button class="btn-ob btn-outline" style="padding: 4px 8px; font-size: 11px; border-color: rgba(255,255,255,0.1); color: #fff;" onclick="editMeeting(${meeting.id})">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                </div>
            </td>
            <td style="font-weight:700; color:#fff;">${meeting.slot_name}</td>
            <td><span class="badge ${getStatusClass(meeting.status)}">${meeting.status}</span></td>
            <td style="font-weight:600;">${meeting.trainer_name || 'Not Assigned'}</td>
            <td>${meeting.city || '-'}</td>
            <td>${meeting.meeting_day || '-'}</td>
            <td>${formatDate(meeting.meeting_date)}</td>
            <td style="color:var(--primary-ob); font-weight:700;">${formatTime(meeting.start_time)}</td>
            <td>${formatTime(meeting.end_time)}</td>
            <td style="font-size: 12px;">${formatDate(meeting.batch_start_date)}</td>
            <td>
                <span class="badge" style="background:rgba(255,255,255,0.05); color:#fff;">${meeting.companies?.length || 0} Companies</span>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    if (status === 'Pending') return 'status-pending';
    if (status === 'In Progress') return 'status-progress';
    if (status === 'Completed') return 'status-completed';
    return '';
}

function formatDate(dateStr) {
    if(!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(timeStr) {
    if(!timeStr) return '-';
    // Convert HH:mm:ss to 12h format
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
}

async function fetchBatches() {
    try {
        const res = await fetch('/api/onboarding/batches');
        const data = await res.json();
        if (data.success) {
            availableBatches = data.data;
            const select = document.getElementById('batchSelect');
            select.innerHTML = '<option value="">Select Batch</option>' + 
                availableBatches.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
        }
    } catch (err) { console.error(err); }
}

async function fetchCompanies() {
    try {
        const res = await fetch('/api/onboarding'); // Uses the existing endpoint that returns verified companies
        const data = await res.json();
        if (data.success) {
            availableCompanies = data.data;
            const select = document.getElementById('companySelect');
            const refSelect = document.getElementById('refCompanySelect');
            
            const options = availableCompanies.map(c => `<option value="${c.id}">${c.name} (${c.company_code})</option>`).join('');
            
            select.innerHTML = options;
            refSelect.innerHTML = '<option value="">Select Company</option>' + options;
        }
    } catch (err) { console.error(err); }
}

function switchTab(tab, btn) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    fetchMeetings();
}

function openAddModal() {
    document.getElementById('modalTitle').innerText = 'Add Batch Slot';
    document.getElementById('slotId').value = '';
    document.getElementById('slotForm').reset();
    document.getElementById('slotsSection').innerHTML = '';
    addSlotRow(); // Start with one row
    document.getElementById('slotModal').classList.add('open');
}

let slotCount = 0;
function addSlotRow() {
    slotCount++;
    const container = document.getElementById('slotsSection');
    const row = document.createElement('div');
    row.className = 'slot-row';
    row.id = `slot-row-${slotCount}`;
    row.innerHTML = `
        <div style="font-weight:700; color:var(--text-muted); font-size: 11px;">M${slotCount}</div>
        <input type="time" name="startTime" class="form-control" value="10:00" required>
        <input type="time" name="endTime" class="form-control" value="11:30" required>
        <select name="trainerName" class="form-control">
            <option value="">Select Trainer</option>
            ${trainers.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
        <button type="button" class="close-modal" style="color:#ef4444;" onclick="removeSlotRow(${slotCount})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;
    container.appendChild(row);
}

function removeSlotRow(id) {
    const row = document.getElementById(`slot-row-${id}`);
    if (row) row.remove();
}

// Handle Batch Selection to auto-fill details
document.getElementById('batchSelect')?.addEventListener('change', (e) => {
    const batchId = e.target.value;
    const batch = availableBatches.find(b => b.id == batchId);
    if (batch) {
        document.getElementById('batchTypeDisplay').value = batch.type;
    }
});

async function saveSlot() {
    const btn = document.getElementById('saveSlotBtn');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = 'SAVING...';

    const batchId = document.getElementById('batchSelect').value;
    const meetingDate = document.getElementById('meetingDate').value;
    const city = document.getElementById('city').value;
    const batchStartDate = document.getElementById('batchStartDate').value;
    const refCompanyId = document.getElementById('refCompanySelect').value;
    
    const companySelect = document.getElementById('companySelect');
    const companyIds = Array.from(companySelect.selectedOptions).map(opt => opt.value);

    if (!batchId || !meetingDate || companyIds.length === 0) {
        alert('Please fill all required fields and select at least one company.');
        btn.disabled = false;
        btn.innerText = originalText;
        return;
    }

    const slotRows = document.querySelectorAll('.slot-row');
    if (slotRows.length === 0) {
        alert('Please add at least one meeting slot.');
        btn.disabled = false;
        btn.innerText = originalText;
        return;
    }

    const savePromises = [];
    const batch = availableBatches.find(b => b.id == batchId);

    slotRows.forEach((row, index) => {
        const startTime = row.querySelector('[name="startTime"]').value;
        const endTime = row.querySelector('[name="endTime"]').value;
        const trainerName = row.querySelector('[name="trainerName"]').value;

        const payload = {
            slot_name: `${batch?.name || 'Batch'} M${index + 1}`,
            batch_id: batchId,
            trainer_name: trainerName,
            city: city,
            meeting_day: new Date(meetingDate).toLocaleDateString('en-US', { weekday: 'long' }),
            meeting_date: meetingDate,
            start_time: startTime,
            end_time: endTime,
            batch_start_date: batchStartDate,
            reference_company_id: refCompanyId || null,
            company_ids: companyIds
        };

        savePromises.push(fetch('/api/training-meetings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }));
    });

    try {
        const results = await Promise.all(savePromises);
        const allOk = results.every(r => r.ok);
        if (allOk) {
            alert('Batch slots saved successfully!');
            closeModal('slotModal');
            fetchMeetings();
        } else {
            throw new Error('Some slots failed to save.');
        }
    } catch (err) {
        console.error(err);
        alert('Error: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

async function startMeeting(id) {
    if(!confirm('Are you sure you want to start this meeting?')) return;
    try {
        const res = await fetch(`/api/training-meetings/${id}/start`, { method: 'POST' });
        const data = await res.json();
        if(data.success) fetchMeetings();
    } catch (err) { console.error(err); }
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

document.getElementById('slotSearch')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#slotTableBody tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
});

document.addEventListener('DOMContentLoaded', initPage);
