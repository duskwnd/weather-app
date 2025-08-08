import React, { useState, useEffect } from 'react';
import { BeachLocation, BeachWeatherData } from './types/weather';
import { weatherService } from './services/weatherService.ts';
import LocationCard from './components/LocationCard.tsx';
import ForecastView from './components/ForecastView.tsx';
import AddLocationModal from './components/AddLocationModal.tsx';
import { Plus, MapPin, Sun, Moon } from 'lucide-react';

function App() {
  const [locations, setLocations] = useState<BeachLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<BeachWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const beachLocations = await weatherService.getBeachLocations();
      setLocations(beachLocations);
      
      // Load weather for the first favorite location or first location
      const firstLocation = beachLocations.find(loc => loc.isFavorite) || beachLocations[0];
      if (firstLocation) {
        const weatherData = await weatherService.getBeachWeather(firstLocation.id);
        setSelectedLocation(weatherData);
      }
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (locationId: string) => {
    try {
      const weatherData = await weatherService.getBeachWeather(locationId);
      setSelectedLocation(weatherData);
    } catch (error) {
      console.error('Failed to load weather data:', error);
    }
  };

  const handleToggleFavorite = async (locationId: string) => {
    try {
      await weatherService.toggleFavorite(locationId);
      setLocations(prev => 
        prev.map(loc => 
          loc.id === locationId 
            ? { ...loc, isFavorite: !loc.isFavorite }
            : loc
        )
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    try {
      await weatherService.deleteBeachLocation(locationId);
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
      
      // If deleted location was selected, select first available
      if (selectedLocation?.location.id === locationId) {
        const firstLocation = locations.find(loc => loc.id !== locationId);
        if (firstLocation) {
          const weatherData = await weatherService.getBeachWeather(firstLocation.id);
          setSelectedLocation(weatherData);
        } else {
          setSelectedLocation(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete location:', error);
    }
  };

  const handleAddLocation = async (locationData: Omit<BeachLocation, 'id'>) => {
    try {
      const newLocation = await weatherService.addBeachLocation(locationData);
      setLocations(prev => [...prev, newLocation]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add location:', error);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-ocean-50 to-ocean-100'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-500 mx-auto mb-4"></div>
          <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-ocean-600'}`}>
            Loading beach locations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-ocean-50 to-ocean-100'
    }`}>
      {/* Header */}
      <header className={`transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
          : 'bg-white shadow-sm border-gray-200'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏖️</div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Beach Weather
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Your perfect beach day starts here
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-sand-500 hover:bg-sand-600 text-white'
                }`}
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Beach</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Locations Panel */}
          <div className="lg:col-span-1">
            <div className={`transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
                : 'bg-white shadow-lg border-gray-100'
            } rounded-xl shadow-lg p-6 border`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold flex items-center transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <MapPin size={20} className="mr-2" />
                  My Beaches
                </h2>
                <div className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {locations.filter(loc => loc.isFavorite).length} favorites
                </div>
              </div>

              {locations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🏖️</div>
                  <p className={`mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No beach locations added yet
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary"
                  >
                    Add Your First Beach
                  </button>
                </div>
              ) : (
                <div className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4' : ''}`}>
                  {locations.map(location => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      isSelected={selectedLocation?.location.id === location.id}
                      onSelect={() => handleLocationSelect(location.id)}
                      onToggleFavorite={() => handleToggleFavorite(location.id)}
                      onDelete={() => handleDeleteLocation(location.id)}
                      viewMode={viewMode}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Weather Details Panel */}
          <div className="lg:col-span-2">
            {selectedLocation ? (
              <ForecastView weatherData={selectedLocation} darkMode={darkMode} />
            ) : (
              <div className={`transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
                  : 'bg-white shadow-lg border-gray-100'
              } rounded-xl shadow-lg p-6 border text-center py-12`}>
                <div className="text-6xl mb-4">🌊</div>
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Select a Beach Location
                </h3>
                <p className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Choose a beach from the left panel to view detailed weather information
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddModal && (
        <AddLocationModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLocation}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default App;
