const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Participant = sequelize.define('Participant', {
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    status: { 
        type: DataTypes.ENUM('Active', 'Inactive'), 
        defaultValue: 'Active' 
    }
}, { 
    underscored: true,
    tableName: 'onboarding_participants'
});

module.exports = Participant;
