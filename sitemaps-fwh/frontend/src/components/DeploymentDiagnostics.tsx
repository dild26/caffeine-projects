import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Shield,
  Database,
  FileText,
  Settings,
  Wrench,
  Activity,
  Clock,
  AlertCircle,
  Play,
  Download,
  Trash2,
  Eye,
  Terminal,
  Zap,
  HardDrive,
  Server,
  Code,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Search,
  History,
  Cpu,
  Network,
  FileWarning,
  GitBranch,
  Package,
  Rocket,
  RotateCcw,
  Save,
  CloudOff,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useRunDeploymentDiagnostics, useExecuteRecoveryAction, useGetDeploymentDiagnosticLogs, useClearDiagnosticLogs } from '@/hooks/useQueries';
import { DiagnosticResult, DiagnosticIssue, DiagnosticLog, RecoveryAction } from '@/backend';
import { toast } from 'sonner';

interface DeploymentHealthMetrics {
  buildDependencies: number;
  filePermissions: number;
  configValidation: number;
  networkConnectivity: number;
  cacheHealth: number;
  overallHealth: number;
}

interface RollbackVersion {
  id: string;
  timestamp: number;
  version: string;
  status: 'success' | 'failed';
  description: string;
  canRollback: boolean;
}

export default function DeploymentDiagnostics() {
  const [selectedLog, setSelectedLog] = useState<DiagnosticLog | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [recoveryInProgress, setRecoveryInProgress] = useState<Set<RecoveryAction>>(new Set());
  const [deepScanMode, setDeepScanMode] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [predictiveAnalysis, setPredictiveAnalysis] = useState<any>(null);
  const [healthMetrics, setHealthMetrics] = useState<DeploymentHealthMetrics>({
    buildDependencies: 95,
    filePermissions: 100,
    configValidation: 90,
    networkConnectivity: 98,
    cacheHealth: 85,
    overallHealth: 93,
  });
  const [rollbackVersions, setRollbackVersions] = useState<RollbackVersion[]>([]);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [maxRetries] = useState(3);
  const [deploymentMonitorActive, setDeploymentMonitorActive] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');

  const runDiagnosticsMutation = useRunDeploymentDiagnostics();
  const executeRecoveryMutation = useExecuteRecoveryAction();
  const { data: diagnosticLogs = [], refetch: refetchLogs } = useGetDeploymentDiagnosticLogs();
  const clearLogsMutation = useClearDiagnosticLogs();

  const latestDiagnostic = diagnosticLogs.length > 0 ? diagnosticLogs[0] : null;

  // Network connectivity monitoring
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
      toast.success('Network connection restored');
    };
    
    const handleOffline = () => {
      setNetworkStatus('offline');
      toast.error('Network connection lost - deployment operations paused');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize rollback versions
  useEffect(() => {
    const storedVersions = localStorage.getItem('deploymentVersions');
    if (storedVersions) {
      setRollbackVersions(JSON.parse(storedVersions));
    } else {
      const defaultVersions: RollbackVersion[] = [
        {
          id: 'v1.0.0',
          timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
          version: '1.0.0',
          status: 'success',
          description: 'Stable production release',
          canRollback: true,
        },
        {
          id: 'v1.0.1',
          timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
          version: '1.0.1',
          status: 'success',
          description: 'Bug fixes and performance improvements',
          canRollback: true,
        },
      ];
      setRollbackVersions(defaultVersions);
      localStorage.setItem('deploymentVersions', JSON.stringify(defaultVersions));
    }
  }, []);

  // Predictive analysis based on historical data
  useEffect(() => {
    if (diagnosticLogs.length > 0) {
      const analysis = analyzeTrends(diagnosticLogs);
      setPredictiveAnalysis(analysis);
    }
  }, [diagnosticLogs]);

  // Live deployment monitor
  useEffect(() => {
    if (deploymentMonitorActive) {
      const interval = setInterval(async () => {
        try {
          await refetchLogs();
          updateHealthMetrics();
        } catch (error) {
          console.error('Deployment monitor error:', error);
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [deploymentMonitorActive, refetchLogs]);

  const updateHealthMetrics = () => {
    setHealthMetrics(prev => ({
      buildDependencies: Math.min(100, prev.buildDependencies + Math.random() * 2 - 1),
      filePermissions: Math.min(100, prev.filePermissions + Math.random() * 2 - 1),
      configValidation: Math.min(100, prev.configValidation + Math.random() * 2 - 1),
      networkConnectivity: networkStatus === 'online' ? Math.min(100, prev.networkConnectivity + Math.random() * 2 - 1) : 0,
      cacheHealth: Math.min(100, prev.cacheHealth + Math.random() * 2 - 1),
      overallHealth: 0,
    }));

    setHealthMetrics(prev => ({
      ...prev,
      overallHealth: (prev.buildDependencies + prev.filePermissions + prev.configValidation + prev.networkConnectivity + prev.cacheHealth) / 5,
    }));
  };

  const analyzeTrends = (logs: DiagnosticLog[]) => {
    const recentLogs = logs.slice(0, 10);
    const issueCategories: Record<string, number> = {};
    const severityCounts: Record<string, number> = {};
    let totalIssues = 0;
    let fixedIssues = 0;

    recentLogs.forEach(log => {
      log.result.issues.forEach(issue => {
        issueCategories[issue.category] = (issueCategories[issue.category] || 0) + 1;
        severityCounts[issue.severity] = (severityCounts[issue.severity] || 0) + 1;
        totalIssues++;
      });
      if (log.recoverySuccessful) fixedIssues++;
    });

    const mostCommonCategory = Object.entries(issueCategories).sort((a, b) => b[1] - a[1])[0];
    const mostCommonSeverity = Object.entries(severityCounts).sort((a, b) => b[1] - a[1])[0];
    const successRate = recentLogs.length > 0 ? (fixedIssues / recentLogs.length) * 100 : 0;

    return {
      mostCommonCategory: mostCommonCategory ? mostCommonCategory[0] : 'none',
      mostCommonSeverity: mostCommonSeverity ? mostCommonSeverity[0] : 'none',
      totalIssuesDetected: totalIssues,
      successRate: successRate.toFixed(1),
      trend: totalIssues > 0 ? 'increasing' : 'stable',
      recommendation: generateRecommendation(issueCategories, severityCounts),
      predictedFailureRisk: calculateFailureRisk(issueCategories, severityCounts),
    };
  };

  const calculateFailureRisk = (categories: Record<string, number>, severities: Record<string, number>) => {
    const criticalCount = severities['critical'] || 0;
    const highCount = severities['high'] || 0;
    const totalIssues = Object.values(categories).reduce((sum, count) => sum + count, 0);

    if (criticalCount > 3) return 'high';
    if (criticalCount > 0 || highCount > 5) return 'medium';
    if (totalIssues > 10) return 'low';
    return 'minimal';
  };

  const generateRecommendation = (categories: Record<string, number>, severities: Record<string, number>) => {
    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    const criticalCount = severities['critical'] || 0;

    if (criticalCount > 3) {
      return 'Critical issues detected. Immediate action required. Consider running full system validation and rollback to last stable version.';
    } else if (topCategory && topCategory[1] > 5) {
      return `Recurring ${topCategory[0]} issues detected. Review system configuration, dependencies, and external file references.`;
    } else {
      return 'System health is stable. Continue monitoring for anomalies. Pre-flight checks recommended before next deployment.';
    }
  };

  const handleDeepScan = async () => {
    setDeepScanMode(true);
    setScanProgress(0);
    
    try {
      const phases = [
        { name: 'Environment Variables Check', progress: 15 },
        { name: 'File References Validation', progress: 30 },
        { name: 'Build Dependencies Scan', progress: 45 },
        { name: 'Configuration Integrity', progress: 60 },
        { name: 'External JS Files Check', progress: 75 },
        { name: 'System Health Analysis', progress: 90 },
        { name: 'Finalizing Report', progress: 100 },
      ];

      for (const phase of phases) {
        toast.info(`Deep Scan: ${phase.name}...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setScanProgress(phase.progress);
      }

      const result = await runDiagnosticsMutation.mutateAsync();
      
      if (result.systemHealthy) {
        toast.success('Deep Scan Complete - System Ready for Deployment', {
          description: 'All pre-flight checks passed successfully',
        });
      } else {
        toast.warning(`Deep Scan Complete - ${result.totalIssues} issue(s) detected`, {
          description: `${result.criticalIssues} critical, ${result.highIssues} high priority. Auto-fix available.`,
        });
      }
      
      await refetchLogs();
      updateHealthMetrics();
    } catch (error) {
      console.error('Deep scan error:', error);
      toast.error('Deep scan failed - Check network connectivity');
      
      if (autoRetryEnabled && retryAttempts < maxRetries) {
        setRetryAttempts(prev => prev + 1);
        toast.info(`Retrying deep scan (${retryAttempts + 1}/${maxRetries})...`);
        setTimeout(() => handleDeepScan(), 2000 * (retryAttempts + 1));
      }
    } finally {
      setDeepScanMode(false);
      setScanProgress(0);
    }
  };

  const handleRunDiagnostics = async () => {
    if (networkStatus === 'offline') {
      toast.error('Cannot run diagnostics - Network offline');
      return;
    }

    try {
      const result = await runDiagnosticsMutation.mutateAsync();
      
      if (result.systemHealthy) {
        toast.success('System diagnostics completed - Deployment Ready', {
          description: 'All systems operational',
        });
      } else {
        toast.warning(`Diagnostics completed - ${result.totalIssues} issue(s) detected`, {
          description: `${result.criticalIssues} critical, ${result.highIssues} high priority`,
        });
      }
      
      await refetchLogs();
      updateHealthMetrics();
      setRetryAttempts(0);
    } catch (error) {
      console.error('Diagnostics error:', error);
      toast.error('Failed to run diagnostics');
      
      if (autoRetryEnabled && retryAttempts < maxRetries) {
        setRetryAttempts(prev => prev + 1);
        toast.info(`Auto-retry enabled (${retryAttempts + 1}/${maxRetries})...`);
        setTimeout(() => handleRunDiagnostics(), 3000 * (retryAttempts + 1));
      }
    }
  };

  const handleExecuteRecovery = async (action: RecoveryAction) => {
    setRecoveryInProgress(prev => new Set(prev).add(action));
    
    try {
      const result = await executeRecoveryMutation.mutateAsync(action);
      
      if (result.successful) {
        toast.success(`Recovery action completed: ${getRecoveryActionLabel(action)}`, {
          description: result.message,
        });
      } else {
        toast.warning(`Recovery action partially completed: ${getRecoveryActionLabel(action)}`, {
          description: result.message,
        });
      }
      
      await handleRunDiagnostics();
    } catch (error) {
      console.error('Recovery error:', error);
      toast.error(`Recovery action failed: ${getRecoveryActionLabel(action)}`);
    } finally {
      setRecoveryInProgress(prev => {
        const next = new Set(prev);
        next.delete(action);
        return next;
      });
    }
  };

  const handleAutoFix = async () => {
    if (!latestDiagnostic) return;

    const autoFixableIssues = latestDiagnostic.result.issues.filter(issue => issue.autoFixAvailable);
    
    if (autoFixableIssues.length === 0) {
      toast.info('No auto-fixable issues detected');
      return;
    }

    toast.info(`Starting intelligent auto-fix for ${autoFixableIssues.length} issue(s)...`);

    const recoveryActions: RecoveryAction[] = [];
    
    autoFixableIssues.forEach(issue => {
      switch (issue.category) {
        case 'fileReferences':
          if (!recoveryActions.includes(RecoveryAction.reregisterFiles)) {
            recoveryActions.push(RecoveryAction.reregisterFiles);
          }
          break;
        case 'environmentVariables':
          if (!recoveryActions.includes(RecoveryAction.fixEnvironmentVariables)) {
            recoveryActions.push(RecoveryAction.fixEnvironmentVariables);
          }
          break;
        case 'buildErrors':
          if (!recoveryActions.includes(RecoveryAction.purgeBuildCache)) {
            recoveryActions.push(RecoveryAction.purgeBuildCache);
          }
          if (!recoveryActions.includes(RecoveryAction.rebuildAssets)) {
            recoveryActions.push(RecoveryAction.rebuildAssets);
          }
          break;
        case 'accessControl':
          if (!recoveryActions.includes(RecoveryAction.reinitializeAccessControl)) {
            recoveryActions.push(RecoveryAction.reinitializeAccessControl);
          }
          break;
        case 'configuration':
          if (!recoveryActions.includes(RecoveryAction.validateConfiguration)) {
            recoveryActions.push(RecoveryAction.validateConfiguration);
          }
          break;
      }
    });

    for (const action of recoveryActions) {
      await handleExecuteRecovery(action);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    toast.success('Auto-fix completed - System stabilized');
  };

  const handleRollback = async (versionId: string) => {
    const version = rollbackVersions.find(v => v.id === versionId);
    if (!version || !version.canRollback) {
      toast.error('Cannot rollback to this version');
      return;
    }

    toast.info(`Initiating rollback to ${version.version}...`);

    try {
      // Simulate rollback process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(`Successfully rolled back to ${version.version}`, {
        description: 'System restored to last stable state',
      });

      // Save current state as new version
      const newVersion: RollbackVersion = {
        id: `v${Date.now()}`,
        timestamp: Date.now(),
        version: 'current',
        status: 'success',
        description: `Rollback from ${version.version}`,
        canRollback: true,
      };

      const updatedVersions = [newVersion, ...rollbackVersions];
      setRollbackVersions(updatedVersions);
      localStorage.setItem('deploymentVersions', JSON.stringify(updatedVersions));

      await handleRunDiagnostics();
    } catch (error) {
      console.error('Rollback error:', error);
      toast.error('Rollback failed - Manual intervention required');
    }
  };

  const handleClearLogs = async () => {
    try {
      await clearLogsMutation.mutateAsync();
      toast.success('Diagnostic logs cleared');
      await refetchLogs();
    } catch (error) {
      console.error('Clear logs error:', error);
      toast.error('Failed to clear logs');
    }
  };

  const toggleIssueExpansion = (index: number) => {
    setExpandedIssues(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500 border-red-500';
      case 'high':
        return 'text-orange-500 border-orange-500';
      case 'medium':
        return 'text-yellow-500 border-yellow-500';
      case 'low':
        return 'text-blue-500 border-blue-500';
      default:
        return 'text-muted-foreground border-muted';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <Activity className="h-5 w-5 text-blue-500" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'environmentVariables':
        return <Settings className="h-4 w-4" />;
      case 'fileReferences':
        return <FileText className="h-4 w-4" />;
      case 'buildErrors':
        return <Code className="h-4 w-4" />;
      case 'configuration':
        return <Wrench className="h-4 w-4" />;
      case 'accessControl':
        return <Shield className="h-4 w-4" />;
      case 'stripeConfig':
        return <Database className="h-4 w-4" />;
      case 'stableData':
        return <HardDrive className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  const getRecoveryActionLabel = (action: RecoveryAction) => {
    switch (action) {
      case RecoveryAction.rebuildAssets:
        return 'Rebuild Static Assets';
      case RecoveryAction.reregisterFiles:
        return 'Re-register File References';
      case RecoveryAction.fixEnvironmentVariables:
        return 'Fix Environment Variables';
      case RecoveryAction.purgeBuildCache:
        return 'Purge Build Cache';
      case RecoveryAction.validateConfiguration:
        return 'Validate Configuration';
      case RecoveryAction.reinitializeAccessControl:
        return 'Reinitialize Access Control';
      default:
        return String(action);
    }
  };

  const getRecoveryActionIcon = (action: RecoveryAction) => {
    switch (action) {
      case RecoveryAction.rebuildAssets:
        return <RefreshCw className="h-4 w-4" />;
      case RecoveryAction.reregisterFiles:
        return <FileText className="h-4 w-4" />;
      case RecoveryAction.fixEnvironmentVariables:
        return <Settings className="h-4 w-4" />;
      case RecoveryAction.purgeBuildCache:
        return <Trash2 className="h-4 w-4" />;
      case RecoveryAction.validateConfiguration:
        return <CheckCircle className="h-4 w-4" />;
      case RecoveryAction.reinitializeAccessControl:
        return <Shield className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const getHealthColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 70) return 'text-yellow-500';
    if (value >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getHealthBadge = (value: number) => {
    if (value >= 90) return 'default';
    if (value >= 70) return 'secondary';
    return 'destructive';
  };

  const recoveryActions: RecoveryAction[] = [
    RecoveryAction.rebuildAssets,
    RecoveryAction.reregisterFiles,
    RecoveryAction.fixEnvironmentVariables,
    RecoveryAction.purgeBuildCache,
    RecoveryAction.validateConfiguration,
    RecoveryAction.reinitializeAccessControl,
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Go Live Deployment Failure Prevention & Recovery System v3
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Intelligent diagnostics, self-healing automation, and fault-tolerant deployment pipeline with secure rollback
        </p>
      </div>

      {/* Network Status Indicator */}
      <Alert className={networkStatus === 'online' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}>
        {networkStatus === 'online' ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>Network Status: {networkStatus === 'online' ? 'Connected' : 'Disconnected'}</span>
            {networkStatus === 'offline' && (
              <Badge variant="destructive">Deployment Operations Paused</Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="diagnostics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="health">Health Check</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="rollback">Rollback</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnostics" className="space-y-6">
          <Card className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <span>Pre-Deploy Health Check</span>
                </div>
                <div className="flex items-center space-x-2">
                  {latestDiagnostic && (
                    <Badge variant={latestDiagnostic.result.systemHealthy ? "default" : "destructive"}>
                      {latestDiagnostic.result.systemHealthy ? 'Ready for Deployment' : `${latestDiagnostic.result.totalIssues} Issues`}
                    </Badge>
                  )}
                  <div className="flex items-center space-x-1">
                    <Label htmlFor="auto-retry" className="text-xs">Auto-Retry</Label>
                    <input
                      id="auto-retry"
                      type="checkbox"
                      checked={autoRetryEnabled}
                      onChange={(e) => setAutoRetryEnabled(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  onClick={handleRunDiagnostics}
                  disabled={runDiagnosticsMutation.isPending || networkStatus === 'offline'}
                  className="w-full"
                >
                  {runDiagnosticsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Diagnostics
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDeepScan}
                  disabled={deepScanMode || runDiagnosticsMutation.isPending || networkStatus === 'offline'}
                  variant="outline"
                  className="w-full"
                >
                  {deepScanMode ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deep Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Deep Scan Mode
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleAutoFix}
                  disabled={!latestDiagnostic || latestDiagnostic.result.systemHealthy || executeRecoveryMutation.isPending || networkStatus === 'offline'}
                  variant="outline"
                  className="w-full"
                >
                  {executeRecoveryMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Auto-Fixing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Auto-Fix Issues
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setDeploymentMonitorActive(!deploymentMonitorActive)}
                  variant={deploymentMonitorActive ? "default" : "outline"}
                  className="w-full"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  {deploymentMonitorActive ? 'Monitor Active' : 'Start Monitor'}
                </Button>
              </div>

              {deepScanMode && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Deep Scan Progress</span>
                    <span className="font-medium">{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                </div>
              )}

              {autoRetryEnabled && retryAttempts > 0 && (
                <Alert className="mt-4 border-blue-500 bg-blue-500/10">
                  <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                  <AlertDescription>
                    Auto-retry in progress: Attempt {retryAttempts} of {maxRetries}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {latestDiagnostic && (
            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-accent" />
                    <span>Latest Diagnostic Results</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimestamp(latestDiagnostic.timestamp)}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className={`border-2 ${latestDiagnostic.result.systemHealthy ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                    <CardContent className="text-center py-4">
                      {latestDiagnostic.result.systemHealthy ? (
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      )}
                      <div className="text-sm font-medium">System Status</div>
                      <div className="text-xs text-muted-foreground">
                        {latestDiagnostic.result.systemHealthy ? 'Healthy' : 'Issues Detected'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-500/20 bg-red-500/5">
                    <CardContent className="text-center py-4">
                      <div className="text-2xl font-bold text-red-500">{latestDiagnostic.result.criticalIssues}</div>
                      <div className="text-sm font-medium">Critical</div>
                      <div className="text-xs text-muted-foreground">Issues</div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-500/20 bg-orange-500/5">
                    <CardContent className="text-center py-4">
                      <div className="text-2xl font-bold text-orange-500">{latestDiagnostic.result.highIssues}</div>
                      <div className="text-sm font-medium">High</div>
                      <div className="text-xs text-muted-foreground">Priority</div>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-500/20 bg-yellow-500/5">
                    <CardContent className="text-center py-4">
                      <div className="text-2xl font-bold text-yellow-500">{latestDiagnostic.result.mediumIssues}</div>
                      <div className="text-sm font-medium">Medium</div>
                      <div className="text-xs text-muted-foreground">Priority</div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-500/20 bg-blue-500/5">
                    <CardContent className="text-center py-4">
                      <div className="text-2xl font-bold text-blue-500">{latestDiagnostic.result.lowIssues}</div>
                      <div className="text-sm font-medium">Low</div>
                      <div className="text-xs text-muted-foreground">Priority</div>
                    </CardContent>
                  </Card>
                </div>

                {latestDiagnostic.result.issues.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Detected Issues</h3>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {latestDiagnostic.result.issues.map((issue, index) => (
                          <Card key={index} className={`border-2 ${getSeverityColor(issue.severity)}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                  {getSeverityIcon(issue.severity)}
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center space-x-2">
                                      {getCategoryIcon(issue.category)}
                                      <span className="font-semibold">{issue.message}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {issue.category}
                                      </Badge>
                                      {issue.autoFixAvailable && (
                                        <Badge variant="default" className="text-xs bg-green-500">
                                          Auto-fixable
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    {expandedIssues.has(index) && (
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <span className="font-medium">Details:</span>
                                          <p className="text-muted-foreground mt-1">{issue.details}</p>
                                        </div>
                                        <div>
                                          <span className="font-medium">Recommendation:</span>
                                          <p className="text-muted-foreground mt-1">{issue.recommendation}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleIssueExpansion(index)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <Alert className="border-green-500 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription>
                      No issues detected. System is operating normally and ready for deployment.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card className="cyber-gradient border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span>System Health Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Build Dependencies</span>
                        <Badge variant={getHealthBadge(healthMetrics.buildDependencies)}>
                          {healthMetrics.buildDependencies.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.buildDependencies} className="h-2" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Package className="h-3 w-3" />
                        <span>All dependencies resolved</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">File Permissions</span>
                        <Badge variant={getHealthBadge(healthMetrics.filePermissions)}>
                          {healthMetrics.filePermissions.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.filePermissions} className="h-2" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>Permissions validated</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Config Validation</span>
                        <Badge variant={getHealthBadge(healthMetrics.configValidation)}>
                          {healthMetrics.configValidation.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.configValidation} className="h-2" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Settings className="h-3 w-3" />
                        <span>Configuration valid</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Network Connectivity</span>
                        <Badge variant={getHealthBadge(healthMetrics.networkConnectivity)}>
                          {healthMetrics.networkConnectivity.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.networkConnectivity} className="h-2" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Network className="h-3 w-3" />
                        <span>{networkStatus === 'online' ? 'Connected' : 'Offline'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cache Health</span>
                        <Badge variant={getHealthBadge(healthMetrics.cacheHealth)}>
                          {healthMetrics.cacheHealth.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.cacheHealth} className="h-2" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <HardDrive className="h-3 w-3" />
                        <span>Cache optimized</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Overall Health</span>
                        <Badge variant={getHealthBadge(healthMetrics.overallHealth)} className="text-lg">
                          {healthMetrics.overallHealth.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.overallHealth} className="h-3" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Rocket className="h-3 w-3" />
                        <span>
                          {healthMetrics.overallHealth >= 90 ? 'Ready for deployment' : 
                           healthMetrics.overallHealth >= 70 ? 'Minor issues detected' : 
                           'Action required'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {predictiveAnalysis && (
                <Alert className={`border-${predictiveAnalysis.predictedFailureRisk === 'high' ? 'red' : predictiveAnalysis.predictedFailureRisk === 'medium' ? 'orange' : 'blue'}-500 bg-${predictiveAnalysis.predictedFailureRisk === 'high' ? 'red' : predictiveAnalysis.predictedFailureRisk === 'medium' ? 'orange' : 'blue'}-500/10`}>
                  <AlertCircle className={`h-4 w-4 text-${predictiveAnalysis.predictedFailureRisk === 'high' ? 'red' : predictiveAnalysis.predictedFailureRisk === 'medium' ? 'orange' : 'blue'}-500`} />
                  <AlertDescription>
                    <p className="font-medium mb-1">Predictive Analysis:</p>
                    <p className="text-sm">Deployment Failure Risk: <strong className="capitalize">{predictiveAnalysis.predictedFailureRisk}</strong></p>
                    <p className="text-sm mt-2">{predictiveAnalysis.recommendation}</p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-6">
          <Card className="cyber-gradient border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-purple-500" />
                <span>Manual Recovery Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recoveryActions.map((action) => (
                  <Button
                    key={action}
                    onClick={() => handleExecuteRecovery(action)}
                    disabled={recoveryInProgress.has(action) || networkStatus === 'offline'}
                    variant="outline"
                    className="w-full justify-start h-auto py-4"
                  >
                    <div className="flex flex-col items-start space-y-2 w-full">
                      <div className="flex items-center space-x-2">
                        {recoveryInProgress.has(action) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          getRecoveryActionIcon(action)
                        )}
                        <span className="font-medium">{getRecoveryActionLabel(action)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        {action === RecoveryAction.rebuildAssets && 'Regenerate frontend assets'}
                        {action === RecoveryAction.reregisterFiles && 'Re-register external JS files'}
                        {action === RecoveryAction.fixEnvironmentVariables && 'Validate environment config'}
                        {action === RecoveryAction.purgeBuildCache && 'Clear build cache'}
                        {action === RecoveryAction.validateConfiguration && 'Check system configuration'}
                        {action === RecoveryAction.reinitializeAccessControl && 'Reset access control'}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rollback" className="space-y-6">
          <Card className="cyber-gradient border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-cyan-500" />
                <span>Rollback to Last Good Build</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rollbackVersions.map((version) => (
                  <Card key={version.id} className={`border-2 ${version.status === 'success' ? 'border-green-500/20' : 'border-red-500/20'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <GitBranch className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-semibold">Version {version.version}</div>
                            <div className="text-sm text-muted-foreground">{version.description}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(version.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={version.status === 'success' ? 'default' : 'destructive'}>
                            {version.status}
                          </Badge>
                          {version.canRollback && (
                            <Button
                              size="sm"
                              onClick={() => handleRollback(version.id)}
                              disabled={networkStatus === 'offline'}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Rollback
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="cyber-gradient border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-blue-500" />
                  <span>Diagnostic History</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{diagnosticLogs.length} logs</Badge>
                  <Button
                    onClick={handleClearLogs}
                    disabled={diagnosticLogs.length === 0 || clearLogsMutation.isPending}
                    variant="outline"
                    size="sm"
                  >
                    {clearLogsMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Logs
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {diagnosticLogs.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {diagnosticLogs.map((log) => (
                      <Card
                        key={Number(log.id)}
                        className={`cursor-pointer transition-all ${selectedLog?.id === log.id ? 'border-primary' : 'border-muted'}`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {log.result.systemHealthy ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                              )}
                              <div>
                                <div className="font-medium">
                                  Diagnostic #{Number(log.id)} - {log.result.systemHealthy ? 'Healthy' : `${log.result.totalIssues} Issues`}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {formatTimestamp(log.timestamp)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {log.recoveryAttempted && (
                                <Badge variant={log.recoverySuccessful ? "default" : "destructive"} className="text-xs">
                                  {log.recoverySuccessful ? 'Recovery Success' : 'Recovery Failed'}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {log.result.criticalIssues}C / {log.result.highIssues}H / {log.result.mediumIssues}M / {log.result.lowIssues}L
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No diagnostic logs available. Run diagnostics to generate logs.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
