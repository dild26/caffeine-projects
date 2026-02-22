import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html, PerformanceMonitor, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Block, Connection, ExecutionState } from '../types';
import { getBlockDefinition } from '../blockDefinitions';
import { ViewPreset } from './ViewportControls';

interface WebGLCanvasProps {
  blocks: Block[];
  connections: Connection[];
  selectedBlockId: string | null;
  executionState: ExecutionState;
  pan: { x: number; y: number };
  zoom: number;
  onPanChange: (pan: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onDeleteBlock: (id: string) => void;
  onStartConnection: (blockId: string, port: string) => void;
  onEndConnection: (blockId: string, port: string) => void;
  connectingFrom: { blockId: string; port: string } | null;
  tempConnection: { x: number; y: number } | null;
  currentView?: ViewPreset;
  splitViewEnabled?: boolean;
}

// Performance monitoring state
interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  dataFlowSpeed: number;
  activeModules: number;
}

// Modular block component with extensible rendering API
interface ModularBlockProps {
  block: Block;
  isSelected: boolean;
  isExecuting: boolean;
  hasError: boolean;
  dataFlowState: Map<string, any>;
  onSelect: () => void;
  onMove: (position: { x: number; y: number }) => void;
  onPortClick: (portId: string, isOutput: boolean) => void;
}

