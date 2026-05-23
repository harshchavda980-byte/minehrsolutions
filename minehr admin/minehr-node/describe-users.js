const mysql = require('mysql2/promise');
require('dotenv').config();

async function describeTable() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'minehr_master',
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Describing users table in minehr_master:');
        const [rows] = await connection.query('DESCRIBE users');
        rows.forEach(r => {
            console.log(`- ${r.Field} (${r.Type})`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

describeTable();
