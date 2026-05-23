const IndustryType = require('../models/IndustryType');
const { Op } = require('sequelize');

exports.getIndustryTypes = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10, sort = 'sequence', order = 'ASC' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const conditions = [];
        const replacements = [];

        if (status) {
            conditions.push('status = ?');
            replacements.push(status);
        }
        if (search) {
            conditions.push('LOWER(name) LIKE ?');
            replacements.push(`%${search.toLowerCase()}%`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        // Validate sort and order
        const validSortFields = ['id', 'name', 'sequence', 'status'];
        const finalSort = validSortFields.includes(sort) ? sort : 'sequence';
        const finalOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

        const sequelize = IndustryType.sequelize;
        const [[{ total }]] = await sequelize.query(
            `SELECT COUNT(*) as total FROM IndustryTypes ${whereClause}`,
            { replacements }
        );

        const [rows] = await sequelize.query(
            `SELECT * FROM IndustryTypes ${whereClause} ORDER BY ${finalSort} ${finalOrder} LIMIT ? OFFSET ?`,
            { replacements: [...replacements, parseInt(limit), offset] }
        );

        res.json({
            success: true,
            total: parseInt(total),
            pages: Math.ceil(parseInt(total) / parseInt(limit)),
            currentPage: parseInt(page),
            industryTypes: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createIndustryType = async (req, res) => {
    try {
        const { name } = req.body;
        // Normalize name: trim and capitalize first letter of each word
        const normalizedName = name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        
        // Check for duplicate
        const existing = await IndustryType.findOne({ where: { name: normalizedName } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'An industry with this name already exists' });
        }

        const industryType = await IndustryType.create({ ...req.body, name: normalizedName });
        res.status(201).json({ success: true, industryType });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateIndustryType = async (req, res) => {
    try {
        const industryType = await IndustryType.findByPk(req.params.id);
        if (!industryType) return res.status(404).json({ success: false, message: 'Industry Type not found' });

        if (req.body.name) {
            const normalizedName = req.body.name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            
            // Check for duplicate (excluding self)
            const existing = await IndustryType.findOne({ 
                where: { 
                    name: normalizedName,
                    id: { [Op.ne]: req.params.id }
                } 
            });
            if (existing) {
                return res.status(400).json({ success: false, message: 'An industry with this name already exists' });
            }
            req.body.name = normalizedName;
        }

        await industryType.update(req.body);
        res.json({ success: true, industryType });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteIndustryType = async (req, res) => {
    try {
        const industryType = await IndustryType.findByPk(req.params.id);
        if (!industryType) return res.status(404).json({ success: false, message: 'Industry Type not found' });

        await industryType.destroy();
        res.json({ success: true, message: 'Industry Type deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
