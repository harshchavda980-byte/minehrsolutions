/* ══════════════════════════════════════════
   Engagement Work Report — Frontend Logic
══════════════════════════════════════════ */

let allReports = [];
let allCompanies = [];
let referredCompanies = [];   // array of {id, name}
let editingId = null;

const entryCounts = { references: 0, testimonials: 0, google_reviews: 0, app_reviews: 0 };

// ── Init ──────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await setupAuth();
    await loadCompanies();
    await loadList();

    // Close company dropdown on outside click
    document.addEventListener('click', e => {
        if (!e.target.closest('#referredTagsWrap') && !e.target.closest('#referredDropdown')) {
            document.getElementById('referredDropdown').classList.remove('show');
        }
    });
});

// ── Auth ──────────────────────────────────
async function setupAuth() {
    try {
        const res  = await fetch('/api/auth/me');
        if (!res.ok) { window.location.href = '/login'; return; }
        const data = await res.json();
        const user = data.user || data;
        const name  = user.name  || 'Admin';
        const role  = user.role  || 'Super Admin';
        const email = user.email || 'admin@minehr.com';
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;

        const set = (id, val) => { const el = document.getElementById(id); if (!el) return; el[el.tagName === 'IMG' ? 'src' : 'innerText'] = val; };
        set('userName', name); set('userRole', role); set('userAvatar', avatar);
        set('profileMenuName', name); set('profileMenuEmail', email);

        const lb = document.getElementById('logoutBtn');
        if (lb) lb.onclick = async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; };
    } catch (e) { console.error(e); }
}

// ── Load Companies (for autocomplete) ────
async function loadCompanies() {
    try {
        const res  = await fetch('/api/work-reports/companies');
        const data = await res.json();
        if (data.success) allCompanies = data.data;
    } catch (e) { console.error(e); }
}

// ── Company Autocomplete ──────────────────
function searchCompanies(q) {
    const drop = document.getElementById('referredDropdown');
    const list = allCompanies.filter(c =>
        c.name.toLowerCase().includes(q.toLowerCase()) &&
        !referredCompanies.find(r => r.id === c.id)
    );
    if (!list.length || !q) { drop.classList.remove('show'); return; }
    drop.innerHTML = list.slice(0, 15).map(c => `
        <div class="tags-dropdown-item" onclick="addReferredCompany(${c.id},'${c.name.replace(/'/g,"\\'")}')">
            ${c.name} <span style="font-size:10px;color:var(--text-muted);">${c.city||''}</span>
        </div>
    `).join('');
    drop.classList.add('show');
}

function addReferredCompany(id, name) {
    if (referredCompanies.find(r => r.id === id)) return;
    referredCompanies.push({ id, name });
    renderReferredTags();
    document.getElementById('referredSearch').value = '';
    document.getElementById('referredDropdown').classList.remove('show');
}

function removeReferredCompany(id) {
    referredCompanies = referredCompanies.filter(r => r.id !== id);
    renderReferredTags();
}

function renderReferredTags() {
    document.getElementById('referredTags').innerHTML = referredCompanies.map(r => `
        <span class="tag">
            ${r.name}
            <span class="tag-x" onclick="removeReferredCompany(${r.id})">×</span>
        </span>
    `).join('');
}

// ── Company Select (for entries) ──────────
function buildCompanySelect(name, val = '') {
    const opts = allCompanies.map(c =>
        `<option value="${c.id}" data-city="${c.city||''}" data-name="${c.name}" ${c.id == val ? 'selected' : ''}>${c.name}</option>`
    ).join('');
    return `<select name="${name}" class="wr-input" onchange="autoFillCity(this)">
        <option value="">Select Company</option>${opts}
    </select>`;
}

function autoFillCity(sel) {
    const opt = sel.options[sel.selectedIndex];
    const city = opt?.dataset.city || '';
    const wrap = sel.closest('.dyn-entry');
    const cityInput = wrap?.querySelector('.city-auto');
    if (cityInput) cityInput.value = city;
}

