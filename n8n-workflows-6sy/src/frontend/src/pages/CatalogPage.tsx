import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, ShoppingCart } from 'lucide-react';
import WorkflowCard from '../components/WorkflowCard';
import { useGetWorkflowsPaginated, useCreateCheckoutSession } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ShoppingItem } from '../backend';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CartItem {
  workflowId: string;
  quantity: number;
  priceInCents: number;
  title: string;
}

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccessType, setSelectedAccessType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInputValue, setPageInputValue] = useState('1');
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const pageSize = 12;

  const { data: paginatedData, isLoading, isFetching } = useGetWorkflowsPaginated(currentPage, pageSize);
  const createCheckout = useCreateCheckoutSession();

  // Sync page input with current page
  useEffect(() => {
    setPageInputValue(String(currentPage + 1));
  }, [currentPage]);

  const workflows = useMemo(() => {
    let results = paginatedData?.workflows || [];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(w =>
        w.title.toLowerCase().includes(term) ||
        w.description.toLowerCase().includes(term) ||
        w.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(w => w.category === selectedCategory);
    }

    // Filter by access type
    if (selectedAccessType !== 'all') {
      results = results.filter(w => {
        const accessTypeKey = w.accessType === 'payPerRun' || w.accessType === 'subscription'
          ? w.accessType
          : Object.keys(w.accessType)[0];
        return accessTypeKey === selectedAccessType;
      });
    }

    return results;
  }, [paginatedData, searchTerm, selectedCategory, selectedAccessType]);

  const handleQuantityChange = (workflowId: string, quantity: number, selected: boolean) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    const newCart = new Map(cart);

    if (selected && quantity >= 5) {
      newCart.set(workflowId, {
        workflowId,
        quantity,
        priceInCents: Number(workflow.priceInCents),
        title: workflow.title,
      });
    } else {
      newCart.delete(workflowId);
    }

    setCart(newCart);
  };

  const calculateCartTotal = () => {
    let total = 0;
    cart.forEach(item => {
      const itemPrice = Math.max(10, item.priceInCents);
      total += itemPrice * item.quantity;
    });
    return total;
  };

  const handleCheckout = async () => {
    if (cart.size === 0) {
      toast.error('Please select at least one workflow');
      return;
    }

    const totalInCents = calculateCartTotal();
    if (totalInCents < 50) {
      toast.error('Minimum order total must be at least $0.50');
      return;
    }

    const items: ShoppingItem[] = Array.from(cart.values()).map(item => ({
      productName: item.title,
      productDescription: `${item.quantity} units of ${item.title}`,
      priceInCents: BigInt(Math.max(10, item.priceInCents)),
      quantity: BigInt(item.quantity),
      currency: 'usd',
    }));

    try {
      const sessionUrl = await createCheckout.mutateAsync(items);
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create checkout session');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedAccessType('all');
    setCurrentPage(0);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedAccessType !== 'all';

  // Extract unique categories from results
  const categories = useMemo(() => {
    const cats = new Set<string>();
    if (paginatedData?.workflows) {
      paginatedData.workflows.forEach(w => cats.add(w.category));
    }
    return Array.from(cats).sort();
  }, [paginatedData]);

  const totalPages = Number(paginatedData?.totalPages || 0);
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const handleFirstPage = () => {
    if (canGoPrevious) {
      setCurrentPage(0);
    }
  };

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      setCurrentPage(prev => Math.max(0, prev - 1));
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    }
  };

  const handleLastPage = () => {
    if (canGoNext) {
      setCurrentPage(totalPages - 1);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setPageInputValue(value);
    }
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInputValue, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum - 1);
    } else {
      setPageInputValue(String(currentPage + 1));
    }
  };

  const handlePageInputBlur = () => {
    const pageNum = parseInt(pageInputValue, 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      setPageInputValue(String(currentPage + 1));
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);

      if (currentPage <= 2) {
        end = Math.min(totalPages - 2, 3);
      }

      if (currentPage >= totalPages - 3) {
        start = Math.max(1, totalPages - 4);
      }

      if (start > 1) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <div className="container py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Workflow Catalog</h1>
          <p className="text-lg text-muted-foreground">
            Browse workflows, select multiple items, and checkout with minimum $0.50 total order value.
          </p>
        </div>

        {/* Cart Summary */}
        {cart.size > 0 && (
          <Card className="border-2 border-primary bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/generated/workflow-icon-transparent.dim_64x64.png"
                    alt="Cart"
                    className="h-12 w-auto rounded"
                  />
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Shopping Cart ({cart.size} {cart.size === 1 ? 'item' : 'items'})
                    </CardTitle>
                    <CardDescription>
                      Total: ${(calculateCartTotal() / 100).toFixed(2)}
                      {calculateCartTotal() < 50 && (
                        <span className="text-destructive ml-2">
                          (Minimum $0.50 required)
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={createCheckout.isPending || calculateCartTotal() < 50}
                  size="lg"
                >
                  {createCheckout.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Checkout
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {calculateCartTotal() < 50 && (
              <CardContent>
                <Alert variant="destructive">
                  <AlertDescription>
                    Minimum order total must be at least $0.50. Current total: ${(calculateCartTotal() / 100).toFixed(2)}
                  </AlertDescription>
                </Alert>
              </CardContent>
            )}
          </Card>
        )}

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAccessType} onValueChange={setSelectedAccessType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Access Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Access Types</SelectItem>
                  <SelectItem value="payPerRun">Pay per Run</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary">
                  Category: {selectedCategory}
                </Badge>
              )}
              {selectedAccessType !== 'all' && (
                <Badge variant="secondary">
                  Access: {selectedAccessType === 'payPerRun' ? 'Pay per Run' : 'Subscription'}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading workflows...</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              {hasActiveFilters && (
                <Button onClick={handleClearFilters}>Clear All Filters</Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Found {workflows.length} workflow{workflows.length !== 1 ? 's' : ''} on page {currentPage + 1} of {totalPages}
                </p>
                {isFetching && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {workflows.map((workflow) => (
                  <WorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    onQuantityChange={handleQuantityChange}
                    initialQuantity={cart.get(workflow.id)?.quantity || 5}
                    initialSelected={cart.has(workflow.id)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-center gap-2 flex-wrap relative">
                    <img
                      src="/assets/generated/pagination-controls.dim_400x60.png"
                      alt="Pagination"
                      className="absolute opacity-10 h-12 pointer-events-none"
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFirstPage}
                      disabled={!canGoPrevious || isFetching}
                      title="First Page"
                      className="z-10"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={!canGoPrevious || isFetching}
                      title="Previous Page"
                      className="z-10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1 z-10">
                      {getPageNumbers().map((page, idx) => (
                        page === '...' ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        ) : (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page as number)}
                            disabled={isFetching}
                            className="min-w-[2.5rem]"
                          >
                            {(page as number) + 1}
                          </Button>
                        )
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!canGoNext || isFetching}
                      title="Next Page"
                      className="z-10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLastPage}
                      disabled={!canGoNext || isFetching}
                      title="Last Page"
                      className="z-10"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Go to page:</span>
                      <Input
                        type="text"
                        value={pageInputValue}
                        onChange={handlePageInputChange}
                        onBlur={handlePageInputBlur}
                        disabled={isFetching}
                        className="w-20 text-center"
                        placeholder="1"
                        min="1"
                        max={totalPages}
                      />
                      <span className="text-sm text-muted-foreground">of {totalPages}</span>
                      <Button
                        type="submit"
                        size="sm"
                        variant="secondary"
                        disabled={isFetching}
                      >
                        Go
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
