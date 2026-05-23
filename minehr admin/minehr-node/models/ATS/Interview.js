const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Application = require('./Application');

const Interview = sequelize.define('Interview', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    interview_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    application_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: Application,
            key: 'id'
        }
    },
    interviewer_ids: {
        type: DataTypes.STRING, // Storing comma separated IDs for simplicity in this demo or JSON if supported better
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('Phone', 'Online', 'In-person'),
        defaultValue: 'Online'
    },
    scheduled_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Rescheduled', 'Cancelled'),
        defaultValue: 'Scheduled'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    underscored: true,
    timestamps: true
});

Interview.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

module.exports = Interview;
