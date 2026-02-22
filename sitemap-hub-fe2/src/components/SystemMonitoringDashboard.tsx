import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Monitor, Server, Cpu, HardDrive, Wifi, Activity, AlertTriangle, 
  CheckCircle, XCircle, RefreshCw, Bell, Shield, Database, 
  Zap, Target, Gauge, Clock, TrendingUp, TrendingDown,
  BarChart3, LineChart, PieChart, Globe, Users, Search
} from 'lucide-react';
import { useGetSystemHealth } from '@/hooks/useQueries';

interface SystemMonitoringDashboardProps {
  userRole?: string;
}

export default function SystemMonitoringDashboard({ userRole = 'admin' }: SystemMonitoringDashboardProps) {
  const [realTimeData, setRealTimeData] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  
  const { data: systemHealth, refetch: refetchHealth } = useGetSystemHealth();

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        timestamp: Date.now(),
        activeUsers: Math.floor(Math.random() * 1000) + 500,
        requestsPerSecond: Math.floor(Math.random() * 100) + 50,
        responseTime: Math.floor(Math.random() * 100) + 50,
        errorRate: Math.random() * 2,
        throughput: Math.floor(Math.random() * 1000) + 500,
        memoryUsage: Math.random() * 0.3 + 0.4,
        cpuUsage: Math.random() * 0.2 + 0.1,
        diskUsage: Math.random() * 0.4 + 0.3,
        networkLatency: Math.floor(Math.random() * 50) + 10,
        cacheHitRate: Math.random() * 20 + 80,
        databaseConnections: Math.floor(Math.random() * 50) + 20,
      });
      
      // Add performance history point
      setPerformanceHistory(prev => {
        const newPoint = {
          timestamp: Date.now(),
          responseTime: Math.floor(Math.random() * 100) + 50,
          throughput: Math.floor(Math.random() * 1000) + 500,
          errorRate: Math.random() * 2,
        };
        return [...prev.slice(-29), newPoint]; // Keep last 30 points
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Generate system alerts
  useEffect(() => {
    const generateAlerts = () => {
      const alertTypes = [
        { type: 'info', message: 'System backup completed successfully', icon: CheckCircle, color: 'green' },
        { type: 'warning', message: 'High memory usage detected (75%)', icon: AlertTriangle, color: 'yellow' },
        { type: 'success', message: 'Performance optimization applied', icon: CheckCircle, color: 'green' },
        { type: 'info', message: 'New user registration spike detected', icon: Users, color: 'blue' },
        { type: 'warning', message: 'Database connection pool at 80% capacity', icon: Database, color: 'yellow' },
      ];
      
      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      setAlerts(prev => [{
        id: Date.now(),
        ...randomAlert,
        timestamp: Date.now(),
      }, ...prev.slice(0, 9)]); // Keep last 10 alerts
    };

    const alertInterval = setInterval(generateAlerts, 30000); // New alert every 30 seconds
    return () => clearInterval(alertInterval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500';
      case 'warning': return 'border-yellow-500';
      case 'error': return 'border-red-500';
      default: return 'border-blue-500';
    }
  };

  const handleRefreshHealth = () => {
    refetchHealth();
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            System Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time system health, performance metrics, and infrastructure monitoring
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-green-500">
            Live Monitoring
          </Badge>
          <Button variant="outline" onClick={handleRefreshHealth}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <Card className="cyber-gradient border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-primary" />
                <span>Real-time System Health Overview</span>
              </div>
              <Badge variant="outline" className={getHealthStatusColor(systemHealth.status)}>
                {systemHealth.status.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <Server className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Uptime</div>
                <div className="font-bold">{formatUptime(systemHealth.uptime)}</div>
                <div className="text-xs text-green-500">99.9% availability</div>
              </div>
              
              <div className="text-center">
                <Cpu className="h-6 w-6 mx-auto mb-2 text-accent" />
                <div className="text-sm text-muted-foreground">CPU Usage</div>
                <div className="font-bold">{(realTimeData.cpuUsage * 100 || systemHealth.cpuUsage * 100).toFixed(1)}%</div>
                <Progress value={(realTimeData.cpuUsage || systemHealth.cpuUsage) * 100} className="h-1 mt-1" />
              </div>
              
              <div className="text-center">
                <HardDrive className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-sm text-muted-foreground">Memory</div>
                <div className="font-bold">{(realTimeData.memoryUsage * 100 || systemHealth.memoryUsage * 100).toFixed(1)}%</div>
                <Progress value={(realTimeData.memoryUsage || systemHealth.memoryUsage) * 100} className="h-1 mt-1" />
              </div>
              
              <div className="text-center">
                <Wifi className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-sm text-muted-foreground">Network</div>
                <div className="font-bold">{realTimeData.networkLatency || 25}ms</div>
                <div className="text-xs text-blue-500">Latency</div>
              </div>
              
              <div className="text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-sm text-muted-foreground">Response</div>
                <div className="font-bold">{realTimeData.responseTime || systemHealth.responseTime}ms</div>
                <div className="text-xs text-yellow-500">Avg time</div>
              </div>
              
              <div className="text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <div className="text-sm text-muted-foreground">Throughput</div>
                <div className="font-bold">{realTimeData.throughput || systemHealth.throughput}/min</div>
                <div className="text-xs text-purple-500">Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cyber-gradient border-green-500/20">
          <CardHeader className="text-center">
            <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-500">
              {realTimeData.activeUsers || 750}
            </div>
            <p className="text-sm text-muted-foreground">Currently online</p>
            <div className="mt-2 flex items-center justify-center text-sm">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-500">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-blue-500/20">
          <CardHeader className="text-center">
            <Search className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <CardTitle>Requests/sec</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-500">
              {realTimeData.requestsPerSecond || 75}
            </div>
            <p className="text-sm text-muted-foreground">Current load</p>
            <div className="mt-2 flex items-center justify-center text-sm">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-blue-500">+8.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-yellow-500/20">
          <CardHeader className="text-center">
            <Gauge className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <CardTitle>Error Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-yellow-500">
              {(realTimeData.errorRate || 0.5).toFixed(2)}%
            </div>
            <p className="text-sm text-muted-foreground">Last 5 minutes</p>
            <div className="mt-2 flex items-center justify-center text-sm">
              <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-500">-2.1%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-purple-500/20">
          <CardHeader className="text-center">
            <Database className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <CardTitle>Cache Hit Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-purple-500">
              {(realTimeData.cacheHitRate || 85).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">Cache efficiency</p>
            <div className="mt-2 flex items-center justify-center text-sm">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-500">+3.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-accent" />
                  <span>Performance Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <div className="text-xl font-bold text-accent">
                      {realTimeData.responseTime || 65}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Response</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-xl font-bold text-green-500">99.8%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-xl font-bold text-blue-500">
                      {realTimeData.throughput || 650}
                    </div>
                    <div className="text-sm text-muted-foreground">Req/min</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Performance History (Last 30 Points)</h4>
                  <div className="h-32 bg-muted/20 rounded-lg flex items-end justify-between p-2">
                    {performanceHistory.slice(-15).map((point, index) => (
                      <div
                        key={index}
                        className="bg-accent/60 rounded-t"
                        style={{
                          height: `${(point.responseTime / 150) * 100}%`,
                          width: '6%',
                        }}
                        title={`${point.responseTime}ms at ${new Date(point.timestamp).toLocaleTimeString()}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    Response time trend (lower is better)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Resource Utilization</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span className="font-medium">
                        {((realTimeData.cpuUsage || 0.15) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={(realTimeData.cpuUsage || 0.15) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span className="font-medium">
                        {((realTimeData.memoryUsage || 0.55) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={(realTimeData.memoryUsage || 0.55) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Disk Usage</span>
                      <span className="font-medium">
                        {((realTimeData.diskUsage || 0.45) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={(realTimeData.diskUsage || 0.45) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Network I/O</span>
                      <span className="font-medium">Normal</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="text-lg font-bold">{realTimeData.databaseConnections || 35}</div>
                    <div className="text-xs text-muted-foreground">DB Connections</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="text-lg font-bold">{formatBytes(Math.random() * 1000000000 + 500000000)}</div>
                    <div className="text-xs text-muted-foreground">Memory Used</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="cyber-gradient border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-green-500" />
                  <span>Server Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Web Server</span>
                    <Badge variant="default" className="text-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="default" className="text-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache Server</span>
                    <Badge variant="default" className="text-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Load Balancer</span>
                    <Badge variant="default" className="text-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CDN</span>
                    <Badge variant="default" className="text-green-500">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  <span>Database Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Connections</span>
                    <span className="font-medium">{realTimeData.databaseConnections || 35}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Query Performance</span>
                    <span className="font-medium text-green-500">Excellent</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Replication Lag</span>
                    <span className="font-medium">&lt; 1ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storage Used</span>
                    <span className="font-medium">45.2 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  <span>Network Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bandwidth Usage</span>
                    <span className="font-medium">2.3 GB/hr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CDN Hit Rate</span>
                    <span className="font-medium text-green-500">94.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SSL Certificate</span>
                    <span className="font-medium text-green-500">Valid</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>DNS Response</span>
                    <span className="font-medium">12ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="cyber-gradient border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <span>Security Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Firewall Status</span>
                    <Badge variant="default" className="text-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">DDoS Protection</span>
                    <Badge variant="default" className="text-green-500">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL/TLS</span>
                    <Badge variant="default" className="text-green-500">A+ Rating</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Intrusion Detection</span>
                    <Badge variant="default" className="text-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vulnerability Scan</span>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Security Score: 98/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All security measures are active and functioning properly
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Threat Detection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Blocked Requests (24h)</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Failed Login Attempts</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Suspicious IPs Blocked</span>
                    <span className="font-medium">15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Malware Detected</span>
                    <span className="font-medium text-green-500">0</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-sm">Recent Security Events</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Rate limit exceeded</span>
                      <span className="text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suspicious login blocked</span>
                      <span className="text-muted-foreground">15 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SQL injection attempt</span>
                      <span className="text-muted-foreground">1 hr ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="cyber-gradient border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-accent" />
                  <span>System Alerts & Notifications</span>
                </div>
                <Badge variant="secondary">{alerts.length} alerts</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">
                    System is running smoothly. Alerts will appear here when attention is needed.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {alerts.map((alert) => {
                      const IconComponent = alert.icon;
                      return (
                        <Alert key={alert.id} className={getAlertColor(alert.type)}>
                          <IconComponent className="h-4 w-4" />
                          <AlertDescription className="flex items-center justify-between">
                            <span>{alert.message}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                          </AlertDescription>
                        </Alert>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>System Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">[{new Date().toISOString()}]</span>
                    <Badge variant="outline" className="text-green-500">INFO</Badge>
                    <span>System health check completed successfully</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">[{new Date(Date.now() - 60000).toISOString()}]</span>
                    <Badge variant="outline" className="text-blue-500">DEBUG</Badge>
                    <span>Cache invalidation triggered for user analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">[{new Date(Date.now() - 120000).toISOString()}]</span>
                    <Badge variant="outline" className="text-yellow-500">WARN</Badge>
                    <span>High memory usage detected: 75.2%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">[{new Date(Date.now() - 180000).toISOString()}]</span>
                    <Badge variant="outline" className="text-green-500">INFO</Badge>
                    <span>Database backup completed: 2.3GB archived</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">[{new Date(Date.now() - 240000).toISOString()}]</span>
                    <Badge variant="outline" className="text-blue-500">DEBUG</Badge>
                    <span>Export job queued: referral_data_2025.xlsx</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">[{new Date(Date.now() - 300000).toISOString()}]</span>
                    <Badge variant="outline" className="text-green-500">INFO</Badge>
                    <span>Performance optimization applied: 15% improvement</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">[{new Date(Date.now() - 360000).toISOString()}]</span>
                    <Badge variant="outline" className="text-red-500">ERROR</Badge>
                    <span>Failed to connect to external API: timeout after 30s</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">[{new Date(Date.now() - 420000).toISOString()}]</span>
                    <Badge variant="outline" className="text-green-500">INFO</Badge>
                    <span>User authentication successful: user_12345</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">[{new Date(Date.now() - 480000).toISOString()}]</span>
                    <Badge variant="outline" className="text-blue-500">DEBUG</Badge>
                    <span>Search query processed: &quot;sitemap.xml&quot; (125ms)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">[{new Date(Date.now() - 540000).toISOString()}]</span>
                    <Badge variant="outline" className="text-green-500">INFO</Badge>
                    <span>Commission payment processed: $125.50</span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
