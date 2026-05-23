const Ticket = require('../models/Ticket');
const TicketHistory = require('../models/TicketHistory');
const Company = require('../models/Company');
const User = require('../models/User');
const { logActivity } = require('../utils/logger');

exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, priority, status, company_id, search } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (priority) where.priority = priority;
        if (status) where.status = status;
        if (company_id) where.company_id = company_id;
        if (search) {
            const { Op } = require('sequelize');
            where[Op.or] = [
                { ticket_id: { [Op.like]: `%${search}%` } },
                { title: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Ticket.findAndCountAll({
            where,
            include: [
                { model: Company, as: 'company', attributes: ['name'] },
                { model: User, as: 'assignee', attributes: ['name'] }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            tickets: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id, {
            include: [
                { model: Company, as: 'company' },
                { model: User, as: 'assignee' },
                { model: TicketHistory, as: 'history', include: [{ model: User, as: 'updater', attributes: ['name'] }] }
            ]
        });
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { title, description, priority, related_module, assigned_to, company_id } = req.body;

        // Auto-generate Ticket ID: TKT-YYYYMMDD-Random
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomChar = Math.random().toString(36).substring(2, 6).toUpperCase();
        const ticket_id = `TKT-${dateStr}-${randomChar}`;

        const ticket = await Ticket.create({
            ticket_id,
            title,
            description,
            priority,
            related_module,
            assigned_to,
            company_id,
            created_by: req.user.id
        });

        await TicketHistory.create({
            ticket_id: ticket.id,
            action: 'Ticket Created',
            notes: 'Initial ticket creation',
            updated_by: req.user.id
        });

        await logActivity(req, {
            action: 'Generate Ticket',
            module: 'Operations',
            details: { ticket_id, title }
        });

        res.status(201).json({ success: true, ticket });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const ticket = await Ticket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

        const oldStatus = ticket.status;
        await ticket.update({ status });

        await TicketHistory.create({
            ticket_id: ticket.id,
            action: `Status Changed: ${oldStatus} -> ${status}`,
            notes: notes || `Status updated to ${status}`,
            updated_by: req.user.id
        });

        res.json({ success: true, message: 'Ticket status updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
