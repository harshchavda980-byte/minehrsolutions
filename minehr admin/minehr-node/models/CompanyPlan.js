const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyPlan = sequelize.define('CompanyPlan', {
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    plan_name: {
        type: DataTypes.STRING,
        defaultValue: 'basic'
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'expiring', 'expired'),
        defaultValue: 'active'
    },
    plan_duration: {
        type: DataTypes.ENUM('1 Month', '6 Month', '1 Year', 'Custom'),
        allowNull: true
    },
    plan_history: {
        type: DataTypes.JSON,
        allowNull: true
    },
    payment_details: {
        type: DataTypes.JSON,
        allowNull: true
    },
    employee_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    }
}, {
    underscored: true
});

module.exports = CompanyPlan;

// Define associations after Export
const Company = require('./Company');
CompanyPlan.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
