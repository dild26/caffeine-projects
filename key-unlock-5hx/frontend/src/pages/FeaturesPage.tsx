import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Loader2, AlertCircle, AlertTriangle } from 'lucide-react';
import { useGetFeatures, useGetPendingTasks, useAffirmFeatureAdmin, useAssignFeatureAction, useIsCallerAdmin } from '../hooks/useAppQueries';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ACTION_COLORS: Record<string, string> = {
  redo: '#FF00AA',
  edit: '#00AAFF',
  update: '#FFAA00',
  modify: '#AA00FF',
  draft: '#00FFAA',
  error: '#FF0000',
  publish: '#00FF00',
  archive: '#AAAAAA',
  delete: '#000000',
};

const ACTION_OPTIONS = ['redo', 'edit', 'update', 'modify', 'draft', 'error', 'publish', 'archive', 'delete'];

export default function FeaturesPage() {
  const { data: features = [], isLoading, error } = useGetFeatures();
  const { data: pendingTasks = [] } = useGetPendingTasks();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { mutate: affirmAdmin, isPending: isAffirming } = useAffirmFeatureAdmin();
  const { mutate: assignAction, isPending: isAssigningAction } = useAssignFeatureAction();

  const handleAffirmAdmin = (featureId: bigint, currentStatus: boolean) => {
    affirmAdmin({ featureId, isAffirmed: !currentStatus }, {
      onSuccess: () => {
        toast.success(currentStatus ? 'Admin affirmation removed' : 'Feature affirmed by admin');
      },
      onError: (error: any) => {
        toast.error(`Failed to affirm feature: ${error.message}`);
      }
    });
  };

  const handleAssignAction = (featureId: bigint, action: string) => {
    assignAction({ featureId, action }, {
      onSuccess: () => {
        toast.success(`Action "${action}" assigned to feature`);
      },
      onError: (error: any) => {
        toast.error(`Failed to assign action: ${error.message}`);
      }
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load features. Admin access required.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading features...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="destructive" className="mb-2">Admin Only</Badge>
          <h1 className="text-4xl font-bold">KeyUnlock App Features</h1>
          <p className="text-xl text-muted-foreground">
            Passwordless 2FA with mobile authentication, QR codes, and 6-digit authenticator
          </p>
        </div>

        {/* Real-time Diff Fixture Panel */}
        {pendingTasks.length > 0 && (
          <div className="sticky top-4 z-10">
            <Alert className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 shadow-xl">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <AlertTitle className="text-yellow-900 dark:text-yellow-100 font-bold text-lg">
                ⚠️ Real-Time Diff Fixture - Pending Tasks ({pendingTasks.length})
              </AlertTitle>
              <AlertDescription className="text-yellow-800 dark:text-yellow-200 mt-3">
                <p className="text-sm mb-4 font-medium">
                  Features where Admin validation and AI completion status differ. Immediate review required.
                </p>
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div 
                      key={task.id.toString()} 
                      className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-yellow-400 dark:border-yellow-600 shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{task.title}</h4>
                            <Badge variant="outline" className="text-xs">ID: {task.id.toString()}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                          
                          {/* Checkbox Status Display */}
                          <div className="flex items-center gap-6 mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                task.adminAffirmed 
                                  ? 'bg-green-500 border-green-600' 
                                  : 'bg-white dark:bg-gray-700 border-gray-400'
                              }`}>
                                {task.adminAffirmed && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-xs font-medium">
                                Admin: {task.adminAffirmed ? '✓ Affirmed' : '○ Not Affirmed'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                task.aiCompleted 
                                  ? 'bg-blue-500 border-blue-600' 
                                  : 'bg-white dark:bg-gray-700 border-gray-400'
                              }`}>
                                {task.aiCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-xs font-medium">
                                AI: {task.aiCompleted ? '✓ Completed' : '○ Not Completed'}
                              </span>
                            </div>
                          </div>

                          {/* Action Assignment for Pending Tasks */}
                          {isAdmin && (
                            <div className="mt-3">
                              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                                Assign Action:
                              </label>
                              <Select
                                value={task.action || ''}
                                onValueChange={(value) => handleAssignAction(task.id, value)}
                                disabled={isAssigningAction}
                              >
                                <SelectTrigger className="w-full h-9 text-sm">
                                  <SelectValue placeholder="Select action..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {ACTION_OPTIONS.map((action) => (
                                    <SelectItem key={action} value={action}>
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-3 h-3 rounded" 
                                          style={{ backgroundColor: ACTION_COLORS[action] }}
                                        />
                                        <span className="capitalize">{action}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                        
                        {/* Current Action Badge */}
                        {task.action && (
                          <Badge 
                            className="shrink-0"
                            style={{ 
                              backgroundColor: ACTION_COLORS[task.action] || '#666',
                              color: ['publish', 'draft', 'edit'].includes(task.action) ? '#000' : '#fff',
                              border: 'none'
                            }}
                          >
                            {task.action.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Complete Features List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Features</h2>
            <Badge variant="outline">{features.length} Total</Badge>
          </div>

          <div className="space-y-4">
            {features.map((feature) => {
              const isPending = feature.aiCompleted !== feature.adminAffirmed;
              
              return (
                <Card 
                  key={feature.id.toString()} 
                  className={`transition-all ${
                    isPending 
                      ? 'border-2 border-yellow-400 shadow-lg bg-yellow-50/50 dark:bg-yellow-950/10' 
                      : 'border'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {feature.title}
                          {feature.aiCompleted && feature.adminAffirmed && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {isPending && (
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {feature.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant={isPending ? 'destructive' : 'outline'}>
                          ID: {feature.id.toString()}
                        </Badge>
                        {feature.action && (
                          <Badge 
                            style={{ 
                              backgroundColor: ACTION_COLORS[feature.action] || '#666',
                              color: ['publish', 'draft', 'edit'].includes(feature.action) ? '#000' : '#fff',
                              border: 'none'
                            }}
                          >
                            {feature.action.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Implementation Instructions:</h4>
                      <p className="text-sm text-muted-foreground">{feature.instructions}</p>
                    </div>

                    {/* Dual Checkbox System */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Left Checkbox: Admin Validation (Editable by Admin Only) */}
                      <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg ${
                        feature.adminAffirmed 
                          ? 'bg-green-50 dark:bg-green-950/20 border-green-500' 
                          : 'bg-card border-gray-300 dark:border-gray-700'
                      }`}>
                        <Checkbox
                          id={`admin-${feature.id}`}
                          checked={feature.adminAffirmed}
                          onCheckedChange={() => handleAffirmAdmin(feature.id, feature.adminAffirmed)}
                          disabled={!isAdmin || isAffirming}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`admin-${feature.id}`}
                            className={`text-sm font-bold leading-none ${
                              isAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
                            }`}
                          >
                            ← Admin Validation
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isAdmin ? 'Click to toggle manual validation' : 'Admin-only control'}
                          </p>
                        </div>
                      </div>

                      {/* Right Checkbox: AI Completion (Read-only, Backend-driven) */}
                      <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg ${
                        feature.aiCompleted 
                          ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500' 
                          : 'bg-card border-gray-300 dark:border-gray-700'
                      }`}>
                        <Checkbox
                          id={`ai-${feature.id}`}
                          checked={feature.aiCompleted}
                          disabled={true}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 cursor-not-allowed"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`ai-${feature.id}`}
                            className="text-sm font-bold leading-none cursor-not-allowed opacity-70"
                          >
                            AI Completion →
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Read-only, reflects backend status
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Summary */}
                    <div className="flex items-center gap-4 text-xs pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Status:</span>
                        {feature.aiCompleted && feature.adminAffirmed ? (
                          <span className="text-green-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed & Affirmed
                          </span>
                        ) : isPending ? (
                          <span className="text-yellow-600 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Pending Review
                          </span>
                        ) : (
                          <span className="text-muted-foreground">○ In Progress</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Merkle Verification:</span>
                        <span className="text-green-600 font-medium">✓ Enabled</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {features.length === 0 && (
            <Card className="border-2 border-dashed">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No features found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
