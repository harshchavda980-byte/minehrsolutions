const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    feedback_id: {
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
    contact_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('New', 'In Progress', 'Escalated', 'Resolved'),
        defaultValue: 'New'
    },
    assigned_to: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    }
}, {
    underscored: true,
    timestamps: true
});

module.exports = Feedback;

// Associations
const Company = require('./Company');
const User = require('./User');

Feedback.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Feedback.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
