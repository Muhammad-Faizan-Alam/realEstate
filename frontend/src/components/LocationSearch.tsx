import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMapbox } from '@/hooks/useMapbox';
import { Badge } from '@/components/ui/badge';

interface LocationSearchProps {
  value: string;
  onChange: (location: string) => void;
  onLocationSelect: (location: { name: string; lat: number; lng: number }) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onChange,
  onLocationSelect
}) => {
  const {
    suggestions,
    selectedLocation,
    isLoading,
    error,
    searchLocation,
    selectLocation,
    clearSearch
  } = useMapbox();

  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    if (newValue.length > 2) {
      searchLocation(newValue);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      clearSearch();
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    selectLocation(suggestion);
    setInputValue(suggestion.place_name);
    onChange(suggestion.place_name);
    setShowSuggestions(false);
    
    // Pass location data to parent
    onLocationSelect({
      name: suggestion.place_name,
      lat: suggestion.geometry.coordinates[1],
      lng: suggestion.geometry.coordinates[0]
    });
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    clearSearch();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (suggestions.length > 0 || inputValue.length > 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search area (e.g., Dubai Marina)"
          className="pl-10 pr-10"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Selected Location Badge */}
      {selectedLocation && (
        <div className="mt-2">
          <Badge variant="secondary" className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            {selectedLocation.place_name}
            <button
              type="button"
              onClick={handleClear}
              className="hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Searching...
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="cursor-pointer px-4 py-2 hover:bg-accent hover:text-accent-foreground border-b last:border-b-0"
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{suggestion.place_name}</div>
                    {suggestion.properties?.address && (
                      <div className="text-sm text-muted-foreground">
                        {suggestion.properties.address}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};