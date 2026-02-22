import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, AlertCircle, Trash2, ExternalLink, Shield, CheckCircle, Plus, Edit, Save, X, Upload, FileText, Database, Share2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useShareSelectedPages, useGetAllSecoinfiAppsEntries, useAddSecoinfiAppEntry, useUpdateSecoinfiAppEntry, useDeleteSecoinfiAppEntry, useBulkDeleteSecoinfiAppEntries } from '@/hooks/useAppQueries';
import type { SecoinfiAppEntry } from '../backend';

// Local type definition for ContactInfo (not yet in backend interface)
interface ContactInfo {
  ceoName: string;
  email: string;
  phone: string;
  whatsapp: string;
  businessAddress: string;
  paypal: string;
  upi: string;
  eth: string;
  socialMedia: {
    facebook: string;
    linkedin: string;
    telegram: string;
    discord: string;
    blogspot: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

interface MainControlPageProps {
  isAdmin: boolean;
}

interface PageEntry {
  id: bigint;
  appName: string;
  url: string;
  subdomain: string;
  categoryTags: string;
  status: string;
}

interface UploadedDataset {
  id: string;
  fileName: string;
  uploadedAt: number;
  entries: Omit<PageEntry, 'id'>[];
}

export default function MainControlPage({ isAdmin }: MainControlPageProps) {
  const [activeTab, setActiveTab] = useState('apps');
  
  // Fetch pages from backend
  const { data: backendPages = [], isLoading: pagesLoading, refetch: refetchPages } = useGetAllSecoinfiAppsEntries();
  
  // Pages Registry State
  const [selectedPageIds, setSelectedPageIds] = useState<bigint[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Inline editing state
  const [editingRowId, setEditingRowId] = useState<bigint | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingUrl, setEditingUrl] = useState('');

  // Form state for adding new pages
  const [newPageName, setNewPageName] = useState('');
  const [newPageUrl, setNewPageUrl] = useState('');
  const [newPageSubdomain, setNewPageSubdomain] = useState('');
  const [newPageCategory, setNewPageCategory] = useState('');
  const [newPageStatus, setNewPageStatus] = useState('active');

  // Dataset upload state
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>([]);
  const [showDatasetsModal, setShowDatasetsModal] = useState(false);
  const [showReplaceConfirmDialog, setShowReplaceConfirmDialog] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);

  // Contact Info State
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    ceoName: 'DILEEP KUMAR D',
    email: 'dild26@gmail.com',
    phone: '+91-962-005-8644',
    whatsapp: '+91-962-005-8644',
    businessAddress: 'Bangalore - 560097, Karnataka, India',
    paypal: 'newgoldenjewel@gmail.com',
    upi: 'secoin@uboi',
    eth: '0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7',
    socialMedia: {
      facebook: 'https://facebook.com/dild26',
      linkedin: 'https://www.linkedin.com/in/dild26',
      telegram: 'https://t.me/dilee',
      discord: 'https://discord.com/users/dild26',
      blogspot: 'https://dildiva.blogspot.com',
      instagram: 'https://instagram.com/newgoldenjewel',
      twitter: 'https://twitter.com/dil_sec',
      youtube: 'https://m.youtube.com/@dileepkumard4484/videos',
    },
  });

  const [contactSaveStatus, setContactSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Mutations
  const shareSelectedMutation = useShareSelectedPages();
  const addPageMutation = useAddSecoinfiAppEntry();
  const updatePageMutation = useUpdateSecoinfiAppEntry();
  const deletePageMutation = useDeleteSecoinfiAppEntry();
  const bulkDeleteMutation = useBulkDeleteSecoinfiAppEntries();

  // Load datasets from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('uploadedDatasets');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUploadedDatasets(parsed);
      } catch (error) {
        console.error('Failed to parse stored datasets:', error);
      }
    }
  }, []);

  // Save datasets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uploadedDatasets', JSON.stringify(uploadedDatasets));
  }, [uploadedDatasets]);

  // Update selectAll state when selection changes
  useEffect(() => {
    if (backendPages.length > 0) {
      const allSelected = backendPages.every(page => 
        selectedPageIds.some(id => id === page.id)
      );
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [selectedPageIds, backendPages]);

  // Contact info auto-save
  useEffect(() => {
    if (contactSaveStatus === 'saving') {
      const timer = setTimeout(() => {
        localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
        setContactSaveStatus('saved');
        toast.success('Contact information saved locally');
        setTimeout(() => setContactSaveStatus('idle'), 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [contactSaveStatus, contactInfo]);

  // Load contact info from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('contactInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setContactInfo(parsed);
      } catch (error) {
        console.error('Failed to parse stored contact info:', error);
      }
    }
  }, []);

  const handleContactChange = (field: string, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    setContactSaveStatus('saving');
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
    setContactSaveStatus('saving');
  };

  const togglePageSelect = (pageId: bigint) => {
    setSelectedPageIds(prev => {
      const exists = prev.some(id => id === pageId);
      if (exists) {
        return prev.filter(id => id !== pageId);
      } else {
        return [...prev, pageId];
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPageIds(backendPages.map(page => page.id));
    } else {
      setSelectedPageIds([]);
    }
    setSelectAll(checked);
  };

  const handleBulkDelete = async () => {
    if (selectedPageIds.length === 0) return;
    setShowDeleteDialog(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync(selectedPageIds);
      
      toast.success(`Successfully deleted ${selectedPageIds.length} page(s)`);
      setSelectedPageIds([]);
      setSelectAll(false);
      await refetchPages();
    } catch (error) {
      console.error('Failed to delete pages:', error);
      toast.error('Failed to delete selected pages');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleShareSelected = async () => {
    if (selectedPageIds.length === 0) {
      toast.error('No pages selected for sharing');
      return;
    }

    try {
      console.log('[ShareSelected] Sharing pages with IDs:', selectedPageIds);
      
      // Call backend mutation
      const result = await shareSelectedMutation.mutateAsync(selectedPageIds);

      // Show detailed success notification
      toast.success(
        <div className="space-y-1">
          <div className="font-semibold">{result.message}</div>
          <div className="text-xs text-muted-foreground">
            Overview: {result.overview.length} • Compare: {result.compare.length} • 
            Sites: {result.sites.length} • Apps: {result.apps.length}
          </div>
        </div>,
        { duration: 5000 }
      );

      // Log the shared data for debugging
      console.log('[ShareSelected] Successfully shared data:', {
        overview: result.overview.length,
        compare: result.compare.length,
        sites: result.sites.length,
        apps: result.apps.length,
      });

      // Clear selection after successful share
      setSelectedPageIds([]);
      setSelectAll(false);
    } catch (error: any) {
      console.error('[ShareSelected] Failed to share selected pages:', error);
      
      // Show detailed error message
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Failed to share selected pages</div>
          <div className="text-xs text-muted-foreground">{errorMessage}</div>
        </div>,
        { duration: 5000 }
      );
    }
  };

  const handleAddPage = async () => {
    if (!newPageName.trim() || !newPageUrl.trim()) {
      toast.error('Please provide both App/Page Name and URL');
      return;
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(newPageUrl.trim())) {
      toast.error('Invalid URL format. URL must start with http:// or https://');
      return;
    }

    try {
      await addPageMutation.mutateAsync({
        appName: newPageName.trim(),
        subdomain: newPageSubdomain.trim() || newPageName.trim().toLowerCase().replace(/\s+/g, '-'),
        canonicalUrl: newPageUrl.trim(),
        categoryTags: newPageCategory.trim() || 'General',
        status: newPageStatus,
      });

      setNewPageName('');
      setNewPageUrl('');
      setNewPageSubdomain('');
      setNewPageCategory('');
      setNewPageStatus('active');
      
      toast.success('Page added successfully');
      await refetchPages();
    } catch (error) {
      console.error('Failed to add page:', error);
      toast.error('Failed to add page');
    }
  };

  // Inline editing functions
  const handleEditRow = (page: SecoinfiAppEntry) => {
    setEditingRowId(page.id);
    setEditingName(page.appName);
    setEditingUrl(page.canonicalUrl);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingName('');
    setEditingUrl('');
  };

  const handleSaveRow = async () => {
    if (!editingRowId) return;

    // Validate inputs
    if (!editingName.trim()) {
      toast.error('App/Page Name cannot be empty');
      return;
    }

    if (!editingUrl.trim()) {
      toast.error('URL cannot be empty');
      return;
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(editingUrl.trim())) {
      toast.error('Invalid URL format. URL must start with http:// or https://');
      return;
    }

    try {
      const success = await updatePageMutation.mutateAsync({
        id: editingRowId,
        appName: editingName.trim(),
        canonicalUrl: editingUrl.trim(),
      });

      if (success) {
        toast.success('Page updated successfully');
        setEditingRowId(null);
        setEditingName('');
        setEditingUrl('');
        await refetchPages();
      } else {
        toast.error('Failed to update page - entry not found');
      }
    } catch (error) {
      console.error('Failed to save row:', error);
      toast.error('Failed to save changes');
    }
  };

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    // Validate file type
    const allowedExtensions = ['json', 'csv', 'md', 'mo', 'zip'];
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error('Invalid file type. Please upload .json, .csv, .md, .mo, or .zip files.');
      return;
    }

    try {
      const fileContent = await file.text();
      let parsedEntries: Omit<PageEntry, 'id'>[] = [];

      // Parse based on file type
      if (fileExtension === 'json') {
        const jsonData = JSON.parse(fileContent);
        // Expect array of objects with appName and url
        if (Array.isArray(jsonData)) {
          parsedEntries = jsonData
            .filter(item => item.appName && item.url)
            .map((item) => ({
              appName: item.appName || item.name || 'Unnamed',
              url: item.url || '',
              subdomain: item.subdomain || (item.appName || item.name || 'unnamed').toLowerCase().replace(/\s+/g, '-'),
              categoryTags: item.categoryTags || item.category || 'General',
              status: item.status || 'active',
            }));
        }
      } else if (fileExtension === 'csv') {
        // Parse CSV (simple comma-separated format)
        const lines = fileContent.split('\n').filter(line => line.trim());
        // Skip header if present
        const dataLines = lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('url') 
          ? lines.slice(1) 
          : lines;
        
        parsedEntries = dataLines
          .map((line) => {
            const parts = line.split(',').map(p => p.trim());
            if (parts.length >= 2) {
              return {
                appName: parts[0],
                url: parts[1],
                subdomain: parts[2] || parts[0].toLowerCase().replace(/\s+/g, '-'),
                categoryTags: parts[3] || 'General',
                status: parts[4] || 'active',
              };
            }
            return null;
          })
          .filter((entry): entry is Omit<PageEntry, 'id'> => entry !== null);
      } else if (fileExtension === 'md') {
        // Parse Markdown links [name](url)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        while ((match = linkRegex.exec(fileContent)) !== null) {
          parsedEntries.push({
            appName: match[1],
            url: match[2],
            subdomain: match[1].toLowerCase().replace(/\s+/g, '-'),
            categoryTags: 'General',
            status: 'active',
          });
        }
      } else if (fileExtension === 'mo') {
        // Parse Motoko-style data (simple key-value pairs)
        const lines = fileContent.split('\n').filter(line => line.trim());
        let currentName = '';
        let currentUrl = '';
        
        lines.forEach(line => {
          if (line.includes('name') || line.includes('appName')) {
            const match = line.match(/["']([^"']+)["']/);
            if (match) currentName = match[1];
          } else if (line.includes('url')) {
            const match = line.match(/["']([^"']+)["']/);
            if (match) currentUrl = match[1];
          }
          
          if (currentName && currentUrl) {
            parsedEntries.push({
              appName: currentName,
              url: currentUrl,
              subdomain: currentName.toLowerCase().replace(/\s+/g, '-'),
              categoryTags: 'General',
              status: 'active',
            });
            currentName = '';
            currentUrl = '';
          }
        });
      }

      // Validate entries
      const validEntries = parsedEntries.filter(entry => {
        const hasName = entry.appName && entry.appName.trim() !== '';
        const hasValidUrl = entry.url && /^https?:\/\/.+/i.test(entry.url);
        return hasName && hasValidUrl;
      });

      if (validEntries.length === 0) {
        toast.error('No valid entries found in the uploaded file');
        return;
      }

      // Sort alphabetically by appName
      validEntries.sort((a, b) => a.appName.localeCompare(b.appName));

      // Create dataset
      const newDataset: UploadedDataset = {
        id: `dataset-${Date.now()}`,
        fileName,
        uploadedAt: Date.now(),
        entries: validEntries,
      };

      setUploadedDatasets(prev => [...prev, newDataset]);
      toast.success(`Dataset uploaded: ${validEntries.length} entries parsed from ${fileName}`);
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Failed to parse file:', error);
      toast.error('Failed to parse uploaded file');
    }
  };

  const handleReplaceTableData = (datasetId: string) => {
    setSelectedDatasetId(datasetId);
    setShowReplaceConfirmDialog(true);
  };

  const confirmReplaceTableData = async () => {
    if (!selectedDatasetId) return;

    const dataset = uploadedDatasets.find(d => d.id === selectedDatasetId);
    if (!dataset) return;

    try {
      // Add all entries from dataset to backend
      for (const entry of dataset.entries) {
        await addPageMutation.mutateAsync({
          appName: entry.appName,
          subdomain: entry.subdomain,
          canonicalUrl: entry.url,
          categoryTags: entry.categoryTags,
          status: entry.status,
        });
      }
      
      toast.success(`Table data populated with ${dataset.entries.length} entries from ${dataset.fileName}`);
      setShowReplaceConfirmDialog(false);
      setSelectedDatasetId(null);
      setShowDatasetsModal(false);
      await refetchPages();
    } catch (error) {
      console.error('Failed to replace table data:', error);
      toast.error('Failed to populate table data');
    }
  };

  const handleDeleteDataset = (datasetId: string) => {
    setUploadedDatasets(prev => prev.filter(d => d.id !== datasetId));
    toast.success('Dataset deleted');
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need admin privileges to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Main Control Panel
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage all platform settings and configurations from one central location
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-8 mb-8">
          <TabsTrigger value="apps">Pages</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          <TabsTrigger value="yaml">YAML</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Pages Tab - Pages Registry Management */}
        <TabsContent value="apps">
          <div className="space-y-6">
            {/* Add New Page Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Page</CardTitle>
                <CardDescription>
                  Manually add a new page to the registry or upload a dataset file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPageName">App/Page Name *</Label>
                    <Input
                      id="newPageName"
                      value={newPageName}
                      onChange={(e) => setNewPageName(e.target.value)}
                      placeholder="e.g., InfiTask, Evolved AI"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPageUrl">URL *</Label>
                    <Input
                      id="newPageUrl"
                      value={newPageUrl}
                      onChange={(e) => setNewPageUrl(e.target.value)}
                      placeholder="e.g., https://infitask.caffeine.xyz/"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPageSubdomain">Subdomain</Label>
                    <Input
                      id="newPageSubdomain"
                      value={newPageSubdomain}
                      onChange={(e) => setNewPageSubdomain(e.target.value)}
                      placeholder="e.g., infitask (auto-generated if empty)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPageCategory">Category</Label>
                    <Input
                      id="newPageCategory"
                      value={newPageCategory}
                      onChange={(e) => setNewPageCategory(e.target.value)}
                      placeholder="e.g., Overview, Compare, Sites, Apps"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <Button
                    onClick={handleAddPage}
                    disabled={!newPageName.trim() || !newPageUrl.trim() || addPageMutation.isPending}
                  >
                    {addPageMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Row
                      </>
                    )}
                  </Button>
                  
                  <div className="relative">
                    <input
                      type="file"
                      id="datasetUpload"
                      accept=".json,.csv,.md,.mo,.zip"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('datasetUpload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Dataset
                    </Button>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => setShowDatasetsModal(true)}
                    disabled={uploadedDatasets.length === 0}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Datasets ({uploadedDatasets.length})
                  </Button>
                </div>
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-xs">
                    <strong>Manual Entry:</strong> Use the form above to add individual pages one at a time.
                    <br /><br />
                    <strong>Dataset Upload:</strong> Upload .json, .csv, .md, .mo, or .zip files containing multiple page entries.
                    Files are parsed automatically, validated (non-empty name, valid URL), sorted alphabetically, and stored as datasets.
                    Click "Datasets" to view uploaded files and populate the table.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Pages Registry Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pages Registry Table</CardTitle>
                    <CardDescription>
                      {pagesLoading 
                        ? 'Loading pages...'
                        : backendPages.length === 0 
                        ? 'No pages in registry. Add pages manually or upload a dataset.'
                        : `Complete registry of ${backendPages.length} page(s) with inline editing`
                      }
                    </CardDescription>
                  </div>
                  {backendPages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        onClick={handleShareSelected}
                        disabled={selectedPageIds.length === 0 || shareSelectedMutation.isPending}
                      >
                        {shareSelectedMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sharing...
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Selected ({selectedPageIds.length})
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleBulkDelete}
                        disabled={selectedPageIds.length === 0 || bulkDeleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected ({selectedPageIds.length})
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {pagesLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Loading pages registry...</p>
                  </div>
                ) : backendPages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Pages Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Start by adding pages manually using the form above, or upload a dataset file (.json, .csv, .md, .mo, .zip) to populate the table.
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-12">
                            <Checkbox 
                              checked={selectAll}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead className="font-bold">App/Page Name</TableHead>
                          <TableHead className="font-bold">URL</TableHead>
                          <TableHead className="font-bold">Category</TableHead>
                          <TableHead className="font-bold w-32">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {backendPages.map((page) => {
                          const isEditing = editingRowId === page.id;
                          const isSelected = selectedPageIds.some(id => id === page.id);
                          
                          return (
                            <TableRow 
                              key={page.id.toString()} 
                              className={`transition-colors ${isEditing ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-accent/50'}`}
                            >
                              <TableCell>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => togglePageSelect(page.id)}
                                  disabled={isEditing}
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {isEditing ? (
                                  <Input
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    placeholder="App/Page Name"
                                    className="h-8"
                                  />
                                ) : (
                                  page.appName
                                )}
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <Input
                                    value={editingUrl}
                                    onChange={(e) => setEditingUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="h-8"
                                  />
                                ) : (
                                  <a 
                                    href={page.canonicalUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1 text-sm"
                                  >
                                    {page.canonicalUrl}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {page.categoryTags}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <div className="flex items-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={handleSaveRow}
                                      disabled={updatePageMutation.isPending}
                                      className="h-8"
                                    >
                                      {updatePageMutation.isPending ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <>
                                          <Save className="w-3 h-3 mr-1" />
                                          Save
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={handleCancelEdit}
                                      disabled={updatePageMutation.isPending}
                                      className="h-8"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditRow(page)}
                                    className="h-8"
                                  >
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <Alert className="mt-4">
                  <Shield className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-xs">
                    <strong>Inline Editing:</strong> Click "Edit" to modify App/Page Name and URL fields inline. 
                    Changes are validated (non-empty fields, valid URL format) before saving.
                    Updates are persisted to the backend immediately.
                    Visual cues include editing highlight (blue border) and success toast notifications.
                    <br /><br />
                    <strong>SelectAll Checkbox:</strong> Master checkbox in the table header selects/deselects all rows at once. 
                    Individual row checkboxes allow granular selection. Selection state is tracked correctly across all operations.
                    <br /><br />
                    <strong>Share Selected:</strong> Select multiple rows using checkboxes, then click "Share Selected (n)" to share them across Overview, Compare, Sites, and Apps tabs.
                    The backend processes selected pages and distributes them to appropriate tabs based on category and name matching.
                    Success notification confirms the operation with details about shared data across all tabs.
                    <br /><br />
                    <strong>Bulk Delete:</strong> Select multiple rows using checkboxes, then click "Delete Selected (n)" to remove them.
                    A confirmation dialog appears before deletion. Deleted pages are removed from the backend registry.
                  </AlertDescription>
                </Alert>

                <Alert className="mt-4 bg-primary/5 border-primary/20">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-xs">
                    <strong>Dataset Upload:</strong> Upload .json, .csv, .md, .mo, or .zip files containing page data.
                    Each file is parsed client-side, validated (App/Page Name and URL required), auto-sorted alphabetically, and stored as a dataset.
                    View all uploaded datasets by clicking the "Datasets" button, then choose "Replace Table Data" to populate the registry.
                    <br /><br />
                    <strong>Data Persistence:</strong> All changes (add, edit, delete, share) are immediately saved to the backend.
                    The table displays data from the backend registry with real-time synchronization.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Update SECOINFI contact details (saved locally until backend integration)
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {contactSaveStatus === 'saving' && (
                    <Badge variant="outline" className="gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Saving...
                    </Badge>
                  )}
                  {contactSaveStatus === 'saved' && (
                    <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle className="h-3 w-3" />
                      Saved
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Primary Contact</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ceoName">CEO Name</Label>
                    <Input
                      id="ceoName"
                      value={contactInfo.ceoName}
                      onChange={(e) => handleContactChange('ceoName', e.target.value)}
                      placeholder="CEO Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="+91-XXX-XXX-XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={contactInfo.whatsapp}
                      onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                      placeholder="+91-XXX-XXX-XXXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    value={contactInfo.businessAddress}
                    onChange={(e) => handleContactChange('businessAddress', e.target.value)}
                    placeholder="Business Address"
                    rows={2}
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Information</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypal">PayPal</Label>
                    <Input
                      id="paypal"
                      value={contactInfo.paypal}
                      onChange={(e) => handleContactChange('paypal', e.target.value)}
                      placeholder="paypal@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upi">UPI</Label>
                    <Input
                      id="upi"
                      value={contactInfo.upi}
                      onChange={(e) => handleContactChange('upi', e.target.value)}
                      placeholder="username@upi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eth">Ethereum (ETH)</Label>
                    <Input
                      id="eth"
                      value={contactInfo.eth}
                      onChange={(e) => handleContactChange('eth', e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={contactInfo.socialMedia.facebook}
                      onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={contactInfo.socialMedia.linkedin}
                      onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telegram">Telegram</Label>
                    <Input
                      id="telegram"
                      value={contactInfo.socialMedia.telegram}
                      onChange={(e) => handleSocialMediaChange('telegram', e.target.value)}
                      placeholder="https://t.me/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discord">Discord</Label>
                    <Input
                      id="discord"
                      value={contactInfo.socialMedia.discord}
                      onChange={(e) => handleSocialMediaChange('discord', e.target.value)}
                      placeholder="https://discord.com/users/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blogspot">BlogSpot</Label>
                    <Input
                      id="blogspot"
                      value={contactInfo.socialMedia.blogspot}
                      onChange={(e) => handleSocialMediaChange('blogspot', e.target.value)}
                      placeholder="https://...blogspot.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={contactInfo.socialMedia.instagram}
                      onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">X/Twitter</Label>
                    <Input
                      id="twitter"
                      value={contactInfo.socialMedia.twitter}
                      onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={contactInfo.socialMedia.youtube}
                      onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                      placeholder="https://youtube.com/@..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <p className="text-sm text-muted-foreground">
                  Changes are automatically saved after 3 seconds to localStorage. Backend integration pending.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs placeholder */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features Management</CardTitle>
              <CardDescription>Manage platform features and capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Features management is handled through the dedicated Features page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sitemap">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Management</CardTitle>
              <CardDescription>Manage sitemap configuration and discovery</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sitemap management is handled through the dedicated Sitemap page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcast">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Management</CardTitle>
              <CardDescription>Manage broadcast pages and delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Broadcast management is handled through the dedicated Broadcast Hub page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yaml">
          <Card>
            <CardHeader>
              <CardTitle>YAML Configuration</CardTitle>
              <CardDescription>Manage YAML configuration files</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                YAML configuration is handled through the dedicated YAML Config Editor page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and access control</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Security settings are handled through the dedicated Secure Routes page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Monitoring</CardTitle>
              <CardDescription>View platform analytics and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analytics features coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPageIds.length} selected page(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkDeleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              disabled={bulkDeleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {bulkDeleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Datasets Modal */}
      <Dialog open={showDatasetsModal} onOpenChange={setShowDatasetsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Uploaded Datasets</DialogTitle>
            <DialogDescription>
              View and manage uploaded dataset files. Click "Populate Table" to add entries to the registry.
            </DialogDescription>
          </DialogHeader>
          
          {uploadedDatasets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Database className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No datasets uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedDatasets.map((dataset) => (
                <Card key={dataset.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {dataset.fileName}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Uploaded: {new Date(dataset.uploadedAt).toLocaleString()} • {dataset.entries.length} entries
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDataset(dataset.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Preview (first 3 entries):
                      </div>
                      <div className="space-y-1">
                        {dataset.entries.slice(0, 3).map((entry, idx) => (
                          <div key={idx} className="text-xs p-2 bg-muted/50 rounded">
                            <div className="font-medium">{entry.appName}</div>
                            <div className="text-muted-foreground truncate">{entry.url}</div>
                          </div>
                        ))}
                        {dataset.entries.length > 3 && (
                          <div className="text-xs text-muted-foreground italic">
                            ... and {dataset.entries.length - 3} more
                          </div>
                        )}
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleReplaceTableData(dataset.id)}
                      >
                        Populate Table
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Replace Table Data Confirmation Dialog */}
      <AlertDialog open={showReplaceConfirmDialog} onOpenChange={setShowReplaceConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Populate Table</AlertDialogTitle>
            <AlertDialogDescription>
              This will add all entries from the selected dataset to the registry. 
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReplaceTableData}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Populate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
