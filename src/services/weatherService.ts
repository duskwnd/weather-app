import { BeachLocation, BeachWeatherData, WeatherData, WaterData, TideData, ForecastDay } from '../types/weather';

// Iberia-focused default beaches (Portugal + Spain)
const defaultBeachLocations: BeachLocation[] = [
  {
    id: 'pt-caparica',
    name: 'Costa da Caparica',
    latitude: 38.6413,
    longitude: -9.2386,
    country: 'Portugal',
    state: 'Setúbal',
    isFavorite: true
  },
  {
    id: 'pt-guincho',
    name: 'Praia do Guincho',
    latitude: 38.7329,
    longitude: -9.4730,
    country: 'Portugal',
    state: 'Lisboa',
    isFavorite: false
  }
];

// Helper for an 'unknown' tide structure (no fabricated numbers)
function unknownTide(): TideData {
  return {
    current: {
      height: NaN,
      type: 'low',
      time: ''
    },
    upcoming: []
  };
}

async function fetchOpenMeteoAir(latitude: number, longitude: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch air weather');
  return res.json();
}

async function fetchOpenMeteoMarine(latitude: number, longitude: number) {
  const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&current=wave_height,wave_direction,sea_surface_temperature&hourly=sea_surface_temperature,wave_height,wave_direction&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch marine weather');
  return res.json();
}

async function fetchOpenMeteoTide(latitude: number, longitude: number) {
  const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=tide_height&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tide');
  return res.json();
}

function mapAirToWeatherData(air: any): WeatherData {
  return {
    temperature: Number(air.current?.temperature_2m ?? 0),
    feelsLike: Number(air.current?.temperature_2m ?? 0),
    humidity: Number(air.current?.relative_humidity_2m ?? 0),
    windSpeed: Number(air.current?.wind_speed_10m ?? 0),
    windDirection: Number(air.current?.wind_direction_10m ?? 0),
    description: '—',
    icon: 'clear'
  };
}

function mapMarineToWaterData(marine: any): WaterData {
  const temp = marine.current?.sea_surface_temperature ?? marine.hourly?.sea_surface_temperature?.[0] ?? null;
  const waveHeight = marine.current?.wave_height ?? marine.hourly?.wave_height?.[0] ?? null;
  const waveDirection = marine.current?.wave_direction ?? marine.hourly?.wave_direction?.[0] ?? null;
  return {
    temperature: temp !== null ? Number(temp) : NaN,
    waveHeight: waveHeight !== null ? Number(waveHeight) : undefined,
    waveDirection: waveDirection !== null ? Number(waveDirection) : undefined
  };
}

function mapDailyToForecast(air: any, marine: any): ForecastDay[] {
  const days: ForecastDay[] = [];
  const dates: string[] = air.daily?.time || [];
  for (let i = 0; i < Math.min(7, dates.length); i++) {
    const date = dates[i];
    const high = Number(air.daily?.temperature_2m_max?.[i] ?? 0);
    const low = Number(air.daily?.temperature_2m_min?.[i] ?? 0);
    const waterTemp = marine.hourly?.sea_surface_temperature?.[i] ?? marine.current?.sea_surface_temperature ?? null;
    const waveHeight = marine.hourly?.wave_height?.[i] ?? marine.current?.wave_height ?? null;
    const waveDirection = marine.hourly?.wave_direction?.[i] ?? marine.current?.wave_direction ?? null;

    const weather: WeatherData = {
      temperature: high,
      feelsLike: high,
      humidity: Number(air.current?.relative_humidity_2m ?? 0),
      windSpeed: Number(air.current?.wind_speed_10m ?? 0),
      windDirection: Number(air.current?.wind_direction_10m ?? 0),
      description: '—',
      icon: 'clear'
    };
    const water: WaterData = {
      temperature: waterTemp !== null ? Number(waterTemp) : NaN,
      waveHeight: waveHeight !== null ? Number(waveHeight) : undefined,
      waveDirection: waveDirection !== null ? Number(waveDirection) : undefined
    };

    days.push({
      date,
      weather,
      water,
      tide: unknownTide(),
      highTemp: high,
      lowTemp: low
    });
  }
  return days;
}

// In-memory list that can be mutated by add/delete
const beachLocations: BeachLocation[] = [...defaultBeachLocations];

