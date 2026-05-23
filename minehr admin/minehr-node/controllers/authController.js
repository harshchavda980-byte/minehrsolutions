const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logActivity } = require('../utils/logger');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        user.last_login = new Date();
        await user.save();

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });

        await logActivity(req, {
            action: 'Login',
            module: 'Auth',
            details: { email: user.email, name: user.name }
        });

        res.json({ message: 'Login successful', user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logout = async (req, res) => {
    await logActivity(req, {
        action: 'Logout',
        module: 'Auth'
    });
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};

exports.me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone, countries, fcm_notifications, language, timezone, is_developer } = req.body;
        
        // 1. Check if user already exists with that email (including soft-deleted)
        if (email) {
            const existingEmail = await User.findOne({
                where: { email },
                paranoid: false
            });
            if (existingEmail) {
                if (existingEmail.deletedAt) {
                    return res.status(400).json({ message: 'User with this email already exists in recycle bin' });
                } else {
                    return res.status(400).json({ message: 'User with this email already exists' });
                }
            }
        }

        // 2. Check if user already exists with that phone number (including soft-deleted)
        if (phone && phone.trim() !== '') {
            const existingPhone = await User.findOne({
                where: { phone },
                paranoid: false
            });
            if (existingPhone) {
                if (existingPhone.deletedAt) {
                    return res.status(400).json({ message: 'User with this phone number already exists in recycle bin' });
                } else {
                    return res.status(400).json({ message: 'User with this phone number already exists' });
                }
            }
        }

        const user = await User.create({ 
            name, email, password, role, phone, countries, 
            fcm_notifications, language, timezone, is_developer 
        });

        await logActivity(req, {
            action: 'Register',
            module: 'Auth',
            details: { new_user_email: user.email, role: user.role }
        });

        res.status(201).json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const { name, email, password, role, phone, countries, fcm_notifications, language, timezone, is_developer, status } = req.body;
        
        // 1. Check if another user already exists with that email (including soft-deleted)
        if (email) {
            const existingEmail = await User.findOne({
                where: { 
                    email,
                    id: { [Op.ne]: req.params.id }
                },
                paranoid: false
            });
            if (existingEmail) {
                if (existingEmail.deletedAt) {
                    return res.status(400).json({ message: 'User with this email already exists in recycle bin' });
                } else {
                    return res.status(400).json({ message: 'User with this email already exists' });
                }
            }
        }

        // 2. Check if another user already exists with that phone number (including soft-deleted)
        if (phone && phone.trim() !== '') {
            const existingPhone = await User.findOne({
                where: { 
                    phone,
                    id: { [Op.ne]: req.params.id }
                },
                paranoid: false
            });
            if (existingPhone) {
                if (existingPhone.deletedAt) {
                    return res.status(400).json({ message: 'User with this phone number already exists in recycle bin' });
                } else {
                    return res.status(400).json({ message: 'User with this phone number already exists' });
                }
            }
        }

        const updateData = { name, email, role, phone, countries, fcm_notifications, language, timezone, is_developer, status };
        if (password && password.trim() !== '') {
            updateData.password = password;
        }
        
        await user.update(updateData);
        
        await logActivity(req, {
            action: 'Update',
            module: 'Auth',
            details: { updated_user_id: user.id }
        });
        
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        await user.destroy({ user: req.user });
        
        await logActivity(req, {
            action: 'Delete',
            module: 'Auth',
            details: { deleted_user_id: req.params.id }
        });
        
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.bulkDelete = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !ids.length) return res.status(400).json({ message: 'No IDs provided' });
        
        await User.destroy({ where: { id: { [Op.in]: ids } }, user: req.user });
        
        await logActivity(req, {
            action: 'Bulk Delete',
            module: 'Auth',
            details: { deleted_count: ids.length }
        });
        
        res.json({ message: 'Users deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.bulkDeactivate = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !ids.length) return res.status(400).json({ message: 'No IDs provided' });
        
        await User.update({ status: 'inactive' }, { where: { id: { [Op.in]: ids } } });
        
        await logActivity(req, {
            action: 'Bulk Deactivate',
            module: 'Auth',
            details: { deactivated_count: ids.length }
        });
        
        res.json({ message: 'Users deactivated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
