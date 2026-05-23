const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const City = require('../City');
const User = require('../User');

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    job_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
            model: City,
            key: 'id'
        }
    },
    recruiter_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('Open', 'Closed', 'On Hold'),
        defaultValue: 'Open'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    requirements: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    underscored: true,
    timestamps: true
});

Job.belongsTo(City, { foreignKey: 'city_id', as: 'location' });
Job.belongsTo(User, { foreignKey: 'recruiter_id', as: 'recruiter' });

module.exports = Job;
