const sequelize = require('./config/database');

async function checkTables() {
    try {
        const [results] = await sequelize.query('SHOW TABLES');
        const tables = results.map(r => Object.values(r)[0]);
        console.log(tables.join(', '));
        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

checkTables();
