require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serve assets (css, js, images) from public
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve root files (so requests like /index.html, /admin/analytics can be served
// from the filesystem without adding a route for every single page)
app.use(express.static(path.join(__dirname)));

// Serve admin static files (also allow requests without .html extension)
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve HTML pages from root
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/contact.html', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/blog.html', (req, res) => res.sendFile(path.join(__dirname, 'blog.html')));
app.get('/blog-detail.html', (req, res) => res.sendFile(path.join(__dirname, 'blog-detail.html')));
app.get('/ats.html', (req, res) => res.sendFile(path.join(__dirname, 'ats.html')));
app.get('/crm.html', (req, res) => res.sendFile(path.join(__dirname, 'crm.html')));
app.get('/career.html', (req, res) => res.sendFile(path.join(__dirname, 'career.html')));
app.get('/services.html', (req, res) => res.sendFile(path.join(__dirname, 'services.html')));
app.get('/trust.html', (req, res) => res.sendFile(path.join(__dirname, 'trust.html')));
app.get('/ems.html', (req, res) => res.sendFile(path.join(__dirname, 'ems.html')));

// Serve HTML pages from services directory
app.get('/services/ems.html', (req, res) => res.sendFile(path.join(__dirname, 'services/ems.html')));
app.get('/services/crm-solutions.html', (req, res) => res.sendFile(path.join(__dirname, 'services/crm-solutions.html')));
app.get('/services/custom-software.html', (req, res) => res.sendFile(path.join(__dirname, 'services/custom-software.html')));
app.get('/services/hr-services.html', (req, res) => res.sendFile(path.join(__dirname, 'services/hr-services.html')));
app.get('/services/hrms-software.html', (req, res) => res.sendFile(path.join(__dirname, 'services/hrms-software.html')));
app.get('/services/it-support.html', (req, res) => res.sendFile(path.join(__dirname, 'services/it-support.html')));
app.get('/services/logo-branding.html', (req, res) => res.sendFile(path.join(__dirname, 'services/logo-branding.html')));
app.get('/services/payroll-management.html', (req, res) => res.sendFile(path.join(__dirname, 'services/payroll-management.html')));
app.get('/services/recruitment-staffing.html', (req, res) => res.sendFile(path.join(__dirname, 'services/recruitment-staffing.html')));
app.get('/services/web-development.html', (req, res) => res.sendFile(path.join(__dirname, 'services/web-development.html')));
app.get('/services/employee-relations.html', (req, res) => res.sendFile(path.join(__dirname, 'services/employee-relations.html')));
app.get('/services/hr-solutions.html', (req, res) => res.redirect('/services/hr-services.html'));

// MySQL connection (uses .env for TiDB Cloud, fallback to localhost for local dev)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'minehr'
};

// Add SSL for TiDB Cloud
if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  };
}

const db = mysql.createConnection(dbConfig);
let analyticsDbReady = false;

const fallbackAnalytics = {
  visitors: new Map(),
  sessions: new Map(),
  pageViews: new Map(),
  events: new Map(),
  recentEvents: []
};