// Enhanced Modular Block Mesh with real-time visual feedback
function ModularBlockMesh({ 
  block, 
  isSelected, 
  isExecuting,
  hasError,
  dataFlowState,
  onSelect,
  onMove,
  onPortClick
}: ModularBlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dataState, setDataState] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const definition = getBlockDefinition(block.type);

  // Enhanced category colors with better visual distinction
  const categoryColors = useMemo(() => ({
    inputs: '#3b82f6',
    logic: '#a855f7',
    conversion: '#06b6d4',
    cryptographic: '#f59e0b',
    ethereum: '#6366f1',
    blockchain: '#10b981',
    display: '#f97316'
  }), []);

  // Memoize geometries for performance
  const geometry = useMemo(() => new THREE.BoxGeometry(4, 2, 0.3), []);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(4.1, 2.1, 0.31)), []);
  const glowGeometry = useMemo(() => new THREE.BoxGeometry(4.3, 2.3, 0.4), []);

  // Real-time data flow state tracking with error detection
  useEffect(() => {
    if (hasError) {
      setDataState('error');
    } else {
      const blockData = dataFlowState.get(block.id);
      if (blockData) {
        setDataState('processing');
        const timer = setTimeout(() => setDataState('complete'), 500);
        return () => clearTimeout(timer);
      } else {
        setDataState('idle');
      }
    }
  }, [dataFlowState, block.id, hasError]);

  // Enhanced GPU-accelerated animation with shader effects
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    
    // Error state animation with red glow
    if (dataState === 'error') {
      material.emissiveIntensity = 0.9 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
      material.emissive.setHex(0xff0000);
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
    // Execution state animation
    else if (isExecuting) {
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      material.emissive.setHex(parseInt(categoryColors[definition?.category || 'inputs'].replace('#', '0x')));
    }
    // Data flow state animation with enhanced visual feedback
    else if (dataState === 'processing') {
      material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.05;
      // Add pulsing scale effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.03;
      meshRef.current.scale.set(scale, scale, 1);
    } else if (dataState === 'complete') {
      material.emissiveIntensity = 0.6;
      meshRef.current.rotation.z = 0;
      meshRef.current.scale.set(1, 1, 1);
    }
    
    // Smooth hover transitions with enhanced glow
    const targetIntensity = isSelected ? 0.7 : hovered ? 0.5 : isExecuting ? 0.5 : 0.15;
    material.emissiveIntensity += (targetIntensity - material.emissiveIntensity) * 0.1;
    
    // Smooth rotation reset
    if (dataState === 'idle' && !isExecuting) {
      meshRef.current.rotation.z *= 0.9;
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }

    // Animated glow effect for selected/hovered blocks
    if (glowRef.current) {
      const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
      if (isSelected || hovered) {
        glowMaterial.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
        glowRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      } else {
        glowMaterial.opacity *= 0.9;
      }
    }
  });

  // Cleanup
  useEffect(() => {
    return () => {
      geometry.dispose();
      edgesGeometry.dispose();
      glowGeometry.dispose();
    };
  }, [geometry, edgesGeometry, glowGeometry]);

  if (!definition) return null;

  const color = categoryColors[definition.category as keyof typeof categoryColors] || '#6b7280';

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.point.x, y: e.point.y };
    onSelect();
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isDragging && dragStartRef.current) {
      const deltaX = (e.point.x - dragStartRef.current.x) * 50;
      const deltaY = -(e.point.y - dragStartRef.current.y) * 50;
      onMove({
        x: block.position.x + deltaX,
        y: block.position.y + deltaY
      });
      dragStartRef.current = { x: e.point.x, y: e.point.y };
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  return (
    <group position={[block.position.x / 50, -block.position.y / 50, 0]}>
      {/* Animated glow layer */}
      {(isSelected || hovered) && (
        <mesh ref={glowRef} geometry={glowGeometry}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Main block mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={dataState === 'error' ? '#ff0000' : color}
          emissiveIntensity={0.15}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      
      {/* Selection edges with enhanced visibility */}
      {isSelected && (
        <lineSegments ref={edgesRef} geometry={edgesGeometry}>
          <lineBasicMaterial color="#ffffff" linewidth={3} />
        </lineSegments>
      )}

      {/* Block label with enhanced styling */}
      <Html
        position={[0, 0, 0.2]}
        center
        distanceFactor={10}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          width: '200px',
          fontSize: '12px',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)'
        }}
      >
        {definition.label}
      </Html>

      {/* Input ports with enhanced interactive visualization */}
      {definition.inputs.map((input, idx) => (
        <group key={`input-${idx}`} position={[-2.1, 0.5 - idx * 0.3, 0.15]}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onPortClick(input.id, false);
            }}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial 
              color="#10b981" 
              emissive="#10b981"
              emissiveIntensity={hovered ? 1.0 : 0.4}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <Html position={[-0.4, 0, 0]} style={{ 
            pointerEvents: 'none', 
            fontSize: '10px', 
            color: '#10b981',
            fontWeight: 'bold',
            textShadow: '0 0 4px rgba(0,0,0,0.8)'
          }}>
            {input.label}
          </Html>
        </group>
      ))}

      {/* Output ports with enhanced interactive visualization */}
      {definition.outputs.map((output, idx) => (
        <group key={`output-${idx}`} position={[2.1, 0.5 - idx * 0.3, 0.15]}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onPortClick(output.id, true);
            }}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial 
              color="#f59e0b" 
              emissive="#f59e0b"
              emissiveIntensity={hovered ? 1.0 : 0.4}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <Html position={[0.4, 0, 0]} style={{ 
            pointerEvents: 'none', 
            fontSize: '10px', 
            color: '#f59e0b',
            fontWeight: 'bold',
            textShadow: '0 0 4px rgba(0,0,0,0.8)'
          }}>
            {output.label}
          </Html>
        </group>
      ))}

      {/* Enhanced data state indicator with color-coded warnings */}
      {dataState !== 'idle' && (
        <mesh position={[0, 1.2, 0.2]}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial
            color={
              dataState === 'error' ? '#ef4444' :
              dataState === 'processing' ? '#f59e0b' : '#10b981'
            }
            emissive={
              dataState === 'error' ? '#ef4444' :
              dataState === 'processing' ? '#f59e0b' : '#10b981'
            }
            emissiveIntensity={1.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      )}

      {/* Error validation overlay */}
      {hasError && (
        <Html position={[0, -1.3, 0.2]} center style={{
          pointerEvents: 'none',
          background: 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 'bold',
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
          maxWidth: '150px',
          textAlign: 'center'
        }}>
          ⚠️ Error
        </Html>
      )}
    </group>
  );
}

