const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AppUsage = sequelize.define('AppUsage', {
    module_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usage_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    month: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    }
}, {
    underscored: true
});

module.exports = AppUsage;
