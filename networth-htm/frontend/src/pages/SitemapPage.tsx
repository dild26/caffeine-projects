import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Sparkles, MessageSquare, Trophy, Gift, BookOpen, Mail, Map, User } from 'lucide-react';

export default function SitemapPage() {
  const pages = [
    {
      icon: Home,
      title: 'Home',
      path: '/',
      description: 'Main landing page with platform overview',
    },
    {
      icon: Sparkles,
      title: 'Features',
      path: '/features',
      description: 'Detailed list of platform features and payment options',
    },
    {
      icon: MessageSquare,
      title: 'Topics',
      path: '/topics',
      description: 'Browse and create topics, vote and react',
    },
    {
      icon: Trophy,
      title: 'Leaderboard',
      path: '/leaderboard',
      description: 'Global rankings of top contributors',
    },
    {
      icon: Gift,
      title: 'Referrals',
      path: '/referrals',
      description: 'Referral program dashboard and earnings',
    },
    {
      icon: BookOpen,
      title: 'Blog',
      path: '/blog',
      description: 'Community blog posts and discussions',
    },
    {
      icon: Mail,
      title: 'Contact',
      path: '/contact',
      description: 'Contact information and social media links',
    },
    {
      icon: Map,
      title: 'Sitemap',
      path: '/sitemap',
      description: 'Complete navigation structure',
    },
    {
      icon: User,
      title: 'Profile',
      path: '/profile',
      description: 'View and edit your profile settings',
    },
  ];

  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Navigate through all pages and features of Your NetWorth platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <page.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>
                  <a href={page.path} className="hover:text-primary transition-colors">
                    {page.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{page.description}</p>
                <a
                  href={page.path}
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  Visit page →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you can't find what you're looking for, feel free to reach out to our support team.
              </p>
              <a href="/contact" className="text-primary hover:underline font-medium">
                Contact Support →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
