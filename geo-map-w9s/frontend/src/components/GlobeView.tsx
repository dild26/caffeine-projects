import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useMapStore } from '../lib/mapStore';
import { useOverlayLayerStore } from '../lib/overlayLayerStore';
import { useGetUserImageAdjustments, useGetTooltipData } from '../hooks/useQueries';
import CoordinateTooltip from './CoordinateTooltip';
import { OverlayDataService, type OverlayFeature } from '../lib/overlayDataService';
import type { Coordinate } from '../backend';
import type { GridCell } from '../hooks/useQueries';

interface ImageLayer {
  id: string;
  texture: THREE.Texture | null;
  adjustment: {
    position: { x: number; y: number; z: number };
    scale: number;
    rotation: number;
  };
}

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gridEnabled, gridType, gridResolution, zoomLevel, imageAdjustments, imageLayers } = useMapStore();
  const { layers: overlayLayers } = useOverlayLayerStore();
  const [layers, setLayers] = useState<ImageLayer[]>([]);
  const [overlayFeatures, setOverlayFeatures] = useState<OverlayFeature[]>([]);
  const [isLoadingOverlays, setIsLoadingOverlays] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('');
    const newLayers: ImageLayer[] = [];

    imageLayers.forEach((layer) => {
      if (layer.enabled && layer.url) {
        loader.load(
          layer.url,
          (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = 16;
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 1);

            const adjustment = imageAdjustments[layer.id] || {
              position: { x: 0, y: 0, z: 0 },
              scale: 1,
              rotation: 0,
            };

            newLayers.push({
              id: layer.id,
              texture,
              adjustment,
            });

            setLayers([...newLayers]);
          },
          undefined,
          (error) => {
            console.error(`Failed to load texture for layer ${layer.id}:`, error);
          }
        );
      }
    });
  }, [imageLayers, imageAdjustments]);

  useEffect(() => {
    const fetchOverlayData = async () => {
      setIsLoadingOverlays(true);
      const features: OverlayFeature[] = [];

      try {
        if (overlayLayers.borders) {
          const borders = await OverlayDataService.fetchBorders();
          features.push(...borders);
        }

        const bounds = { north: 85, south: -85, east: 180, west: -180 };

        if (overlayLayers.roads) {
          const roads = await OverlayDataService.fetchRoads(bounds);
          features.push(...roads);
        }

        if (overlayLayers.railways) {
          const railways = await OverlayDataService.fetchRailways(bounds);
          features.push(...railways);
        }

        if (overlayLayers.rivers) {
          const rivers = await OverlayDataService.fetchRivers(bounds);
          features.push(...rivers);
        }

        setOverlayFeatures(features);
      } catch (error) {
        console.error('Error fetching overlay data:', error);
      } finally {
        setIsLoadingOverlays(false);
      }
    };

    fetchOverlayData();
  }, [overlayLayers]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  const baseRadius = 2;
  const scaledRadius = baseRadius * (zoomLevel / 10);

  return (
    <group>
      {layers.map((layer, index) => {
        const layerRadius = baseRadius + index * 0.001;
        return (
          <mesh
            key={layer.id}
            ref={index === 0 ? (meshRef as any) : undefined}
            position={[layer.adjustment.position.x, layer.adjustment.position.y, layer.adjustment.position.z]}
            scale={[
              (zoomLevel / 10) * layer.adjustment.scale,
              (zoomLevel / 10) * layer.adjustment.scale,
              (zoomLevel / 10) * layer.adjustment.scale,
            ]}
            rotation={[0, layer.adjustment.rotation * (Math.PI / 180), 0]}
          >
            <sphereGeometry args={[layerRadius, 256, 256]} />
            {layer.texture ? (
              <meshStandardMaterial
                map={(layer.texture as any) || undefined}
                roughness={0.7}
                metalness={0.2}
                emissive="#0a1929"
                emissiveIntensity={0.05}
                transparent={index > 0}
                opacity={index > 0 ? 0.8 : 1}
                side={THREE.FrontSide}
              />
            ) : (
              <meshStandardMaterial
                color="#4a5568"
                roughness={0.7}
                metalness={0.2}
                emissive="#0a1929"
                emissiveIntensity={0.05}
              />
            )}
          </mesh>
        );
      })}
      {gridEnabled && <GridOverlay type={gridType} resolution={gridResolution} radius={scaledRadius} />}
      <OverlayRenderer features={overlayFeatures} radius={scaledRadius} />
      <PinMarkers radius={scaledRadius} />
    </group>
  );
}

