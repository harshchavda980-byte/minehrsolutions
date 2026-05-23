const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkReport = sequelize.define('WorkReport', {
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true 
    },
    trainer_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    report_date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    report_type: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    no_of_calls: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    no_of_lined_up: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    company_ids: { 
        type: DataTypes.JSON, // Store multiple company IDs
        allowNull: true 
    },
    report_description: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    }
}, { 
    underscored: true,
    tableName: 'onboarding_work_reports'
});

module.exports = WorkReport;
