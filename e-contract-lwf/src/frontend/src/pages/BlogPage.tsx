import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      title: 'Getting Started with E-Contracts',
      excerpt: 'Learn how to create and manage your first e-contract with our comprehensive guide.',
      date: '2025-01-15',
      author: 'Admin',
      category: 'Tutorial',
    },
    {
      title: 'The Future of Digital Contracts',
      excerpt: 'Explore how blockchain technology is revolutionizing contract management.',
      date: '2025-01-10',
      author: 'Admin',
      category: 'Technology',
    },
    {
      title: 'Security Best Practices',
      excerpt: 'Essential security measures for protecting your digital contracts.',
      date: '2025-01-05',
      author: 'Admin',
      category: 'Security',
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Blog</h1>
        <p className="text-muted-foreground">
          Latest news, updates, and insights about e-contract management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{post.category}</Badge>
              </div>
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

      <div className="mt-8 text-center">
        <p className="text-muted-foreground">More blog posts coming soon...</p>
      </div>
    </div>
  );
}
