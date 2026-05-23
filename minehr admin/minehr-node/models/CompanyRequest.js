const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyRequest = sequelize.define('CompanyRequest', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    request_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    employees_count: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    request_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    source: {
        type: DataTypes.ENUM('App', 'Web'),
        defaultValue: 'Web'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Solved'),
        defaultValue: 'Pending'
    }
}, {
    underscored: true,
    timestamps: true
});

module.exports = CompanyRequest;
