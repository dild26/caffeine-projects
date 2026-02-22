import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function Blog() {
  const posts = [
    {
      title: 'Getting Started with SECOINFI',
      excerpt: 'Learn how to set up your business management platform and start managing your operations efficiently.',
      date: '2025-01-15',
      author: 'SECOINFI Team',
    },
    {
      title: 'Best Practices for CRM Management',
      excerpt: 'Discover proven strategies for organizing contacts, tracking interactions, and building lasting customer relationships.',
      date: '2025-01-10',
      author: 'Sales Team',
    },
    {
      title: 'Streamlining Your Billing Process',
      excerpt: 'Tips and tricks for efficient invoice generation, payment tracking, and financial management.',
      date: '2025-01-05',
      author: 'Finance Team',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Insights, updates, and best practices for business management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <p className="text-sm text-muted-foreground">By {post.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
