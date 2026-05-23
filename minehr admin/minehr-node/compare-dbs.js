const mysql = require('mysql2/promise');
require('dotenv').config();

async function compare() {
    const conn1 = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'minehr_admin',
        ssl: { rejectUnauthorized: false }
    });

    const conn2 = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'minehr_master',
        ssl: { rejectUnauthorized: false }
    });

    try {
        const [tablesAdmin] = await conn1.query('SHOW TABLES');
        const [tablesMaster] = await conn2.query('SHOW TABLES');

        const adminTables = tablesAdmin.map(t => Object.values(t)[0]);
        const masterTables = tablesMaster.map(t => Object.values(t)[0]);

        console.log(`minehr_admin tables: ${adminTables.length}`);
        console.log(`minehr_master tables: ${masterTables.length}`);

        const onlyAdmin = adminTables.filter(t => !masterTables.includes(t));
        const onlyMaster = masterTables.filter(t => !adminTables.includes(t));

        if (onlyAdmin.length > 0) {
            console.log('Tables only in minehr_admin:', onlyAdmin);
        }
        if (onlyMaster.length > 0) {
            console.log('Tables only in minehr_master:', onlyMaster);
        }

        // Compare columns for shared tables
        const shared = adminTables.filter(t => masterTables.includes(t));
        for (const table of shared) {
            const [colsAdmin] = await conn1.query(`DESCRIBE \`${table}\``);
            const [colsMaster] = await conn2.query(`DESCRIBE \`${table}\``);

            const cAdmin = colsAdmin.map(c => c.Field);
            const cMaster = colsMaster.map(c => c.Field);

            const onlyA = cAdmin.filter(c => !cMaster.includes(c));
            const onlyM = cMaster.filter(c => !cAdmin.includes(c));

            if (onlyA.length > 0 || onlyM.length > 0) {
                console.log(`\nTable: ${table}`);
                if (onlyA.length > 0) console.log(`  Columns only in minehr_admin:`, onlyA);
                if (onlyM.length > 0) console.log(`  Columns only in minehr_master:`, onlyM);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await conn1.end();
        await conn2.end();
    }
}

compare();
