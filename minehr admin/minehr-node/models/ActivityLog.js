const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const notificationService = require('../services/notificationService');

const ActivityLog = sequelize.define('ActivityLog', {
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
            model: 'companies',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    module: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    details: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    underscored: true,
    timestamps: true,
    updatedAt: false,
    hooks: {
        afterCreate: (log) => {
            try {
                notificationService.broadcast({
                    id: log.id,
                    action: log.action,
                    module: log.module,
                    details: log.details,
                    created_at: log.created_at
                });
            } catch (err) {
                console.error('[SSE Broadcast Error]:', err.message);
            }
        }
    },
    indexes: [
        { fields: ['created_at'] },
        { fields: ['user_id'] },
        { fields: ['company_id'] },
        { fields: ['module'] }
    ]
});

module.exports = ActivityLog;
