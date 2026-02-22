// Geocoding service with Geoapify as primary and OpenCage as fallback
// Includes backend caching to prevent quota/rate-limit issues

interface GeocodingResult {
  lat: number;
  lon: number;
  displayName: string;
  address: {
    country?: string;
    state?: string;
    city?: string;
    postcode?: string;
  };
}

interface GeocodingSuggestion {
  displayName: string;
  lat: number;
  lon: number;
}

class GeocodingCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 hours

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export class GeocodingService {
  private static cache = new GeocodingCache();
  private static readonly GEOAPIFY_API = 'https://api.geoapify.com/v1/geocode';
  private static readonly OPENCAGE_API = 'https://api.opencagedata.com/geocode/v1';
  
  // Free tier API keys - in production, these should be environment variables
  private static readonly GEOAPIFY_KEY = 'demo'; // Replace with actual key
  private static readonly OPENCAGE_KEY = 'demo'; // Replace with actual key

  // Forward geocoding: address to coordinates
  static async geocode(address: string): Promise<GeocodingResult | null> {
    const cacheKey = `geocode:${address}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Try Geoapify first
      const result = await this.geocodeWithGeoapify(address);
      if (result) {
        this.cache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn('Geoapify geocoding failed, trying OpenCage:', error);
    }

    try {
      // Fallback to OpenCage
      const result = await this.geocodeWithOpenCage(address);
      if (result) {
        this.cache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.error('OpenCage geocoding failed:', error);
    }

    return null;
  }

  // Reverse geocoding: coordinates to address
  static async reverseGeocode(lat: number, lon: number): Promise<GeocodingResult | null> {
    const cacheKey = `reverse:${lat.toFixed(6)},${lon.toFixed(6)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Try Geoapify first
      const result = await this.reverseGeocodeWithGeoapify(lat, lon);
      if (result) {
        this.cache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn('Geoapify reverse geocoding failed, trying OpenCage:', error);
    }

    try {
      // Fallback to OpenCage
      const result = await this.reverseGeocodeWithOpenCage(lat, lon);
      if (result) {
        this.cache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.error('OpenCage reverse geocoding failed:', error);
    }

    return null;
  }

  // Autocomplete suggestions
  static async autocomplete(query: string): Promise<GeocodingSuggestion[]> {
    if (query.length < 3) return [];

    const cacheKey = `autocomplete:${query}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Try Geoapify first
      const results = await this.autocompleteWithGeoapify(query);
      if (results.length > 0) {
        this.cache.set(cacheKey, results);
        return results;
      }
    } catch (error) {
      console.warn('Geoapify autocomplete failed, trying OpenCage:', error);
    }

    try {
      // Fallback to OpenCage
      const results = await this.autocompleteWithOpenCage(query);
      if (results.length > 0) {
        this.cache.set(cacheKey, results);
        return results;
      }
    } catch (error) {
      console.error('OpenCage autocomplete failed:', error);
    }

    return [];
  }

  // Geoapify implementation
  private static async geocodeWithGeoapify(address: string): Promise<GeocodingResult | null> {
    const url = `${this.GEOAPIFY_API}/search?text=${encodeURIComponent(address)}&apiKey=${this.GEOAPIFY_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Geoapify request failed');
    
    const data = await response.json();
    if (!data.features || data.features.length === 0) return null;

    const feature = data.features[0];
    return {
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      displayName: feature.properties.formatted,
      address: {
        country: feature.properties.country,
        state: feature.properties.state,
        city: feature.properties.city,
        postcode: feature.properties.postcode,
      },
    };
  }

  private static async reverseGeocodeWithGeoapify(lat: number, lon: number): Promise<GeocodingResult | null> {
    const url = `${this.GEOAPIFY_API}/reverse?lat=${lat}&lon=${lon}&apiKey=${this.GEOAPIFY_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Geoapify request failed');
    
    const data = await response.json();
    if (!data.features || data.features.length === 0) return null;

    const feature = data.features[0];
    return {
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      displayName: feature.properties.formatted,
      address: {
        country: feature.properties.country,
        state: feature.properties.state,
        city: feature.properties.city,
        postcode: feature.properties.postcode,
      },
    };
  }

  private static async autocompleteWithGeoapify(query: string): Promise<GeocodingSuggestion[]> {
    const url = `${this.GEOAPIFY_API}/autocomplete?text=${encodeURIComponent(query)}&apiKey=${this.GEOAPIFY_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Geoapify request failed');
    
    const data = await response.json();
    if (!data.features) return [];

    return data.features.slice(0, 5).map((feature: any) => ({
      displayName: feature.properties.formatted,
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
    }));
  }

  // OpenCage implementation
  private static async geocodeWithOpenCage(address: string): Promise<GeocodingResult | null> {
    const url = `${this.OPENCAGE_API}/json?q=${encodeURIComponent(address)}&key=${this.OPENCAGE_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('OpenCage request failed');
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    const result = data.results[0];
    return {
      lat: result.geometry.lat,
      lon: result.geometry.lng,
      displayName: result.formatted,
      address: {
        country: result.components.country,
        state: result.components.state,
        city: result.components.city,
        postcode: result.components.postcode,
      },
    };
  }

  private static async reverseGeocodeWithOpenCage(lat: number, lon: number): Promise<GeocodingResult | null> {
    const url = `${this.OPENCAGE_API}/json?q=${lat},${lon}&key=${this.OPENCAGE_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('OpenCage request failed');
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    const result = data.results[0];
    return {
      lat: result.geometry.lat,
      lon: result.geometry.lng,
      displayName: result.formatted,
      address: {
        country: result.components.country,
        state: result.components.state,
        city: result.components.city,
        postcode: result.components.postcode,
      },
    };
  }

  private static async autocompleteWithOpenCage(query: string): Promise<GeocodingSuggestion[]> {
    const url = `${this.OPENCAGE_API}/json?q=${encodeURIComponent(query)}&key=${this.OPENCAGE_KEY}&limit=5`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('OpenCage request failed');
    
    const data = await response.json();
    if (!data.results) return [];

    return data.results.map((result: any) => ({
      displayName: result.formatted,
      lat: result.geometry.lat,
      lon: result.geometry.lng,
    }));
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
