import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  ExternalLink,
  Info,
  CheckCircle2,
  XCircle,
  Loader2,
  TrendingUp,
  Users,
  Eye,
  Settings
} from 'lucide-react';
import { useGetCallerUserRole } from '@/hooks/useQueries';
import { useFeatureChecklist } from '@/hooks/useFeatureChecklist';
import { FeaturePriority, FeatureStatus } from '@/backend';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'gods-eye' | 'admin' | 'analytics' | 'exports' | 'monitoring' | 'admin-panel' | 'feature-checklist';

interface FeatureChecklistPageProps {
  onNavigate: (page: Page) => void;
}

const priorityConfig = {
  [FeaturePriority.p1]: { label: 'P1 - Critical', color: 'bg-red-500', textColor: 'text-red-500' },
  [FeaturePriority.p2]: { label: 'P2 - High', color: 'bg-orange-500', textColor: 'text-orange-500' },
  [FeaturePriority.p3]: { label: 'P3 - Medium', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  [FeaturePriority.p4]: { label: 'P4 - Low', color: 'bg-green-500', textColor: 'text-green-500' },
};

const statusConfig = {
  [FeatureStatus.complete]: { label: 'Complete', icon: CheckCircle2, color: 'bg-green-500', textColor: 'text-green-500' },
  [FeatureStatus.inProgress]: { label: 'In Progress', icon: Clock, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  [FeatureStatus.pending]: { label: 'Pending', icon: XCircle, color: 'bg-red-500', textColor: 'text-red-500' },
};

export default function FeatureChecklistPage({ onNavigate }: FeatureChecklistPageProps) {
  const { data: userRole } = useGetCallerUserRole();
  const {
    featureChecklist,
    featureChecklistSummary,
    overallProgress,
    isLoading,
    updateFeatureStatus,
    bulkUpdateFeatures,
    exportChecklistData,
    initializeDefaultFeatures,
  } = useFeatureChecklist();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<FeaturePriority | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<FeatureStatus | 'all'>('all');
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState<FeatureStatus>(FeatureStatus.pending);

  const isAdmin = userRole === 'admin';

  // Initialize default features on first load
  useEffect(() => {
    if (isAdmin && featureChecklist.length === 0) {
      initializeDefaultFeatures();
    }
  }, [isAdmin, featureChecklist.length, initializeDefaultFeatures]);

  // Filter features based on search and filters
  const filteredFeatures = featureChecklist.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.moduleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || feature.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || feature.status === selectedStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleFeatureToggle = (featureId: number) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFeatures.length === filteredFeatures.length) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(filteredFeatures.map(f => Number(f.id)));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedFeatures.length === 0) return;
    
    await bulkUpdateFeatures(selectedFeatures, bulkStatus);
    setSelectedFeatures([]);
  };

  const handleNavigateToModule = (moduleName: string, page: string) => {
    // Map module names to actual page routes
    const pageMap: Record<string, Page> = {
      'Authentication': 'dashboard',
      'Subscription System': 'subscription',
      'Search Functionality': 'sitemaps',
      'Referral System': 'referrals',
      'Admin Panel': 'admin-panel',
      'Analytics': 'analytics',
      'Export System': 'exports',
      'Monitoring': 'monitoring',
      'God\'s Eye Summary': 'gods-eye',
    };
    
    const targetPage = pageMap[moduleName] || 'home';
    onNavigate(targetPage);
  };

  const handleExportData = async () => {
    await exportChecklistData();
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              The Feature Checklist is only accessible to administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2 flex items-center justify-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Public Progress Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{overallProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Platform development is actively progressing with regular feature updates and improvements.
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={() => onNavigate('home')} variant="outline">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CheckSquare className="h-8 w-8 text-primary" />
              Feature Checklist
            </h1>
            <p className="text-muted-foreground mt-1">
              Track implementation progress of all platform features organized by priority levels
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
              <Progress value={overallProgress} className="mt-2" />
            </CardContent>
          </Card>
          
          {featureChecklistSummary.map((summary) => (
            <Card key={summary.priority}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${priorityConfig[summary.priority].color}`} />
                  {priorityConfig[summary.priority].label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.progressPercentage.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Number(summary.complete)}/{Number(summary.total)} features
                </div>
                <Progress value={summary.progressPercentage} className="mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search features, descriptions, or modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as FeaturePriority | 'all')}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Priorities</option>
                  <option value={FeaturePriority.p1}>P1 - Critical</option>
                  <option value={FeaturePriority.p2}>P2 - High</option>
                  <option value={FeaturePriority.p3}>P3 - Medium</option>
                  <option value={FeaturePriority.p4}>P4 - Low</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as FeatureStatus | 'all')}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Statuses</option>
                  <option value={FeatureStatus.complete}>Complete</option>
                  <option value={FeatureStatus.inProgress}>In Progress</option>
                  <option value={FeatureStatus.pending}>Pending</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Operations */}
        {selectedFeatures.length > 0 && (
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>{selectedFeatures.length} features selected</span>
                <div className="flex items-center gap-2">
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value as FeatureStatus)}
                    className="px-2 py-1 border rounded text-sm bg-background"
                  >
                    <option value={FeatureStatus.pending}>Mark as Pending</option>
                    <option value={FeatureStatus.inProgress}>Mark as In Progress</option>
                    <option value={FeatureStatus.complete}>Mark as Complete</option>
                  </select>
                  <Button onClick={handleBulkUpdate} size="sm">
                    Update Selected
                  </Button>
                  <Button onClick={() => setSelectedFeatures([])} variant="outline" size="sm">
                    Clear Selection
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Feature List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Features</TabsTrigger>
            <TabsTrigger value={FeaturePriority.p1}>P1 - Critical</TabsTrigger>
            <TabsTrigger value={FeaturePriority.p2}>P2 - High</TabsTrigger>
            <TabsTrigger value={FeaturePriority.p3}>P3 - Medium</TabsTrigger>
            <TabsTrigger value={FeaturePriority.p4}>P4 - Low</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <FeatureList 
              features={filteredFeatures}
              selectedFeatures={selectedFeatures}
              onFeatureToggle={handleFeatureToggle}
              onSelectAll={handleSelectAll}
              onStatusUpdate={updateFeatureStatus}
              onNavigateToModule={handleNavigateToModule}
              isLoading={isLoading}
            />
          </TabsContent>

          {([FeaturePriority.p1, FeaturePriority.p2, FeaturePriority.p3, FeaturePriority.p4]).map((priority) => (
            <TabsContent key={priority} value={priority} className="space-y-4">
              <FeatureList 
                features={filteredFeatures.filter(f => f.priority === priority)}
                selectedFeatures={selectedFeatures}
                onFeatureToggle={handleFeatureToggle}
                onSelectAll={handleSelectAll}
                onStatusUpdate={updateFeatureStatus}
                onNavigateToModule={handleNavigateToModule}
                isLoading={isLoading}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

interface FeatureListProps {
  features: any[];
  selectedFeatures: number[];
  onFeatureToggle: (id: number) => void;
  onSelectAll: () => void;
  onStatusUpdate: (id: number, status: FeatureStatus) => void;
  onNavigateToModule: (moduleName: string, page: string) => void;
  isLoading: boolean;
}

function FeatureList({ 
  features, 
  selectedFeatures, 
  onFeatureToggle, 
  onSelectAll, 
  onStatusUpdate, 
  onNavigateToModule,
  isLoading 
}: FeatureListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading features...
        </CardContent>
      </Card>
    );
  }

  if (features.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Features Found</h3>
          <p className="text-muted-foreground">
            No features match your current search and filter criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Features ({features.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedFeatures.length === features.length && features.length > 0}
              onCheckedChange={onSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {features.map((feature) => (
              <FeatureItem
                key={Number(feature.id)}
                feature={feature}
                isSelected={selectedFeatures.includes(Number(feature.id))}
                onToggle={() => onFeatureToggle(Number(feature.id))}
                onStatusUpdate={onStatusUpdate}
                onNavigateToModule={onNavigateToModule}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface FeatureItemProps {
  feature: any;
  isSelected: boolean;
  onToggle: () => void;
  onStatusUpdate: (id: number, status: FeatureStatus) => void;
  onNavigateToModule: (moduleName: string, page: string) => void;
}

function FeatureItem({ feature, isSelected, onToggle, onStatusUpdate, onNavigateToModule }: FeatureItemProps) {
  const StatusIcon = statusConfig[feature.status].icon;
  
  return (
    <div className={`border rounded-lg p-4 transition-colors ${isSelected ? 'bg-accent/50 border-primary' : 'hover:bg-accent/20'}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{feature.title}</h3>
              <Badge variant="outline" className={priorityConfig[feature.priority].textColor}>
                {priorityConfig[feature.priority].label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${statusConfig[feature.status].textColor}`} />
              <select
                value={feature.status}
                onChange={(e) => onStatusUpdate(Number(feature.id), e.target.value as FeatureStatus)}
                className="px-2 py-1 border rounded text-sm bg-background"
              >
                <option value={FeatureStatus.pending}>Pending</option>
                <option value={FeatureStatus.inProgress}>In Progress</option>
                <option value={FeatureStatus.complete}>Complete</option>
              </select>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{feature.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Module: {feature.moduleName}</span>
            <span>Page: {feature.page}</span>
            <span>Updated: {new Date(Number(feature.updatedAt) / 1000000).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <div className="space-y-2">
                    <p><strong>Documentation:</strong> {feature.documentation}</p>
                    <p><strong>Integration Guidelines:</strong> {feature.integrationGuidelines}</p>
                    <p><strong>Development Notes:</strong> {feature.developmentNotes}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateToModule(feature.moduleName, feature.page)}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Go to Module
              </Button>
            </div>
            
            <Badge variant={feature.status === FeatureStatus.complete ? 'default' : 'secondary'}>
              {statusConfig[feature.status].label}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
