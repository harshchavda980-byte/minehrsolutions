const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Intimation = sequelize.define('Intimation', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    intimation_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('WhatsApp', 'Gmail', 'SMS'),
        allowNull: false
    },
    recipients: {
        type: DataTypes.TEXT, // Supports JSON or comma-separated lists
        allowNull: false,
        defaultValue: ''
    },
    message_template: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    schedule_cron: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '0 9 * * *' // Default to 9 AM daily
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
    },
    company_ids: {
        type: DataTypes.JSON,
        allowNull: true
    },
    deleted_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    purge_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    hooks: {
        beforeDestroy: async (instance, options) => {
            if (options.user) {
                instance.deleted_by = options.user.id;
            }
            const purgeDate = new Date();
            purgeDate.setDate(purgeDate.getDate() + 15);
            instance.purge_at = purgeDate;
            await instance.save({ hooks: false });
        }
    },
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Intimations',
    paranoid: true
});

module.exports = Intimation;

// Define associations
const User = require('./User');
Intimation.belongsTo(User, { foreignKey: 'deleted_by', as: 'deletedByUser' });
