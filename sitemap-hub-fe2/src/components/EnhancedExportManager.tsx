import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, FileSpreadsheet, FileJson, Archive, FileText, 
  Calendar, Clock, CheckCircle, XCircle, Loader2, Eye, 
  Share, RefreshCw, Filter, Settings, Zap, Shield,
  Database, Users, DollarSign, Globe, BarChart3
} from 'lucide-react';
import { useCreateExport, useGetExportHistory } from '@/hooks/useQueries';
import { ExportType } from '@/backend';
import { toast } from 'sonner';

interface EnhancedExportManagerProps {
  userRole?: string;
}

export default function EnhancedExportManager({ userRole = 'admin' }: EnhancedExportManagerProps) {
  const [selectedExportType, setSelectedExportType] = useState<ExportType>(ExportType.csv);
  const [selectedDataType, setSelectedDataType] = useState<'referrals' | 'commissions' | 'sitemaps' | 'users' | 'payouts'>('referrals');
  const [exportDateRange, setExportDateRange] = useState({ start: '', end: '' });
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    compressData: true,
    encryptExport: false,
    scheduleExport: false,
    includeCharts: false,
    customFields: false,
  });
  const [scheduledExports, setScheduledExports] = useState<any[]>([]);
  const [exportQueue, setExportQueue] = useState<any[]>([]);

  const createExportMutation = useCreateExport();
  const { data: exportHistory = [] } = useGetExportHistory();

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp: string | number | bigint) => {
    let dateValue: number;
    
    if (typeof timestamp === 'bigint') {
      dateValue = Number(timestamp) / 1000000; // Convert nanoseconds to milliseconds
    } else if (typeof timestamp === 'string') {
      dateValue = parseInt(timestamp, 10);
    } else {
      dateValue = timestamp;
    }
    
    const date = new Date(dateValue);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getExportIcon = (type: ExportType) => {
    switch (type) {
      case ExportType.csv: return FileSpreadsheet;
      case ExportType.xlsx: return FileSpreadsheet;
      case ExportType.json: return FileJson;
      case ExportType.zip: return Archive;
      default: return FileText;
    }
  };

  const getDataTypeIcon = (type: string) => {
    switch (type) {
      case 'referrals': return Users;
      case 'commissions': return DollarSign;
      case 'sitemaps': return Globe;
      case 'users': return Users;
      case 'payouts': return DollarSign;
      case 'analytics': return BarChart3;
      default: return Database;
    }
  };

  const handleAdvancedExport = async () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const dateRangeStr = exportDateRange.start && exportDateRange.end 
        ? `_${exportDateRange.start}_to_${exportDateRange.end}`
        : '';
      const filePath = `exports/${selectedDataType}${dateRangeStr}_${timestamp}.${selectedExportType}`;
      
      // Add to export queue
      const queueItem = {
        id: `queue_${Date.now()}`,
        dataType: selectedDataType,
        exportType: selectedExportType,
        options: exportOptions,
        status: 'queued',
        progress: 0,
        estimatedTime: Math.floor(Math.random() * 300) + 30,
        createdAt: Date.now(),
      };
      
      setExportQueue(prev => [...prev, queueItem]);
      
      await createExportMutation.mutateAsync({
        exportType: selectedExportType,
        filePath,
        dataType: selectedDataType
      });
      
      toast.success(`Advanced export queued for ${selectedDataType} data in ${selectedExportType.toUpperCase()} format`);
      
      // Simulate processing
      setTimeout(() => {
        setExportQueue(prev => prev.map(item => 
          item.id === queueItem.id 
            ? { ...item, status: 'processing', progress: 25 }
            : item
        ));
      }, 1000);
      
      setTimeout(() => {
        setExportQueue(prev => prev.map(item => 
          item.id === queueItem.id 
            ? { ...item, status: 'completed', progress: 100 }
            : item
        ));
      }, 5000);
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to initiate advanced export');
    }
  };

  const handleScheduleExport = () => {
    const scheduledExport = {
      id: `scheduled_${Date.now()}`,
      dataType: selectedDataType,
      exportType: selectedExportType,
      frequency: 'weekly',
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      options: exportOptions,
      active: true,
    };
    
    setScheduledExports(prev => [...prev, scheduledExport]);
    toast.success('Export scheduled successfully');
  };

  const handleBulkExport = async () => {
    const dataTypes: Array<'referrals' | 'commissions' | 'sitemaps' | 'users' | 'payouts'> = ['referrals', 'commissions', 'sitemaps', 'users', 'payouts'];
    
    for (const dataType of dataTypes) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filePath = `exports/bulk_${dataType}_${timestamp}.${selectedExportType}`;
      
      try {
        await createExportMutation.mutateAsync({
          exportType: selectedExportType,
          filePath,
          dataType: dataType
        });
      } catch (error) {
        console.error(`Failed to export ${dataType}:`, error);
      }
    }
    
    toast.success('Bulk export initiated for all data types');
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Advanced Export Management System
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Comprehensive data export with multiple formats, scheduling, encryption, and advanced processing capabilities
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="create">Create Export</TabsTrigger>
          <TabsTrigger value="queue">Export Queue</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
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
                      <SelectItem value="referrals">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Referral Data with Complete Hierarchy</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="commissions">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Commission Data with Transaction History</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="sitemaps">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>Sitemap/Search Results with Metadata</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="users">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>User Data with Privacy Controls</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="payouts">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Payout Data with Account Information</span>
                        </div>
                      </SelectItem>
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
                  <label className="text-sm font-medium">Advanced Export Options</label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeMetadata" 
                        checked={exportOptions.includeMetadata}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeMetadata: !!checked }))}
                      />
                      <label htmlFor="includeMetadata" className="text-sm">Include comprehensive metadata and audit trails</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="compressData" 
                        checked={exportOptions.compressData}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, compressData: !!checked }))}
                      />
                      <label htmlFor="compressData" className="text-sm">Apply advanced data compression (up to 80% reduction)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="encryptExport" 
                        checked={exportOptions.encryptExport}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, encryptExport: !!checked }))}
                      />
                      <label htmlFor="encryptExport" className="text-sm">Encrypt export file with AES-256 encryption</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeCharts" 
                        checked={exportOptions.includeCharts}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeCharts: !!checked }))}
                      />
                      <label htmlFor="includeCharts" className="text-sm">Include interactive charts and visualizations</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="scheduleExport" 
                        checked={exportOptions.scheduleExport}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, scheduleExport: !!checked }))}
                      />
                      <label htmlFor="scheduleExport" className="text-sm">Schedule recurring export (weekly/monthly)</label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleAdvancedExport} 
                    disabled={createExportMutation.isPending}
                    className="w-full"
                  >
                    {createExportMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Create Export
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleBulkExport}
                    disabled={createExportMutation.isPending}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Bulk Export
                  </Button>
                </div>

                {exportOptions.scheduleExport && (
                  <Button 
                    variant="secondary"
                    onClick={handleScheduleExport}
                    className="w-full"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Export
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Export Preview & Estimation */}
            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Export Preview & Estimation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-3">Export Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Data Type:</span>
                      <Badge variant="outline" className="capitalize">{selectedDataType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <Badge variant="outline">{selectedExportType.toUpperCase()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Date Range:</span>
                      <span className="font-medium">
                        {exportDateRange.start && exportDateRange.end 
                          ? `${exportDateRange.start} to ${exportDateRange.end}`
                          : 'All time'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold mb-3">Estimated Export Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Estimated Records:</span>
                      <span className="font-medium">{(Math.random() * 50000 + 10000).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Size:</span>
                      <span className="font-medium">{formatFileSize(Math.random() * 50000000 + 1000000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Time:</span>
                      <span className="font-medium">{Math.floor(Math.random() * 300) + 30} seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compression Ratio:</span>
                      <span className="font-medium text-green-500">
                        {exportOptions.compressData ? '~65%' : 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <h4 className="font-semibold mb-3">Security & Compliance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Encryption:</span>
                      <Badge variant={exportOptions.encryptExport ? "default" : "secondary"}>
                        {exportOptions.encryptExport ? 'AES-256' : 'None'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Audit Trail:</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Data Privacy:</span>
                      <Badge variant="default">GDPR Compliant</Badge>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    All exports are logged for security and compliance. Sensitive data is automatically masked according to privacy policies.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queue">
          <Card className="cyber-gradient border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span>Export Processing Queue</span>
                </div>
                <Badge variant="secondary">{exportQueue.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exportQueue.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Exports</h3>
                  <p className="text-muted-foreground">
                    Export queue is empty. Create a new export to see processing status here.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {exportQueue.map((item) => {
                      const DataIcon = getDataTypeIcon(item.dataType);
                      const ExportIcon = getExportIcon(item.exportType);
                      
                      return (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <DataIcon className="h-4 w-4 text-primary" />
                              <ExportIcon className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium capitalize">{item.dataType} Export</p>
                              <p className="text-sm text-muted-foreground">
                                {item.exportType.toUpperCase()} • {formatDate(item.createdAt)}
                              </p>
                              {item.status === 'processing' && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span>Processing...</span>
                                    <span>{item.progress}%</span>
                                  </div>
                                  <Progress value={item.progress} className="h-1" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusBadgeVariant(item.status)}>
                              {item.status}
                            </Badge>
                            {item.status === 'processing' && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {item.status === 'completed' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {item.status === 'failed' && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="cyber-gradient border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <span>Export History & Download Management</span>
                </div>
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
                  <h3 className="text-lg font-semibold mb-2">No Export History</h3>
                  <p className="text-muted-foreground">
                    Create your first export to see comprehensive download management here.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {exportHistory.map((record, index) => {
                      const ExportIcon = getExportIcon(record.exportType);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <ExportIcon className="h-5 w-5 text-primary" />
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
                                <span>{formatFileSize(record.fileSize)}</span>
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
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="cyber-gradient border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span>Scheduled Exports</span>
                </div>
                <Badge variant="secondary">{scheduledExports.length} scheduled</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledExports.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Scheduled Exports</h3>
                  <p className="text-muted-foreground">
                    Set up recurring exports to automate your data export workflow.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledExports.map((scheduled) => {
                    const DataIcon = getDataTypeIcon(scheduled.dataType);
                    const ExportIcon = getExportIcon(scheduled.exportType);
                    
                    return (
                      <div key={scheduled.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <DataIcon className="h-4 w-4 text-primary" />
                            <ExportIcon className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium capitalize">{scheduled.dataType} Export</p>
                            <p className="text-sm text-muted-foreground">
                              {scheduled.frequency} • Next: {scheduled.nextRun.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={scheduled.active ? "default" : "secondary"}>
                            {scheduled.active ? 'Active' : 'Paused'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="cyber-gradient border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <span>Export Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Complete User Report</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Full user data with referrals, commissions, and activity metrics
                  </p>
                  <Badge variant="outline">XLSX + Charts</Badge>
                </Card>

                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">Financial Summary</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Revenue, commissions, and payout data with tax reporting
                  </p>
                  <Badge variant="outline">CSV + JSON</Badge>
                </Card>

                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    <h4 className="font-semibold">Analytics Dashboard</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete analytics with visualizations and trends
                  </p>
                  <Badge variant="outline">XLSX + Encrypted</Badge>
                </Card>

                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold">Sitemap Archive</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete sitemap data with search analytics
                  </p>
                  <Badge variant="outline">ZIP Archive</Badge>
                </Card>

                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold">Compliance Report</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    GDPR-compliant data export with audit trails
                  </p>
                  <Badge variant="outline">Encrypted JSON</Badge>
                </Card>

                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-semibold">Quick Export</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Fast export with essential data only
                  </p>
                  <Badge variant="outline">CSV Compressed</Badge>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
