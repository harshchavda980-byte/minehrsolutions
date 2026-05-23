const Company = require('../models/Company');
const Lead = require('../models/Lead');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
    try {
        const totalCompanies = await Company.count({ where: { status: 'verified' } });
        const totalCRM = await Lead.count();
        const newCompanyRequests = await Company.count({ where: { status: 'pending' } });
        const newCRMRequests = await Lead.count({ where: { status: 'New' } });
        const ticketsSupport = await Ticket.count({ where: { status: 'Open' } });
        const ticketsInfo = await Ticket.count({ where: { status: 'In Progress' } });
        const ticketsResolved = await Ticket.count({ where: { status: 'Resolved' } });
        const ticketsDeveloper = await Ticket.count({ where: { status: 'Closed' } });
        const activeAdmins = await User.count();

        // Today's activity log count
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayActivityCount = await ActivityLog.count({
            where: { created_at: { [Op.gte]: todayStart } }
        });

        res.json({
            success: true,
            stats: {
                totalCompanies: totalCompanies || 0,
                totalCRM: totalCRM || 0,
                newCompanyRequests: newCompanyRequests || 0,
                newCRMRequests: newCRMRequests || 0,
                ticketsSupport: ticketsSupport || 0,
                ticketsInfo: ticketsInfo || 0,
                ticketsResolved: ticketsResolved || 0,
                ticketsDeveloper: ticketsDeveloper || 0,
                activeAdmins: activeAdmins || 0,
                todayActivityCount: todayActivityCount || 0
            }
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ success: false, message: 'Stats Error: ' + error.message });
    }
};

