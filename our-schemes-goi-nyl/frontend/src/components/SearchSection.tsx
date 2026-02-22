import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchIcon, XIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SearchSectionProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  ministryFilter: string | null;
  onMinistryChange: (ministry: string | null) => void;
  categoryFilter: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function SearchSection({
  searchText,
  onSearchChange,
  ministryFilter,
  onMinistryChange,
  categoryFilter,
  onCategoryChange,
}: SearchSectionProps) {
  const [inputValue, setInputValue] = useState(searchText);

  const handleSearch = () => {
    onSearchChange(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setInputValue('');
    onSearchChange('');
    onMinistryChange(null);
    onCategoryChange(null);
  };

  const hasActiveFilters = searchText || ministryFilter || categoryFilter;

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search schemes by name, ministry, or tags..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select value={ministryFilter || 'all'} onValueChange={(value) => onMinistryChange(value === 'all' ? null : value)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Ministries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ministries</SelectItem>
                <SelectItem value="Ministry of Agriculture">Ministry of Agriculture</SelectItem>
                <SelectItem value="Ministry of Education">Ministry of Education</SelectItem>
                <SelectItem value="Ministry of Health">Ministry of Health</SelectItem>
                <SelectItem value="Ministry of Finance">Ministry of Finance</SelectItem>
                <SelectItem value="Ministry of Rural Development">Ministry of Rural Development</SelectItem>
                <SelectItem value="Ministry of Women and Child Development">Ministry of Women and Child Development</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter || 'all'} onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Employment">Employment</SelectItem>
                <SelectItem value="Social Welfare">Social Welfare</SelectItem>
                <SelectItem value="Financial Assistance">Financial Assistance</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <XIcon className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
