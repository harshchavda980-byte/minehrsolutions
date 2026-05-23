const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'User'
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    countries: {
        type: DataTypes.STRING, // Can be JSON or comma-separated if needed
        allowNull: true
    },
    timezone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    fcm_notifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: 'English'
    },
    is_developer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    email_verified_at: {
        type: DataTypes.DATE
    },
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    },
    deleted_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    purge_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 12);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 12);
            }
        },
        beforeDestroy: async (instance, options) => {
            if (options.user) {
                instance.deleted_by = options.user.id;
            }
            const purgeDate = new Date();
            purgeDate.setDate(purgeDate.getDate() + 15);
            instance.purge_at = purgeDate;
            await instance.save({ hooks: false });
        }
    },
    underscored: true,
    paranoid: true,
    indexes: [
        { fields: ['email'] },
        { fields: ['status'] },
        { fields: ['company_id'] },
        { fields: ['created_at'] }
    ]
});

User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;

// Define associations after Export
const Company = require('./Company');
User.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
User.belongsTo(User, { foreignKey: 'deleted_by', as: 'deletedByUser' });
