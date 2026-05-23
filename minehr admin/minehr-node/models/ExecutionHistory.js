const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExecutionHistory = sequelize.define('ExecutionHistory', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    cron_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    started_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    finished_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Success', 'Failed', 'Partial'),
        defaultValue: 'Success'
    },
    details: {
        type: DataTypes.TEXT, // JSON summary of what was done
        allowNull: true
    },
    items_processed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: false,
    tableName: 'execution_histories',
    underscored: true
});

module.exports = ExecutionHistory;
