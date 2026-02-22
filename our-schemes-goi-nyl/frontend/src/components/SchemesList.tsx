import { useSearchSchemes } from '@/hooks/useQueries';
import SchemeCard from './SchemeCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface SchemesListProps {
  searchText: string;
  ministryFilter: string | null;
  categoryFilter: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function SchemesList({
  searchText,
  ministryFilter,
  categoryFilter,
  currentPage,
  onPageChange,
}: SchemesListProps) {
  const { data, isLoading, error } = useSearchSchemes(
    searchText,
    ministryFilter,
    categoryFilter,
    currentPage,
    12
  );

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Search Results</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load schemes. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.schemes.length === 0) {
    return (
      <Alert className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No schemes found matching your search criteria. Try adjusting your filters or search terms.
        </AlertDescription>
      </Alert>
    );
  }

  const totalPages = Number(data.totalPages);
  const currentPageNum = Number(data.currentPage);

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Search Results</h2>
        <p className="text-sm text-muted-foreground">
          Page {currentPageNum + 1} of {totalPages}
        </p>
      </div>

      <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.schemes.map((scheme) => (
          <SchemeCard key={Number(scheme.id)} scheme={scheme} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPageNum - 1)}
            disabled={currentPageNum === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum = i;
              if (totalPages > 5) {
                if (currentPageNum < 3) {
                  pageNum = i;
                } else if (currentPageNum > totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPageNum - 2 + i;
                }
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPageNum === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="min-w-[40px]"
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPageNum + 1)}
            disabled={currentPageNum >= totalPages - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