// ── Dynamic Entry Templates ───────────────
function entryTemplate(type, idx) {
    const labelMap = { references:'Reference', testimonials:'Testimonial', google_reviews:'Google Review', app_reviews:'MyCo App Review' };
    const label = `${labelMap[type]} ${idx + 1}`;
    let fields = '';

    if (type === 'references') {
        fields = `
            <div class="entry-grid-2">
                <div class="wr-form-group"><label>Company Name <span style="color:#ef4444">*</span></label>${buildCompanySelect('company_id')}</div>
                <div class="wr-form-group"><label>City <span style="color:#ef4444">*</span></label><input type="text" name="city" class="wr-input city-auto" placeholder="Enter city"></div>
            </div>
            <div class="entry-grid-3">
                <div class="wr-form-group"><label>Contact Person Name <span style="color:#ef4444">*</span></label><input type="text" name="contact_name" class="wr-input" placeholder="Name"></div>
                <div class="wr-form-group"><label>Contact Person No. <span style="color:#ef4444">*</span></label><input type="tel" name="contact_phone" class="wr-input" placeholder="Phone number"></div>
                <div class="wr-form-group"><label>Referred By Whom <span style="color:#ef4444">*</span></label><input type="text" name="referred_by" class="wr-input" placeholder="Who referred"></div>
            </div>`;
    } else if (type === 'testimonials') {
        fields = `
            <div class="entry-grid-2">
                <div class="wr-form-group"><label>Company Name <span style="color:#ef4444">*</span></label>${buildCompanySelect('company_id')}</div>
                <div class="wr-form-group"><label>City <span style="color:#ef4444">*</span></label><input type="text" name="city" class="wr-input city-auto" placeholder="Enter city"></div>
            </div>
            <div class="wr-form-group">
                <label>Testimonial Type <span style="color:#ef4444">*</span></label>
                <div class="radio-group">
                    <label class="radio-option"><input type="radio" name="type_${type}_${idx}" value="Video"> Video</label>
                    <label class="radio-option"><input type="radio" name="type_${type}_${idx}" value="Text"> Text</label>
                </div>
            </div>`;
    } else if (type === 'google_reviews') {
        fields = `
            <div class="entry-grid-2">
                <div class="wr-form-group"><label>Company Name <span style="color:#ef4444">*</span></label>${buildCompanySelect('company_id')}</div>
                <div class="wr-form-group"><label>City</label><input type="text" name="city" class="wr-input city-auto" placeholder="Auto-filled"></div>
            </div>
            <div class="wr-form-group"><label>Review Link</label><input type="url" name="link" class="wr-input" placeholder="https://g.co/..."></div>`;
    } else if (type === 'app_reviews') {
        fields = `
            <div class="entry-grid-2">
                <div class="wr-form-group"><label>Company Name <span style="color:#ef4444">*</span></label>${buildCompanySelect('company_id')}</div>
                <div class="wr-form-group"><label>City</label><input type="text" name="city" class="wr-input city-auto" placeholder="Auto-filled"></div>
            </div>
            <div class="wr-form-group"><label>Review / Comment</label><textarea name="review" class="wr-input" rows="2" placeholder="Enter review text..."></textarea></div>`;
    }

    return `<div class="dyn-entry" data-type="${type}" data-idx="${idx}">
        <div class="dyn-entry-header">
            <span class="dyn-entry-label">${label}</span>
            <button class="btn-remove-row" onclick="removeEntry(this)">REMOVE</button>
        </div>
        ${fields}
    </div>`;
}

function addEntry(type) {
    const container = document.getElementById(`entries-${type}`);
    const idx = entryCounts[type]++;
    const div = document.createElement('div');
    div.innerHTML = entryTemplate(type, idx);
    container.appendChild(div.firstElementChild);
}

function removeEntry(btn) {
    btn.closest('.dyn-entry').remove();
}

