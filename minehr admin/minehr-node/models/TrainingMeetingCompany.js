const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrainingMeetingCompany = sequelize.define('TrainingMeetingCompany', {
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true 
    },
    meeting_id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        allowNull: false 
    },
    company_id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        allowNull: false 
    }
}, { 
    underscored: true,
    tableName: 'training_meeting_companies',
    timestamps: false
});

module.exports = TrainingMeetingCompany;
