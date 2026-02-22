import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetPaginatedTemplates, useGetPaginatedTemplatesByCategory, useIsCallerAdmin, useGetAllTemplates } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload, FileText, Lock, SortAsc, SortDesc, Filter, FileArchive, Layers, BarChart3, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import DynamicTemplateCreator from '../components/DynamicTemplateCreator';
import BulkTemplateUploader from '../components/BulkTemplateUploader';
import ImportReportsViewer from '../components/ImportReportsViewer';
import PaginationControls from '../components/PaginationControls';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: fullTemplates } = useGetAllTemplates();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'single' | 'bulk'>('single');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const isAuthenticated = !!identity;

  // Fetch both paginated queries unconditionally (Rules of Hooks requirement)
  const { data: allTemplatesData, isLoading: isAllTemplatesLoading } = useGetPaginatedTemplates(currentPage, itemsPerPage);
  const { data: categoryTemplatesData, isLoading: isCategoryTemplatesLoading } = useGetPaginatedTemplatesByCategory(
    categoryFilter,
    currentPage,
    itemsPerPage
  );

  // Choose which data to use based on category filter
  const paginatedData = categoryFilter === 'all' ? allTemplatesData : categoryTemplatesData;
  const isPaginatedLoading = categoryFilter === 'all' ? isAllTemplatesLoading : isCategoryTemplatesLoading;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery, sortBy, sortOrder, itemsPerPage]);

  // Get unique categories from full templates for filter dropdown
  const categories = useMemo(() => {
    if (!fullTemplates) return [];
    const cats = new Set(fullTemplates.map(t => t.category));
    return Array.from(cats).sort();
  }, [fullTemplates]);

  // Apply client-side search and sorting to paginated results
  const filteredTemplates = useMemo(() => {
    if (!paginatedData?.items) return [];

    let filtered = paginatedData.items;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        // For size sorting, we need full template data
        const aTemplate = fullTemplates?.find(ft => ft.id === a.id);
        const bTemplate = fullTemplates?.find(ft => ft.id === b.id);
        const aSize = aTemplate ? Number(aTemplate.size) : 0;
        const bSize = bTemplate ? Number(bTemplate.size) : 0;
        return sortOrder === 'asc' ? aSize - bSize : bSize - aSize;
      }
    });

    return filtered;
  }, [paginatedData?.items, fullTemplates, searchQuery, sortBy, sortOrder]);

  const handleTemplateClick = (templateId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to view template details');
      return;
    }
    
    // Navigate to template detail page
    navigate({ to: `/templates/${templateId}` });
  };

  const handleTemplateCreated = () => {
    setUploadDialogOpen(false);
    toast.success('Template created successfully');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const totalPages = paginatedData ? Number(paginatedData.totalPages) : 1;
  const totalItems = paginatedData ? Number(paginatedData.totalItems) : 0;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">Contract Templates</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Browse our collection of professional contract templates. Login to access full details and create contracts.
          </p>
        </div>

        {/* Admin Upload Section - Always visible for admin users */}
        {isAdmin && (
          <div className="mb-8 flex gap-4">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Contract Template</DialogTitle>
                  <DialogDescription>
                    Upload 51+ .json and .md files at once with intelligent file matching, or bulk upload a .zip archive
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'single' | 'bulk')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Multi-File Upload (51+)
                    </TabsTrigger>
                    <TabsTrigger value="bulk" className="gap-2">
                      <FileArchive className="h-4 w-4" />
                      Bulk ZIP Upload
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="single">
                    <DynamicTemplateCreator onSuccess={handleTemplateCreated} />
                  </TabsContent>

                  <TabsContent value="bulk">
                    <BulkTemplateUploader onSuccess={handleTemplateCreated} />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Dialog open={reportsDialogOpen} onOpenChange={setReportsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Import Reports
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Template Import Reports & Analytics</DialogTitle>
                  <DialogDescription>
                    View detailed analytics, import history, and processing statistics
                  </DialogDescription>
                </DialogHeader>
                <ImportReportsViewer />
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'name' | 'size')}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Results Count */}
        {!isPaginatedLoading && (
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredTemplates.length} of {totalItems} template{totalItems !== 1 ? 's' : ''}
          </div>
        )}

        {/* Templates Grid */}
        {isPaginatedLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i}>
                <CardHeader className="p-0">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="mb-2 h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTemplates.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTemplates.map((template) => {
                const fullTemplate = fullTemplates?.find(t => t.id === template.id);
                let isParsed = true;
                
                if (fullTemplate && fullTemplate.dynamicStructure) {
                  try {
                    const structure = JSON.parse(fullTemplate.dynamicStructure);
                    isParsed = structure.isParsed !== false;
                  } catch (error) {
                    console.error('Error parsing template structure:', error);
                  }
                }
                
                return (
                  <Card
                    key={template.id}
                    className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
                    onClick={() => handleTemplateClick(template.id)}
                  >
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden bg-muted">
                        <img
                          src={template.previewImage}
                          alt={template.name}
                          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                        />
                        {!isAuthenticated && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="text-center text-white">
                              <Lock className="mx-auto mb-2 h-8 w-8" />
                              <p className="text-sm font-medium">Login to View</p>
                            </div>
                          </div>
                        )}
                        {isAuthenticated && !isParsed && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="gap-1 bg-yellow-500/90 text-white">
                              <Clock className="h-3 w-3" />
                              Processing
                            </Badge>
                          </div>
                        )}
                        {isAuthenticated && isParsed && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge variant="default" className="gap-1">
                              <ExternalLink className="h-3 w-3" />
                              View Form
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="mb-2 text-lg">{template.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                        <FileText className="h-3 w-3 text-muted-foreground" />
                      </div>
                      {!isParsed && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Template details coming soon
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No templates found</h3>
            <p className="text-muted-foreground">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No templates available yet'}
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-8">
          <div className="mx-auto max-w-3xl text-center">
            <Layers className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-4 text-3xl font-bold">Dynamic Template Forms with Cryptographic Verification</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Click any template to access dynamically generated web forms with all fields, sub-fields, and correct labels/types. 
              Forms support recursive/nested fields, real-time updates, versioning, and are secured with ETH signatures and ZK proof verification.
              Upload 51+ .json and .md files simultaneously with intelligent file matching by base name. 
              Template names auto-generated from filename with first character capitalized. Default category set to "Legal". 
              All fields and sub-fields populated as recursive tree structure with SHA-256 deduplication and comprehensive validation.
            </p>
            {!isAuthenticated && (
              <Button
                size="lg"
                onClick={() => navigate({ to: '/' })}
                className="gap-2"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
