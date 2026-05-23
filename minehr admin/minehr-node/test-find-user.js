process.env.DB_NAME = 'minehr_master';
const User = require('./models/User');

async function testFind() {
    try {
        console.log('Testing User.findOne in minehr_master database...');
        const user = await User.findOne({ where: { email: 'admin@minehr.com' } });
        console.log('Success!', user ? user.toJSON() : 'No user found');
        process.exit(0);
    } catch (error) {
        console.error('Error during User.findOne:', error.message);
        process.exit(1);
    }
}

testFind();
