import { useState, useMemo } from 'react';
import { useGetResources } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  Grid3x3,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  Tag as TagIcon,
  MoreHorizontal,
  SlidersHorizontal
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ResourcesPage() {
  const { data: resources = [], isLoading } = useGetResources();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories
  const categories = useMemo(() =>
    ['all', ...Array.from(new Set(resources.map((r) => r.category)))],
    [resources]
  );

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.hashtags.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [resources, selectedCategory, searchQuery]);

  return (
    <div className="container py-8 space-y-8 min-h-screen">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
            Resource Universe
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Explore a curated collection of educational materials. Filter, search, and discover content tailored to your learning path.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px] md:w-[300px] bg-background/50 backdrop-blur-sm border-primary/10 focus:border-primary/30 transition-all"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("transition-colors", showFilters && "bg-primary/10 border-primary/30 text-primary")}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>

          <div className="bg-muted/50 p-1 rounded-lg flex items-center gap-1 border border-border/50">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Filters Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-xl shadow-black/5">
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" /> Filter by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                        : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="capitalize">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resources Grid/List */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className={cn(
            "grid gap-6",
            viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource) => (
              <motion.div
                layout
                key={resource.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group flex flex-col overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/20">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        {resource.verified && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 mb-2">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        )}
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="capitalize flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary/50" />
                      {resource.category}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6">
                    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <DollarSign className="h-4 w-4" /> Price (USD)
                        </span>
                        <span className="font-bold text-lg">${resource.feeUsd.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm border-t border-border/50 pt-2">
                        <span className="text-muted-foreground">Price (INR)</span>
                        <span className="font-mono">₹{resource.feeRs.toFixed(0)}</span>
                      </div>
                    </div>

                    {resource.topics.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Topics</p>
                        <div className="flex flex-wrap gap-1.5">
                          {resource.topics.slice(0, 3).map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="bg-background/50">
                              {topic}
                            </Badge>
                          ))}
                          {resource.topics.length > 3 && (
                            <Badge variant="outline" className="bg-background/50">+{resource.topics.length - 3}</Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-border/50 bg-muted/10">
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <BookOpen className="h-4 w-4 mr-2" /> View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!isLoading && filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No resources found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          <Button
            variant="link"
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-4 text-primary"
          >
            Clear all filters
          </Button>
        </motion.div>
      )}

    </div>
  );
}
