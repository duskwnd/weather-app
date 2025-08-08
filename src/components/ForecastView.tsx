import React, { useState } from 'react';
import { BeachWeatherData } from '../types/weather';
import { Calendar, Thermometer, Droplets, Wind, Waves, Clock, ExternalLink } from 'lucide-react';

interface ForecastViewProps {
  weatherData: BeachWeatherData;
  darkMode?: boolean;
}

const ForecastView: React.FC<ForecastViewProps> = ({ weatherData, darkMode = false }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'forecast'>('current');
  const { location, current, forecast } = weatherData;

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getTideIcon = (type: string): string => {
    switch (type) {
      case 'high': return '🌊';
      case 'low': return '🏖️';
      case 'rising': return '📈';
      case 'falling': return '📉';
      default: return '🌊';
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Header */}
      <div className={`transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
          : 'bg-white shadow-lg border-gray-100'
      } rounded-xl shadow-lg p-6 border`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {location.name}
            </h1>
            <p className={`transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {location.state && `${location.state}, `}{location.country}
            </p>
          </div>
          {location.webcamUrl && (
            <a
              href={location.webcamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-2"
            >
              <ExternalLink size={16} />
              <span>Live Webcam</span>
            </a>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex space-x-1 p-1 rounded-lg transition-colors duration-300 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'current'
              ? darkMode 
                ? 'bg-gray-600 text-ocean-400 shadow-sm' 
                : 'bg-white text-ocean-600 shadow-sm'
              : darkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Current Conditions
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'forecast'
              ? darkMode 
                ? 'bg-gray-600 text-ocean-400 shadow-sm' 
                : 'bg-white text-ocean-600 shadow-sm'
              : darkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          7-Day Forecast
        </button>
      </div>

      {activeTab === 'current' ? (
        /* Current Conditions */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Air Weather */}
          <div className={`transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
              : 'bg-white shadow-lg border-gray-100'
          } rounded-xl shadow-lg p-6 border`}>
            <div className="flex items-center space-x-3 mb-4">
              <Thermometer size={24} className="text-ocean-500" />
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Air Weather
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Temperature
                </span>
                <span className={`font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {current.weather.temperature}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Feels Like
                </span>
                <span className={`font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {current.weather.feelsLike}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Humidity
                </span>
                <span className={`font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {current.weather.humidity}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Description
                </span>
                <span className={`font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {current.weather.description}
                </span>
              </div>
            </div>
          </div>

          {/* Water Conditions */}
          <div className={`transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
              : 'bg-white shadow-lg border-gray-100'
          } rounded-xl shadow-lg p-6 border`}>
            <div className="flex items-center space-x-3 mb-4">
              <Droplets size={24} className="text-ocean-500" />
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Water Conditions
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Water Temp
                </span>
                <span className={`font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {current.water.temperature}°C
                </span>
              </div>
              {current.water.waveHeight && (
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Wave Height
                  </span>
                  <span className={`font-semibold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {current.water.waveHeight.toFixed(1)}m
                  </span>
                </div>
              )}
              {current.water.waveDirection && (
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Wave Direction
                  </span>
                  <span className={`font-semibold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getWindDirection(current.water.waveDirection)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Wind */}
          <div className={`transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
              : 'bg-white shadow-lg border-gray-100'
          } rounded-xl shadow-lg p-6 border`}>
            <div className="flex items-center space-x-3 mb-4">
              <Wind size={24} className="text-ocean-500" />
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Wind
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Speed
                </span>
                <span className={`font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {current.weather.windSpeed} km/h
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Direction
                </span>
                <span className={`font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {getWindDirection(current.weather.windDirection)}
                </span>
              </div>
            </div>
          </div>

          {/* Tides */}
          <div className={`transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
              : 'bg-white shadow-lg border-gray-100'
          } rounded-xl shadow-lg p-6 border md:col-span-2 lg:col-span-3`}>
            <div className="flex items-center space-x-3 mb-4">
              <Waves size={24} className="text-ocean-500" />
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Tide Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Tide */}
              <div>
                <h4 className={`font-medium mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Current Tide
                </h4>
                <div className={`rounded-lg p-4 transition-colors duration-300 ${
                  darkMode ? 'bg-ocean-900/30' : 'bg-ocean-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTideIcon(current.tide.current.type)}</span>
                    <div>
                      <div className={`font-semibold text-lg transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {current.tide.current.height.toFixed(1)}m
                      </div>
                      <div className={`text-sm capitalize transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {current.tide.current.type} tide
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {current.tide.current.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Tides */}
              <div>
                <h4 className={`font-medium mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Upcoming Tides
                </h4>
                <div className="space-y-2">
                  {current.tide.upcoming.map((tide, index) => (
                    <div key={index} className={`flex items-center justify-between rounded-lg p-3 transition-colors duration-300 ${
                      darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTideIcon(tide.type)}</span>
                        <span className={`font-medium capitalize transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {tide.type} tide
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {tide.height.toFixed(1)}m
                        </div>
                        <div className={`text-sm transition-colors duration-300 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {tide.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 7-Day Forecast */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className={`transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
                  : 'bg-white shadow-lg border-gray-100'
              } rounded-xl shadow-lg p-6 border`}>
                <div className="text-center mb-4">
                  <div className={`text-sm font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-xs transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Air Temperature */}
                  <div className="text-center">
                    <div className={`text-lg font-bold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {day.highTemp}°C
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {day.lowTemp}°C
                    </div>
                  </div>

                  {/* Weather Description */}
                  <div className="text-center">
                    <div className={`text-sm font-medium transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {day.weather.description}
                    </div>
                  </div>

                  {/* Water Temperature */}
                  <div className="text-center">
                    <div className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Water
                    </div>
                    <div className="text-sm font-semibold text-ocean-600">
                      {day.water.temperature}°C
                    </div>
                  </div>

                  {/* Wind */}
                  <div className="text-center">
                    <div className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Wind
                    </div>
                    <div className={`text-sm font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {day.weather.windSpeed} km/h
                    </div>
                    <div className={`text-xs transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {getWindDirection(day.weather.windDirection)}
                    </div>
                  </div>

                  {/* Tide */}
                  <div className="text-center">
                    <div className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Tide
                    </div>
                    <div className={`text-sm font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {day.tide.current.height.toFixed(1)}m
                    </div>
                    <div className={`text-xs transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    } capitalize`}>
                      {day.tide.current.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastView; 