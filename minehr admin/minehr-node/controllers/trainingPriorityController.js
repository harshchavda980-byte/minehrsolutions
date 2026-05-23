const TrainingPriority = require('../models/TrainingPriority');

exports.getAll = async (req, res) => {
    try {
        const priorities = await TrainingPriority.findAll({
            order: [['display_order', 'ASC'], ['id', 'ASC']]
        });
        res.json({ success: true, data: priorities });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const priority = await TrainingPriority.create(req.body);
        res.json({ success: true, data: priority });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const priority = await TrainingPriority.findByPk(req.params.id);
        if (!priority) return res.status(404).json({ success: false, message: 'Priority not found' });
        await priority.update(req.body);
        res.json({ success: true, data: priority });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const priority = await TrainingPriority.findByPk(req.params.id);
        if (!priority) return res.status(404).json({ success: false, message: 'Priority not found' });
        await priority.destroy();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