export const weatherService = {
  getBeachLocations: async (): Promise<BeachLocation[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return beachLocations;
  },

  getBeachWeather: async (locationId: string): Promise<BeachWeatherData | null> => {
    const location = beachLocations.find(l => l.id === locationId);
    if (!location) return null;

    const [air, marine] = await Promise.all([
      fetchOpenMeteoAir(location.latitude, location.longitude).catch(() => null),
      fetchOpenMeteoMarine(location.latitude, location.longitude).catch(() => null)
    ]);

    const currentWeather: WeatherData = air ? mapAirToWeatherData(air) : {
      temperature: NaN,
      feelsLike: NaN,
      humidity: 0,
      windSpeed: 0,
      windDirection: 0,
      description: 'N/A',
      icon: 'clear'
    };

    const currentWater: WaterData = marine ? mapMarineToWaterData(marine) : {
      temperature: NaN,
      waveHeight: undefined,
      waveDirection: undefined
    };

    const forecast: ForecastDay[] = air && marine ? mapDailyToForecast(air, marine) : [];

    // Tide via Open-Meteo hourly tide height. Derive current and next extrema.
    let tide: TideData = generateFallbackTide();
    try {
      const tideJson = await fetchOpenMeteoTide(location.latitude, location.longitude);
      const times: string[] = tideJson.hourly?.time || [];
      const heights: number[] = tideJson.hourly?.tide_height || [];
      if (times.length && heights.length && times.length === heights.length) {
        const nowIso = new Date().toISOString().slice(0, 13); // hour resolution
        const idxNow = Math.max(0, times.findIndex((t: string) => t.startsWith(nowIso)));
        const currentHeight = Number(heights[idxNow] ?? heights[0]);
        const next = Number(heights[Math.min(heights.length - 1, idxNow + 1)] ?? currentHeight);
        const rising = next > currentHeight;
        const currentType = rising ? 'rising' : 'falling';

        // Find next high and low after idxNow by simple local extrema search
        let nextHigh: { time: string; height: number } | null = null;
        let nextLow: { time: string; height: number } | null = null;
        for (let i = idxNow + 1; i < heights.length - 1; i++) {
          const h0 = heights[i - 1];
          const h1 = heights[i];
          const h2 = heights[i + 1];
          if (h1 > h0 && h1 >= h2 && !nextHigh) {
            nextHigh = { time: times[i], height: Number(h1) };
          }
          if (h1 < h0 && h1 <= h2 && !nextLow) {
            nextLow = { time: times[i], height: Number(h1) };
          }
          if (nextHigh && nextLow) break;
        }

        tide = {
          current: {
            height: Number(currentHeight.toFixed(2)),
            type: currentType as any,
            time: times[idxNow]?.slice(11, 16) || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          },
          upcoming: [
            ...(nextHigh ? [{ time: nextHigh.time.slice(11, 16), height: Number(nextHigh.height.toFixed(2)), type: 'high' as const }] : []),
            ...(nextLow ? [{ time: nextLow.time.slice(11, 16), height: Number(nextLow.height.toFixed(2)), type: 'low' as const }] : [])
          ]
        };
      }
    } catch {
      tide = unknownTide();
    }

    return {
      location,
      current: {
        weather: currentWeather,
        water: currentWater,
        tide
      },
      forecast
    };
  },

  addBeachLocation: async (location: Omit<BeachLocation, 'id'>): Promise<BeachLocation> => {
    // Auto webcam URL if not provided: link to Windy webcams near coordinates
    const webcamUrl = location.webcamUrl || `https://www.windy.com/-Webcams/webcams?${location.latitude.toFixed(3)},${location.longitude.toFixed(3)},11`;
    // Deduplicate by name or coordinates (within ~100m)
    const existing = beachLocations.find(b => 
      b.name.toLowerCase() === location.name.toLowerCase() ||
      (Math.abs(b.latitude - location.latitude) < 0.001 && Math.abs(b.longitude - location.longitude) < 0.001)
    );
    if (existing) {
      // Ensure webcam
      if (!existing.webcamUrl) existing.webcamUrl = webcamUrl;
      return existing;
    }
    const newLocation: BeachLocation = { ...location, webcamUrl, id: Date.now().toString() };
    beachLocations.push(newLocation);
    return newLocation;
  },

  deleteBeachLocation: async (locationId: string): Promise<void> => {
    const idx = beachLocations.findIndex(b => b.id === locationId);
    if (idx >= 0) beachLocations.splice(idx, 1);
  },

  toggleFavorite: async (locationId: string): Promise<void> => {
    const loc = beachLocations.find(b => b.id === locationId);
    if (loc) loc.isFavorite = !loc.isFavorite;
  }
};