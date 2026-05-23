const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('minehr_admin', '3Siuy7oEZivPrzj.root', 'xvI0JrBrCdG644za', {
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  dialect: 'mysql',
  logging: false,
  dialectOptions: { ssl: { rejectUnauthorized: true } }
});

async function deleteDuplicate() {
  try {
    const [result] = await sequelize.query("DELETE FROM states WHERE id = 60001");
    console.log('Deleted duplicate state successfully:', result);
  } catch (err) {
    console.error('Error deleting state:', err);
  } finally {
    sequelize.close();
  }
}

deleteDuplicate();
