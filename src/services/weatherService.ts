import { BeachLocation, BeachWeatherData, WeatherData, WaterData, TideData, ForecastDay } from '../types/weather';

// Mock beach locations
export const mockBeachLocations: BeachLocation[] = [
  {
    id: '1',
    name: 'Miami Beach',
    latitude: 25.7907,
    longitude: -80.1300,
    country: 'USA',
    state: 'Florida',
    isFavorite: true,
    webcamUrl: 'https://www.earthcam.com/usa/florida/miamibeach/'
  },
  {
    id: '2',
    name: 'Malibu Beach',
    latitude: 34.0259,
    longitude: -118.7798,
    country: 'USA',
    state: 'California',
    isFavorite: false,
    webcamUrl: 'https://www.earthcam.com/usa/california/malibu/'
  },
  {
    id: '3',
    name: 'Bondi Beach',
    latitude: -33.8915,
    longitude: 151.2767,
    country: 'Australia',
    state: 'New South Wales',
    isFavorite: true
  },
  {
    id: '4',
    name: 'Copacabana Beach',
    latitude: -22.9716,
    longitude: -43.1826,
    country: 'Brazil',
    state: 'Rio de Janeiro',
    isFavorite: false
  }
];

// Generate mock weather data
const generateMockWeather = (): WeatherData => ({
  temperature: Math.floor(Math.random() * 30) + 15,
  feelsLike: Math.floor(Math.random() * 30) + 15,
  humidity: Math.floor(Math.random() * 40) + 40,
  windSpeed: Math.floor(Math.random() * 20) + 5,
  windDirection: Math.floor(Math.random() * 360),
  description: ['Sunny', 'Partly Cloudy', 'Clear', 'Breezy', 'Overcast'][Math.floor(Math.random() * 5)],
  icon: 'sunny'
});

// Generate mock water data
const generateMockWater = (): WaterData => ({
  temperature: Math.floor(Math.random() * 15) + 20,
  waveHeight: Math.random() * 3 + 0.5,
  waveDirection: Math.floor(Math.random() * 360)
});

// Generate mock tide data
const generateMockTide = (): TideData => {
  const tideTypes: ('high' | 'low' | 'rising' | 'falling')[] = ['high', 'low', 'rising', 'falling'];
  const currentType = tideTypes[Math.floor(Math.random() * tideTypes.length)];
  
  return {
    current: {
      height: Math.random() * 2 + 0.5,
      type: currentType,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
    upcoming: [
      {
        time: '14:30',
        height: 1.8,
        type: 'high'
      },
      {
        time: '20:45',
        height: 0.3,
        type: 'low'
      },
      {
        time: '02:15',
        height: 1.9,
        type: 'high'
      }
    ]
  };
};

// Generate 7-day forecast
const generateForecast = (): ForecastDay[] => {
  const forecast: ForecastDay[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const highTemp = Math.floor(Math.random() * 15) + 20;
    const lowTemp = highTemp - Math.floor(Math.random() * 10) - 5;
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      weather: generateMockWeather(),
      water: generateMockWater(),
      tide: generateMockTide(),
      highTemp,
      lowTemp
    });
  }
  
  return forecast;
};

// Mock API functions
export const weatherService = {
  // Get all beach locations
  getBeachLocations: async (): Promise<BeachLocation[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBeachLocations;
  },

  // Get weather data for a specific location
  getBeachWeather: async (locationId: string): Promise<BeachWeatherData | null> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const location = mockBeachLocations.find(loc => loc.id === locationId);
    if (!location) return null;

    return {
      location,
      current: {
        weather: generateMockWeather(),
        water: generateMockWater(),
        tide: generateMockTide()
      },
      forecast: generateForecast()
    };
  },

  // Add new beach location
  addBeachLocation: async (location: Omit<BeachLocation, 'id'>): Promise<BeachLocation> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newLocation: BeachLocation = {
      ...location,
      id: Date.now().toString()
    };
    
    mockBeachLocations.push(newLocation);
    return newLocation;
  },

  // Delete beach location
  deleteBeachLocation: async (locationId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockBeachLocations.findIndex(loc => loc.id === locationId);
    if (index > -1) {
      mockBeachLocations.splice(index, 1);
    }
  },

  // Toggle favorite status
  toggleFavorite: async (locationId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const location = mockBeachLocations.find(loc => loc.id === locationId);
    if (location) {
      location.isFavorite = !location.isFavorite;
    }
  }
}; 