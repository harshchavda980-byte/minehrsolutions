const sequelize = require('../config/database');
const OnboardingRecord = require('../models/OnboardingRecord');

async function syncOnboarding() {
    try {
        console.log('Syncing OnboardingRecord model...');
        await OnboardingRecord.sync({ alter: true });
        console.log('OnboardingRecord table synchronized successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing OnboardingRecord table:', error);
        process.exit(1);
    }
}

syncOnboarding();
