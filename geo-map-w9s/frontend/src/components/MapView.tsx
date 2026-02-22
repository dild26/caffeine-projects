import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Globe, Map } from 'lucide-react';
import GlobeView from './GlobeView';
import FlatMapView from './FlatMapView';
import ControlPanel from './ControlPanel';
import PinList from './PinList';
import PolygonList from './PolygonList';
import ManifestLog from './ManifestLog';
import ImageAdjustmentPanel from './ImageAdjustmentPanel';
import OverlayLayerControls from './OverlayLayerControls';
import SearchBar from './SearchBar';

export default function MapView() {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [sideTab, setSideTab] = useState<'controls' | 'pins' | 'polygons' | 'log' | 'adjustments' | 'overlays'>('controls');

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="h-full flex flex-col">
            <div className="border-b bg-background p-4">
              <SearchBar />
            </div>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as '3d' | '2d')} className="w-full flex-1">
              <TabsList className="w-full justify-start rounded-none border-b bg-background">
                <TabsTrigger value="3d" className="gap-2">
                  <Globe className="h-4 w-4" />
                  3D Globe
                </TabsTrigger>
                <TabsTrigger value="2d" className="gap-2">
                  <Map className="h-4 w-4" />
                  2D Map
                </TabsTrigger>
              </TabsList>
              <TabsContent value="3d" className="h-[calc(100vh-12rem)] m-0">
                <GlobeView />
              </TabsContent>
              <TabsContent value="2d" className="h-[calc(100vh-12rem)] m-0">
                <FlatMapView />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <Tabs value={sideTab} onValueChange={(v) => setSideTab(v as any)} className="h-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-background overflow-x-auto flex-nowrap">
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="overlays">Overlays</TabsTrigger>
              <TabsTrigger value="pins">Pins</TabsTrigger>
              <TabsTrigger value="polygons">Polygons</TabsTrigger>
              <TabsTrigger value="adjustments">Adjust</TabsTrigger>
              <TabsTrigger value="log">Log</TabsTrigger>
            </TabsList>
            <div className="h-[calc(100%-3rem)] overflow-y-auto p-4">
              <TabsContent value="controls" className="m-0">
                <ControlPanel />
              </TabsContent>
              <TabsContent value="overlays" className="m-0">
                <OverlayLayerControls />
              </TabsContent>
              <TabsContent value="pins" className="m-0">
                <PinList />
              </TabsContent>
              <TabsContent value="polygons" className="m-0">
                <PolygonList />
              </TabsContent>
              <TabsContent value="adjustments" className="m-0">
                <ImageAdjustmentPanel viewMode={viewMode === '3d' ? 'globe' : 'flat'} />
              </TabsContent>
              <TabsContent value="log" className="m-0">
                <ManifestLog />
              </TabsContent>
            </div>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
