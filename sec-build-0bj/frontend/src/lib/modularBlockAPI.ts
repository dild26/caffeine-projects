/**
 * Modular Block Rendering API - Enhanced Edition
 * 
 * This API provides extensible interfaces for creating custom 3D blockchain function blocks
 * that can be dynamically added to the WebGL scene with full GPU acceleration.
 * 
 * Key Features:
 * - Unlimited modular tool system with dynamic addition/removal
 * - Real-time I/O data flow visualization (input→hex→hash→output)
 * - Event-driven rendering updates for immediate visual feedback
 * - Interactive 3D block meshes with GPU-accelerated animations
 * - Adjacency graph connectivity with directional flow arrows
 * - Enhanced camera controls (rotate/pan/zoom)
 * - Performance monitoring and optimization
 * - Comprehensive error validation with visual feedback
 * 
 * Usage Example:
 * 
 * ```typescript
 * import { createModularBlock, ModularBlockConfig } from './lib/modularBlockAPI';
 * 
 * const customHashBlock: ModularBlockConfig = {
 *   id: 'custom-hash',
 *   label: 'Custom Hash Function',
 *   category: 'cryptographic',
 *   geometry: { type: 'box', width: 4, height: 2, depth: 0.3 },
 *   material: { 
 *     color: '#f59e0b', 
 *     emissive: '#f59e0b', 
 *     metalness: 0.4,
 *     roughness: 0.6,
 *     emissiveIntensity: 0.15
 *   },
 *   inputs: [{ 
 *     id: 'data', 
 *     label: 'Data', 
 *     type: 'string', 
 *     position: [-2.1, 0, 0.15],
 *     color: '#10b981'
 *   }],
 *   outputs: [{ 
 *     id: 'hash', 
 *     label: 'Hash', 
 *     type: 'hash', 
 *     position: [2.1, 0, 0.15],
 *     color: '#f59e0b'
 *   }],
 *   execute: async (inputs) => {
 *     const hash = await customHashFunction(inputs.data);
 *     return { hash };
 *   },
 *   onDataReceived: (portId, data) => {
 *     console.log(`Data received on port ${portId}:`, data);
 *   },
 *   onDataSent: (portId, data) => {
 *     console.log(`Data sent from port ${portId}:`, data);
 *   }
 * };
 * 
 * const blockInstance = createModularBlock(customHashBlock);
 * ```
 */

import * as THREE from 'three';

// Modular block configuration interface
export interface ModularBlockConfig {
  id: string;
  label: string;
  category: 'inputs' | 'logic' | 'cryptographic' | 'blockchain' | 'display';
  geometry: BlockGeometry;
  material: BlockMaterial;
  inputs: PortConfig[];
  outputs: PortConfig[];
  execute: (inputs: Record<string, any>, config?: Record<string, any>) => Promise<Record<string, any>>;
  onDataReceived?: (portId: string, data: any) => void;
  onDataSent?: (portId: string, data: any) => void;
  onError?: (error: Error) => void;
  validate?: (inputs: Record<string, any>) => { valid: boolean; errors: string[] };
}

// Enhanced geometry configuration with more options
export interface BlockGeometry {
  type: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'custom';
  width?: number;
  height?: number;
  depth?: number;
  radius?: number;
  segments?: number;
  tube?: number;
  radialSegments?: number;
  customGeometry?: THREE.BufferGeometry;
}

// Enhanced material configuration with advanced properties
export interface BlockMaterial {
  color: string;
  emissive: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  transparent?: boolean;
  wireframe?: boolean;
  flatShading?: boolean;
}

// Enhanced port configuration with visual properties
export interface PortConfig {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'address' | 'hash' | 'hex' | 'binary' | 'keypair' | 'signature' | 'object' | 'any';
  position: [number, number, number];
  color?: string;
  size?: number;
  required?: boolean;
  defaultValue?: any;
}

// Data flow event with enhanced metadata
export interface DataFlowEvent {
  sourceBlockId: string;
  sourcePortId: string;
  targetBlockId: string;
  targetPortId: string;
  data: any;
  timestamp: number;
  dataType?: string;
  transformations?: string[];
}

