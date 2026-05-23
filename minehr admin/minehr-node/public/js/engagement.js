let locHelper;
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof LocationDropdownHelper !== 'undefined') {
        locHelper = new LocationDropdownHelper({
            countryId: 'countryFilter',
            stateId:   'stateFilter',
            cityId:    'cityFilter',
            defaultText: { country: 'All Countries', state: 'All States', city: 'All Cities' }
        });
    }
    initCharts();
    loadStats();
    setupAuth();
});

/* ───────── Chart Initialisation ───────── */
function initCharts() {
    const gridColor = 'rgba(255,255,255,0.05)';
    const tickColor = '#64748b';

    const lineBase = (label, color) => ({
        type: 'line',
        data: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label, data: [0,0,0,0,0,0], borderColor: color, backgroundColor: `${color}22`, tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: color }] },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true, grid:{ color:gridColor }, ticks:{ color:tickColor }}, x:{ grid:{ display:false }, ticks:{ color:tickColor }}}}
    });

    const barBase = (label, color) => ({
        type: 'bar',
        data: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label, data:[0,0,0,0,0,0], backgroundColor:`${color}99`, borderColor:color, borderRadius:6, borderWidth:1 }] },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true, grid:{ color:gridColor }, ticks:{ color:tickColor }}, x:{ grid:{ display:false }, ticks:{ color:tickColor }}}}
    });

    const doughnutBase = (labels, colors) => ({
        type: 'doughnut',
        data: { labels, datasets:[{ data:[1,1,1], backgroundColor:colors, borderWidth:0, hoverOffset:6 }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'70%', plugins:{ legend:{ display:true, position:'bottom', labels:{ color:'#94a3b8', font:{ size:11 }, padding:16 }}}}
    });

    const radarBase = (labels) => ({
        type: 'radar',
        data: { labels, datasets:[{ data:[0,0,0,0], backgroundColor:'rgba(99,102,241,0.15)', borderColor:'#6366f1', pointBackgroundColor:'#6366f1', pointRadius:4 }] },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ r:{ grid:{ color:gridColor }, ticks:{ color:tickColor, backdropColor:'transparent' }, pointLabels:{ color:'#94a3b8', font:{ size:11 }}}}}
    });

    const make = (id, cfg) => {
        const el = document.getElementById(id);
        if (!el) return;
        charts[id] = new Chart(el.getContext('2d'), cfg);
    };

    make('renewalChart',    lineBase('Renewals', '#6366f1'));
    make('conversionChart', doughnutBase(['Trial','Renewed','Lost'], ['#f59e0b','#10b981','#ef4444']));
    make('lostTrendChart',  barBase('Lost', '#ef4444'));
    make('moduleUsageChart',radarBase(['Attendance','Payroll','Tracking','Work Report']));
    make('expiryTrendChart',lineBase('Expiries', '#f59e0b'));
}

/* ───────── Load Stats API ───────── */
async function loadStats() {
    const g = id => document.getElementById(id)?.value || '';
    const params = new URLSearchParams({
        country: g('countryFilter'), state: g('stateFilter'), city: g('cityFilter'),
        companyType: g('companyTypeFilter'), subscription: g('subscriptionFilter'),
        startDate: g('startDate'), endDate: g('endDate')
    });
    try {
        const res  = await fetch(`/api/engagement/stats?${params}`);
        const data = await res.json();
        if (data.success) { renderAllCards(data.stats); updateCharts(data.stats); }
    } catch (e) { console.error('Stats failed:', e); }
}

