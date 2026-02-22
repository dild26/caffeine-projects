import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Radio, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  Activity,
  Zap,
  Globe,
  Code,
  RefreshCw,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useGetAllBroadcastPages, useCreateBroadcastPage, useUpdateBroadcastPage, useDeleteBroadcastPage, useBroadcastToApps } from '../hooks/useBroadcastPages';
import { useGetAppsFromPages } from '../hooks/useAppQueries';
import { toast } from 'sonner';

export default function BroadcastHub() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [broadcastStatus, setBroadcastStatus] = useState<Record<string, string>>({});

  const { data: broadcastPages = [], isLoading, refetch } = useGetAllBroadcastPages();
  const { data: appsData = [] } = useGetAppsFromPages();
  const createMutation = useCreateBroadcastPage();
  const updateMutation = useUpdateBroadcastPage();
  const deleteMutation = useDeleteBroadcastPage();
  const broadcastMutation = useBroadcastToApps();

  // Extract subdomains from backend registry (single source of truth)
  const appSubdomains = appsData.map(app => app.subdomain).sort();

  const handleCreatePage = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Broadcast page created successfully');
      setIsAddDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to create page: ${error.message}`);
    }
  };

  const handleUpdatePage = async (data: any) => {
    try {
      await updateMutation.mutateAsync(data);
      toast.success('Broadcast page updated successfully');
      setIsEditDialogOpen(false);
      setSelectedPage(null);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update page: ${error.message}`);
    }
  };

  const handleDeletePage = async (pageId: bigint) => {
    if (!confirm('Are you sure you want to delete this broadcast page?')) return;
    
    try {
      await deleteMutation.mutateAsync(pageId);
      toast.success('Broadcast page deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete page: ${error.message}`);
    }
  };

  const handleBroadcast = async (page: any) => {
    toast.info(`Broadcasting "${page.name}" to ${page.targetApps.length} apps...`);
    setBroadcastStatus({});

    try {
      const result = await broadcastMutation.mutateAsync({
        pageId: page.id,
        targetApps: page.targetApps
      });

      // Update status for each app
      const statusMap: Record<string, string> = {};
      page.targetApps.forEach((app: string) => {
        statusMap[app] = '✓ Delivered';
      });
      setBroadcastStatus(statusMap);

      toast.success(`Successfully broadcast to ${page.targetApps.length} apps`);
      refetch();
    } catch (error: any) {
      toast.error(`Broadcast failed: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500',
      scheduled: 'bg-blue-500',
      broadcasting: 'bg-yellow-500',
      delivered: 'bg-green-500',
      failed: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const generateEmbedCode = (page: any, type: 'iframe' | 'object') => {
    const baseUrl = `https://moap.caffeine.ai${page.url}`;
    
    if (type === 'iframe') {
      return `<iframe 
  src="${baseUrl}" 
  width="100%" 
  height="600" 
  frameborder="0" 
  allow="cross-origin"
  style="border: none; border-radius: 8px;"
></iframe>`;
    } else {
      return `<object 
  data="${baseUrl}" 
  type="text/html" 
  width="100%" 
  height="600"
  style="border: none; border-radius: 8px;"
>
  <p>Your browser doesn't support embedded content. <a href="${baseUrl}">View page</a></p>
</object>`;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const publishedPages = broadcastPages.filter(p => p.broadcastStatus === 'delivered');
  const draftPages = broadcastPages.filter(p => p.broadcastStatus === 'draft');
  const scheduledPages = broadcastPages.filter(p => p.broadcastStatus === 'scheduled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient">Server-to-Clients Broadcast Hub</h2>
          <p className="text-muted-foreground mt-2">
            Push new or updated pages to all {appSubdomains.length} SECOINFI apps with real-time delivery monitoring
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="neon-glow">
              <Plus className="w-4 h-4 mr-2" />
              Create Broadcast Page
            </Button>
          </DialogTrigger>
          <DialogContent className="card-3d max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Broadcast Page</DialogTitle>
              <DialogDescription>
                Create a page that can be broadcast to all SECOINFI client apps
              </DialogDescription>
            </DialogHeader>
            <BroadcastPageForm
              appSubdomains={appSubdomains}
              onSubmit={handleCreatePage}
              onCancel={() => setIsAddDialogOpen(false)}
              isSubmitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <Radio className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{broadcastPages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Broadcast pages</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{publishedPages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Live broadcasts</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{scheduledPages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending broadcasts</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Apps</CardTitle>
            <Globe className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{appSubdomains.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Connected apps</p>
          </CardContent>
        </Card>
      </div>

      {/* Broadcast Status Alert */}
      {Object.keys(broadcastStatus).length > 0 && (
        <Alert className="card-3d border-2 border-green-500/30 bg-green-500/5">
          <Activity className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-500 font-bold">
            Broadcast Delivery Status
          </AlertTitle>
          <AlertDescription className="text-sm mt-2">
            <div className="grid md:grid-cols-3 gap-2">
              {Object.entries(broadcastStatus).map(([app, status]) => (
                <div key={app} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-mono text-xs">{app}:</span>
                  <span className="text-xs">{status}</span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pages">Broadcast Pages</TabsTrigger>
          <TabsTrigger value="monitor">Live Monitoring</TabsTrigger>
          <TabsTrigger value="embed">Embed System</TabsTrigger>
        </TabsList>

        {/* Broadcast Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <Card className="card-3d">
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Target Apps</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Loading broadcast pages...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : broadcastPages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No broadcast pages found. Click "Create Broadcast Page" to add one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      broadcastPages.map((page) => (
                        <TableRow key={page.id.toString()}>
                          <TableCell className="font-medium">{page.name}</TableCell>
                          <TableCell className="font-mono text-sm">{page.url}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(page.broadcastStatus)}>
                              {page.broadcastStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {page.targetApps.length} apps
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(Number(page.lastUpdated) / 1000000).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleBroadcast(page)}
                                disabled={broadcastMutation.isPending}
                                className="neon-glow"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Broadcast
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedPage(page);
                                  setIsEmbedDialogOpen(true);
                                }}
                              >
                                <Code className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedPage(page);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeletePage(page.id)}
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

        {/* Live Monitoring Tab */}
        <TabsContent value="monitor" className="space-y-4">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Real-Time Delivery Monitoring
              </CardTitle>
              <CardDescription>
                Monitor broadcast delivery status across all {appSubdomains.length} SECOINFI applications from backend registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 bg-primary/5 border-primary/20">
                <CheckCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-xs">
                  <strong>Single Source of Truth:</strong> All {appSubdomains.length} apps are loaded from the backend Pages Registry. 
                  When apps are added or removed in the Pages tab, this monitoring list updates automatically.
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                {appSubdomains.map((subdomain) => {
                  const deliveredPages = broadcastPages.filter(
                    p => p.broadcastStatus === 'delivered' && p.targetApps.includes(subdomain)
                  );
                  
                  const app = appsData.find(a => a.subdomain === subdomain);
                  
                  return (
                    <div key={subdomain} className="card-3d p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{app?.appName || subdomain}</span>
                        </div>
                        <Badge variant="outline">
                          {deliveredPages.length} pages delivered
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <a
                          href={app?.canonicalUrl || `https://${subdomain}.caffeine.xyz/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {app?.canonicalUrl || `https://${subdomain}.caffeine.xyz/`}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      {deliveredPages.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {deliveredPages.map((page) => (
                            <Badge key={page.id.toString()} variant="secondary" className="text-xs">
                              {page.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embed System Tab */}
        <TabsContent value="embed" className="space-y-4">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Cross-Origin Embed System
              </CardTitle>
              <CardDescription>
                Generate embed codes for displaying broadcast pages in client apps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>CORS Configuration:</strong> All broadcast pages are configured with proper CORS whitelist for *.caffeine.ai domains, enabling secure cross-origin embedding.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {broadcastPages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No broadcast pages available. Create a page to generate embed codes.
                  </p>
                ) : (
                  broadcastPages.map((page) => (
                    <div key={page.id.toString()} className="card-3d p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{page.name}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPage(page);
                            setIsEmbedDialogOpen(true);
                          }}
                        >
                          <Code className="w-3 h-3 mr-1" />
                          View Embed Code
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        URL: <span className="font-mono">{page.url}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {selectedPage && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="card-3d max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Broadcast Page</DialogTitle>
              <DialogDescription>
                Update the broadcast page details
              </DialogDescription>
            </DialogHeader>
            <BroadcastPageForm
              appSubdomains={appSubdomains}
              initialData={selectedPage}
              onSubmit={handleUpdatePage}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedPage(null);
              }}
              isSubmitting={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Embed Code Dialog */}
      {selectedPage && (
        <Dialog open={isEmbedDialogOpen} onOpenChange={setIsEmbedDialogOpen}>
          <DialogContent className="card-3d max-w-3xl">
            <DialogHeader>
              <DialogTitle>Embed Code for "{selectedPage.name}"</DialogTitle>
              <DialogDescription>
                Copy and paste these snippets into your client applications
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>IFrame Embed</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generateEmbedCode(selectedPage, 'iframe'))}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={generateEmbedCode(selectedPage, 'iframe')}
                  readOnly
                  className="font-mono text-xs h-32"
                />
              </div>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Object Embed</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generateEmbedCode(selectedPage, 'object'))}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={generateEmbedCode(selectedPage, 'object')}
                  readOnly
                  className="font-mono text-xs h-32"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsEmbedDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface BroadcastPageFormProps {
  appSubdomains: string[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function BroadcastPageForm({ appSubdomains, initialData, onSubmit, onCancel, isSubmitting }: BroadcastPageFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    url: initialData?.url || '',
    content: initialData?.content || '',
    broadcastStatus: initialData?.broadcastStatus || 'draft',
    targetApps: initialData?.targetApps || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (initialData) {
      onSubmit({
        pageId: initialData.id,
        ...formData
      });
    } else {
      onSubmit(formData);
    }
  };

  const toggleApp = (app: string) => {
    setFormData(prev => ({
      ...prev,
      targetApps: prev.targetApps.includes(app)
        ? prev.targetApps.filter((a: string) => a !== app)
        : [...prev.targetApps, app]
    }));
  };

  const selectAllApps = () => {
    setFormData(prev => ({
      ...prev,
      targetApps: appSubdomains
    }));
  };

  const deselectAllApps = () => {
    setFormData(prev => ({
      ...prev,
      targetApps: []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Page Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Angel/VC Investment Page"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Page URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="e.g., /angel-vc"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Page Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter page content (HTML supported)"
          className="h-32"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Broadcast Status</Label>
        <Input
          id="status"
          value={formData.broadcastStatus}
          onChange={(e) => setFormData({ ...formData, broadcastStatus: e.target.value })}
          placeholder="draft, scheduled, delivered"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Target Apps ({formData.targetApps.length} selected)</Label>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={selectAllApps}>
              Select All
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={deselectAllApps}>
              Deselect All
            </Button>
          </div>
        </div>
        <div className="card-3d p-4 rounded-lg space-y-2 max-h-48 overflow-y-auto">
          {appSubdomains.map((app) => (
            <div key={app} className="flex items-center space-x-2">
              <Checkbox
                id={app}
                checked={formData.targetApps.includes(app)}
                onCheckedChange={() => toggleApp(app)}
              />
              <label
                htmlFor={app}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {app}
              </label>
            </div>
          ))}
        </div>
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
            initialData ? 'Update Page' : 'Create Page'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
