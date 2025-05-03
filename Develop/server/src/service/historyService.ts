import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

// convert ES module (in tsconfig) URL to file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}
// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, './server/db/db.json');
  } 
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, 'utf-8', (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(JSON.parse(data));
      });
    });
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    try {
      return await this.read();
    } catch (error) {
      console.error('Error reading search history:', error);
      return[];
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<void> {
    try {
      const cities = await this.getCities();
      const newCity = new City(Date.now().toString(), city);
      cities.push(newCity);
      await this.write(cities);
    } catch (error) {
      console.error('Error adding city to search history', error);
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    try {
      const cities = await this.getCities();
      const updatedCities = cities.filter(city => city.id !== id);
      await this.write(updatedCities);
    } catch (error) {
      console.error('Error removing city from search history:', error);
    }
  }
}

export default new HistoryService();
