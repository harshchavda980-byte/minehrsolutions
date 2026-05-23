const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OnboardingRecord = sequelize.define('OnboardingRecord', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    company_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, unique: true },

    // Welcome Email
    welcome_email_sent_at: { type: DataTypes.DATE, allowNull: true },
    welcome_email_sent_by: { type: DataTypes.STRING, allowNull: true },
    welcome_email_receiver: { type: DataTypes.STRING, allowNull: true },
    welcome_email_cc: { type: DataTypes.JSON, allowNull: true },
    welcome_email_with_invoice: { type: DataTypes.BOOLEAN, defaultValue: false },
    welcome_email_amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    welcome_email_payment_method: { type: DataTypes.STRING, allowNull: true },
    welcome_email_attachment: { type: DataTypes.STRING, allowNull: true },

    // WhatsApp Group
    whatsapp_created_at: { type: DataTypes.DATE, allowNull: true },
    whatsapp_created_by: { type: DataTypes.STRING, allowNull: true },

    // Responding Status
    responding_status: {
        type: DataTypes.ENUM('Responding', 'Not Responding', 'Pending', 'Escalated'),
        defaultValue: 'Pending'
    },

    // Training Feedback URL
    feedback_url_token: { type: DataTypes.STRING, allowNull: true },
    feedback_url_generated_at: { type: DataTypes.DATE, allowNull: true },

    // Setup / Schedule
    setup_status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Done'),
        defaultValue: 'Pending'
    },
    setup_date: { type: DataTypes.DATE, allowNull: true },
    setup_training_type: { type: DataTypes.STRING, allowNull: true },
    setup_trainer: { type: DataTypes.STRING, allowNull: true },
    setup_meeting_link: { type: DataTypes.STRING, allowNull: true },
    setup_notes: { type: DataTypes.TEXT, allowNull: true },

    // Product Training
    product_training_type: { type: DataTypes.STRING, allowNull: true },
    product_training_modules: { type: DataTypes.JSON, allowNull: true },
    product_training_date: { type: DataTypes.DATE, allowNull: true },
    product_training_trainer: { type: DataTypes.STRING, allowNull: true },
    product_training_duration: { type: DataTypes.STRING, allowNull: true },
    product_training_notes: { type: DataTypes.TEXT, allowNull: true },

    // Training Statuses (0-5 scale stored as integers)
    hr_training_status: { type: DataTypes.INTEGER, defaultValue: 0 },
    it_training_status: { type: DataTypes.INTEGER, defaultValue: 0 },
    payroll_training_status: { type: DataTypes.INTEGER, defaultValue: 0 },
    admin_training_status: { type: DataTypes.INTEGER, defaultValue: 0 },
    hr_trainer: { type: DataTypes.STRING, allowNull: true },
    it_trainer: { type: DataTypes.STRING, allowNull: true },
    payroll_trainer: { type: DataTypes.STRING, allowNull: true },
    admin_trainer: { type: DataTypes.STRING, allowNull: true },

    // Batch Meeting
    batch_type: { type: DataTypes.ENUM('batch', 'slot'), defaultValue: 'batch' },
    batch_schedule: { type: DataTypes.JSON, allowNull: true },

    // Setup Status Data (Employee, Device Setup, Data Migration)
    setup_status_data: { type: DataTypes.JSON, allowNull: true },
    setup_status_executive: { type: DataTypes.STRING, allowNull: true }
}, { underscored: true });

module.exports = OnboardingRecord;
