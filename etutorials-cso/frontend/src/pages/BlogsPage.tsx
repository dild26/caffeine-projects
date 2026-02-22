import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function BlogsPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with E-Tutorial Platform',
      excerpt: 'Learn how to make the most of our educational resource management system with this comprehensive guide.',
      author: 'Admin Team',
      date: '2024-01-15',
      category: 'Tutorial',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'New Features: AI-Powered Page Generation',
      excerpt: 'Discover how our new AI page generator can automatically create and populate common pages for your platform.',
      author: 'Development Team',
      date: '2024-01-10',
      category: 'Features',
      readTime: '3 min read',
    },
    {
      id: 3,
      title: 'Best Practices for Resource Management',
      excerpt: 'Tips and tricks for organizing educational resources, managing instructors, and optimizing your workflow.',
      author: 'Education Team',
      date: '2024-01-05',
      category: 'Best Practices',
      readTime: '7 min read',
    },
    {
      id: 4,
      title: 'Understanding the Hashtag Search System',
      excerpt: 'A deep dive into how hashtag-based search works and how to leverage it for better resource discovery.',
      author: 'Technical Team',
      date: '2023-12-28',
      category: 'Technical',
      readTime: '4 min read',
    },
    {
      id: 5,
      title: 'Appointment Booking Made Easy',
      excerpt: 'Step-by-step guide to booking appointments with instructors and managing your learning schedule.',
      author: 'Support Team',
      date: '2023-12-20',
      category: 'Tutorial',
      readTime: '6 min read',
    },
    {
      id: 6,
      title: 'Platform Updates and Roadmap',
      excerpt: 'Stay informed about recent updates, upcoming features, and our vision for the future of E-Tutorial.',
      author: 'Product Team',
      date: '2023-12-15',
      category: 'Updates',
      readTime: '5 min read',
    },
  ];

  const categories = ['All', 'Tutorial', 'Features', 'Best Practices', 'Technical', 'Updates'];

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">Blog & Updates</h1>
        <p className="text-xl text-muted-foreground">
          Latest news, tutorials, and insights from the E-Tutorial platform.
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-between group">
                Read More
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter Signup */}
      <Card className="max-w-4xl mx-auto bg-primary/5">
        <CardContent className="pt-6 text-center space-y-4">
          <h3 className="text-2xl font-bold">Stay Updated</h3>
          <p className="text-muted-foreground">
            Subscribe to our newsletter to receive the latest updates, tutorials, and educational insights.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <Button>Subscribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