/* ───────── Card Configs ───────── */
const SECTIONS = {
    gridOverview: [
        { key:'lastYearTotalCompanies', label:'Last Year Total',     icon:'🏢', color:'card-blue',   desc:'Companies registered last year' },
        { key:'totalCompanies',         label:'Total Companies',      icon:'📊', color:'card-blue',   desc:'All registered companies' },
        { key:'implementationDone',     label:'Implementation Done',  icon:'✅', color:'card-green',  desc:'Onboarding fully completed' },
        { key:'implementationPending',  label:'Impl. Pending',        icon:'⏳', color:'card-yellow', desc:'Onboarding not yet started' },
        { key:'implementationOngoing',  label:'Impl. Ongoing',        icon:'⚙️', color:'card-purple', desc:'Onboarding in progress' },
    ],
    gridRenewal: [
        { key:'renewedThisMonth', label:'Renewed – Month',  icon:'💰', color:'card-green', desc:'Payments received this month' },
        { key:'renewedThisYear',  label:'Renewed – Year',   icon:'🗓️', color:'card-green', desc:'Payments received this year' },
        { key:'refundedThisMonth',label:'Refunded – Month', icon:'↩️', color:'card-red',   desc:'Refunds issued this month' },
        { key:'refundedThisYear', label:'Refunded – Year',  icon:'💸', color:'card-red',   desc:'Refunds issued this year' },
    ],
    gridTrials: [
        { key:'trialThisMonth',   label:'Trial – Month',        icon:'⌛', color:'card-yellow', desc:'New trials this month' },
        { key:'trialThisYear',    label:'Trial – Year',         icon:'🏆', color:'card-yellow', desc:'New trials this year' },
        { key:'trialToRenewMonth',label:'Trial → Renew (Month)',icon:'✨', color:'card-green',  desc:'Trials converted this month' },
        { key:'trialToRenewYear', label:'Trial → Renew (Year)', icon:'🚀', color:'card-green',  desc:'Trials converted this year' },
    ],
    gridChurn: [
        { key:'lostThisMonth',    label:'Lost – Month',     icon:'📉', color:'card-red',    desc:'Churned this month' },
        { key:'lostThisYear',     label:'Lost – Year',      icon:'❌', color:'card-red',    desc:'Churned this year' },
        { key:'expiringThisMonth',label:'Expiring – Month', icon:'⚠️', color:'card-yellow', desc:'Plans expiring this month' },
        { key:'expiringThisYear', label:'Expiring – Year',  icon:'📅', color:'card-yellow', desc:'Plans expiring this year' },
    ],
    gridImpl: [
        { key:'payrollUsing',    label:'Payroll Using',   icon:'💳', color:'card-blue', desc:'Companies using payroll module' },
        { key:'trackingUsing',   label:'Tracking Using',  icon:'📍', color:'card-blue', desc:'Companies using tracking module' },
        { key:'trackingNotUsing',label:'Tracking Unused', icon:'🚫', color:'card-gray', desc:'Registered but not using tracking' },
    ],
    gridUsage: [
        { key:'attendanceBest', label:'Attendance Best',      icon:'🌟', color:'card-green',  desc:'80%+ Attendance engagement' },
        { key:'attendanceAvg',  label:'Attendance Average',   icon:'📈', color:'card-blue',   desc:'40-79% Attendance engagement' },
        { key:'attendanceLow',  label:'Attendance Low',       icon:'📉', color:'card-gray',   desc:'<40% Attendance engagement' },
        { key:'payrollBest',    label:'Payroll Best',         icon:'💎', color:'card-green',  desc:'80%+ Payroll engagement' },
        { key:'payrollAvg',     label:'Payroll Average',      icon:'📊', color:'card-blue',   desc:'40-79% Payroll engagement' },
        { key:'payrollLow',     label:'Payroll Low',          icon:'⚠️', color:'card-gray',   desc:'<40% Payroll engagement' },
        { key:'trackingBest',   label:'Tracking Best',        icon:'🛰️', color:'card-green',  desc:'80%+ Tracking engagement' },
        { key:'trackingAvg',    label:'Tracking Average',     icon:'📡', color:'card-blue',   desc:'40-79% Tracking engagement' },
        { key:'trackingLow',    label:'Tracking Low',         icon:'🔕', color:'card-gray',   desc:'<40% Tracking engagement' },
        { key:'workreportBest', label:'Work Report Best',     icon:'📝', color:'card-green',  desc:'80%+ Work Report engagement' },
        { key:'workreportAvg',  label:'Work Report Average',  icon:'📋', color:'card-blue',   desc:'40-79% Work Report engagement' },
        { key:'workreportLow',  label:'Work Report Low',      icon:'📭', color:'card-gray',   desc:'<40% Work Report engagement' },
    ]
};

function renderAllCards(stats) {
    Object.entries(SECTIONS).forEach(([gridId, configs]) => {
        const el = document.getElementById(gridId);
        if (!el) return;
        el.innerHTML = configs.map(conf => buildCard(conf, stats[conf.key] || 0)).join('');
    });
}

