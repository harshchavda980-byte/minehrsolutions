if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./config/database');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const trackingMiddleware = require('./middleware/trackingMiddleware');
const ActivityLog = require('./models/ActivityLog');

const app = express();
const PORT = process.env.PORT || 3000;
let dbInitPromise;

// ─── Basic Middleware ───────────────────────────────────────────────────────
app.use(compression());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ 
    origin: (origin, callback) => callback(null, true), 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(cookieParser());

// ─── Standard API Routes ────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/onboarding', require('./routes/onboardingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/usage', require('./routes/usageRoutes'));
app.use('/api/plans', require('./routes/plansRoutes'));
app.use('/api/employee-count', require('./routes/employeeCountRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/activities', require('./routes/activityLogRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/recycle-bin', require('./routes/recycleBinRoutes'));
app.use('/api/company-requests', require('./routes/companyRequestRoutes'));
app.use('/api/crm', require('./routes/crmRoutes'));
app.use('/api/training-batches', require('./routes/trainingBatchRoutes'));
app.use('/api/training-meetings', require('./routes/trainingMeetingRoutes'));
app.use('/api/training-modules', require('./routes/trainingModuleRoutes'));
app.use('/api/training-priorities', require('./routes/trainingPriorityRoutes'));
app.use('/api/onboarding-participants', require('./routes/participantRoutes'));
app.use('/api/work-reports', require('./routes/workReportRoutes'));
app.use('/api/email-templates', require('./routes/emailTemplateRoutes'));
app.use('/api/demo-requests', require('./routes/demoRequestRoutes'));
app.use('/api/locations', require('./routes/cityRoutes'));
app.use('/api/ats/jobs', require('./routes/atsJobRoutes'));
app.use('/api/ats/applications', require('./routes/atsApplicationRoutes'));
app.use('/api/ats/interviews', require('./routes/atsInterviewRoutes'));
app.use('/api/ats/reports', require('./routes/atsReportRoutes'));
app.use('/api/automation/intimations', require('./routes/intimationRoutes'));
app.use('/api/settings/industry-types', require('./routes/industryTypeRoutes'));
app.use('/api/backup', require('./routes/backupRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/engagement', require('./routes/engagementRoutes'));

// ─── Static Files & Frontend ────────────────────────────────────────────────
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'login.html');
    res.sendFile(filePath, err => {
        if (err) {
            res.redirect('/login');
        }
    });
});

app.use(express.static(path.join(__dirname, 'public')));

// Submodules Route Mapping
app.get('/country-management', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'country.html'));
});
app.get('/state-management', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'state.html'));
});
app.get('/city-management', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'geo-city.html'));
});
app.get('/industry-type-management', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'industry-type.html'));
});

app.get('/:page', (req, res, next) => {
    let page = req.params.page;
    if (page.endsWith('.html')) page = page.replace('.html', '');
    const filePath = path.join(__dirname, 'public', `${page}.html`);
    res.sendFile(filePath, err => { if (err) next(); });
});

app.get(/.*/, (req, res) => {
    res.redirect('/login');
});

// ─── Database & Server Boot ─────────────────────────────────────────────────
const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL');
        if (process.env.DB_SYNC === 'true') await sequelize.sync();
    } catch (err) { console.error('DB Error:', err); }
};
initDatabase();

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ success: false, message: err.message });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
}

module.exports = app;
