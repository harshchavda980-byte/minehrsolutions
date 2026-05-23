/**
 * ATS Analytics & Reports Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth & User Load
    const authRes = await fetch('/api/auth/me');
    if (!authRes.ok) { window.location.href = '/login'; return; }
    const user = await authRes.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userRole').innerText = user.role;
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

    // 2. Load Metrics
    loadMetrics();
});

async function loadMetrics() {
    try {
        const res = await fetch('/api/ats/reports/metrics');
        const data = await res.json();
        if (data.success) {
            renderStatusChart(data.statusCounts);
            renderJobChart(data.jobCounts);
            renderTrendChart(data.trend);
        }
    } catch (e) { console.error(e); }
}

function renderStatusChart(counts) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: counts.map(c => c.status),
            datasets: [{
                data: counts.map(c => c.count),
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function renderJobChart(counts) {
    const ctx = document.getElementById('jobChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: counts.map(c => c.job.title),
            datasets: [{
                label: 'Applications',
                data: counts.map(c => c.count),
                backgroundColor: '#6366f1'
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderTrendChart(trend) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: trend.map(t => t.month),
            datasets: [{
                label: 'New Applications',
                data: trend.map(t => t.count),
                borderColor: '#6366f1',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}

function exportData(type) {
    alert(`Generating recruitment report in ${type} format. This feature is integrated with the reporting engine.`);
}
