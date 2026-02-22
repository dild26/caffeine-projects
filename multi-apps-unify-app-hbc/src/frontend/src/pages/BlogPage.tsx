import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      title: 'Introduction to Multi-Apps-Unify',
      description: 'Learn about the core concepts and features of our specification management platform',
      date: 'December 15, 2025',
      author: 'Platform Team',
      tags: ['Introduction', 'Features'],
    },
    {
      title: 'YAML to Markdown Synchronization',
      description: 'Understanding how our two-way synchronization system works',
      date: 'December 14, 2025',
      author: 'Technical Team',
      tags: ['Technical', 'Sync'],
    },
    {
      title: 'Best Practices for Specification Management',
      description: 'Tips and tricks for managing your specification files effectively',
      date: 'December 13, 2025',
      author: 'Platform Team',
      tags: ['Best Practices', 'Guide'],
    },
  ];

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Latest updates, guides, and insights about Multi-Apps-Unify
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {posts.map((post, index) => (
          <Card key={index} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex flex-wrap gap-2">
                {post.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <CardDescription className="text-base">{post.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
