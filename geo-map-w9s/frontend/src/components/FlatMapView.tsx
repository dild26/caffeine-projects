import { useRef, useEffect, useState } from 'react';
import { useMapStore } from '../lib/mapStore';
import { useOverlayLayerStore } from '../lib/overlayLayerStore';
import { useGetUserImageAdjustments, useCreatePin, useGetTooltipData } from '../hooks/useQueries';
import CoordinateTooltip from './CoordinateTooltip';
import { OverlayDataService, type OverlayFeature } from '../lib/overlayDataService';
import type { Coordinate } from '../backend';
import type { GridCell } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function FlatMapView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { gridEnabled, gridResolution, pins, polygons, zoomLevel, imageAdjustments, setImageAdjustment, imageLayers } = useMapStore();
  const { layers: overlayLayers } = useOverlayLayerStore();
  const [layerImages, setLayerImages] = useState<{ id: string; image: HTMLImageElement; adjustment: any }[]>([]);
  const [overlayFeatures, setOverlayFeatures] = useState<OverlayFeature[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 960 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { data: savedAdjustments } = useGetUserImageAdjustments();
  const placePin = useCreatePin();
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
    const loadImages = async () => {
      const loaded: { id: string; image: HTMLImageElement; adjustment: any }[] = [];

      for (const layer of imageLayers) {
        if (layer.enabled && layer.url) {
          try {
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = layer.url;
            });

            const adjustment = imageAdjustments[layer.id] || {
              position: { x: 0, y: 0, z: 0 },
              scale: 1,
              rotation: 0,
            };

            loaded.push({ id: layer.id, image: img, adjustment });
          } catch (error) {
            console.error(`Failed to load image ${layer.url}:`, error);
          }
        }
      }

      setLayerImages(loaded);
    };

    loadImages();
  }, [imageLayers, imageAdjustments]);

  useEffect(() => {
    const fetchOverlayData = async () => {
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
      }
    };

    fetchOverlayData();
  }, [overlayLayers]);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setCanvasSize({ width: clientWidth, height: clientHeight });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setTooltipVisible(false);
  };

  const handleMouseMove = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });

    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });

      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      setTooltipVisible(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = zoomLevel / 10;
    const adjustedX = (x - canvasSize.width / 2 - panOffset.x) / scale + canvasSize.width / 2;
    const adjustedY = (y - canvasSize.height / 2 - panOffset.y) / scale + canvasSize.height / 2;

    const longitude = (adjustedX / canvasSize.width) * 360 - 180;
    const latitude = 90 - (adjustedY / canvasSize.height) * 180;

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    const coordsChanged = !lastCoordinatesRef.current ||
      Math.abs(lastCoordinatesRef.current.lon - longitude) > 0.5 ||
      Math.abs(lastCoordinatesRef.current.lat - latitude) > 0.5;

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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setTooltipVisible(false);
    lastCoordinatesRef.current = null;
  };

  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = zoomLevel / 10;
    const adjustedX = (x - canvasSize.width / 2 - panOffset.x) / scale + canvasSize.width / 2;
    const adjustedY = (y - canvasSize.height / 2 - panOffset.y) / scale + canvasSize.height / 2;

    const longitude = (adjustedX / canvasSize.width) * 360 - 180;
    const latitude = 90 - (adjustedY / canvasSize.height) * 180;

    const pinId = `pin-${Date.now()}`;
    const gridCellId = `cell-${Math.floor(latitude)}-${Math.floor(longitude)}`;

    try {
      await placePin.mutateAsync({
        id: pinId,
        coordinates: { latitude, longitude, altitude: 0 },
        gridCellId,
      });
      toast.success(`Pin placed at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    } catch (error) {
      toast.error('Failed to place pin');
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { setZoomLevel } = useMapStore.getState();
    const delta = e.deltaY > 0 ? -1 : 1;
    const newZoom = Math.max(1, Math.min(100, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const scale = zoomLevel / 10;
    ctx.save();
    ctx.translate(width / 2 + panOffset.x, height / 2 + panOffset.y);
    ctx.scale(scale, scale);
    ctx.translate(-width / 2, -height / 2);

    if (layerImages.length > 0) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      layerImages.forEach((layer, index) => {
        const { image, adjustment } = layer;
        const imgWidth = width * adjustment.scale;
        const imgHeight = height * adjustment.scale;

        const x = adjustment.position.x + (width - imgWidth) / 2;
        const y = adjustment.position.y + (height - imgHeight) / 2;

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(adjustment.rotation * (Math.PI / 180));
        ctx.translate(-width / 2, -height / 2);

        if (index > 0) {
          ctx.globalAlpha = 0.7;
        }

        ctx.drawImage(image, x, y, imgWidth, imgHeight);
        ctx.restore();
      });
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#1e3a5f');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    overlayFeatures.forEach((feature) => {
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

      if (feature.coordinates.length < 2) return;

      ctx.strokeStyle = getColorForType(feature.type);
      ctx.lineWidth = (feature.type === 'border' ? 2 : 1.5) / scale;
      ctx.globalAlpha = feature.type === 'border' ? 0.8 : 0.6;

      ctx.beginPath();
      feature.coordinates.forEach((coord, i) => {
        const x = ((coord.lon + 180) / 360) * width;
        const y = ((90 - coord.lat) / 180) * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    if (gridEnabled) {
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
      ctx.lineWidth = 1.5 / scale;

      const latStep = height / gridResolution;
      const lonStep = width / gridResolution;

      for (let i = 0; i <= gridResolution; i++) {
        const y = i * latStep;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (let i = 0; i <= gridResolution; i++) {
        const x = i * lonStep;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    pins.forEach((pin) => {
      const x = ((pin.coordinates.longitude + 180) / 360) * width;
      const y = ((90 - pin.coordinates.latitude) / 180) * height;

      let snapX = x;
      let snapY = y;
      if (gridEnabled) {
        const lonStep = width / gridResolution;
        const latStep = height / gridResolution;
        snapX = Math.round(x / lonStep) * lonStep;
        snapY = Math.round(y / latStep) * latStep;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(snapX + 2 / scale, snapY + 2 / scale, 8 / scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(snapX, snapY, 8 / scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / scale;
      ctx.stroke();
    });

    polygons.forEach((polygon) => {
      if (polygon.vertices.length < 3) return;

      const mappedVertices = polygon.vertices.map((vertex) => {
        const x = ((vertex.longitude + 180) / 360) * width;
        const y = ((90 - vertex.latitude) / 180) * height;

        if (gridEnabled) {
          const lonStep = width / gridResolution;
          const latStep = height / gridResolution;
          return {
            x: Math.round(x / lonStep) * lonStep,
            y: Math.round(y / latStep) * latStep,
          };
        }
        return { x, y };
      });

      ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.beginPath();
      mappedVertices.forEach((vertex, i) => {
        if (i === 0) {
          ctx.moveTo(vertex.x, vertex.y);
        } else {
          ctx.lineTo(vertex.x, vertex.y);
        }
      });
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2.5 / scale;
      ctx.stroke();

      mappedVertices.forEach((vertex) => {
        ctx.fillStyle = '#a78bfa';
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 5 / scale, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    ctx.restore();
  }, [gridEnabled, gridResolution, pins, polygons, zoomLevel, canvasSize, panOffset, layerImages, overlayFeatures]);

  return (
    <div ref={containerRef} className="h-full w-full flex items-center justify-center bg-slate-950 relative">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full h-full cursor-crosshair"
        style={{ imageRendering: 'auto' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
      />

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
