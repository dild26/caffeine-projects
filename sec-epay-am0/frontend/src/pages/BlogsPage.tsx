import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

export default function BlogsPage() {
  const blogs = [
    {
      title: 'Understanding Blockchain Security in Financial Systems',
      excerpt: 'Learn how blockchain-inspired security measures protect your transactions and ensure data integrity.',
      author: 'Secoinfi Team',
      date: 'November 15, 2025',
      category: 'Security',
    },
    {
      title: 'The Future of Decentralized Finance',
      excerpt: 'Explore how decentralized financial platforms are revolutionizing the way we handle money.',
      author: 'Secoinfi Team',
      date: 'November 10, 2025',
      category: 'Finance',
    },
    {
      title: 'Maximizing Returns with Multi-Level Transactions',
      excerpt: 'Discover strategies to optimize your earnings through our multi-level transaction system.',
      author: 'Secoinfi Team',
      date: 'November 5, 2025',
      category: 'Strategy',
    },
    {
      title: 'QRC Payments: The Future of Digital Transactions',
      excerpt: 'Why QRC-based payments are becoming the preferred method for secure, instant transactions.',
      author: 'Secoinfi Team',
      date: 'October 28, 2025',
      category: 'Technology',
    },
    {
      title: 'Comparing Secoinfi with Traditional Chit Funds',
      excerpt: 'A detailed comparison showing why Secoinfi offers superior returns and transparency.',
      author: 'Secoinfi Team',
      date: 'October 20, 2025',
      category: 'Comparison',
    },
    {
      title: 'Getting Started with Secoinfi ePay',
      excerpt: 'A comprehensive guide for new users to set up their account and start transacting.',
      author: 'Secoinfi Team',
      date: 'October 15, 2025',
      category: 'Tutorial',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Insights, updates, and guides from the Secoinfi team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <Card key={index} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <Badge className="w-fit mb-2">{blog.category}</Badge>
              <CardTitle className="text-lg">{blog.title}</CardTitle>
              <CardDescription>{blog.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {blog.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {blog.date}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
