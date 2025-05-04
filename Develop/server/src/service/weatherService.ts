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

      console.log('Geolocation response:', data);

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

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): any[] {
    return weatherData
    .filter((_: any, index: number) => index % 8 ===0)
    .slice(0, 5)
    .map((data: any) => {
      const readableDate: string = new Date(data.dt * 1000).toLocaleDateString('en-US');

      return {
        city: currentWeather.city,
        date: readableDate,
        icon: data.weather[0].icon,
        iconDescription: data.weather[0].description,
        tempF: Math.round((data.main.temp * 9) / 5 + 32),
        windSpeed: data.wind.speed,
        humidity: data.main.humidity,
      };
    });
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather | Weather[] | null> {
    const coordinates = await this.fetchAndDestructureLocationData(city);

    if (!coordinates) {
      console.log('City not found');
      return null;
    }
  
    // Fetch the forecast data using the new method
    const forecastData = await this.fetchForecastData(coordinates);
  
    // Check if forecastData is null before passing it to buildForecastArray
    if (!forecastData) {
      console.log('No forecast data available');
      return null;
    }

    const currentWeather = new Weather(
      0,
      '',
      city,
      'US'
    );

    const forecast = this.buildForecastArray(currentWeather, forecastData);
    console.log('Forecast:', forecast);
    return forecast; 
  }
}

export default new WeatherService();
