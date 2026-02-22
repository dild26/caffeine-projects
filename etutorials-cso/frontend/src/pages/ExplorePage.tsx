import { useState } from 'react';
import { useGetResources, useGetInstructors, useSearchResourcesByHashtag, useSearchInstructorsByHashtag } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Tag, DollarSign, BookOpen, Users } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('resources');
  
  const { data: allResources = [], isLoading: resourcesLoading } = useGetResources();
  const { data: allInstructors = [], isLoading: instructorsLoading } = useGetInstructors();
  
  const searchResources = useSearchResourcesByHashtag();
  const searchInstructors = useSearchInstructorsByHashtag();

  const [filteredResources, setFilteredResources] = useState(allResources);
  const [filteredInstructors, setFilteredInstructors] = useState(allInstructors);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredResources(allResources);
      setFilteredInstructors(allInstructors);
      return;
    }

    const hashtag = searchQuery.startsWith('#') ? searchQuery.slice(1) : searchQuery;

    if (activeTab === 'resources') {
      const results = await searchResources.mutateAsync(hashtag);
      setFilteredResources(results);
    } else {
      const results = await searchInstructors.mutateAsync(hashtag);
      setFilteredInstructors(results);
    }
  };

  const displayResources = searchQuery ? filteredResources : allResources;
  const displayInstructors = searchQuery ? filteredInstructors : allInstructors;

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Explore Resources & Instructors</h1>
        <p className="text-muted-foreground">
          Search by hashtags to find educational resources and instructors that match your needs.
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hashtag (e.g., #python, #beginner)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={searchResources.isPending || searchInstructors.isPending}>
              {searchResources.isPending || searchInstructors.isPending ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="resources">
            <BookOpen className="h-4 w-4 mr-2" />
            Resources ({displayResources.length})
          </TabsTrigger>
          <TabsTrigger value="instructors">
            <Users className="h-4 w-4 mr-2" />
            Instructors ({displayInstructors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4 mt-6">
          {resourcesLoading ? (
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
          ) : displayResources.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No resources found. Try a different search term.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      {resource.verified && (
                        <Badge variant="secondary" className="ml-2">Verified</Badge>
                      )}
                    </div>
                    <CardDescription className="capitalize">{resource.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${resource.feeUsd.toFixed(2)}</span>
                      <span className="text-muted-foreground">(₹{resource.feeRs.toFixed(0)})</span>
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
                        <p className="text-xs font-medium text-muted-foreground">Topics:</p>
                        <div className="flex flex-wrap gap-1">
                          {resource.topics.slice(0, 3).map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {resource.topics.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{resource.topics.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="instructors" className="space-y-4 mt-6">
          {instructorsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayInstructors.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No instructors found. Try a different search term.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayInstructors.map((instructor) => (
                <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{instructor.name}</CardTitle>
                    <CardDescription>ID: {instructor.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {instructor.topics.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Specializations:</p>
                        <div className="flex flex-wrap gap-1">
                          {instructor.topics.map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {instructor.availability.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Availability:</p>
                        <div className="text-sm">
                          {instructor.availability.slice(0, 2).map((slot, idx) => (
                            <div key={idx} className="text-muted-foreground">{slot}</div>
                          ))}
                          {instructor.availability.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{instructor.availability.length - 2} more slots
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {instructor.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {instructor.hashtags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
