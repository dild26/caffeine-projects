import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { auditLogger, type AuditLogEntry, type LogLevel, type OperationType } from '../lib/auditLogger';
import { ERROR_DEFINITIONS, type ErrorCategory, type ErrorSeverity } from '../lib/errorTaxonomy';
import SystemHealthIndicator from '../components/SystemHealthIndicator';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  TrendingUp,
  Zap,
  Database,
  Shield,
  AlertTriangle,
} from 'lucide-react';

export default function SystemHealthDashboard() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [selectedOperation, setSelectedOperation] = useState<OperationType | 'all'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const updateLogs = () => {
      const filter: any = {};
      if (selectedLevel !== 'all') filter.level = selectedLevel;
      if (selectedOperation !== 'all') filter.operationType = selectedOperation;
      setLogs(auditLogger.getLogs(filter));
    };

    updateLogs();

    if (autoRefresh) {
      const interval = setInterval(updateLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedLevel, selectedOperation, autoRefresh]);

  const handleExportLogs = () => {
    const dataStr = auditLogger.exportLogs();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getLogStats = () => {
    const total = logs.length;
    const errors = logs.filter(l => l.level === 'error' || l.level === 'critical').length;
    const warnings = logs.filter(l => l.level === 'warn').length;
    const info = logs.filter(l => l.level === 'info').length;
    
    const avgDuration = logs
      .filter(l => l.performance?.duration)
      .reduce((acc, l) => acc + (l.performance?.duration || 0), 0) / 
      (logs.filter(l => l.performance?.duration).length || 1);

    return { total, errors, warnings, info, avgDuration };
  };

  const stats = getLogStats();
  const errorRate = stats.total > 0 ? (stats.errors / stats.total) * 100 : 0;
  const warningRate = stats.total > 0 ? (stats.warnings / stats.total) * 100 : 0;

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">System Health Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring and audit logs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportLogs} className="gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      <SystemHealthIndicator showBanner={true} />

      <div className="mb-8 mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Logged operations</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{errorRate.toFixed(1)}%</div>
            <Progress value={errorRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{stats.errors} errors</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Rate</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{warningRate.toFixed(1)}%</div>
            <Progress value={warningRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{stats.warnings} warnings</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgDuration.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Operation time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="errors">Error Taxonomy</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Audit Log Stream</CardTitle>
              <CardDescription>
                Real-time structured logs with correlation IDs for all critical operations
              </CardDescription>
              <div className="flex gap-2 mt-4">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'all')}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                  <option value="critical">Critical</option>
                </select>
                <select
                  value={selectedOperation}
                  onChange={(e) => setSelectedOperation(e.target.value as OperationType | 'all')}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Operations</option>
                  <option value="property_management">Property Management</option>
                  <option value="blog_operation">Blog Operations</option>
                  <option value="authentication">Authentication</option>
                  <option value="payment_processing">Payment Processing</option>
                  <option value="node_management">Node Management</option>
                  <option value="feature_tracking">Feature Tracking</option>
                  <option value="data_integrity">Data Integrity</option>
                  <option value="system_health">System Health</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Database className="h-12 w-12 mb-4 opacity-50" />
                    <p>No logs available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {logs.slice().reverse().map((log, index) => (
                      <div
                        key={index}
                        className={`rounded-lg border-2 p-4 ${
                          log.level === 'error' || log.level === 'critical'
                            ? 'border-destructive/50 bg-destructive/5'
                            : log.level === 'warn'
                            ? 'border-yellow-500/50 bg-yellow-500/5'
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                log.level === 'error' || log.level === 'critical'
                                  ? 'destructive'
                                  : log.level === 'warn'
                                  ? 'secondary'
                                  : 'default'
                              }
                            >
                              {log.level.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{log.operationType}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-semibold mb-1">{log.operation}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Correlation ID: <span className="font-mono">{log.correlationId}</span>
                        </p>
                        {log.error && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error: {log.error.code}</AlertTitle>
                            <AlertDescription className="text-xs">
                              {log.error.message}
                            </AlertDescription>
                          </Alert>
                        )}
                        {log.performance && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <Zap className="h-3 w-3" />
                            <span>Duration: {log.performance.duration}ms</span>
                          </div>
                        )}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              View metadata
                            </summary>
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Error Taxonomy</CardTitle>
              <CardDescription>
                Standardized error codes with severity levels and resolution pathways
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full">
                <div className="space-y-4">
                  {Object.values(ERROR_DEFINITIONS).map((error) => (
                    <div key={error.code} className="rounded-lg border-2 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {error.code}
                          </Badge>
                          <Badge
                            variant={
                              error.severity === 'critical' || error.severity === 'high'
                                ? 'destructive'
                                : error.severity === 'medium'
                                ? 'secondary'
                                : 'default'
                            }
                          >
                            {error.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{error.category}</Badge>
                        </div>
                        <div className="flex gap-2">
                          {error.retryable && (
                            <Badge variant="outline" className="text-xs">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retryable
                            </Badge>
                          )}
                          {error.requiresSupport && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Support
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold mb-1">{error.message}</p>
                      <p className="text-sm text-muted-foreground mb-3">{error.userMessage}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold">Resolution Steps:</p>
                        <ol className="text-xs text-muted-foreground space-y-1 pl-4">
                          {error.resolutionSteps.map((step, index) => (
                            <li key={index} className="list-decimal">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Operation timing and performance SLO tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <span className="text-2xl font-bold">{stats.avgDuration.toFixed(0)}ms</span>
                  </div>
                  <Progress value={Math.min((stats.avgDuration / 1000) * 100, 100)} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: &lt;500ms for optimal performance
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-2xl font-bold">
                      {((1 - errorRate / 100) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(1 - errorRate / 100) * 100} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: &gt;99% success rate
                  </p>
                </div>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Performance SLO Status</AlertTitle>
                  <AlertDescription>
                    {stats.avgDuration < 500 && errorRate < 1 ? (
                      <span className="text-green-600 dark:text-green-400">
                        ✓ All performance SLOs are being met
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">
                        ⚠ Some performance SLOs are not being met
                      </span>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="rounded-lg border-2 p-4 bg-muted/50">
                  <h3 className="font-semibold mb-3">Recent Operations</h3>
                  <div className="space-y-2">
                    {logs
                      .filter(l => l.performance)
                      .slice(-10)
                      .reverse()
                      .map((log, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground truncate flex-1">
                            {log.operation}
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {log.performance?.duration}ms
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
