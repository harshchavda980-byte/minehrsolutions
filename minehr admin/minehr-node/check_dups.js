const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('minehr_admin', '3Siuy7oEZivPrzj.root', 'xvI0JrBrCdG644za', {
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  dialect: 'mysql',
  logging: false,
  dialectOptions: { ssl: { rejectUnauthorized: true } }
});

async function findDuplicates(table, groupByFields) {
  const query = `
    SELECT ${groupByFields.join(', ')}, COUNT(*) as count
    FROM ${table}
    GROUP BY ${groupByFields.join(', ')}
    HAVING COUNT(*) > 1
  `;
  const [results] = await sequelize.query(query);
  return results;
}

async function checkDups() {
  try {
    const countries = await findDuplicates('countries', ['name']);
    if (countries.length) console.log('Duplicate countries:', countries);

    const states = await findDuplicates('states', ['name', 'country_id']);
    if (states.length) console.log('Duplicate states:', states);

    const cities = await findDuplicates('cities', ['name', 'state_id']);
    if (cities.length) console.log('Duplicate cities:', cities);

    const roles = await findDuplicates('roles', ['name']);
    if (roles.length) console.log('Duplicate roles:', roles);

    const industries = await findDuplicates('IndustryTypes', ['name']);
    if (industries.length) console.log('Duplicate industries:', industries);
    
    console.log('Finished duplicate check.');
  } catch(e) {
    console.error(e.message);
  } finally {
    sequelize.close();
  }
}
checkDups();
