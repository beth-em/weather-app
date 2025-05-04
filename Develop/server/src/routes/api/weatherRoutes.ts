import { Router } from 'express';
import  weatherService from '../../service/weatherService.js';
import  historyService from '../../service/historyService.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ message: 'Enter city name'});
  }

  try {
    const weatherData = await weatherService.getWeatherForCity(city);
    
    if (weatherData) {
      await historyService.addCity(city); // saves city to search history

      return res.json(weatherData);
    } else {
      return res.status(404).json({ message: 'Weather data not found for this city' });
    }
  } catch (error) {
    console.error('Error retrieving weather data', error);

    if (error instanceof Error) {
    return res.status(500).json({ message: 'Error retreiving weather data', error: error.message });
  } else {
    return res.status(500).json({ message: 'An unknown error has occurred' });
    }
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  void req; // removed typescript warning for ' req '

  try {
    const history = await historyService.getCities();
    return res.json(history);
  } catch (error) {
    if (error instanceof Error) {
    return res.status(500).json({ message: 'Error fetching search history', error: error.message });
  } else {
    return res.status(500).json({ message: 'An unknown error has occurred' });
  }
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
const { id } = req.params;
  try {
    await historyService.removeCity(id);
    return res.json({ message: 'City removed from search history' });
  } catch (error) {
    if (error instanceof Error) {
    return res.status(500).json({ message: 'Error deleting city from search history', error: error.message });
  } else {
    return res.status(500).json({ message: 'An unknown error has occurred' });
   }
  }
});

export default router;
