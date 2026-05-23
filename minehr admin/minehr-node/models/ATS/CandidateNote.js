const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Application = require('./Application');
const User = require('../User');

const CandidateNote = sequelize.define('CandidateNote', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    application_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: Application,
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    underscored: true,
    timestamps: true
});

CandidateNote.belongsTo(Application, { foreignKey: 'application_id' });
CandidateNote.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

module.exports = CandidateNote;
