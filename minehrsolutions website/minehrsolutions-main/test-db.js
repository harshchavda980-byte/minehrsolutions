const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'minehr'
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database');
    db.query('SHOW TABLES', (err, results) => {
      if (err) {
        console.error('Query error:', err);
      } else {
        console.log('Tables:', results);
      }
      db.end();
    });
  }
});
