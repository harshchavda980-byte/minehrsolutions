let currentTemplates = [];

async function fetchTemplates() {
    const tableBody = document.getElementById('templateTableBody');
    const loader = document.getElementById('tableLoader');
    
    try {
        loader.style.display = 'block';
        tableBody.innerHTML = '';

        const res = await fetch('/api/email-templates');
        const result = await res.json();
        
        if (result.success) {
            currentTemplates = result.data;
            renderTable(currentTemplates);
        }
    } catch (err) {
        console.error(err);
    } finally {
        loader.style.display = 'none';
    }
}

function renderTable(templates) {
    const tableBody = document.getElementById('templateTableBody');
    const search = document.getElementById('templateSearch').value.toLowerCase();
    
    const filtered = templates.filter(t => t.template_name.toLowerCase().includes(search));

    tableBody.innerHTML = filtered.map((t, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="btn-ob btn-ob-outline" style="padding:6px;" onclick="editTemplate(${t.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                    </button>
                    <button class="btn-ob btn-ob-outline" style="padding:6px; color:#ef4444; border-color:rgba(239, 68, 68, 0.2);" onclick="deleteTemplate(${t.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
            <td style="font-weight:700; color:var(--primary-ob);">${t.template_name}</td>
            <td style="font-size:11px;">${new Date(t.created_at).toLocaleString()}</td>
            <td style="font-weight:600;">${t.Creator?.name || 'System'}</td>
        </tr>
    `).join('');
}

function openAddModal() {
    document.getElementById('templateId').value = '';
    document.getElementById('templateForm').reset();
    document.getElementById('modalTitle').innerText = 'Add Template';
    document.getElementById('saveTemplateBtn').innerText = 'SAVE TEMPLATE';
    document.getElementById('templateModal').classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function insertVariable(variable) {
    const textarea = document.getElementById('templateBody');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    textarea.value = before + variable + after;
    textarea.selectionStart = textarea.selectionEnd = start + variable.length;
    textarea.focus();
}

async function saveTemplate() {
    const id = document.getElementById('templateId').value;
    const btn = document.getElementById('saveTemplateBtn');
    const originalText = btn.innerText;

    const payload = {
        template_name: document.getElementById('templateName').value,
        subject: document.getElementById('templateSubject').value,
        body: document.getElementById('templateBody').value
    };

    btn.disabled = true;
    btn.innerText = 'SAVING...';

    try {
        const url = id ? `/api/email-templates/${id}` : '/api/email-templates';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
            closeModal('templateModal');
            fetchTemplates();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (err) {
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

async function editTemplate(id) {
    const t = currentTemplates.find(item => item.id === id);
    if (!t) return;

    document.getElementById('templateId').value = t.id;
    document.getElementById('templateName').value = t.template_name;
    document.getElementById('templateSubject').value = t.subject;
    document.getElementById('templateBody').value = t.body;

    document.getElementById('modalTitle').innerText = 'Edit Template';
    document.getElementById('saveTemplateBtn').innerText = 'UPDATE TEMPLATE';
    document.getElementById('templateModal').classList.add('open');
}

async function deleteTemplate(id) {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
        const res = await fetch(`/api/email-templates/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) fetchTemplates();
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('templateSearch')?.addEventListener('input', () => {
    renderTable(currentTemplates);
});

document.addEventListener('DOMContentLoaded', fetchTemplates);
