import { useState } from 'react';
import { useMapStore } from '../lib/mapStore';
import { useCreatePin, useIsCallerAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { MapPin, Grid3x3, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import AdminConfigDialog from './AdminConfigDialog';

export default function ControlPanel() {
  const { 
    gridEnabled, 
    setGridEnabled, 
    gridType, 
    setGridType, 
    gridResolution, 
    setGridResolution,
    zoomLevel,
    setZoomLevel,
  } = useMapStore();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [altitude, setAltitude] = useState('0');

  const placePin = useCreatePin();
  const { data: isAdmin } = useIsCallerAdmin();

  const handlePlacePin = async () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const alt = parseFloat(altitude);

    if (isNaN(lat) || isNaN(lon) || isNaN(alt)) {
      toast.error('Please enter valid coordinates');
      return;
    }

    if (lat < -90 || lat > 90) {
      toast.error('Latitude must be between -90 and 90');
      return;
    }

    if (lon < -180 || lon > 180) {
      toast.error('Longitude must be between -180 and 180');
      return;
    }

    const pinId = `pin-${Date.now()}`;
    const gridCellId = `cell-${Math.floor(lat)}-${Math.floor(lon)}`;

    try {
      await placePin.mutateAsync({
        id: pinId,
        coordinates: { latitude: lat, longitude: lon, altitude: alt },
        gridCellId,
      });

      toast.success('Pin placed successfully');
      setLatitude('');
      setLongitude('');
      setAltitude('0');
    } catch (error) {
      toast.error('Failed to place pin');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Place Pin
          </CardTitle>
          <CardDescription>Enter coordinates to place a pin on the map</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude (-90 to 90)</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              placeholder="e.g., 40.7128"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude (-180 to 180)</Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              placeholder="e.g., -74.0060"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altitude">Altitude (meters)</Label>
            <Input
              id="altitude"
              type="number"
              step="1"
              placeholder="e.g., 0"
              value={altitude}
              onChange={(e) => setAltitude(e.target.value)}
            />
          </div>
          <Button onClick={handlePlacePin} className="w-full" disabled={placePin.isPending}>
            {placePin.isPending ? 'Placing...' : 'Place Pin'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5" />
            Grid Settings
          </CardTitle>
          <CardDescription>Configure grid overlay display</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="grid-toggle">Show Grid</Label>
            <Switch
              id="grid-toggle"
              checked={gridEnabled}
              onCheckedChange={setGridEnabled}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="grid-type">Grid Type</Label>
            <Select value={gridType} onValueChange={(v) => setGridType(v as 'axis-aligned' | 'geodesic')}>
              <SelectTrigger id="grid-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="axis-aligned">Axis-Aligned</SelectItem>
                <SelectItem value="geodesic">Geodesic (S2)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grid-resolution">
              Resolution: {gridResolution}
            </Label>
            <Slider
              id="grid-resolution"
              min={4}
              max={32}
              step={2}
              value={[gridResolution]}
              onValueChange={(v) => setGridResolution(v[0])}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ZoomIn className="h-5 w-5" />
            Zoom Controls
          </CardTitle>
          <CardDescription>Telescope-like scaling (10x to 1,000,000x)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zoom-level">
              Zoom: {zoomLevel}x
            </Label>
            <Slider
              id="zoom-level"
              min={10}
              max={1000000}
              step={10}
              value={[zoomLevel]}
              onValueChange={(v) => setZoomLevel(v[0])}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setZoomLevel(Math.max(10, zoomLevel / 10))}
            >
              <ZoomOut className="h-4 w-4 mr-2" />
              Zoom Out
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setZoomLevel(Math.min(1000000, zoomLevel * 10))}
            >
              <ZoomIn className="h-4 w-4 mr-2" />
              Zoom In
            </Button>
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Controls</CardTitle>
            <CardDescription>Configure system settings</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminConfigDialog />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full" size="sm">
            Create Polygon
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            Draw Arc
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            Measure Distance
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
