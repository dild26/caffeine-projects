import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  Activity,
  Database,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useGetAllAppManagementEntries, useCreateAppManagementEntry, useUpdateAppManagementEntry, useDeleteAppManagementEntry, useGetAllRemotePageData, useGetAllComparisonAnalyses, useFetchRemotePageData } from '../hooks/useRemotePageIntegration';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['draft', 'publish', 'suspend', 'archive', 'error', 'pending', 'validate', 'approve', 'reject'];

const SECOINFI_SUBDOMAINS = [
  'infytask-mia',
  'map-56b',
  'n8n-tasks-c2i',
  'n8n-workflows-6sy',
  'sitemaps-fwh',
  'e-contracts-bqe',
  'secoin-ep6'
];

export default function RemotePageIntegration() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncCountdown, setSyncCountdown] = useState(60);

  const { data: appEntries = [], isLoading: entriesLoading, refetch: refetchEntries } = useGetAllAppManagementEntries();
  const { data: remotePageData = [], isLoading: remoteDataLoading, refetch: refetchRemoteData } = useGetAllRemotePageData();
  const { data: comparisonAnalyses = [], isLoading: analysesLoading, refetch: refetchAnalyses } = useGetAllComparisonAnalyses();
  
  const createMutation = useCreateAppManagementEntry();
  const updateMutation = useUpdateAppManagementEntry();
  const deleteMutation = useDeleteAppManagementEntry();
  const fetchRemoteDataMutation = useFetchRemotePageData();

  // Auto-sync every 60 seconds
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const interval = setInterval(() => {
      setSyncCountdown(prev => {
        if (prev <= 1) {
          handleSyncAll();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoSyncEnabled]);

  const handleSyncAll = async () => {
    toast.info('Starting sync for all apps...');
    
    for (const entry of appEntries) {
      try {
        await fetchRemoteDataMutation.mutateAsync({
          subdomain: entry.subdomain,
          url: entry.url
        });
      } catch (error) {
        console.error(`Failed to sync ${entry.subdomain}:`, error);
      }
    }
    
    await refetchRemoteData();
    await refetchAnalyses();
    toast.success('Sync completed for all apps');
  };

  const handleAddEntry = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('App entry created successfully');
      setIsAddDialogOpen(false);
      refetchEntries();
    } catch (error: any) {
      toast.error(`Failed to create entry: ${error.message}`);
    }
  };

  const handleUpdateEntry = async (data: any) => {
    try {
      await updateMutation.mutateAsync(data);
      toast.success('App entry updated successfully');
      setIsEditDialogOpen(false);
      setSelectedEntry(null);
      refetchEntries();
    } catch (error: any) {
      toast.error(`Failed to update entry: ${error.message}`);
    }
  };

  const handleDeleteEntry = async (entryId: bigint) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await deleteMutation.mutateAsync(entryId);
      toast.success('App entry deleted successfully');
      refetchEntries();
    } catch (error: any) {
      toast.error(`Failed to delete entry: ${error.message}`);
    }
  };

  const handleFetchRemoteData = async (subdomain: string, url: string) => {
    try {
      toast.info(`Fetching data from ${subdomain}...`);
      await fetchRemoteDataMutation.mutateAsync({ subdomain, url });
      await refetchRemoteData();
      toast.success(`Data fetched successfully from ${subdomain}`);
    } catch (error: any) {
      toast.error(`Failed to fetch data: ${error.message}`);
    }
  };

  const sortedEntries = [...appEntries].sort((a, b) => a.subdomain.localeCompare(b.subdomain));

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500',
      publish: 'bg-green-500',
      suspend: 'bg-yellow-500',
      archive: 'bg-gray-400',
      error: 'bg-red-500',
      pending: 'bg-blue-500',
      validate: 'bg-purple-500',
      approve: 'bg-green-600',
      reject: 'bg-red-600'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getRemoteDataForSubdomain = (subdomain: string) => {
    return remotePageData.find(data => data.subdomain === subdomain);
  };

  const getAnalysisForApp = (appId: bigint) => {
    return comparisonAnalyses.find(analysis => analysis.appId === appId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient">AI-Assisted Remote Page Integration</h2>
          <p className="text-muted-foreground mt-2">
            Dynamically discover and sync unique remote contact pages and metadata from all SECOINFI apps
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" className="neon-glow text-lg px-4 py-2">
            {appEntries.length} Apps
          </Badge>
        </div>
      </div>

      {/* Sync Status Alert */}
      <Alert className="card-3d border-2 border-blue-500/30 bg-blue-500/5">
        <Activity className="h-5 w-5 text-blue-500" />
        <AlertTitle className="text-blue-500 font-bold">
          Auto-Sync {autoSyncEnabled ? 'Enabled' : 'Disabled'}
        </AlertTitle>
        <AlertDescription className="text-sm mt-2 flex items-center justify-between">
          <span>
            {autoSyncEnabled 
              ? `Next sync in ${syncCountdown} seconds. Continuous sync every 60 seconds keeps data live.`
              : 'Auto-sync is disabled. Enable to keep data synchronized automatically.'}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
            >
              {autoSyncEnabled ? 'Disable' : 'Enable'} Auto-Sync
            </Button>
            <Button
              size="sm"
              onClick={handleSyncAll}
              disabled={fetchRemoteDataMutation.isPending}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${fetchRemoteDataMutation.isPending ? 'animate-spin' : ''}`} />
              Sync Now
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Apps</CardTitle>
            <Database className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{appEntries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">SECOINFI applications</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {appEntries.filter(e => e.status === 'publish').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Live applications</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remote Data</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{remotePageData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Fetched pages</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses</CardTitle>
            <Zap className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{comparisonAnalyses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">AI comparisons</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="apps" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="apps">Live Remote Pages</TabsTrigger>
          <TabsTrigger value="data">Remote Data</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
        </TabsList>

        {/* Apps Management Tab */}
        <TabsContent value="apps" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Admin Live Remote Pages Control Panel</h3>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="neon-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Add App Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="card-3d max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New App Entry</DialogTitle>
                  <DialogDescription>
                    Create a new SECOINFI app entry for remote page integration
                  </DialogDescription>
                </DialogHeader>
                <AppEntryForm
                  onSubmit={handleAddEntry}
                  onCancel={() => setIsAddDialogOpen(false)}
                  isSubmitting={createMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card className="card-3d">
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subdomain</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entriesLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Loading entries...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : sortedEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No app entries found. Click "Add App Entry" to create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedEntries.map((entry) => (
                        <TableRow key={entry.id.toString()}>
                          <TableCell className="font-mono text-sm">{entry.subdomain}</TableCell>
                          <TableCell className="font-medium">{entry.name}</TableCell>
                          <TableCell>
                            <a
                              href={entry.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <span className="truncate max-w-[200px]">{entry.url}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(entry.status)}>
                              {entry.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Progress value={Number(entry.progressPercentage)} className="w-24" />
                              <span className="text-xs text-muted-foreground">
                                {entry.progressPercentage.toString()}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleFetchRemoteData(entry.subdomain, entry.url)}
                                disabled={fetchRemoteDataMutation.isPending}
                              >
                                <RefreshCw className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedEntry(entry);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteEntry(entry.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Remote Data Tab */}
        <TabsContent value="data" className="space-y-4">
          <h3 className="text-xl font-semibold">Fetched Remote Page Data</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {remoteDataLoading ? (
              <Card className="card-3d col-span-2">
                <CardContent className="py-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading remote data...</p>
                </CardContent>
              </Card>
            ) : remotePageData.length === 0 ? (
              <Card className="card-3d col-span-2">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No remote data fetched yet. Click "Sync Now" to fetch data from all apps.
                </CardContent>
              </Card>
            ) : (
              remotePageData.map((data) => (
                <Card key={data.id.toString()} className="card-3d card-3d-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{data.subdomain}</CardTitle>
                        <CardDescription className="mt-1 break-all">{data.url}</CardDescription>
                      </div>
                      <Badge className={data.status === 'success' ? 'bg-green-500' : 'bg-red-500'}>
                        {data.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.contactInfo ? (
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">CEO:</span> {data.contactInfo.ceoName}
                        </div>
                        <div>
                          <span className="font-semibold">Email:</span> {data.contactInfo.email}
                        </div>
                        <div>
                          <span className="font-semibold">Phone:</span> {data.contactInfo.phone}
                        </div>
                        <div>
                          <span className="font-semibold">Address:</span> {data.contactInfo.businessAddress}
                        </div>
                        <Separator />
                        <div className="text-xs text-muted-foreground">
                          Fetched: {new Date(Number(data.fetchedAt) / 1000000).toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {data.error || 'No contact information available'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <h3 className="text-xl font-semibold">AI Comparison Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {analysesLoading ? (
              <Card className="card-3d col-span-2">
                <CardContent className="py-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading analyses...</p>
                </CardContent>
              </Card>
            ) : comparisonAnalyses.length === 0 ? (
              <Card className="card-3d col-span-2">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No AI analyses available yet. Analyses are generated automatically during data sync.
                </CardContent>
              </Card>
            ) : (
              comparisonAnalyses.map((analysis) => (
                <Card key={analysis.id.toString()} className="card-3d card-3d-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">App ID: {analysis.appId.toString()}</CardTitle>
                      <Badge className="bg-purple-500">
                        Score: {analysis.accuracyScore.toString()}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Functionalities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.functionalities.map((func, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {func}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="text-xs text-muted-foreground">
                      Analyzed: {new Date(Number(analysis.analyzedAt) / 1000000).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {selectedEntry && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="card-3d max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit App Entry</DialogTitle>
              <DialogDescription>
                Update the SECOINFI app entry details
              </DialogDescription>
            </DialogHeader>
            <AppEntryForm
              initialData={selectedEntry}
              onSubmit={handleUpdateEntry}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedEntry(null);
              }}
              isSubmitting={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface AppEntryFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function AppEntryForm({ initialData, onSubmit, onCancel, isSubmitting }: AppEntryFormProps) {
  const [formData, setFormData] = useState({
    subdomain: initialData?.subdomain || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'draft',
    progressPercentage: initialData?.progressPercentage?.toString() || '0'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (initialData) {
      onSubmit({
        entryId: initialData.id,
        ...formData,
        progressPercentage: BigInt(formData.progressPercentage)
      });
    } else {
      onSubmit({
        ...formData,
        progressPercentage: BigInt(formData.progressPercentage)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subdomain">Subdomain</Label>
        <Select
          value={formData.subdomain}
          onValueChange={(value) => setFormData({ ...formData, subdomain: value })}
          disabled={!!initialData}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select subdomain" />
          </SelectTrigger>
          <SelectContent>
            {SECOINFI_SUBDOMAINS.map((subdomain) => (
              <SelectItem key={subdomain} value={subdomain}>
                {subdomain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">App Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter app name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter app description"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="progress">Progress Percentage (0-100)</Label>
        <Input
          id="progress"
          type="number"
          min="0"
          max="100"
          value={formData.progressPercentage}
          onChange={(e) => setFormData({ ...formData, progressPercentage: e.target.value })}
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            initialData ? 'Update Entry' : 'Create Entry'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
