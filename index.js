const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const weatherPromises = cities.map(async (city) => {
      const weatherData = await getWeatherData(city);
      return { [city]: weatherData };
    });

    const weatherResults = await Promise.all(weatherPromises);
    const result = { weather: {} };

    weatherResults.forEach((item) => {
      const cityName = Object.keys(item)[0];
      result.weather[cityName] = item[cityName];
    });

    res.json(result);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getWeatherData(city) {
  const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(apiUrl);
    return `${response.data.main.temp}°C`;
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message);
    return 'N/A';
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