function normalizeEmail(value) {
  if (!value) return null;
  const email = String(value).trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function normalizeHost(value) {
  if (!value) return null;
  return String(value).trim().toLowerCase();
}

// Handle connection errors gracefully to prevent the process from crashing
db.on('error', (err) => {
  analyticsDbReady = false;
  console.error('MySQL connection error occurred:', err.message);
});

db.connect((err) => {
  if (err) {
    analyticsDbReady = false;
    console.error('MySQL connection error:', err.message);
  } else {
    analyticsDbReady = true;
    console.log('Connected to MySQL database');
    ensureAnalyticsTables();
  }
});

// Ensure analytics tables exist (creates minimal tables for visitor/session/event storage)
function ensureAnalyticsTables() {
  if (!analyticsDbReady) return;

  const createVisitors = `
    CREATE TABLE IF NOT EXISTS analytics_visitors (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id CHAR(36) NOT NULL,
      first_seen DATETIME NOT NULL,
      last_seen DATETIME NOT NULL,
      visit_count INT DEFAULT 1,
      INDEX(visitor_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const createSessions = `
    CREATE TABLE IF NOT EXISTS analytics_sessions (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id CHAR(36) NOT NULL,
      session_id CHAR(36) NOT NULL,
      started_at DATETIME NOT NULL,
      ended_at DATETIME,
      duration_seconds INT,
      INDEX(visitor_id),
      INDEX(session_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const createEvents = `
    CREATE TABLE IF NOT EXISTS analytics_events (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id CHAR(36),
      session_id CHAR(36),
      event_type VARCHAR(64) NOT NULL,
      event_name VARCHAR(128),
      page VARCHAR(255),
      meta JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX(event_type),
      INDEX(created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  db.query(createVisitors, (err) => { if (err) console.error('Create visitors table error:', err.message); });
  db.query(createSessions, (err) => { if (err) console.error('Create sessions table error:', err.message); });
  db.query(createEvents, (err) => { if (err) console.error('Create events table error:', err.message); });
}

function queryAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

function incrementMapCounter(map, key) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + 1);
}

function recordFallbackEvent({ visitor_id, session_id, event_type, event_name, page, email, host, full_url }) {
  const nowMs = Date.now();
  const normalizedEmail = normalizeEmail(email);
  const normalizedHost = normalizeHost(host);

  if (event_type === 'session_start' && visitor_id) {
    const existing = fallbackAnalytics.visitors.get(visitor_id);
    if (existing) {
      existing.lastSeen = nowMs;
      existing.visitCount += 1;
    } else {
      fallbackAnalytics.visitors.set(visitor_id, {
        firstSeen: nowMs,
        lastSeen: nowMs,
        visitCount: 1
      });
    }

    if (session_id) {
      fallbackAnalytics.sessions.set(session_id, {
        visitorId: visitor_id,
        startedAt: nowMs,
        endedAt: null,
        durationSeconds: null,
        host: normalizedHost
      });
    }
  }

  if (event_type === 'session_end' && session_id) {
    const session = fallbackAnalytics.sessions.get(session_id);
    if (session && session.startedAt) {
      session.endedAt = nowMs;
      session.durationSeconds = Math.max(0, Math.floor((nowMs - session.startedAt) / 1000));
    }
  }

  if (event_type === 'page_view' && page) {
    incrementMapCounter(fallbackAnalytics.pageViews, page);
  }

  if ((event_type === 'click' || event_type === 'form_submit') && event_name) {
    incrementMapCounter(fallbackAnalytics.events, `${event_type}::${event_name}`);
  }

  fallbackAnalytics.recentEvents.unshift({
    created_at: new Date(nowMs).toISOString(),
    visitor_id: visitor_id || null,
    session_id: session_id || null,
    event_type: event_type || null,
    event_name: event_name || null,
    page: page || null,
    email: normalizedEmail,
    host: normalizedHost,
    full_url: full_url || null
  });
  if (fallbackAnalytics.recentEvents.length > 1000) {
    fallbackAnalytics.recentEvents.length = 1000;
  }
}

function getHostFilter(rawHost) {
  const normalized = normalizeHost(rawHost);
  if (!normalized || normalized === 'all') return null;
  return normalized;
}

function buildFallbackSummary(hostFilter = null) {
  const normalizedHost = getHostFilter(hostFilter);
  if (normalizedHost) {
    const items = fallbackAnalytics.recentEvents.filter((item) => item.host === normalizedHost);
    const visitors = new Map();
    const pages = new Map();
    const events = new Map();

    for (const item of items) {
      if (item.event_type === 'session_start' && item.visitor_id) {
        visitors.set(item.visitor_id, (visitors.get(item.visitor_id) || 0) + 1);
      }
      if (item.event_type === 'page_view' && item.page) {
        pages.set(item.page, (pages.get(item.page) || 0) + 1);
      }
      if ((item.event_type === 'click' || item.event_type === 'form_submit') && item.event_name) {
        const key = `${item.event_type}::${item.event_name}`;
        events.set(key, (events.get(key) || 0) + 1);
      }
    }

    const totalVisitors = visitors.size;
    const returningVisitors = Array.from(visitors.values()).filter((count) => count > 1).length;
    const topPages = Array.from(pages.entries())
      .map(([page, cnt]) => ({ page, cnt }))
      .sort((a, b) => b.cnt - a.cnt)
      .slice(0, 10);
    const topEvents = Array.from(events.entries())
      .map(([key, cnt]) => {
        const splitAt = key.indexOf('::');
        return {
          event_type: splitAt >= 0 ? key.slice(0, splitAt) : 'click',
          event_name: splitAt >= 0 ? key.slice(splitAt + 2) : key,
          cnt
        };
      })
      .sort((a, b) => b.cnt - a.cnt)
      .slice(0, 20);

    return {
      total_visitors: totalVisitors,
      returning_visitors: returningVisitors,
      top_pages: topPages,
      top_events: topEvents,
      avg_session_seconds: 0,
      source: 'memory',
      host: normalizedHost
    };
  }

  const totalVisitors = fallbackAnalytics.visitors.size;
  let returningVisitors = 0;

  for (const v of fallbackAnalytics.visitors.values()) {
    if ((v.visitCount || 0) > 1) returningVisitors += 1;
  }

  const topPages = Array.from(fallbackAnalytics.pageViews.entries())
    .map(([page, cnt]) => ({ page, cnt }))
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 10);

  const topEvents = Array.from(fallbackAnalytics.events.entries())
    .map(([key, cnt]) => {
      const splitAt = key.indexOf('::');
      const eventType = splitAt >= 0 ? key.slice(0, splitAt) : 'click';
      const eventName = splitAt >= 0 ? key.slice(splitAt + 2) : key;
      return {
        event_name: eventName,
        event_type: eventType,
        cnt
      };
    })
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 20);

  const durationValues = [];
  for (const session of fallbackAnalytics.sessions.values()) {
    if (typeof session.durationSeconds === 'number') {
      durationValues.push(session.durationSeconds);
    }
  }

  const avg = durationValues.length > 0
    ? Math.round(durationValues.reduce((acc, cur) => acc + cur, 0) / durationValues.length)
    : 0;

  return {
    total_visitors: totalVisitors,
    returning_visitors: returningVisitors,
    top_pages: topPages,
    top_events: topEvents,
    avg_session_seconds: avg,
    source: analyticsDbReady ? 'mysql' : 'memory',
    host: normalizedHost || 'all'
  };
}

function mapActivityRow(row) {
  let meta = row.meta || {};
  if (typeof meta === 'string') {
    try {
      meta = JSON.parse(meta);
    } catch (err) {
      meta = {};
    }
  }

  const email = normalizeEmail(meta.email || row.email || null);
  const host = normalizeHost(meta.host || null);
  return {
    created_at: row.created_at,
    visitor_id: row.visitor_id || null,
    session_id: row.session_id || null,
    event_type: row.event_type || null,
    event_name: row.event_name || null,
    page: row.page || null,
    email,
    host,
    full_url: meta.full_url || null
  };
}

function buildActivityPayload(items, hostFilter, source, limit) {
  const normalizedHost = getHostFilter(hostFilter);
  const filtered = normalizedHost
    ? items.filter((item) => normalizeHost(item.host) === normalizedHost)
    : items;

  const limited = filtered.slice(0, limit);
  const byEmailMap = new Map();

  for (const item of filtered) {
    if (!item.email) continue;
    byEmailMap.set(item.email, (byEmailMap.get(item.email) || 0) + 1);
  }

  const by_email = Array.from(byEmailMap.entries())
    .map(([email, cnt]) => ({ email, cnt }))
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 50);

  return {
    source,
    host: normalizedHost || 'all',
    total_items: filtered.length,
    items: limited,
    by_email
  };
}

function getFallbackActivity(hostFilter = null, limit = 100) {
  return buildActivityPayload(fallbackAnalytics.recentEvents, hostFilter, 'memory', limit);
}

async function getDbActivity(hostFilter = null, limit = 100) {
  const fetchLimit = Math.max(limit * 5, 200);
  const rows = await queryAsync(
    'SELECT visitor_id, session_id, event_type, event_name, page, meta, created_at FROM analytics_events ORDER BY created_at DESC LIMIT ?',
    [fetchLimit]
  );
  const items = rows.map(mapActivityRow);
  return buildActivityPayload(items, hostFilter, 'mysql', limit);
}

async function getAnalyticsSummary(hostFilter = null) {
  if (!analyticsDbReady) return buildFallbackSummary(hostFilter);

  try {
    const normalizedHost = getHostFilter(hostFilter);

    if (normalizedHost) {
      const activity = await getDbActivity(normalizedHost, 1000);
      const visitors = new Map();
      const pages = new Map();
      const events = new Map();

      for (const item of activity.items) {
        if (item.event_type === 'session_start' && item.visitor_id) {
          visitors.set(item.visitor_id, (visitors.get(item.visitor_id) || 0) + 1);
        }
        if (item.event_type === 'page_view' && item.page) {
          pages.set(item.page, (pages.get(item.page) || 0) + 1);
        }
        if ((item.event_type === 'click' || item.event_type === 'form_submit') && item.event_name) {
          const key = `${item.event_type}::${item.event_name}`;
          events.set(key, (events.get(key) || 0) + 1);
        }
      }

      return {
        total_visitors: visitors.size,
        returning_visitors: Array.from(visitors.values()).filter((count) => count > 1).length,
        top_pages: Array.from(pages.entries()).map(([page, cnt]) => ({ page, cnt })).sort((a, b) => b.cnt - a.cnt).slice(0, 10),
        top_events: Array.from(events.entries()).map(([key, cnt]) => {
          const splitAt = key.indexOf('::');
          return {
            event_type: splitAt >= 0 ? key.slice(0, splitAt) : 'click',
            event_name: splitAt >= 0 ? key.slice(splitAt + 2) : key,
            cnt
          };
        }).sort((a, b) => b.cnt - a.cnt).slice(0, 20),
        avg_session_seconds: 0,
        source: 'mysql',
        host: normalizedHost
      };
    }

    const qTotalVisitors = 'SELECT COUNT(*) AS cnt FROM analytics_visitors';
    const qReturning = 'SELECT COUNT(*) AS cnt FROM analytics_visitors WHERE visit_count > 1';
    const qTopPages = `SELECT page, COUNT(*) AS cnt FROM analytics_events WHERE event_type = 'page_view' GROUP BY page ORDER BY cnt DESC LIMIT 10`;
    const qTopEvents = `SELECT event_name, event_type, COUNT(*) AS cnt FROM analytics_events WHERE event_type IN ('click','form_submit') GROUP BY event_type, event_name ORDER BY cnt DESC LIMIT 20`;
    const qAvgSession = 'SELECT AVG(duration_seconds) AS avg_d FROM analytics_sessions WHERE duration_seconds IS NOT NULL';

    const [r, r2, r3, r4, r5] = await Promise.all([
      queryAsync(qTotalVisitors),
      queryAsync(qReturning),
      queryAsync(qTopPages),
      queryAsync(qTopEvents),
      queryAsync(qAvgSession)
    ]);

    return {
      total_visitors: r[0] ? r[0].cnt : 0,
      returning_visitors: r2[0] ? r2[0].cnt : 0,
      top_pages: r3 || [],
      top_events: r4 || [],
      avg_session_seconds: !r5[0] ? 0 : Math.round(r5[0].avg_d || 0),
      source: 'mysql',
      host: normalizedHost || 'all'
    };
  } catch (err) {
    analyticsDbReady = false;
    console.error('Analytics summary query error:', err.message);
    return buildFallbackSummary(hostFilter);
  }
}

// ----- Analytics endpoints -----
// Track events from frontend
app.post('/api/track', async (req, res) => {
  try {
    const { visitor_id, session_id, event_type, event_name, page, meta, email } = req.body || {};
    if (!event_type) return res.status(400).json({ error: 'event_type required' });

    const safeMeta = Object.assign({}, meta || {});
    const normalizedEmail = normalizeEmail(email || safeMeta.email || null);
    if (normalizedEmail) safeMeta.email = normalizedEmail;
    safeMeta.host = normalizeHost(safeMeta.host || null);
    safeMeta.full_url = safeMeta.full_url || null;

    // Keep analytics live even when DB is unavailable.
    recordFallbackEvent({
      visitor_id,
      session_id,
      event_type,
      event_name,
      page,
      email: normalizedEmail,
      host: safeMeta.host,
      full_url: safeMeta.full_url
    });

    if (!analyticsDbReady) {
      return res.json({ status: 'ok', source: 'memory' });
    }

    // Insert event
    const eventSql = 'INSERT INTO analytics_events (visitor_id, session_id, event_type, event_name, page, meta) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(eventSql, [visitor_id || null, session_id || null, event_type, event_name || null, page || null, JSON.stringify(safeMeta)], (err) => {
      if (err) {
        analyticsDbReady = false;
        console.error('Insert analytics event error:', err.message);
      }
    });

    // If session_start, upsert visitor and create session row
    if (event_type === 'session_start') {
      const now = new Date();
      const sel = 'SELECT id, visit_count FROM analytics_visitors WHERE visitor_id = ? LIMIT 1';
      db.query(sel, [visitor_id], (err, results) => {
        if (err) return;
        if (results && results.length > 0) {
          const visitCount = (results[0].visit_count || 0) + 1;
          db.query('UPDATE analytics_visitors SET last_seen = ?, visit_count = ? WHERE visitor_id = ?', [now, visitCount, visitor_id]);
        } else {
          db.query('INSERT INTO analytics_visitors (visitor_id, first_seen, last_seen, visit_count) VALUES (?, ?, ?, ?)', [visitor_id, now, now, 1]);
        }
      });

      // create session record
      db.query('INSERT INTO analytics_sessions (visitor_id, session_id, started_at) VALUES (?, ?, ?)', [visitor_id, session_id, new Date()], (err) => {
        if (err) {
          analyticsDbReady = false;
          console.error('Insert session error:', err.message);
        }
      });
    }

    // If session_end, update session duration
    if (event_type === 'session_end') {
      if (session_id) {
        db.query('SELECT started_at FROM analytics_sessions WHERE session_id = ? ORDER BY id DESC LIMIT 1', [session_id], (err, r) => {
          if (err || !r || r.length === 0) return;
          const startedAt = r[0].started_at;
          const endedAt = new Date();
          const duration = Math.max(0, Math.floor((endedAt - startedAt) / 1000));
          db.query('UPDATE analytics_sessions SET ended_at = ?, duration_seconds = ? WHERE session_id = ? AND ended_at IS NULL', [endedAt, duration, session_id], (err) => {
            if (err) {
              analyticsDbReady = false;
              console.error('Update session end error:', err.message);
            }
          });
        });
      }
    }

    res.json({ status: 'ok', source: 'mysql' });
  } catch (err) {
    console.error('Track endpoint error:', err.message);
    res.status(500).json({ error: 'server error' });
  }
});

// Aggregated summary for admin UI (no auth; you can restrict this in production)
app.get('/api/analytics/summary', async (req, res) => {
  try {
    const host = req.query.host || null;
    const summary = await getAnalyticsSummary(host);
    res.json(summary);
  } catch (err) {
    console.error('Analytics summary error:', err.message);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/analytics/activity', async (req, res) => {
  try {
    const host = req.query.host || 'www.minehrsolutions.com';
    const limit = Math.max(1, Math.min(500, parseInt(req.query.limit || '100', 10)));

    if (!analyticsDbReady) {
      return res.json(getFallbackActivity(host, limit));
    }

    const activity = await getDbActivity(host, limit);
    res.json(activity);
  } catch (err) {
    analyticsDbReady = false;
    console.error('Analytics activity error:', err.message);
    const host = req.query.host || 'www.minehrsolutions.com';
    const limit = Math.max(1, Math.min(500, parseInt(req.query.limit || '100', 10)));
    res.json(getFallbackActivity(host, limit));
  }
});

// Master panel integration endpoint: returns same summary but requires API key and restricts CORS
app.get('/api/analytics/master-summary', (req, res) => {
  const masterKey = process.env.MASTER_ANALYTICS_KEY || '';
  const provided = req.headers['x-api-key'] || req.query.api_key || '';
  // Restrict to master panel origin
  res.setHeader('Access-Control-Allow-Origin', 'https://master.minehrsolutions.com');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  if (!masterKey || provided !== masterKey) return res.status(401).json({ error: 'unauthorized' });

  getAnalyticsSummary(req.query.host || null)
    .then((summary) => res.json(summary))
    .catch((err) => {
      console.error('Master analytics summary error:', err.message);
      res.status(500).json({ error: 'server error' });
    });
});

// Serve admin analytics page
app.get('/admin/analytics', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'analytics.html'));
});

// Generic fallback for admin pages without requiring explicit routes.
// Example: /admin/analytics -> serves admin/analytics.html
app.get('/admin/:page', (req, res, next) => {
  const p = req.params.page;
  const candidate = path.join(__dirname, 'admin', `${p}.html`);
  res.sendFile(candidate, (err) => {
    if (err) return next(); // let default 404 handler respond
  });
});

// Contact form API
// Job application form API
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  })
});

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createDetailRow(label, value) {
  return `
        <tr>
          <td style="padding: 10px 12px; color: #6b7280; width: 180px; font-weight: 600; border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;">${escapeHtml(label)}</td>
          <td style="padding: 10px 12px; color: #111827; font-weight: 500; border-bottom: 1px solid #e5e7eb;">${escapeHtml(value)}</td>
        </tr>`;
}

function buildApplicationSummaryRows({ jobTitle, fullName, email, phone, location, submittedAt }) {
  return [
    createDetailRow('Position Applied For', jobTitle || 'General Application'),
    createDetailRow('Full Name', fullName),
    createDetailRow('Email Address', email),
    createDetailRow('Phone Number', phone),
    createDetailRow('Current Location', location || 'Not Provided'),
    createDetailRow('Submitted At', submittedAt)
  ].join('');
}

function buildEmailShell({ bannerColor, title, subtitle, body }) {
  return `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 680px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
  <div style="background: ${bannerColor}; padding: 28px 24px; text-align: center;">
    <h1 style="margin: 0; color: #ffffff; font-size: 26px; line-height: 1.2;">${escapeHtml(title)}</h1>
    <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">${escapeHtml(subtitle)}</p>
  </div>
  <div style="padding: 28px 24px; background-color: #ffffff; color: #111827;">
    ${body}
  </div>
</div>`;
}

function hasPlaceholderMailConfig() {
  const emailUser = process.env.EMAIL_USER || process.env.MAIL_USERNAME || '';
  const emailPass = process.env.EMAIL_PASS || process.env.MAIL_PASSWORD || '';
  return !emailUser || !emailPass;
}

function createSmtpTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false, // TLS via STARTTLS on port 587
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER || process.env.MAIL_USERNAME,
      pass: process.env.EMAIL_PASS || process.env.MAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

app.post('/api/apply', upload.single('resume'), async (req, res) => {
  const { fullName, email, phone, location, jobTitle } = req.body;
  const resumeFile = req.file ? req.file.filename : null;

  if (!fullName || !email || !phone || !resumeFile) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let dbInserted = false;
  let emailSent = false;

  // 1. Database insert
  try {
    await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO career (full_name, email, phone, location, resume, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [fullName, email, phone, location, resumeFile],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    dbInserted = true;
  } catch (err) {
    console.warn('Database error (skipping database insert for career application):', err.message);
  }

  // 2. Send emails
  try {
    if (hasPlaceholderMailConfig()) {
      throw new Error('EMAIL_USER / EMAIL_PASS are still placeholder values. Configure a real Gmail account or app password before sending mail.');
    }

    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const senderEmail = 'hr@minehrsolutions.com';
    const hrRecipientEmail = process.env.HR_EMAIL || 'hr@minehrsolutions.com';

    const transporter = createSmtpTransporter();

    const applicationRows = buildApplicationSummaryRows({
      jobTitle,
      fullName,
      email,
      phone,
      location,
      submittedAt
    });

    // ── HR email: full applicant details ──────────────────────────────────
    const hrEmailHtml = buildEmailShell({
      bannerColor: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
      title: 'MineHR Solutions',
      subtitle: 'New Job Application Received',
      body: `
    <p style="margin-top: 0; color: #111827; font-size: 16px; line-height: 1.6;">Hello HR Team,</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
      A new job application has been submitted through the MineHR careers portal.
      Please find the complete applicant details below.
    </p>

    <div style="margin: 24px 0; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <th colspan="2" style="padding: 14px 16px; background-color: #eff6ff; color: #1e3a8a; text-align: left; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">Applicant Details</th>
        </tr>
        ${createDetailRow('Full Name', fullName)}
        ${createDetailRow('Email Address', email)}
        ${createDetailRow('Phone Number', phone)}
        ${createDetailRow('Current Location', location || 'Not Provided')}
        ${createDetailRow('Position Applied For', jobTitle || 'General Application')}
        ${createDetailRow('Resume File', req.file.originalname)}
        ${createDetailRow('Submitted At', submittedAt)}
      </table>
    </div>

    <div style="margin: 24px 0; padding: 16px; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px;">
      <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
        <strong>Action Required:</strong> Please review the attached resume and follow up with the applicant at
        <a href="mailto:${escapeHtml(email)}" style="color: #1d4ed8;">${escapeHtml(email)}</a>
        or <a href="tel:${escapeHtml(phone)}" style="color: #1d4ed8;">${escapeHtml(phone)}</a>.
      </p>
    </div>

    <p style="margin-bottom: 0; color: #6b7280; font-size: 13px;">This is an automated notification from the MineHR careers portal.</p>
      `
    });

    // ── Applicant email: simple confirmation ──────────────────────────────
    const customerEmailHtml = buildEmailShell({
      bannerColor: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      title: 'MineHR Solutions',
      subtitle: 'Application Submitted Successfully',
      body: `
    <p style="margin-top: 0; color: #111827; font-size: 17px; font-weight: 600;">Dear ${escapeHtml(fullName)},</p>

    <p style="color: #374151; font-size: 15px; line-height: 1.8;">
      Thank you for applying at <strong>MineHR Solutions</strong>! We have successfully received your application
      ${jobTitle ? `for the position of <strong>${escapeHtml(jobTitle)}</strong>` : ''}.
    </p>

    <div style="margin: 28px 0; padding: 20px 24px; background: linear-gradient(135deg, #eef2ff, #f0f9ff); border-radius: 12px; border: 1px solid #c7d2fe;">
      <p style="margin: 0 0 6px 0; color: #3730a3; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">What happens next?</p>
      <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 2;">
        <li>Our recruitment team will carefully review your application and resume.</li>
        <li>If your profile matches our requirements, we will reach out to you shortly.</li>
        <li>You can expect to hear from us within <strong>3–5 business days</strong>.</li>
      </ul>
    </div>

    <p style="color: #374151; font-size: 15px; line-height: 1.7;">
      In the meantime, feel free to explore more about us at
      <a href="https://www.minehrsolutions.com" style="color: #4f46e5; font-weight: 600; text-decoration: none;">www.minehrsolutions.com</a>.
    </p>

    <p style="color: #374151; font-size: 15px; line-height: 1.7; margin-bottom: 0;">
      We appreciate your interest and look forward to connecting with you.
      <br><br>
      Warm regards,<br>
      <strong style="color: #111827; font-size: 16px;">Recruitment Team</strong><br>
      <span style="color: #6b7280;">MineHR Solutions</span><br>
      <a href="mailto:hr@minehrsolutions.com" style="color: #4f46e5; text-decoration: none; font-size: 13px;">hr@minehrsolutions.com</a>
    </p>
      `
    });

    // Send notification email to HR
    const hrMailOptions = {
      from: `"MineHR Solutions" <${senderEmail}>`,
      to: hrRecipientEmail,
      replyTo: email,
      subject: `New Application: ${fullName} – ${jobTitle || 'General Application'}`,
      html: hrEmailHtml,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path
        }
      ]
    };

    // Send confirmation email to applicant
    const customerMailOptions = {
      from: `"MineHR Solutions" <${senderEmail}>`,
      to: email,
      replyTo: senderEmail,
      subject: `Application Received – ${jobTitle || 'MineHR Solutions'}`,
      html: customerEmailHtml
    };

    await Promise.all([
      transporter.sendMail(hrMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);
    emailSent = true;
  } catch (emailErr) {
    console.error('Nodemailer send error in career application:');
    console.error('  Message:', emailErr.message);
    console.error('  Code:', emailErr.code || 'N/A');
    console.error('  Response:', emailErr.response || 'N/A');
  }

  // Always return success to the applicant — the form data was received.
  // Email failures are logged server-side and should not block the applicant's experience.
  res.json({ success: true, dbInserted, emailSent });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, contact_number, company, message } = req.body;
  
  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!contact_number) return res.status(400).json({ error: 'Phone number is required' });
  if (!company) return res.status(400).json({ error: 'Company name is required' });

  // Insert into DB (wrapped in try-catch/callback error check so database issues don't crash email delivery)
  db.query(
    'INSERT INTO contacts (name, email, contact_number, company, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
    [name, email, contact_number, company, message],
    async (err, result) => {
      if (err) {
        console.warn('Database error (skipping database insert):', err.message);
      }
      
      // Send email notifications
      let emailSent = false;
      try {
        const transporter = createSmtpTransporter();

        const hrContactHtml = `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
  <div style="background-color: #1e293b; padding: 30px 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">MineHR Portal</h1>
    <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">New Contact Form Submission</p>
  </div>
  <div style="padding: 30px 25px; background-color: #ffffff;">
    <p style="margin-top: 0; color: #111827; font-size: 16px; line-height: 1.6;">Hello HR Team,</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">A new inquiry has been submitted through the Contact Us form. Below are the details:</p>
    
    <div style="margin: 25px 0; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
      <h3 style="margin-top: 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Inquiry Information</h3>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 120px; font-weight: 500;">Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Email Address:</td>
          <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Contact Number:</td>
          <td style="padding: 6px 0; color: #0f172a;"><a href="tel:${contact_number}" style="color: #4f46e5; text-decoration: none;">${contact_number}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Company:</td>
          <td style="padding: 6px 0; color: #0f172a;">${company}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500; vertical-align: top;">Message:</td>
          <td style="padding: 6px 0; color: #0f172a; line-height: 1.4;">${message || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Submitted At:</td>
          <td style="padding: 6px 0; color: #0f172a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
        </tr>
      </table>
    </div>
  </div>
  <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
    <p style="margin: 0;">This is an automated notification from the MineHR Web Portal.</p>
  </div>
</div>
`;

        const customerContactHtml = `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
  <div style="background-color: #4f46e5; padding: 30px 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">MineHR Solutions</h1>
    <p style="color: #c7d2fe; margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">Inquiry Received</p>
  </div>
  <div style="padding: 30px 25px; background-color: #ffffff;">
    <p style="margin-top: 0; color: #111827; font-size: 16px; font-weight: 600;">Dear ${name},</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Thank you for contacting MineHR Solutions. We have received your inquiry and our team is already reviewing the details.</p>
    
    <div style="margin: 25px 0; padding: 20px; background-color: #f3f4f6; border-radius: 6px;">
      <h3 style="margin-top: 0; color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Inquiry Summary</h3>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #6b7280; width: 120px; font-weight: 500;">Name:</td>
          <td style="padding: 6px 0; color: #1f2937; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Email:</td>
          <td style="padding: 6px 0; color: #1f2937;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Phone:</td>
          <td style="padding: 6px 0; color: #1f2937;">${contact_number}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Company:</td>
          <td style="padding: 6px 0; color: #1f2937;">${company}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500; vertical-align: top;">Message:</td>
          <td style="padding: 6px 0; color: #1f2937; line-height: 1.4;">${message || 'N/A'}</td>
        </tr>
      </table>
    </div>

    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">One of our business representatives will get in touch with you shortly to assist you further.</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 0;">Best regards,<br><strong style="color: #111827;">Customer Relations Team</strong><br>MineHR Solutions</p>
  </div>
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
    <p style="margin: 0 0 5px 0;">MineHR Solutions Pvt. Ltd.</p>
    <p style="margin: 0;">509, Ananta Elysium, Nikol, Ahmedabad - 380049</p>
    <p style="margin: 5px 0 0 0;"><a href="https://www.minehrsolutions.com" style="color: #4f46e5; text-decoration: none; font-weight: 500;">www.minehrsolutions.com</a></p>
  </div>
</div>
`;

        // Send email to HR
        const hrMailOptions = {
          from: '"MineHR Solutions" <hr@minehrsolutions.com>',
          to: process.env.HR_EMAIL || 'hr@minehrsolutions.com',
          replyTo: email,
          subject: `New Contact Us Submission from ${name} - MineHR`,
          html: hrContactHtml
        };

        // Send confirmation email to client
        const customerMailOptions = {
          from: '"MineHR Solutions" <hr@minehrsolutions.com>',
          to: email,
          replyTo: 'hr@minehrsolutions.com',
          subject: `Thank You for Contacting MineHR Solutions`,
          html: customerContactHtml
        };

        await Promise.all([
          transporter.sendMail(hrMailOptions),
          transporter.sendMail(customerMailOptions)
        ]);
        emailSent = true;
      } catch (emailErr) {
        console.error('Nodemailer send error in contact submission:', emailErr.message);
      }

      return res.json({ success: true, emailSent });
    }
  );
});

/* ============================================================
   CSV EXPORT — Download all contact submissions as Excel/CSV
   Visit: /api/export/contacts?key=minehr2025
   ============================================================ */
app.get('/api/export/contacts', (req, res) => {
  const EXPORT_KEY = process.env.EXPORT_KEY || 'minehr2025';
  if (req.query.key !== EXPORT_KEY) {
    return res.status(401).json({ error: 'Unauthorized. Provide ?key=<export_key>' });
  }

  db.query('SELECT id, name, email, contact_number, company, message, created_at FROM contacts ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }

    const headers = ['ID', 'Name', 'Email', 'Contact Number', 'Company', 'Message', 'Submitted At'];
    const escapeCSV = (val) => {
      if (val == null) return '';
      const str = String(val).replace(/"/g, '""');
      return /[,"\n\r]/.test(str) ? `"${str}"` : str;
    };

    const csvRows = [
      headers.join(','),
      ...rows.map(r => [
        r.id, r.name, r.email, r.contact_number, r.company, r.message,
        r.created_at ? new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : ''
      ].map(escapeCSV).join(','))
    ];

    const csv = csvRows.join('\r\n');
    const filename = `MineHR_Contacts_${new Date().toISOString().slice(0,10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8 compatibility
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
