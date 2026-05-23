/**
 * Company Plan Expiry Management Logic
 */

let allPlans = [];
let currentPage = 1;
let totalPages = 1;
const limit = 10;

document.addEventListener("DOMContentLoaded", async () => {
    const authRes = await fetch("/api/auth/me");
    if (!authRes.ok) { window.location.href = "/login"; return; }

    initFilters();
    await fetchPlans();
});

function initFilters() {
    const searchInput = document.getElementById('planSearch');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('expiryFilter');
    const filterBtn = document.querySelector('.filter-row .btn-primary');

    const triggerFilter = () => {
        currentPage = 1;
        fetchPlans();
    };

    searchInput?.addEventListener('input', debounce(triggerFilter, 500));
    statusFilter?.addEventListener('change', triggerFilter);
    dateFilter?.addEventListener('change', triggerFilter);
    filterBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        triggerFilter();
    });
}

async function fetchPlans() {
    try {
        const search = document.getElementById('planSearch')?.value || '';
        const status = document.getElementById('statusFilter')?.value || '';
        const expiryDate = document.getElementById('expiryFilter')?.value || '';

        const params = new URLSearchParams({
            page: currentPage,
            limit: limit,
            search: search,
            status: status,
            end_date: expiryDate
        });

        const res = await fetch(`/api/plans?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            allPlans = data.plans;
            totalPages = data.totalPages;
            renderPlans(allPlans);
            renderPagination();
        }
    } catch (err) {
        console.error('Error fetching plans:', err);
    }
}

function renderPlans(plans) {
    const tbody = document.getElementById('planTableBody');
    if (!tbody) return;

    if (!plans.length) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:40px;">No companies found matching the filters.</td></tr>';
        return;
    }

    tbody.innerHTML = plans.map(p => {
        const co = p.Company || {};
        const daysLeft = calculateDaysLeft(p.expiry_date);

        return `
            <tr>
                <td>#${co.id || '---'}</td>
                <td><strong style="color:var(--text-primary);">${co.name || '---'}</strong></td>
                <td>${co.contact_mobile || '---'}</td>
                <td>${p.plan_name || '---'}</td>
                <td>${p.plan_duration || '---'}</td>
                <td><span class="${daysLeft <= 7 ? 'text-danger' : ''}">${daysLeft} Days</span></td>
                <td>${p.expiry_date || '---'}</td>
                <td><span class="status-badge ${getStatusClass(p.status)}">${getStatusLabel(p.status)}</span></td>
                <td style="text-align:right;">
                    <div class="action-buttons" style="justify-content: flex-end; gap: 8px;">
                        <button class="btn-icon" onclick="viewPlanDetails(${p.id})" title="View details">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="openChangePlan(${p.id})" style="border-radius: 8px; padding: 6px 12px; font-size: 12px;">
                            Change Plan
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderPagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    let html = `
        <div class="pagination-info">Showing page ${currentPage} of ${totalPages}</div>
        <div class="pagination-controls">
            <button class="btn btn-sm ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="btn btn-sm ${i === currentPage ? 'btn-primary' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="pagination-dots">...</span>`;
        }
    }

    html += `
            <button class="btn btn-sm ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        </div>
    `;
    container.innerHTML = html;
}

function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    fetchPlans();
}

// Modals
async function viewPlanDetails(id) {
    try {
        const res = await fetch(`/api/plans/${id}/details`);
        const data = await res.json();
        if (!data.success) return;

        const p = data.plan;
        const co = p.Company || {};

        const content = `
            <div class="details-grid">
                <div class="details-section">
                    <h4>Company Information</h4>
                    <p><strong>Name:</strong> ${co.name}</p>
                    <p><strong>Mobile:</strong> ${co.contact_mobile || '---'}</p>
                    <p><strong>Status:</strong> ${co.status}</p>
                </div>
                <div class="details-section">
                    <h4>Current Plan</h4>
                    <p><strong>Plan:</strong> ${p.plan_name}</p>
                    <p><strong>Duration:</strong> ${p.plan_duration || '---'}</p>
                    <p><strong>Expiry:</strong> ${p.expiry_date}</p>
                </div>
            </div>
            <div class="details-history" style="margin-top:20px;">
                <h4>Renewal History</h4>
                <div class="history-table-wrapper" style="max-height: 200px; overflow-y: auto;">
                    <table class="admin-table mini-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Old Plan</th>
                                <th>New Plan</th>
                                <th>New Expiry</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(p.plan_history || []).reverse().map(h => `
                                <tr>
                                    <td>${formatDate(h.updated_at)}</td>
                                    <td>${h.old_plan || '---'}</td>
                                    <td>${h.new_plan || '---'}</td>
                                    <td>${h.new_expiry || '---'}</td>
                                </tr>
                            `).join('') || '<tr><td colspan="4" style="text-align:center;">No history available</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="details-payment" style="margin-top:20px;">
                <h4>Last Payment Details</h4>
                <p>${p.payment_details ? JSON.stringify(p.payment_details) : 'No payment data recorded.'}</p>
            </div>
        `;

        showModal('Plan Details', content);
    } catch (err) {
        console.error('Error viewing details:', err);
    }
}

