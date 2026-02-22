import { Shield, Lock, Home, LayoutDashboard, Eye, Zap, Video, Network, Grid3x3 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SitemapItem {
  path: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  restricted?: boolean;
  subscription?: boolean;
  category: string;
}

const sitemapItems: SitemapItem[] = [
  {
    path: '/',
    label: 'Home',
    description: 'Main dashboard and overview of the InfiLoop platform',
    icon: <Home className="h-5 w-5" />,
    category: 'Core',
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    description: 'URL Generator, Multi-Dimensional Range, Grid Generator, and management tools',
    icon: <LayoutDashboard className="h-5 w-5" />,
    category: 'Core',
  },
  {
    path: '/gods-eye-net',
    label: "God's Eye Net",
    description: 'Secure access portal with subscription-based access',
    icon: <Eye className="h-5 w-5" />,
    subscription: true,
    category: 'Advanced',
  },
  {
    path: '/advanced-gods-eye',
    label: 'Advanced Gods Eye',
    description: 'Enhanced secure algorithms with multilayered protection',
    icon: <Zap className="h-5 w-5" />,
    subscription: true,
    category: 'Advanced',
  },
  {
    path: '/IPCams-IPv4',
    label: 'IPCams IPv4',
    description: 'IPv4-based IP camera live streaming with multi-protocol support',
    icon: <Video className="h-5 w-5" />,
    category: 'Advanced → IPNet',
  },
  {
    path: '/IPNet/discovery-ui',
    label: 'IPNet Discovery',
    description: 'SSDP and RTSP camera scanning and registration interface',
    icon: <Network className="h-5 w-5" />,
    category: 'Advanced → IPNet',
  },
  {
    path: '/IPNet/ipcams',
    label: 'IPNet Camera Grid',
    description: 'IPv4 IPCams Grid with multi-view layout, player panel, and live streaming controls',
    icon: <Grid3x3 className="h-5 w-5" />,
    category: 'Advanced → IPNet',
  },
  {
    path: '/features',
    label: 'Features',
    description: 'System features checklist and deployment status (Admin only)',
    icon: <Lock className="h-5 w-5" />,
    restricted: true,
    category: 'Admin',
  },
  {
    path: '/sitemap',
    label: 'Sitemap',
    description: 'Complete site navigation and page directory',
    icon: <Shield className="h-5 w-5" />,
    category: 'Information',
  },
  {
    path: '/contact',
    label: 'Contact',
    description: 'Contact information and support details',
    icon: <Shield className="h-5 w-5" />,
    category: 'Information',
  },
  {
    path: '/blog',
    label: 'Blog',
    description: 'Latest updates, articles, and platform news',
    icon: <Shield className="h-5 w-5" />,
    category: 'Content',
  },
  {
    path: '/about',
    label: 'About',
    description: 'About InfiLoop and our mission',
    icon: <Shield className="h-5 w-5" />,
    category: 'Content',
  },
  {
    path: '/pros',
    label: 'Pros',
    description: 'Platform advantages and benefits',
    icon: <Shield className="h-5 w-5" />,
    category: 'Content',
  },
  {
    path: '/what',
    label: 'What',
    description: 'What is InfiLoop and how it works',
    icon: <Shield className="h-5 w-5" />,
    category: 'Content',
  },
  {
    path: '/why',
    label: 'Why',
    description: 'Why choose InfiLoop for your needs',
    icon: <Shield className="h-5 w-5" />,
    category: 'Content',
  },
  {
    path: '/how',
    label: 'How',
    description: 'How to use InfiLoop effectively',
    icon: <Shield className="h-5 w-5" />,
    category: 'Content',
  },
  {
    path: '/faq',
    label: 'FAQ',
    description: 'Frequently asked questions and answers',
    icon: <Shield className="h-5 w-5" />,
    category: 'Support',
  },
  {
    path: '/terms',
    label: 'Terms',
    description: 'Terms of service and usage policies',
    icon: <Shield className="h-5 w-5" />,
    category: 'Legal',
  },
  {
    path: '/referral',
    label: 'Referral',
    description: 'Referral program and rewards',
    icon: <Shield className="h-5 w-5" />,
    category: 'Support',
  },
  {
    path: '/trust',
    label: 'Trust',
    description: 'Trust, security, and privacy information',
    icon: <Shield className="h-5 w-5" />,
    category: 'Legal',
  },
];

const categories = ['Core', 'Advanced', 'Advanced → IPNet', 'Admin', 'Information', 'Content', 'Support', 'Legal'];

export default function SitemapPage() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    try {
      navigate({ to: path });
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };

  const itemsByCategory = categories.map((category) => ({
    category,
    items: sitemapItems.filter((item) => item.category === category),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Sitemap</h1>
        <p className="text-lg text-muted-foreground">
          Complete navigation directory for all pages and features
        </p>
      </div>

      <div className="space-y-8">
        {itemsByCategory.map(
          ({ category, items }) =>
            items.length > 0 && (
              <div key={category}>
                <h2 className="mb-4 text-2xl font-semibold">{category}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <Card key={item.path} className="transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <CardTitle className="text-lg">{item.label}</CardTitle>
                          </div>
                          <div className="flex gap-1">
                            {item.restricted && (
                              <Badge variant="outline" className="gap-1">
                                <Lock className="h-3 w-3" />
                                Admin
                              </Badge>
                            )}
                            {item.subscription && (
                              <Badge variant="secondary" className="gap-1">
                                <Shield className="h-3 w-3" />
                                Subscription
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => handleNavigate(item.path)}
                          variant="outline"
                          className="w-full"
                        >
                          Visit Page
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
