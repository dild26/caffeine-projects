export interface TooltipCoordinates {
  x: number;
  y: number;
  elementId?: string;
  componentName?: string;
  timestamp: number;
}

export interface MemoAction {
  id: string;
  type: 'memo' | 'action' | 'precision' | 'pin-point' | 'execution';
  description: string;
  coordinates?: TooltipCoordinates;
  targetElement?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
  error?: string;
}

export interface MemoChain {
  id: string;
  actions: MemoAction[];
  currentStep: number;
  status: 'active' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
}

export interface MemoSystemState {
  chains: MemoChain[];
  activeChainId?: string;
  coordinateHistory: TooltipCoordinates[];
}
