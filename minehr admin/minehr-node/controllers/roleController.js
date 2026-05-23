const Role = require('../models/Role');
const { Op } = require('sequelize');

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            order: [['name', 'ASC']]
        });
        res.json(roles);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
        res.json(role);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createRole = async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json({ success: true, role });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
        
        // Protect Super Admin
        if (role.name === 'Super Admin' && req.body.name !== 'Super Admin') {
            return res.status(403).json({ success: false, message: 'The Super Admin role name cannot be changed.' });
        }
        
        await role.update(req.body);
        res.json({ success: true, role });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
        
        // Protect Super Admin
        if (role.name === 'Super Admin') {
            return res.status(403).json({ success: false, message: 'The default Super Admin role cannot be deleted.' });
        }
        
        await role.destroy();
        res.json({ success: true, message: 'Role deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
