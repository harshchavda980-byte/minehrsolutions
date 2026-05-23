const sequelize = require('../config/database');

async function patch() {
    try {
        console.log('Starting DB patch for recycle bin fields...');
        
        // Add columns to companies
        await sequelize.query('ALTER TABLE companies ADD COLUMN IF NOT EXISTS deleted_by BIGINT UNSIGNED NULL');
        await sequelize.query('ALTER TABLE companies ADD COLUMN IF NOT EXISTS purge_at DATETIME NULL');
        
        // Add columns to users
        await sequelize.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_by BIGINT UNSIGNED NULL');
        await sequelize.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS purge_at DATETIME NULL');
        
        // Add columns to Intimations
        await sequelize.query('ALTER TABLE Intimations ADD COLUMN IF NOT EXISTS deleted_by BIGINT UNSIGNED NULL');
        await sequelize.query('ALTER TABLE Intimations ADD COLUMN IF NOT EXISTS purge_at DATETIME NULL');
        
        console.log('DB patch completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Patch failed:', err);
        process.exit(1);
    }
}

patch();
