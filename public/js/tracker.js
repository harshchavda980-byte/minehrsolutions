(function () {
  'use strict';

  const VISITOR_KEY = 'mhr_visitor_id';
  const SESSION_KEY = 'mhr_session_id';
  const EMAIL_KEY = 'mhr_email';
  const HEARTBEAT_INTERVAL = 15000; // 15s

  function genId(prefix = '') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return prefix + Math.random().toString(36).slice(2, 10);
  }

  let visitor_id = localStorage.getItem(VISITOR_KEY);
  if (!visitor_id) {
    visitor_id = genId('v-');
    try { localStorage.setItem(VISITOR_KEY, visitor_id); } catch (e) { /* ignore */ }
  }

  let session_id = sessionStorage.getItem(SESSION_KEY);
  if (!session_id) {
    session_id = genId('s-');
    try { sessionStorage.setItem(SESSION_KEY, session_id); } catch (e) { /* ignore */ }
  }

  function normalizeEmail(value) {
    if (!value) return null;
    const email = String(value).trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
  }

  function getKnownEmail() {
    try {
      return normalizeEmail(localStorage.getItem(EMAIL_KEY));
    } catch (e) {
      return null;
    }
  }

  function saveKnownEmail(email) {
    const normalized = normalizeEmail(email);
    if (!normalized) return null;
    try { localStorage.setItem(EMAIL_KEY, normalized); } catch (e) { /* ignore */ }
    return normalized;
  }

  function send(payload, options = {}) {
    try {
      const url = '/api/track';
      const body = JSON.stringify(payload);
      // Prefer sendBeacon for unload reliability
      if (options.useBeacon && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
        return;
      }
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: !!options.useBeacon }).catch(() => {});
    } catch (e) {
      // swallow
    }
  }

  function track(event_type, event_name = null, meta = {}) {
    const page = window.location.pathname + window.location.search;
    const knownEmail = getKnownEmail();
    const enrichedMeta = Object.assign({}, meta, {
      host: window.location.hostname,
      full_url: window.location.href,
      email: meta.email || knownEmail || null
    });
    const payload = {
      visitor_id,
      session_id,
      event_type,
      event_name,
      page,
      email: knownEmail || null,
      meta: enrichedMeta
    };
    send(payload);
  }

  // Session start
  track('session_start', null, { userAgent: navigator.userAgent });

  // Page view
  track('page_view', window.document.title || 'page_view', { referrer: document.referrer || null });

  // Heartbeat to keep session alive and update last seen
  const hb = setInterval(() => track('heartbeat'), HEARTBEAT_INTERVAL);

  // Click tracking (only for elements with data-track or common CTA classes)
  document.addEventListener('click', function (e) {
    try {
      const el = e.target.closest && e.target.closest('[data-track], .nav-cta-btn, .btn-service-primary, .btn-hero-primary, .btn-cta-primary, a');
      if (!el) return;
      const name = el.getAttribute('data-track') || (el.textContent || el.innerText || '').trim().slice(0, 120) || el.tagName.toLowerCase();
      const href = el.getAttribute && el.getAttribute('href');
      track('click', name, { href: href || null });
    } catch (err) {}
  }, true);

  // Form submit tracking with optional email attribution for activity history.
  document.addEventListener('submit', function (e) {
    try {
      const form = e.target;
      if (!form || !form.tagName || form.tagName.toLowerCase() !== 'form') return;
      const fid = form.getAttribute('id') || form.getAttribute('name') || 'form';
      const emailInput = form.querySelector('input[type="email"], input[name="email"], input[name="Email"], input[name="contact_email"]');
      const email = saveKnownEmail(emailInput && emailInput.value ? emailInput.value : null);
      track('form_submit', fid, { method: form.method || 'post', email: email || null });
    } catch (err) {}
  }, true);

  // On page unload, send session_end
  function handleUnload() {
    try {
      clearInterval(hb);
      track('session_end', null, {});
      // attempt to send final beacon
      send({ visitor_id, session_id, event_type: 'session_end' }, { useBeacon: true });
    } catch (e) {}
  }
  window.addEventListener('beforeunload', handleUnload);
  window.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') handleUnload();
  });

})();
