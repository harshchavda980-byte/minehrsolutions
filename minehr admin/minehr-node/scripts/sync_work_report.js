require('dotenv').config();
const sequelize = require('../config/database');
const WorkReport = require('../models/WorkReport');

async function syncWorkReportTable() {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL via Sequelize');
        await WorkReport.sync({ alter: true });
        console.log('✅ WorkReport table synced successfully.');
    } catch (err) {
        console.error('❌ Sync failed:', err.message);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

syncWorkReportTable();
