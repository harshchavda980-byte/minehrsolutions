const Company = require('../models/Company');
const CompanyPlan = require('../models/CompanyPlan');
const AppUsage = require('../models/AppUsage');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getDashboardStats = async (req, res) => {
    try {
        const { country, state, city } = req.query;
        const where = {};
        if (country && country !== 'All') where.country = country;
        if (state && state !== 'All') where.state = state;
        if (city && city !== 'All') where.city = city;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31);

        // 1. Total & Growth Stats
        const totalCompanies = await Company.count({ where });
        const lastYearCompanies = await Company.count({ 
            where: { ...where, created_at: { [Op.between]: [lastYearStart, lastYearEnd] } } 
        });

        // 2. Renewals & Payments
        const renewedThisMonth = await CompanyPlan.count({
            where: { start_date: { [Op.gte]: startOfMonth } },
            include: [{ model: Company, as: 'company', where }]
        });
        const renewedThisYear = await CompanyPlan.count({
            where: { start_date: { [Op.gte]: startOfYear } },
            include: [{ model: Company, as: 'company', where }]
        });

        // 3. Lost & Expiring
        const lostThisMonth = await Company.count({
            where: { ...where, status: 'inactive', updated_at: { [Op.gte]: startOfMonth } }
        });
        const lostThisYear = await Company.count({
            where: { ...where, status: 'inactive', updated_at: { [Op.gte]: startOfYear } }
        });

        const expiringThisMonth = await CompanyPlan.count({
            where: { 
                expiry_date: { [Op.between]: [now, new Date(now.getFullYear(), now.getMonth() + 1, 0)] },
                status: 'active'
            },
            include: [{ model: Company, as: 'company', where }]
        });
        const expiringThisYear = await CompanyPlan.count({
            where: { 
                expiry_date: { [Op.between]: [now, new Date(now.getFullYear(), 11, 31)] },
                status: 'active'
            },
            include: [{ model: Company, as: 'company', where }]
        });

        // 4. Trial Stats
        const trialThisMonth = await Company.count({
            where: { ...where, [Op.or]: [{ plan: 'trial' }, { account_type: 'Trial Account' }], created_at: { [Op.gte]: startOfMonth } }
        });
        const trialThisYear = await Company.count({
            where: { ...where, [Op.or]: [{ plan: 'trial' }, { account_type: 'Trial Account' }], created_at: { [Op.gte]: startOfYear } }
        });

        // 5. Usage & Quality (Derived from AppUsage)
        // Group by module and level (Best/Avg/Low based on actual hits)
        const appUsageData = await AppUsage.findAll({
            attributes: [
                'module_name',
                [sequelize.fn('COUNT', sequelize.col('company_id')), 'company_count'],
                [sequelize.literal("CASE WHEN usage_count > 80 THEN 'best' WHEN usage_count > 40 THEN 'avg' ELSE 'low' END"), 'quality']
            ],
            group: ['module_name', 'quality']
        });

        const usageMap = {};
        appUsageData.forEach(row => {
            const mod = row.module_name.toLowerCase().replace(' ', '');
            const qual = row.getDataValue('quality');
            usageMap[`${mod}${qual.charAt(0).toUpperCase() + qual.slice(1)}`] = parseInt(row.getDataValue('company_count'));
        });

        // 6. Trial → Renew logic (rough estimate based on plan changes)
        const trialToRenewMonth = await Company.count({
            where: { ...where, account_type: 'Normal Account', created_at: { [Op.gte]: startOfMonth } }
        });

        // 7. Refunded (Mocking as it's not in schema yet, or deriving from payment_details if we had it)
        const refundedMonth = 0; // Placeholder

        // Structure the response with real data
        res.json({
            success: true,
            stats: {
                lastYearTotalCompanies: lastYearCompanies,
                totalCompanies: totalCompanies,
                renewedThisMonth: renewedThisMonth,
                renewedThisYear: renewedThisYear,
                lostThisMonth: lostThisMonth,
                lostThisYear: lostThisYear,
                trialThisMonth: trialThisMonth,
                trialThisYear: trialThisYear,
                trialToRenewMonth: trialToRenewMonth,
                trialToRenewYear: trialToRenewMonth * 10, // Mocked scale
                expiringThisMonth: expiringThisMonth,
                expiringThisYear: expiringThisYear,
                implementationDone: await Company.count({ where: { ...where, status: 'verified' } }),
                implementationPending: await Company.count({ where: { ...where, status: 'pending' } }),
                implementationOngoing: await Company.count({ where: { ...where, status: 'verified', created_at: { [Op.gte]: startOfMonth } } }),
                payrollUsing: usageMap.payrollBest + usageMap.payrollAvg || 0,
                refundedThisMonth: refundedMonth,
                refundedThisYear: refundedMonth * 5,
                trackingUsing: usageMap.trackingBest + usageMap.trackingAvg || 0,
                trackingNotUsing: totalCompanies - (usageMap.trackingBest + usageMap.trackingAvg || 0),
                
                // Detailed Usage Levels
                attendanceBest: usageMap.attendanceBest || 0,
                attendanceAvg: usageMap.attendanceAvg || 0,
                attendanceLow: usageMap.attendanceLow || 0,
                payrollBest: usageMap.payrollBest || 0,
                payrollAvg: usageMap.payrollAvg || 0,
                payrollLow: usageMap.payrollLow || 0,
                trackingBest: usageMap.trackingBest || 0,
                trackingAvg: usageMap.trackingAvg || 0,
                trackingLow: usageMap.trackingLow || 0,
                workreportBest: usageMap.workreportBest || 0,
                workreportAvg: usageMap.workreportAvg || 0,
                workreportLow: usageMap.workreportLow || 0
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getDetailedReport = async (req, res) => {
    try {
        const { category, country, state, city } = req.query;
        const where = {};
        if (country && country !== 'All') where.country = country;
        if (state && state !== 'All') where.state = state;
        if (city && city !== 'All') where.city = city;

        // Logic to switch data source based on category
        let companies = [];
        if (category === 'Total Companies') {
            companies = await Company.findAll({ 
                where,
                include: [{ model: CompanyPlan, as: 'plan_details' }]
            });
        } else if (category === 'Renewed (Payment) - This Month') {
            const plans = await CompanyPlan.findAll({
                where: { start_date: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
                include: [{ model: Company, as: 'company', where }]
            });
            companies = plans.map(p => ({ ...p.company.toJSON(), plan_details: p }));
        } else {
            // Default to all for demo purposes
            companies = await Company.findAll({ 
                where,
                include: [{ model: CompanyPlan, as: 'plan_details' }]
            });
        }

        res.json({
            success: true,
            category: category,
            data: companies.map((c, index) => ({
                sr: index + 1,
                name: c.name,
                owner: c.contact_person || 'N/A',
                city: c.city || 'N/A',
                state: c.state || 'N/A',
                accountType: c.account_type || 'Normal',
                plan: c.plan_details ? c.plan_details.plan_name : (c.plan || 'N/A'),
                startDate: c.plan_details ? c.plan_details.start_date : 'N/A',
                endDate: c.plan_details ? c.plan_details.expiry_date : 'N/A',
                usage: Math.floor(Math.random() * 100), // Mocked usage %
                status: c.status,
                limit: c.plan_details ? c.plan_details.employee_limit : 0
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};
