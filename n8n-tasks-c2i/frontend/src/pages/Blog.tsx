import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with n8n Automation',
    excerpt: 'Learn the basics of workflow automation and how n8n can transform your business processes.',
    date: '2025-01-15',
    category: 'Tutorial',
  },
  {
    id: 2,
    title: '10 Essential n8n Workflows for Every Business',
    excerpt: 'Discover the most popular and useful workflow templates that can save you hours every week.',
    date: '2025-01-10',
    category: 'Guide',
  },
  {
    id: 3,
    title: 'Advanced n8n Techniques: Error Handling',
    excerpt: 'Master error handling in n8n workflows to build robust and reliable automations.',
    date: '2025-01-05',
    category: 'Advanced',
  },
];

export default function Blog() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog & Resources</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn about workflow automation, best practices, and tips to get the most out of n8n
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{post.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {post.date}
                </div>
              </div>
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
