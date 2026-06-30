(function () {
  'use strict';

  const hostFilterInput = document.getElementById('hostFilter');
  const reloadBtn = document.getElementById('reloadBtn');

  // Always filter to the deployed site only — never show localhost data
  hostFilterInput.value = 'www.minehrsolutions.com';

  // ── Helpers ──────────────────────────────────────────────────────────
  function getPillClass(type) {
    const map = {
      page_view: 'pill-blue',
      session_start: 'pill-green',
      session_end: 'pill-purple',
      click: 'pill-amber',
      form_submit: 'pill-red',
      heartbeat: 'pill-purple'
    };
    return map[type] || 'pill-blue';
  }

  function empty(icon, msg) {
    return `<div class="empty"><div class="empty-icon">${icon}</div>${msg}</div>`;
  }

  function renderBarList(container, items, maxCnt, greenMode) {
    if (!items || items.length === 0) return;
    container.innerHTML = '';
    items.forEach((item, i) => {
      const label = item.label || '(unknown)';
      const cnt = item.cnt || 0;
      const pct = maxCnt > 0 ? Math.round((cnt / maxCnt) * 100) : 0;
      const fillClass = greenMode ? (i === 0 ? 'green' : '') : (i === 0 ? '' : '');
      const div = document.createElement('div');
      div.className = 'bar-item';
      div.innerHTML = `
        <div class="bar-item-row">
          <span class="bar-item-label" title="${label}">${label}</span>
          <span class="bar-item-count">${cnt}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill ${greenMode ? 'green' : ''}" style="width:${pct}%"></div>
        </div>`;
      container.appendChild(div);
    });
  }

  // ── Main Load Function ───────────────────────────────────────────────
  async function loadData() {
    const host = hostFilterInput.value.trim() || 'all';

    try {
      // 1. Fetch Summary
      const summaryUrl = `/api/analytics/summary?host=${encodeURIComponent(host)}`;
      const summaryRes = await fetch(summaryUrl);
      const summaryData = await summaryRes.json();

      // Stat cards
      document.getElementById('total').textContent = summaryData.total_visitors ?? 0;
      document.getElementById('returning').textContent = summaryData.returning_visitors ?? 0;
      document.getElementById('avg').textContent = summaryData.avg_session_seconds ?? 0;
      document.getElementById('source').textContent = (summaryData.source || '—').toUpperCase();
      document.getElementById('activeHost').textContent = summaryData.host || 'all';
      document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();

      // Top Pages
      const pagesEl = document.getElementById('pages');
      const topPages = summaryData.top_pages || [];
      document.getElementById('pagesCount').textContent = `${topPages.length} page${topPages.length !== 1 ? 's' : ''}`;
      if (topPages.length === 0) {
        pagesEl.innerHTML = empty('📄', 'No page view data yet. Visit any page on your site first.');
      } else {
        const maxCnt = topPages[0].cnt || 1;
        renderBarList(pagesEl, topPages.map(p => ({ label: p.page || '/', cnt: p.cnt })), maxCnt, false);
      }

      // Top Events
      const eventsEl = document.getElementById('events');
      const topEvents = summaryData.top_events || [];
      document.getElementById('eventsCount').textContent = `${topEvents.length} event${topEvents.length !== 1 ? 's' : ''}`;
      if (topEvents.length === 0) {
        eventsEl.innerHTML = empty('⚡', 'No click or form events yet. Events are tracked automatically.');
      } else {
        const maxCnt = topEvents[0].cnt || 1;
        eventsEl.innerHTML = '';
        topEvents.forEach((e, i) => {
          const cnt = e.cnt || 0;
          const pct = maxCnt > 0 ? Math.round((cnt / maxCnt) * 100) : 0;
          const name = e.event_name || '(unnamed)';
          const typeClass = getPillClass(e.event_type);
          const div = document.createElement('div');
          div.className = 'bar-item';
          div.innerHTML = `
            <div class="bar-item-row">
              <span class="bar-item-label">
                <span class="pill ${typeClass}">${e.event_type}</span>
                &nbsp;${name}
              </span>
              <span class="bar-item-count">${cnt}</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill purple" style="width:${pct}%"></div>
            </div>`;
          eventsEl.appendChild(div);
        });
      }

      // 2. Fetch Activity
      const activityUrl = `/api/analytics/activity?host=${encodeURIComponent(host)}&limit=100`;
      const activityRes = await fetch(activityUrl);
      const activityData = await activityRes.json();

      // Captured emails count
      const byEmail = activityData.by_email || [];
      document.getElementById('emails').textContent = byEmail.length;
      document.getElementById('emailCount').textContent = `${byEmail.length} email${byEmail.length !== 1 ? 's' : ''}`;

      // Email Activity list
      const emailActivityEl = document.getElementById('emailActivity');
      if (byEmail.length === 0) {
        emailActivityEl.innerHTML = empty('📧', 'No email activity yet. Emails are captured when visitors submit contact or career forms.');
      } else {
        emailActivityEl.innerHTML = '';
        byEmail.forEach(item => {
          const initial = (item.email || '?')[0].toUpperCase();
          const div = document.createElement('div');
          div.className = 'email-row';
          div.innerHTML = `
            <div class="email-avatar">${initial}</div>
            <div class="email-info">
              <div class="email-addr">${item.email}</div>
              <div class="email-events">${item.cnt} event${item.cnt !== 1 ? 's' : ''} recorded</div>
            </div>
            <div class="email-count-badge">${item.cnt}</div>`;
          emailActivityEl.appendChild(div);
        });
      }

      // Recent Activity Log
      const items = activityData.items || [];
      document.getElementById('activityCount').textContent = `${activityData.total_items || items.length} event${(activityData.total_items || items.length) !== 1 ? 's' : ''}`;
      const activityBody = document.getElementById('activityBody');
      if (items.length === 0) {
        activityBody.innerHTML = `<tr><td colspan="6" class="empty">No events recorded yet. Visit any page on your site to start tracking.</td></tr>`;
      } else {
        activityBody.innerHTML = '';
        items.forEach(item => {
          const tr = document.createElement('tr');
          const dateStr = item.created_at ? new Date(item.created_at).toLocaleString() : '—';
          const emailVal = item.email ? `<code>${item.email}</code>` : '<span style="color:var(--muted)">—</span>';
          const pillClass = getPillClass(item.event_type);
          const eventName = item.event_name
            ? `<span style="color:var(--muted);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block">${item.event_name}</span>`
            : '<span style="color:var(--muted)">—</span>';
          tr.innerHTML = `
            <td style="white-space:nowrap;color:var(--muted);font-size:12px">${dateStr}</td>
            <td>${emailVal}</td>
            <td><span class="pill ${pillClass}">${item.event_type || '—'}</span></td>
            <td>${eventName}</td>
            <td style="color:var(--muted)">${item.page || '/'}</td>
            <td style="color:var(--muted)">${item.host || '—'}</td>`;
          activityBody.appendChild(tr);
        });
      }

    } catch (err) {
      console.error('Analytics load error:', err);
    }
  }

  // Reload button
  reloadBtn.addEventListener('click', loadData);

  // Load immediately — script is at end of <body> so DOM is already ready
  loadData();

  // Auto-refresh every 30 seconds
  setInterval(loadData, 30000);
})();
