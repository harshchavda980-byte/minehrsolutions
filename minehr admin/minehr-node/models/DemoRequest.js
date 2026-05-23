const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DemoRequest = sequelize.define('DemoRequest', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    request_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    product_interest: {
        type: DataTypes.STRING,
        allowNull: true
    },
    preferred_datetime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    request_source: {
        type: DataTypes.ENUM('Website', 'Email', 'Campaign', 'Direct', 'Other'),
        defaultValue: 'Website'
    },
    status: {
        type: DataTypes.ENUM('New', 'Scheduled', 'Completed', 'Cancelled'),
        defaultValue: 'New'
    },
    assigned_to: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    underscored: true,
    timestamps: true
});

module.exports = DemoRequest;

// Associations
const User = require('./User');
DemoRequest.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
User.hasMany(DemoRequest, { foreignKey: 'assigned_to', as: 'demo_requests' });
