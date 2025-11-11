import { useState, useEffect, useRef } from 'react';

interface MapboxSuggestion {
  id: string;
  place_name: string;
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    address?: string;
  };
}

interface UseMapboxReturn {
  suggestions: MapboxSuggestion[];
  selectedLocation: MapboxSuggestion | null;
  isLoading: boolean;
  error: string | null;
  searchLocation: (query: string) => void;
  selectLocation: (suggestion: MapboxSuggestion) => void;
  clearSearch: () => void;
}

export const useMapbox = (): UseMapboxReturn => {
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapboxSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestCount = useRef(0);

  // Track API usage in localStorage
  const trackRequest = () => {
    const currentMonth = new Date().getMonth() + '-' + new Date().getFullYear();
    const key = `mapbox_requests_${currentMonth}`;
    const current = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (current + 1).toString());
    
    // Check if approaching limit (45k as safe buffer)
    if (current >= 45000) {
      setError('Search limit reached for this month. Please try again later.');
      return false;
    }
    return true;
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    // Check rate limit
    if (!trackRequest()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        new URLSearchParams({
          access_token: import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
          country: 'ae', // UAE only
          types: 'place,locality,neighborhood,postcode',
          autocomplete: 'true',
          limit: '5'
        })
      );

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (err) {
      setError('Failed to search locations');
      console.error('Mapbox search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectLocation = (suggestion: MapboxSuggestion) => {
    setSelectedLocation(suggestion);
    setSuggestions([]);
  };

  const clearSearch = () => {
    setSuggestions([]);
    setSelectedLocation(null);
    setError(null);
  };

  return {
    suggestions,
    selectedLocation,
    isLoading,
    error,
    searchLocation,
    selectLocation,
    clearSearch
  };
};