/**
 * Magnetic Physics System for Block Interactions
 * 
 * Implements force-based attraction/repulsion mechanics for visual block connectors
 * with configurable polarity, threshold distances, and GPU-accelerated calculations.
 */

import * as THREE from 'three';
import { Block, Connection, PortDefinition } from '../types';

export type ConnectorPolarity = 'positive' | 'negative' | 'neutral';
export type ConnectorState = 'idle' | 'hovering' | 'attracting' | 'repelling' | 'connected' | 'invalid';

export interface MagneticConnector {
  blockId: string;
  portId: string;
  isOutput: boolean;
  polarity: ConnectorPolarity;
  position: THREE.Vector3;
  dataType: string;
  state: ConnectorState;
  forceStrength: number;
}

export interface MagneticForce {
  direction: THREE.Vector3;
  magnitude: number;
  type: 'attraction' | 'repulsion';
}

export interface MagneticConfig {
  attractionStrength: number;
  repulsionStrength: number;
  snapThreshold: number;
  maxForceDistance: number;
  axisAlignmentThreshold: number;
  enableAxisSnapping: boolean;
}

export const DEFAULT_MAGNETIC_CONFIG: MagneticConfig = {
  attractionStrength: 2.5,
  repulsionStrength: 3.0,
  snapThreshold: 0.8,
  maxForceDistance: 5.0,
  axisAlignmentThreshold: 0.3,
  enableAxisSnapping: true
};

/**
 * Determine connector polarity based on data type and port direction
 */
export function getConnectorPolarity(dataType: string, isOutput: boolean): ConnectorPolarity {
  // Output ports are generally positive, input ports are negative
  // This creates natural attraction between compatible ports
  if (isOutput) {
    return 'positive';
  } else {
    return 'negative';
  }
}

/**
 * Calculate magnetic force between two connectors
 */
export function calculateMagneticForce(
  connector1: MagneticConnector,
  connector2: MagneticConnector,
  config: MagneticConfig = DEFAULT_MAGNETIC_CONFIG
): MagneticForce | null {
  // Don't calculate force between connectors on the same block
  if (connector1.blockId === connector2.blockId) {
    return null;
  }

  // Don't calculate force between two inputs or two outputs
  if (connector1.isOutput === connector2.isOutput) {
    return null;
  }

  const distance = connector1.position.distanceTo(connector2.position);
  
  // No force beyond max distance
  if (distance > config.maxForceDistance) {
    return null;
  }

  const direction = new THREE.Vector3()
    .subVectors(connector2.position, connector1.position)
    .normalize();

  // Determine if attraction or repulsion based on polarity and compatibility
  const areCompatible = checkDataTypeCompatibility(connector1.dataType, connector2.dataType);
  const polaritiesAttract = (
    (connector1.polarity === 'positive' && connector2.polarity === 'negative') ||
    (connector1.polarity === 'negative' && connector2.polarity === 'positive')
  );

  let magnitude: number;
  let type: 'attraction' | 'repulsion';

  if (areCompatible && polaritiesAttract) {
    // Attraction force (inverse square law with minimum)
    magnitude = Math.max(
      config.attractionStrength / (distance * distance + 0.1),
      0.1
    );
    type = 'attraction';
  } else {
    // Repulsion force
    magnitude = Math.max(
      config.repulsionStrength / (distance + 0.5),
      0.05
    );
    type = 'repulsion';
    direction.multiplyScalar(-1); // Reverse direction for repulsion
  }

  return { direction, magnitude, type };
}

/**
 * Check if two data types are compatible for connection
 */
export function checkDataTypeCompatibility(type1: string, type2: string): boolean {
  // 'any' type is compatible with everything
  if (type1 === 'any' || type2 === 'any') return true;
  
  // Exact match
  if (type1 === type2) return true;
  
  // Compatible type groups
  const compatibilityGroups: Record<string, string[]> = {
    'string': ['string', 'hex', 'hash', 'address', 'binary'],
    'hex': ['string', 'hex', 'hash', 'address'],
    'hash': ['string', 'hex', 'hash'],
    'address': ['string', 'hex', 'address'],
    'binary': ['string', 'binary', 'hex'],
    'number': ['number'],
    'boolean': ['boolean'],
    'object': ['object', 'keypair', 'signature'],
    'keypair': ['object', 'keypair'],
    'signature': ['object', 'signature']
  };

  const group1 = compatibilityGroups[type1] || [type1];
  const group2 = compatibilityGroups[type2] || [type2];

  return group1.some(t => group2.includes(t));
}

/**
 * Apply axis-aligned snapping to a position
 */
export function applyAxisSnapping(
  position: THREE.Vector3,
  targetPosition: THREE.Vector3,
  threshold: number
): THREE.Vector3 {
  const snapped = position.clone();
  
  // Snap X axis
  if (Math.abs(position.x - targetPosition.x) < threshold) {
    snapped.x = targetPosition.x;
  }
  
  // Snap Y axis
  if (Math.abs(position.y - targetPosition.y) < threshold) {
    snapped.y = targetPosition.y;
  }
  
  // Snap Z axis
  if (Math.abs(position.z - targetPosition.z) < threshold) {
    snapped.z = targetPosition.z;
  }
  
  return snapped;
}

