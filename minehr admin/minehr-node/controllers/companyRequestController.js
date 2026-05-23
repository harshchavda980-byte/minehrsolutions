const CompanyRequest = require('../models/CompanyRequest');
const { logActivity } = require('../utils/logger');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search, request_type } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;
        if (request_type) where.request_type = request_type;

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { company_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { request_id: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await CompanyRequest.findAndCountAll({
            where,
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

exports.getOne = async (req, res) => {
    try {
        const request = await CompanyRequest.findByPk(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
        res.json(request);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, mobile, company_name, employees_count, email, request_type, city, country, source } = req.body;

        // Auto-generate Request ID: REQ-YYYYMMDD-Random
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomChar = Math.random().toString(36).substring(2, 6).toUpperCase();
        const request_id = `REQ-${dateStr}-${randomChar}`;

        const request = await CompanyRequest.create({
            request_id,
            name,
            mobile,
            company_name,
            employees_count,
            email,
            request_type,
            city,
            country,
            source
        });

        res.status(201).json({ success: true, request });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.markSolved = async (req, res) => {
    try {
        const request = await CompanyRequest.findByPk(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        await request.update({ status: 'Solved' });

        await logActivity(req, {
            action: 'Company Request Solved',
            module: 'Operations',
            details: { request_id: request.request_id, company_name: request.company_name }
        });

        res.json({ success: true, message: 'Request marked as solved' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const request = await CompanyRequest.findByPk(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        await request.destroy();

        await logActivity(req, {
            action: 'Company Request Deleted',
            module: 'Operations',
            details: { request_id: request.request_id }
        });

        res.json({ success: true, message: 'Request deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
