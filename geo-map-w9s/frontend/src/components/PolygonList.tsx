import { useGetUserPolygons } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hexagon } from 'lucide-react';

export default function PolygonList() {
  const { data: polygons, isLoading } = useGetUserPolygons();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!polygons || polygons.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hexagon className="h-5 w-5" />
            Polygons
          </CardTitle>
          <CardDescription>No polygons created yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hexagon className="h-5 w-5" />
          Polygons ({polygons.length})
        </CardTitle>
        <CardDescription>All created polygons</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {polygons.map((polygon) => (
              <div key={polygon.id} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="font-medium text-sm">{polygon.id}</div>
                  <Badge variant="secondary" className="text-xs">
                    {polygon.vertices.length} vertices
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div>Triangles: {polygon.triangulation.length}</div>
                  <div>Grid cells: {polygon.gridCellIds.length}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
