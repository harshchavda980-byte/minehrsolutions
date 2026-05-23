// Training Dashboard Logic
let allTrainingCompanies = [];

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    fetchTrainingData();
    
    // Search listener
    document.getElementById('trainingSearch').addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        const filtered = allTrainingCompanies.filter(c => c.name.toLowerCase().includes(val));
        renderTrainingTable(filtered);
    });
});

async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) { window.location.href = '/login'; return; }
        const user = await res.json();
        
        // Update header profile details
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const menuNameEl = document.getElementById('profileMenuName');
        const menuEmailEl = document.getElementById('profileMenuEmail');
        const avatarEl = document.getElementById('userAvatar');

        if (userNameEl) userNameEl.innerText = user.name || 'Admin';
        if (userRoleEl) userRoleEl.innerText = user.role || 'Super Admin';
        if (menuNameEl) menuNameEl.innerText = user.name || 'Admin';
        if (menuEmailEl) menuEmailEl.innerText = user.email || 'admin@minehr.com';
        if (avatarEl) avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'A')}&background=6366f1&color=fff`;
        
    } catch (err) {
        console.error('Auth check error:', err);
    }
}

async function fetchTrainingData() {
    try {
        const response = await fetch('/api/onboarding?limit=1000'); // Fetch more for stats
        const data = await response.json();
        if (data.success) {
            allTrainingCompanies = data.data;
            renderTrainingTable(allTrainingCompanies);
            updateTrainingStats(allTrainingCompanies);
        }
    } catch (error) {
        console.error('Error fetching training data:', error);
    }
}

function updateTrainingStats(companies) {
    // 1. Top KPI Stats
    const totalCount = companies.length;
    let completedCount = 0;
    let respondingCount = 0;
    
    // Detailed stats trackers
    let emailSent = 0, waGroup = 0;
    let visitCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    let setupDone = 0;
    
    // Product Training stats
    let pt_hr_comp = 0, pt_it_comp = 0, pt_pay_comp = 0, pt_adm_comp = 0;

    companies.forEach(c => {
        const ob = c.onboarding || {};
        const totalVisits = (ob.hr_training_status || 0) + (ob.it_training_status || 0) + (ob.payroll_training_status || 0) + (ob.admin_training_status || 0);
        
        if (totalVisits >= 20) completedCount++;
        if (ob.responding_status === 'Not Responding') respondingCount++;
        if (ob.welcome_email_sent_at) emailSent++;
        if (ob.whatsapp_created_at) waGroup++;
        if (ob.setup_status === 'Done') setupDone++;

        // Highest visit reached across any module
        const maxV = Math.max(ob.hr_training_status || 0, ob.it_training_status || 0, ob.payroll_training_status || 0, ob.admin_training_status || 0);
        if (maxV >= 1) visitCounts[1]++;
        if (maxV >= 2) visitCounts[2]++;
        if (maxV >= 3) visitCounts[3]++;
        if (maxV >= 4) visitCounts[4]++;
        if (maxV >= 5) visitCounts[5]++;
        if (maxV >= 6) visitCounts[6]++;

        // Individual module completion
        if (ob.hr_training_status >= 5) pt_hr_comp++;
        if (ob.it_training_status >= 5) pt_it_comp++;
        if (ob.payroll_training_status >= 5) pt_pay_comp++;
        if (ob.admin_training_status >= 5) pt_adm_comp++;
    });

    // POPULATE UI
    
    // KPI
    document.getElementById('totalTraining').textContent = totalCount;
    document.getElementById('completedTraining').textContent = completedCount;
    document.getElementById('pendingTraining').textContent = totalCount - completedCount;

    // Implementation Status Grid
    const updateCard = (id_prefix, run, comp, pend) => {
        if (document.getElementById(`run_${id_prefix}`)) document.getElementById(`run_${id_prefix}`).textContent = run;
        if (document.getElementById(`comp_${id_prefix}`)) document.getElementById(`comp_${id_prefix}`).textContent = comp;
        if (document.getElementById(`pend_${id_prefix}`)) document.getElementById(`pend_${id_prefix}`).textContent = pend;
    };

    updateCard('all', totalCount - completedCount, completedCount, totalCount - completedCount); // Simplified
    updateCard('email', totalCount - emailSent, emailSent, totalCount - emailSent);
    updateCard('wa', totalCount - waGroup, waGroup, totalCount - waGroup);
    updateCard('data', totalCount - setupDone, setupDone, totalCount - setupDone);
    
    // Visit Cards
    [1,2,3,4,5,6].forEach(i => {
        updateCard(`v${i}`, 0, visitCounts[i], totalCount - visitCounts[i]);
    });
    
    // Not Responding
    document.getElementById('total_not_resp').textContent = respondingCount;

    // Data Receive Dashboard
    document.getElementById('total_sessions').textContent = totalCount; // Placeholder for total sessions
    document.getElementById('comp_sessions').textContent = setupDone;
    document.getElementById('pend_sessions').textContent = totalCount - setupDone;
    document.getElementById('total_comp_count').textContent = totalCount;
    document.getElementById('comp_setup_comp').textContent = setupDone;
    document.getElementById('pend_setup_comp').textContent = totalCount - setupDone;

    // Product Training Dashboard
    document.getElementById('total_train_meetings').textContent = totalCount * 4; // Mock meeting total
    document.getElementById('comp_train_meetings').textContent = pt_hr_comp + pt_it_comp + pt_pay_comp + pt_adm_comp;
    document.getElementById('pend_train_meetings').textContent = (totalCount * 4) - (pt_hr_comp + pt_it_comp + pt_pay_comp + pt_adm_comp);

    // PT Progress Cards
    updateCard('pt_all', totalCount - completedCount, completedCount, totalCount - completedCount);
    updateCard('pt_hr', totalCount - pt_hr_comp, pt_hr_comp, totalCount - pt_hr_comp);
    updateCard('pt_owner', totalCount, 0, totalCount); // Placeholder logic
    updateCard('pt_leader', totalCount, 0, totalCount);
    updateCard('pt_emp', totalCount, 0, totalCount);

    // Data Receive specific cards
    updateCard('dr_all', totalCount - setupDone, setupDone, totalCount - setupDone);
    updateCard('dr_s1', totalCount - setupDone, setupDone, totalCount - setupDone);
}

function renderTrainingTable(companies) {
    const tbody = document.getElementById('trainingMainRows');
    tbody.innerHTML = '';

    companies.forEach((item, index) => {
        const tr = document.createElement('tr');
        const ob = item.onboarding || {};
        
        const getModStatus = (val) => {
            let color = '#64748b'; // Pending
            let label = 'Pending';
            if (val >= 5) { color = '#10b981'; label = 'Completed'; }
            else if (val > 0) { color = '#3b82f6'; label = `Visit ${val}`; }
            return `<span style="background:${color}15; color:${color}; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">${label}</span>`;
        };

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td style="font-weight:700; color:var(--primary-ob);">${item.id}</td>
            <td style="font-weight:700; color:var(--text-primary);">${item.name}</td>
            <td style="text-align:center;">${getModStatus(ob.hr_training_status || 0)}</td>
            <td style="text-align:center;">${getModStatus(ob.it_training_status || 0)}</td>
            <td style="text-align:center;">${getModStatus(ob.payroll_training_status || 0)}</td>
            <td style="text-align:center;">${getModStatus(ob.admin_training_status || 0)}</td>
            <td style="text-align:center;">
                <button class="btn-ob btn-ob-primary" data-id="${item.id}" data-name="${item.name.replace(/"/g,'&quot;')}" onclick="if(window.openTrainingModal) window.openTrainingModal(this.dataset.id, this.dataset.name)" style="padding:5px 12px; font-size:10px;">
                    View Progress
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function exportTrainingReport() {
    alert('Exporting Training Report...');
}

function filterTrainingReport(type) {
    // 1. Highlight the relevant box (UI feedback)
    const cards = document.querySelectorAll('.status-card');
    cards.forEach(c => c.style.background = 'rgba(255,255,255,0.03)');
    
    // Find the clicked card and highlight it
    const event = window.event;
    if (event && event.currentTarget) {
        event.currentTarget.style.background = 'rgba(99,102,241,0.1)';
    }

    // 2. Filter the table
    let filtered = allTrainingCompanies;
    if (type !== 'All') {
        // Logic to filter based on type (for now we mock the filter)
        filtered = allTrainingCompanies.filter((_, i) => i % 2 === 0);
    }
    renderTrainingTable(filtered);

    // 3. Scroll to report section
    const reportSection = document.querySelector('.ob-card');
    reportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Update table subtitle to show what's being viewed
    const subtitle = document.querySelector('.ob-card-header p');
    subtitle.innerHTML = `<span style="color:var(--primary-ob); font-weight:800;">Viewing: ${type}</span> - Showing ${filtered.length} companies`;
}

// Re-using Modal logic (normally this would be in a shared utils file)
// For now, I'll copy the core parts or reference the global functions if available
function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}
