const Interview = require('../models/ATS/Interview');
const Application = require('../models/ATS/Application');
const Job = require('../models/ATS/Job');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getInterviews = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;

        const include = [
            {
                model: Application,
                as: 'application',
                attributes: ['candidate_name', 'email'],
                include: [{ model: Job, as: 'job', attributes: ['title'] }]
            }
        ];

        if (search) {
            where[Op.or] = [
                { '$application.candidate_name$': { [Op.like]: `%${search}%` } },
                { '$application.job.title$': { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Interview.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['scheduled_at', 'ASC']]
        });

        res.json({
            success: true,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            interviews: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.scheduleInterview = async (req, res) => {
    try {
        const interviewData = { ...req.body };
        // Generate Interview ID
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        interviewData.interview_id = `INT-${dateStr}-${random}`;

        const interview = await Interview.create(interviewData);

        // Update application status automatically
        await Application.update(
            { status: 'Interview Scheduled' },
            { where: { id: interviewData.application_id } }
        );

        res.status(201).json({ success: true, interview });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateInterview = async (req, res) => {
    try {
        const interview = await Interview.findByPk(req.params.id);
        if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

        await interview.update(req.body);
        res.json({ success: true, interview });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteInterview = async (req, res) => {
    try {
        const interview = await Interview.findByPk(req.params.id);
        if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

        await interview.destroy();
        res.json({ success: true, message: 'Interview cancelled/removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
