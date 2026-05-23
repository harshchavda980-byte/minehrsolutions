const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrainingMeeting = sequelize.define('TrainingMeeting', {
    id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true 
    },
    slot_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    batch_id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        allowNull: false 
    },
    trainer_name: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    city: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    meeting_day: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    meeting_date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    start_time: { 
        type: DataTypes.TIME, 
        allowNull: false 
    },
    end_time: { 
        type: DataTypes.TIME, 
        allowNull: false 
    },
    batch_start_date: { 
        type: DataTypes.DATEONLY, 
        allowNull: true 
    },
    recording_link: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    status: { 
        type: DataTypes.ENUM('Pending', 'In Progress', 'Completed', 'Cancelled'), 
        defaultValue: 'Pending' 
    },
    reference_company_id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        allowNull: true 
    },
    holidays: { 
        type: DataTypes.JSON, 
        allowNull: true 
    }
}, { 
    underscored: true,
    tableName: 'training_meetings'
});

module.exports = TrainingMeeting;

const TrainingBatch = require('./TrainingBatch');
const Company = require('./Company');
const TrainingMeetingCompany = require('./TrainingMeetingCompany');

TrainingMeeting.belongsTo(TrainingBatch, { foreignKey: 'batch_id', as: 'batch' });
TrainingMeeting.belongsTo(Company, { foreignKey: 'reference_company_id', as: 'reference_company' });
TrainingMeeting.belongsToMany(Company, { 
    through: TrainingMeetingCompany, 
    foreignKey: 'meeting_id', 
    otherKey: 'company_id', 
    as: 'companies' 
});
