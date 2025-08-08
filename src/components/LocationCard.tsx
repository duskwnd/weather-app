import React from 'react';
import { BeachLocation } from '../types/weather';
import { Star, Trash2, MapPin, ExternalLink } from 'lucide-react';

interface LocationCardProps {
  location: BeachLocation;
  isSelected: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  viewMode: 'grid' | 'list';
  darkMode?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  isSelected,
  onSelect,
  onToggleFavorite,
  onDelete,
  viewMode,
  darkMode = false
}) => {
  const handleWebcamClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (location.webcamUrl) {
      window.open(location.webcamUrl, '_blank');
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
          isSelected
            ? darkMode 
              ? 'border-ocean-400 bg-ocean-900/30' 
              : 'border-ocean-500 bg-ocean-50'
            : darkMode
              ? 'border-gray-600 bg-gray-800/50 hover:border-ocean-400 hover:bg-gray-700/50'
              : 'border-gray-200 bg-white hover:border-ocean-300 hover:bg-ocean-100'
        }`}
        onClick={onSelect}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <MapPin size={20} className="text-ocean-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-semibold truncate transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {location.name}
              </h3>
              <p className={`text-xs transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {location.state && `${location.state}, `}{location.country}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {location.webcamUrl && (
              <button
                onClick={handleWebcamClick}
                className="p-1 text-gray-400 hover:text-ocean-500 transition-colors"
                title="View Live Webcam"
              >
                <ExternalLink size={16} />
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-1 transition-colors ${
                location.isFavorite
                  ? 'text-sand-500 hover:text-sand-600'
                  : 'text-gray-400 hover:text-sand-500'
              }`}
              title={location.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star size={16} fill={location.isFavorite ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete location"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? darkMode 
            ? 'border-ocean-400 bg-ocean-900/30' 
            : 'border-ocean-500 bg-ocean-50'
          : darkMode
            ? 'border-gray-600 bg-gray-800/50 hover:border-ocean-400 hover:bg-gray-700/50'
            : 'border-gray-200 bg-white hover:border-ocean-300 hover:bg-ocean-100'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MapPin size={16} className="text-ocean-500" />
          <h3 className={`text-sm font-semibold truncate transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {location.name}
          </h3>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`p-1 transition-colors ${
            location.isFavorite
              ? 'text-sand-500 hover:text-sand-600'
              : 'text-gray-400 hover:text-sand-500'
          }`}
          title={location.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={16} fill={location.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <p className={`text-xs mb-3 transition-colors duration-300 ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {location.state && `${location.state}, `}{location.country}
      </p>
      
      <div className="flex items-center justify-between">
        {location.webcamUrl && (
          <button
            onClick={handleWebcamClick}
            className="text-xs text-ocean-600 hover:text-ocean-700 flex items-center space-x-1 transition-colors"
            title="View Live Webcam"
          >
            <ExternalLink size={12} />
            <span>Live Cam</span>
          </button>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          title="Delete location"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

export default LocationCard; 