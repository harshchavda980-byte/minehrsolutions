const City = require('../models/City');
const State = require('../models/State');
const Country = require('../models/Country');
const { Op, literal } = require('sequelize');

exports.getCities = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10, sort = 'name', order = 'ASC' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const conditions = [];
        const replacements = [];

        if (status) {
            conditions.push('ci.status = ?');
            replacements.push(status);
        }
        if (search) {
            conditions.push('(LOWER(ci.name) LIKE ? OR LOWER(s.name) LIKE ? OR LOWER(c.name) LIKE ?)');
            const term = `%${search.toLowerCase()}%`;
            replacements.push(term, term, term);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const sequelize = City.sequelize;

        // Sorting map to handle aliases
        const sortMap = {
            id: 'ci.id',
            name: 'ci.name',
            state_name: 's.name',
            country_name: 'c.name',
            status: 'ci.status'
        };
        const finalSort = sortMap[sort] || 'ci.name';
        const finalOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

        const [[{ total }]] = await sequelize.query(
            `SELECT COUNT(*) as total 
             FROM cities ci
             LEFT JOIN states s ON ci.state_id = s.id
             LEFT JOIN countries c ON s.country_id = c.id
             ${whereClause}`,
            { replacements }
        );

        const [rows] = await sequelize.query(
            `SELECT ci.*, s.name as state_name, c.name as country_name
             FROM cities ci
             LEFT JOIN states s ON ci.state_id = s.id
             LEFT JOIN countries c ON s.country_id = c.id
             ${whereClause}
             ORDER BY ${finalSort} ${finalOrder} LIMIT ? OFFSET ?`,
            { replacements: [...replacements, parseInt(limit), offset] }
        );

        // Map into nested objects for frontend compatibility
        const cities = rows.map(r => ({
            ...r,
            state: r.state_name ? { name: r.state_name, country: r.country_name ? { name: r.country_name } : null } : null
        }));

        res.json({
            success: true,
            total: parseInt(total),
            pages: Math.ceil(parseInt(total) / parseInt(limit)),
            currentPage: parseInt(page),
            cities
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.updateCity = async (req, res) => {
    try {
        const city = await City.findByPk(req.params.id);
        if (!city) return res.status(404).json({ success: false, message: 'City not found' });

        await city.update(req.body);
        res.json({ success: true, city });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteCity = async (req, res) => {
    try {
        const city = await City.findByPk(req.params.id);
        if (!city) return res.status(404).json({ success: false, message: 'City not found' });

        await city.destroy();
        res.json({ success: true, message: 'City deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createCity = async (req, res) => {
    try {
        const { name, state_id, status } = req.body;
        const city = await City.create({ name, state_id, status });
        res.status(201).json({ success: true, city });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- Country Management ---

exports.getCountries = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10, sort = 'name', order = 'ASC' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Build WHERE conditions with LOWER() for binary-collation case-insensitive search
        const conditions = [];
        const replacements = [];

        if (status) {
            conditions.push('status = ?');
            replacements.push(status);
        }
        if (search) {
            conditions.push("LOWER(name) LIKE ?");
            replacements.push(`%${search.toLowerCase()}%`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        // Validate sort and order to prevent SQL injection
        const validSortFields = ['id', 'name', 'code', 'status'];
        const validOrder = ['ASC', 'DESC'];
        const finalSort = validSortFields.includes(sort) ? sort : 'name';
        const finalOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

        const sequelize = Country.sequelize;
        const [[{ total }]] = await sequelize.query(
            `SELECT COUNT(*) as total FROM countries ${whereClause}`,
            { replacements }
        );
        const [rows] = await sequelize.query(
            `SELECT * FROM countries ${whereClause} ORDER BY ${finalSort} ${finalOrder} LIMIT ? OFFSET ?`,
            { replacements: [...replacements, parseInt(limit), offset] }
        );

        res.json({
            success: true,
            total: parseInt(total),
            pages: Math.ceil(parseInt(total) / parseInt(limit)),
            currentPage: parseInt(page),
            countries: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



exports.createCountry = async (req, res) => {
    try {
        const country = await Country.create(req.body);
        res.status(201).json({ success: true, country });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateCountry = async (req, res) => {
    try {
        const country = await Country.findByPk(req.params.id);
        if (!country) return res.status(404).json({ success: false, message: 'Country not found' });
        await country.update(req.body);
        res.json({ success: true, country });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteCountry = async (req, res) => {
    try {
        const country = await Country.findByPk(req.params.id);
        if (!country) return res.status(404).json({ success: false, message: 'Country not found' });
        await country.destroy();
        res.json({ success: true, message: 'Country deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- State Management ---

exports.getStates = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10, sort = 'name', order = 'ASC' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const conditions = [];
        const replacements = [];

        if (status) { conditions.push('s.status = ?'); replacements.push(status); }
        if (search) { conditions.push('LOWER(s.name) LIKE ?'); replacements.push(`%${search.toLowerCase()}%`); }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const sequelize = State.sequelize;

        const sortMap = {
            id: 's.id',
            name: 's.name',
            country_name: 'c.name',
            status: 's.status'
        };
        const finalSort = sortMap[sort] || 's.name';
        const finalOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

        const [[{ total }]] = await sequelize.query(
            `SELECT COUNT(*) as total FROM states s ${whereClause}`,
            { replacements }
        );
        const [rows] = await sequelize.query(
            `SELECT s.*, c.name as country_name FROM states s LEFT JOIN countries c ON s.country_id = c.id ${whereClause} ORDER BY ${finalSort} ${finalOrder} LIMIT ? OFFSET ?`,
            { replacements: [...replacements, parseInt(limit), offset] }
        );

        // Map country_name into nested object for frontend compatibility
        const mapped = rows.map(r => ({ ...r, country: r.country_name ? { name: r.country_name } : null }));

        res.json({
            success: true,
            total: parseInt(total),
            pages: Math.ceil(parseInt(total) / parseInt(limit)),
            currentPage: parseInt(page),
            states: mapped
        });
    } catch (err) {

        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getStatesByCountry = async (req, res) => {
    try {
        const states = await State.findAll({
            where: { country_id: req.params.countryId, status: 'Active' },
            order: [['name', 'ASC']]
        });
        res.json(states);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createState = async (req, res) => {
    try {
        const state = await State.create(req.body);
        res.status(201).json({ success: true, state });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateState = async (req, res) => {
    try {
        const state = await State.findByPk(req.params.id);
        if (!state) return res.status(404).json({ success: false, message: 'State not found' });
        await state.update(req.body);
        res.json({ success: true, state });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteState = async (req, res) => {
    try {
        const state = await State.findByPk(req.params.id);
        if (!state) return res.status(404).json({ success: false, message: 'State not found' });
        await state.destroy();
        res.json({ success: true, message: 'State deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllCountries = async (req, res) => {
    try {
        const countries = await Country.findAll({ 
            where: { status: 'Active' },
            order: [['name', 'ASC']] 
        });
        res.json(countries);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getCitiesByState = async (req, res) => {
    try {
        const cities = await City.findAll({
            where: { state_id: req.params.stateId, status: 'Active' },
            order: [['name', 'ASC']]
        });
        res.json(cities);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
