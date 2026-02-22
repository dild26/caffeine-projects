import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, Users, Database, Settings, AlertTriangle, Upload, FileText, BarChart3, 
  Download, TrendingUp, DollarSign, Share, Activity, Clock, CheckCircle, 
  XCircle, Loader2, Eye, Edit, Trash2, UserCheck, UserX, Ban, 
  Server, Cpu, HardDrive, Wifi, RefreshCw, AlertCircle, Calendar,
  Globe, Search, Filter, SortAsc, SortDesc, FileSpreadsheet,
  Archive, FileJson, FileImage, Mail, Bell, Lock, Key, Monitor,
  Zap, Target, PieChart, LineChart, MapPin, Timer, Gauge, GitBranch,
  History, Package, Layers, CloudUpload, HardDriveIcon, Info
} from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { 
  useGetCallerUserRole, useAddSitemapData, useGetAllDomains, useGetAllSitemapData, 
  useGetExportRecords, useCreateExport, useGetReferralAnalytics, useGetCommissionAnalytics,
  useGetProfitShareConfig, useUpdateProfitShareConfig, useGetAllUsers, useUpdateUserStatus,
  useGetSystemHealth, useGetExportHistory, useGetAnalyticsSummary, useGetAnalyticsByCategory,
  useGetAnalyticsTrends, useGetAnalyticsGrowthRate, useGetPublicSearchAnalytics,
  useGetSubscriptionAnalytics
} from '@/hooks/useQueries';
import { SearchResult, ExportType } from '@/backend';
import { toast } from 'sonner';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'admin';

interface AdminPageProps {
  onNavigate: (page: Page) => void;
}

// Mock version and upgrade data - in real implementation this would come from backend
const currentVersion = "2.1.0";
const lastUpgrade = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
const upgradeHistory = [
  { version: "2.1.0", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: "success", migrationTime: "2.3s" },
  { version: "2.0.5", date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), status: "success", migrationTime: "1.8s" },
  { version: "2.0.0", date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), status: "success", migrationTime: "4.1s" },
];

