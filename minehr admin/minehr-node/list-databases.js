const mysql = require('mysql2/promise');
require('dotenv').config();

async function listDbs() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const [rows] = await connection.query('SHOW DATABASES');
        console.log('Databases available:');
        rows.forEach(r => {
            console.log(`- ${r.Database}`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

listDbs();
