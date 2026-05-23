const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Connect explicitly to the minehr_master database used by Vercel
const sequelize = new Sequelize(
    'minehr_master',
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        },
        logging: false
    }
);

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    }
}, {
    tableName: 'users',
    underscored: true,
    timestamps: true
});

const bcrypt = require('bcryptjs');

async function run() {
    try {
        await sequelize.authenticate();
        console.log('Connected to minehr_master database.');

        const user = await User.findOne({ where: { email: 'admin@minehr.com' } });
        if (!user) {
            console.error('User admin@minehr.com not found in minehr_master.');
            process.exit(1);
        }

        console.log(`Found admin user: ${user.name} with current status: ${user.status}`);
        
        // Hashing manually and saving since we bypassed standard hooks for simplicity here
        const hashedPassword = await bcrypt.hash('password123', 12);
        user.password = hashedPassword;
        await user.save();

        console.log('Password for admin@minehr.com successfully updated to password123 in minehr_master database.');
        process.exit(0);
    } catch (err) {
        console.error('Error running script:', err.message);
        process.exit(1);
    }
}

run();