// Enhanced data flow connection with directional arrows and shader effects
function DataFlowConnection({ 
  from, 
  to, 
  isActive,
  dataFlowing,
  hasError
}: { 
  from: { x: number; y: number }; 
  to: { x: number; y: number }; 
  isActive: boolean;
  dataFlowing: boolean;
  hasError?: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const arrowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Memoize curve calculation with enhanced bezier curves
  const { curvePoints, direction, midPoint } = useMemo(() => {
    const fromPos = new THREE.Vector3(from.x / 50, -from.y / 50, 0);
    const toPos = new THREE.Vector3(to.x / 50, -to.y / 50, 0);
    
    const distance = fromPos.distanceTo(toPos);
    const controlOffset = Math.min(distance * 0.4, 3);
    
    const curve = new THREE.CubicBezierCurve3(
      fromPos,
      new THREE.Vector3(fromPos.x + controlOffset, fromPos.y, 0),
      new THREE.Vector3(toPos.x - controlOffset, toPos.y, 0),
      toPos
    );

    const points = curve.getPoints(60);
    const dir = new THREE.Vector3().subVectors(toPos, fromPos).normalize();
    const mid = curve.getPoint(0.5);
    
    return { curvePoints: points, direction: dir, midPoint: mid };
  }, [from.x, from.y, to.x, to.y]);

  // Create flow particles along the connection
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      const t = i / 30;
      const point = curvePoints[Math.floor(t * (curvePoints.length - 1))];
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }
    return positions;
  }, [curvePoints]);

  // Animate connection with enhanced shader effects
  useFrame((state) => {
    if (lineRef.current && isActive) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      if (hasError) {
        material.color.setHex(0xef4444);
        material.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
      } else if (dataFlowing) {
        material.color.setHex(0x10b981);
        material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 6) * 0.3;
      } else {
        material.color.setHex(0xa855f7);
        material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      }
    }

    // Animate directional arrow with smooth movement
    if (arrowRef.current && isActive) {
      const t = ((state.clock.elapsedTime * 0.5) % 1);
      const point = curvePoints[Math.floor(t * (curvePoints.length - 1))];
      const nextPoint = curvePoints[Math.min(Math.floor(t * (curvePoints.length - 1)) + 1, curvePoints.length - 1)];
      arrowRef.current.position.copy(point);
      arrowRef.current.lookAt(nextPoint);
      arrowRef.current.rotateX(Math.PI / 2);
    }

    // Animate flow particles
    if (particlesRef.current && dataFlowing) {
      const positions = particlesRef.current.geometry.attributes.position;
      const posArray = positions.array as Float32Array;
      
      for (let i = 0; i < 30; i++) {
        const t = ((state.clock.elapsedTime * 0.3 + i / 30) % 1);
        const point = curvePoints[Math.floor(t * (curvePoints.length - 1))];
        posArray[i * 3] = point.x;
        posArray[i * 3 + 1] = point.y;
        posArray[i * 3 + 2] = point.z + Math.sin(state.clock.elapsedTime * 4 + i * 0.2) * 0.1;
      }
      
      positions.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Connection line with enhanced rendering - using primitive to avoid SVG confusion */}
      <primitive 
        object={new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(curvePoints),
          new THREE.LineBasicMaterial({
            color: hasError ? '#ef4444' : dataFlowing ? '#10b981' : '#a855f7',
            linewidth: 2,
            transparent: true,
            opacity: isActive ? 0.9 : 0.6
          })
        )}
        ref={lineRef}
      />

      {/* Animated directional arrow */}
      {isActive && (
        <mesh ref={arrowRef}>
          <coneGeometry args={[0.12, 0.35, 8]} />
          <meshStandardMaterial
            color={hasError ? '#ef4444' : dataFlowing ? '#10b981' : '#a855f7'}
            emissive={hasError ? '#ef4444' : dataFlowing ? '#10b981' : '#a855f7'}
            emissiveIntensity={1.0}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      )}

      {/* Flow particles for data visualization */}
      {dataFlowing && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={30}
              array={particlePositions}
              itemSize={3}
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.15}
            color={hasError ? '#ef4444' : '#10b981'}
            transparent
            opacity={0.9}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </>
  );
}

