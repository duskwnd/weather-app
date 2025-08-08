export interface BeachLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  state?: string;
  isFavorite: boolean;
  webcamUrl?: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
}

export interface WaterData {
  temperature: number;
  waveHeight?: number;
  waveDirection?: number;
}

export interface TideData {
  current: {
    height: number;
    type: 'high' | 'low' | 'rising' | 'falling';
    time: string;
  };
  upcoming: TideEvent[];
}

export interface TideEvent {
  time: string;
  height: number;
  type: 'high' | 'low';
}

export interface ForecastDay {
  date: string;
  weather: WeatherData;
  water: WaterData;
  tide: TideData;
  highTemp: number;
  lowTemp: number;
}

export interface BeachWeatherData {
  location: BeachLocation;
  current: {
    weather: WeatherData;
    water: WaterData;
    tide: TideData;
  };
  forecast: ForecastDay[];
} 