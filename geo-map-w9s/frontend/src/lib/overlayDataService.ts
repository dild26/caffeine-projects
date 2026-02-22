// Enhanced overlay data service with caching and rate-limit protection
// Fetches data from OSM Overpass API and Natural Earth CDN

export interface OverlayFeature {
  type: 'road' | 'railway' | 'river' | 'vegetation' | 'climate' | 'flood' | 'disaster' | 'border';
  coordinates: Array<{ lat: number; lon: number }>;
  properties: Record<string, any>;
}

interface CacheEntry {
  data: OverlayFeature[];
  timestamp: number;
}

class OverlayCache {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL = 60 * 60 * 1000; // 1 hour cache

  set(key: string, data: OverlayFeature[]): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): OverlayFeature[] | null {
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

// OpenStreetMap Overpass API for vector data
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Natural Earth Data for borders and geographic features
const NATURAL_EARTH_CDN = 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson';

export class OverlayDataService {
  private static cache = new OverlayCache();
  private static requestQueue: Array<() => Promise<void>> = [];
  private static isProcessing = false;
  private static readonly REQUEST_DELAY = 1000; // 1 second between requests to avoid rate limits

  // Process request queue with rate limiting
  private static async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Request failed:', error);
        }
        await new Promise(resolve => setTimeout(resolve, this.REQUEST_DELAY));
      }
    }

    this.isProcessing = false;
  }

  // Fetch road data from OSM with caching
  static async fetchRoads(bounds: { north: number; south: number; east: number; west: number }): Promise<OverlayFeature[]> {
    const cacheKey = `roads:${bounds.north},${bounds.south},${bounds.east},${bounds.west}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    return new Promise((resolve) => {
      this.requestQueue.push(async () => {
        try {
          const query = `
            [out:json][timeout:25];
            (
              way["highway"~"motorway|trunk|primary|secondary"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
            );
            out geom;
          `;

          const response = await fetch(OVERPASS_API, {
            method: 'POST',
            body: query,
          });

          if (!response.ok) {
            resolve([]);
            return;
          }

          const data = await response.json();
          const features = this.parseOverpassData(data, 'road');
          this.cache.set(cacheKey, features);
          resolve(features);
        } catch (error) {
          console.error('Error fetching roads:', error);
          resolve([]);
        }
      });

      this.processQueue();
    });
  }

  // Fetch railway data from OSM with caching
  static async fetchRailways(bounds: { north: number; south: number; east: number; west: number }): Promise<OverlayFeature[]> {
    const cacheKey = `railways:${bounds.north},${bounds.south},${bounds.east},${bounds.west}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    return new Promise((resolve) => {
      this.requestQueue.push(async () => {
        try {
          const query = `
            [out:json][timeout:25];
            (
              way["railway"~"rail|subway|light_rail"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
            );
            out geom;
          `;

          const response = await fetch(OVERPASS_API, {
            method: 'POST',
            body: query,
          });

          if (!response.ok) {
            resolve([]);
            return;
          }

          const data = await response.json();
          const features = this.parseOverpassData(data, 'railway');
          this.cache.set(cacheKey, features);
          resolve(features);
        } catch (error) {
          console.error('Error fetching railways:', error);
          resolve([]);
        }
      });

      this.processQueue();
    });
  }

  // Fetch waterway data from OSM with caching
  static async fetchRivers(bounds: { north: number; south: number; east: number; west: number }): Promise<OverlayFeature[]> {
    const cacheKey = `rivers:${bounds.north},${bounds.south},${bounds.east},${bounds.west}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    return new Promise((resolve) => {
      this.requestQueue.push(async () => {
        try {
          const query = `
            [out:json][timeout:25];
            (
              way["waterway"~"river|stream|canal"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
            );
            out geom;
          `;

          const response = await fetch(OVERPASS_API, {
            method: 'POST',
            body: query,
          });

          if (!response.ok) {
            resolve([]);
            return;
          }

          const data = await response.json();
          const features = this.parseOverpassData(data, 'river');
          this.cache.set(cacheKey, features);
          resolve(features);
        } catch (error) {
          console.error('Error fetching rivers:', error);
          resolve([]);
        }
      });

      this.processQueue();
    });
  }

  // Fetch country borders from Natural Earth with caching
  static async fetchBorders(): Promise<OverlayFeature[]> {
    const cacheKey = 'borders:global';
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${NATURAL_EARTH_CDN}/ne_110m_admin_0_countries.geojson`);

      if (!response.ok) return [];

      const data = await response.json();
      const features = this.parseGeoJSON(data, 'border');
      this.cache.set(cacheKey, features);
      return features;
    } catch (error) {
      console.error('Error fetching borders:', error);
      return [];
    }
  }

  // Parse Overpass API response
  private static parseOverpassData(data: any, type: OverlayFeature['type']): OverlayFeature[] {
    if (!data.elements) return [];

    return data.elements
      .filter((element: any) => element.type === 'way' && element.geometry)
      .map((element: any) => ({
        type,
        coordinates: element.geometry.map((point: any) => ({
          lat: point.lat,
          lon: point.lon,
        })),
        properties: element.tags || {},
      }));
  }

  // Parse GeoJSON data
  private static parseGeoJSON(data: any, type: OverlayFeature['type']): OverlayFeature[] {
    if (!data.features) return [];

    const features: OverlayFeature[] = [];

    data.features.forEach((feature: any) => {
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        const coords = feature.geometry.type === 'Polygon'
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates;

        coords.forEach((polygon: any) => {
          polygon.forEach((ring: any) => {
            features.push({
              type,
              coordinates: ring.map((point: any) => ({
                lon: point[0],
                lat: point[1],
              })),
              properties: feature.properties || {},
            });
          });
        });
      } else if (feature.geometry.type === 'LineString') {
        features.push({
          type,
          coordinates: feature.geometry.coordinates.map((point: any) => ({
            lon: point[0],
            lat: point[1],
          })),
          properties: feature.properties || {},
        });
      }
    });

    return features;
  }

  // Placeholder methods for layers without free public APIs
  static async fetchVegetation(): Promise<OverlayFeature[]> {
    // In production, integrate with a vegetation/land cover API
    return [];
  }

  static async fetchClimate(): Promise<OverlayFeature[]> {
    // In production, integrate with a climate data API
    return [];
  }

  static async fetchFloodAlerts(): Promise<OverlayFeature[]> {
    // In production, integrate with a flood alert API
    return [];
  }

  static async fetchDisasterAlerts(): Promise<OverlayFeature[]> {
    // In production, integrate with a disaster alert API
    return [];
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
