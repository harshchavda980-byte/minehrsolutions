const Job = require('../models/ATS/Job');
const Application = require('../models/ATS/Application');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

exports.getHiringMetrics = async (req, res) => {
    try {
        // 1. Applications by Status
        const statusCounts = await Application.findAll({
            attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['status']
        });

        // 2. Applications by Job Role (Top 5)
        const jobCounts = await Application.findAll({
            include: [{ model: Job, as: 'job', attributes: ['title'] }],
            attributes: [[sequelize.fn('COUNT', sequelize.col('Application.id')), 'count']],
            group: ['job_id', 'job.id', 'job.title'],
            limit: 5,
            order: [[sequelize.fn('COUNT', sequelize.col('Application.id')), 'DESC']]
        });

        // 3. Application Trend (Last 6 months)
        // Simplified for this demo - just returns static mapping if DB is empty or simple count
        const trend = await Application.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('Application.created_at'), '%Y-%m'), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['month'],
            order: [['month', 'ASC']],
            limit: 6
        });

        res.json({
            success: true,
            statusCounts,
            jobCounts,
            trend
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
