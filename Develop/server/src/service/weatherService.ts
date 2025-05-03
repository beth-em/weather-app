import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  constructor (
    public temperature: number,
    public description: string,
    public city: string,
    public country: string
  ) {}
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.API_KEY || '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates | null> {
    try {
      const geoUrl = this.buildGeocodeQuery(query);
      const response = await fetch(geoUrl);
      const data = await response.json();

      if (data.length === 0) {
        return null;
      }

      return {
        lat: data[0].lat,
        lon: data[0].lon,
      };
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates | null> {
    const locationData = await this.fetchLocationData(query);
    if (locationData) {
      return this.destructureLocationData(locationData);
    }
    return null;
  }
  // Create fetchForecastData
private async fetchForecastData(coordinates: Coordinates): Promise<any[] | null> {
  try {
    const forecastUrl = this.buildForecastQuery(coordinates);
    const response = await fetch(forecastUrl);
    const data = await response.json();

    if (data.list && data.list.length > 0) {
      return data.list; // returns the forecast data array
    }

    return null;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return null;
  }
}
private buildForecastQuery(coordinates: Coordinates): string {
  return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
}
  // TODO: Create fetchWeatherData method
private async fetchWeatherData(coordinates: Coordinates): Promise<Weather | null> {
  try {
    const weatherUrl = this.buildWeatherQuery(coordinates); // Use buildWeatherQuery here
    const response = await fetch(weatherUrl);
    const data = await response.json();

    return new Weather(
      data.main.temp,
      data.weather[0].description,
      data.name,
      data.sys.country
    );
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return new Weather(
      response.main.temp,
      response.weather[0].description,
      response.name,
      response.sys.country,
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => {
      return new Weather(
        data.main.temp,
        data.weather[0].description,
        currentWeather.city,
        currentWeather.country,
      );
    });
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather | Weather[] | null> {
    const coordinates = await this.fetchAndDestructureLocationData(city); // Fetch and destructure location data
    if (!coordinates) {
      console.log('City not found');
      return null;
    }
  
    const weatherData = await this.fetchWeatherData(coordinates); // Fetch current weather data
    if (!weatherData) {
      console.log('Weather data is not available');
      return null;
    }
  
    const currentWeather = this.parseCurrentWeather(weatherData);
  
    // Fetch the forecast data using the new method
    const forecastData = await this.fetchForecastData(coordinates);
  
    // Check if forecastData is null before passing it to buildForecastArray
    if (forecastData) {
      const forecast = this.buildForecastArray(currentWeather, forecastData); // Process the forecast data
      console.log(forecast); // Log the forecast data (for debugging)
      return forecast; // Return the forecast (an array of Weather objects)
    } else {
      console.log('No forecast data available');
    }
  
    return currentWeather; // Return the current weather if no forecast data
  }
}

export default new WeatherService();
