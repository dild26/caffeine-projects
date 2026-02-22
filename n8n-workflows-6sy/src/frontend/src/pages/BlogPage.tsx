import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with n8n Workflow Automation',
      excerpt: 'Learn the basics of workflow automation and how n8n can transform your business processes.',
      author: 'Admin Team',
      date: 'January 15, 2025',
      image: '/assets/generated/blog-header.dim_600x300.png',
    },
    {
      id: 2,
      title: '10 Essential Workflows Every Business Needs',
      excerpt: 'Discover the most popular workflow templates that can save you hours of manual work every week.',
      author: 'Admin Team',
      date: 'January 10, 2025',
      image: '/assets/generated/blog-header.dim_600x300.png',
    },
    {
      id: 3,
      title: 'Subscription vs Pay-Per-Run: Which Model is Right for You?',
      excerpt: 'Compare our pricing models and find the best option for your automation needs.',
      author: 'Admin Team',
      date: 'January 5, 2025',
      image: '/assets/generated/blog-header.dim_600x300.png',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 border-b-4 border-accent">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights, tutorials, and updates from the n8n Workflows team
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.id} className="border-2 hover:border-primary transition-colors">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
