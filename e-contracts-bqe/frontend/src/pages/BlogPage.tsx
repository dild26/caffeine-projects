import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  const blogPosts = [
    {
      title: 'The Future of Digital Contracts',
      excerpt: 'Explore how blockchain technology is revolutionizing contract management and what it means for businesses.',
      author: 'Sarah Johnson',
      date: 'October 20, 2025',
      category: 'Technology',
      image: '/assets/generated/blog-header.dim_800x300.png',
    },
    {
      title: '5 Benefits of Voice-Enabled Contract Management',
      excerpt: 'Discover how voice commands can streamline your workflow and improve productivity in contract management.',
      author: 'Michael Chen',
      date: 'October 15, 2025',
      category: 'Features',
      image: '/assets/generated/blog-header.dim_800x300.png',
    },
    {
      title: 'Security Best Practices for E-Contracts',
      excerpt: 'Learn essential security measures to protect your digital contracts and maintain data integrity.',
      author: 'Emily Rodriguez',
      date: 'October 10, 2025',
      category: 'Security',
      image: '/assets/generated/blog-header.dim_800x300.png',
    },
    {
      title: 'How AI is Transforming Contract Analysis',
      excerpt: 'Artificial intelligence is changing how we review and analyze contracts. Here\'s what you need to know.',
      author: 'David Kim',
      date: 'October 5, 2025',
      category: 'AI',
      image: '/assets/generated/blog-header.dim_800x300.png',
    },
    {
      title: 'Getting Started with E-Contracts: A Beginner\'s Guide',
      excerpt: 'New to digital contracts? This comprehensive guide will help you get started with E-Contracts platform.',
      author: 'Lisa Anderson',
      date: 'September 30, 2025',
      category: 'Tutorial',
      image: '/assets/generated/blog-header.dim_800x300.png',
    },
    {
      title: 'The Legal Implications of Smart Contracts',
      excerpt: 'Understanding the legal framework surrounding smart contracts and their enforceability.',
      author: 'Robert Taylor',
      date: 'September 25, 2025',
      category: 'Legal',
      image: '/assets/generated/blog-header.dim_800x300.png',
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">Blog & Insights</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Stay updated with the latest news, tips, and insights about digital contract management
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <Card className="overflow-hidden border-primary/50">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="flex flex-col justify-center">
                <Badge className="mb-2 w-fit">{blogPosts[0].category}</Badge>
                <CardTitle className="text-3xl">{blogPosts[0].title}</CardTitle>
                <CardDescription className="text-base">{blogPosts[0].excerpt}</CardDescription>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {blogPosts[0].author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {blogPosts[0].date}
                  </div>
                </div>
                <Button className="mt-4 w-fit gap-2">
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
            </div>
          </Card>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.slice(1).map((post, index) => (
            <Card key={index} className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <Badge className="mb-2 w-fit">{post.category}</Badge>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
