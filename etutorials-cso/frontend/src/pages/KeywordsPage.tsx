import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Hash, Search, Tag } from 'lucide-react';

export default function KeywordsPage() {
  const keywordCategories = [
    {
      category: 'Educational Topics',
      keywords: ['programming', 'mathematics', 'science', 'languages', 'arts', 'history', 'geography', 'physics', 'chemistry', 'biology'],
    },
    {
      category: 'Technology',
      keywords: ['software', 'hardware', 'networking', 'databases', 'cloud', 'AI', 'machine-learning', 'web-development', 'mobile-apps', 'cybersecurity'],
    },
    {
      category: 'Learning Levels',
      keywords: ['beginner', 'intermediate', 'advanced', 'expert', 'fundamentals', 'basics', 'professional', 'certification'],
    },
    {
      category: 'Resource Types',
      keywords: ['tutorial', 'course', 'workshop', 'lecture', 'hands-on', 'project-based', 'video', 'interactive', 'documentation'],
    },
    {
      category: 'Skills',
      keywords: ['problem-solving', 'critical-thinking', 'collaboration', 'communication', 'creativity', 'analysis', 'research', 'presentation'],
    },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Hash className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Keywords & Hashtags</h1>
        <p className="text-xl text-muted-foreground">
          Discover educational content through our comprehensive keyword and hashtag system.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Hashtag Search System
            </CardTitle>
            <CardDescription>
              Use hashtags to quickly find resources and instructors matching your interests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our platform uses a powerful hashtag-based search system that allows you to discover educational resources 
              and instructors by topic, skill level, technology, and more. Simply search for any hashtag to find relevant content.
            </p>
            <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
              <Tag className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium">How to use hashtags:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Search for resources using #programming, #mathematics, etc.</li>
                  <li>Find instructors by their specialization hashtags</li>
                  <li>Filter by difficulty level: #beginner, #advanced</li>
                  <li>Combine multiple hashtags for precise results</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {keywordCategories.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
              <CardDescription>
                Popular keywords in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-sm">
                    #{keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Custom Hashtags</CardTitle>
            <CardDescription>
              Create and use custom hashtags for specialized topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Instructors and administrators can create custom hashtags to categorize specialized content. 
              This flexibility ensures that even niche topics can be easily discovered and accessed by learners.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
