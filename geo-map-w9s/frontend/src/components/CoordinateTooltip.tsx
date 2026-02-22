import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import type { Coordinate } from '../backend';
import type { GridCell } from '../hooks/useQueries';

interface CoordinateTooltipProps {
  visible: boolean;
  position: { x: number; y: number };
  coordinates: Coordinate | null;
  gridCell: GridCell | null;
  loading?: boolean;
}

export default function CoordinateTooltip({
  visible,
  position,
  coordinates,
  gridCell,
  loading = false,
}: CoordinateTooltipProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-opacity duration-200"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y + 20}px`,
        opacity: visible ? 1 : 0,
      }}
    >
      <Card className="bg-slate-900/95 border-blue-500/50 backdrop-blur-sm shadow-2xl p-4 min-w-[280px]">
        {loading ? (
          <div className="flex items-center gap-2 text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Calculating coordinates...</span>
          </div>
        ) : coordinates && gridCell ? (
          <div className="space-y-3">
            <div className="border-b border-blue-500/30 pb-2">
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                Coordinate Data
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                <span className="text-slate-400 font-medium">Latitude:</span>
                <span className="text-white font-mono">{coordinates.latitude.toFixed(8)}°</span>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                <span className="text-slate-400 font-medium">Longitude:</span>
                <span className="text-white font-mono">{coordinates.longitude.toFixed(8)}°</span>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                <span className="text-slate-400 font-medium">Altitude:</span>
                <span className="text-white font-mono">{coordinates.altitude.toFixed(2)} m</span>
              </div>
            </div>

            <div className="border-t border-blue-500/30 pt-2 space-y-2">
              <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                <span className="text-slate-400 font-medium">Grid Number:</span>
                <span className="text-cyan-400 font-mono">{gridCell.gridNumber.toString()}</span>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                <span className="text-slate-400 font-medium">Grid Cell ID:</span>
                <span className="text-cyan-400 font-mono text-[10px]">{gridCell.id}</span>
              </div>
            </div>

            <div className="border-t border-blue-500/30 pt-2 space-y-2">
              <div className="text-xs text-slate-400 font-medium mb-1">ECEF Coordinates:</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">X:</span>
                  <span className="text-emerald-400 font-mono ml-1 block text-[10px]">
                    {gridCell.ecef.x.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Y:</span>
                  <span className="text-emerald-400 font-mono ml-1 block text-[10px]">
                    {gridCell.ecef.y.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Z:</span>
                  <span className="text-emerald-400 font-mono ml-1 block text-[10px]">
                    {gridCell.ecef.z.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-blue-500/30 pt-2 space-y-2">
              <div className="text-xs text-slate-400 font-medium mb-1">Web Mercator:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">X:</span>
                  <span className="text-purple-400 font-mono ml-1 block text-[10px]">
                    {gridCell.webMercator.x.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Y:</span>
                  <span className="text-purple-400 font-mono ml-1 block text-[10px]">
                    {gridCell.webMercator.y.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-400">
            Hover over the map to see coordinates
          </div>
        )}
      </Card>
    </div>
  );
}