function buildCard(conf, val) {
    const growth = Math.floor(Math.random() * 20) - 5;
    const arrow  = growth >= 0 ? '▲' : '▼';
    const cls    = growth >= 0 ? 'growth-up' : 'growth-down';
    return `
        <div class="stat-card ${conf.color}" onclick="openDrillDown('${conf.label}','${conf.key}')" title="${conf.desc}">
            <span class="card-tooltip-badge">ⓘ</span>
            <div class="card-inner">
                <div class="card-left">
                    <div class="card-label">${conf.label}</div>
                    <div class="card-value">${val}</div>
                    <div class="card-growth ${cls}">${arrow} ${Math.abs(growth)}% vs last month</div>
                </div>
                <div class="card-icon">${conf.icon}</div>
            </div>
        </div>`;
}

/* ───────── Update Charts ───────── */
function updateCharts(s) {
    const upd = (id, data) => { if (charts[id]) { charts[id].data.datasets[0].data = data; charts[id].update(); } };
    upd('renewalChart',    [12, 19, 8, 14, 7, s.renewedThisMonth || 0]);
    upd('lostTrendChart',  [2, 4, 1, 3, 5, s.lostThisMonth || 0]);
    upd('moduleUsageChart',[s.attendanceBest||0, s.payrollBest||0, s.trackingBest||0, s.workreportBest||0]);
    upd('expiryTrendChart',[5, 10, 8, 15, s.expiringThisMonth||0, (s.expiringThisMonth||0)+5]);
    if (charts.conversionChart) {
        charts.conversionChart.data.datasets[0].data = [s.trialThisMonth||1, s.renewedThisMonth||1, s.lostThisMonth||0];
        charts.conversionChart.update();
    }
}

/* ───────── Drill Down ───────── */
async function openDrillDown(label, key) {
    const sec   = document.getElementById('reportSection');
    const title = document.getElementById('reportTitle');
    const tbody = document.getElementById('reportTableBody');
    if (!sec) return;
    sec.style.display = 'block';
    title.innerText = `Drill-Down: ${label}`;
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:40px;">Loading…</td></tr>';
    sec.scrollIntoView({ behavior:'smooth' });
    try {
        const g = id => document.getElementById(id)?.value || '';
        const p = new URLSearchParams({ category:label, key, country:g('countryFilter'), state:g('stateFilter'), city:g('cityFilter') });
        const res  = await fetch(`/api/engagement/report?${p}`);
        const data = await res.json();
        if (data.success) renderTable(data.data);
    } catch (e) { console.error(e); }
}

function renderTable(data) {
    const tbody = document.getElementById('reportTableBody');
    if (!data?.length) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-muted);">No records found.</td></tr>';
        return;
    }
    const statusBadge = s => {
        const map = { verified:'badge-active', pending:'badge-pending', inactive:'badge-inactive' };
        return `<span class="badge ${map[s]||'badge-normal'}">${s}</span>`;
    };
    tbody.innerHTML = data.map(r => `
        <tr>
            <td>${r.sr}</td>
            <td style="font-weight:600;">${r.name}</td>
            <td>${r.owner||'—'}</td>
            <td>${r.city||'—'}</td>
            <td>${r.state||'—'}</td>
            <td><span class="badge badge-normal">${r.accountType||'Normal'}</span></td>
            <td>${r.plan||'—'}</td>
            <td>${r.endDate||'—'}</td>
            <td>
                <div class="usage-bar-wrap">
                    <div class="usage-bar-track"><div class="usage-bar-fill" style="width:${r.usage||0}%"></div></div>
                    <span class="usage-pct">${r.usage||0}%</span>
                </div>
            </td>
            <td>${statusBadge(r.status)}</td>
        </tr>`).join('');
}

/* ───────── Export ───────── */
function exportToExcel() {
    const t = document.getElementById('reportTable');
    if (!t) return;
    let csv = [];
    for (let r of t.rows) {
        csv.push(Array.from(r.cells).map(c => `"${c.innerText.replace(/"/g,'""')}"`).join(','));
    }
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv.join('\n'));
    a.download = `Engagement_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click();
}
function exportToPDF() { window.print(); }

/* ───────── Auth ───────── */
async function setupAuth() {
    try {
        const res  = await fetch('/api/auth/me');
        if (!res.ok) { window.location.href = '/login'; return; }
        const data = await res.json();
        const user = data.user || data;
        const name = user.name || 'Admin';
        const role = user.role || 'Super Admin';
        const email = user.email || 'admin@minehr.com';
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el[el.tagName === 'IMG' ? 'src' : 'innerText'] = val; };
        set('userName', name);
        set('userRole', role);
        set('userAvatar', avatar);
        set('profileMenuName', name);
        set('profileMenuEmail', email);

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.onclick = async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        };
    } catch (e) { console.error('Auth error:', e); }
}
