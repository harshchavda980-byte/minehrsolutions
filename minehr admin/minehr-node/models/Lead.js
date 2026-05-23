const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    lead_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    company_name: DataTypes.STRING,
    lead_source: {
        type: DataTypes.ENUM('Website', 'Referral', 'Campaign', 'Direct', 'Other'),
        defaultValue: 'Website'
    },
    status: {
        type: DataTypes.ENUM('New', 'Contacted', 'Qualified', 'Converted', 'Lost'),
        defaultValue: 'New'
    },
    assigned_to: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    conversion_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    underscored: true,
    timestamps: true
});

module.exports = Lead;

// Associations
const User = require('./User');
Lead.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
User.hasMany(Lead, { foreignKey: 'assigned_to', as: 'leads' });
