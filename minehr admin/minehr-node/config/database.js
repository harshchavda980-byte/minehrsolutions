const { Sequelize } = require('sequelize');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const sequelize = new Sequelize(
    process.env.DB_NAME || 'minehr',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        dialectModule: require('mysql2'), // Force Vercel to bundle the mysql2 driver
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? {
                rejectUnauthorized: false
            } : false
        },
        logging: (sql, timing) => {
            if (timing > 500) {
                console.warn(`[SLOW QUERY] (${timing}ms): ${sql}`);
            }
        },
        benchmark: true,
        define: {
            underscored: true
        },
        pool: {
            max: 20,         // Increased from 5 to 20 for better internal system performance
            min: 5,
            acquire: 60000, 
            idle: 20000     
        }
    }
);

module.exports = sequelize;
