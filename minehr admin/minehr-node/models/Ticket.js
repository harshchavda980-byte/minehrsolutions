const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    ticket_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Medium'
    },
    status: {
        type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
        defaultValue: 'Open'
    },
    related_module: {
        type: DataTypes.STRING,
        allowNull: true
    },
    assigned_to: {
        type: DataTypes.BIGINT.UNSIGNED, // Match users.id
        allowNull: true
    },
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED, // Match companies.id
        allowNull: true
    },
    created_by: {
        type: DataTypes.BIGINT.UNSIGNED, // Match users.id
        allowNull: true
    }
}, {
    underscored: true,
    timestamps: true
});

module.exports = Ticket;

// Associations
const Company = require('./Company');
const User = require('./User');

Ticket.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Ticket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
Ticket.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Company.hasMany(Ticket, { foreignKey: 'company_id', as: 'tickets' });
