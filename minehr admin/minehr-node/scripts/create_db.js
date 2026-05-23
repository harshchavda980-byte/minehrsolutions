const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
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
        console.log(`Creating database ${newDbName}...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${newDbName}`);
        console.log(`Database ${newDbName} created successfully.`);
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await connection.end();
    }
}

createDatabase();
