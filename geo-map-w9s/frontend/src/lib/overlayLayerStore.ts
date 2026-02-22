import { create } from 'zustand';

export interface OverlayLayerState {
  roads: boolean;
  railways: boolean;
  rivers: boolean;
  vegetation: boolean;
  climate: boolean;
  floodAlerts: boolean;
  disasterAlerts: boolean;
  borders: boolean;
}

interface OverlayLayerStore {
  layers: OverlayLayerState;
  toggleLayer: (layer: keyof OverlayLayerState) => void;
  setLayer: (layer: keyof OverlayLayerState, enabled: boolean) => void;
  resetLayers: () => void;
}

const defaultLayers: OverlayLayerState = {
  roads: false,
  railways: false,
  rivers: false,
  vegetation: false,
  climate: false,
  floodAlerts: false,
  disasterAlerts: false,
  borders: true,
};

export const useOverlayLayerStore = create<OverlayLayerStore>((set) => ({
  layers: defaultLayers,
  toggleLayer: (layer) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [layer]: !state.layers[layer],
      },
    })),
  setLayer: (layer, enabled) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [layer]: enabled,
      },
    })),
  resetLayers: () => set({ layers: defaultLayers }),
}));
