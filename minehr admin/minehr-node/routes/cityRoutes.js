const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', cityController.getCities);
router.post('/', cityController.createCity);
router.patch('/:id', cityController.updateCity);
router.delete('/:id', cityController.deleteCity);

router.get('/countries', cityController.getCountries);
router.get('/countries/active', cityController.getAllCountries);
router.post('/countries', cityController.createCountry);
router.patch('/countries/:id', cityController.updateCountry);
router.delete('/countries/:id', cityController.deleteCountry);

router.get('/states', cityController.getStates);
router.get('/states/country/:countryId', cityController.getStatesByCountry);
router.get('/cities/state/:stateId', cityController.getCitiesByState);
router.post('/states', cityController.createState);
router.patch('/states/:id', cityController.updateState);
router.delete('/states/:id', cityController.deleteState);

module.exports = router;
