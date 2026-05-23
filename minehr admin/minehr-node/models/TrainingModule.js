const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrainingModule = sequelize.define('TrainingModule', {
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    topic_name: { 
        type: DataTypes.STRING, 
        allowNull: true,
        comment: 'Session / Topic Name'
    },
    type: { 
        type: DataTypes.ENUM('Setup (HRMS)', 'Training (HRMS)', 'Implementation', 'Other'), 
        defaultValue: 'Training (HRMS)' 
    },
    priority: { 
        type: DataTypes.ENUM('P1', 'P2', 'P3', 'P4', 'P5'), 
        defaultValue: 'P1' 
    },
    display_order: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    completion_days: { 
        type: DataTypes.INTEGER, 
        defaultValue: 1 
    },
    estimated_minutes: { 
        type: DataTypes.INTEGER, 
        defaultValue: 30 
    },
    url: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    session_day: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    session_names: { 
        type: DataTypes.JSON, 
        allowNull: true,
        comment: 'Stores array of tags/pills'
    },
    sub_topics_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: { 
        type: DataTypes.ENUM('Active', 'Inactive'), 
        defaultValue: 'Active' 
    }
}, { 
    underscored: true,
    tableName: 'training_modules'
});

module.exports = TrainingModule;
