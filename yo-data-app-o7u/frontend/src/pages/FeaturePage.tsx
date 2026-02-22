import { useEffect, useState, useMemo } from 'react';
import { useGetAllFeatures, useGetPublicFeatures, useIsCallerAdmin, useUpdateFeatureStatus } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';
import { toast } from 'sonner';
import type { FeatureProgress } from '../backend';

type FilterType = 'all' | 'implemented' | 'pending' | 'validated';

export default function FeaturePage() {
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: adminFeatures = [], isLoading: adminLoading } = useGetAllFeatures();
  const { data: publicFeatures = [], isLoading: publicLoading } = useGetPublicFeatures();
  const updateFeatureMutation = useUpdateFeatureStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const features = isAdmin ? adminFeatures : publicFeatures;
  const isLoading = isAdmin ? adminLoading : publicLoading;

  useEffect(() => {
    document.title = 'Feature Progress – YO-Data';
  }, []);

  const filteredFeatures = useMemo(() => {
    let filtered = features;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (feature) =>
          feature.name.toLowerCase().includes(query) ||
          feature.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (activeFilter) {
      case 'implemented':
        filtered = filtered.filter((f) => f.implemented);
        break;
      case 'pending':
        filtered = filtered.filter((f) => !f.implemented);
        break;
      case 'validated':
        filtered = filtered.filter((f) => f.validated);
        break;
      default:
        break;
    }

    return filtered;
  }, [features, searchQuery, activeFilter]);

  const stats = useMemo(() => {
    const total = features.length;
    const implemented = features.filter((f) => f.implemented).length;
    const validated = features.filter((f) => f.validated).length;
    const pending = total - implemented;
    const avgCompletion = total > 0
      ? Math.round(features.reduce((sum, f) => sum + Number(f.completion), 0) / total)
      : 0;

    return { total, implemented, validated, pending, avgCompletion };
  }, [features]);

  const handleImplementedToggle = async (featureId: string, currentValue: boolean) => {
    if (!isAdmin) return;

    try {
      await updateFeatureMutation.mutateAsync({
        featureId,
        validationStatus: !currentValue,
        completion: null,
      });
      toast.success('Feature status updated successfully');
    } catch (error) {
      console.error('Failed to update feature status:', error);
      toast.error('Failed to update feature status');
    }
  };

  const handleValidatedToggle = async (featureId: string, currentValue: boolean) => {
    if (!isAdmin) return;

    try {
      await updateFeatureMutation.mutateAsync({
        featureId,
        validationStatus: !currentValue,
        completion: null,
      });
      toast.success('Feature validation updated successfully');
    } catch (error) {
      console.error('Failed to update feature validation:', error);
      toast.error('Failed to update feature validation');
    }
  };

  const getStatusBadge = (feature: FeatureProgress) => {
    if (feature.validated) {
      return <Badge variant="default" className="bg-green-600"><CheckCircle2 className="mr-1 h-3 w-3" />Validated</Badge>;
    }
    if (feature.implemented) {
      return <Badge variant="secondary"><CheckCircle2 className="mr-1 h-3 w-3" />Implemented</Badge>;
    }
    return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mb-4 inline-block h-8 w-8 animate-spin text-primary" role="status" aria-label="Loading" />
            <p className="text-muted-foreground">Loading feature progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Feature Progress</h1>
        <p className="text-lg text-muted-foreground">
          Track implementation status and validation of all YO-Data features
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.implemented}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Validated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.validated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgCompletion}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          <Button
            variant={activeFilter === 'implemented' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('implemented')}
          >
            Implemented
          </Button>
          <Button
            variant={activeFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={activeFilter === 'validated' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('validated')}
          >
            Validated
          </Button>
        </div>
      </div>

      {/* Features Table */}
      <Card>
        <CardHeader>
          <CardTitle>Features List</CardTitle>
          <CardDescription>
            {filteredFeatures.length} feature{filteredFeatures.length !== 1 ? 's' : ''} found
            {isAdmin && ' • Admin controls enabled'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFeatures.length === 0 ? (
            <div className="py-12 text-center">
              <Filter className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No features found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Feature Name</TableHead>
                    <TableHead className="min-w-[300px]">Description</TableHead>
                    <TableHead className="w-[150px]">Progress</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    {isAdmin && (
                      <>
                        <TableHead className="w-[100px] text-center">Implemented</TableHead>
                        <TableHead className="w-[100px] text-center">Validated</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeatures.map((feature) => (
                    <TableRow key={feature.id}>
                      <TableCell className="font-medium">{feature.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {feature.description}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={Number(feature.completion)} className="h-2" />
                          <span className="text-xs text-muted-foreground">
                            {Number(feature.completion)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(feature)}</TableCell>
                      {isAdmin && (
                        <>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={feature.implemented}
                              onCheckedChange={() => handleImplementedToggle(feature.id, feature.implemented)}
                              disabled={updateFeatureMutation.isPending}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={feature.validated}
                              onCheckedChange={() => handleValidatedToggle(feature.id, feature.validated)}
                              disabled={updateFeatureMutation.isPending}
                            />
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Section */}
      <div className="mt-8">
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle>About Feature Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              This page tracks the implementation and validation status of all features in the YO-Data platform.
              Features are dynamically compiled from project metadata including datasets, explore functionality,
              contact management, governance, monetization, compliance, and all other system capabilities.
            </p>
            {isAdmin && (
              <p className="font-medium text-foreground">
                As an admin, you can update implementation status and validation flags using the checkboxes.
                Progress percentages can be managed through the admin interface.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
