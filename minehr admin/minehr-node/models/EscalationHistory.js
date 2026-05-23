const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EscalationHistory = sequelize.define('EscalationHistory', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    feedback_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    escalated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    escalated_to: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    underscored: true,
    timestamps: true
});

module.exports = EscalationHistory;

// Associations
const Feedback = require('./Feedback');
const User = require('./User');

EscalationHistory.belongsTo(Feedback, { foreignKey: 'feedback_id', as: 'feedback' });
EscalationHistory.belongsTo(User, { foreignKey: 'escalated_by', as: 'escalator' });
EscalationHistory.belongsTo(User, { foreignKey: 'escalated_to', as: 'escalatee' });
Feedback.hasMany(EscalationHistory, { foreignKey: 'feedback_id', as: 'escalations' });