// Enhanced particle system for comprehensive data flow visualization
function DataFlowParticles({ 
  connections, 
  blocks,
  isActive,
  dataFlowState
}: { 
  connections: Connection[];
  blocks: Block[];
  isActive: boolean;
  dataFlowState: Map<string, any>;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(0));
  const colorsRef = useRef<Float32Array>(new Float32Array(0));
  const particlesPerConnection = 20;

  // Calculate particle data with enhanced color coding
  const { positions, velocities, colors } = useMemo(() => {
    if (!isActive || connections.length === 0) {
      return { positions: new Float32Array(0), velocities: new Float32Array(0), colors: new Float32Array(0) };
    }

    const totalParticles = connections.length * particlesPerConnection;
    const pos = new Float32Array(totalParticles * 3);
    const vel = new Float32Array(totalParticles * 3);
    const col = new Float32Array(totalParticles * 3);

    connections.forEach((conn, connIdx) => {
      const fromBlock = blocks.find(b => b.id === conn.fromBlockId);
      const toBlock = blocks.find(b => b.id === conn.toBlockId);
      
      if (fromBlock && toBlock) {
        const fromX = fromBlock.position.x / 50;
        const fromY = -fromBlock.position.y / 50;
        const toX = toBlock.position.x / 50;
        const toY = -toBlock.position.y / 50;

        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if data is flowing through this connection
        const hasData = dataFlowState.has(conn.toBlockId);
        const hasError = toBlock.error;
        
        for (let i = 0; i < particlesPerConnection; i++) {
          const t = i / particlesPerConnection;
          const idx = (connIdx * particlesPerConnection + i) * 3;
          
          // Position along curve with wave effect
          pos[idx] = fromX + dx * t;
          pos[idx + 1] = fromY + dy * t;
          pos[idx + 2] = Math.sin(t * Math.PI * 2) * 0.1;

          // Velocity for flow animation
          vel[idx] = dx / distance * 0.04;
          vel[idx + 1] = dy / distance * 0.04;
          vel[idx + 2] = 0;

          // Enhanced color based on data flow state
          if (hasError) {
            col[idx] = 0.94;     // Red
            col[idx + 1] = 0.27;
            col[idx + 2] = 0.27;
          } else if (hasData) {
            col[idx] = 0.06;     // Green
            col[idx + 1] = 0.72;
            col[idx + 2] = 0.51;
          } else {
            col[idx] = 0.66;     // Purple
            col[idx + 1] = 0.33;
            col[idx + 2] = 0.97;
          }
        }
      }
    });

    return { positions: pos, velocities: vel, colors: col };
  }, [connections, blocks, isActive, dataFlowState]);

  // Store velocities and colors in refs
  useEffect(() => {
    velocitiesRef.current = velocities;
    colorsRef.current = colors;
  }, [velocities, colors]);

  // Animate particles with enhanced flow effects
  useFrame((state) => {
    if (particlesRef.current && isActive && positions.length > 0) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      const colAttr = particlesRef.current.geometry.attributes.color;
      const posArray = posAttr.array as Float32Array;
      const colArray = colAttr.array as Float32Array;
      
      // Update particle positions with enhanced flow
      for (let i = 0; i < posArray.length; i += 3) {
        posArray[i] += velocitiesRef.current[i];
        posArray[i + 1] += velocitiesRef.current[i + 1];
        
        // Add enhanced wave motion
        posArray[i] += Math.sin(state.clock.elapsedTime * 3 + i * 0.1) * 0.01;
        posArray[i + 1] += Math.cos(state.clock.elapsedTime * 3 + i * 0.1) * 0.01;
        posArray[i + 2] = Math.sin(state.clock.elapsedTime * 4 + i * 0.2) * 0.15;
        
        // Update colors with enhanced pulsing effect
        const pulseIntensity = 0.7 + Math.sin(state.clock.elapsedTime * 5 + i * 0.3) * 0.3;
        colArray[i] = colorsRef.current[i] * pulseIntensity;
        colArray[i + 1] = colorsRef.current[i + 1] * pulseIntensity;
        colArray[i + 2] = colorsRef.current[i + 2] * pulseIntensity;
      }
      
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  });

  if (positions.length === 0) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Enhanced grid with dynamic effects and better visibility
function DynamicGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      const material = gridRef.current.material as THREE.Material;
      if (material && 'opacity' in material) {
        material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      }
    }
  });

  return (
    <gridHelper 
      ref={gridRef}
      args={[200, 200, '#555555', '#333333']} 
      rotation={[Math.PI / 2, 0, 0]}
    />
  );
}

