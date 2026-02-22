import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { GeocodingService } from '../lib/geocodingService';
import { useCreatePin } from '../hooks/useQueries';
import { toast } from 'sonner';

interface SearchBarProps {
  onLocationSelect?: (lat: number, lon: number) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ displayName: string; lat: number; lon: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const placePin = useCreatePin();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await GeocodingService.autocomplete(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Autocomplete error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await GeocodingService.geocode(query);
      if (result) {
        onLocationSelect?.(result.lat, result.lon);
        
        const pinId = `search-pin-${Date.now()}`;
        const gridCellId = `cell-${Math.floor(result.lat)}-${Math.floor(result.lon)}`;
        
        await placePin.mutateAsync({
          id: pinId,
          coordinates: { latitude: result.lat, longitude: result.lon, altitude: 0 },
          gridCellId,
        });
        
        toast.success(`Location found: ${result.displayName}`);
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
      } else {
        toast.error('Location not found');
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: { displayName: string; lat: number; lon: number }) => {
    setQuery(suggestion.displayName);
    setShowSuggestions(false);
    
    onLocationSelect?.(suggestion.lat, suggestion.lon);
    
    const pinId = `search-pin-${Date.now()}`;
    const gridCellId = `cell-${Math.floor(suggestion.lat)}-${Math.floor(suggestion.lon)}`;
    
    try {
      await placePin.mutateAsync({
        id: pinId,
        coordinates: { latitude: suggestion.lat, longitude: suggestion.lon, altitude: 0 },
        gridCellId,
      });
      
      toast.success(`Pin placed at ${suggestion.displayName}`);
      setQuery('');
    } catch (error) {
      toast.error('Failed to place pin');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a location..."
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-64 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-start gap-2 transition-colors"
              >
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{suggestion.displayName}</span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
