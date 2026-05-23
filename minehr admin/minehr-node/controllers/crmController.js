const Lead = require('../models/Lead');
const LeadInteraction = require('../models/LeadInteraction');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getLeads = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, source, search, assigned_to } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;
        if (source) where.lead_source = source;
        if (assigned_to) where.assigned_to = assigned_to;

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { company_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { lead_id: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Lead.findAndCountAll({
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
            leads: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getLeadDetails = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id, {
            include: [
                { model: User, as: 'assignee', attributes: ['name', 'email'] },
                {
                    model: LeadInteraction,
                    as: 'interactions',
                    include: [{ model: User, as: 'creator', attributes: ['name'] }]
                }
            ],
            order: [[ { model: LeadInteraction, as: 'interactions' }, 'created_at', 'DESC' ]]
        });
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
        res.json(lead);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createLead = async (req, res) => {
    try {
        const { name, email, phone, company_name, lead_source, assigned_to } = req.body;

        // Auto-generate Lead ID: LD-YYYYMMDD-Random
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomChar = Math.random().toString(36).substring(2, 6).toUpperCase();
        const lead_id = `LD-${dateStr}-${randomChar}`;

        const lead = await Lead.create({
            lead_id,
            name,
            email,
            phone,
            company_name,
            lead_source,
            assigned_to
        });

        res.status(201).json({ success: true, lead });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

        await lead.update(req.body);
        res.json({ success: true, lead });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addInteraction = async (req, res) => {
    try {
        const { type, content, attachment_url } = req.body;
        const lead_id = req.params.id;

        const interaction = await LeadInteraction.create({
            lead_id,
            type,
            content,
            created_by: req.user.id,
            attachment_url
        });

        res.status(201).json({ success: true, interaction });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

        await lead.destroy();
        res.json({ success: true, message: 'Lead deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
