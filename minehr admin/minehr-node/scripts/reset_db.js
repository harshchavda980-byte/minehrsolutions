const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const newDbName = 'minehr_admin';
        console.log(`Dropping database ${newDbName} if exists...`);
        await connection.query(`DROP DATABASE IF EXISTS ${newDbName}`);
        console.log(`Creating database ${newDbName}...`);
        await connection.query(`CREATE DATABASE ${newDbName}`);
        console.log(`Database ${newDbName} reset successfully.`);
    } catch (err) {
        console.error('Error resetting database:', err);
    } finally {
        await connection.end();
    }
}

resetDatabase();
