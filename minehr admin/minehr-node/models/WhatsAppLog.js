const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WhatsAppLog = sequelize.define('WhatsAppLog', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    intimation_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    recipient: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Sent', 'Failed', 'Delivered', 'Read'),
        defaultValue: 'Sent'
    },
    error_message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'whatsapp_logs',
    underscored: true
});

module.exports = WhatsAppLog;

const Company = require('./Company');
WhatsAppLog.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
