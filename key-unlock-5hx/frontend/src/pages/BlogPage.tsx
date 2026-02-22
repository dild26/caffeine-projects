import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Internet Identity',
      excerpt: 'Learn how Internet Identity provides secure, passwordless authentication on the Internet Computer.',
      date: 'November 5, 2025',
      author: 'SECOINFI Team'
    },
    {
      id: 2,
      title: 'The Future of Decentralized Authentication',
      excerpt: 'Explore how blockchain technology is revolutionizing identity management and user authentication.',
      date: 'November 1, 2025',
      author: 'SECOINFI Team'
    },
    {
      id: 3,
      title: 'Security Best Practices',
      excerpt: 'Essential tips for maintaining secure authentication across multiple platforms and services.',
      date: 'October 28, 2025',
      author: 'SECOINFI Team'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="text-xl text-muted-foreground">
            Latest news and insights from SECOINFI
          </p>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
