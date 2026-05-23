const Job = require('../models/ATS/Job');
const City = require('../models/City');
const State = require('../models/State');
const Country = require('../models/Country');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getJobs = async (req, res) => {
    try {
        const { search, status, department, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;
        if (department) where.department = department;

        const include = [
            {
                model: City,
                as: 'location',
                attributes: ['name'],
                include: [
                    {
                        model: State,
                        as: 'state',
                        attributes: ['name'],
                        include: [
                            {
                                model: Country,
                                as: 'country',
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            },
            {
                model: User,
                as: 'recruiter',
                attributes: ['id', 'name']
            }
        ];

        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { job_id: { [Op.like]: `%${search}%` } },
                { department: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Job.findAndCountAll({
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
            jobs: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createJob = async (req, res) => {
    try {
        const jobData = { ...req.body };
        // Generate Job ID
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        jobData.job_id = `JB-${dateStr}-${random}`;

        const job = await Job.create(jobData);
        res.status(201).json({ success: true, job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        await job.update(req.body);
        res.json({ success: true, job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        await job.destroy();
        res.json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getJobDetails = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id, {
            include: [
                {
                    model: City,
                    as: 'location',
                    include: [{ model: State, as: 'state', include: [{ model: Country, as: 'country' }] }]
                },
                { model: User, as: 'recruiter' }
            ]
        });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