/**
 * Determine connector state based on proximity and compatibility
 */
export function determineConnectorState(
  connector: MagneticConnector,
  nearbyConnectors: MagneticConnector[],
  existingConnections: Connection[],
  config: MagneticConfig = DEFAULT_MAGNETIC_CONFIG
): ConnectorState {
  // Check if already connected
  const isConnected = existingConnections.some(conn => 
    (conn.fromBlockId === connector.blockId && conn.fromPort === connector.portId) ||
    (conn.toBlockId === connector.blockId && conn.toPort === connector.portId)
  );
  
  if (isConnected) {
    return 'connected';
  }

  // Find closest compatible connector
  let closestDistance = Infinity;
  let closestCompatible = false;
  
  for (const other of nearbyConnectors) {
    if (other.blockId === connector.blockId) continue;
    if (other.isOutput === connector.isOutput) continue;
    
    const distance = connector.position.distanceTo(other.position);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCompatible = checkDataTypeCompatibility(connector.dataType, other.dataType);
    }
  }

  // Determine state based on distance and compatibility
  if (closestDistance < config.snapThreshold) {
    return closestCompatible ? 'attracting' : 'invalid';
  } else if (closestDistance < config.maxForceDistance * 0.5) {
    return closestCompatible ? 'hovering' : 'repelling';
  }

  return 'idle';
}

/**
 * Get color for connector state (for visual feedback)
 */
export function getConnectorStateColor(state: ConnectorState): string {
  switch (state) {
    case 'connected':
      return '#fbbf24'; // Yellow
    case 'attracting':
      return '#10b981'; // Green
    case 'hovering':
      return '#3b82f6'; // Blue
    case 'repelling':
    case 'invalid':
      return '#ef4444'; // Red
    case 'idle':
    default:
      return '#6b7280'; // Gray
  }
}

/**
 * Magnetic field visualization data
 */
export interface MagneticFieldVisualization {
  lines: THREE.Vector3[][];
  intensities: number[];
}

/**
 * Generate magnetic field lines for visualization
 */
export function generateMagneticFieldLines(
  connectors: MagneticConnector[],
  config: MagneticConfig = DEFAULT_MAGNETIC_CONFIG
): MagneticFieldVisualization {
  const lines: THREE.Vector3[][] = [];
  const intensities: number[] = [];

  // Generate field lines between compatible connector pairs
  for (let i = 0; i < connectors.length; i++) {
    for (let j = i + 1; j < connectors.length; j++) {
      const c1 = connectors[i];
      const c2 = connectors[j];
      
      if (c1.blockId === c2.blockId) continue;
      if (c1.isOutput === c2.isOutput) continue;
      
      const distance = c1.position.distanceTo(c2.position);
      if (distance > config.maxForceDistance) continue;
      
      const force = calculateMagneticForce(c1, c2, config);
      if (!force) continue;
      
      // Create curved field line
      const line: THREE.Vector3[] = [];
      const steps = 10;
      
      for (let t = 0; t <= steps; t++) {
        const alpha = t / steps;
        const point = new THREE.Vector3().lerpVectors(c1.position, c2.position, alpha);
        
        // Add curve based on force type
        const curvature = force.type === 'attraction' ? 0.2 : -0.2;
        const perpendicular = new THREE.Vector3()
          .crossVectors(force.direction, new THREE.Vector3(0, 0, 1))
          .normalize();
        
        point.add(perpendicular.multiplyScalar(
          Math.sin(alpha * Math.PI) * curvature * distance
        ));
        
        line.push(point);
      }
      
      lines.push(line);
      intensities.push(force.magnitude);
    }
  }

  return { lines, intensities };
}

/**
 * Spatial partitioning for efficient collision detection
 */
export class SpatialGrid {
  private cellSize: number;
  private grid: Map<string, MagneticConnector[]>;

  constructor(cellSize: number = 2.0) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  private getCellKey(position: THREE.Vector3): string {
    const x = Math.floor(position.x / this.cellSize);
    const y = Math.floor(position.y / this.cellSize);
    const z = Math.floor(position.z / this.cellSize);
    return `${x},${y},${z}`;
  }

  clear(): void {
    this.grid.clear();
  }

  insert(connector: MagneticConnector): void {
    const key = this.getCellKey(connector.position);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(connector);
  }

  getNearby(position: THREE.Vector3, radius: number): MagneticConnector[] {
    const nearby: MagneticConnector[] = [];
    const cellRadius = Math.ceil(radius / this.cellSize);
    
    const centerX = Math.floor(position.x / this.cellSize);
    const centerY = Math.floor(position.y / this.cellSize);
    const centerZ = Math.floor(position.z / this.cellSize);

    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        for (let dz = -cellRadius; dz <= cellRadius; dz++) {
          const key = `${centerX + dx},${centerY + dy},${centerZ + dz}`;
          const cell = this.grid.get(key);
          if (cell) {
            nearby.push(...cell);
          }
        }
      }
    }

    return nearby;
  }
}
