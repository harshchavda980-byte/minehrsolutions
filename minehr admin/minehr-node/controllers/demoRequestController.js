const DemoRequest = require('../models/DemoRequest');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getDemoRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, source, search, assigned_to } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;
        if (source) where.request_source = source;
        if (assigned_to) where.assigned_to = assigned_to;

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { company_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { request_id: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await DemoRequest.findAndCountAll({
            where,
            include: [{ model: User, as: 'assignee', attributes: ['name'] }],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            requests: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getDemoRequestDetails = async (req, res) => {
    try {
        const request = await DemoRequest.findByPk(req.params.id, {
            include: [{ model: User, as: 'assignee', attributes: ['name', 'email'] }]
        });
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
        res.json(request);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateDemoRequest = async (req, res) => {
    try {
        const request = await DemoRequest.findByPk(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        await request.update(req.body);
        res.json({ success: true, request });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteDemoRequest = async (req, res) => {
    try {
        const request = await DemoRequest.findByPk(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        await request.destroy();
        res.json({ success: true, message: 'Request deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createDemoRequest = async (req, res) => {
    try {
        const { name, email, phone, company_name, product_interest, request_source } = req.body;
        
        // LD style ID: DM-YYYYMMDD-Random
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomChar = Math.random().toString(36).substring(2, 6).toUpperCase();
        const request_id = `DM-${dateStr}-${randomChar}`;

        const request = await DemoRequest.create({
            request_id,
            name,
            email,
            phone,
            company_name,
            product_interest,
            request_source
        });

        res.status(201).json({ success: true, request });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
