const Country = require('../models/Country');
const State = require('../models/State');
const City = require('../models/City');
const sequelize = require('../config/database');

const countries = [
    { name: 'India', code: 'IN', status: 'Active' },
    { name: 'United States', code: 'US', status: 'Active' },
    { name: 'United Kingdom', code: 'UK', status: 'Active' },
    { name: 'United Arab Emirates', code: 'AE', status: 'Active' },
    { name: 'Australia', code: 'AU', status: 'Active' }
];

const states = {
    'India': [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
        'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
        'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
        'Uttarakhand', 'West Bengal', 'Delhi'
    ],
    'United States': ['California', 'New York', 'Texas', 'Florida', 'Illinois'],
    'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah']
};

const cities = {
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Delhi': ['New Delhi', 'Delhi NCR'],
    'Dubai': ['Dubai City'],
    'Abu Dhabi': ['Abu Dhabi City'],
    'California': ['Los Angeles', 'San Francisco', 'San Diego'],
    'New York': ['New York City', 'Buffalo']
};

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Database connected for seeding...');

        for (const cData of countries) {
            const [country] = await Country.findOrCreate({
                where: { name: cData.name },
                defaults: cData
            });
            console.log(`- Country: ${country.name}`);

            const stateNames = states[country.name] || [];
            for (const sName of stateNames) {
                const [state] = await State.findOrCreate({
                    where: { name: sName, country_id: country.id },
                    defaults: { name: sName, country_id: country.id, status: 'Active' }
                });
                console.log(`  -- State: ${state.name}`);

                const cityNames = cities[state.name] || [];
                for (const cityName of cityNames) {
                    await City.findOrCreate({
                        where: { name: cityName, state_id: state.id },
                        defaults: { name: cityName, state_id: state.id, status: 'Active' }
                    });
                }
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
