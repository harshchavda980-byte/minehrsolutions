const CompanyPlan = require('../models/CompanyPlan');
const Company = require('../models/Company');
const { Op } = require('sequelize');
const { logActivity } = require('../utils/logger');

// Association (define associations for queries)
if (!Company.hasAlias && !Company.associations.Plan) {
    Company.hasOne(CompanyPlan, { foreignKey: 'company_id', as: 'Plan' });
    CompanyPlan.belongsTo(Company, { foreignKey: 'company_id' });
}

// Helper to compute status
const computeStatus = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (expiry < today) return 'expired';
    if (diffDays <= 7) return 'expiring';
    return 'active';
};

// Get all plans with filtering and pagination
exports.getAll = async (req, res) => {
    try {
        const { search, plan_type, status, start_date, end_date, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        const companyWhere = {};

        if (plan_type) where.plan_name = plan_type;
        if (status) where.status = status;
        if (start_date || end_date) {
            where.expiry_date = {};
            if (start_date) where.expiry_date[Op.gte] = start_date;
            if (end_date) where.expiry_date[Op.lte] = end_date;
        }

        if (search) {
            companyWhere.name = { [Op.like]: `%${search}%` };
        }

        const { count, rows: plans } = await CompanyPlan.findAndCountAll({
            where,
            include: [{
                model: Company,
                where: Object.keys(companyWhere).length ? companyWhere : null,
                attributes: ['id', 'name', 'company_code', 'contact_mobile']
            }],
            order: [['expiry_date', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Dynamic status check (in case DB is not updated by a cron)
        const updatedPlans = plans.map(p => {
            const currentStatus = computeStatus(p.expiry_date);
            if (p.status !== currentStatus) {
                p.update({ status: currentStatus });
            }
            return p;
        });

        res.json({
            success: true,
            plans: updatedPlans,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get plan details including history and payments
exports.getDetails = async (req, res) => {
    try {
        const plan = await CompanyPlan.findByPk(req.params.id, {
            include: [{ model: Company }]
        });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.json({ success: true, plan });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update plan (Upgrade, Extend, etc.)
exports.updatePlan = async (req, res) => {
    try {
        const { plan_name, plan_duration, expiry_date, payment_info } = req.body;
        const plan = await CompanyPlan.findByPk(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const historyItem = {
            old_plan: plan.plan_name,
            old_expiry: plan.expiry_date,
            new_plan: plan_name || plan.plan_name,
            new_expiry: expiry_date || plan.expiry_date,
            updated_at: new Date()
        };

        let history = plan.plan_history;
        if (typeof history === 'string') {
            try { history = JSON.parse(history); } catch (e) { history = []; }
        }
        if (!Array.isArray(history)) history = [];
        history.push(historyItem);

        const status = computeStatus(expiry_date || plan.expiry_date);

        await plan.update({
            plan_name: plan_name || plan.plan_name,
            plan_duration: plan_duration || plan.plan_duration,
            expiry_date: expiry_date || plan.expiry_date,
            status,
            plan_history: history,
            payment_details: payment_info || plan.payment_details
        });

        await logActivity(req, {
            company_id: plan.company_id,
            action: 'Update Plan',
            module: 'Plans',
            details: { old_plan: historyItem.old_plan, new_plan: historyItem.new_plan }
        });

        res.json({ success: true, plan });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Legacy renew (keeping for compatibility if needed, but enhanced)
exports.renew = async (req, res) => {
    try {
        const { company_id, plan_name, start_date, expiry_date, plan_duration } = req.body;
        const status = computeStatus(expiry_date);

        const [plan, created] = await CompanyPlan.findOrCreate({
            where: { company_id },
            defaults: { plan_name, start_date, expiry_date, status, plan_duration }
        });

        if (!created) {
            let history = plan.plan_history;
            if (typeof history === 'string') {
                try { history = JSON.parse(history); } catch (e) { history = []; }
            }
            if (!Array.isArray(history)) history = [];
            history.push({
                old_expiry: plan.expiry_date,
                new_expiry: expiry_date,
                updated_at: new Date()
            });
            await plan.update({ plan_name, start_date, expiry_date, status, plan_duration, plan_history: history });
        }

        res.json({ success: true, plan });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
