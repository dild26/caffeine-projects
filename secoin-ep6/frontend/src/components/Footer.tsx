import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useQueries';
import {
  Home,
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Info,
  TrendingUp,
  Briefcase,
  Award,
  Mail,
  HelpCircle,
  FileText,
  Share2,
  Shield,
  Map,
} from 'lucide-react';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, adminOnly: true },
  { label: 'Features', path: '/features', icon: CheckSquare, adminOnly: true },
  { label: 'Blog', path: '/blog', icon: BookOpen },
  { label: 'About', path: '/about', icon: Info },
  { label: 'Pros', path: '/pros', icon: TrendingUp },
  { label: 'What We Do', path: '/what-we-do', icon: Briefcase },
  { label: 'Why Us', path: '/why-us', icon: Award },
  { label: 'Contact', path: '/contact', icon: Mail },
  { label: 'FAQ', path: '/faq', icon: HelpCircle },
  { label: 'Terms', path: '/terms', icon: FileText },
  { label: 'Referral', path: '/referral', icon: Share2 },
  { label: 'Trust', path: '/proof-of-trust', icon: Shield },
  { label: 'Sitemap', path: '/sitemap', icon: Map },
];

export default function Footer() {
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();

  const filteredItems = menuItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
      <div className="container px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Horizontal Menu Bar */}
          <div className="w-full overflow-x-auto">
            <div className="flex flex-wrap justify-center gap-2 min-w-max px-4">
              {filteredItems.map((item) => (
                <Button
                  key={item.path}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all shadow-sm"
                  onClick={() => handleNavigate(item.path)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              © 2025. Built with{' '}
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />{' '}
              using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