// Enhanced performance debugging overlay
function PerformanceOverlay({ metrics }: { metrics: PerformanceMetrics }) {
  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#00ff00',
        padding: '16px',
        borderRadius: '12px',
        fontFamily: 'monospace',
        fontSize: '12px',
        pointerEvents: 'none',
        userSelect: 'none',
        border: '2px solid rgba(0, 255, 0, 0.5)',
        minWidth: '240px',
        boxShadow: '0 4px 16px rgba(0, 255, 0, 0.3), 0 0 40px rgba(0, 255, 0, 0.1)'
      }}
    >
      <div style={{ marginBottom: '12px', fontWeight: 'bold', color: '#00ffff', fontSize: '14px', borderBottom: '1px solid rgba(0, 255, 255, 0.3)', paddingBottom: '8px' }}>
        🎮 GPU Performance Monitor
      </div>
      <div style={{ display: 'grid', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>FPS:</span>
          <span style={{ color: metrics.fps > 50 ? '#00ff00' : metrics.fps > 30 ? '#ffff00' : '#ff0000', fontWeight: 'bold' }}>
            {metrics.fps.toFixed(1)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Frame Time:</span>
          <span style={{ color: '#ffff00' }}>{metrics.frameTime.toFixed(2)}ms</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Draw Calls:</span>
          <span style={{ color: '#00ffff' }}>{metrics.drawCalls}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Triangles:</span>
          <span style={{ color: '#ff00ff' }}>{metrics.triangles.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Data Flow:</span>
          <span style={{ color: '#00ff00' }}>{metrics.dataFlowSpeed.toFixed(1)}x</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Active Modules:</span>
          <span style={{ color: '#ffaa00' }}>{metrics.activeModules}</span>
        </div>
      </div>
      <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(0, 255, 0, 0.3)', fontSize: '10px', color: '#888', textAlign: 'center' }}>
        WebGL Hardware Acceleration
      </div>
    </Html>
  );
}

// Enhanced connection state overlay with adjacency graph visualization
function ConnectionStateOverlay({ 
  connections, 
  blocks,
  executionState,
  dataFlowState
}: { 
  connections: Connection[];
  blocks: Block[];
  executionState: ExecutionState;
  dataFlowState: Map<string, any>;
}) {
  const activeConnections = connections.length;
  const totalBlocks = blocks.length;
  const activeDataFlows = dataFlowState.size;
  const errorBlocks = blocks.filter(b => b.error).length;
  
  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        padding: '16px',
        borderRadius: '12px',
        fontFamily: 'monospace',
        fontSize: '12px',
        pointerEvents: 'none',
        userSelect: 'none',
        border: '2px solid rgba(168, 85, 247, 0.6)',
        minWidth: '240px',
        boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)'
      }}
    >
      <div style={{ marginBottom: '12px', fontWeight: 'bold', color: '#a855f7', fontSize: '14px', borderBottom: '1px solid rgba(168, 85, 247, 0.3)', paddingBottom: '8px' }}>
        🔗 Adjacency Graph State
      </div>
      <div style={{ display: 'grid', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Nodes (Blocks):</span>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>{totalBlocks}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Edges (Connections):</span>
          <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{activeConnections}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Active Data Flows:</span>
          <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{activeDataFlows}</span>
        </div>
        {errorBlocks > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Error Blocks:</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{errorBlocks}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span>Status:</span>
          <span style={{ 
            color: executionState === 'running' ? '#10b981' : 
                   executionState === 'error' ? '#ef4444' : '#6b7280',
            fontWeight: 'bold'
          }}>
            {executionState.toUpperCase()}
          </span>
        </div>
      </div>
      <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(168, 85, 247, 0.3)' }}>
        <div style={{ 
          width: '100%', 
          height: '6px', 
          background: '#333',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: executionState === 'running' ? '100%' : '0%',
            height: '100%',
            background: 'linear-gradient(90deg, #a855f7, #10b981, #3b82f6)',
            transition: 'width 0.3s ease',
            animation: executionState === 'running' ? 'shimmer 2s infinite' : 'none'
          }} />
        </div>
      </div>
    </Html>
  );
}

// Enhanced interactive UI overlay for real-time data input/output
function InteractiveDataOverlay({
  selectedBlock,
  onUpdateConfig
}: {
  selectedBlock: Block | null;
  onUpdateConfig: (config: Record<string, any>) => void;
}) {
  if (!selectedBlock) return null;

  const definition = getBlockDefinition(selectedBlock.type);
  if (!definition || !definition.configFields || definition.configFields.length === 0) return null;

  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: 'fixed',
        top: '50%',
        left: '20px',
        transform: 'translateY(-50%)',
        background: 'rgba(0, 0, 0, 0.95)',
        color: '#ffffff',
        padding: '18px',
        borderRadius: '14px',
        fontFamily: 'system-ui',
        fontSize: '13px',
        border: '2px solid rgba(59, 130, 246, 0.7)',
        minWidth: '280px',
        maxWidth: '320px',
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2)'
      }}
    >
      <div style={{ marginBottom: '14px', fontWeight: 'bold', color: '#3b82f6', fontSize: '15px', borderBottom: '1px solid rgba(59, 130, 246, 0.3)', paddingBottom: '8px' }}>
        ⚙️ {definition.label} Configuration
      </div>
      {definition.configFields.map(field => (
        <div key={field.id} style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: '#aaa', fontSize: '11px', fontWeight: '500' }}>
            {field.label}
          </label>
          {field.type === 'text' && (
            <input
              type="text"
              value={selectedBlock.config[field.id] || ''}
              onChange={(e) => onUpdateConfig({ ...selectedBlock.config, [field.id]: e.target.value })}
              placeholder={field.placeholder}
              style={{
                width: '100%',
                padding: '8px 10px',
                background: '#1a1a1a',
                border: '1px solid #555',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#555'}
            />
          )}
          {field.type === 'number' && (
            <input
              type="number"
              value={selectedBlock.config[field.id] || ''}
              onChange={(e) => onUpdateConfig({ ...selectedBlock.config, [field.id]: e.target.value })}
              placeholder={field.placeholder}
              style={{
                width: '100%',
                padding: '8px 10px',
                background: '#1a1a1a',
                border: '1px solid #555',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#555'}
            />
          )}
        </div>
      ))}
    </Html>
  );
}

