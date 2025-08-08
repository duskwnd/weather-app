# Beach Weather App

A modern beach weather forecasting web application built with React, TypeScript, and Tailwind CSS. Get detailed weather information for your favorite beach locations including air temperature, water temperature, wind conditions, and tide information.

## Features

### 🌊 Weather Data
- **Real-time weather data** from Open-Meteo API (completely free)
- **Air temperature** and feels-like temperature
- **Water temperature** with seasonal variations for Portugal/Spain
- **Wind speed and direction** with compass readings
- **Tide information** including current state and upcoming tides

### 📍 Location Management
- **Smart search** with autosuggest for 30+ Portuguese beaches including smaller/local ones
- **Enhanced search** for Portuguese beach names (e.g., "Coelhos", "Marinha", "Benagil")
- **One-click beach addition** with automatic coordinates
- **Manual entry** option for custom locations
- Delete beach locations
- View list of saved beach locations
- Toggle favorite status for quick access

### 📅 7-Day Forecast
- Detailed weather forecast for each location
- Daily high/low temperatures
- Water conditions and wind patterns
- Tide predictions

### 📹 Live Beach Cams
- Support for live webcam URLs
- Direct links to public beach cameras
- Easy access to real-time beach views

### 🎨 Design Features
- Clean, mobile-friendly interface
- Grid and list view options for locations
- Beautiful ocean-themed color scheme
- Responsive design for all devices

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Mock data service** (ready for real API integration)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the project files, navigate to the directory
   cd beach-weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Usage

### Adding a Beach Location

1. Click the "Add Beach" button in the header
2. Fill in the required information:
   - **Beach Name**: The name of the beach
   - **Latitude/Longitude**: Geographic coordinates
   - **Country**: Country where the beach is located
   - **State/Province**: Optional state or province
   - **Live Webcam URL**: Optional URL for live beach camera
3. Toggle "Add to favorites" if desired
4. Click "Add Beach" to save

### Viewing Weather Information

1. Select a beach location from the left panel
2. View current conditions including:
   - Air temperature and humidity
   - Water temperature and wave conditions
   - Wind speed and direction
   - Current tide information
3. Switch to "7-Day Forecast" tab for extended weather outlook

### Managing Locations

- **Toggle Favorites**: Click the star icon to add/remove from favorites
- **Delete Location**: Click the trash icon to remove a location
- **View Live Cam**: Click the external link icon to open webcam (if available)
- **Switch Views**: Toggle between grid and list view for location cards

## API Integration

The app now integrates with real weather APIs for Portugal and Spain:

### Integrated APIs

1. **Open-Meteo** (completely free, no API key required)
   - Real-time weather data
   - Temperature, humidity, wind speed/direction
   - Weather descriptions and codes

2. **OpenWeatherMap Geocoding API** (free tier: 1000 calls/day)
   - Location search and coordinates
   - Focused on Portuguese beaches including smaller/local ones
   - Automatic coordinate detection
   - Enhanced search for Portuguese beach names

3. **Mock Data Fallback**
   - Water temperature with seasonal variations
   - Tide information
   - Wave conditions

### Features

- **Real-time weather data** for current conditions
- **Smart search** with autosuggest for 30+ Portuguese beaches
- **Enhanced search** for Portuguese beach names and partial matches
- **Automatic coordinate detection** from search results
- **Fallback to mock data** when APIs are unavailable
- **Caching** for search results to reduce API calls

### Adding Your Own API Keys

To increase API limits or add more features:

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Add it to the `searchService.ts` file in the `openWeatherApiKey` variable
3. The app will automatically use your key for more search calls

## Project Structure

```
src/
├── components/          # React components
│   ├── LocationCard.tsx
│   ├── ForecastView.tsx
│   └── AddLocationModal.tsx
├── services/           # API and data services
│   └── weatherService.ts
├── types/              # TypeScript type definitions
│   └── weather.ts
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Customization

### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update `src/index.css` for global styles
- Customize component-specific styles in each component

### Data Structure
- Extend TypeScript interfaces in `src/types/weather.ts`
- Add new weather metrics as needed
- Modify mock data generation in `src/services/weatherService.ts`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please open an issue in the project repository.

---

**Enjoy your perfect beach day! 🏖️🌊** 