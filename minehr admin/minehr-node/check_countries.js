const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('minehr_admin', '3Siuy7oEZivPrzj.root', 'xvI0JrBrCdG644za', {
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  dialect: 'mysql',
  logging: false,
  dialectOptions: { ssl: { rejectUnauthorized: true } }
});

async function check() {
  const [res] = await sequelize.query("SELECT * FROM countries");
  console.log('Countries:', res);
  sequelize.close();
}
check();
