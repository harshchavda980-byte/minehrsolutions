const sequelize = require('../config/database');
const Device = require('../models/Device');

async function patch() {
    try {
        console.log('Syncing Devices table...');
        await Device.sync({ alter: true });
        console.log('Devices table synced successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Sync failed:', err);
        process.exit(1);
    }
}

patch();
