const Company = require('../models/Company');
const User = require('../models/User');
const CompanyPlan = require('../models/CompanyPlan');
const sequelize = require('../config/database');
const { logActivity } = require('../utils/logger');

exports.getAll = async (req, res) => {
    try {
        const { status, page, limit, search } = req.query;
        const { Op } = require('sequelize');
        const where = {};
        if (status) where.status = status;

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { company_code: { [Op.like]: `%${search}%` } },
                { city: { [Op.like]: `%${search}%` } },
                { contact_mobile: { [Op.like]: `%${search}%` } }
            ];
        }

        if (page && limit) {
            const offset = (parseInt(page) - 1) * parseInt(limit);
            const { count, rows } = await Company.findAndCountAll({
                where,
                include: [
                    {
                        model: User,
                        as: 'users',
                        where: { role: 'Company Admin' },
                        required: false
                    },
                    {
                        model: CompanyPlan,
                        as: 'plan_details'
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
                distinct: true
            });

            return res.json({
                total: count,
                pages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                companies: rows
            });
        }

        const companies = await Company.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'users',
                    where: { role: 'Company Admin' },
                    required: false
                },
                {
                    model: CompanyPlan,
                    as: 'plan_details'
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const companies = await Company.findAll();

        const totalCompanies = companies.length;
        const totalEmployees = companies.reduce((sum, c) => sum + (c.employee_count || 0), 0);

        const verified = companies.filter(c => c.status === 'verified').length;
        const pending = companies.filter(c => c.status === 'pending').length;
        const rejected = companies.filter(c => c.status === 'rejected').length;

        // Build per-company employee breakdown for chart
        const companyLabels = companies.map(c => c.name);
        const companyEmployees = companies.map(c => c.employee_count || 0);

        // Plan breakdown
        const basic = companies.filter(c => c.plan === 'basic').length;
        const pro = companies.filter(c => c.plan === 'pro').length;
        const enterprise = companies.filter(c => c.plan === 'enterprise').length;

        // Build company details for the table report
        const companyDetails = companies.map(c => ({
            name: c.name,
            industry: c.industry_type || 'General',
            employeeCount: c.employee_count || 0,
            plan: c.plan || 'basic',
            status: c.status || 'pending',
            createdAt: c.createdAt
        }));

        res.json({
            success: true,
            stats: {
                totalCompanies,
                totalEmployees,
                verified,
                pending,
                rejected,
                basic,
                pro,
                enterprise
            },
            charts: {
                companyLabels,
                companyEmployees,
                companyDetails
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getOne = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: 'Not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const company = await Company.create(req.body);

        await logActivity(req, {
            company_id: company.id,
            action: 'Create Company',
            module: 'Companies',
            details: { company_name: company.name, code: company.company_code }
        });

        res.status(201).json(company);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: 'Not found' });
        await company.update(req.body);

        await logActivity(req, {
            company_id: company.id,
            action: 'Update Company',
            module: 'Companies',
            details: { updated_fields: Object.keys(req.body) }
        });

        res.json(company);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: 'Not found' });
        
        // Pass user context to hooks for audit (deleted_by)
        await company.destroy({ user: req.user });
        
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.register = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            company_name, company_email, company_mobile, company_address,
            city, state, country,
            admin_name, admin_email, admin_mobile,
            plan_type, employee_limit, plan_start_date, plan_expiry_date,
            
            // New fields
            is_rise_event, account_type, pincode, industry_type, currency,
            company_base_url, end_url_name, trial_days, expected_team_size,
            employee_tracking_limit, yearly_ticket_size, resolved_ticket_size,
            per_employee_price, sales_person_name, implementation_executive_name,
            year_type, company_priority, training_type, company_remark,
            latitude, longitude, company_code
        } = req.body;

        // 1. Validation
        if (company_email) {
            const existingCompany = await Company.findOne({ where: { email: company_email } });
            if (existingCompany) {
                return res.status(400).json({ success: false, message: 'Company email already exists.' });
            }
        }

        if (admin_email) {
            const existingAdmin = await User.findOne({ where: { email: admin_email } });
            if (existingAdmin) {
                return res.status(400).json({ success: false, message: 'Admin email already exists.' });
            }
        }

        // 2. Create Company
        const company = await Company.create({
            name: company_name,
            email: company_email,
            contact_mobile: company_mobile,
            address: company_address,
            city, state, country,
            company_code: company_code || (company_name.substring(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 900)),
            status: 'pending', // Registration starts as pending
            plan: plan_type ? plan_type.toLowerCase() : 'basic',

            is_rise_event, account_type, pincode, industry_type, currency,
            company_base_url, end_url_name, trial_days, expected_team_size,
            employee_tracking_limit, yearly_ticket_size, resolved_ticket_size,
            per_employee_price, sales_person_name, implementation_executive_name,
            year_type, company_priority, training_type, company_remark,
            latitude, longitude
        }, { transaction: t });

        // 3. Create Admin User for Company
        const admin = await User.create({
            name: admin_name,
            email: admin_email,
            phone: admin_mobile,
            password: 'password123', // Default password
            role: 'Company Admin',
            company_id: company.id
        }, { transaction: t });

        // 4. Create Company Plan
        await CompanyPlan.create({
            company_id: company.id,
            plan_name: plan_type,
            employee_limit: parseInt(employee_limit) || 10,
            start_date: plan_start_date,
            expiry_date: plan_expiry_date,
            status: 'active'
        }, { transaction: t });

        await t.commit();

        await logActivity(req, {
            company_id: company.id,
            action: 'Register Company Full',
            module: 'Companies',
            details: { company_name, admin_email, plan_type }
        });

        res.status(201).json({
            success: true,
            message: 'Company and Admin created successfully',
            company_id: company.id
        });

    } catch (err) {
        await t.rollback();
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.approve = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

        if (company.status === 'verified') {
            return res.status(400).json({ success: false, message: 'Company is already verified' });
        }

        // 1. Update Company Status
        await company.update({ status: 'verified' }, { transaction: t });

        // 2. Create Admin User (if not exists)
        // We'll use the company email as a placeholder or a provided one if we had a request table
        // For now, let's assume the company record has the email.
        const existingAdmin = await User.findOne({ where: { email: company.email } });
        if (!existingAdmin) {
            await User.create({
                name: company.contact_person || company.name + ' Admin',
                email: company.email,
                phone: company.contact_mobile,
                password: 'password123',
                role: 'Company Admin',
                company_id: company.id
            }, { transaction: t });
        }

        // 3. Create Default Plan
        await CompanyPlan.create({
            company_id: company.id,
            plan_name: company.plan || 'basic',
            employee_limit: 10,
            start_date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
            status: 'active'
        }, { transaction: t });

        await t.commit();

        await logActivity(req, {
            company_id: company.id,
            action: 'Approve Company Request',
            module: 'Companies',
            details: { company_name: company.name }
        });

        res.json({ success: true, message: 'Company approved and setup completed.' });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.reject = async (req, res) => {
    try {
        const { reason } = req.body;
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

        await company.update({ status: 'rejected', rejection_reason: reason });

        await logActivity(req, {
            company_id: company.id,
            action: 'Reject Company Request',
            module: 'Companies',
            details: { reason }
        });

        res.json({ success: true, message: 'Company request rejected.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.suspend = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

        const newStatus = company.status === 'inactive' ? 'verified' : 'inactive';
        await company.update({ status: newStatus });

        await logActivity(req, {
            company_id: company.id,
            action: newStatus === 'inactive' ? 'Suspend Company' : 'Reactivate Company',
            module: 'Companies',
            details: { company_name: company.name }
        });

        res.json({ success: true, message: `Company ${newStatus === 'inactive' ? 'suspended' : 'reactivated'} successfully.`, status: newStatus });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
