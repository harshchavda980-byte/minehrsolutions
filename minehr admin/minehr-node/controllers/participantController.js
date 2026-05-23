const Participant = require('../models/Participant');

exports.getAll = async (req, res) => {
    try {
        const participants = await Participant.findAll({ order: [['id', 'ASC']] });
        res.json({ success: true, data: participants });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const participant = await Participant.create(req.body);
        res.json({ success: true, data: participant });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const participant = await Participant.findByPk(req.params.id);
        if (!participant) return res.status(404).json({ success: false, message: 'Participant not found' });
        await participant.update(req.body);
        res.json({ success: true, data: participant });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const participant = await Participant.findByPk(req.params.id);
        if (!participant) return res.status(404).json({ success: false, message: 'Participant not found' });
        await participant.destroy();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
