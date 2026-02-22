import { useState } from 'react';
import { useUpdateModuleConfig } from '../hooks/useQueries';
import type { ModuleConfig } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ModuleConfigTabProps {
  modules: ModuleConfig[];
}

export default function ModuleConfigTab({ modules }: ModuleConfigTabProps) {
  const [selectedModule, setSelectedModule] = useState<ModuleConfig | null>(
    modules.length > 0 ? modules[0] : null
  );
  const [editedModule, setEditedModule] = useState<ModuleConfig | null>(
    modules.length > 0 ? modules[0] : null
  );
  const { mutate: updateModule, isPending } = useUpdateModuleConfig();

  const handleModuleSelect = (module: ModuleConfig) => {
    setSelectedModule(module);
    setEditedModule(module);
  };

  const handleToggleEnabled = () => {
    if (!editedModule) return;
    setEditedModule({ ...editedModule, enabled: !editedModule.enabled });
  };

  const handleSettingChange = (index: number, key: string, value: string) => {
    if (!editedModule) return;
    const newSettings = [...editedModule.settings];
    newSettings[index] = [key, value];
    setEditedModule({ ...editedModule, settings: newSettings });
  };

  const handleAddSetting = () => {
    if (!editedModule) return;
    setEditedModule({
      ...editedModule,
      settings: [...editedModule.settings, ['newKey', 'newValue']],
    });
  };

  const handleRemoveSetting = (index: number) => {
    if (!editedModule) return;
    const newSettings = editedModule.settings.filter((_, i) => i !== index);
    setEditedModule({ ...editedModule, settings: newSettings });
  };

  const handleSave = () => {
    if (!editedModule) return;

    updateModule(editedModule, {
      onSuccess: () => {
        toast.success(`Module "${editedModule.name}" updated successfully`);
        setSelectedModule(editedModule);
      },
      onError: (error) => {
        toast.error(`Failed to update module: ${error.message}`);
      },
    });
  };

  const hasChanges =
    editedModule &&
    selectedModule &&
    JSON.stringify(editedModule) !== JSON.stringify(selectedModule);

  if (modules.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No modules available. Initialize default modules first.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">Available Modules</h3>
        <div className="space-y-2">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleSelect(module)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedModule?.id === module.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-accent/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{module.name}</span>
                <Badge variant={module.enabled ? 'default' : 'secondary'} className="text-xs">
                  {module.enabled ? 'ON' : 'OFF'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{module.id}</p>
            </button>
          ))}
        </div>
      </div>

      {editedModule && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{editedModule.name}</CardTitle>
                <CardDescription>Module ID: {editedModule.id}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="module-enabled" className="text-sm">
                  Enabled
                </Label>
                <Switch
                  id="module-enabled"
                  checked={editedModule.enabled}
                  onCheckedChange={handleToggleEnabled}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Module Settings</h4>
                <Button onClick={handleAddSetting} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Setting
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                {editedModule.settings.map(([key, value], index) => (
                  <div key={index} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`key-${index}`}>Key</Label>
                      <Input
                        id={`key-${index}`}
                        value={key}
                        onChange={(e) => handleSettingChange(index, e.target.value, value)}
                        placeholder="Setting key"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`value-${index}`}>Value</Label>
                      <Input
                        id={`value-${index}`}
                        value={value}
                        onChange={(e) => handleSettingChange(index, key, e.target.value)}
                        placeholder="Setting value"
                      />
                    </div>
                    <Button
                      onClick={() => handleRemoveSetting(index)}
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {hasChanges && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => setEditedModule(selectedModule)}
                  variant="outline"
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
