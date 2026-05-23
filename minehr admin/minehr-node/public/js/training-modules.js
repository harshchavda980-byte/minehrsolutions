let currentModules = [];
let sessionNames = [];

async function fetchModules() {
    const tableBody = document.getElementById('moduleTableBody');
    const loader = document.getElementById('tableLoader');
    
    const search = document.getElementById('moduleSearch').value;
    const type = document.getElementById('filterType').value;
    const priority = document.getElementById('filterPriority').value;
    const status = document.getElementById('filterStatus').value;

    const queryParams = new URLSearchParams({ search, type, priority, status });

    try {
        loader.style.display = 'block';
        tableBody.innerHTML = '';

        const res = await fetch(`/api/training-modules?${queryParams}`);
        const result = await res.json();
        
        if (result.success) {
            currentModules = result.data;
            renderTable(currentModules);
        }
    } catch (err) {
        console.error(err);
    } finally {
        loader.style.display = 'none';
    }
}

function renderTable(modules) {
    const tableBody = document.getElementById('moduleTableBody');
    tableBody.innerHTML = modules.map((m, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td style="font-weight:700; color:var(--primary-ob);">${m.name}</td>
            <td>${m.topic_name || '--'}</td>
            <td>${m.type}</td>
            <td><span class="status-badge" style="background:rgba(99,102,241,0.1); color:var(--primary-ob);">${m.priority}</span></td>
            <td>${m.display_order}</td>
            <td>${m.completion_days}</td>
            <td>${m.estimated_minutes} min</td>
            <td>
                <button class="btn-ob" style="font-size:10px; padding:4px 8px; background:rgba(6, 182, 212, 0.1); color:#06b6d4; border:1px solid rgba(6, 182, 212, 0.2);">
                    SUB-TOPICS <span style="margin-left:5px; background:#06b6d4; color:#fff; padding:2px 6px; border-radius:4px;">${m.sub_topics_count}</span>
                </button>
            </td>
            <td><span class="status-badge ${m.status === 'Active' ? 'status-active' : 'status-inactive'}">${m.status}</span></td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="btn-ob btn-ob-outline" style="padding:6px;" onclick="editModule(${m.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                    </button>
                    <button class="btn-ob btn-ob-outline" style="padding:6px; color:#ef4444; border-color:rgba(239, 68, 68, 0.2);" onclick="deleteModule(${m.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
            <td style="font-size:10px; color:var(--text-muted);">${m.url || '--'}</td>
        </tr>
    `).join('');
}

// Modal Handlers
function openAddModal() {
    document.getElementById('moduleId').value = '';
    document.getElementById('moduleForm').reset();
    document.getElementById('modalTitle').innerText = 'Add Module';
    document.getElementById('saveModuleBtn').innerText = 'ADD MODULE';
    sessionNames = [];
    renderTags();
    document.getElementById('moduleModal').classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

// Tags Logic
const tagInput = document.getElementById('tagInput');
tagInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = tagInput.value.trim();
        if (val && !sessionNames.includes(val)) {
            sessionNames.push(val);
            renderTags();
            tagInput.value = '';
        }
    }
});

function renderTags() {
    const container = document.getElementById('tagsContainer');
    const existingPills = container.querySelectorAll('.tag-pill');
    existingPills.forEach(p => p.remove());

    sessionNames.forEach((tag, idx) => {
        const pill = document.createElement('div');
        pill.className = 'tag-pill';
        pill.innerHTML = `${tag} <span onclick="removeTag(${idx})">&times;</span>`;
        container.insertBefore(pill, tagInput);
    });
}

function removeTag(idx) {
    sessionNames.splice(idx, 1);
    renderTags();
}

async function saveModule() {
    const id = document.getElementById('moduleId').value;
    const btn = document.getElementById('saveModuleBtn');
    const originalText = btn.innerText;
    
    if (sessionNames.length === 0) {
        alert('Please add at least one Session Name tag.');
        return;
    }

    const payload = {
        type: document.getElementById('moduleType').value,
        name: document.getElementById('moduleName').value,
        priority: document.getElementById('priorityName').value,
        url: document.getElementById('moduleUrl').value,
        estimated_minutes: document.getElementById('estimatedMinutes').value,
        session_day: document.getElementById('sessionDay').value,
        session_names: sessionNames,
        topic_name: sessionNames.join(' | ') // For summary display
    };

    btn.disabled = true;
    btn.innerText = 'SAVING...';

    try {
        const url = id ? `/api/training-modules/${id}` : '/api/training-modules';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
            closeModal('moduleModal');
            fetchModules();
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

async function editModule(id) {
    const mod = currentModules.find(m => m.id === id);
    if (!mod) return;

    document.getElementById('moduleId').value = mod.id;
    document.getElementById('moduleType').value = mod.type;
    document.getElementById('moduleName').value = mod.name;
    document.getElementById('priorityName').value = mod.priority;
    document.getElementById('moduleUrl').value = mod.url || '';
    document.getElementById('estimatedMinutes').value = mod.estimated_minutes;
    document.getElementById('sessionDay').value = mod.session_day || '';
    
    sessionNames = mod.session_names || [];
    renderTags();

    document.getElementById('modalTitle').innerText = 'Edit Module';
    document.getElementById('saveModuleBtn').innerText = 'UPDATE MODULE';
    document.getElementById('moduleModal').classList.add('open');
}

async function deleteModule(id) {
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
        const res = await fetch(`/api/training-modules/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) fetchModules();
    } catch (err) {
        console.error(err);
    }
}

// Search Listener
document.getElementById('moduleSearch')?.addEventListener('input', () => {
    // Debounce can be added here
    fetchModules();
});

document.addEventListener('DOMContentLoaded', fetchModules);
