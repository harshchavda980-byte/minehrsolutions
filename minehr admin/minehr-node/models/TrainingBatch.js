const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrainingBatch = sequelize.define('TrainingBatch', {
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    type: { 
        type: DataTypes.ENUM('Monday To Friday', 'Saturday', 'Any Day'), 
        defaultValue: 'Monday To Friday' 
    },
    participant_type: { 
        type: DataTypes.ENUM('HR', 'Owner', 'Leader', 'Employee'), 
        defaultValue: 'HR' 
    },
    training_days: { 
        type: DataTypes.INTEGER, 
        defaultValue: 1 
    },
    topic_config: { 
        type: DataTypes.JSON, 
        allowNull: true,
        comment: 'Stores mapping of topics/modules to specific training days'
    },
    status: { 
        type: DataTypes.ENUM('Active', 'Inactive'), 
        defaultValue: 'Active' 
    }
}, { 
    underscored: true,
    tableName: 'training_batches'
});

module.exports = TrainingBatch;