function OverlayRenderer({ features, radius }: { features: OverlayFeature[]; radius: number }) {
  const overlayRadius = radius * 1.008;

  const getColorForType = (type: OverlayFeature['type']): string => {
    switch (type) {
      case 'road': return '#fbbf24';
      case 'railway': return '#a78bfa';
      case 'river': return '#60a5fa';
      case 'border': return '#ef4444';
      case 'vegetation': return '#34d399';
      case 'climate': return '#f472b6';
      case 'flood': return '#fb923c';
      case 'disaster': return '#dc2626';
      default: return '#94a3b8';
    }
  };

  return (
    <>
      {features.map((feature, idx) => {
        const points: THREE.Vector3[] = feature.coordinates.map((coord) => {
          const phi = (90 - coord.lat) * (Math.PI / 180);
          const theta = coord.lon * (Math.PI / 180);

          const x = overlayRadius * Math.sin(phi) * Math.cos(theta);
          const y = overlayRadius * Math.cos(phi);
          const z = overlayRadius * Math.sin(phi) * Math.sin(theta);

          return new THREE.Vector3(x, y, z);
        });

        if (points.length < 2) return null;

        return (
          <Line
            key={`overlay-${feature.type}-${idx}`}
            points={points as any}
            color={getColorForType(feature.type)}
            lineWidth={feature.type === 'border' ? 2 : 1.5}
            transparent
            opacity={feature.type === 'border' ? 0.8 : 0.6}
          />
        );
      })}
    </>
  );
}

function GridOverlay({ type, resolution, radius }: { type: 'axis-aligned' | 'geodesic'; resolution: number; radius: number }) {
  const lines: React.ReactElement[] = [];
  const gridRadius = radius * 1.005;

  if (type === 'axis-aligned') {
    const step = 180 / resolution;

    for (let lat = -90; lat <= 90; lat += step) {
      const points: THREE.Vector3[] = [];
      const phi = (90 - lat) * (Math.PI / 180);
      for (let lon = -180; lon <= 180; lon += 1) {
        const theta = lon * (Math.PI / 180);
        const x = gridRadius * Math.sin(phi) * Math.cos(theta);
        const y = gridRadius * Math.cos(phi);
        const z = gridRadius * Math.sin(phi) * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, z));
      }
      lines.push(
        <Line
          key={`lat-${lat}`}
          points={points as any}
          color="#60a5fa"
          lineWidth={1.5}
          transparent
          opacity={0.5}
        />
      );
    }

    for (let lon = -180; lon < 180; lon += step) {
      const points: THREE.Vector3[] = [];
      const theta = lon * (Math.PI / 180);
      for (let lat = -90; lat <= 90; lat += 1) {
        const phi = (90 - lat) * (Math.PI / 180);
        const x = gridRadius * Math.sin(phi) * Math.cos(theta);
        const y = gridRadius * Math.cos(phi);
        const z = gridRadius * Math.sin(phi) * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, z));
      }
      lines.push(
        <Line
          key={`lon-${lon}`}
          points={points as any}
          color="#60a5fa"
          lineWidth={1.5}
          transparent
          opacity={0.5}
        />
      );
    }
  }

  return <>{lines}</>;
}

