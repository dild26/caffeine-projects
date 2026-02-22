import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      title: 'Introducing E-Tutorial Platform',
      date: '2025-01-15',
      author: 'Admin Team',
      category: 'Announcement',
      excerpt: 'We are excited to launch the E-Tutorial platform, a comprehensive educational resource management system designed to streamline learning and teaching workflows.',
    },
    {
      title: 'How to Upload CSV Data Efficiently',
      date: '2025-01-20',
      author: 'Tech Team',
      category: 'Tutorial',
      excerpt: 'Learn the best practices for uploading and managing CSV data for resources, instructors, and learners on the E-Tutorial platform.',
    },
    {
      title: 'Understanding Hashtag Search',
      date: '2025-01-25',
      author: 'Product Team',
      category: 'Feature',
      excerpt: 'Discover how our powerful hashtag search functionality helps you find the perfect resources and instructors for your learning needs.',
    },
    {
      title: 'Appointment Booking Made Simple',
      date: '2025-02-01',
      author: 'User Success',
      category: 'Guide',
      excerpt: 'A step-by-step guide to booking appointments with instructors and managing your learning schedule effectively.',
    },
    {
      title: 'Admin Features Overview',
      date: '2025-02-05',
      author: 'Admin Team',
      category: 'Feature',
      excerpt: 'Explore the powerful admin features including resource verification, CSV uploads, and system management capabilities.',
    },
    {
      title: 'Progress Tracking and Analytics',
      date: '2025-02-10',
      author: 'Data Team',
      category: 'Feature',
      excerpt: 'Learn how to track learner progress by topic, pace, language, and difficulty level with our comprehensive analytics tools.',
    },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">Blog & News</h1>
        <p className="text-xl text-muted-foreground">
          Stay updated with the latest news, features, and tutorials from E-Tutorial.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {posts.map((post, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary">{post.category}</Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <CardDescription className="text-base">{post.excerpt}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
