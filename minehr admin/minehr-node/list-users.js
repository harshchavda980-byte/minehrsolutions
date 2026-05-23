const User = require('./models/User');

async function listUsers() {
    try {
        const users = await User.findAll({ paranoid: false }); // Include deleted users
        console.log(`Total users found: ${users.length}`);
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}) [Status: ${u.status}] [Deleted: ${u.deleted_at ? 'YES' : 'NO'}]`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

listUsers();
