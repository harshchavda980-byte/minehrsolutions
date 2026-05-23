const TrainingBatch = require('../models/TrainingBatch');
const { Op } = require('sequelize');

// GET all batches
exports.getAll = async (req, res) => {
    try {
        const { search } = req.query;
        const where = {};
        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }

        const batches = await TrainingBatch.findAll({
            where,
            order: [['created_at', 'DESC']]
        });

        res.json({ success: true, data: batches });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET one batch
exports.getOne = async (req, res) => {
    try {
        const batch = await TrainingBatch.findByPk(req.params.id);
        if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
        res.json({ success: true, data: batch });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// CREATE batch
exports.create = async (req, res) => {
    try {
        const batch = await TrainingBatch.create(req.body);
        res.json({ success: true, data: batch });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE batch
exports.update = async (req, res) => {
    try {
        const batch = await TrainingBatch.findByPk(req.params.id);
        if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
        
        await batch.update(req.body);
        res.json({ success: true, data: batch });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE batch
exports.delete = async (req, res) => {
    try {
        const batch = await TrainingBatch.findByPk(req.params.id);
        if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
        
        await batch.destroy();
        res.json({ success: true, message: 'Batch deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
