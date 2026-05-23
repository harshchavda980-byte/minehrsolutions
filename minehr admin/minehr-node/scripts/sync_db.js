const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../config/database');
const fs = require('fs');

const modelsDir = path.join(__dirname, '../models');
fs.readdirSync(modelsDir).forEach(file => {
    if (file.endsWith('.js')) {
        require(path.join(modelsDir, file));
    }
});
// Need to require ATS models too
const atsDir = path.join(__dirname, '../models/ATS');
if (fs.existsSync(atsDir)) {
    fs.readdirSync(atsDir).forEach(file => {
        if (file.endsWith('.js')) {
            require(path.join(atsDir, file));
        }
    });
}

async function sync() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');
        console.log('⏳ Syncing database schema model by model (alter: true)...');
        
        for (const modelName in sequelize.models) {
            try {
                await sequelize.models[modelName].sync({ alter: true });
                console.log(`✅ Synced model: ${modelName}`);
            } catch (err) {
                console.error(`⚠️ Could not sync model ${modelName}:`, err.message);
            }
        }
        
        console.log('✅ Database schema sync process finished!');
    } catch (e) {
        console.error('❌ General Sync Error:', e);
    } finally {
        process.exit();
    }
}
sync();