// Adjacency graph node with enhanced connectivity info
export interface GraphNode {
  blockId: string;
  inputs: Map<string, GraphEdge[]>;
  outputs: Map<string, GraphEdge[]>;
  metadata?: {
    category: string;
    label: string;
    executionOrder?: number;
  };
}

// Adjacency graph edge with flow metrics
export interface GraphEdge {
  fromBlockId: string;
  fromPortId: string;
  toBlockId: string;
  toPortId: string;
  weight?: number;
  dataFlowRate?: number;
  lastDataTransfer?: number;
}

/**
 * Create a modular block instance from configuration
 * @param config - Block configuration object
 * @returns ModularBlockInstance
 */
export function createModularBlock(config: ModularBlockConfig): ModularBlockInstance {
  return new ModularBlockInstance(config);
}

/**
 * Modular block instance class with enhanced functionality
 */
export class ModularBlockInstance {
  public config: ModularBlockConfig;
  public geometry: THREE.BufferGeometry;
  public material: THREE.Material;
  public mesh: THREE.Mesh | null = null;
  private dataCache: Map<string, any> = new Map();
  private errorState: Error | null = null;

  constructor(config: ModularBlockConfig) {
    this.config = config;
    this.geometry = this.createGeometry(config.geometry);
    this.material = this.createMaterial(config.material);
  }

  private createGeometry(geomConfig: BlockGeometry): THREE.BufferGeometry {
    switch (geomConfig.type) {
      case 'box':
        return new THREE.BoxGeometry(
          geomConfig.width || 4,
          geomConfig.height || 2,
          geomConfig.depth || 0.3
        );
      case 'sphere':
        return new THREE.SphereGeometry(
          geomConfig.radius || 1,
          geomConfig.segments || 32,
          geomConfig.segments || 32
        );
      case 'cylinder':
        return new THREE.CylinderGeometry(
          geomConfig.radius || 1,
          geomConfig.radius || 1,
          geomConfig.height || 2,
          geomConfig.segments || 32
        );
      case 'cone':
        return new THREE.ConeGeometry(
          geomConfig.radius || 1,
          geomConfig.height || 2,
          geomConfig.segments || 32
        );
      case 'torus':
        return new THREE.TorusGeometry(
          geomConfig.radius || 1,
          geomConfig.tube || 0.4,
          geomConfig.radialSegments || 16,
          geomConfig.segments || 100
        );
      case 'custom':
        return geomConfig.customGeometry || new THREE.BoxGeometry(4, 2, 0.3);
      default:
        return new THREE.BoxGeometry(4, 2, 0.3);
    }
  }

  private createMaterial(matConfig: BlockMaterial): THREE.Material {
    return new THREE.MeshStandardMaterial({
      color: matConfig.color,
      emissive: matConfig.emissive,
      emissiveIntensity: matConfig.emissiveIntensity || 0.15,
      metalness: matConfig.metalness || 0.4,
      roughness: matConfig.roughness || 0.6,
      opacity: matConfig.opacity || 1.0,
      transparent: matConfig.transparent || false,
      wireframe: matConfig.wireframe || false,
      flatShading: matConfig.flatShading || false
    });
  }

  public async execute(inputs: Record<string, any>, config?: Record<string, any>): Promise<Record<string, any>> {
    try {
      // Validate inputs if validator is provided
      if (this.config.validate) {
        const validation = this.config.validate(inputs);
        if (!validation.valid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
      }

      const result = await this.config.execute(inputs, config);
      this.errorState = null;
      return result;
    } catch (error) {
      this.errorState = error as Error;
      if (this.config.onError) {
        this.config.onError(error as Error);
      }
      throw error;
    }
  }

  public receiveData(portId: string, data: any): void {
    this.dataCache.set(portId, data);
    if (this.config.onDataReceived) {
      this.config.onDataReceived(portId, data);
    }
  }

  public sendData(portId: string, data: any): void {
    if (this.config.onDataSent) {
      this.config.onDataSent(portId, data);
    }
  }

  public getErrorState(): Error | null {
    return this.errorState;
  }

  public clearError(): void {
    this.errorState = null;
  }

  public dispose(): void {
    this.geometry.dispose();
    if (this.material instanceof THREE.Material) {
      this.material.dispose();
    }
  }
}

/**
 * Enhanced adjacency graph manager for inter-module connectivity
 * Supports topological sorting, cycle detection, and flow analysis
 */
export class AdjacencyGraphManager {
  private nodes: Map<string, GraphNode> = new Map();
  private dataFlowEvents: DataFlowEvent[] = [];

