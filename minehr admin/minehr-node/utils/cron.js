const cron = require('node-cron');
const User = require('../models/User');
const Company = require('../models/Company');
const Intimation = require('../models/Intimation');
const { Op } = require('sequelize');

// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily recycle bin cleanup...');
    try {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        const models = [
            { model: User, name: 'Users' },
            { model: Company, name: 'Companies' },
            { model: Intimation, name: 'Automations' }
        ];

        for (const { model, name } of models) {
            const deletedCount = await model.destroy({
                where: {
                    [Op.or]: [
                        { purge_at: { [Op.lt]: new Date() } },
                        { deleted_at: { [Op.lt]: fifteenDaysAgo } }
                    ]
                },
                force: true,
                paranoid: false
            });
            if (deletedCount > 0) {
                console.log(`Permanently deleted ${deletedCount} ${name} from recycle bin.`);
            }
        }

        console.log('Recycle bin cleanup complete.');
    } catch (err) {
        console.error('Recycle bin cleanup error:', err);
    }
});
