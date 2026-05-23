const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecentActivity = sequelize.define('RecentActivity', {
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: DataTypes.STRING,
    user_id: DataTypes.INTEGER
}, {
    underscored: true
});

module.exports = RecentActivity;
