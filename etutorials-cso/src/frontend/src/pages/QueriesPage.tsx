import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Filter, Hash, Database, Zap } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function QueriesPage() {
  const queryTypes = [
    {
      name: 'Hashtag Search',
      icon: Hash,
      description: 'Search resources and instructors by hashtags',
      examples: ['#programming', '#mathematics', '#beginner', '#advanced'],
      features: ['Fast indexed search', 'Multiple hashtag support', 'Real-time results', 'Category filtering'],
    },
    {
      name: 'Category Filter',
      icon: Filter,
      description: 'Browse resources by category',
      examples: ['Hardware', 'Software', 'Programming', 'Design'],
      features: ['Hierarchical categories', 'Resource grouping', 'Matrix view', 'Count statistics'],
    },
    {
      name: 'Instructor Availability',
      icon: Search,
      description: 'Find instructors by availability and topics',
      examples: ['Monday 10-12', 'Evening slots', 'Weekend availability'],
      features: ['Time slot search', 'Topic matching', 'Availability calendar', 'Booking integration'],
    },
    {
      name: 'Progress Tracking',
      icon: Database,
      description: 'Query learner progress and statistics',
      examples: ['Topic completion', 'Learning pace', 'Difficulty levels'],
      features: ['Progress metrics', 'Topic breakdown', 'Pace analysis', 'Historical data'],
    },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Search className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Search & Queries</h1>
        <p className="text-xl text-muted-foreground">
          Powerful search capabilities to find exactly what you need on the platform.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Query System Overview
            </CardTitle>
            <CardDescription>
              Fast and efficient data retrieval across the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The E-Tutorial platform implements a sophisticated query system that allows users to quickly find 
              resources, instructors, and information using various search methods. All queries are optimized for 
              performance and return results in real-time.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Query Methods</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Hashtag-based search</li>
                  <li>• Category filtering</li>
                  <li>• Availability queries</li>
                  <li>• Progress tracking</li>
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Performance</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time results</li>
                  <li>• Indexed data structures</li>
                  <li>• Cached queries</li>
                  <li>• Optimized algorithms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {queryTypes.map((query) => {
          const Icon = query.icon;
          return (
            <Card key={query.name}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{query.name}</CardTitle>
                    <CardDescription>{query.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Example Queries:</h4>
                  <div className="flex flex-wrap gap-2">
                    {query.examples.map((example) => (
                      <Badge key={example} variant="outline" className="font-mono text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Features:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {query.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardHeader>
            <CardTitle>Advanced Query Features</CardTitle>
            <CardDescription>
              Powerful capabilities for complex searches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  Multi-Hashtag Search
                </h4>
                <p className="text-sm text-muted-foreground">
                  Combine multiple hashtags to narrow down search results. For example, search for both #programming 
                  and #beginner to find beginner-level programming resources.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  Dynamic Filtering
                </h4>
                <p className="text-sm text-muted-foreground">
                  Apply filters on top of search results to refine by category, fee range, duration, or difficulty level. 
                  Filters update results in real-time without page reloads.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Resource Matrix
                </h4>
                <p className="text-sm text-muted-foreground">
                  View resources organized in a matrix format grouped by category. This provides a comprehensive 
                  overview of available materials and their relationships.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query Best Practices</CardTitle>
            <CardDescription>
              Tips for effective searching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Be Specific:</strong> Use precise hashtags to get more relevant results (e.g., #react instead of #programming).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Combine Filters:</strong> Use category filters along with hashtag search for best results.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Check Availability:</strong> When searching for instructors, verify their availability before booking.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Explore Categories:</strong> Browse by category to discover resources you might not find through search.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
