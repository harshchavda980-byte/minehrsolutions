const User = require('./models/User');

async function updateAdminPassword() {
    try {
        const user = await User.findOne({ where: { email: 'admin@minehr.com' } });
        if (!user) {
            console.error('User admin@minehr.com not found in database.');
            process.exit(1);
        }
        
        user.password = 'password123';
        // Saving the user will trigger the beforeUpdate hook which hashes the password using bcrypt
        await user.save();
        
        console.log('Password for admin@minehr.com updated successfully to password123.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating password:', error.message);
        process.exit(1);
    }
}

updateAdminPassword();
