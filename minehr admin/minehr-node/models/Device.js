const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');
const User = require('./User');

const Device = sequelize.define('Device', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    device_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    imei_no: {
        type: DataTypes.STRING,
        allowNull: true
    },
    device_type: {
        type: DataTypes.ENUM('Mini', 'Prime'),
        allowNull: false,
        defaultValue: 'Mini'
    },
    status: {
        type: DataTypes.ENUM('In Trial', 'In House', 'Active', 'Inactive', 'Damaged'),
        allowNull: false,
        defaultValue: 'In House'
    },
    city_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
            model: Company,
            key: 'id'
        }
    },
    installed_by: {
        type: DataTypes.STRING,
        allowNull: true
    },
    assigned_to_admin: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    installation_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
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
    underscored: true,
    timestamps: true,
    paranoid: true, // For Recycle Bin
    tableName: 'Devices'
});

// Associations
Device.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Device.belongsTo(User, { foreignKey: 'assigned_to_admin', as: 'admin' });
Device.belongsTo(User, { foreignKey: 'deleted_by', as: 'deletedByUser' });

// Hook for Recycle Bin
Device.beforeDestroy(async (device, options) => {
    if (options.user) {
        device.deleted_by = options.user.id;
        const purgeDate = new Date();
        purgeDate.setDate(purgeDate.getDate() + 15);
        device.purge_at = purgeDate;
    }
});

module.exports = Device;
