const Application = require('../models/ATS/Application');
const Job = require('../models/ATS/Job');
const User = require('../models/User');
const CandidateNote = require('../models/ATS/CandidateNote');
const { Op } = require('sequelize');

exports.getApplications = async (req, res) => {
    try {
        const { search, status, job_id, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;
        if (job_id) where.job_id = job_id;

        const include = [
            {
                model: Job,
                as: 'job',
                attributes: ['title', 'department']
            },
            {
                model: User,
                as: 'assignedRecruiter',
                attributes: ['id', 'name']
            }
        ];

        if (search) {
            where[Op.or] = [
                { candidate_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { application_id: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Application.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            applications: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createApplication = async (req, res) => {
    try {
        const appData = { ...req.body };
        // Generate Application ID
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        appData.application_id = `APP-${dateStr}-${random}`;

        const application = await Application.create(appData);
        res.status(201).json({ success: true, application });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getApplicationDetails = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id, {
            include: [
                { model: Job, as: 'job' },
                { model: User, as: 'assignedRecruiter' }
            ]
        });
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        const notes = await CandidateNote.findAll({
            where: { application_id: req.params.id },
            include: [{ model: User, as: 'author', attributes: ['name'] }],
            order: [['created_at', 'DESC']]
        });

        res.json({ success: true, application, notes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        await application.update(req.body);
        res.json({ success: true, application });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addNote = async (req, res) => {
    try {
        const { application_id, note } = req.body;
        const candidateNote = await CandidateNote.create({
            application_id,
            user_id: req.user.id,
            note
        });

        const noteWithAuthor = await CandidateNote.findByPk(candidateNote.id, {
            include: [{ model: User, as: 'author', attributes: ['name'] }]
        });

        res.status(201).json({ success: true, note: noteWithAuthor });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        await application.destroy();
        res.json({ success: true, message: 'Application removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
