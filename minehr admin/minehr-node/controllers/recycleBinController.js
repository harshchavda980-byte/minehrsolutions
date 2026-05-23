const User = require('../models/User');
const Company = require('../models/Company');
const Intimation = require('../models/Intimation');
const Device = require('../models/Device');
const ActivityLog = require('../models/ActivityLog');
const { Op } = require('sequelize');

exports.getDeletedItems = async (req, res) => {
    try {
        const { category, search, module: moduleFilter, companyId, dateFrom, dateTo, status, sortBy = 'deleted_at', order = 'DESC' } = req.query;

        let whereClause = { deleted_at: { [Op.ne]: null } };

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { id: search }
            ];
        }

        if (dateFrom && dateTo) {
            whereClause.deleted_at = { [Op.between]: [new Date(dateFrom), new Date(dateTo)] };
        } else if (dateFrom) {
            whereClause.deleted_at = { [Op.gte]: new Date(dateFrom) };
        } else if (dateTo) {
            whereClause.deleted_at = { [Op.lte]: new Date(dateTo) };
        }

        const models = [];
        if (!category || category === 'All') {
            models.push({ model: Company, type: 'Company' });
            models.push({ model: User, type: 'User' });
            models.push({ model: Intimation, type: 'Intimation' });
        } else {
            if (category === 'Companies') models.push({ model: Company, type: 'Company' });
            else if (category === 'Users') models.push({ model: User, type: 'User' });
            else if (category === 'Automations') models.push({ model: Intimation, type: 'Intimation' });
            else if (category === 'Devices') models.push({ model: Device, type: 'Device' });
        }

        let allItems = [];
        for (const { model, type } of models) {
            const items = await model.findAll({
                where: whereClause,
                paranoid: false,
                include: [
                    { model: User, as: 'deletedByUser', attributes: ['id', 'name'], required: false }
                ]
            });

            allItems = allItems.concat(items.map(item => ({
                id: item.id,
                name: item.name || item.intimation_id || 'N/A',
                type: type,
                deleted_at: item.deleted_at,
                purge_at: item.purge_at,
                deleted_by: item.deletedByUser ? item.deletedByUser.name : 'Unknown',
                company_name: item.company ? item.company.name : (type === 'Company' ? item.name : 'N/A'),
                status: 'Pending Deletion'
            })));
        }

        // Apply module filter if present
        if (moduleFilter) {
            allItems = allItems.filter(i => i.type === moduleFilter);
        }

        // Sort results
        allItems.sort((a, b) => {
            const valA = a[sortBy];
            const valB = b[sortBy];
            if (order === 'ASC') return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });

        res.json({ success: true, items: allItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.restoreItem = async (req, res) => {
    try {
        const { type, id } = req.body;
        let model;
        if (type === 'User') model = User;
        else if (type === 'Company') model = Company;
        else if (type === 'Intimation') model = Intimation;
        else if (type === 'Device') model = Device;
        else return res.status(400).json({ success: false, message: 'Invalid type' });

        const item = await model.findByPk(id, { paranoid: false });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

        await item.restore();

        // Recursive restoration for Companies
        if (type === 'Company') {
            await User.restore({ where: { company_id: id, deleted_at: { [Op.ne]: null } } });
            // Add other child models here as they are identified
        }

        // Audit Log
        await ActivityLog.create({
            user_id: req.user ? req.user.id : null,
            action: 'RESTORE_RECORD',
            module: 'Recycle Bin',
            details: { type, id, name: item.name || item.intimation_id },
            ip_address: req.ip
        });

        res.json({ success: true, message: `${type} restored successfully` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.permanentDelete = async (req, res) => {
    try {
        const { type, id } = req.body;
        let model;
        if (type === 'User') model = User;
        else if (type === 'Company') model = Company;
        else if (type === 'Intimation') model = Intimation;
        else if (type === 'Device') model = Device;
        else return res.status(400).json({ success: false, message: 'Invalid type' });

        const item = await model.findByPk(id, { paranoid: false });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

        const itemName = item.name || item.intimation_id;

        // For Companies, permanently delete related records
        if (type === 'Company') {
            await User.destroy({ where: { company_id: id }, force: true, paranoid: false });
        }

        await item.destroy({ force: true });

        // Audit Log
        await ActivityLog.create({
            user_id: req.user ? req.user.id : null,
            action: 'PERMANENT_DELETE',
            module: 'Recycle Bin',
            details: { type, id, name: itemName },
            ip_address: req.ip
        });

        res.json({ success: true, message: `${type} permanently deleted` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.bulkRestore = async (req, res) => {
    try {
        const { items } = req.body; // Array of { type, id }
        if (!items || !Array.isArray(items)) return res.status(400).json({ success: false, message: 'Invalid items array' });

        for (const { type, id } of items) {
            let model;
            if (type === 'User') model = User;
            else if (type === 'Company') model = Company;
            else if (type === 'Intimation') model = Intimation;
            else if (type === 'Device') model = Device;
            else continue;

            const item = await model.findByPk(id, { paranoid: false });
            if (item) {
                await item.restore();
                if (type === 'Company') {
                    await User.restore({ where: { company_id: id, deleted_at: { [Op.ne]: null } } });
                }
            }
        }

        // Audit Log for bulk action
        await ActivityLog.create({
            user_id: req.user ? req.user.id : null,
            action: 'BULK_RESTORE',
            module: 'Recycle Bin',
            details: { count: items.length },
            ip_address: req.ip
        });

        res.json({ success: true, message: 'Bulk restoration completed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.bulkPermanentDelete = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) return res.status(400).json({ success: false, message: 'Invalid items array' });

        for (const { type, id } of items) {
            let model;
            if (type === 'User') model = User;
            else if (type === 'Company') model = Company;
            else if (type === 'Intimation') model = Intimation;
            else if (type === 'Device') model = Device;
            else continue;

            const item = await model.findByPk(id, { paranoid: false });
            if (item) {
                if (type === 'Company') {
                    await User.destroy({ where: { company_id: id }, force: true, paranoid: false });
                }
                await item.destroy({ force: true });
            }
        }

        // Audit Log for bulk action
        await ActivityLog.create({
            user_id: req.user ? req.user.id : null,
            action: 'BULK_PERMANENT_DELETE',
            module: 'Recycle Bin',
            details: { count: items.length },
            ip_address: req.ip
        });

        res.json({ success: true, message: 'Bulk permanent deletion completed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
