const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrainingPriority = sequelize.define('TrainingPriority', {
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    is_required: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    },
    display_order: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    }
}, { 
    underscored: true,
    tableName: 'training_priorities'
});

module.exports = TrainingPriority;
