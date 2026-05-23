/**
 * Feedback & Escalation Module Logic
 */

let allFeedback = [];
let currentPage = 1;
const recordsPerPage = 10;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth Check
    const authRes = await fetch('/api/auth/me');
    if (!authRes.ok) {
        window.location.href = '/login';
        return;
    }
    const user = await authRes.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

    // 2. Load Sidebar/Theme (Handled by general scripts usually, but ensuring load)
    await loadFeedback(1);
});

async function loadFeedback(page = 1) {
    currentPage = page;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchInput').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    let url = `/api/feedback?page=${page}&limit=${recordsPerPage}`;
    if (status) url += `&status=${status}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        allFeedback = data.feedback;
        renderTable(allFeedback);
        renderPagination(data.pages, data.currentPage);
    } catch (err) {
        console.error('Failed to load feedback:', err);
    }
}

function renderTable(feedbackList) {
    const tableBody = document.getElementById('feedbackTableBody');
    if (!tableBody) return;

    if (!feedbackList.length) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color: var(--text-muted);">No feedback records found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = feedbackList.map(f => `
        <tr class="status-${f.status.toLowerCase().replace(' ', '-')} ${f.is_overdue ? 'status-overdue' : ''}">
            <td style="font-weight: 600;">
                #${f.feedback_id}
                ${f.is_overdue ? '<br><small style="color:#ef4444; font-size:10px;">⚠️ OVERDUE</small>' : ''}
            </td>
            <td>
                <strong>${f.name}</strong><br>
                <small class="text-muted">${f.email}</small>
            </td>
            <td>
                <div style="font-weight: 600;">${f.subject || 'No Subject'} ${f.is_overdue ? '🚩' : ''}</div>
                <div style="font-size: 12px; color: var(--text-secondary); max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${f.message}
                </div>
            </td>
            <td>${f.company ? f.company.name : '<span class="text-muted">-</span>'}</td>
            <td><span class="badge ${getStatusBadge(f.status)}">${f.status}</span></td>
            <td>${f.assignee ? f.assignee.name : '<span class="text-muted">Unassigned</span>'}</td>
            <td>${new Date(f.created_at).toLocaleDateString()}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-icon btn-sm" onclick="viewDetails(${f.id})" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    ${f.status !== 'Resolved' ? `
                        <button class="btn btn-icon btn-sm warning" onclick="escalateFeedback(${f.id})" title="Escalate">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPagination(totalPages, activePage) {
    const controls = document.getElementById('paginationControls');
    if (!controls) return;

    let html = `<button onclick="loadFeedback(${activePage - 1})" ${activePage <= 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${activePage === i ? 'active' : ''}" onclick="loadFeedback(${i})">${i}</button>`;
    }
    html += `<button onclick="loadFeedback(${activePage + 1})" ${activePage >= totalPages ? 'disabled' : ''}>Next</button>`;
    controls.innerHTML = html;
}

function getStatusBadge(status) {
    if (status === 'New') return 'badge-info';
    if (status === 'In Progress') return 'badge-warning';
    if (status === 'Escalated') return 'badge-escalated';
    if (status === 'Resolved') return 'badge-success';
    return 'badge-secondary';
}

function filterFeedback() {
    loadFeedback(1);
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    loadFeedback(1);
}

async function viewDetails(id) {
    try {
        const res = await fetch(`/api/feedback/${id}`);
        const f = await res.json();

        document.getElementById('modalFeedbackId').textContent = 'Feedback #' + f.feedback_id;
        document.getElementById('detName').textContent = f.name;
        document.getElementById('detContact').textContent = `${f.email} / ${f.contact_number || 'N/A'}`;
        document.getElementById('detSubject').textContent = f.subject || 'No Subject';
        document.getElementById('detDate').textContent = new Date(f.created_at).toLocaleString();
        document.getElementById('detMessage').textContent = f.message;

        // Render Escalation History
        const timeline = document.getElementById('escalationTimeline');
        if (f.escalations && f.escalations.length > 0) {
            timeline.innerHTML = f.escalations.map(e => `
                <div style="border-left: 2px solid var(--primary); padding-left: 15px; margin-bottom: 15px; position: relative;">
                    <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background: var(--primary); border-radius: 50%;"></div>
                    <strong>${e.action}</strong> <small class="text-muted">on ${new Date(e.created_at).toLocaleString()}</small><br>
                    <span style="font-size: 13px;">By: ${e.escalator ? e.escalator.name : 'System'} ${e.escalatee ? '→ To: ' + e.escalatee.name : ''}</span><br>
                    <p style="font-size: 13px; color: var(--text-secondary); font-style: italic;">"${e.notes || 'No notes'}"</p>
                </div>
            `).join('');
        } else {
            timeline.innerHTML = '<p class="text-muted" style="font-size: 13px;">No history recorded.</p>';
        }

        // Setup Buttons in Modal
        const esBtn = document.getElementById('modalEscalateBtn');
        const resBtn = document.getElementById('modalResolveBtn');

        if (f.status === 'Resolved') {
            esBtn.style.display = 'none';
            resBtn.style.display = 'none';
        } else {
            esBtn.style.display = 'block';
            resBtn.style.display = 'block';
            esBtn.onclick = () => { closeModal(); escalateFeedback(f.id); };
            resBtn.onclick = () => { closeModal(); resolveFeedback(f.id); };
        }

        document.getElementById('feedbackModal').classList.add('active');
    } catch (err) {
        console.error('Error fetching details:', err);
    }
}

function closeModal() {
    document.getElementById('feedbackModal').classList.remove('active');
}

async function escalateFeedback(id) {
    const notes = prompt("Enter escalation notes:");
    if (notes === null) return;

    try {
        const res = await fetch(`/api/feedback/${id}/escalate`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ escalated_to: 1, notes }) // Assign to Admin by default
        });
        if (res.ok) loadFeedback(currentPage);
    } catch (e) { console.error(e); }
}

async function resolveFeedback(id) {
    const notes = prompt("Resolution notes:");
    if (notes === null) return;

    try {
        const res = await fetch(`/api/feedback/${id}/resolve`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes })
        });
        if (res.ok) loadFeedback(currentPage);
    } catch (e) { console.error(e); }
}