// ── Collect Entry Data ────────────────────
function collectEntries(type) {
    const entries = document.querySelectorAll(`#entries-${type} .dyn-entry`);
    return Array.from(entries).map((entry, idx) => {
        const data = {};
        entry.querySelectorAll('[name]').forEach(el => {
            if (el.type === 'radio') {
                if (el.checked) data.type = el.value;
            } else if (el.tagName === 'SELECT') {
                const opt = el.options[el.selectedIndex];
                data.company_id = el.value;
                data.company_name = opt?.dataset.name || opt?.text || '';
            } else {
                const key = el.getAttribute('name');
                if (key) data[key] = el.value;
            }
        });
        return data;
    });
}

// ── Form Show/Hide ────────────────────────
function showForm(reportId = null) {
    editingId = reportId;
    resetForm();
    document.getElementById('viewList').style.display = 'none';
    document.getElementById('viewForm').style.display = 'block';
    document.getElementById('formHeading').innerText = reportId ? 'Edit Engagement Work Report' : 'Add Engagement Work Report';
    document.getElementById('submitBtn').innerText = reportId ? 'SAVE CHANGES' : 'ADD';

    if (reportId) {
        const rep = allReports.find(r => r.id === reportId);
        if (rep) populateForm(rep);
    }
}

function showList() {
    document.getElementById('viewForm').style.display = 'none';
    document.getElementById('viewList').style.display = 'block';
}

