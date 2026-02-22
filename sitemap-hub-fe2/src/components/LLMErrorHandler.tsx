import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Brain,
  Zap,
  Activity,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Terminal,
  Cpu,
  Database,
  FileWarning,
  Shield,
  Eye,
  Download,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Save,
  Settings,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

interface LLMError {
  id: string;
  timestamp: number;
  type: 'prompt_overflow' | 'memory_overflow' | 'context_limit' | 'timeout' | 'rate_limit' | 'unknown';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  details: string;
  stackTrace?: string;
  context: {
    promptLength?: number;
    memoryUsage?: number;
    contextTokens?: number;
    requestId?: string;
  };
  recoveryAttempted: boolean;
  recoverySuccessful: boolean;
  recoveryActions: string[];
}

interface LLMHealthMetrics {
  promptSizeHealth: number;
  memoryHealth: number;
  contextHealth: number;
  responseTimeHealth: number;
  errorRateHealth: number;
  overallHealth: number;
}

interface RecoveryStrategy {
  id: string;
  name: string;
  description: string;
  priority: number;
  autoExecute: boolean;
  estimatedTime: number;
}

export default function LLMErrorHandler() {
  const [errors, setErrors] = useState<LLMError[]>([]);
  const [selectedError, setSelectedError] = useState<LLMError | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoRecoveryEnabled, setAutoRecoveryEnabled] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState<LLMHealthMetrics>({
    promptSizeHealth: 95,
    memoryHealth: 90,
    contextHealth: 85,
    responseTimeHealth: 92,
    errorRateHealth: 98,
    overallHealth: 92,
  });
  const [recoveryInProgress, setRecoveryInProgress] = useState(false);
  const [recoveryProgress, setRecoveryProgress] = useState(0);
  const [predictiveAnalysis, setPredictiveAnalysis] = useState<any>(null);

  const recoveryStrategies: RecoveryStrategy[] = [
    {
      id: 'chunk_prompt',
      name: 'Chunk Large Prompts',
      description: 'Split oversized prompts into smaller, manageable chunks',
      priority: 1,
      autoExecute: true,
      estimatedTime: 2000,
    },
    {
      id: 'clear_context',
      name: 'Clear Context Buffer',
      description: 'Reset conversation context to free memory',
      priority: 2,
      autoExecute: true,
      estimatedTime: 1000,
    },
    {
      id: 'reduce_tokens',
      name: 'Reduce Token Count',
      description: 'Optimize prompt to use fewer tokens',
      priority: 3,
      autoExecute: true,
      estimatedTime: 3000,
    },
    {
      id: 'retry_exponential',
      name: 'Exponential Backoff Retry',
      description: 'Retry with increasing delays',
      priority: 4,
      autoExecute: true,
      estimatedTime: 5000,
    },
    {
      id: 'fallback_model',
      name: 'Fallback to Smaller Model',
      description: 'Switch to a model with lower resource requirements',
      priority: 5,
      autoExecute: false,
      estimatedTime: 2000,
    },
    {
      id: 'cache_clear',
      name: 'Clear Response Cache',
      description: 'Clear cached responses to free memory',
      priority: 6,
      autoExecute: true,
      estimatedTime: 1500,
    },
  ];

  // Monitor for LLM errors
  useEffect(() => {
    if (!isMonitoring) return;

    const monitorInterval = setInterval(() => {
      detectLLMErrors();
      updateHealthMetrics();
    }, 5000);

    return () => clearInterval(monitorInterval);
  }, [isMonitoring]);

  // Predictive analysis
  useEffect(() => {
    if (errors.length > 0) {
      const analysis = analyzeTrends();
      setPredictiveAnalysis(analysis);
    }
  }, [errors]);

  const detectLLMErrors = () => {
    // Simulate error detection - in production, this would integrate with actual LLM monitoring
    const errorTypes: LLMError['type'][] = ['prompt_overflow', 'memory_overflow', 'context_limit', 'timeout', 'rate_limit'];
    const severities: LLMError['severity'][] = ['critical', 'high', 'medium', 'low'];

    // Random error generation for demonstration
    if (Math.random() < 0.1) {
      const newError: LLMError = {
        id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        type: errorTypes[Math.floor(Math.random() * errorTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        message: generateErrorMessage(),
        details: generateErrorDetails(),
        stackTrace: generateStackTrace(),
        context: {
          promptLength: Math.floor(Math.random() * 10000) + 5000,
          memoryUsage: Math.floor(Math.random() * 100),
          contextTokens: Math.floor(Math.random() * 8000) + 2000,
          requestId: `req_${Math.random().toString(36).substr(2, 12)}`,
        },
        recoveryAttempted: false,
        recoverySuccessful: false,
        recoveryActions: [],
      };

      setErrors(prev => [newError, ...prev].slice(0, 100));

      if (autoRecoveryEnabled && newError.severity !== 'low') {
        handleAutoRecovery(newError);
      }
    }
  };

  const generateErrorMessage = (): string => {
    const messages = [
      'Prompt size exceeds maximum token limit',
      'Memory allocation failed during context processing',
      'Context window overflow detected',
      'Request timeout due to excessive processing time',
      'Rate limit exceeded for API calls',
      'Token budget exhausted mid-generation',
      'Context buffer overflow during conversation',
      'Prompt complexity exceeds model capacity',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const generateErrorDetails = (): string => {
    const details = [
      'The input prompt contains too many tokens for the current model configuration. Consider chunking the input or using a model with a larger context window.',
      'Memory usage has exceeded safe thresholds. Clear conversation history or reduce concurrent requests.',
      'The conversation context has grown beyond the model\'s maximum token limit. Reset the context or summarize previous exchanges.',
      'Request processing time exceeded the configured timeout. Optimize prompt complexity or increase timeout limits.',
      'API rate limits have been reached. Implement exponential backoff or request quota increase.',
      'Token generation was interrupted due to budget constraints. Increase token allocation or optimize prompt efficiency.',
    ];
    return details[Math.floor(Math.random() * details.length)];
  };

  const generateStackTrace = (): string => {
    return `Error: LLM Processing Failed
    at processPrompt (llm-handler.ts:142)
    at handleRequest (api-router.ts:89)
    at middleware (auth-middleware.ts:56)
    at Server.handle (server.ts:234)`;
  };

  const updateHealthMetrics = () => {
    setHealthMetrics(prev => ({
      promptSizeHealth: Math.max(0, Math.min(100, prev.promptSizeHealth + (Math.random() * 4 - 2))),
      memoryHealth: Math.max(0, Math.min(100, prev.memoryHealth + (Math.random() * 4 - 2))),
      contextHealth: Math.max(0, Math.min(100, prev.contextHealth + (Math.random() * 4 - 2))),
      responseTimeHealth: Math.max(0, Math.min(100, prev.responseTimeHealth + (Math.random() * 4 - 2))),
      errorRateHealth: Math.max(0, Math.min(100, prev.errorRateHealth + (Math.random() * 4 - 2))),
      overallHealth: 0,
    }));

    setHealthMetrics(prev => ({
      ...prev,
      overallHealth: (prev.promptSizeHealth + prev.memoryHealth + prev.contextHealth + prev.responseTimeHealth + prev.errorRateHealth) / 5,
    }));
  };

  const analyzeTrends = () => {
    const recentErrors = errors.slice(0, 20);
    const errorTypes: Record<string, number> = {};
    const severityCounts: Record<string, number> = {};
    let totalRecoveryAttempts = 0;
    let successfulRecoveries = 0;

    recentErrors.forEach(error => {
      errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
      severityCounts[error.severity] = (severityCounts[error.severity] || 0) + 1;
      if (error.recoveryAttempted) totalRecoveryAttempts++;
      if (error.recoverySuccessful) successfulRecoveries++;
    });

    const mostCommonType = Object.entries(errorTypes).sort((a, b) => b[1] - a[1])[0];
    const mostCommonSeverity = Object.entries(severityCounts).sort((a, b) => b[1] - a[1])[0];
    const recoverySuccessRate = totalRecoveryAttempts > 0 ? (successfulRecoveries / totalRecoveryAttempts) * 100 : 0;

    return {
      mostCommonType: mostCommonType ? mostCommonType[0] : 'none',
      mostCommonSeverity: mostCommonSeverity ? mostCommonSeverity[0] : 'none',
      totalErrors: recentErrors.length,
      recoverySuccessRate: recoverySuccessRate.toFixed(1),
      trend: recentErrors.length > 10 ? 'increasing' : 'stable',
      recommendation: generateRecommendation(errorTypes, severityCounts),
      predictedFailureRisk: calculateFailureRisk(errorTypes, severityCounts),
    };
  };

  const calculateFailureRisk = (types: Record<string, number>, severities: Record<string, number>): string => {
    const criticalCount = severities['critical'] || 0;
    const highCount = severities['high'] || 0;
    const totalErrors = Object.values(types).reduce((sum, count) => sum + count, 0);

    if (criticalCount > 5) return 'critical';
    if (criticalCount > 2 || highCount > 8) return 'high';
    if (totalErrors > 15) return 'medium';
    return 'low';
  };

  const generateRecommendation = (types: Record<string, number>, severities: Record<string, number>): string => {
    const criticalCount = severities['critical'] || 0;
    const promptOverflow = types['prompt_overflow'] || 0;
    const memoryOverflow = types['memory_overflow'] || 0;

    if (criticalCount > 5) {
      return 'Critical LLM errors detected. Immediate action required: Enable all auto-recovery strategies and consider scaling infrastructure.';
    } else if (promptOverflow > 5) {
      return 'Recurring prompt overflow issues. Implement prompt chunking and token optimization strategies.';
    } else if (memoryOverflow > 5) {
      return 'Memory overflow pattern detected. Clear context buffers more frequently and optimize conversation history.';
    } else {
      return 'LLM system is stable. Continue monitoring for anomalies and maintain current recovery strategies.';
    }
  };

  const handleAutoRecovery = async (error: LLMError) => {
    setRecoveryInProgress(true);
    setRecoveryProgress(0);

    const applicableStrategies = recoveryStrategies
      .filter(s => s.autoExecute)
      .sort((a, b) => a.priority - b.priority);

    const recoveryActions: string[] = [];

    for (let i = 0; i < applicableStrategies.length; i++) {
      const strategy = applicableStrategies[i];
      
      toast.info(`Executing recovery: ${strategy.name}`, {
        description: strategy.description,
      });

      await new Promise(resolve => setTimeout(resolve, strategy.estimatedTime));
      
      recoveryActions.push(strategy.name);
      setRecoveryProgress(((i + 1) / applicableStrategies.length) * 100);
    }

    const recoverySuccessful = Math.random() > 0.3;

    setErrors(prev => prev.map(e => 
      e.id === error.id 
        ? { ...e, recoveryAttempted: true, recoverySuccessful, recoveryActions }
        : e
    ));

    setRecoveryInProgress(false);
    setRecoveryProgress(0);

    if (recoverySuccessful) {
      toast.success('Auto-recovery completed successfully', {
        description: `Applied ${recoveryActions.length} recovery strategies`,
      });
    } else {
      toast.warning('Auto-recovery partially successful', {
        description: 'Manual intervention may be required',
      });
    }
  };

  const handleManualRecovery = async (errorId: string, strategyId: string) => {
    const strategy = recoveryStrategies.find(s => s.id === strategyId);
    if (!strategy) return;

    setRecoveryInProgress(true);
    
    toast.info(`Executing: ${strategy.name}`, {
      description: strategy.description,
    });

    await new Promise(resolve => setTimeout(resolve, strategy.estimatedTime));

    const recoverySuccessful = Math.random() > 0.2;

    setErrors(prev => prev.map(e => 
      e.id === errorId 
        ? { 
            ...e, 
            recoveryAttempted: true, 
            recoverySuccessful,
            recoveryActions: [...e.recoveryActions, strategy.name]
          }
        : e
    ));

    setRecoveryInProgress(false);

    if (recoverySuccessful) {
      toast.success(`Recovery strategy "${strategy.name}" completed successfully`);
    } else {
      toast.error(`Recovery strategy "${strategy.name}" failed`);
    }
  };

  const handleClearErrors = () => {
    setErrors([]);
    setSelectedError(null);
    toast.success('Error log cleared');
  };

  const handleExportErrors = () => {
    const dataStr = JSON.stringify(errors, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `llm-errors-${Date.now()}.json`;
    link.click();
    toast.success('Error log exported');
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

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          LLM Error Handler & Recovery System
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Intelligent error detection, automatic recovery, and predictive failure prevention for LLM operations
        </p>
      </div>

      <Tabs defaultValue="monitor" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
          <TabsTrigger value="health">Health Metrics</TabsTrigger>
          <TabsTrigger value="recovery">Recovery Strategies</TabsTrigger>
          <TabsTrigger value="history">Error History</TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="space-y-6">
          <Card className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>LLM Error Monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={isMonitoring ? "default" : "secondary"}>
                    {isMonitoring ? 'Active' : 'Paused'}
                  </Badge>
                  <Badge variant={autoRecoveryEnabled ? "default" : "secondary"}>
                    Auto-Recovery: {autoRecoveryEnabled ? 'ON' : 'OFF'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  variant={isMonitoring ? "default" : "outline"}
                  className="w-full"
                >
                  {isMonitoring ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Monitor
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Monitor
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setAutoRecoveryEnabled(!autoRecoveryEnabled)}
                  variant={autoRecoveryEnabled ? "default" : "outline"}
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {autoRecoveryEnabled ? 'Disable' : 'Enable'} Auto-Recovery
                </Button>

                <Button
                  onClick={handleExportErrors}
                  disabled={errors.length === 0}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Errors
                </Button>

                <Button
                  onClick={handleClearErrors}
                  disabled={errors.length === 0}
                  variant="outline"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Log
                </Button>
              </div>

              {recoveryInProgress && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Recovery in Progress</span>
                    <span className="font-medium">{recoveryProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={recoveryProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {predictiveAnalysis && (
            <Alert className={`border-${predictiveAnalysis.predictedFailureRisk === 'critical' ? 'red' : predictiveAnalysis.predictedFailureRisk === 'high' ? 'orange' : predictiveAnalysis.predictedFailureRisk === 'medium' ? 'yellow' : 'blue'}-500 bg-${predictiveAnalysis.predictedFailureRisk === 'critical' ? 'red' : predictiveAnalysis.predictedFailureRisk === 'high' ? 'orange' : predictiveAnalysis.predictedFailureRisk === 'medium' ? 'yellow' : 'blue'}-500/10`}>
              <AlertCircle className={`h-4 w-4 text-${predictiveAnalysis.predictedFailureRisk === 'critical' ? 'red' : predictiveAnalysis.predictedFailureRisk === 'high' ? 'orange' : predictiveAnalysis.predictedFailureRisk === 'medium' ? 'yellow' : 'blue'}-500`} />
              <AlertDescription>
                <p className="font-medium mb-1">Predictive Analysis:</p>
                <p className="text-sm">Failure Risk: <strong className="capitalize">{predictiveAnalysis.predictedFailureRisk}</strong></p>
                <p className="text-sm">Most Common Error: <strong>{predictiveAnalysis.mostCommonType}</strong></p>
                <p className="text-sm">Recovery Success Rate: <strong>{predictiveAnalysis.recoverySuccessRate}%</strong></p>
                <p className="text-sm mt-2">{predictiveAnalysis.recommendation}</p>
              </AlertDescription>
            </Alert>
          )}

          {errors.length > 0 ? (
            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-accent" />
                    <span>Recent Errors ({errors.length})</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {errors.map((error) => (
                      <Card key={error.id} className={`border-2 ${getSeverityColor(error.severity)}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              {getSeverityIcon(error.severity)}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">{error.message}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {error.type}
                                  </Badge>
                                  {error.recoveryAttempted && (
                                    <Badge variant={error.recoverySuccessful ? "default" : "destructive"} className="text-xs">
                                      {error.recoverySuccessful ? 'Recovered' : 'Recovery Failed'}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="text-sm text-muted-foreground">
                                  {error.details}
                                </div>

                                {error.context && (
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                    {error.context.promptLength && (
                                      <div className="flex items-center gap-1">
                                        <Terminal className="h-3 w-3" />
                                        <span>Prompt: {error.context.promptLength} tokens</span>
                                      </div>
                                    )}
                                    {error.context.memoryUsage && (
                                      <div className="flex items-center gap-1">
                                        <Database className="h-3 w-3" />
                                        <span>Memory: {error.context.memoryUsage}%</span>
                                      </div>
                                    )}
                                    {error.context.contextTokens && (
                                      <div className="flex items-center gap-1">
                                        <Cpu className="h-3 w-3" />
                                        <span>Context: {error.context.contextTokens} tokens</span>
                                      </div>
                                    )}
                                    {error.context.requestId && (
                                      <div className="flex items-center gap-1">
                                        <FileWarning className="h-3 w-3" />
                                        <span>ID: {error.context.requestId.slice(0, 8)}</span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {error.recoveryActions.length > 0 && (
                                  <div className="text-xs">
                                    <span className="font-medium">Recovery Actions:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {error.recoveryActions.map((action, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {action}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{formatTimestamp(error.timestamp)}</span>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setSelectedError(error)}
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      Details
                                    </Button>
                                    {!error.recoveryAttempted && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAutoRecovery(error)}
                                        disabled={recoveryInProgress}
                                      >
                                        <RotateCcw className="h-3 w-3 mr-1" />
                                        Recover
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                No LLM errors detected. System is operating normally.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card className="cyber-gradient border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span>LLM Health Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Prompt Size Health</span>
                        <Badge variant={getHealthBadge(healthMetrics.promptSizeHealth)}>
                          {healthMetrics.promptSizeHealth.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.promptSizeHealth} className="h-2" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Terminal className="h-3 w-3" />
                        <span>Prompt optimization active</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Memory Health</span>
                        <Badge variant={getHealthBadge(healthMetrics.memoryHealth)}>
                          {healthMetrics.memoryHealth.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.memoryHealth} className="h-2" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Database className="h-3 w-3" />
                        <span>Memory within limits</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Context Health</span>
                        <Badge variant={getHealthBadge(healthMetrics.contextHealth)}>
                          {healthMetrics.contextHealth.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.contextHealth} className="h-2" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Cpu className="h-3 w-3" />
                        <span>Context buffer healthy</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Response Time Health</span>
                        <Badge variant={getHealthBadge(healthMetrics.responseTimeHealth)}>
                          {healthMetrics.responseTimeHealth.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.responseTimeHealth} className="h-2" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Response times optimal</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Error Rate Health</span>
                        <Badge variant={getHealthBadge(healthMetrics.errorRateHealth)}>
                          {healthMetrics.errorRateHealth.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={healthMetrics.errorRateHealth} className="h-2" />
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3" />
                        <span>Error rate minimal</span>
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
                        <Brain className="h-3 w-3" />
                        <span>
                          {healthMetrics.overallHealth >= 90 ? 'System optimal' : 
                           healthMetrics.overallHealth >= 70 ? 'Minor issues detected' : 
                           'Action required'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-6">
          <Card className="cyber-gradient border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-cyan-500" />
                <span>Recovery Strategies</span>
              </CardTitle>
              <CardDescription>
                Automated and manual recovery strategies for LLM errors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recoveryStrategies.map((strategy) => (
                  <Card key={strategy.id} className="border-muted">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Priority {strategy.priority}</Badge>
                            {strategy.autoExecute && (
                              <Badge variant="default" className="text-xs">Auto</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ~{strategy.estimatedTime / 1000}s
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{strategy.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {strategy.description}
                          </p>
                        </div>
                        {selectedError && !selectedError.recoveryAttempted && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleManualRecovery(selectedError.id, strategy.id)}
                            disabled={recoveryInProgress}
                          >
                            <Play className="h-3 w-3 mr-2" />
                            Execute Strategy
                          </Button>
                        )}
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
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Error History</span>
                </div>
                <Badge variant="secondary">{errors.length} total errors</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {errors.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {errors.map((error) => (
                      <Card
                        key={error.id}
                        className={`cursor-pointer transition-all ${selectedError?.id === error.id ? 'border-primary' : 'border-muted'}`}
                        onClick={() => setSelectedError(error)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getSeverityIcon(error.severity)}
                              <div>
                                <div className="font-medium">{error.type}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatTimestamp(error.timestamp)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {error.recoveryAttempted && (
                                <Badge variant={error.recoverySuccessful ? "default" : "destructive"} className="text-xs">
                                  {error.recoverySuccessful ? 'Recovered' : 'Failed'}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {error.severity}
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
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No error history available. Errors will appear here as they are detected.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Error Details Modal */}
      {selectedError && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getSeverityIcon(selectedError.severity)}
                  Error Details
                </CardTitle>
                <CardDescription>
                  {selectedError.type} - {formatTimestamp(selectedError.timestamp)}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedError(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <Label className="text-sm font-medium">Error Message</Label>
                <p className="text-sm mt-1">{selectedError.message}</p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Details</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedError.details}</p>
              </div>

              {selectedError.context && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">Context Information</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      {selectedError.context.promptLength && (
                        <div>
                          <span className="text-muted-foreground">Prompt Length:</span>
                          <span className="ml-2 font-medium">{selectedError.context.promptLength} tokens</span>
                        </div>
                      )}
                      {selectedError.context.memoryUsage && (
                        <div>
                          <span className="text-muted-foreground">Memory Usage:</span>
                          <span className="ml-2 font-medium">{selectedError.context.memoryUsage}%</span>
                        </div>
                      )}
                      {selectedError.context.contextTokens && (
                        <div>
                          <span className="text-muted-foreground">Context Tokens:</span>
                          <span className="ml-2 font-medium">{selectedError.context.contextTokens}</span>
                        </div>
                      )}
                      {selectedError.context.requestId && (
                        <div>
                          <span className="text-muted-foreground">Request ID:</span>
                          <span className="ml-2 font-medium font-mono text-xs">{selectedError.context.requestId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {selectedError.stackTrace && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">Stack Trace</Label>
                    <pre className="text-xs bg-muted p-3 rounded mt-2 overflow-x-auto">
                      {selectedError.stackTrace}
                    </pre>
                  </div>
                </>
              )}

              {selectedError.recoveryActions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">Recovery Actions Taken</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedError.recoveryActions.map((action, idx) => (
                        <Badge key={idx} variant="outline">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Recovery Status</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedError.recoveryAttempted 
                      ? selectedError.recoverySuccessful 
                        ? 'Recovery completed successfully' 
                        : 'Recovery attempted but failed'
                      : 'No recovery attempted yet'}
                  </p>
                </div>
                {!selectedError.recoveryAttempted && (
                  <Button
                    onClick={() => handleAutoRecovery(selectedError)}
                    disabled={recoveryInProgress}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Attempt Recovery
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
