const Device = require('../models/Device');
const Company = require('../models/Company');
const User = require('../models/User');
const { Op } = require('sequelize');
const { logActivity } = require('../utils/logger');

exports.getAll = async (req, res) => {
    try {
        const { type, city, status, search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (type && type !== 'All') where.device_type = type;
        if (city && city !== 'All') where.city_name = city;
        if (status && status !== 'All') where.status = status;

        if (search) {
            where[Op.or] = [
                { device_id: { [Op.like]: `%${search}%` } },
                { imei_no: { [Op.like]: `%${search}%` } },
                { city_name: { [Op.like]: `%${search}%` } },
                { installed_by: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Device.findAndCountAll({
            where,
            include: [
                { model: Company, as: 'company', attributes: ['id', 'name'] },
                { model: User, as: 'admin', attributes: ['id', 'name'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            devices: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id, {
            include: [
                { model: Company, as: 'company' },
                { model: User, as: 'admin' }
            ]
        });
        if (!device) return res.status(404).json({ success: false, message: 'Device not found' });
        res.json({ success: true, device });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const device = await Device.create(req.body);
        
        await logActivity(req, {
            action: 'Create Device',
            module: 'Devices',
            details: { device_id: device.device_id, type: device.device_type }
        });

        res.status(201).json({ success: true, device });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id);
        if (!device) return res.status(404).json({ success: false, message: 'Device not found' });
        
        await device.update(req.body);

        await logActivity(req, {
            action: 'Update Device',
            module: 'Devices',
            details: { device_id: device.device_id, updated_fields: Object.keys(req.body) }
        });

        res.json({ success: true, device });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id);
        if (!device) return res.status(404).json({ success: false, message: 'Device not found' });

        await device.destroy({ user: req.user });

        await logActivity(req, {
            action: 'Delete Device (Soft)',
            module: 'Devices',
            details: { device_id: device.device_id }
        });

        res.json({ success: true, message: 'Device moved to Recycle Bin' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const total = await Device.count();
        const inTrial = await Device.count({ where: { status: 'In Trial' } });
        const inHouse = await Device.count({ where: { status: 'In House' } });
        const active = await Device.count({ where: { status: 'Active' } });
        
        res.json({
            success: true,
            stats: { total, inTrial, inHouse, active }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