function openChangePlan(id) {
    const p = allPlans.find(item => item.id === id);
    if (!p) return;

    // Use current local date as default if existing plan is expired or missing
    const today = new Date();
    const formatDate = (date) => {
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    };
    const todayStr = formatDate(today);
    const initialExpiry = (p.expiry_date && p.expiry_date >= todayStr) ? p.expiry_date : todayStr;

    const content = `
        <form id="changePlanForm" class="admin-form">
            <input type="hidden" name="id" value="${p.id}">
            <div class="form-group">
                <label>Update Plan Name</label>
                <select name="plan_name" class="form-control">
                    <option value="basic" ${p.plan_name === 'basic' ? 'selected' : ''}>Basic</option>
                    <option value="pro" ${p.plan_name === 'pro' ? 'selected' : ''}>Pro</option>
                    <option value="enterprise" ${p.plan_name === 'enterprise' ? 'selected' : ''}>Enterprise</option>
                </select>
            </div>
            <div class="form-group">
                <label>Plan Duration</label>
                <select name="plan_duration" class="form-control" id="formDurationSelect">
                    <option value="Custom">Custom</option>
                    <option value="1 Month">1 Month</option>
                    <option value="6 Month">6 Month</option>
                    <option value="1 Year">1 Year</option>
                </select>
            </div>
            <div class="form-group">
                <label>New Expiry Date</label>
                <input type="date" name="expiry_date" class="form-control" value="${initialExpiry}" required>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn btn-primary" style="flex: 1;">Update Plan</button>
                <button type="button" class="btn btn-outline" onclick="closeGenericModal()" style="flex: 1;">Cancel</button>
            </div>
        </form>
    `;

    showModal('Change Plan', content);

    // Auto-calculate expiry date based on duration
    const form = document.getElementById('changePlanForm');
    const durationSelect = document.getElementById('formDurationSelect');
    const expiryInput = form.querySelector('input[name="expiry_date"]');

    durationSelect.addEventListener('change', () => {
        const duration = durationSelect.value;
        const now = new Date();
        let expiryDate = new Date();

        if (duration === '1 Month') expiryDate.setMonth(now.getMonth() + 1);
        else if (duration === '6 Month') expiryDate.setMonth(now.getMonth() + 6);
        else if (duration === '1 Year') expiryDate.setFullYear(now.getFullYear() + 1);
        else return;

        expiryInput.value = formatDate(expiryDate);
    });

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);

        try {
            const res = await fetch(`/api/plans/${payload.id}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert('Plan updated successfully!');
                closeGenericModal();
                fetchPlans();
            } else {
                alert('Error: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Update failed:', err);
            alert('Faiied to update plan. Please try again.');
        }
    };
}

// Helpers
function getStatusClass(s) {
    if (s === 'active') return 'status-active';
    if (s === 'expiring') return 'status-warning';
    return 'status-expired';
}

function getStatusLabel(s) {
    if (s === 'active') return 'Active';
    if (s === 'expiring') return 'Expiring Soon';
    return 'Expired';
}

function calculateDaysLeft(expiryDate) {
    if (!expiryDate) return 0;

    // Split and parse manually as local date to avoid string-parsing timezone shifts
    const parts = expiryDate.includes('T') ? expiryDate.split('T')[0].split('-') : expiryDate.split('-');
    if (parts.length !== 3) return 0;

    const expiry = new Date(parts[0], parts[1] - 1, parts[2]);
    expiry.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = expiry - today;
    const days = Math.round(diff / 86400000);
    return Math.max(0, days);
}

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

function showModal(title, html) {
    let modal = document.getElementById('genericModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'genericModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content glass">
                <div class="modal-header">
                    <h2 id="genericModalTitle"></h2>
                    <button class="close-modal" onclick="closeGenericModal()">&times;</button>
                </div>
                <div class="modal-body" id="genericModalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    document.getElementById('genericModalTitle').innerText = title;
    document.getElementById('genericModalBody').innerHTML = html;
    modal.classList.add('active');
}

function closeGenericModal() {
    document.getElementById('genericModal')?.classList.remove('active');
}

async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'pt', 'a4');
    
    // 1. Add Logo & Header
    try {
        // Attempt to add logo (assuming logo.png is accessible)
        // For jspdf, we usually need base64 or a loaded image element
        const img = new Image();
        img.src = 'logo.png';
        await new Promise((resolve) => {
            img.onload = () => {
                doc.addImage(img, 'PNG', 40, 20, 100, 30);
                resolve();
            };
            img.onerror = resolve; // Continue even if logo fails
        });
    } catch (e) { console.warn("Logo load failed", e); }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241); // var(--primary)
    doc.text("Plan Expiry Management Report", 160, 42);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 160, 58);
    doc.text(`Report Type: Subscription Audit`, 160, 72);

    // 2. Watermark Logic
    const totalPagesExp = "{total_pages_count_string}";
    const addWatermark = (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(60);
            doc.setTextColor(220, 220, 220);
            doc.setFont("helvetica", "bold");
            doc.saveGraphicsState();
            doc.setGState(new doc.GState({ opacity: 0.1 }));
            doc.text("MINEHR CONFIDENTIAL", doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 2, {
                align: 'center',
                angle: 45
            });
            doc.restoreGraphicsState();
            
            // Footer
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Page ${i}`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 30);
        }
    };

    const headers = [["ID", "Company Name", "Contact Mobile", "Plan Name", "Days Left", "Expiry Date", "Status"]];
    const data = allPlans.map(p => [
        p.Company?.id || '---',
        p.Company?.name || '---',
        p.Company?.contact_mobile || '---',
        (p.plan_name || '---').toUpperCase(),
        calculateDaysLeft(p.expiry_date) + " Days",
        p.expiry_date || '---',
        (p.status || '---').toUpperCase()
    ]);

    doc.autoTable({
        head: headers,
        body: data,
        startY: 100,
        theme: 'striped',
        headStyles: { 
            fillColor: [99, 102, 241], 
            textColor: 255,
            fontSize: 11,
            fontStyle: 'bold',
            halign: 'center',
            padding: 10
        },
        bodyStyles: { 
            fontSize: 10,
            textColor: 50,
            halign: 'center'
        },
        columnStyles: {
            1: { halign: 'left', fontStyle: 'bold' } // Company Name
        },
        didDrawPage: (data) => {
            // Placeholder for watermark if needed per page
        }
    });

    addWatermark();

    doc.save(`MineHR_Plan_Expiry_${new Date().toISOString().slice(0,10)}.pdf`);
}

async function exportToExcel() {
    if (!allPlans.length) return alert("No data available to export.");
    
    const headers = [["MineHR Plan Expiry Report"], ["Generated:", new Date().toLocaleString()], []];
    const columnHeaders = ["ID", "Company Name", "Contact Mobile", "Plan Name", "Duration", "Days Left", "Expiry Date", "Status"];
    
    const dataRows = allPlans.map(p => [
        p.Company?.id,
        p.Company?.name,
        p.Company?.contact_mobile,
        p.plan_name,
        p.plan_duration,
        calculateDaysLeft(p.expiry_date),
        p.expiry_date,
        p.status
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet(headers.concat([columnHeaders]).concat(dataRows));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plan Expiry");
    
    // Auto-size columns
    const wscols = [
        {wch: 10}, {wch: 30}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 12}, {wch: 15}, {wch: 15}
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `MineHR_Plan_Expiry_${new Date().toISOString().slice(0,10)}.xlsx`);
}
