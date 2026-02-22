import { useGetUserPins } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin } from 'lucide-react';

export default function PinList() {
  const { data: pins, isLoading } = useGetUserPins();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!pins || pins.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Pins
          </CardTitle>
          <CardDescription>No pins placed yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Pins ({pins.length})
        </CardTitle>
        <CardDescription>All placed pins on the map</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {pins.map((pin) => (
              <div key={pin.id} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="font-medium text-sm">{pin.id}</div>
                  <Badge variant="outline" className="text-xs">
                    {pin.gridCellId}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Lat: {pin.coordinates.latitude.toFixed(6)}°</div>
                  <div>Lon: {pin.coordinates.longitude.toFixed(6)}°</div>
                  <div>Alt: {pin.coordinates.altitude.toFixed(0)}m</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
