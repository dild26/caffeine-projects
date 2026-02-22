// Coordinate transformation utilities for geospatial operations

export interface OSMTile {
  x: number;
  y: number;
  z: number;
  url: string;
}

// Convert lat/lon to ECEF coordinates for 3D globe
export function latLonToECEF(lat: number, lon: number, alt: number = 0, radius: number = 2): {
  x: number;
  y: number;
  z: number;
} {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = lon * (Math.PI / 180);
  const r = radius + alt / 10000;

  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

// Convert lat/lon to Web Mercator projection for 2D map
export function latLonToWebMercator(lat: number, lon: number, width: number, height: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

// Calculate UV coordinates for texture mapping on sphere
export function latLonToUV(lat: number, lon: number): { u: number; v: number } {
  const u = (lon + 180) / 360;
  const v = (90 - lat) / 180;
  return { u, v };
}