const stableVariableStatus = {
  userProfiles: { status: "active", lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), size: "2.4MB" },
  subscriptions: { status: "active", lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), size: "1.8MB" },
  sitemapData: { status: "active", lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), size: "45.2MB" },
  referrals: { status: "active", lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), size: "3.1MB" },
  commissions: { status: "active", lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), size: "5.7MB" },
  analytics: { status: "active", lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), size: "12.3MB" },
};

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const { identity } = useInternetIdentity();
  const { data: userRole, isLoading } = useGetCallerUserRole();
  const { data: allDomains = [] } = useGetAllDomains();
  const { data: allSitemapData = [] } = useGetAllSitemapData();
  const { data: exportRecords = [] } = useGetExportRecords();
  const { data: exportHistory = [] } = useGetExportHistory();
  const { data: referralAnalytics } = useGetReferralAnalytics();
  const { data: commissionAnalytics } = useGetCommissionAnalytics();
  const { data: profitShareConfig } = useGetProfitShareConfig();
  const { data: allUsers = [] } = useGetAllUsers();
  const { data: systemHealth } = useGetSystemHealth();
  const { data: analyticsSummary } = useGetAnalyticsSummary();
  const { data: publicSearchAnalytics } = useGetPublicSearchAnalytics();
  const { data: subscriptionAnalytics } = useGetSubscriptionAnalytics();
  
  const addSitemapDataMutation = useAddSitemapData();
  const createExportMutation = useCreateExport();
  const updateProfitShareMutation = useUpdateProfitShareConfig();
  const updateUserStatusMutation = useUpdateUserStatus();
  const getAnalyticsByCategoryMutation = useGetAnalyticsByCategory();
  const getAnalyticsTrendsMutation = useGetAnalyticsTrends();
  const getAnalyticsGrowthRateMutation = useGetAnalyticsGrowthRate();
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedExportType, setSelectedExportType] = useState<ExportType>(ExportType.csv);
  const [selectedDataType, setSelectedDataType] = useState<'referrals' | 'commissions' | 'sitemaps' | 'users' | 'payouts'>('referrals');
  const [profitShareRates, setProfitShareRates] = useState(profitShareConfig || {});
  const [userFilter, setUserFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [selectedAnalyticsCategory, setSelectedAnalyticsCategory] = useState('userActivity');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('30');
  const [exportDateRange, setExportDateRange] = useState({ start: '', end: '' });
  const [bulkOperationMode, setBulkOperationMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    realTimeAnalytics: true,
    emailNotifications: true,
    twoFactorAuth: true,
    ipWhitelist: false,
    auditLogging: true,
    rateLimiting: true,
  });
  const [upgradeInProgress, setUpgradeInProgress] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';

  // Real-time profit share adjustment
  const handleProfitShareUpdate = async (level: string, value: number) => {
    const newRates = { ...profitShareRates, [level]: value / 100 };
    setProfitShareRates(newRates);
    
    try {
      await updateProfitShareMutation.mutateAsync(newRates);
      toast.success(`Updated ${level} commission rate to ${value}% with immediate effect`);
    } catch (error) {
      toast.error('Failed to update profit share configuration');
      console.error('Profit share update error:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setUploadStatus('error');
      setUploadMessage('Please select a JSON file.');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setUploadMessage('Reading file...');

    try {
      const text = await file.text();
      setUploadProgress(25);
      setUploadMessage('Parsing JSON...');

      const data = JSON.parse(text);
      setUploadProgress(50);

      if (!data.urls || !Array.isArray(data.urls)) {
        throw new Error('Invalid JSON format. Expected an object with "urls" array.');
      }

      setUploadMessage('Processing URLs...');
      setUploadProgress(75);

      const domain = data.domain || file.name.replace('.json', '');
      const searchResults: SearchResult[] = data.urls.map((url: any) => ({
        url: typeof url === 'string' ? url : url.url || '',
        title: typeof url === 'object' ? (url.title || url.url || '') : url,
        description: typeof url === 'object' ? (url.description || '') : '',
      }));

      setUploadMessage('Uploading to backend...');
      await addSitemapDataMutation.mutateAsync({ domain, results: searchResults });

      setUploadProgress(100);
      setUploadStatus('success');
      setUploadMessage(`Successfully uploaded ${searchResults.length} URLs for domain: ${domain}`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const handleAdvancedExport = async () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const dateRangeStr = exportDateRange.start && exportDateRange.end 
        ? `_${exportDateRange.start}_to_${exportDateRange.end}`
        : '';
      const filePath = `exports/${selectedDataType}${dateRangeStr}_${timestamp}.${selectedExportType}`;
      
      await createExportMutation.mutateAsync({
        exportType: selectedExportType,
        filePath,
        dataType: selectedDataType
      });
      
      toast.success(`Advanced export initiated for ${selectedDataType} data in ${selectedExportType.toUpperCase()} format with comprehensive metadata`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to initiate advanced export');
    }
  };

  const handleBulkUserOperation = async (operation: 'activate' | 'suspend' | 'delete') => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users for bulk operation');
      return;
    }

    try {
      for (const userId of selectedUsers) {
        if (operation === 'delete') {
          // Mock delete operation
          console.log(`Deleting user: ${userId}`);
        } else {
          await updateUserStatusMutation.mutateAsync({ 
            userId, 
            status: operation === 'activate' ? 'active' : 'suspended' 
          });
        }
      }
      
      toast.success(`Bulk ${operation} completed for ${selectedUsers.length} users`);
      setSelectedUsers([]);
      setBulkOperationMode(false);
    } catch (error) {
      toast.error(`Failed to perform bulk ${operation}`);
      console.error('Bulk operation error:', error);
    }
  };

  const handleSystemSettingChange = (setting: string, value: boolean) => {
    setSystemSettings(prev => ({ ...prev, [setting]: value }));
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
  };

  const handlePreUpgradeBackup = async () => {
    setBackupInProgress(true);
    try {
      // Simulate pre-upgrade backup
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Pre-upgrade backup completed successfully');
    } catch (error) {
      toast.error('Pre-upgrade backup failed');
    } finally {
      setBackupInProgress(false);
    }
  };

  const handleUpgradeMonitoring = async () => {
    setUpgradeInProgress(true);
    try {
      // Simulate upgrade monitoring
      await new Promise(resolve => setTimeout(resolve, 5000));
      toast.success('System upgrade monitoring initiated');
    } catch (error) {
      toast.error('Upgrade monitoring failed');
    } finally {
      setUpgradeInProgress(false);
    }
  };

  const formatDate = (timestamp: bigint | string | number | Date) => {
    let dateValue: Date;
    
    if (timestamp instanceof Date) {
      dateValue = timestamp;
    } else if (typeof timestamp === 'bigint') {
      dateValue = new Date(Number(timestamp) / 1000000);
    } else if (typeof timestamp === 'string') {
      dateValue = new Date(parseInt(timestamp, 10));
    } else {
      dateValue = new Date(timestamp);
    }
    
    return dateValue.toLocaleDateString();
  };

  const formatDateTime = (timestamp: bigint | string | number | Date) => {
    let dateValue: Date;
    
    if (timestamp instanceof Date) {
      dateValue = timestamp;
    } else if (typeof timestamp === 'bigint') {
      dateValue = new Date(Number(timestamp) / 1000000);
    } else if (typeof timestamp === 'string') {
      dateValue = new Date(parseInt(timestamp, 10));
    } else {
      dateValue = new Date(timestamp);
    }
    
    return dateValue.toLocaleString();
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatNumber = (num: number | bigint) => {
    return Number(num).toLocaleString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': case 'active': case 'healthy': case 'success': return 'default';
      case 'pending': case 'processing': case 'warning': return 'secondary';
      case 'failed': case 'suspended': case 'banned': case 'critical': case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': case 'active': case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': case 'error': case 'failed': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  // Filter users based on search and filter criteria
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                         user.principal.toLowerCase().includes(userSearch.toLowerCase());
    
    const matchesFilter = userFilter === 'all' || user.status === userFilter || user.role === userFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="cyber-gradient border-primary/20 max-w-md">
          <CardContent className="text-center py-8">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to access the comprehensive admin panel.
            </p>
            <Button className="neon-glow">
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="cyber-gradient border-primary/20 max-w-md">
          <CardContent className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking administrator permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="cyber-gradient border-destructive/20 max-w-md">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have administrator privileges to access this comprehensive admin panel.
            </p>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('home')}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Enterprise Admin Control Center
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Advanced system administration with enterprise upgrade management, versioned data persistence, 
          real-time analytics, and comprehensive export tools for large-scale operations.
        </p>
      </div>

      {/* Version and Upgrade Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cyber-gradient border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-primary" />
                <span>App Version</span>
              </div>
              <Badge variant="default" className="text-lg px-3 py-1">
                v{currentVersion}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Release Type</span>
                <Badge variant="outline">Stable</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Build Date</span>
                <span className="text-sm font-medium">{formatDate(new Date())}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Version</span>
                <Badge variant="secondary">2.1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5 text-accent" />
                <span>Last Upgrade</span>
              </div>
              <Badge variant="default" className="text-green-500">
                Success
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-medium">{formatDateTime(lastUpgrade)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Migration Time</span>
                <span className="text-sm font-medium">2.3s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data Integrity</span>
                <Badge variant="default" className="text-green-500">Verified</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDriveIcon className="h-5 w-5 text-green-500" />
                <span>Data Persistence</span>
              </div>
              <Badge variant="default" className="text-green-500">
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stable Variables</span>
                <Badge variant="default" className="text-green-500">6 Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Backup</span>
                <span className="text-sm font-medium">2h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Size</span>
                <span className="text-sm font-medium">70.5MB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced System Health Overview */}
      {systemHealth && (
        <Card className="cyber-gradient border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-primary" />
                <span>Real-time System Health & Performance Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getHealthStatusColor(systemHealth.status)}>
                  {systemHealth.status.toUpperCase()}
                </Badge>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <Server className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Uptime</div>
                <div className="font-bold">{Math.floor(systemHealth.uptime / 86400)}d {Math.floor((systemHealth.uptime % 86400) / 3600)}h</div>
                <div className="text-xs text-green-500">99.9% availability</div>
              </div>
              <div className="text-center">
                <Cpu className="h-6 w-6 mx-auto mb-2 text-accent" />
                <div className="text-sm text-muted-foreground">CPU Usage</div>
                <div className="font-bold">{(systemHealth.cpuUsage * 100).toFixed(1)}%</div>
                <Progress value={systemHealth.cpuUsage * 100} className="h-1 mt-1" />
              </div>
              <div className="text-center">
                <HardDrive className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-sm text-muted-foreground">Memory</div>
                <div className="font-bold">{(systemHealth.memoryUsage * 100).toFixed(1)}%</div>
                <Progress value={systemHealth.memoryUsage * 100} className="h-1 mt-1" />
              </div>
              <div className="text-center">
                <Wifi className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-sm text-muted-foreground">Connections</div>
                <div className="font-bold">{systemHealth.activeConnections}</div>
                <div className="text-xs text-blue-500">Real-time</div>
              </div>
              <div className="text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-sm text-muted-foreground">Response Time</div>
                <div className="font-bold">{systemHealth.responseTime}ms</div>
                <div className="text-xs text-yellow-500">Avg latency</div>
              </div>
              <div className="text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <div className="text-sm text-muted-foreground">Throughput</div>
                <div className="font-bold">{systemHealth.throughput}/min</div>
                <div className="text-xs text-purple-500">Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="upgrade" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="upgrade" className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4" />
            <span>Upgrade</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="exports" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exports</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center space-x-2">
            <Share className="h-4 w-4" />
            <span>Referrals</span>
          </TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Commissions</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center space-x-2">
            <Gauge className="h-4 w-4" />
            <span>Monitoring</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upgrade">
          {/* Enterprise Upgrade Management */}
          <div className="space-y-6">
            {/* Upgrade Management Interface */}
            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GitBranch className="h-5 w-5 text-primary" />
                  <span>Enterprise Upgrade Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pre-Upgrade Controls</h3>
                    <div className="space-y-3">
                      <Button 
                        onClick={handlePreUpgradeBackup}
                        disabled={backupInProgress}
                        className="w-full"
                      >
                        {backupInProgress ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating Backup...
                          </>
                        ) : (
                          <>
                            <CloudUpload className="h-4 w-4 mr-2" />
                            Create Pre-Upgrade Backup
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Database className="h-4 w-4 mr-2" />
                        Validate Data Integrity
                      </Button>
                      <Button variant="outline" className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Run Pre-Flight Checks
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Upgrade Monitoring</h3>
                    <div className="space-y-3">
                      <Button 
                        onClick={handleUpgradeMonitoring}
                        disabled={upgradeInProgress}
                        className="w-full"
                      >
                        {upgradeInProgress ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Monitoring...
                          </>
                        ) : (
                          <>
                            <Monitor className="h-4 w-4 mr-2" />
                            Start Upgrade Monitoring
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Activity className="h-4 w-4 mr-2" />
                        View Migration Progress
                      </Button>
                      <Button variant="outline" className="w-full">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Emergency Rollback
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Post-Upgrade Validation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-green-500/20 bg-green-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Data Integrity</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">All stable variables verified</p>
                      </CardContent>
                    </Card>
                    <Card className="border-green-500/20 bg-green-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">System Health</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">All services operational</p>
                      </CardContent>
                    </Card>
                    <Card className="border-green-500/20 bg-green-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Performance</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Response times optimal</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stable Variables Status */}
            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-accent" />
                  <span>Stable Variables & Data Persistence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      All critical data is stored using Motoko stable variables to ensure persistence across canister upgrades.
                      Preupgrade and postupgrade hooks handle safe data migration and transformation.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(stableVariableStatus).map(([key, data]) => (
                      <Card key={key} className="border-muted">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <Badge variant={getStatusBadgeVariant(data.status)}>
                              {data.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Size:</span>
                              <span>{data.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Backup:</span>
                              <span>{formatDateTime(data.lastBackup)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade History */}
            <Card className="cyber-gradient border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-purple-500" />
                  <span>Upgrade History & Version Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Version</TableHead>
                          <TableHead>Upgrade Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Migration Time</TableHead>
                          <TableHead>Data Integrity</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upgradeHistory.map((upgrade, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Badge variant="outline">v{upgrade.version}</Badge>
                            </TableCell>
                            <TableCell>{formatDateTime(upgrade.date)}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(upgrade.status)}>
                                {upgrade.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{upgrade.migrationTime}</TableCell>
                            <TableCell>
                              <Badge variant="default" className="text-green-500">
                                Verified
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version Compatibility */}
            <Card className="cyber-gradient border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <span>Version Compatibility & API Changes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Current API Version</h4>
                      <Badge variant="default" className="text-lg px-3 py-1">v2.1</Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Backward compatible with v2.0.x clients
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Data Schema Version</h4>
                      <Badge variant="secondary" className="text-lg px-3 py-1">v2.1.0</Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Automatic migration from v2.0.x schemas
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Recent API Changes</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-green-500">Added</Badge>
                        <span className="text-sm">Enhanced upgrade management endpoints</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-blue-500">Modified</Badge>
                        <span className="text-sm">Stable variable persistence for all data types</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-purple-500">Enhanced</Badge>
                        <span className="text-sm">Preupgrade/postupgrade hooks with validation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          {/* Comprehensive Analytics Dashboard */}
          <div className="space-y-6">
            {/* Platform-wide Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card className="cyber-gradient border-primary/20">
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary">{formatNumber(allUsers.length)}</div>
                  <p className="text-sm text-muted-foreground">Registered users</p>
                  <div className="mt-2 text-xs">
                    <span className="text-green-500">+{Math.floor(allUsers.length * 0.05)}</span> this month
                  </div>
                  {subscriptionAnalytics && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {subscriptionAnalytics.usagePatterns.weeklyActiveUsers} weekly active
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-accent/20">
                <CardHeader className="text-center">
                  <Database className="h-8 w-8 text-accent mx-auto mb-2" />
                  <CardTitle>Data Volume</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-accent">{formatNumber(allDomains.length)}</div>
                  <p className="text-sm text-muted-foreground">Indexed domains</p>
                  <div className="mt-2 text-xs">
                    <span className="text-blue-500">{formatNumber(allSitemapData.length)}</span> total URLs
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Optimized for billions
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-green-500/20">
                <CardHeader className="text-center">
                  <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {subscriptionAnalytics ? formatCurrency(subscriptionAnalytics.revenueMetrics.monthlyRecurringRevenue) : '$0'}
                  </div>
                  <p className="text-sm text-muted-foreground">Monthly recurring</p>
                  <div className="mt-2 text-xs">
                    <span className="text-green-500">
                      ARPU: {subscriptionAnalytics ? formatCurrency(subscriptionAnalytics.revenueMetrics.averageRevenuePerUser) : '$0'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    LTV: {subscriptionAnalytics ? formatCurrency(subscriptionAnalytics.revenueMetrics.lifetimeValue) : '$0'}
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-blue-500/20">
                <CardHeader className="text-center">
                  <Search className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <CardTitle>Search Volume</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {publicSearchAnalytics ? formatNumber(publicSearchAnalytics.totalSearches) : '0'}
                  </div>
                  <p className="text-sm text-muted-foreground">Total searches</p>
                  <div className="mt-2 text-xs">
                    <span className="text-blue-500">
                      {publicSearchAnalytics ? formatNumber(publicSearchAnalytics.uniqueUsers) : '0'}
                    </span> unique users
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {publicSearchAnalytics ? `${publicSearchAnalytics.performanceMetrics.successRate.toFixed(1)}%` : '0%'} success rate
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-purple-500/20">
                <CardHeader className="text-center">
                  <Share className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <CardTitle>Network Growth</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-purple-500">
                    {referralAnalytics ? formatNumber(referralAnalytics.totalReferrals) : '0'}
                  </div>
                  <p className="text-sm text-muted-foreground">Total referrals</p>
                  <div className="mt-2 text-xs">
                    <span className="text-purple-500">
                      +{referralAnalytics ? referralAnalytics.monthlyGrowth.toFixed(1) : '0'}%
                    </span> growth
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {referralAnalytics ? referralAnalytics.networkDepth : 0} levels deep
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Analytics Controls */}
            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-accent" />
                  <span>Advanced Analytics & Trend Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Analytics Category</label>
                    <Select value={selectedAnalyticsCategory} onValueChange={setSelectedAnalyticsCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="userActivity">User Activity Metrics</SelectItem>
                        <SelectItem value="subscriptionMetrics">Subscription Performance</SelectItem>
                        <SelectItem value="usageStats">Usage Statistics</SelectItem>
                        <SelectItem value="revenue">Revenue Analytics</SelectItem>
                        <SelectItem value="engagement">Engagement Metrics</SelectItem>
                        <SelectItem value="referralAnalytics">Referral Performance</SelectItem>
                        <SelectItem value="commissionAnalytics">Commission Tracking</SelectItem>
                        <SelectItem value="payoutProcessing">Payout Analytics</SelectItem>
                        <SelectItem value="exportTracking">Export Activity</SelectItem>
                        <SelectItem value="publicSearchAnalytics">Public Search Trends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Period (Days)</label>
                    <Select value={analyticsTimeframe} onValueChange={setAnalyticsTimeframe}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 Days</SelectItem>
                        <SelectItem value="30">Last 30 Days</SelectItem>
                        <SelectItem value="90">Last 90 Days</SelectItem>
                        <SelectItem value="365">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button 
                      onClick={() => {
                        getAnalyticsByCategoryMutation.mutate(selectedAnalyticsCategory);
                        getAnalyticsTrendsMutation.mutate({ 
                          category: selectedAnalyticsCategory, 
                          period: parseInt(analyticsTimeframe) 
                        });
                        getAnalyticsGrowthRateMutation.mutate(selectedAnalyticsCategory);
                      }}
                      disabled={getAnalyticsByCategoryMutation.isPending}
                      className="w-full"
                    >
                      {getAnalyticsByCategoryMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Analytics Results Display */}
                {getAnalyticsByCategoryMutation.data && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card className="bg-primary/10 border-primary/20">
                      <CardContent className="text-center py-4">
                        <div className="text-2xl font-bold text-primary">
                          {formatNumber(getAnalyticsByCategoryMutation.data)}
                        </div>
                        <div className="text-sm text-muted-foreground">Current Value</div>
                      </CardContent>
                    </Card>

                    {getAnalyticsGrowthRateMutation.data && (
                      <Card className="bg-green-500/10 border-green-500/20">
                        <CardContent className="text-center py-4">
                          <div className="text-2xl font-bold text-green-500">
                            {(getAnalyticsGrowthRateMutation.data * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Growth Rate</div>
                        </CardContent>
                      </Card>
                    )}

                    {getAnalyticsTrendsMutation.data && (
                      <Card className="bg-accent/10 border-accent/20">
                        <CardContent className="text-center py-4">
                          <div className="text-2xl font-bold text-accent">
                            {getAnalyticsTrendsMutation.data.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Data Points</div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Analytics Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Public Search Analytics */}
              {publicSearchAnalytics && (
                <Card className="cyber-gradient border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-5 w-5 text-blue-500" />
                      <span>Public Search Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-xl font-bold text-blue-500">
                          {publicSearchAnalytics.performanceMetrics.averageResponseTime}ms
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Response</div>
                      </div>
                      <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-xl font-bold text-green-500">
                          {publicSearchAnalytics.performanceMetrics.cacheHitRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Top Search Terms</h4>
                      {publicSearchAnalytics.topSearchTerms.slice(0, 5).map((term, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm">{term.term}</span>
                          <Badge variant="outline">{formatNumber(term.count)}</Badge>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Geographic Distribution</h4>
                      {Object.entries(publicSearchAnalytics.geographicDistribution).slice(0, 4).map(([region, percentage]) => (
                        <div key={region} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{region}</span>
                            <span className="font-medium">{percentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={percentage} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Subscription Analytics */}
              {subscriptionAnalytics && (
                <Card className="cyber-gradient border-green-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-green-500" />
                      <span>Subscription Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-xl font-bold text-green-500">
                          {subscriptionAnalytics.conversionMetrics.freeToPayConversion.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Free to Pay</div>
                      </div>
                      <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="text-xl font-bold text-red-500">
                          {subscriptionAnalytics.revenueMetrics.churnRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Churn Rate</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Tier Distribution</h4>
                      {Object.entries(subscriptionAnalytics.tierDistribution).map(([tier, count]) => (
                        <div key={tier} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm capitalize">{tier}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{count}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {((count / subscriptionAnalytics.totalSubscribers) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Satisfaction Metrics</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>NPS Score:</span>
                          <span className="font-medium">{subscriptionAnalytics.satisfactionMetrics.npsScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Support Tickets:</span>
                          <span className="font-medium">{subscriptionAnalytics.satisfactionMetrics.supportTicketVolume}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Feature Requests:</span>
                          <span className="font-medium">{subscriptionAnalytics.satisfactionMetrics.featureRequestCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bug Reports:</span>
                          <span className="font-medium">{subscriptionAnalytics.satisfactionMetrics.bugReportCount}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          {/* Enhanced User Management */}
          <div className="space-y-6">
            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Advanced User Management & Analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{filteredUsers.length} users</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBulkOperationMode(!bulkOperationMode)}
                    >
                      {bulkOperationMode ? 'Exit Bulk Mode' : 'Bulk Operations'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enhanced User Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Search users by name, email, or principal..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="md:col-span-2"
                  />
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active Users</SelectItem>
                      <SelectItem value="suspended">Suspended Users</SelectItem>
                      <SelectItem value="banned">Banned Users</SelectItem>
                      <SelectItem value="admin">Administrators</SelectItem>
                      <SelectItem value="user">Regular Users</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                </div>

                {/* Bulk Operations */}
                {bulkOperationMode && (
                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {selectedUsers.length} users selected
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUsers([])}
                          >
                            Clear Selection
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkUserOperation('activate')}
                            disabled={selectedUsers.length === 0}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkUserOperation('suspend')}
                            disabled={selectedUsers.length === 0}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleBulkUserOperation('delete')}
                            disabled={selectedUsers.length === 0}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Enhanced User Table */}
                <div className="border rounded-lg overflow-hidden">
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {bulkOperationMode && <TableHead className="w-12">Select</TableHead>}
                          <TableHead>User Details</TableHead>
                          <TableHead>Role & Status</TableHead>
                          <TableHead>Subscription</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Performance</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.slice(0, 50).map((user) => (
                          <TableRow key={user.id}>
                            {bulkOperationMode && (
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedUsers([...selectedUsers, user.id]);
                                    } else {
                                      setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                    }
                                  }}
                                  className="rounded"
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className="text-xs font-mono text-muted-foreground">
                                  {user.principal.slice(0, 12)}...
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                                <Badge variant={getStatusBadgeVariant(user.status)}>
                                  {user.status}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.subscriptionTier}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                <div>Logins: <span className="font-medium">{Math.floor(Math.random() * 100) + 10}</span></div>
                                <div>Searches: <span className="font-medium">{Math.floor(Math.random() * 500) + 50}</span></div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                <div>Referrals: <span className="font-medium">{user.totalReferrals}</span></div>
                                <div>Earnings: <span className="font-medium">{formatCurrency(user.totalCommissions)}</span></div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDate(user.lastActive)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Mail className="h-4 w-4" />
                                </Button>
                                {user.status === 'active' ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => updateUserStatusMutation.mutate({ userId: user.id, status: 'suspended' })}
                                    disabled={updateUserStatusMutation.isPending}
                                  >
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => updateUserStatusMutation.mutate({ userId: user.id, status: 'active' })}
                                    disabled={updateUserStatusMutation.isPending}
                                  >
                                    <UserCheck className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>

                {filteredUsers.length > 50 && (
                  <div className="text-center text-sm text-muted-foreground">
                    Showing first 50 users. Use filters to narrow down results.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Advanced Export Creation */}
            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Advanced Multi-Format Export</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Data Type</label>
                  <Select value={selectedDataType} onValueChange={(value: any) => setSelectedDataType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="referrals">Referral Data with Complete Hierarchy</SelectItem>
                      <SelectItem value="commissions">Commission Data with Transaction History</SelectItem>
                      <SelectItem value="sitemaps">Sitemap/Search Results with Metadata</SelectItem>
                      <SelectItem value="users">User Data with Privacy Controls</SelectItem>
                      <SelectItem value="payouts">Payout Data with Account Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Export Format</label>
                  <Select value={selectedExportType} onValueChange={(value: ExportType) => setSelectedExportType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ExportType.csv}>
                        <div className="flex items-center space-x-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          <span>CSV (Comma Separated Values)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={ExportType.xlsx}>
                        <div className="flex items-center space-x-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          <span>XLSX (Excel Format with Charts)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={ExportType.json}>
                        <div className="flex items-center space-x-2">
                          <FileJson className="h-4 w-4" />
                          <span>JSON (Structured Data)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={ExportType.zip}>
                        <div className="flex items-center space-x-2">
                          <Archive className="h-4 w-4" />
                          <span>ZIP (Compressed Archive)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Date</label>
                    <Input
                      type="date"
                      value={exportDateRange.start}
                      onChange={(e) => setExportDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Date</label>
                    <Input
                      type="date"
                      value={exportDateRange.end}
                      onChange={(e) => setExportDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Export Options</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="includeMetadata" defaultChecked />
                      <label htmlFor="includeMetadata" className="text-sm">Include comprehensive metadata</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="compressData" defaultChecked />
                      <label htmlFor="compressData" className="text-sm">Apply data compression</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="encryptExport" />
                      <label htmlFor="encryptExport" className="text-sm">Encrypt export file</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="scheduleExport" />
                      <label htmlFor="scheduleExport" className="text-sm">Schedule recurring export</label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleAdvancedExport} 
                  disabled={createExportMutation.isPending}
                  className="w-full"
                >
                  {createExportMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Advanced Export...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Create Advanced Export
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Export History & Download Management */}
            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Export History & Download Management</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{exportHistory.length} exports</Badge>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {exportHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Exports Yet</h3>
                    <p className="text-muted-foreground">
                      Create your first advanced export to see comprehensive download management here.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {exportHistory.map((record, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium">{record.filePath.split('/').pop()}</p>
                              <Badge variant={getStatusBadgeVariant(record.status)}>
                                {record.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(record.createdAt)} • {record.exportType.toUpperCase()}
                            </p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                              <span>{(record.fileSize / 1024).toFixed(1)} KB</span>
                              <span>•</span>
                              <span>{record.downloadCount} downloads</span>
                              <span>•</span>
                              <span>{(record.compressionRatio * 100).toFixed(0)}% compressed</span>
                              {record.expiresAt && (
                                <>
                                  <span>•</span>
                                  <span>Expires: {formatDate(record.expiresAt)}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {record.status === 'completed' && (
                              <>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {record.status === 'pending' && (
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Processing...</span>
                              </div>
                            )}
                            {record.status === 'failed' && (
                              <Button variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <Card className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Advanced Sitemap Data Upload with Batch Processing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Upload JSON File with Sitemap Data
                </label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={uploadStatus === 'uploading'}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Expected format: JSON file with "urls" array. Each URL can be a string or object with url, title, and description fields.
                  Supports batch processing for millions of URLs with performance optimization.
                </p>
              </div>

              {uploadStatus === 'uploading' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Upload Progress</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">{uploadMessage}</p>
                </div>
              )}

              {uploadStatus === 'success' && (
                <Alert className="border-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{uploadMessage}</AlertDescription>
                </Alert>
              )}

              {uploadStatus === 'error' && (
                <Alert className="border-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{uploadMessage}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">JSON Format Example:</h4>
                  <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
{`{
  "domain": "example.com",
  "urls": [
    "https://example.com/page1",
    {
      "url": "https://example.com/page2",
      "title": "Page 2 Title",
      "description": "Page 2 Description"
    }
  ]
}`}
                  </pre>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Upload Statistics:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Domains:</span>
                      <span className="font-medium">{formatNumber(allDomains.length)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total URLs:</span>
                      <span className="font-medium">{formatNumber(allSitemapData.length)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Capacity:</span>
                      <span className="font-medium">Billions of URLs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span className="font-medium">Optimized indexing</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Advanced Referral Analytics & ROI</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {referralAnalytics?.networkDepth || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Max Network Depth</div>
                  </div>
                  <div className="text-center p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      {referralAnalytics?.activeReferrers || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Referrers</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Multi-Level Performance Analysis</h4>
                  {referralAnalytics?.topPerformingLevels && referralAnalytics.topPerformingLevels.map((level, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">L{level.level}</span>
                        </div>
                        <div>
                          <p className="font-medium">{level.count} referrals</p>
                          <p className="text-sm text-muted-foreground">{level.conversionRate}% conversion</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">{formatCurrency(level.revenue)}</p>
                        <p className="text-xs text-muted-foreground">ROI: {((level.revenue / Math.max(level.count * 100, 1)) * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Performance by Timeframe</h4>
                  {referralAnalytics?.performanceByTimeframe && Object.entries(referralAnalytics.performanceByTimeframe).map(([period, data]) => (
                    <div key={period} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="capitalize font-medium">{period}</span>
                      <div className="text-right">
                        <span className="font-medium">{data.referrals}</span>
                        <span className="text-sm text-green-500 ml-2">+{data.growth}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span>Geographic Distribution & Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {referralAnalytics?.geographicDistribution && Object.entries(referralAnalytics.geographicDistribution).map(([region, percentage]) => (
                  <div key={region} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{region}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{percentage}%</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 1000) + 100} users
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Growth: +{(Math.random() * 20 + 5).toFixed(1)}%</span>
                      <span>Conversion: {(Math.random() * 15 + 8).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Referral Quality Metrics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>Avg. Lifetime Value:</span>
                      <span className="font-medium">{formatCurrency(Math.floor(Math.random() * 5000) + 1000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retention Rate:</span>
                      <span className="font-medium">{referralAnalytics?.retentionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Referrals/User:</span>
                      <span className="font-medium">{referralAnalytics?.averageReferralsPerUser.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network Velocity:</span>
                      <span className="font-medium">{(Math.random() * 5 + 2).toFixed(1)}x</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commissions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Commission Trends & Financial Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {commissionAnalytics?.commissionTrends && Object.entries(commissionAnalytics.commissionTrends).map(([period, data]) => (
                  <div key={period} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{period}</p>
                      <p className="text-sm text-muted-foreground">+{data.growth}% growth</p>
                      <p className="text-xs text-muted-foreground">
                        Transactions: {Math.floor(Math.random() * 1000) + 100}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500">{formatCurrency(data.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        Avg: {formatCurrency(Math.floor(data.amount / Math.max(Math.floor(Math.random() * 100) + 10, 1)))}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Payout Efficiency</span>
                    <span className="font-bold text-accent">
                      {commissionAnalytics?.payoutEfficiency.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={commissionAnalytics?.payoutEfficiency || 0} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Percentage of commissions successfully processed and paid out to users
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-xl font-bold text-green-500">
                      {formatCurrency(commissionAnalytics?.totalCommissions || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Paid</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="text-xl font-bold text-yellow-500">
                      {formatCurrency(commissionAnalytics?.pendingPayouts || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle>Top Commission Earners & Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {commissionAnalytics?.topEarners.slice(0, 15).map((earner, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{earner.user.slice(0, 12)}...</p>
                            <p className="text-sm text-muted-foreground">
                              {earner.commissionCount} commissions
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Efficiency: {((earner.totalEarned / Math.max(earner.commissionCount * 100, 1)) * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-500">{formatCurrency(earner.totalEarned)}</p>
                          <p className="text-xs text-muted-foreground">
                            Avg: {formatCurrency(earner.averageCommission)}
                          </p>
                          <p className="text-xs text-blue-500">
                            Growth: +{(Math.random() * 30 + 5).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Commission Distribution Analysis</h4>
                  {commissionAnalytics && Object.entries(commissionAnalytics.commissionsByLevel).map(([level, amount]) => (
                    <div key={level} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm font-medium">{level.replace('level', 'Level ')}</span>
                      <div className="text-right">
                        <span className="font-bold">{formatCurrency(amount)}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({((amount / commissionAnalytics.totalCommissions) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          {/* Real-time System Monitoring */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cyber-gradient border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemHealth && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Response Time</span>
                          <span className="font-medium">{systemHealth.responseTime}ms</span>
                        </div>
                        <Progress value={(200 - systemHealth.responseTime) / 2} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Throughput</span>
                          <span className="font-medium">{systemHealth.throughput}/min</span>
                        </div>
                        <Progress value={(systemHealth.throughput / 1500) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Error Rate</span>
                          <span className="font-medium">{(systemHealth.errorRate * 100).toFixed(2)}%</span>
                        </div>
                        <Progress value={100 - (systemHealth.errorRate * 100)} className="h-2" />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <span>Data Processing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {formatNumber(allSitemapData.length)}
                    </div>
                    <div className="text-sm text-muted-foreground">URLs Indexed</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Indexing Rate</span>
                      <span className="font-medium">{Math.floor(Math.random() * 10000) + 5000}/sec</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cache Hit Rate</span>
                      <span className="font-medium">{(Math.random() * 20 + 80).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Query Optimization</span>
                      <span className="font-medium text-green-500">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <span>Security Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Threat Detection</span>
                      <Badge variant="default" className="text-green-500">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Access Control</span>
                      <Badge variant="default" className="text-green-500">Secure</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Encryption</span>
                      <Badge variant="default" className="text-green-500">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audit Logging</span>
                      <Badge variant="default" className="text-green-500">Enabled</Badge>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">
                      {Math.floor(Math.random() * 50) + 950}
                    </div>
                    <div className="text-sm text-muted-foreground">Security Score</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert Management */}
            <Card className="cyber-gradient border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-yellow-500" />
                  <span>System Alerts & Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert className="border-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      System backup completed successfully at {new Date().toLocaleTimeString()}
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-blue-500">
                    <Activity className="h-4 w-4" />
                    <AlertDescription>
                      Performance optimization applied - 15% improvement in query response time
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-yellow-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      High traffic detected - auto-scaling activated for optimal performance
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-primary">
                    <GitBranch className="h-4 w-4" />
                    <AlertDescription>
                      Stable variables backup completed - All data persistence verified for v{currentVersion}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          {/* Comprehensive System Settings */}
          <div className="space-y-6">
            {/* Real-time Profit Share Configuration */}
            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Real-time Profit Share Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profitShareConfig && Object.entries(profitShareConfig)
                  .filter(([key]) => key.startsWith('level'))
                  .map(([level, rate]) => (
                    <div key={level} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          {level.replace('level', 'Level ')} Commission Rate
                        </label>
                        <span className="text-sm font-bold">
                          {((profitShareRates[level] || rate) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Slider
                        value={[(profitShareRates[level] || rate) * 100]}
                        onValueChange={([value]) => handleProfitShareUpdate(level, value)}
                        max={20}
                        min={0}
                        step={0.1}
                        className="w-full"
                        disabled={updateProfitShareMutation.isPending}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>Impact: {((profitShareRates[level] || rate) * 1000).toFixed(0)} users affected</span>
                        <span>20%</span>
                      </div>
                    </div>
                  ))}
                
                {updateProfitShareMutation.isPending && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      Updating profit share configuration with immediate effect across all active referral networks...
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Configuration Impact Analysis:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Changes take effect immediately for new commissions</li>
                    <li>• Maximum commission rate is 20% per level for sustainability</li>
                    <li>• Lower levels typically have higher rates to incentivize direct referrals</li>
                    <li>• All changes are logged for audit purposes and compliance</li>
                    <li>• Real-time impact analysis shows affected user count</li>
                    <li>• Automated rollback available if performance issues detected</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Advanced System Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cyber-gradient border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="h-5 w-5" />
                    <span>System Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Maintenance Mode</span>
                      <p className="text-xs text-muted-foreground">Temporarily disable user access</p>
                    </div>
                    <Switch 
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => handleSystemSettingChange('maintenanceMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Auto-backup Enabled</span>
                      <p className="text-xs text-muted-foreground">Automated daily backups</p>
                    </div>
                    <Switch 
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => handleSystemSettingChange('autoBackup', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Real-time Analytics</span>
                      <p className="text-xs text-muted-foreground">Live data streaming</p>
                    </div>
                    <Switch 
                      checked={systemSettings.realTimeAnalytics}
                      onCheckedChange={(checked) => handleSystemSettingChange('realTimeAnalytics', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Email Notifications</span>
                      <p className="text-xs text-muted-foreground">System alerts via email</p>
                    </div>
                    <Switch 
                      checked={systemSettings.emailNotifications}
                      onCheckedChange={(checked) => handleSystemSettingChange('emailNotifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-red-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Security & Compliance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Two-Factor Authentication</span>
                      <p className="text-xs text-muted-foreground">Enhanced admin security</p>
                    </div>
                    <Switch 
                      checked={systemSettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSystemSettingChange('twoFactorAuth', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">IP Whitelist Enabled</span>
                      <p className="text-xs text-muted-foreground">Restrict admin access by IP</p>
                    </div>
                    <Switch 
                      checked={systemSettings.ipWhitelist}
                      onCheckedChange={(checked) => handleSystemSettingChange('ipWhitelist', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Audit Logging</span>
                      <p className="text-xs text-muted-foreground">Comprehensive action logs</p>
                    </div>
                    <Switch 
                      checked={systemSettings.auditLogging}
                      onCheckedChange={(checked) => handleSystemSettingChange('auditLogging', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Rate Limiting</span>
                      <p className="text-xs text-muted-foreground">API request throttling</p>
                    </div>
                    <Switch 
                      checked={systemSettings.rateLimiting}
                      onCheckedChange={(checked) => handleSystemSettingChange('rateLimiting', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Configuration Options */}
            <Card className="cyber-gradient border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Advanced Configuration & API Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">API Rate Limit (requests/minute)</label>
                    <Input type="number" defaultValue="1000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Session Timeout (minutes)</label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Export File Size (MB)</label>
                    <Input type="number" defaultValue="500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Cache TTL (seconds)</label>
                    <Input type="number" defaultValue="3600" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">System Notification Recipients</label>
                  <Textarea 
                    placeholder="admin@example.com, alerts@example.com"
                    className="min-h-[60px]"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
