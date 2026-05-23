const Role = require('./models/Role');

async function seedAdminRole() {
    try {
        const adminRole = await Role.findOne({ where: { name: 'Super Admin' } });
        if (adminRole) {
            console.log('Super Admin role already exists.');
        } else {
            const allPerms = [
                'user_view', 'user_create', 'user_edit', 'user_delete',
                'company_view', 'company_edit', 'company_plans',
                'lead_view', 'lead_edit', 'demo_manage',
                'report_view', 'report_export', 'system_settings'
            ];
            await Role.create({
                name: 'Super Admin',
                description: 'Full system access with all administrative privileges. This is a default system role.',
                permissions: allPerms,
                status: 'Active'
            });
            console.log('Super Admin role created successfully with all permissions.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error seeding role:', error.message);
        process.exit(1);
    }
}

seedAdminRole();
