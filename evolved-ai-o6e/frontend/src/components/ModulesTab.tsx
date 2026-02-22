import { useState, useEffect, useCallback } from 'react';
import { useGetAllModuleConfigs, useUpdateModuleConfig } from '../hooks/useQueries';
import { useDebouncedSave } from '../hooks/useDebouncedSave';
import type { ModuleConfig } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Check, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

type SyncStatus = 'idle' | 'pending' | 'syncing' | 'saved' | 'failed';

export default function ModulesTab() {
  const { data: modules = [], isLoading } = useGetAllModuleConfigs();
  const { mutate: updateModule, isPending } = useUpdateModuleConfig();
  
  const [selectedModule, setSelectedModule] = useState<ModuleConfig | null>(null);
  const [editedModule, setEditedModule] = useState<ModuleConfig | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  useEffect(() => {
    if (modules.length > 0 && !selectedModule) {
      setSelectedModule(modules[0]);
      setEditedModule(modules[0]);
    }
  }, [modules, selectedModule]);

  useEffect(() => {
    if (isPending) {
      setSyncStatus('syncing');
    }
  }, [isPending]);

  const handleSave = useCallback((config: ModuleConfig) => {
    updateModule(config, {
      onSuccess: () => {
        setSyncStatus('saved');
        setSelectedModule(config);
        setTimeout(() => setSyncStatus('idle'), 2000);
      },
      onError: (error) => {
        setSyncStatus('failed');
        toast.error(`Failed to update module: ${error.message}`);
        setTimeout(() => setSyncStatus('idle'), 3000);
      },
    });
  }, [updateModule]);

  useDebouncedSave(editedModule, (value) => {
    if (value && selectedModule && JSON.stringify(value) !== JSON.stringify(selectedModule)) {
      setSyncStatus('pending');
      handleSave(value);
    }
  }, 3000);

  const handleModuleSelect = (module: ModuleConfig) => {
    setSelectedModule(module);
    setEditedModule(module);
    setSyncStatus('idle');
  };

  const handleToggleEnabled = () => {
    if (!editedModule) return;
    const updated = { ...editedModule, enabled: !editedModule.enabled };
    setEditedModule(updated);
    setSyncStatus('pending');
  };

  const handleSettingChange = (index: number, key: string, value: string) => {
    if (!editedModule) return;
    const newSettings = [...editedModule.settings];
    newSettings[index] = [key, value];
    const updated = { ...editedModule, settings: newSettings };
    setEditedModule(updated);
    setSyncStatus('pending');
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
    const updated = { ...editedModule, settings: newSettings };
    setEditedModule(updated);
    setSyncStatus('pending');
  };

  const getSyncBadge = () => {
    switch (syncStatus) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'syncing':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Syncing</Badge>;
      case 'saved':
        return <Badge variant="default"><Check className="h-3 w-3 mr-1" />Saved</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-center">
            No modules available. Initialize default modules first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Module Configuration</CardTitle>
              <CardDescription>
                Real-time editable module settings with 3-second debounced auto-save
              </CardDescription>
            </div>
            {getSyncBadge()}
          </div>
        </CardHeader>
        <CardContent>
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
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <h3 className="font-semibold text-lg">{editedModule.name}</h3>
                    <p className="text-sm text-muted-foreground">Module ID: {editedModule.id}</p>
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

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Auto-Save:</strong> Changes are automatically saved 3 seconds after you stop typing. 
                    Status indicators show sync progress in real-time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
