import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface SearchFiltersState {
  query: string;
  category: string;
  trendIndicator: string;
  sortBy: string;
  minScore: string;
  minVotes: string;
}

interface SearchFiltersProps {
  filters: SearchFiltersState;
  onFiltersChange: (filters: SearchFiltersState) => void;
  onReset: () => void;
}

export default function SearchFilters({ filters, onFiltersChange, onReset }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof SearchFiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.category !== 'all' || 
    filters.trendIndicator !== 'all' || 
    filters.sortBy !== 'score' ||
    filters.minScore !== '' ||
    filters.minVotes !== '';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filters
          </CardTitle>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                {isOpen ? 'Hide' : 'Show'} Filters
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="search-query">Search Topics</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-query"
              placeholder="Search by title, category, or content..."
              value={filters.query}
              onChange={(e) => handleChange('query', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Collapsible open={isOpen}>
          <CollapsibleContent className="space-y-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={filters.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Politics">Politics</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trend Indicator Filter */}
            <div className="space-y-2">
              <Label htmlFor="trend">Trend Status</Label>
              <Select value={filters.trendIndicator} onValueChange={(value) => handleChange('trendIndicator', value)}>
                <SelectTrigger id="trend">
                  <SelectValue placeholder="All Trends" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trends</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="rising">Rising</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => handleChange('sortBy', value)}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Score (High to Low)</SelectItem>
                  <SelectItem value="votes">Total Votes (High to Low)</SelectItem>
                  <SelectItem value="rank">Rank (Best to Worst)</SelectItem>
                  <SelectItem value="clicks">Clicks (High to Low)</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Score */}
            <div className="space-y-2">
              <Label htmlFor="min-score">Minimum Score</Label>
              <Input
                id="min-score"
                type="number"
                placeholder="e.g., 50"
                value={filters.minScore}
                onChange={(e) => handleChange('minScore', e.target.value)}
              />
            </div>

            {/* Min Votes */}
            <div className="space-y-2">
              <Label htmlFor="min-votes">Minimum Total Votes</Label>
              <Input
                id="min-votes"
                type="number"
                placeholder="e.g., 10"
                value={filters.minVotes}
                onChange={(e) => handleChange('minVotes', e.target.value)}
              />
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={onReset} className="w-full gap-2">
                <X className="h-4 w-4" />
                Reset Filters
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
