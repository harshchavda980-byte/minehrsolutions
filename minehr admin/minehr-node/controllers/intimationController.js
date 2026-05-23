const Intimation = require('../models/Intimation');
const { Op } = require('sequelize');

exports.getIntimations = async (req, res) => {
    try {
        const { search, type, status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (type) where.type = type;
        if (status) where.status = status;
        if (search) {
            where[Op.or] = [
                { intimation_id: { [Op.like]: `%${search}%` } },
                { message_template: { [Op.like]: `%${search}%` } },
                { recipients: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Intimation.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            intimations: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createIntimation = async (req, res) => {
    try {
        const data = { ...req.body };
        // Generate Intimation ID
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        data.intimation_id = `INTM-${dateStr}-${random}`;

        const intimation = await Intimation.create(data);
        res.status(201).json({ success: true, intimation });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateIntimation = async (req, res) => {
    try {
        const intimation = await Intimation.findByPk(req.params.id);
        if (!intimation) return res.status(404).json({ success: false, message: 'Intimation not found' });

        await intimation.update(req.body);
        res.json({ success: true, intimation });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteIntimation = async (req, res) => {
    try {
        const intimation = await Intimation.findByPk(req.params.id);
        if (!intimation) return res.status(404).json({ success: false, message: 'Intimation not found' });

        await intimation.destroy({ user: req.user });
        res.json({ success: true, message: 'Intimation deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.triggerTest = async (req, res) => {
    try {
        const intimation = await Intimation.findByPk(req.params.id);
        if (!intimation) return res.status(404).json({ success: false, message: 'Intimation not found' });

        const Company = require('../models/Company');
        let companyDetails = [];
        
        // Fetch details for all linked companies
        if (intimation.company_ids && intimation.company_ids.length > 0) {
            companyDetails = await Company.findAll({
                where: { id: intimation.company_ids },
                attributes: ['name', 'contact_mobile']
            });
        }

        const primaryMobile = companyDetails.length > 0 ? companyDetails[0].contact_mobile : 'N/A';
        const companyNames = companyDetails.map(c => c.name).join(', ') || 'Global';

        // Simulate notification logic
        console.log(`[REAL-TIME TEST] Triggering ${intimation.type} for: ${intimation.recipients}`);
        console.log(`[REAL-TIME TEST] Using Sender Mobile (Company): ${primaryMobile}`);
        console.log(`[REAL-TIME TEST] Target Companies: ${companyNames}`);
        console.log(`[REAL-TIME TEST] Message Body: ${intimation.message_template}`);

        res.json({ 
            success: true, 
            message: `Test Successful! \n\nMethod: ${intimation.type}\nSender (Company Mobile): ${primaryMobile}\nTarget: ${companyNames}\nRecipients: ${intimation.recipients}` 
        });
    } catch (err) {
        console.error('Test Trigger Error:', err);
        res.status(500).json({ success: false, message: 'Failed to trigger test: ' + err.message });
    }
};
