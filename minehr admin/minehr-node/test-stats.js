const Company = require('./models/Company');
const Lead = require('./models/Lead');
const Ticket = require('./models/Ticket');
const User = require('./models/User');
const ActivityLog = require('./models/ActivityLog');
const { Op } = require('sequelize');

async function testStats() {
    try {
        console.log('Testing Company.count()...');
        const totalCompanies = await Company.count();
        console.log('totalCompanies:', totalCompanies);

        console.log('Testing Lead.count()...');
        const totalCRM = await Lead.count();
        console.log('totalCRM:', totalCRM);

        console.log('Testing Ticket.count()...');
        const ticketsSupport = await Ticket.count({ where: { status: 'Open' } });
        console.log('ticketsSupport:', ticketsSupport);

        console.log('Testing ActivityLog.count()...');
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayActivityCount = await ActivityLog.count({
            where: { created_at: { [Op.gte]: todayStart } }
        });
        console.log('todayActivityCount:', todayActivityCount);

        process.exit(0);
    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    }
}

testStats();