// Growth chart data — grouped by range
exports.getGrowthData = async (req, res) => {
    try {
        const range = req.query.range || 'monthly';
        let labels = [];
        let data = [];
        const now = new Date();

        if (range === 'daily') {
            // Last 24 hours - hourly intervals
            for (let i = 23; i >= 0; i--) {
                const d = new Date(now);
                d.setHours(d.getHours() - i, 0, 0, 0);
                const end = new Date(d); end.setHours(d.getHours(), 59, 59, 999);
                const count = await Company.count({ where: { created_at: { [Op.between]: [d, end] } } });
                labels.push(d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
                data.push(count);
            }
        } else if (range === 'weekly') {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const start = new Date(d); start.setHours(0, 0, 0, 0);
                const end = new Date(d); end.setHours(23, 59, 59, 999);
                const count = await Company.count({ where: { created_at: { [Op.between]: [start, end] } } });
                labels.push(d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }));
                data.push(count);
            }
        } else if (range === 'monthly') {
            // Last 12 months
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
                const count = await Company.count({ where: { created_at: { [Op.between]: [d, end] } } });
                labels.push(d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));
                data.push(count);
            }
        } else if (range === 'halfyearly') {
            // Last 6 months
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
                const count = await Company.count({ where: { created_at: { [Op.between]: [d, end] } } });
                labels.push(d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));
                data.push(count);
            }
        } else if (range === 'yearly') {
            // Last 5 years
            for (let i = 4; i >= 0; i--) {
                const year = now.getFullYear() - i;
                const start = new Date(year, 0, 1);
                const end = new Date(year, 11, 31, 23, 59, 59);
                const count = await Company.count({ where: { created_at: { [Op.between]: [start, end] } } });
                labels.push(String(year));
                data.push(count);
            }
        }

        // Calculate percentage change (last period vs second-to-last)
        let change = 0;
        if (data.length >= 2) {
            const prev = data[data.length - 2] || 0;
            const curr = data[data.length - 1] || 0;
            change = prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);
        }

        res.json({ success: true, labels, data, change, total: data.reduce((a, b) => a + b, 0) });
    } catch (err) {
        console.error('Growth data error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Recent activity feed
exports.getRecentActivity = async (req, res) => {
    try {
        const logs = await ActivityLog.findAll({
            order: [['created_at', 'DESC']],
            limit: 10
        });

        const result = logs.map(log => ({
            id: log.id,
            action: log.action,
            module: log.module,
            details: log.details,
            ip_address: log.ip_address,
            created_at: log.created_at
        }));

        res.json({ success: true, activities: result });
    } catch (err) {
        console.error('Recent activity error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.globalSearch = async (req, res) => {
    try {
        const q = req.query.q || '';
        if (q.length < 3) return res.json({ success: true, results: [] });

        const query = q.toLowerCase().trim();
        const pages = [
            // Core
            { label: 'Dashboard', url: 'dashboard.html' },
            { label: 'App Usage', url: 'app-usage.html' },
            
            // User
            { label: 'Manage User', url: 'users.html' },
            { label: 'Manage Roles', url: 'roles.html' },
            { label: 'Recent Activities', url: 'activities.html' },
            { label: 'Add User', url: 'users-create.html' },

            // Company Management
            { label: 'Companies', url: 'companies.html' },
            { label: 'Company Analytics', url: 'companies-analytics.html' },
            { label: 'Plan Expire', url: 'companies-plans.html' },
            { label: 'Employee Count', url: 'companies-employee-limit.html' },

            // Company Request
            { label: 'Add New Company', url: 'companies-create.html' },
            { label: 'New Company Request', url: 'companies-requests-new.html' },
            { label: 'Pending Companies', url: 'companies-pending.html' },
            { label: 'Created Company', url: 'companies-requests-created.html' },
            { label: 'Rejected Company', url: 'companies-requests-rejected.html' },
            { label: 'My Company', url: 'companies-my.html' },

            // Operations
            { label: 'Tickets', url: 'operations-tickets.html' },
            { label: 'Escalations', url: 'operations-escalations.html' },
            { label: 'Website Feedback', url: 'operations-feedback.html' },
            { label: 'Company Found Requests', url: 'operations-company-requests.html' },

            // CRM
            { label: 'Leads (CRM)', url: '/crm-leads' },
            { label: 'Demo Requests (CRM)', url: '/crm-demo' },

            // Locations
            { label: 'Manage Countries', url: '/country-management' },
            { label: 'Manage States', url: '/state-management' },
            { label: 'Manage Cities', url: '/city-management' },

            // Recruitment (ATS)
            { label: 'Job Listings (ATS)', url: '/ats-jobs' },
            { label: 'Applications (ATS)', url: '/ats-applications' },
            { label: 'Interviews (ATS)', url: '/ats-interviews' },
            { label: 'Reports & Analytics (ATS)', url: '/ats-reports' },

            // Automation (Cron)
            { label: 'Automation Settings', url: '/automation-settings' },
            { label: 'WhatsApp Log', url: 'whatsapp-logs.html' },
            { label: 'Execution History', url: 'execution-history.html' },

            // Banners
            { label: 'App Banners', url: '/banners' },
            { label: 'Festival Banners', url: '/festival-banners' },

            // Onboarding process
            { label: 'Welcome Process', url: 'onboarding-welcome.html' },
            { label: 'Training Dashboard', url: 'onboarding-training-dashboard.html' },
            { label: 'Company Dashboard', url: 'onboarding-company-dashboard.html' },
            { label: 'Manage Training Batch', url: 'onboarding-training-batch.html' },
            { label: 'Manage Training Slots', url: 'onboarding-training-slots.html' },
            { label: 'Manage Training Modules', url: 'onboarding-training-modules.html' },
            { label: 'Manage Training Priority', url: 'onboarding-training-priority.html' },
            { label: 'Manage Participants', url: 'onboarding-participants.html' },
            { label: 'Implementation Work report', url: 'onboarding-work-reports.html' },
            { label: 'Manage Daily Reports', url: 'onboarding-daily-reports.html' },
            { label: 'Email Templates', url: 'onboarding-email-templates.html' },

            // Engagement
            { label: 'Engagement Dashboard', url: '/engagement' },
            { label: 'Engagement Work Report', url: '/engagement-report' },

            // System & Configuration
            { label: 'Manage Devices', url: 'devices.html' },
            { label: 'Backup (Recycle Bin)', url: 'recycle-bin.html' },
            { label: 'Settings', url: 'settings.html' },
            { label: 'Industry Types', url: '/industry-type-management' },

            // Reports Submodules
            { label: 'Reports Dashboard', url: 'reports.html' },
            { label: 'CRM Report', url: 'reports-viewer.html?type=crm_report' },
            { label: 'Sales Inquiry Report', url: 'reports-viewer.html?type=sales_inquiry' },
            { label: 'Engagement Report', url: 'reports-viewer.html?type=engagement_report' },
            { label: 'Plan Expire Report', url: 'reports-viewer.html?type=crm_plan_expire' },
            { label: 'Analytics Report', url: 'reports-viewer.html?type=analytics_report' },
            { label: 'Company Count Report', url: 'reports-viewer.html?type=company_count' },
            { label: 'Company Report', url: 'reports-viewer.html?type=company_report' },
            { label: 'Deleted Company Report', url: 'reports-viewer.html?type=deleted_company' },
            { label: 'Pending Companies Report', url: 'reports-viewer.html?type=pending_companies' },
            { label: 'New Requests Report', url: 'reports-viewer.html?type=new_requests' },
            { label: 'App Support Report', url: 'reports-viewer.html?type=app_support' },
            { label: 'Support Handover Report', url: 'reports-viewer.html?type=support_handover' },
            { label: 'Employee Tickets Report', url: 'reports-viewer.html?type=employee_tickets' },
            { label: 'Recent Activities Report', url: 'reports-viewer.html?type=recent_activities' },
            { label: 'Feedback Report', url: 'reports-viewer.html?type=feedback' },
            { label: 'Smart Society Report', url: 'reports-viewer.html?type=smart_society' },
            { label: 'My Association Report', url: 'reports-viewer.html?type=my_association' },
            { label: 'White Label Report', url: 'reports-viewer.html?type=white_label' },
            { label: 'Setup Report', url: 'reports-viewer.html?type=setup_report' },
            { label: 'Product Training Report', url: 'reports-viewer.html?type=product_training' },
            { label: 'Training Feedback Report', url: 'reports-viewer.html?type=training_feedback' },
            { label: 'Meetings Report', url: 'reports-viewer.html?type=implementation' },
            { label: 'Transaction Report', url: 'reports-viewer.html?type=transaction_report' },
            { label: 'Biometric Device Report', url: 'reports-viewer.html?type=biometric_device' },
            { label: 'Tracking Reports', url: 'tracking-reports.html' }
        ];

        const matchedPages = pages.filter(p => p.label.toLowerCase().includes(query));
        
        let companies = [];
        let users = [];
        let leads = [];

        try {
            // Search Companies (Name or Code)
            companies = await Company.findAll({ 
                where: { 
                    [Op.or]: [
                        { name: { [Op.like]: `%${query}%` } },
                        { company_code: { [Op.like]: `%${query}%` } }
                    ]
                }, 
                limit: 5 
            });

            // Search Users (Name or Email)
            users = await User.findAll({
                where: { 
                    [Op.or]: [
                        { name: { [Op.like]: `%${query}%` } }, 
                        { email: { [Op.like]: `%${query}%` } }
                    ] 
                },
                limit: 5
            });

            // Search Leads (Name, Email, or Organization)
            leads = await Lead.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${query}%` } },
                        { email: { [Op.like]: `%${query}%` } },
                        { organization: { [Op.like]: `%${query}%` } }
                    ]
                },
                limit: 5
            });

        } catch (dbErr) {
            console.error('DB Search Error:', dbErr);
        }

        const results = [
            ...matchedPages.map(p => ({ type: 'Module', id: p.url, label: p.label, url: p.url })),
            ...companies.map(c => ({ type: 'Company', id: c.id, label: `${c.name} (${c.company_code})`, url: `companies.html?search=${encodeURIComponent(c.name)}` })),
            ...users.map(u => ({ type: 'User', id: u.id, label: u.name + ' (' + u.email + ')', url: `users.html?search=${encodeURIComponent(u.email)}` })),
            ...leads.map(l => ({ type: 'CRM Lead', id: l.id, label: l.name + ' @ ' + (l.organization || 'N/A'), url: `/crm-leads?search=${encodeURIComponent(l.name)}` }))
        ];

        res.json({ success: true, results });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
