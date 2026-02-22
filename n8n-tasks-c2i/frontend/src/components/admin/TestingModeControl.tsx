import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, AlertTriangle, Info } from 'lucide-react';

export default function TestingModeControl() {
  const [testingMode, setTestingMode] = useState(false);

  const handleToggleTestingMode = async (enabled: boolean) => {
    // Note: Backend testing mode functionality not yet implemented
    // This is a UI-only toggle for demonstration purposes
    setTestingMode(enabled);
    if (enabled) {
      toast.info('Testing mode UI enabled (backend implementation pending)');
    } else {
      toast.info('Testing mode UI disabled (backend implementation pending)');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Testing Mode Control
          </CardTitle>
          <CardDescription>
            Temporarily lift user/subscriber restrictions for broader testing and error prevention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>About Testing Mode</AlertTitle>
            <AlertDescription>
              When enabled, testing mode allows all users to upload and parse files without subscription restrictions.
              This helps identify and prevent errors across a broader user base. Remember to disable testing mode after
              validation is complete.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Backend Implementation Pending</AlertTitle>
            <AlertDescription>
              The testing mode backend functionality is not yet implemented. This UI is for demonstration purposes only.
              Contact the development team to add backend support for testing mode controls.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
            <div className="space-y-1">
              <Label htmlFor="testing-mode" className="text-base font-semibold">
                Testing Mode (UI Only)
              </Label>
              <p className="text-sm text-muted-foreground">
                {testingMode ? 'Currently enabled (UI only)' : 'Currently disabled (UI only)'}
              </p>
            </div>
            <Switch
              id="testing-mode"
              checked={testingMode}
              onCheckedChange={handleToggleTestingMode}
            />
          </div>

          {testingMode && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Testing mode UI is currently active. Note: This is a UI-only toggle and does not affect actual access controls.
                Backend implementation is required for full functionality.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Planned Testing Mode Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Allow all users to upload workflow files</li>
              <li>Enable broader error detection and logging</li>
              <li>Help identify common parsing issues</li>
              <li>Improve error handling and learning system</li>
              <li>Should be disabled after validation period</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Additional admin settings and controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Additional configuration options coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
