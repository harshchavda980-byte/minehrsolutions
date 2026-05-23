const TrainingModule = require('../models/TrainingModule');
const { Op } = require('sequelize');

// GET All Modules
exports.getAll = async (req, res) => {
    try {
        const { search, type, priority, status } = req.query;
        let where = {};

        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }
        if (type && type !== 'All') {
            where.type = type;
        }
        if (priority && priority !== 'All') {
            where.priority = priority;
        }
        if (status && status !== 'All') {
            where.status = status;
        }

        const modules = await TrainingModule.findAll({
            where,
            order: [['display_order', 'ASC'], ['id', 'DESC']]
        });

        res.json({ success: true, data: modules });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// CREATE Module
exports.create = async (req, res) => {
    try {
        const module = await TrainingModule.create(req.body);
        res.json({ success: true, data: module });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE Module
exports.update = async (req, res) => {
    try {
        const module = await TrainingModule.findByPk(req.params.id);
        if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

        await module.update(req.body);
        res.json({ success: true, data: module });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE Module
exports.delete = async (req, res) => {
    try {
        const module = await TrainingModule.findByPk(req.params.id);
        if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

        await module.destroy();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE Order
exports.updateOrder = async (req, res) => {
    try {
        const { orders } = req.body; // Array of { id, display_order }
        for (const item of orders) {
            await TrainingModule.update(
                { display_order: item.display_order },
                { where: { id: item.id } }
            );
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
