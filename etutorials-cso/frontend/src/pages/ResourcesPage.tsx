import { useState } from 'react';
import { useGetResources, useGetResourceMatrixByCategory } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { BookOpen, DollarSign, Tag, Grid3x3 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function ResourcesPage() {
  const { data: resources = [], isLoading } = useGetResources();
  const getMatrixByCategory = useGetResourceMatrixByCategory();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');

  const categories = ['all', ...Array.from(new Set(resources.map((r) => r.category)))];
  
  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter((r) => r.category === selectedCategory);

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    if (category !== 'all' && viewMode === 'matrix') {
      await getMatrixByCategory.mutateAsync(category);
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resource Catalog</h1>
          <p className="text-muted-foreground">
            Browse educational resources organized by category with automatic fee conversion.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            size="sm"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Grid View
          </Button>
          <Button
            variant={viewMode === 'matrix' ? 'default' : 'outline'}
            onClick={() => setViewMode('matrix')}
            size="sm"
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            Matrix View
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No resources found in this category.</p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  {resource.verified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
                <CardDescription className="capitalize">{resource.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">${resource.feeUsd.toFixed(2)} USD</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ₹{resource.feeRs.toFixed(0)} (converted at ₹90 = $1)
                  </div>
                </div>
                
                {resource.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resource.hashtags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {resource.topics.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Topics Covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {resource.topics.map((topic, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Resource Matrix - {selectedCategory === 'all' ? 'All Categories' : selectedCategory}</CardTitle>
            <CardDescription>Tabular view of resources grouped by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Fee (USD)</TableHead>
                    <TableHead>Fee (Rs)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Topics</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-mono text-xs">{resource.id}</TableCell>
                      <TableCell className="font-medium">{resource.title}</TableCell>
                      <TableCell className="capitalize">{resource.category}</TableCell>
                      <TableCell>${resource.feeUsd.toFixed(2)}</TableCell>
                      <TableCell>₹{resource.feeRs.toFixed(0)}</TableCell>
                      <TableCell>
                        {resource.verified ? (
                          <Badge variant="secondary">Verified</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {resource.topics.slice(0, 2).map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {resource.topics.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{resource.topics.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