function resetForm() {
    ['noOfCalls','lineupCalls'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    referredCompanies = [];
    renderReferredTags();
    ['references','testimonials','google_reviews','app_reviews'].forEach(t => {
        const el = document.getElementById(`entries-${t}`);
        if (el) el.innerHTML = '';
        entryCounts[t] = 0;
    });
}

function populateForm(rep) {
    document.getElementById('noOfCalls').value = rep.no_of_calls || 0;
    document.getElementById('lineupCalls').value = rep.lineup_calls || 0;
    referredCompanies = rep.referred_companies || [];
    renderReferredTags();

    ['references','testimonials','google_reviews','app_reviews'].forEach(type => {
        const items = rep[type] || [];
        items.forEach(() => addEntry(type));
        // Populate values — simplified for now (full field-by-field repopulation)
    });
}

// ── Submit ────────────────────────────────
async function submitForm() {
    const noOfCalls   = document.getElementById('noOfCalls').value;
    const lineupCalls = document.getElementById('lineupCalls').value;

    if (!noOfCalls) { alert('Please enter Today\'s No. of Calls'); return; }
    if (!lineupCalls) { alert('Please enter Today\'s Line Up Calls'); return; }

    const payload = {
        trainer_name:       document.getElementById('userName').innerText || 'Admin',
        no_of_calls:        parseInt(noOfCalls),
        lineup_calls:       parseInt(lineupCalls),
        referred_companies: referredCompanies,
        references:         collectEntries('references'),
        testimonials:       collectEntries('testimonials'),
        google_reviews:     collectEntries('google_reviews'),
        app_reviews:        collectEntries('app_reviews')
    };

    try {
        const url    = editingId ? `/api/work-reports/${editingId}` : '/api/work-reports';
        const method = editingId ? 'PUT' : 'POST';
        const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data   = await res.json();
        if (data.success) { await loadList(); showList(); }
        else alert(data.message || 'Error saving report');
    } catch (e) { console.error(e); alert('Network error'); }
}

// ── List ──────────────────────────────────
async function loadList() {
    try {
        const res  = await fetch('/api/work-reports');
        const data = await res.json();
        if (data.success) { allReports = data.data; renderList(allReports); }
    } catch (e) { console.error(e); }
}

function renderList(reports) {
    const tbody = document.getElementById('listBody');
    if (!reports.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted);">No work reports found. Click + ADD to create one.</td></tr>';
        return;
    }
    tbody.innerHTML = reports.map(r => {
        const refs   = (r.referred_companies || []).map(c => c.name).join(', ') || '—';
        const date   = new Date(r.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
        return `<tr>
            <td>
                <div class="wr-table-actions">
                    <button class="btn-view" onclick="viewReport(${r.id})">👁</button>
                    <button class="btn-edit" onclick="showForm(${r.id})">✎</button>
                    <button class="btn-del"  onclick="deleteReport(${r.id})">✕</button>
                </div>
            </td>
            <td style="font-weight:600;">${r.trainer_name}</td>
            <td style="text-align:center;font-weight:700;font-size:16px;color:var(--primary);">${r.no_of_calls}</td>
            <td style="text-align:center;font-weight:700;font-size:16px;">${r.lineup_calls}</td>
            <td>${refs}</td>
            <td>${date}</td>
        </tr>`;
    }).join('');
}

function filterList() {
    const q = document.getElementById('listSearch').value.toLowerCase();
    const filtered = allReports.filter(r =>
        r.trainer_name.toLowerCase().includes(q) ||
        (r.referred_companies || []).some(c => c.name.toLowerCase().includes(q))
    );
    renderList(filtered);
}

// ── Delete ────────────────────────────────
async function deleteReport(id) {
    if (!confirm('Delete this work report?')) return;
    try {
        await fetch(`/api/work-reports/${id}`, { method: 'DELETE' });
        await loadList();
    } catch (e) { console.error(e); }
}

// ── View Modal ────────────────────────────
function viewReport(id) {
    const rep = allReports.find(r => r.id === id);
    if (!rep) return;

    const date = new Date(rep.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
    const refs = (rep.referred_companies || []).map(c => c.name).join(', ') || '—';

    const sectionHtml = (title, items, fields) => {
        if (!items || !items.length) return '';
        const itemsHtml = items.map((item, i) => `
            <div style="margin-bottom:6px;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.6px;">${title.replace(/s$/,'')} ${i+1}</div>
            <div class="wr-modal-entry" style="grid-template-columns:repeat(${fields.length},1fr);">
                ${fields.map(f => `<div><div class="fld">${f.label}</div><div class="fval">${item[f.key] || '—'}</div></div>`).join('')}
            </div>
        `).join('');
        return `<div class="wr-modal-sub-section">
            <div class="wr-modal-sub-title">🔹 ${title}</div>${itemsHtml}
        </div>`;
    };

    document.getElementById('modalBody').innerHTML = `
        <div class="wr-modal-info-grid" style="margin-bottom:20px;">
            <div class="wr-info-box"><div class="label">Employee Name</div><div class="fval" style="font-size:15px;font-weight:700;">${rep.trainer_name}</div></div>
            <div class="wr-info-box"><div class="label">Today No. of Calls</div><div class="val">${rep.no_of_calls}</div></div>
            <div class="wr-info-box"><div class="label">Today's Line Up Calls</div><div class="val">${rep.lineup_calls}</div></div>
        </div>
        <div style="margin-bottom:20px;font-size:12px;color:var(--text-muted);"><strong style="color:var(--text-primary);">Companies Referred for Implementation:</strong> ${refs}</div>
        ${sectionHtml("Today's References", rep.references, [
            {label:'Company Name', key:'company_name'},
            {label:'City', key:'city'},
            {label:'Contact Person', key:'contact_name'},
            {label:'Phone No.', key:'contact_phone'},
            {label:'Referred By', key:'referred_by'}
        ])}
        ${sectionHtml("Today's Testimonials", rep.testimonials, [
            {label:'Company Name', key:'company_name'},
            {label:'City', key:'city'},
            {label:'Type', key:'type'}
        ])}
        ${sectionHtml("Google Reviews", rep.google_reviews, [
            {label:'Company Name', key:'company_name'},
            {label:'City', key:'city'},
            {label:'Link', key:'link'}
        ])}
        ${sectionHtml("MyCo App Reviews", rep.app_reviews, [
            {label:'Company Name', key:'company_name'},
            {label:'City', key:'city'},
            {label:'Review', key:'review'}
        ])}
        <div style="text-align:right;font-size:11px;color:var(--text-muted);margin-top:10px;">Added: ${date}</div>
    `;
    document.getElementById('viewModal').classList.add('open');
}

function closeModal() {
    document.getElementById('viewModal').classList.remove('open');
}

// Close modal on overlay click
document.getElementById('viewModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
});