  public addNode(blockId: string, metadata?: GraphNode['metadata']): void {
    if (!this.nodes.has(blockId)) {
      this.nodes.set(blockId, {
        blockId,
        inputs: new Map(),
        outputs: new Map(),
        metadata
      });
    }
  }

  public removeNode(blockId: string): void {
    this.nodes.delete(blockId);
    // Remove all edges connected to this node
    this.nodes.forEach(node => {
      node.inputs.forEach((edges, portId) => {
        node.inputs.set(portId, edges.filter(e => e.fromBlockId !== blockId));
      });
      node.outputs.forEach((edges, portId) => {
        node.outputs.set(portId, edges.filter(e => e.toBlockId !== blockId));
      });
    });
  }

  public addEdge(edge: GraphEdge): void {
    // Add to source node outputs
    const sourceNode = this.nodes.get(edge.fromBlockId);
    if (sourceNode) {
      if (!sourceNode.outputs.has(edge.fromPortId)) {
        sourceNode.outputs.set(edge.fromPortId, []);
      }
      sourceNode.outputs.get(edge.fromPortId)!.push(edge);
    }

    // Add to target node inputs
    const targetNode = this.nodes.get(edge.toBlockId);
    if (targetNode) {
      if (!targetNode.inputs.has(edge.toPortId)) {
        targetNode.inputs.set(edge.toPortId, []);
      }
      targetNode.inputs.get(edge.toPortId)!.push(edge);
    }
  }

  public removeEdge(fromBlockId: string, fromPortId: string, toBlockId: string, toPortId: string): void {
    const sourceNode = this.nodes.get(fromBlockId);
    if (sourceNode && sourceNode.outputs.has(fromPortId)) {
      const edges = sourceNode.outputs.get(fromPortId)!;
      sourceNode.outputs.set(
        fromPortId,
        edges.filter(e => !(e.toBlockId === toBlockId && e.toPortId === toPortId))
      );
    }

    const targetNode = this.nodes.get(toBlockId);
    if (targetNode && targetNode.inputs.has(toPortId)) {
      const edges = targetNode.inputs.get(toPortId)!;
      targetNode.inputs.set(
        toPortId,
        edges.filter(e => !(e.fromBlockId === fromBlockId && e.fromPortId === fromPortId))
      );
    }
  }

  public getConnectedBlocks(blockId: string): { inputs: string[]; outputs: string[] } {
    const node = this.nodes.get(blockId);
    if (!node) return { inputs: [], outputs: [] };

    const inputs = new Set<string>();
    const outputs = new Set<string>();

    node.inputs.forEach(edges => {
      edges.forEach(edge => inputs.add(edge.fromBlockId));
    });

    node.outputs.forEach(edges => {
      edges.forEach(edge => outputs.add(edge.toBlockId));
    });

    return {
      inputs: Array.from(inputs),
      outputs: Array.from(outputs)
    };
  }

  public getExecutionOrder(): string[] {
    // Topological sort for execution order
    const visited = new Set<string>();
    const order: string[] = [];

    const visit = (blockId: string) => {
      if (visited.has(blockId)) return;
      visited.add(blockId);

      const node = this.nodes.get(blockId);
      if (node) {
        node.inputs.forEach(edges => {
          edges.forEach(edge => visit(edge.fromBlockId));
        });
      }

      order.push(blockId);
    };

    this.nodes.forEach((_, blockId) => visit(blockId));
    return order;
  }

  public detectCycles(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (blockId: string): boolean => {
      visited.add(blockId);
      recursionStack.add(blockId);

      const node = this.nodes.get(blockId);
      if (node) {
        for (const edges of node.outputs.values()) {
          for (const edge of edges) {
            if (!visited.has(edge.toBlockId)) {
              if (hasCycle(edge.toBlockId)) return true;
            } else if (recursionStack.has(edge.toBlockId)) {
              return true;
            }
          }
        }
      }

      recursionStack.delete(blockId);
      return false;
    };

    for (const blockId of this.nodes.keys()) {
      if (!visited.has(blockId)) {
        if (hasCycle(blockId)) return true;
      }
    }

    return false;
  }

