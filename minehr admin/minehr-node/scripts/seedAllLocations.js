const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../config/database');
const CountryModel = require('../models/Country');
const StateModel = require('../models/State');
const CityModel = require('../models/City');
const { State, City } = require('country-state-city');

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        // Get all countries from our DB
        const dbCountries = await CountryModel.findAll();
        console.log(`Found ${dbCountries.length} countries in the database.`);

        let totalStatesAdded = 0;
        let totalCitiesAdded = 0;

        for (const dbCountry of dbCountries) {
            const isoCode = dbCountry.code;
            if (!isoCode) continue;

            const npmStates = State.getStatesOfCountry(isoCode);
            if (!npmStates || npmStates.length === 0) continue;

            for (const npmState of npmStates) {
                // Find or create the state
                let [dbState, created] = await StateModel.findOrCreate({
                    where: { name: npmState.name, country_id: dbCountry.id },
                    defaults: { status: 'Active' }
                });

                if (created) totalStatesAdded++;

                const npmCities = City.getCitiesOfState(isoCode, npmState.isoCode);
                if (npmCities && npmCities.length > 0) {
                    // Fetch existing cities to prevent duplicates
                    const existingCities = await CityModel.findAll({
                        where: { state_id: dbState.id },
                        attributes: ['name']
                    });
                    const existingNames = new Set(existingCities.map(c => c.name));
                    
                    const newCities = [];
                    // Keep track of names we add in this batch to prevent dupes in npm dataset itself
                    const addedInBatch = new Set(); 

                    for (const c of npmCities) {
                        if (!existingNames.has(c.name) && !addedInBatch.has(c.name)) {
                            newCities.push({
                                name: c.name,
                                state_id: dbState.id,
                                status: 'Active'
                            });
                            addedInBatch.add(c.name);
                        }
                    }

                    if (newCities.length > 0) {
                        await CityModel.bulkCreate(newCities);
                        totalCitiesAdded += newCities.length;
                    }
                }
            }
        }

        console.log(`✅ Seeding Complete!`);
        console.log(`Added ${totalStatesAdded} new states.`);
        console.log(`Added ${totalCitiesAdded} new cities.`);
        process.exit(0);

    } catch (err) {
        console.error('❌ Error during seeding:', err);
        process.exit(1);
    }
}

seed();
