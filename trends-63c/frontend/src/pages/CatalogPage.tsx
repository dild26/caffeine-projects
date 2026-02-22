import { useState, useMemo } from 'react';
import { useGetAllTopics } from '../hooks/useQueries';
import PolygonCard from '../components/PolygonCard';
import SearchFilters, { SearchFiltersState } from '../components/SearchFilters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PAGE_SIZE = 20;

const initialFilters: SearchFiltersState = {
  query: '',
  category: 'all',
  trendIndicator: 'all',
  sortBy: 'score',
  minScore: '',
  minVotes: '',
};

export default function CatalogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFiltersState>(initialFilters);
  const { data: allTopics, isLoading } = useGetAllTopics();

  // Filter and sort topics
  const filteredTopics = useMemo(() => {
    if (!allTopics) return [];

    let result = [...allTopics];

    // Apply search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(
        (topic) =>
          topic.title.toLowerCase().includes(query) ||
          topic.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter((topic) => topic.category === filters.category);
    }

    // Apply trend indicator filter
    if (filters.trendIndicator !== 'all') {
      result = result.filter((topic) => topic.trendIndicator === filters.trendIndicator);
    }

    // Apply minimum score filter
    if (filters.minScore) {
      const minScore = parseInt(filters.minScore);
      if (!isNaN(minScore)) {
        result = result.filter((topic) => Number(topic.score) >= minScore);
      }
    }

    // Apply minimum votes filter
    if (filters.minVotes) {
      const minVotes = parseInt(filters.minVotes);
      if (!isNaN(minVotes)) {
        result = result.filter((topic) => Number(topic.totalVotes) >= minVotes);
      }
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'score':
        result.sort((a, b) => Number(b.score) - Number(a.score));
        break;
      case 'votes':
        result.sort((a, b) => Number(b.totalVotes) - Number(a.totalVotes));
        break;
      case 'rank':
        result.sort((a, b) => Number(a.rank) - Number(b.rank));
        break;
      case 'clicks':
        result.sort((a, b) => Number(b.clickCount) - Number(a.clickCount));
        break;
      case 'recent':
        result.sort((a, b) => Number(b.id) - Number(a.id));
        break;
    }

    return result;
  }, [allTopics, filters]);

  // Pagination
  const totalItems = filteredTopics.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const paginatedTopics = filteredTopics.slice(startIndex, endIndex);

  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const handleLastPage = () => setCurrentPage(totalPages);

  const handleFiltersChange = (newFilters: SearchFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <TrendingUp className="h-12 w-12 text-primary" />
              <div className="absolute inset-0 animate-pulse bg-primary/30 blur-2xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Trending Topics
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest trends from across the web. Real-time insights powered by AI.
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Results Summary */}
        <div className="text-center text-sm text-muted-foreground">
          Showing {startIndex + 1}-{endIndex} of {totalItems} topics
        </div>

        {/* Topics Grid */}
        {paginatedTopics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No topics found matching your filters.</p>
            <Button variant="outline" onClick={handleResetFilters} className="mt-4">
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
              {paginatedTopics.map((topic, index) => (
                <PolygonCard key={topic.id.toString()} topic={topic} index={index} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFirstPage}
                  disabled={!hasPrevious}
                  className="gap-1"
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">First</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={!hasPrevious}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!hasNext}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLastPage}
                  disabled={!hasNext}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Last</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
