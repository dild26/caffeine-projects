import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Video, MessageCircle, FileText, Search, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn the basics of using the platform',
      articles: 5,
    },
    {
      icon: FileText,
      title: 'Contract Management',
      description: 'How to create and manage contracts',
      articles: 8,
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      articles: 12,
    },
    {
      icon: MessageCircle,
      title: 'FAQs',
      description: 'Frequently asked questions',
      articles: 20,
    },
  ];

  const popularArticles = [
    'How to create your first e-contract',
    'Understanding blockchain verification',
    'Setting up payment gateways',
    'Managing file uploads and templates',
    'Using the analytics dashboard',
    'Configuring security settings',
  ];

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Help Center</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Find answers, tutorials, and support for all your questions
        </p>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {helpCategories.map((category) => (
          <Card
            key={category.title}
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          >
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <category.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{category.articles} articles</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
              <CardDescription>Most viewed help articles</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {popularArticles.map((article, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="text-sm">{article}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Live Chat
              </Button>
              <Button className="w-full" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Submit a Ticket
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <a href="/contact-us">
                  Contact Support
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="/faq" className="block text-sm text-primary hover:underline">
                View All FAQs →
              </a>
              <a href="/about-us" className="block text-sm text-primary hover:underline">
                About Us →
              </a>
              <a href="/terms-and-conditions" className="block text-sm text-primary hover:underline">
                Terms & Conditions →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
