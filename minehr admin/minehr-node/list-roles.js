const Role = require('./models/Role');

async function listRoles() {
    try {
        const roles = await Role.findAll();
        console.log(`Total roles found: ${roles.length}`);
        roles.forEach(r => {
            console.log(`- ${r.name} (${r.permissions?.length || 0} perms)`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

listRoles();
