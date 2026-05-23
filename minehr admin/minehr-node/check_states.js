const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('minehr_admin', '3Siuy7oEZivPrzj.root', 'xvI0JrBrCdG644za', {
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  dialect: 'mysql',
  logging: false,
  dialectOptions: { ssl: { rejectUnauthorized: true } }
});

async function check() {
  const [res] = await sequelize.query("SELECT * FROM states WHERE name = 'Gujarat'");
  console.log('States:');
  console.log(res);

  const [resCity] = await sequelize.query("SELECT name, state_id, COUNT(*) as count FROM cities GROUP BY name, state_id HAVING COUNT(*) > 1");
  console.log('Cities with same state:');
  console.log(resCity);

  const [resCityGlobal] = await sequelize.query("SELECT name, COUNT(*) as count FROM cities GROUP BY name HAVING COUNT(*) > 1");
  console.log('Cities with duplicate names across states:');
  console.log(resCityGlobal);

  sequelize.close();
}
check();
