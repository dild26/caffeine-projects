import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import SearchSection from '@/components/SearchSection';
import SchemesList from '@/components/SchemesList';
import PinnedSchemes from '@/components/PinnedSchemes';

export default function HomePage() {
  const [searchText, setSearchText] = useState('');
  const [ministryFilter, setMinistryFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleSearch = (text: string) => {
    setSearchText(text);
    setCurrentPage(0);
  };

  const handleMinistryChange = (ministry: string | null) => {
    setMinistryFilter(ministry);
    setCurrentPage(0);
  };

  const handleCategoryChange = (category: string | null) => {
    setCategoryFilter(category);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-8">
      {/* Hero Banner */}
      <div className="relative mb-8 overflow-hidden rounded-xl">
        <img 
          src="/assets/generated/hero-banner.dim_800x400.png" 
          alt="Government Schemes" 
          className="h-48 w-full object-cover md:h-64"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70">
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <h1 className="mb-2 text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Discover Government Schemes
            </h1>
            <p className="max-w-2xl text-sm text-primary-foreground/90 md:text-base">
              Search and explore government schemes designed to help citizens across India
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer Alert */}
      <Alert className="mb-6 border-primary/30 bg-primary/5">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> ourSchemes is not an official government app. All links lead to official portals such as myscheme.gov.in.
        </AlertDescription>
      </Alert>

      {/* Search Section */}
      <SearchSection
        searchText={searchText}
        onSearchChange={handleSearch}
        ministryFilter={ministryFilter}
        onMinistryChange={handleMinistryChange}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
      />

      {/* Schemes List */}
      <SchemesList
        searchText={searchText}
        ministryFilter={ministryFilter}
        categoryFilter={categoryFilter}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Pinned Schemes */}
      <PinnedSchemes />
    </div>
  );
}
