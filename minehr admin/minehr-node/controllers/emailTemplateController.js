const EmailTemplate = require('../models/EmailTemplate');
const User = require('../models/User');

exports.getAll = async (req, res) => {
    try {
        const templates = await EmailTemplate.findAll({
            include: [{ model: User, as: 'Creator', attributes: ['name'] }],
            order: [['created_at', 'DESC']]
        });
        res.json({ success: true, data: templates });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            added_by: req.user.id
        };
        const template = await EmailTemplate.create(payload);
        res.json({ success: true, data: template });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const template = await EmailTemplate.findByPk(req.params.id);
        if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

        await template.update(req.body);
        res.json({ success: true, data: template });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const template = await EmailTemplate.findByPk(req.params.id);
        if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

        await template.destroy();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
