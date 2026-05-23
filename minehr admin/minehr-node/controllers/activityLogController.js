const ActivityLog = require('../models/ActivityLog');
const Company = require('../models/Company');
const User = require('../models/User');
const { Op } = require('sequelize');

// Define associations for logs
if (!ActivityLog.associations.Company) {
    ActivityLog.belongsTo(Company, { foreignKey: 'company_id' });
    ActivityLog.belongsTo(User, { foreignKey: 'user_id' });
}

exports.getAllLogs = async (req, res) => {
    try {
        const { search, module, start_date, end_date, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (module) where.module = module;
        if (start_date || end_date) {
            where.created_at = {};
            if (start_date) where.created_at[Op.gte] = new Date(start_date);
            if (end_date) where.created_at[Op.lte] = new Date(end_date);
        }

        const companyWhere = {};
        const userWhere = {};
        if (search) {
            // Complex search: find by company name or user name
            // We'll handle this by including both and using Op.or if possible, 
            // but for simplicity and performance we'll search across name fields
            companyWhere.name = { [Op.like]: `%${search}%` };
            // Note: In a real app we might need a more complex join or separate search fields
        }

        const { count, rows: logs } = await ActivityLog.findAndCountAll({
            where,
            include: [
                {
                    model: Company,
                    attributes: ['id', 'name'],
                    where: Object.keys(companyWhere).length ? companyWhere : null,
                    required: false
                },
                {
                    model: User,
                    attributes: ['id', 'name'],
                    required: false
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            logs,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (err) {
        console.error('Fetch logs error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getLogById = async (req, res) => {
    try {
        const log = await ActivityLog.findByPk(req.params.id, {
            include: [
                { model: Company, attributes: ['id', 'name'], required: false },
                { model: User, attributes: ['id', 'name'], required: false }
            ]
        });

        if (!log) {
            return res.status(404).json({ success: false, message: 'Log not found' });
        }

        res.json({ success: true, log });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
