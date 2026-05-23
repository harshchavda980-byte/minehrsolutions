const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeadInteraction = sequelize.define('LeadInteraction', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    lead_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Call', 'Email', 'Meeting', 'Note'),
        defaultValue: 'Note'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    attachment_url: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    underscored: true,
    timestamps: true
});

module.exports = LeadInteraction;

// Associations
const Lead = require('./Lead');
const User = require('./User');

LeadInteraction.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });
Lead.hasMany(LeadInteraction, { foreignKey: 'lead_id', as: 'interactions' });
LeadInteraction.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