function PinMarkers({ radius }: { radius: number }) {
  const { pins } = useMapStore();

  return (
    <>
      {pins.map((pin) => {
        const { latitude, longitude, altitude } = pin.coordinates;
        const phi = (90 - latitude) * (Math.PI / 180);
        const theta = longitude * (Math.PI / 180);
        const pinRadius = radius + altitude / 10000 + 0.05;

        const x = pinRadius * Math.sin(phi) * Math.cos(theta);
        const y = pinRadius * Math.cos(phi);
        const z = pinRadius * Math.sin(phi) * Math.sin(theta);

        return (
          <mesh key={pin.id} position={[x, y, z]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={0.6}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        );
      })}
    </>
  );
}

function MouseTracker({ onMouseMove }: { onMouseMove: (x: number, y: number) => void }) {
  const { camera, raycaster } = useThree();
  const [mouse] = useState(new THREE.Vector2());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse as any, camera);

      const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2);
      const ray = raycaster.ray;
      const intersectPoint = new THREE.Vector3();

      if (ray.intersectSphere(sphere as any, intersectPoint as any)) {
        const radius = intersectPoint.length();
        const latitude = 90 - (Math.acos(intersectPoint.y / radius) * 180 / Math.PI);
        const longitude = Math.atan2(intersectPoint.z, intersectPoint.x) * 180 / Math.PI;

        onMouseMove(longitude, latitude);
      }
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, [camera, raycaster, mouse, onMouseMove]);

  return null;
}

export default function GlobeView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 800 });
  const { data: savedAdjustments } = useGetUserImageAdjustments();
  const { setImageAdjustment } = useMapStore();
  const getTooltipData = useGetTooltipData();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<{ coordinates: Coordinate; gridCell: GridCell } | null>(null);
  const [isLoadingTooltip, setIsLoadingTooltip] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCoordinatesRef = useRef<{ lon: number; lat: number } | null>(null);

  useEffect(() => {
    if (savedAdjustments && savedAdjustments.length > 0) {
      savedAdjustments.forEach((adj) => {
        setImageAdjustment(adj.id, {
          position: adj.position,
          scale: adj.scale,
          rotation: adj.rotation,
        });
      });
    }
  }, [savedAdjustments, setImageAdjustment]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const size = Math.min(clientWidth, clientHeight);
        setContainerSize({ width: size, height: size });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseMove = async (longitude: number, latitude: number) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    const coordsChanged = !lastCoordinatesRef.current ||
      Math.abs(lastCoordinatesRef.current.lon - longitude) > 0.1 ||
      Math.abs(lastCoordinatesRef.current.lat - latitude) > 0.1;

    if (coordsChanged) {
      setTooltipVisible(false);
      lastCoordinatesRef.current = { lon: longitude, lat: latitude };
    }

    hoverTimerRef.current = setTimeout(async () => {
      setIsLoadingTooltip(true);
      setTooltipVisible(true);

      try {
        const data = await getTooltipData.mutateAsync({ longitude, latitude });
        setTooltipData(data);
      } catch (error) {
        console.error('Error fetching tooltip data:', error);
      } finally {
        setIsLoadingTooltip(false);
      }
    }, 3000);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setTooltipVisible(false);
    lastCoordinatesRef.current = null;
  };

  const cameraDistance = 5.5;

  return (
    <div
      ref={containerRef}
      className="h-full w-full flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900"
      onMouseMove={handleCanvasMouseMove}
      onMouseLeave={handleCanvasMouseLeave}
    >
      <div
        className="rounded-full overflow-hidden shadow-2xl"
        style={{
          width: containerSize.width,
          height: containerSize.height,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <Canvas
          camera={{ position: [0, 0, cameraDistance], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true
          }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.0} />
          <directionalLight position={[-10, -5, -10]} intensity={0.3} />
          <pointLight position={[0, 0, 5]} intensity={0.2} />
          <Globe />
          <MouseTracker onMouseMove={handleMouseMove} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={10}
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>

      <CoordinateTooltip
        visible={tooltipVisible}
        position={mousePosition}
        coordinates={tooltipData?.coordinates || null}
        gridCell={tooltipData?.gridCell || null}
        loading={isLoadingTooltip}
      />
    </div>
  );
}
