/**
 * Tickets Module Logic
 */

let allTickets = [];
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

    // 2. Load Tickets
    await loadTickets(1);
});

async function loadTickets(page = 1) {
    currentPage = page;
    const priority = document.getElementById('priorityFilter').value;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchInput').value;

    let url = `/api/tickets?page=${page}&limit=${recordsPerPage}`;
    if (priority) url += `&priority=${priority}`;
    if (status) url += `&status=${status}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        allTickets = data.tickets;
        renderTable(allTickets);
        renderPagination(data.pages, data.currentPage);
    } catch (err) {
        console.error('Failed to load tickets:', err);
    }
}

function renderTable(tickets) {
    const tableBody = document.getElementById('ticketsTableBody');
    if (!tableBody) return;

    if (!tickets.length) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color: var(--text-muted);">No tickets found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = tickets.map(t => `
        <tr class="priority-${t.priority.toLowerCase()}">
            <td style="font-weight: 600;">#${t.ticket_id}</td>
            <td><strong>${t.title}</strong></td>
            <td><span class="badge ${getPriorityBadge(t.priority)}">${t.priority}</span></td>
            <td>${t.company ? t.company.name : '<span class="text-muted">General</span>'}</td>
            <td>${t.assignee ? t.assignee.name : '<span class="text-muted">Unassigned</span>'}</td>
            <td><span class="badge ${getStatusBadge(t.status)}">${t.status}</span></td>
            <td>${formatDate(t.created_at)}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm" onclick="viewTicket(${t.id})">View</button>
                    ${t.status !== 'Closed' ? `<button class="btn btn-primary btn-sm" onclick="updateStatus(${t.id})">Status</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPagination(totalPages, activePage) {
    const controls = document.getElementById('paginationControls');
    if (!controls) return;

    let html = `<button onclick="loadTickets(${activePage - 1})" ${activePage === 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${activePage === i ? 'active' : ''}" onclick="loadTickets(${i})">${i}</button>`;
    }
    html += `<button onclick="loadTickets(${activePage + 1})" ${activePage === totalPages ? 'disabled' : ''}>Next</button>`;
    controls.innerHTML = html;
}

function getPriorityBadge(priority) {
    if (priority === 'Critical') return 'badge-danger';
    if (priority === 'High') return 'badge-warning';
    if (priority === 'Medium') return 'badge-info';
    return 'badge-success';
}

function getStatusBadge(status) {
    if (status === 'Open') return 'badge-info';
    if (status === 'In Progress') return 'badge-warning';
    if (status === 'Resolved') return 'badge-success';
    return 'badge-danger';
}

function filterTickets() {
    loadTickets(1);
}

async function updateStatus(id) {
    const newStatus = prompt("Enter new status (In Progress, Resolved, Closed):");
    if (!newStatus) return;

    const notes = prompt("Enter any update notes:");

    try {
        const res = await fetch(`/api/tickets/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, notes })
        });
        if (res.ok) {
            loadTickets(currentPage);
        } else {
            alert("Failed to update status");
        }
    } catch (err) {
        console.error(err);
    }
}

function viewTicket(id) {
    alert("Full Details for Ticket #" + id + "\n(Logic for detailed view is being implemented)");
}
