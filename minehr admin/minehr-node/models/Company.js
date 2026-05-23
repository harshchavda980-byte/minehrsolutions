const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company_code: {
        type: DataTypes.STRING,
        unique: true
    },
    city: DataTypes.STRING,

    state: DataTypes.STRING,
    country: DataTypes.STRING,
    address: DataTypes.TEXT,
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    contact_person: DataTypes.STRING,
    rejection_reason: DataTypes.TEXT,
    employee_count: DataTypes.INTEGER,
    status: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected', 'inactive'),
        defaultValue: 'pending'
    },
    plan: {
        type: DataTypes.STRING,
        defaultValue: 'basic'
    },
    contact_mobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    // New Fields from Snapshot
    is_rise_event: { type: DataTypes.BOOLEAN, defaultValue: false },
    account_type: { type: DataTypes.STRING, defaultValue: 'Normal Account' },
    pincode: DataTypes.STRING,
    industry_type: DataTypes.STRING,
    currency: { type: DataTypes.STRING, defaultValue: 'INR' },
    company_base_url: DataTypes.STRING,
    end_url_name: DataTypes.STRING,
    trial_days: { type: DataTypes.INTEGER, defaultValue: 0 },
    expected_team_size: DataTypes.INTEGER,
    employee_registration_limit: { type: DataTypes.INTEGER, defaultValue: 10 },
    employee_tracking_limit: { type: DataTypes.INTEGER, defaultValue: 10 },
    crm_limit: { type: DataTypes.INTEGER, defaultValue: 0 },
    yearly_ticket_size: DataTypes.INTEGER,
    resolved_ticket_size: DataTypes.INTEGER,
    per_employee_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    sales_person_name: DataTypes.STRING,
    implementation_executive_name: DataTypes.STRING,
    year_type: { type: DataTypes.STRING, defaultValue: 'Calendar Year' },
    company_priority: { type: DataTypes.INTEGER, defaultValue: 5 },
    training_type: { type: DataTypes.STRING, defaultValue: 'Online' },
    company_remark: DataTypes.TEXT,
    latitude: DataTypes.DECIMAL(10, 8),
    longitude: DataTypes.DECIMAL(11, 8),
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
        { fields: ['created_at'] },
        { fields: ['status'] },
        { fields: ['company_code'] }
    ]
});

module.exports = Company;

// Define Associations after export to avoid circular deps
const User = require('./User');
const CompanyPlan = require('./CompanyPlan');

Company.hasMany(User, { foreignKey: 'company_id', as: 'users' });
Company.hasOne(CompanyPlan, { foreignKey: 'company_id', as: 'plan_details' });
Company.hasOne(require('./OnboardingRecord'), { foreignKey: 'company_id', as: 'onboarding' });
Company.belongsTo(User, { foreignKey: 'deleted_by', as: 'deletedByUser' });
Company.belongsToMany(require('./TrainingMeeting'), { 
    through: require('./TrainingMeetingCompany'), 
    foreignKey: 'company_id', 
    otherKey: 'meeting_id', 
    as: 'meetings' 
});
