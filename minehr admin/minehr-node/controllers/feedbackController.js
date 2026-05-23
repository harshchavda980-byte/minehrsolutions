const Feedback = require('../models/Feedback');
const EscalationHistory = require('../models/EscalationHistory');
const Company = require('../models/Company');
const User = require('../models/User');
const { logActivity } = require('../utils/logger');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search, company_id, start_date, end_date } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;
        if (company_id) where.company_id = company_id;

        // Date Range Filter
        if (start_date && end_date) {
            where.created_at = {
                [Op.between]: [new Date(start_date), new Date(new Date(end_date).setHours(23, 59, 59))]
            };
        } else if (start_date) {
            where.created_at = { [Op.gte]: new Date(start_date) };
        } else if (end_date) {
            where.created_at = { [Op.lte]: new Date(new Date(end_date).setHours(23, 59, 59)) };
        }

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { subject: { [Op.like]: `%${search}%` } },
                { feedback_id: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Feedback.findAndCountAll({
            where,
            include: [
                { model: Company, as: 'company', attributes: ['name'] },
                { model: User, as: 'assignee', attributes: ['name'] }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Add auto-escalation flag (unresolved & > 3 days old)
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const feedbacks = rows.map(f => {
            const feedbackJson = f.toJSON();
            feedbackJson.is_overdue = feedbackJson.status !== 'Resolved' && new Date(feedbackJson.created_at) < threeDaysAgo;
            return feedbackJson;
        });

        res.json({
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            feedback: feedbacks
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.id, {
            include: [
                { model: Company, as: 'company' },
                { model: User, as: 'assignee' },
                {
                    model: EscalationHistory,
                    as: 'escalations',
                    include: [
                        { model: User, as: 'escalator', attributes: ['name'] },
                        { model: User, as: 'escalatee', attributes: ['name'] }
                    ]
                }
            ]
        });
        if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, email, contact_number, subject, message, company_id } = req.body;

        // Auto-generate Feedback ID: FB-YYYYMMDD-Random
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomChar = Math.random().toString(36).substring(2, 6).toUpperCase();
        const feedback_id = `FB-${dateStr}-${randomChar}`;

        const feedback = await Feedback.create({
            feedback_id,
            name,
            email,
            contact_number,
            subject,
            message,
            company_id
        });

        await logActivity(req, {
            action: 'New Website Feedback',
            module: 'Operations',
            details: { feedback_id, name, subject }
        });

        res.status(201).json({ success: true, feedback });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.escalate = async (req, res) => {
    try {
        const { escalated_to, notes } = req.body;
        const feedback = await Feedback.findByPk(req.params.id);
        if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });

        await feedback.update({ status: 'Escalated', assigned_to: escalated_to });

        await EscalationHistory.create({
            feedback_id: feedback.id,
            action: 'Manual Escalation',
            escalated_by: req.user.id,
            escalated_to,
            notes
        });

        res.json({ success: true, message: 'Feedback escalated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.resolve = async (req, res) => {
    try {
        const { notes } = req.body;
        const feedback = await Feedback.findByPk(req.params.id);
        if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });

        await feedback.update({ status: 'Resolved' });

        await EscalationHistory.create({
            feedback_id: feedback.id,
            action: 'Resolved',
            escalated_by: req.user.id,
            notes: notes || 'Feedback marked as resolved'
        });

        res.json({ success: true, message: 'Feedback resolved' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
