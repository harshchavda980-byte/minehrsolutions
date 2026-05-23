const Company = require('../models/Company');
const User = require('../models/User');
const Intimation = require('../models/Intimation');
const { Op } = require('sequelize');

exports.getRecycleBinItems = async (req, res) => {
    try {
        // Fetch soft-deleted items from various models
        const companies = await Company.findAll({ where: { deleted_at: { [Op.ne]: null } }, paranoid: false });
        const users = await User.findAll({ where: { deleted_at: { [Op.ne]: null } }, paranoid: false });
        const intimations = await Intimation.findAll({ where: { deleted_at: { [Op.ne]: null } }, paranoid: false });

        const items = [
            ...companies.map(c => ({ id: c.id, type: 'Company', name: c.name, deleted_at: c.deleted_at })),
            ...users.map(u => ({ id: u.id, type: 'User', name: u.name, deleted_at: u.deleted_at })),
            ...intimations.map(i => ({ id: i.id, type: 'Intimation', name: i.intimation_id, deleted_at: i.deleted_at }))
        ];

        // Sort by deleted_at descending
        items.sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));

        res.json({ success: true, items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.restoreItem = async (req, res) => {
    const { type, id } = req.params;
    try {
        let model;
        if (type === 'Company') model = Company;
        else if (type === 'User') model = User;
        else if (type === 'Intimation') model = Intimation;
        else return res.status(400).json({ success: false, message: 'Invalid type' });

        const item = await model.findByPk(id, { paranoid: false });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

        await item.restore();
        res.json({ success: true, message: `${type} restored successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.cleanupOldItems = async () => {
    try {
        // Permanently delete items older than 15 days from the recycle bin
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        const models = [Company, User, Intimation];
        for (const model of models) {
            await model.destroy({
                where: {
                    deleted_at: {
                        [Op.lt]: fifteenDaysAgo
                    }
                },
                force: true, // Permanent delete after 15 days
                paranoid: false
            });
        }
        console.log('Recycle bin cleanup completed');
    } catch (error) {
        console.error('Recycle bin cleanup error:', error);
    }
};
