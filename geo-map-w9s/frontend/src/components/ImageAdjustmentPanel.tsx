import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RotateCcw, Save, Plus, Trash2 } from 'lucide-react';
import { useMapStore } from '../lib/mapStore';
import { useCreateImageAdjustment, useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';

interface ImageAdjustmentPanelProps {
  viewMode: 'globe' | 'flat';
}

export default function ImageAdjustmentPanel({ viewMode }: ImageAdjustmentPanelProps) {
  const { imageAdjustments, setImageAdjustment, resetImageAdjustment, imageLayers, addImageLayer, removeImageLayer, updateImageLayer } = useMapStore();
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-0');
  const saveAdjustment = useCreateImageAdjustment();
  const { data: isAdmin } = useIsCallerAdmin();

  const selectedLayer = imageLayers.find(l => l.id === selectedLayerId);
  const currentAdjustment = imageAdjustments[selectedLayerId] || {
    position: { x: 0, y: 0, z: 0 },
    scale: 1,
    rotation: 0,
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number[]) => {
    setImageAdjustment(selectedLayerId, {
      ...currentAdjustment,
      position: { ...currentAdjustment.position, [axis]: value[0] },
    });
  };

  const handleScaleChange = (value: number[]) => {
    setImageAdjustment(selectedLayerId, {
      ...currentAdjustment,
      scale: value[0],
    });
  };

  const handleRotationChange = (value: number[]) => {
    setImageAdjustment(selectedLayerId, {
      ...currentAdjustment,
      rotation: value[0],
    });
  };

  const handleReset = () => {
    resetImageAdjustment(selectedLayerId);
    toast.success('Adjustments reset to default');
  };

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error('Only admins can save adjustments');
      return;
    }

    try {
      await saveAdjustment.mutateAsync({
        id: selectedLayerId,
        position: currentAdjustment.position,
        scale: currentAdjustment.scale,
        rotation: currentAdjustment.rotation,
        isPermanent: true,
      });
      toast.success('Adjustments saved successfully');
    } catch (error) {
      toast.error('Failed to save adjustments');
      console.error(error);
    }
  };

  const handleAddLayer = () => {
    if (imageLayers.length >= 6) {
      toast.error('Maximum 6 image layers allowed');
      return;
    }
    const newId = `layer-${imageLayers.length}`;
    addImageLayer({
      id: newId,
      name: `Layer ${imageLayers.length + 1}`,
      url: '',
      enabled: true,
    });
    setSelectedLayerId(newId);
    toast.success('New layer added');
  };

  const handleRemoveLayer = () => {
    if (imageLayers.length <= 1) {
      toast.error('Cannot remove the last layer');
      return;
    }
    removeImageLayer(selectedLayerId);
    setSelectedLayerId(imageLayers[0].id);
    toast.success('Layer removed');
  };

  const handleUrlChange = (url: string) => {
    if (selectedLayer) {
      updateImageLayer(selectedLayerId, { ...selectedLayer, url });
    }
  };

  const handleToggleLayer = (enabled: boolean) => {
    if (selectedLayer) {
      updateImageLayer(selectedLayerId, { ...selectedLayer, enabled });
    }
  };

  const maxLayers = viewMode === 'flat' ? 6 : 6;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Image Layer Management</CardTitle>
        <CardDescription>
          {viewMode === 'globe' 
            ? 'Adjust position (x, y, z), scale, and rotation for 3D sphere wrapping'
            : 'Adjust position (x, y), scale, and rotation for 2D panoramic stitching (up to 6 images)'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedLayerId} onValueChange={setSelectedLayerId}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {imageLayers.map((layer) => (
                <SelectItem key={layer.id} value={layer.id}>
                  {layer.name} {!layer.enabled && '(disabled)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddLayer}
            disabled={imageLayers.length >= maxLayers}
            title="Add new layer"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRemoveLayer}
            disabled={imageLayers.length <= 1}
            title="Remove layer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {selectedLayer && (
          <>
            <div className="space-y-2">
              <Label>Image URL or Path</Label>
              <Input
                value={selectedLayer.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="/assets/your-image.png"
              />
              <p className="text-xs text-muted-foreground">
                Use /assets/filename for static assets or /assets/generated/filename for generated images
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label>Enable Layer</Label>
              <Switch
                checked={selectedLayer.enabled}
                onCheckedChange={handleToggleLayer}
              />
            </div>
          </>
        )}

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Position X: {currentAdjustment.position.x.toFixed(3)}</Label>
            <Slider
              value={[currentAdjustment.position.x]}
              onValueChange={(v) => handlePositionChange('x', v)}
              min={-1000}
              max={1000}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Position Y: {currentAdjustment.position.y.toFixed(3)}</Label>
            <Slider
              value={[currentAdjustment.position.y]}
              onValueChange={(v) => handlePositionChange('y', v)}
              min={-1000}
              max={1000}
              step={1}
              className="w-full"
            />
          </div>

          {viewMode === 'globe' && (
            <div className="space-y-2">
              <Label>Position Z: {currentAdjustment.position.z.toFixed(3)}</Label>
              <Slider
                value={[currentAdjustment.position.z]}
                onValueChange={(v) => handlePositionChange('z', v)}
                min={-5}
                max={5}
                step={0.01}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Scale: {currentAdjustment.scale.toFixed(3)}</Label>
            <Slider
              value={[currentAdjustment.scale]}
              onValueChange={handleScaleChange}
              min={0.1}
              max={5}
              step={0.01}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Rotation: {currentAdjustment.rotation.toFixed(1)}°</Label>
            <Slider
              value={[currentAdjustment.rotation]}
              onValueChange={handleRotationChange}
              min={-180}
              max={180}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          {isAdmin && (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saveAdjustment.isPending}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveAdjustment.isPending ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {isAdmin
            ? 'Admin: Your saved adjustments will be applied for all users'
            : 'Adjustments are saved for this session only'}
        </p>
        
        <p className="text-xs text-muted-foreground">
          {viewMode === 'flat' 
            ? `${imageLayers.length} of ${maxLayers} layers used. Click on the map to place pins with precise coordinates.`
            : `${imageLayers.length} of ${maxLayers} layers used. Images wrap around the solid sphere mesh.`}
        </p>
      </CardContent>
    </Card>
  );
}
