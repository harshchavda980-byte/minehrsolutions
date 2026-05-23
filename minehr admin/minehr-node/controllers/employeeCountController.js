const Company = require('../models/Company');
const CompanyPlan = require('../models/CompanyPlan');
const User = require('../models/User');
const EmployeeLimitHistory = require('../models/EmployeeLimitHistory');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Ensure associations are set
if (!Company.associations.Plan) {
    Company.hasOne(CompanyPlan, { foreignKey: 'company_id', as: 'Plan' });
    CompanyPlan.belongsTo(Company, { foreignKey: 'company_id' });
}
if (!EmployeeLimitHistory.associations.Company) {
    EmployeeLimitHistory.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
    EmployeeLimitHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'modifier' });
}

exports.getAllStats = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }

        const { count, rows: companies } = await Company.findAndCountAll({
            where,
            include: [{ model: CompanyPlan, as: 'Plan' }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['name', 'ASC']]
        });

        const stats = await Promise.all(companies.map(async (c) => {
            const employeeCount = await User.count({
                where: {
                    company_id: c.id,
                    role: { [Op.not]: 'Super Admin' }
                }
            });

            const plan = c.Plan || {};
            const limitVal = plan.employee_limit || 10;
            const remaining = Math.max(0, limitVal - employeeCount);

            let limitStatus = 'Within Limit';
            if (employeeCount > limitVal) limitStatus = 'Limit Exceeded';
            else if (employeeCount === limitVal) limitStatus = 'Limit Reached';

            return {
                id: c.id,
                name: c.name,
                employee_limit: limitVal,
                current_count: employeeCount,
                remaining_slots: remaining,
                status: limitStatus,
                plan_id: plan.id
            };
        }));

        let filteredStats = stats;
        if (status) {
            filteredStats = stats.filter(s => s.status === status);
        }

        res.json({
            success: true,
            data: filteredStats,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateLimit = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params; // Company ID
        const { new_limit, reason } = req.body;

        const plan = await CompanyPlan.findOne({ where: { company_id: id } });
        if (!plan) return res.status(404).json({ success: false, message: 'Company plan not found' });

        const old_limit = plan.employee_limit;

        // Update plan
        await plan.update({ employee_limit: new_limit }, { transaction: t });

        // Record history
        await EmployeeLimitHistory.create({
            company_id: id,
            old_limit,
            new_limit,
            changed_by: req.user.id,
            reason,
            changed_at: new Date()
        }, { transaction: t });

        await t.commit();
        res.json({ success: true, message: 'Employee limit updated successfully' });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await EmployeeLimitHistory.findAndCountAll({
            include: [
                { model: Company, as: 'company', attributes: ['name'] },
                { model: User, as: 'modifier', attributes: ['name'] }
            ],
            order: [['changed_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            history: rows,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
