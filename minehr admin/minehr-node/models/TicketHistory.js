const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TicketHistory = sequelize.define('TicketHistory', {
    ticket_id: {
        type: DataTypes.BIGINT.UNSIGNED, // Match Tickets.id
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    updated_by: {
        type: DataTypes.BIGINT.UNSIGNED, // Match users.id
        allowNull: false
    }
}, {
    underscored: true,
    timestamps: true
});

module.exports = TicketHistory;

// Associations
const Ticket = require('./Ticket');
const User = require('./User');

TicketHistory.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
TicketHistory.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
Ticket.hasMany(TicketHistory, { foreignKey: 'ticket_id', as: 'history' });
