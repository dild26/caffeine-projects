import { create } from 'zustand';
import type { Pin, Polygon } from '../backend';

interface ImageAdjustmentState {
  position: { x: number; y: number; z: number };
  scale: number;
  rotation: number;
}

interface ImageLayer {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}

interface MapState {
  gridEnabled: boolean;
  gridType: 'axis-aligned' | 'geodesic';
  gridResolution: number;
  zoomLevel: number;
  pins: Pin[];
  polygons: Polygon[];
  imageAdjustments: { [key: string]: ImageAdjustmentState };
  imageLayers: ImageLayer[];
  setGridEnabled: (enabled: boolean) => void;
  setGridType: (type: 'axis-aligned' | 'geodesic') => void;
  setGridResolution: (resolution: number) => void;
  setZoomLevel: (zoom: number) => void;
  setPins: (pins: Pin[]) => void;
  setPolygons: (polygons: Polygon[]) => void;
  setImageAdjustment: (id: string, adjustment: ImageAdjustmentState) => void;
  resetImageAdjustment: (id: string) => void;
  addImageLayer: (layer: ImageLayer) => void;
  removeImageLayer: (id: string) => void;
  updateImageLayer: (id: string, layer: ImageLayer) => void;
}

const defaultAdjustment: ImageAdjustmentState = {
  position: { x: 0, y: 0, z: 0 },
  scale: 1,
  rotation: 0,
};

const defaultImageLayers: ImageLayer[] = [
  {
    id: 'layer-0',
    name: 'Main World Map',
    url: '/assets/generated/neutral-sphere-texture.dim_1024x512.png',
    enabled: true,
  },
];

export const useMapStore = create<MapState>((set) => ({
  gridEnabled: true,
  gridType: 'axis-aligned',
  gridResolution: 12,
  zoomLevel: 10,
  pins: [],
  polygons: [],
  imageAdjustments: {},
  imageLayers: defaultImageLayers,
  setGridEnabled: (enabled) => set({ gridEnabled: enabled }),
  setGridType: (type) => set({ gridType: type }),
  setGridResolution: (resolution) => set({ gridResolution: resolution }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setPins: (pins) => set({ pins }),
  setPolygons: (polygons) => set({ polygons }),
  setImageAdjustment: (id, adjustment) =>
    set((state) => ({
      imageAdjustments: {
        ...state.imageAdjustments,
        [id]: adjustment,
      },
    })),
  resetImageAdjustment: (id) =>
    set((state) => ({
      imageAdjustments: {
        ...state.imageAdjustments,
        [id]: defaultAdjustment,
      },
    })),
  addImageLayer: (layer) =>
    set((state) => ({
      imageLayers: [...state.imageLayers, layer],
    })),
  removeImageLayer: (id) =>
    set((state) => ({
      imageLayers: state.imageLayers.filter((l) => l.id !== id),
    })),
  updateImageLayer: (id, layer) =>
    set((state) => ({
      imageLayers: state.imageLayers.map((l) => (l.id === id ? layer : l)),
    })),
}));