// Main scene component with enhanced modular architecture and CAD view support
function ModularScene({
  blocks,
  connections,
  selectedBlockId,
  executionState,
  onSelectBlock,
  onUpdateBlock,
  showDebugOverlay,
  dataFlowState,
  currentView
}: {
  blocks: Block[];
  connections: Connection[];
  selectedBlockId: string | null;
  executionState: ExecutionState;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  showDebugOverlay: boolean;
  dataFlowState: Map<string, any>;
  currentView?: ViewPreset;
}) {
  const { camera, gl } = useThree();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    drawCalls: 0,
    triangles: 0,
    dataFlowSpeed: 1.0,
    activeModules: 0
  });

  const lastFrameTime = useRef(performance.now());
  const frameCount = useRef(0);
  const fpsUpdateInterval = useRef(0);

  // Apply CAD view presets with animated transitions
  useEffect(() => {
    if (!currentView) return;
    
    const targetPosition = new THREE.Vector3();
    const targetRotation = new THREE.Euler();
    
    switch (currentView) {
      case 'isometric':
        targetPosition.set(25, 25, 25);
        break;
      case 'front':
        targetPosition.set(0, 0, 35);
        break;
      case 'side':
        targetPosition.set(35, 0, 0);
        break;
      case 'top':
        targetPosition.set(0, 35, 0);
        break;
      case 'free':
      default:
        return;
    }
    
    // Smooth camera transition
    const startPosition = camera.position.clone();
    const duration = 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      camera.position.lerpVectors(startPosition, targetPosition, eased);
      camera.lookAt(0, 0, 0);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [currentView, camera]);

  // Enhanced performance monitoring
  useFrame(() => {
    const now = performance.now();
    const delta = now - lastFrameTime.current;
    lastFrameTime.current = now;

    frameCount.current++;
    fpsUpdateInterval.current += delta;

    // Update metrics every 500ms
    if (fpsUpdateInterval.current >= 500) {
      const fps = (frameCount.current / fpsUpdateInterval.current) * 1000;
      const info = gl.info;
      
      setMetrics({
        fps,
        frameTime: delta,
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        dataFlowSpeed: executionState === 'running' ? 2.0 : 0,
        activeModules: blocks.length
      });

      frameCount.current = 0;
      fpsUpdateInterval.current = 0;
    }
  });

  const handlePortClick = useCallback((blockId: string, portId: string, isOutput: boolean) => {
    console.log(`Port clicked: ${blockId} - ${portId} (${isOutput ? 'output' : 'input'})`);
  }, []);

  // Memoize connection rendering with enhanced data flow state
  const connectionElements = useMemo(() => {
    return connections.map((conn, idx) => {
      const fromBlock = blocks.find(b => b.id === conn.fromBlockId);
      const toBlock = blocks.find(b => b.id === conn.toBlockId);
      if (!fromBlock || !toBlock) return null;

      const dataFlowing = dataFlowState.has(conn.toBlockId);
      const hasError = !!toBlock.error;

      return (
        <DataFlowConnection
          key={`${conn.fromBlockId}-${conn.toBlockId}-${idx}`}
          from={{ x: fromBlock.position.x + 200, y: fromBlock.position.y + 40 }}
          to={{ x: toBlock.position.x, y: toBlock.position.y + 40 }}
          isActive={executionState === 'running'}
          dataFlowing={dataFlowing}
          hasError={hasError}
        />
      );
    });
  }, [connections, blocks, executionState, dataFlowState]);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <>
      {/* Enhanced lighting for superior 3D visualization */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 10]} intensity={1.0} castShadow />
      <pointLight position={[-10, -10, 10]} intensity={0.7} color="#a855f7" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#10b981" />
      <spotLight position={[0, 15, 10]} intensity={0.6} angle={0.5} penumbra={0.5} color="#3b82f6" />
      <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#444444" />
      
      <DynamicGrid />
      
      {connectionElements}

      <DataFlowParticles
        connections={connections}
        blocks={blocks}
        isActive={executionState === 'running'}
        dataFlowState={dataFlowState}
      />

      {blocks.map(block => (
        <ModularBlockMesh
          key={block.id}
          block={block}
          isSelected={block.id === selectedBlockId}
          isExecuting={executionState === 'running'}
          hasError={!!block.error}
          dataFlowState={dataFlowState}
          onSelect={() => onSelectBlock(block.id)}
          onMove={(position) => onUpdateBlock(block.id, { position })}
          onPortClick={(portId, isOutput) => handlePortClick(block.id, portId, isOutput)}
        />
      ))}

      {showDebugOverlay && <PerformanceOverlay metrics={metrics} />}
      {showDebugOverlay && (
        <ConnectionStateOverlay 
          connections={connections}
          blocks={blocks}
          executionState={executionState}
          dataFlowState={dataFlowState}
        />
      )}
      
      <InteractiveDataOverlay
        selectedBlock={selectedBlock || null}
        onUpdateConfig={(config) => {
          if (selectedBlock) {
            onUpdateBlock(selectedBlock.id, { config });
          }
        }}
      />
    </>
  );
}

