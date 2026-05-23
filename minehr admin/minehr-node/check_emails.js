const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('minehr_admin', '3Siuy7oEZivPrzj.root', 'xvI0JrBrCdG644za', {
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  dialect: 'mysql',
  logging: false,
  dialectOptions: { ssl: { rejectUnauthorized: true } }
});

async function check() {
  const [users] = await sequelize.query("SELECT email, COUNT(*) as count FROM users GROUP BY email HAVING COUNT(*) > 1");
  console.log('Duplicate User Emails:', users);

  const [companies] = await sequelize.query("SELECT email, COUNT(*) as count FROM companies GROUP BY email HAVING COUNT(*) > 1");
  console.log('Duplicate Company Emails:', companies);

  sequelize.close();
}
check();
