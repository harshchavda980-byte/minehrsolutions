const ActivityLog = require('../models/ActivityLog');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const MODULE_NAME_MAP = {
    'auth': 'Authentication',
    'users': 'Employees',
    'companies': 'Company Management',
    'usage': 'App Usage',
    'crm': 'Leads & CRM',
    'tickets': 'Support Tickets',
    'ats': 'Recruitment',
    'banners': 'App Banners',
    'system': 'System Core',
    'reports': 'Analytics Reports',
    'attendance': 'Attendance',
    'leaves': 'Leave Request',
    'payslip': 'Payslip',
    'circular': 'Circular',
    'visits': 'My Visits',
    'work_report': 'Work Report',
    'expense': 'My Expense',
    'take_order': 'Take Order',
    'sales': 'Sales',
    'timeline': 'Timeline',
    'chat': 'Chat',
    'tasks': 'Tasks',
    'documents': 'Documents',
    'discussion': 'Discussion',
    'work_allocation': 'Work Allocation',
    'targets': 'Targets & Achievements',
    'assets': 'Assets',
    'holiday': 'Holiday',
    'id_card': 'My ID Card',
    'tax': 'Tax Exemption',
    'bank': 'Bank Accounts',
    'profile': 'My Profile',
    'salary': 'Advance Salary',
    'wfh': 'WFH',
    'gallery': 'Gallery',
    'loan': 'Loan',
    'matrix': 'Performance Matrix',
    'events': 'Events',
    'visiting_card': 'Visiting Card',
    'appointments': 'Appointments',
    'notes': 'My Notes',
    'meetings': 'Meetings',
    'openings': 'Current Openings',
    'parking': 'Parking',
    'company_info': 'Company Info',
    'greetings': 'Greetings',
    'reminders': 'Reminders',
    'survey': 'Survey',
    'penalty': 'Penalty',
    'visitors': 'Visitors',
    'lms': 'LMS',
    'idea_box': 'Idea Box',
    'complain': 'Complain',
    'vendors': 'Vendors',
    'support': 'Support',
    'polls': 'Polls',
    'scanner': 'QR/Barcode Scanner',
    'lost_found': 'Lost & Found',
    'escalation': 'Escalation',
    'sos': 'SOS',
    'emergency': 'Emergency',
    'canteen': 'Canteen'
};

const COLORS = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
    '#009688', '#FF9800', '#2196F3', '#4CAF50', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4',
    '#FF5722', '#795548', '#607D8B', '#34495e', '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
    '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
];

exports.getUsageStats = async (req, res) => {
    try {
        const { month, year } = req.query;
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        const mIndex = monthNames.indexOf(month || 'March');
        const yValue = parseInt(year || new Date().getFullYear());
        
        const startDate = new Date(yValue, mIndex, 1);
        const endDate = new Date(yValue, mIndex + 1, 0, 23, 59, 59);

        // Fetch aggregated real-time data from ActivityLog
        const records = await ActivityLog.findAll({
            attributes: [
                'module',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                created_at: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['module'],
            order: [[sequelize.literal('count'), 'DESC']]
        });

        // 1. Group real records by mapped display name to merge any duplicate raw keys
        const groupedStats = {};
        records.forEach(r => {
            const rawName = r.getDataValue('module') || '';
            const count = parseInt(r.getDataValue('count')) || 0;
            const normName = rawName.toLowerCase().trim();
            if (!normName || /^\d+$/.test(normName)) return; // Filter out empty or numeric system noise
            
            const displayName = MODULE_NAME_MAP[normName] || (rawName.charAt(0).toUpperCase() + rawName.slice(1));
            
            if (groupedStats[displayName]) {
                groupedStats[displayName].value += count;
            } else {
                groupedStats[displayName] = {
                    name: displayName,
                    value: count
                };
            }
        });

        // 2. Convert to stats array and assign theme colors
        let stats = Object.values(groupedStats);
        stats.forEach((s, i) => {
            s.color = COLORS[i % COLORS.length];
        });

        // 3. Sort by count descending
        stats.sort((a, b) => b.value - a.value);

        res.json({ success: true, month: month || 'March', year: yValue, stats });
    } catch (error) {
        console.error('Usage Stats Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/usage/record — increment a module's usage count
exports.recordUsage = async (req, res) => {
    try {
        const { module_name, month, year, company_id } = req.body;
        if (!module_name || !month || !year) {
            return res.status(400).json({ message: 'module_name, month, year required' });
        }

        // Using ActivityLog as the primary source of truth now
        await ActivityLog.create({
            action: 'MODULE_ENGAGEMENT',
            module: module_name,
            details: { month, year, company_id }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Record Usage Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
