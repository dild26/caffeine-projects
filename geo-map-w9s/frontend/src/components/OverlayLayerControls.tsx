import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useOverlayLayerStore } from '../lib/overlayLayerStore';
import { Layers, MapPin, Train, Waves, Trees, Cloud, AlertTriangle, Zap, Globe } from 'lucide-react';

export default function OverlayLayerControls() {
  const { layers, toggleLayer } = useOverlayLayerStore();

  const layerConfig = [
    { id: 'roads', label: 'Roads & Transportation', icon: MapPin, description: 'Road networks and highways' },
    { id: 'railways', label: 'Railways', icon: Train, description: 'Railway lines and stations' },
    { id: 'rivers', label: 'Rivers & Waterways', icon: Waves, description: 'Rivers, lakes, and water bodies' },
    { id: 'vegetation', label: 'Vegetation & Land Cover', icon: Trees, description: 'Forests and vegetation zones' },
    { id: 'climate', label: 'Climate Data', icon: Cloud, description: 'Temperature and weather patterns' },
    { id: 'floodAlerts', label: 'Flood Alerts', icon: AlertTriangle, description: 'Flood warnings and risk zones' },
    { id: 'disasterAlerts', label: 'Natural Disaster Alerts', icon: Zap, description: 'Earthquake, storm alerts' },
    { id: 'borders', label: 'National Borders', icon: Globe, description: 'Country and administrative boundaries' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Overlay Layers
        </CardTitle>
        <CardDescription>
          Toggle overlay layers from OSM and open-source providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {layerConfig.map((config, index) => {
          const Icon = config.icon;
          const isEnabled = layers[config.id as keyof typeof layers] || false;

          return (
            <div key={config.id}>
              {index > 0 && <Separator className="my-3" />}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label htmlFor={config.id} className="text-sm font-medium cursor-pointer">
                      {config.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
                <Switch
                  id={config.id}
                  checked={isEnabled}
                  onCheckedChange={() => toggleLayer(config.id as keyof typeof layers)}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
