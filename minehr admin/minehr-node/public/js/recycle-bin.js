document.addEventListener('DOMContentLoaded', () => {
    initRecycleBin();
});

let currentCategory = 'All';
let selectedItems = [];

async function initRecycleBin() {
    setupFilters();
    loadBinData();
    setupBulkActions();
}

function setupFilters() {
    const categoryPills = document.querySelectorAll('.category-pill');
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.dataset.category;
            loadBinData();
        });
    });

    document.getElementById('applyFilters').addEventListener('click', () => {
        loadBinData();
    });

    document.getElementById('binSearch').addEventListener('input', debounce(() => {
        loadBinData();
    }, 500));
}

async function loadBinData() {
    const tbody = document.getElementById('recycleBinTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = `<tr><td colspan="10" class="text-center" style="padding: 100px;">
        <div class="spinner-border text-primary" role="status"></div>
        <p style="margin-top: 15px; color: var(--text-muted);">Fetching your deleted records...</p>
    </td></tr>`;

    try {
        const search = document.getElementById('binSearch').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const moduleType = document.getElementById('moduleFilter').value;

        const params = new URLSearchParams({
            category: currentCategory,
            search,
            dateFrom,
            dateTo,
            module: moduleType
        });

        const res = await fetch(`/api/recycle-bin?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            renderBinTable(data.items);
            updateSummaryCounters(data.items);
        } else {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center" style="padding: 60px; color: #ef4444;">Error loading data: ${data.message}</td></tr>`;
        }
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="10" class="text-center" style="padding: 60px; color: #ef4444;">Failed to connect to server.</td></tr>`;
    }
}

function renderBinTable(items) {
    const tbody = document.getElementById('recycleBinTableBody');
    if (!items || items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center" style="padding: 80px; color: var(--text-muted);">
            <div style="font-size: 40px; margin-bottom: 10px;">🗑️</div>
            <p>No deleted records found in this category.</p>
        </td></tr>`;
        return;
    }

    tbody.innerHTML = items.map(item => {
        // Robust Date Handling
        const delDateRaw = item.deleted_at || item.createdAt;
        const delDate = delDateRaw ? new Date(delDateRaw) : null;
        
        // Calculate Purge Date (Fallback to 15 days from deletion if purge_at is missing)
        let purgeDate = item.purge_at ? new Date(item.purge_at) : null;
        if (!purgeDate && delDate) {
            purgeDate = new Date(delDate.getTime() + 15 * 24 * 60 * 60 * 1000);
        }

        const now = new Date();
        let diffDays = 0;
        if (purgeDate && !isNaN(purgeDate.getTime())) {
            diffDays = Math.max(0, Math.ceil((purgeDate - now) / (1000 * 60 * 60 * 24)));
        }
        
        let daysColor = 'var(--text-secondary)';
        if (diffDays <= 3) daysColor = '#ef4444';
        else if (diffDays <= 7) daysColor = '#f59e0b';

        // Deleted By Formatting
        let deletedByName = 'System';
        if (item.deletedByUser && item.deletedByUser.name) {
            deletedByName = item.deletedByUser.name;
        } else if (item.deleted_by) {
            deletedByName = `Admin #${item.deleted_by}`;
        }

        return `
            <tr>
                <td><input type="checkbox" class="item-checkbox" data-id="${item.id}" data-type="${item.type}" onchange="updateSelectedItems()"></td>
                <td><span class="recycle-item-type type-${item.type.toLowerCase()}">${item.type}</span></td>
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 700; font-size: 14px;">${item.name || 'Unnamed Record'}</span>
                        <span style="font-size: 11px; color: var(--text-muted);">#${item.id}</span>
                    </div>
                </td>
                <td>${item.company_name || 'N/A'}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--glass-bg); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--primary);">
                            ${deletedByName.charAt(0)}
                        </div>
                        <span style="font-size: 13px;">${deletedByName}</span>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 13px;">${window.formatDate(delDate)}</span>
                        <span style="font-size: 10px; color: var(--text-muted);">${delDate ? delDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                    </div>
                </td>
                <td>
                    <div class="purge-info">
                        <span style="color: ${daysColor}">${diffDays} Days</span>
                        <div class="purge-progress-bar">
                            <div class="purge-progress-fill" style="width: ${(Math.min(15, diffDays)/15)*100}%; background: ${daysColor}"></div>
                        </div>
                    </div>
                </td>
                <td><span class="status-badge pending">${item.status || 'Pending'}</span></td>
                <td style="text-align: right;">
                    <div class="action-btns">
                        <button class="btn-icon restore" onclick="restoreItem('${item.type}', ${item.id})" title="Restore Record">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                        </button>
                        <button class="btn-icon delete" onclick="confirmPermDelete('${item.type}', ${item.id}, '${item.name}')" title="Delete Permanently">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateSummaryCounters(items) {
    const totalCount = items.length;
    const criticalCount = items.filter(i => {
        const purgeDate = new Date(i.purge_at || new Date(new Date(i.deleted_at).getTime() + 15 * 24 * 60 * 60 * 1000));
        const diffDays = Math.ceil((purgeDate - new Date()) / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
    }).length;

    const totalEl = document.getElementById('totalDeletedCount');
    const criticalEl = document.getElementById('criticalDeletedCount');
    if (totalEl) totalEl.innerText = totalCount;
    if (criticalEl) criticalEl.innerText = criticalCount;
}

function setupBulkActions() {
    const selectAll = document.getElementById('selectAll');
    if (!selectAll) return;

    selectAll.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
        updateSelectedItems();
    });

    document.getElementById('bulkRestore')?.addEventListener('click', async () => {
        if (selectedItems.length === 0) return;
        if (!confirm(`Restore ${selectedItems.length} selected items?`)) return;

        try {
            const res = await fetch('/api/recycle-bin/bulk-restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: selectedItems })
            });
            const data = await res.json();
            if (data.success) {
                showToast('Records restored successfully');
                loadBinData();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (err) { console.error(err); }
    });

    document.getElementById('bulkDelete')?.addEventListener('click', async () => {
        if (selectedItems.length === 0) return;
        if (!confirm(`Are you absolutely sure? These ${selectedItems.length} records will be PERMANENTLY deleted and cannot be recovered.`)) return;

        try {
            const res = await fetch('/api/recycle-bin/bulk-permanent-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: selectedItems })
            });
            const data = await res.json();
            if (data.success) {
                showToast('Records permanently deleted');
                loadBinData();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (err) { console.error(err); }
    });
}

function updateSelectedItems() {
    const checkboxes = document.querySelectorAll('.item-checkbox:checked');
    selectedItems = Array.from(checkboxes).map(cb => ({
        id: cb.dataset.id,
        type: cb.dataset.type
    }));

    const toolbar = document.getElementById('bulkActionToolbar');
    const countDisplay = document.getElementById('selectedCountText');
    
    if (toolbar && countDisplay) {
        if (selectedItems.length > 0) {
            toolbar.classList.add('visible');
            countDisplay.innerText = `${selectedItems.length} items selected`;
        } else {
            toolbar.classList.remove('visible');
        }
    }
}

async function restoreItem(type, id) {
    if (!confirm(`Are you sure you want to restore this ${type}? All related data will also be recovered.`)) return;

    try {
        const res = await fetch('/api/recycle-bin/restore', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, id })
        });
        const data = await res.json();
        if (data.success) {
            showToast(`${type} restored successfully`);
            loadBinData();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) { console.error(err); }
}

function confirmPermDelete(type, id, name) {
    if (!confirm(`WARNING: Are you sure you want to PERMANENTLY delete "${name}"? This action CANNOT be undone.`)) return;

    permanentDelete(type, id);
}

async function permanentDelete(type, id) {
    try {
        const res = await fetch('/api/recycle-bin/permanent-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, id })
        });
        const data = await res.json();
        if (data.success) {
            showToast('Item permanently deleted');
            loadBinData();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) { console.error(err); }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message) {
    // Basic alert for now, can be replaced with a premium toast UI
    alert(message);
}
