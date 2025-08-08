import React, { useState, useEffect, useRef } from 'react';
import { BeachLocation } from '../types/weather';
import { SearchResult, searchService } from '../services/searchService.ts';
import { X, MapPin, Search, Globe, Star } from 'lucide-react';

interface AddLocationModalProps {
  onClose: () => void;
  onAdd: (location: Omit<BeachLocation, 'id'>) => void;
  darkMode?: boolean;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({ onClose, onAdd, darkMode = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [webcamUrl, setWebcamUrl] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchService.searchLocations(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleResultSelect = (result: SearchResult) => {
    setSelectedResult(result);
    setSearchQuery(result.displayName);
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    if (!selectedResult) return;

    const locationData: Omit<BeachLocation, 'id'> = {
      name: selectedResult.name,
      latitude: selectedResult.latitude,
      longitude: selectedResult.longitude,
      country: selectedResult.country,
      state: selectedResult.state,
      webcamUrl: webcamUrl.trim() || undefined,
      isFavorite
    };

    onAdd(locationData);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const locationData: Omit<BeachLocation, 'id'> = {
      name: formData.get('name') as string,
      latitude: parseFloat(formData.get('latitude') as string),
      longitude: parseFloat(formData.get('longitude') as string),
      country: formData.get('country') as string,
      state: formData.get('state') as string || undefined,
      webcamUrl: formData.get('webcamUrl') as string || undefined,
      isFavorite
    };

    onAdd(locationData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white'
      } rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold flex items-center transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <MapPin size={20} className="mr-2 text-ocean-500" />
              Add New Beach
            </h2>
            <button
              onClick={onClose}
              className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Interface */}
          {!showManualForm ? (
            <div className="space-y-4">
              {/* Search Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Search for Portuguese beaches (e.g., Coelhos, Marinha, Benagil)..."
                  autoFocus
                />
              </div>

              {/* Search Results */}
              {isSearching && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ocean-500 mx-auto"></div>
                  <p className={`text-sm mt-2 transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Searching...
                  </p>
                </div>
              )}

              {searchResults.length > 0 && !isSearching && (
                <div className={`border rounded-lg max-h-60 overflow-y-auto transition-colors duration-300 ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultSelect(result)}
                      className={`w-full p-3 text-left border-b last:border-b-0 transition-colors ${
                        darkMode 
                          ? 'hover:bg-gray-700 border-gray-600' 
                          : 'hover:bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin size={16} className="text-ocean-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium truncate transition-colors duration-300 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {result.name}
                          </div>
                          <div className={`text-sm truncate transition-colors duration-300 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {result.state && `${result.state}, `}{result.country}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Result */}
              {selectedResult && (
                <div className={`rounded-lg p-4 border transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-ocean-900/30 border-ocean-700' 
                    : 'bg-ocean-50 border-ocean-200'
                }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <MapPin size={20} className="text-ocean-500" />
                    <div>
                      <h3 className={`font-semibold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {selectedResult.name}
                      </h3>
                      <p className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {selectedResult.state && `${selectedResult.state}, `}{selectedResult.country}
                      </p>
                    </div>
                  </div>

                  {/* Webcam URL */}
                  <div className="mb-3">
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Live Webcam URL (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={webcamUrl}
                        onChange={(e) => setWebcamUrl(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm transition-all duration-200 ${
                          darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="https://www.earthcam.com/..."
                      />
                      <Globe size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Favorite Toggle */}
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="isFavorite"
                      checked={isFavorite}
                      onChange={(e) => setIsFavorite(e.target.checked)}
                      className="h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFavorite" className={`ml-2 flex items-center text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <Star size={14} className="mr-1" />
                      Add to favorites
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 btn-primary"
                    >
                      Add Beach
                    </button>
                    <button
                      onClick={() => setSelectedResult(null)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Manual Form Toggle */}
              <div className="text-center">
                <button
                  onClick={() => setShowManualForm(true)}
                  className="text-sm text-ocean-600 hover:text-ocean-700 underline"
                >
                  Or add manually with coordinates
                </button>
              </div>
            </div>
          ) : (
            /* Manual Form */
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-medium transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Manual Entry
                </h3>
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="text-sm text-ocean-600 hover:text-ocean-700 underline"
                >
                  Back to search
                </button>
              </div>

              {/* Beach Name */}
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Beach Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="e.g., Guincho Beach"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Latitude *
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    step="any"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="38.7319"
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Longitude *
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    step="any"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="-9.4703"
                  />
                </div>
              </div>

              {/* Country and State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Portugal"
                  />
                </div>

                <div>
                  <label htmlFor="state" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Lisboa"
                  />
                </div>
              </div>

              {/* Webcam URL */}
              <div>
                <label htmlFor="webcamUrl" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Live Webcam URL (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="webcamUrl"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="https://www.earthcam.com/..."
                  />
                  <Globe size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Favorite Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="manualFavorite"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
                />
                <label htmlFor="manualFavorite" className={`ml-2 flex items-center text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Star size={14} className="mr-1" />
                  Add to favorites
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Add Beach
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLocationModal; 