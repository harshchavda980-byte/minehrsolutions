const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmailTemplate = sequelize.define('EmailTemplate', {
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true 
    },
    template_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    subject: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    body: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    added_by: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    }
}, { 
    underscored: true,
    tableName: 'onboarding_email_templates'
});

module.exports = EmailTemplate;