export default function WebGLCanvas(props: WebGLCanvasProps) {
  const [dpr, setDpr] = useState(1.5);
  const [showDebugOverlay, setShowDebugOverlay] = useState(true);
  const [dataFlowState, setDataFlowState] = useState<Map<string, any>>(new Map());

  // Simulate enhanced data flow state changes during execution
  useEffect(() => {
    if (props.executionState === 'running') {
      const interval = setInterval(() => {
        const newState = new Map<string, any>();
        props.blocks.forEach(block => {
          if (Math.random() > 0.4) {
            newState.set(block.id, { 
              processing: true, 
              timestamp: Date.now(),
              dataType: 'blockchain'
            });
          }
        });
        setDataFlowState(newState);
      }, 600);
      return () => clearInterval(interval);
    } else {
      setDataFlowState(new Map());
    }
  }, [props.executionState, props.blocks]);

  // Toggle debug overlay with 'D' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setShowDebugOverlay(prev => !prev);
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 35], fov: 55 }}
      dpr={dpr}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true
      }}
      style={{ background: 'transparent' }}
      frameloop="always"
    >
      <PerformanceMonitor
        factor={1}
        onChange={({ factor }) => {
          // Adaptive DPR based on performance
          setDpr(Math.round((0.5 + 1.5 * factor) * 10) / 10);
        }}
      >
        <ModularScene
          blocks={props.blocks}
          connections={props.connections}
          selectedBlockId={props.selectedBlockId}
          executionState={props.executionState}
          onSelectBlock={props.onSelectBlock}
          onUpdateBlock={props.onUpdateBlock}
          showDebugOverlay={showDebugOverlay}
          dataFlowState={dataFlowState}
          currentView={props.currentView}
        />
      </PerformanceMonitor>
      <OrbitControls 
        enableRotate={true}
        enablePan={true}
        enableZoom={true}
        zoomSpeed={0.8}
        panSpeed={0.8}
        rotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 6}
        minDistance={15}
        maxDistance={80}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
      />
    </Canvas>
  );
}