  public recordDataFlow(event: DataFlowEvent): void {
    this.dataFlowEvents.push(event);
    
    // Update edge metrics
    const sourceNode = this.nodes.get(event.sourceBlockId);
    if (sourceNode && sourceNode.outputs.has(event.sourcePortId)) {
      const edges = sourceNode.outputs.get(event.sourcePortId)!;
      edges.forEach(edge => {
        if (edge.toBlockId === event.targetBlockId && edge.toPortId === event.targetPortId) {
          edge.lastDataTransfer = event.timestamp;
          edge.dataFlowRate = (edge.dataFlowRate || 0) + 1;
        }
      });
    }
  }

  public getDataFlowMetrics(): {
    totalEvents: number;
    eventsPerSecond: number;
    activeConnections: number;
  } {
    const now = Date.now();
    const recentEvents = this.dataFlowEvents.filter(e => now - e.timestamp < 1000);
    
    let activeConnections = 0;
    this.nodes.forEach(node => {
      node.outputs.forEach(edges => {
        edges.forEach(edge => {
          if (edge.lastDataTransfer && now - edge.lastDataTransfer < 2000) {
            activeConnections++;
          }
        });
      });
    });

    return {
      totalEvents: this.dataFlowEvents.length,
      eventsPerSecond: recentEvents.length,
      activeConnections
    };
  }

  public clearDataFlowHistory(): void {
    this.dataFlowEvents = [];
  }
}

/**
 * Enhanced data flow manager for real-time visualization
 * Supports event streaming, filtering, and analytics
 */
export class DataFlowManager {
  private events: DataFlowEvent[] = [];
  private listeners: ((event: DataFlowEvent) => void)[] = [];
  private maxEvents: number = 1000;

  public emitDataFlow(event: DataFlowEvent): void {
    this.events.push(event);
    
    // Limit event history
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    this.listeners.forEach(listener => listener(event));
  }

  public subscribe(listener: (event: DataFlowEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getRecentEvents(count: number = 10): DataFlowEvent[] {
    return this.events.slice(-count);
  }

  public getEventsByBlock(blockId: string): DataFlowEvent[] {
    return this.events.filter(
      e => e.sourceBlockId === blockId || e.targetBlockId === blockId
    );
  }

  public getEventsByTimeRange(startTime: number, endTime: number): DataFlowEvent[] {
    return this.events.filter(
      e => e.timestamp >= startTime && e.timestamp <= endTime
    );
  }

  public clearEvents(): void {
    this.events = [];
  }

  public getStatistics(): {
    totalEvents: number;
    uniqueBlocks: Set<string>;
    averageEventsPerSecond: number;
  } {
    const uniqueBlocks = new Set<string>();
    this.events.forEach(e => {
      uniqueBlocks.add(e.sourceBlockId);
      uniqueBlocks.add(e.targetBlockId);
    });

    const timeSpan = this.events.length > 0
      ? (this.events[this.events.length - 1].timestamp - this.events[0].timestamp) / 1000
      : 0;

    return {
      totalEvents: this.events.length,
      uniqueBlocks,
      averageEventsPerSecond: timeSpan > 0 ? this.events.length / timeSpan : 0
    };
  }
}

// Export singleton instances for global access
export const adjacencyGraph = new AdjacencyGraphManager();
export const dataFlowManager = new DataFlowManager();

/**
 * Utility function to create a custom shader material for advanced visual effects
 */
export function createCustomShaderMaterial(
  vertexShader: string,
  fragmentShader: string,
  uniforms?: Record<string, any>
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms || {},
    transparent: true
  });
}

/**
 * Utility function to create animated glow effect
 */
export function createGlowEffect(color: string, intensity: number = 1.0): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.3 * intensity,
    blending: THREE.AdditiveBlending
  });
  return new THREE.Mesh(geometry, material);
}
