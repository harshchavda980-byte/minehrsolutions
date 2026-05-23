const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeLimitHistory = sequelize.define('EmployeeLimitHistory', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    old_limit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    new_limit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    changed_by: {
        type: DataTypes.BIGINT.UNSIGNED, // User ID
        allowNull: true
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    changed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'employee_limit_histories',
    underscored: true
});

module.exports = EmployeeLimitHistory;
