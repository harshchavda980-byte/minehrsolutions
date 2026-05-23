const WorkReport = require('../models/WorkReport');
const User = require('../models/User');
const Company = require('../models/Company');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
    try {
        const { date, type, search } = req.query;
        let where = {};

        if (date) where.report_date = date;
        if (type && type !== 'All') where.report_type = type;
        if (search) {
            where[Op.or] = [
                { report_description: { [Op.like]: `%${search}%` } }
            ];
        }

        const reports = await WorkReport.findAll({
            where,
            include: [
                { model: User, as: 'Trainer', attributes: ['name'] }
            ],
            order: [['report_date', 'DESC'], ['id', 'DESC']]
        });

        // We need to handle Company names manually since they are in a JSON array or we could use a pivot table.
        // For now, let's just return the data and handle names in the frontend or fetch all companies once.
        res.json({ success: true, data: reports });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            trainer_id: req.user.id // From auth middleware
        };
        const report = await WorkReport.create(payload);
        res.json({ success: true, data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const report = await WorkReport.findByPk(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

        await report.update(req.body);
        res.json({ success: true, data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const report = await WorkReport.findByPk(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

        await report.destroy();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
