let currentPriorities = [];

async function fetchPriorities() {
    const tableBody = document.getElementById('priorityTableBody');
    const loader = document.getElementById('tableLoader');
    
    try {
        loader.style.display = 'block';
        tableBody.innerHTML = '';

        const res = await fetch('/api/training-priorities');
        const result = await res.json();
        
        if (result.success) {
            currentPriorities = result.data;
            renderTable(currentPriorities);
        }
    } catch (err) {
        console.error(err);
    } finally {
        loader.style.display = 'none';
    }
}

function renderTable(priorities) {
    const tableBody = document.getElementById('priorityTableBody');
    const search = document.getElementById('prioritySearch').value.toLowerCase();
    
    const filtered = priorities.filter(p => p.name.toLowerCase().includes(search));

    tableBody.innerHTML = filtered.map((p, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td style="font-weight:700; color:var(--primary-ob);">${p.name}</td>
            <td><span class="required-badge">${p.is_required ? 'REQUIRED' : 'OPTIONAL'}</span></td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="btn-ob btn-ob-outline" style="padding:6px;" onclick="editPriority(${p.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                    </button>
                    <button class="btn-ob btn-ob-outline" style="padding:6px; color:#ef4444; border-color:rgba(239, 68, 68, 0.2);" onclick="deletePriority(${p.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    document.getElementById('priorityId').value = '';
    document.getElementById('priorityForm').reset();
    document.getElementById('modalTitle').innerText = 'Add Training Priority';
    document.getElementById('savePriorityBtn').innerText = 'SAVE PRIORITY';
    document.getElementById('priorityModal').classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

async function savePriority() {
    const id = document.getElementById('priorityId').value;
    const btn = document.getElementById('savePriorityBtn');
    const originalText = btn.innerText;

    const payload = {
        name: document.getElementById('priorityName').value,
        is_required: document.getElementById('isRequired').value == '1',
        display_order: document.getElementById('displayOrder').value
    };

    btn.disabled = true;
    btn.innerText = 'SAVING...';

    try {
        const url = id ? `/api/training-priorities/${id}` : '/api/training-priorities';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
            closeModal('priorityModal');
            fetchPriorities();
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

async function editPriority(id) {
    const p = currentPriorities.find(item => item.id === id);
    if (!p) return;

    document.getElementById('priorityId').value = p.id;
    document.getElementById('priorityName').value = p.name;
    document.getElementById('isRequired').value = p.is_required ? '1' : '0';
    document.getElementById('displayOrder').value = p.display_order;

    document.getElementById('modalTitle').innerText = 'Edit Training Priority';
    document.getElementById('savePriorityBtn').innerText = 'UPDATE PRIORITY';
    document.getElementById('priorityModal').classList.add('open');
}

async function deletePriority(id) {
    if (!confirm('Are you sure you want to delete this priority?')) return;

    try {
        const res = await fetch(`/api/training-priorities/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) fetchPriorities();
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('prioritySearch')?.addEventListener('input', () => {
    renderTable(currentPriorities);
});

document.addEventListener('DOMContentLoaded', fetchPriorities);
