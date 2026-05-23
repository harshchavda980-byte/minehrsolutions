let currentParticipants = [];

async function fetchParticipants() {
    const tableBody = document.getElementById('participantTableBody');
    const loader = document.getElementById('tableLoader');
    
    try {
        loader.style.display = 'block';
        tableBody.innerHTML = '';

        const res = await fetch('/api/onboarding-participants');
        const result = await res.json();
        
        if (result.success) {
            currentParticipants = result.data;
            renderTable(currentParticipants);
        }
    } catch (err) {
        console.error(err);
    } finally {
        loader.style.display = 'none';
    }
}

function renderTable(participants) {
    const tableBody = document.getElementById('participantTableBody');
    const search = document.getElementById('participantSearch').value.toLowerCase();
    
    const filtered = participants.filter(p => p.name.toLowerCase().includes(search));

    tableBody.innerHTML = filtered.map((p, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td style="font-weight:700; color:var(--primary-ob);">${p.name}</td>
            <td><span class="status-badge ${p.status === 'Active' ? 'status-active' : 'status-inactive'}">${p.status}</span></td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="btn-ob btn-ob-outline" style="padding:6px;" onclick="editParticipant(${p.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                    </button>
                    <button class="btn-ob btn-ob-outline" style="padding:6px; color:#ef4444; border-color:rgba(239, 68, 68, 0.2);" onclick="deleteParticipant(${p.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    document.getElementById('participantId').value = '';
    document.getElementById('participantForm').reset();
    document.getElementById('modalTitle').innerText = 'Add Participant';
    document.getElementById('saveParticipantBtn').innerText = 'SAVE PARTICIPANT';
    document.getElementById('participantModal').classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

async function saveParticipant() {
    const id = document.getElementById('participantId').value;
    const btn = document.getElementById('saveParticipantBtn');
    const originalText = btn.innerText;

    const payload = {
        name: document.getElementById('participantName').value,
        status: document.getElementById('participantStatus').value
    };

    btn.disabled = true;
    btn.innerText = 'SAVING...';

    try {
        const url = id ? `/api/onboarding-participants/${id}` : '/api/onboarding-participants';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
            closeModal('participantModal');
            fetchParticipants();
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

async function editParticipant(id) {
    const p = currentParticipants.find(item => item.id === id);
    if (!p) return;

    document.getElementById('participantId').value = p.id;
    document.getElementById('participantName').value = p.name;
    document.getElementById('participantStatus').value = p.status;

    document.getElementById('modalTitle').innerText = 'Edit Participant';
    document.getElementById('saveParticipantBtn').innerText = 'UPDATE PARTICIPANT';
    document.getElementById('participantModal').classList.add('open');
}

async function deleteParticipant(id) {
    if (!confirm('Are you sure you want to delete this participant?')) return;

    try {
        const res = await fetch(`/api/onboarding-participants/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) fetchParticipants();
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('participantSearch')?.addEventListener('input', () => {
    renderTable(currentParticipants);
});

document.addEventListener('DOMContentLoaded', fetchParticipants);
