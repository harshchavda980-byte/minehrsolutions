const TrainingBatch = require('../models/TrainingBatch');
const sequelize = require('../config/database');

async function syncTable() {
    try {
        console.log('Syncing TrainingBatch table...');
        await TrainingBatch.sync({ alter: true });
        console.log('TrainingBatch table synced successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error syncing table:', err);
        process.exit(1);
    }
}

syncTable();
