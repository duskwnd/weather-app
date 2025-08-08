export interface SearchResult {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  country: string;
  state?: string;
}

// Iberia search list (Portugal + Spain). Sampled popular beaches; can be expanded.
const iberiaBeaches: SearchResult[] = [
  // Portugal (Lisboa/Setúbal)
  { name: 'Costa da Caparica', displayName: 'Costa da Caparica', latitude: 38.6413, longitude: -9.2386, country: 'Portugal', state: 'Setúbal' },
  { name: 'Praia do Guincho', displayName: 'Praia do Guincho', latitude: 38.7329, longitude: -9.4730, country: 'Portugal', state: 'Lisboa' },
  { name: 'Praia de Carcavelos', displayName: 'Praia de Carcavelos', latitude: 38.6795, longitude: -9.3326, country: 'Portugal', state: 'Lisboa' },
  { name: 'Praia de Cascais', displayName: 'Praia de Cascais', latitude: 38.7000, longitude: -9.4167, country: 'Portugal', state: 'Lisboa' },
  { name: 'Praia de Estoril', displayName: 'Praia de Estoril', latitude: 38.7167, longitude: -9.4000, country: 'Portugal', state: 'Lisboa' },
  { name: 'Praia de Ericeira', displayName: 'Praia de Ericeira', latitude: 38.9667, longitude: -9.4167, country: 'Portugal', state: 'Lisboa' },
  // Portugal (Centro/Norte/Algarve)
  { name: 'Praia da Marinha', displayName: 'Praia da Marinha', latitude: 37.0869, longitude: -8.4167, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Benagil', displayName: 'Praia de Benagil', latitude: 37.0897, longitude: -8.4247, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia dos Coelhos', displayName: 'Praia dos Coelhos', latitude: 37.0869, longitude: -8.4167, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia da Rocha', displayName: 'Praia da Rocha', latitude: 37.1189, longitude: -8.5333, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Lagos', displayName: 'Praia de Lagos', latitude: 37.1028, longitude: -8.6733, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Albufeira', displayName: 'Praia de Albufeira', latitude: 37.0894, longitude: -8.2500, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Faro', displayName: 'Praia de Faro', latitude: 37.0144, longitude: -7.9350, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Tavira', displayName: 'Praia de Tavira', latitude: 37.1278, longitude: -7.6472, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Sagres', displayName: 'Praia de Sagres', latitude: 37.0083, longitude: -8.9433, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Carvoeiro', displayName: 'Praia de Carvoeiro', latitude: 37.1000, longitude: -8.4667, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Portimão', displayName: 'Praia de Portimão', latitude: 37.1333, longitude: -8.5333, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Vilamoura', displayName: 'Praia de Vilamoura', latitude: 37.0833, longitude: -8.1167, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Quarteira', displayName: 'Praia de Quarteira', latitude: 37.0667, longitude: -8.1000, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Olhos de Água', displayName: 'Praia de Olhos de Água', latitude: 37.0833, longitude: -8.1833, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de São Rafael', displayName: 'Praia de São Rafael', latitude: 37.0667, longitude: -8.2500, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Galé', displayName: 'Praia de Galé', latitude: 37.0833, longitude: -8.2333, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Armação de Pêra', displayName: 'Praia de Armação de Pêra', latitude: 37.1000, longitude: -8.3500, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Ferragudo', displayName: 'Praia de Ferragudo', latitude: 37.1167, longitude: -8.5167, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Alvor', displayName: 'Praia de Alvor', latitude: 37.1333, longitude: -8.6000, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Burgau', displayName: 'Praia de Burgau', latitude: 37.0667, longitude: -8.7833, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Salema', displayName: 'Praia de Salema', latitude: 37.0667, longitude: -8.8167, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Luz', displayName: 'Praia de Luz', latitude: 37.0833, longitude: -8.7333, country: 'Portugal', state: 'Algarve' },
  { name: 'Praia de Monte Clérigo', displayName: 'Praia de Monte Clérigo', latitude: 37.3167, longitude: -8.8500, country: 'Portugal', state: 'Alentejo' },
  { name: 'Praia de Odeceixe', displayName: 'Praia de Odeceixe', latitude: 37.4333, longitude: -8.7833, country: 'Portugal', state: 'Alentejo' },
  { name: 'Praia de Zambujeira do Mar', displayName: 'Praia de Zambujeira do Mar', latitude: 37.5167, longitude: -8.7833, country: 'Portugal', state: 'Alentejo' },
  { name: 'Praia de Vila Nova de Milfontes', displayName: 'Praia de Vila Nova de Milfontes', latitude: 37.7167, longitude: -8.7833, country: 'Portugal', state: 'Alentejo' },
  { name: 'Praia de Tróia', displayName: 'Praia de Tróia', latitude: 38.4833, longitude: -8.8833, country: 'Portugal', state: 'Setúbal' },
  { name: 'Praia de Sesimbra', displayName: 'Praia de Sesimbra', latitude: 38.4333, longitude: -9.1000, country: 'Portugal', state: 'Setúbal' },
  { name: 'Praia de Cascais', displayName: 'Praia de Cascais', latitude: 38.7000, longitude: -9.4167, country: 'Portugal', state: 'Lisboa' },
  { name: 'Praia de Estoril', displayName: 'Praia de Estoril', latitude: 38.7167, longitude: -9.4000, country: 'Portugal', state: 'Lisboa' },
  { name: 'Praia de Carcavelos', displayName: 'Praia de Carcavelos', latitude: 38.6833, longitude: -9.3333, country: 'Portugal', state: 'Lisboa' },
  { name: 'Praia de Guincho', displayName: 'Praia de Guincho', latitude: 38.7333, longitude: -9.4667, country: 'Portugal', state: 'Lisboa' },
  { name: 'Praia de Ericeira', displayName: 'Praia de Ericeira', latitude: 38.9667, longitude: -9.4167, country: 'Portugal', state: 'Lisboa' },
  { name: 'Praia de Peniche', displayName: 'Praia de Peniche', latitude: 39.3500, longitude: -9.3833, country: 'Portugal', state: 'Leiria' },
  { name: 'Praia de Nazaré', displayName: 'Praia de Nazaré', latitude: 39.6167, longitude: -9.0833, country: 'Portugal', state: 'Leiria' },
  { name: 'Praia de Figueira da Foz', displayName: 'Praia de Figueira da Foz', latitude: 40.1500, longitude: -8.8500, country: 'Portugal', state: 'Coimbra' },
  { name: 'Praia de Aveiro', displayName: 'Praia de Aveiro', latitude: 40.6333, longitude: -8.6500, country: 'Portugal', state: 'Aveiro' },
  { name: 'Praia de Espinho', displayName: 'Praia de Espinho', latitude: 41.0167, longitude: -8.6333, country: 'Portugal', state: 'Aveiro' },
  { name: 'Praia de Matosinhos', displayName: 'Praia de Matosinhos', latitude: 41.1833, longitude: -8.7000, country: 'Portugal', state: 'Porto' },
  { name: 'Praia de Póvoa de Varzim', displayName: 'Praia de Póvoa de Varzim', latitude: 41.3833, longitude: -8.7667, country: 'Portugal', state: 'Porto' },
  { name: 'Praia de Viana do Castelo', displayName: 'Praia de Viana do Castelo', latitude: 41.7000, longitude: -8.8333, country: 'Portugal', state: 'Viana do Castelo' }
  ,
  // Spain (Catalonia/Basque/Andalusia)
  { name: 'Barceloneta Beach', displayName: 'Barceloneta Beach', latitude: 41.3790, longitude: 2.1893, country: 'Spain', state: 'Catalonia' },
  { name: 'Sitges', displayName: 'Sitges', latitude: 41.2370, longitude: 1.8039, country: 'Spain', state: 'Catalonia' },
  { name: 'La Concha', displayName: 'La Concha (San Sebastián)', latitude: 43.3183, longitude: -1.9869, country: 'Spain', state: 'Basque Country' },
  { name: 'La Caleta', displayName: 'La Caleta (Cádiz)', latitude: 36.5363, longitude: -6.2994, country: 'Spain', state: 'Andalusia' },
  { name: 'Tarifa', displayName: 'Tarifa', latitude: 36.0130, longitude: -5.6060, country: 'Spain', state: 'Andalusia' }
];

export const searchService = {
  searchLocations: async (query: string): Promise<SearchResult[]> => {
    const searchTerm = query.trim();
    if (searchTerm.length < 2) return [];

    // Primary: Open‑Meteo Geocoding API (free, OSM-based)
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=10&language=en&format=json`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const results: SearchResult[] = (data.results || []).map((r: any) => ({
          name: r.name,
          displayName: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
          latitude: r.latitude,
          longitude: r.longitude,
          country: r.country,
          state: r.admin1 || undefined
        }));
        if (results.length) return results;
      }
    } catch {}

    // Fallback: local Iberia list filter
    const fallback = iberiaBeaches.filter(beach =>
      beach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beach.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beach.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beach.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return fallback.slice(0, 10);
  }
};
