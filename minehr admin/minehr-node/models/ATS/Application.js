const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Job = require('./Job');
const User = require('../User');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    application_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    candidate_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    job_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: Job,
            key: 'id'
        }
    },
    resume_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    source: {
        type: DataTypes.STRING,
        defaultValue: 'Website'
    },
    status: {
        type: DataTypes.ENUM('New', 'Reviewed', 'Interview Scheduled', 'Hired', 'Rejected'),
        defaultValue: 'New'
    },
    assigned_recruiter_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    underscored: true,
    timestamps: true
});

Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });
Application.belongsTo(User, { foreignKey: 'assigned_recruiter_id', as: 'assignedRecruiter' });

module.exports = Application;
