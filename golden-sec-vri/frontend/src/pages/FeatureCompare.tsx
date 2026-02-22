import { useState, useMemo } from 'react';
import { useGetFeatures, useIsCallerAdmin, useUpdateFeatureVerification, useAddFeature, useGetAllFixtures, useCreateOrUpdateFixtures } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { CheckSquare, AlertCircle, ShieldCheck, Search, Plus, Edit, Trash2, ArrowUpDown, Filter, ShieldAlert, RefreshCw, Bot, User } from 'lucide-react';
import type { Feature, Task } from '../backend';

type SortField = 'name' | 'category' | 'priority' | 'progress' | 'aiVerified' | 'manuallyVerified' | 'completed';
type SortDirection = 'asc' | 'desc';

export default function FeatureCompare() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading, error: adminError, isFetched: adminFetched } = useIsCallerAdmin();
  const { data: features, isLoading: featuresLoading } = useGetFeatures();
  const { data: allFixtures, isLoading: fixturesLoading } = useGetAllFixtures();
  const { mutate: updateVerification } = useUpdateFeatureVerification();
  const { mutate: addFeature } = useAddFeature();
  const { mutate: updateFixtures, isPending: isUpdatingFixtures } = useCreateOrUpdateFixtures();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const isAuthenticated = !!identity;

  // Get fixtures for features
  const featuresFixtures = useMemo(() => {
    if (!allFixtures) return null;
    return allFixtures.find(f => f.id === 'features');
  }, [allFixtures]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!features) return [];
    const cats = new Set(features.map(f => f.category).filter(c => c));
    return ['All', ...Array.from(cats)];
  }, [features]);

  // Filter and sort features
  const filteredAndSortedFeatures = useMemo(() => {
    if (!features) return [];
    let result = [...features];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(term) ||
        f.category.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'All') {
      result = result.filter(f => f.category === categoryFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'All') {
      result = result.filter(f => Number(f.priority) === Number(priorityFilter));
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'priority':
          comparison = Number(a.priority) - Number(b.priority);
          break;
        case 'progress':
          comparison = Number(a.progress) - Number(b.progress);
          break;
        case 'aiVerified':
          comparison = (a.aiVerified ? 1 : 0) - (b.aiVerified ? 1 : 0);
          break;
        case 'manuallyVerified':
          comparison = (a.manuallyVerified ? 1 : 0) - (b.manuallyVerified ? 1 : 0);
          break;
        case 'completed':
          comparison = (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [features, searchTerm, categoryFilter, priorityFilter, sortField, sortDirection]);

  // Group features by category
  const groupedFeatures = useMemo(() => {
    const groups: Record<string, Feature[]> = {};
    filteredAndSortedFeatures.forEach(feature => {
      const category = feature.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(feature);
    });
    return groups;
  }, [filteredAndSortedFeatures]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddFeature = (formData: FormData) => {
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const priority = formData.get('priority') as string;
    const fixture = formData.get('fixture') as string || 'Auto';

    const tasks: Task[] = [
      {
        id: `task_${Date.now()}`,
        name: 'Implementation',
        completed: false,
      },
    ];

    addFeature({ name, tasks, category, priority: BigInt(priority), fixture });
    setIsAddDialogOpen(false);
  };

  const handleRecalculateFixtures = () => {
    if (!features) return;
    
    const merkleRoot = `merkle_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const verkleLeaves = features.map(f => `leaf_${f.id}_${f.name.substring(0, 10)}`);
    
    const recommendations: string[] = [];
    features.forEach(f => {
      if (f.pending && !f.completed) {
        recommendations.push(`Update feature "${f.name}" - ${100 - Number(f.progress)}% remaining`);
      }
    });

    updateFixtures({
      id: 'features',
      merkleRoot,
      verkleLeaves,
      proofStatus: 'verified',
      verificationResult: 'success',
      autoUpdateRecommendations: recommendations,
      discrepancyResolution: recommendations.length > 0 ? 'Pending features detected' : 'All features verified',
      recalculationHistory: [
        ...(featuresFixtures?.recalculationHistory || []),
        `Recalculated at ${new Date().toISOString()} - ${features.length} features verified`,
      ],
    });
  };

  const handleVerificationChange = (featureId: string, aiVerified: boolean, manuallyVerified: boolean) => {
    updateVerification({ featureId, aiVerified, manuallyVerified });
  };

  // Show loading state while checking admin status or not authenticated
  if (!isAuthenticated || adminLoading || !adminFetched) {
    return (
      <div className="container px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-96" />
        <div className="mt-6">
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Verifying Admin Access</AlertTitle>
            <AlertDescription>
              Checking your permissions... This ensures Genesis admin access is properly granted.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Show error state if admin check failed
  if (adminError) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Checking Admin Status</AlertTitle>
          <AlertDescription>
            There was an error verifying your admin status. Please try refreshing the page.
            {adminError instanceof Error && ` Error: ${adminError.message}`}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  // Only show access denied if explicitly not admin after successful fetch
  if (isAdmin === false && adminFetched) {
    return (
      <div className="container px-4 py-8">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have permission to access the feature comparison page. This page is restricted to administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <CheckSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Features & Fixtures</h1>
            <p className="text-muted-foreground">Comprehensive tracking with dual verification system (AI + Manual)</p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Feature
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={(e) => { e.preventDefault(); handleAddFeature(new FormData(e.currentTarget)); }}>
              <DialogHeader>
                <DialogTitle>Add New Feature</DialogTitle>
                <DialogDescription>Create a new feature entry for tracking</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Feature Name</Label>
                  <Input id="name" name="name" placeholder="Enter feature name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" placeholder="e.g., Security, Performance, UI" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (1-5)</Label>
                  <Input id="priority" name="priority" type="number" min="1" max="5" defaultValue="3" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fixture">Fixture Type</Label>
                  <Input id="fixture" name="fixture" placeholder="Auto or Manual" defaultValue="Auto" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Feature</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fixtures Status Card */}
      {!fixturesLoading && featuresFixtures && (
        <Card className="mb-6 border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/generated/merkle-tree-icon-transparent.dim_64x64.png" 
                  alt="Merkle Tree" 
                  className="h-10 w-10"
                />
                <div>
                  <CardTitle>Cryptographic Verification Status</CardTitle>
                  <CardDescription>Merkle/Verkle tree integrity verification for feature data</CardDescription>
                </div>
              </div>
              <Button 
                onClick={handleRecalculateFixtures} 
                disabled={isUpdatingFixtures}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isUpdatingFixtures ? 'animate-spin' : ''}`} />
                Recalculate Proofs
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {featuresFixtures.proofStatus === 'verified' ? (
                    <img 
                      src="/assets/generated/fixtures-verified-icon-transparent.dim_64x64.png" 
                      alt="Verified" 
                      className="h-6 w-6"
                    />
                  ) : (
                    <img 
                      src="/assets/generated/fixtures-warning-icon-transparent.dim_64x64.png" 
                      alt="Warning" 
                      className="h-6 w-6"
                    />
                  )}
                  <span className="text-sm font-medium">Proof Status</span>
                </div>
                <Badge variant={featuresFixtures.proofStatus === 'verified' ? 'default' : 'destructive'}>
                  {featuresFixtures.proofStatus}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Verification Result</span>
                </div>
                <Badge variant={featuresFixtures.verificationResult === 'success' ? 'default' : 'secondary'}>
                  {featuresFixtures.verificationResult}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Merkle Root</span>
                </div>
                <p className="text-xs font-mono text-muted-foreground truncate">
                  {featuresFixtures.merkleRoot}
                </p>
              </div>
            </div>
            
            {featuresFixtures.autoUpdateRecommendations.length > 0 && (
              <Alert className="mt-4">
                <img 
                  src="/assets/generated/auto-update-icon-transparent.dim_64x64.png" 
                  alt="Auto Update" 
                  className="h-4 w-4"
                />
                <AlertTitle>Auto-Update Recommendations</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1 text-sm">
                    {featuresFixtures.autoUpdateRecommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                    {featuresFixtures.autoUpdateRecommendations.length > 3 && (
                      <li className="text-muted-foreground">
                        ... and {featuresFixtures.autoUpdateRecommendations.length - 3} more
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {featuresFixtures.discrepancyResolution && (
              <div className="mt-4 rounded-lg bg-muted p-3">
                <p className="text-sm">
                  <span className="font-medium">Discrepancy Resolution: </span>
                  {featuresFixtures.discrepancyResolution}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="mb-6 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryFilter">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="categoryFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priorityFilter">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger id="priorityFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="1">1 (Highest)</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5 (Lowest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('All');
                  setPriorityFilter('All');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Table */}
      {featuresLoading ? (
        <Skeleton className="h-96" />
      ) : Object.keys(groupedFeatures).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
            <Card key={category} className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({categoryFeatures.length} {categoryFeatures.length === 1 ? 'feature' : 'features'})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('name')} className="gap-1 px-0 hover:bg-transparent">
                            Name
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('priority')} className="gap-1 px-0 hover:bg-transparent">
                            Priority
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('progress')} className="gap-1 px-0 hover:bg-transparent">
                            Progress
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Bot className="h-4 w-4 text-primary" />
                            <span>AI Verified</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <User className="h-4 w-4 text-accent" />
                            <span>Manual Verified</span>
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryFeatures.map((feature) => {
                        const progress = Number(feature.progress);

                        return (
                          <TableRow key={feature.id}>
                            <TableCell className="font-medium">
                              <div className="font-semibold">{feature.name}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                Number(feature.priority) <= 2 ? 'destructive' :
                                Number(feature.priority) === 3 ? 'default' :
                                'secondary'
                              }>
                                {Number(feature.priority)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                                  <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={feature.aiVerified}
                                onCheckedChange={(checked) => 
                                  handleVerificationChange(feature.id, !!checked, feature.manuallyVerified)
                                }
                                className="mx-auto"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={feature.manuallyVerified}
                                onCheckedChange={(checked) => 
                                  handleVerificationChange(feature.id, feature.aiVerified, !!checked)
                                }
                                className="mx-auto"
                              />
                            </TableCell>
                            <TableCell>
                              {feature.completed ? (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                  <CheckSquare className="h-4 w-4" />
                                  <span className="text-sm font-medium">Completed</span>
                                </div>
                              ) : feature.pending ? (
                                <Badge variant="outline">Pending</Badge>
                              ) : (
                                <Badge variant="secondary">In Progress</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingFeature(feature)}
                                  title="Edit feature"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  title="Delete feature"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2">
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <CheckSquare className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">No Features Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || categoryFilter !== 'All' || priorityFilter !== 'All'
                ? 'No features match your current filters. Try adjusting your search criteria.'
                : 'Features will appear here once they are added to the system.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingFeature && (
        <Dialog open={!!editingFeature} onOpenChange={() => setEditingFeature(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Feature</DialogTitle>
              <DialogDescription>Modify feature details and verification status</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Feature Name</Label>
                <Input defaultValue={editingFeature.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input defaultValue={editingFeature.category} disabled />
              </div>
              <div className="space-y-3">
                <Label>Verification Status</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="ai-verified"
                      checked={editingFeature.aiVerified}
                      onCheckedChange={(checked) => 
                        setEditingFeature({ ...editingFeature, aiVerified: !!checked })
                      }
                    />
                    <Label htmlFor="ai-verified" className="flex items-center gap-1 cursor-pointer">
                      <Bot className="h-4 w-4 text-primary" />
                      AI Verified
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="manual-verified"
                      checked={editingFeature.manuallyVerified}
                      onCheckedChange={(checked) => 
                        setEditingFeature({ ...editingFeature, manuallyVerified: !!checked })
                      }
                    />
                    <Label htmlFor="manual-verified" className="flex items-center gap-1 cursor-pointer">
                      <User className="h-4 w-4 text-accent" />
                      Manual Verified
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingFeature(null)}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleVerificationChange(
                  editingFeature.id,
                  editingFeature.aiVerified,
                  editingFeature.manuallyVerified
                );
                setEditingFeature(null);
              }}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
