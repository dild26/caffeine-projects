import { Link } from '@tanstack/react-router';
import { X, Search, LayoutDashboard, CreditCard, Users, Info, Mail, Eye, Settings, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const isAuthenticated = !!identity;

  const menuItems = [
    { to: '/search', icon: Search, label: 'Search Sitemaps' },
    { to: '/gods-eye', icon: Eye, label: "God's Eye" },
    { to: '/about', icon: Info, label: 'About' },
    { to: '/contact', icon: Mail, label: 'Contact' },
  ];

  const authenticatedItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/subscription', icon: CreditCard, label: 'Subscription' },
    { to: '/referral', icon: Users, label: 'Referral Program' },
  ];

  const adminItems = [
    { to: '/admin', icon: Settings, label: 'Admin Panel' },
    { to: '/feature-checklist', icon: CheckSquare, label: 'Feature Checklist' },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <img src="/assets/generated/sitemap-icon-transparent.dim_64x64.png" alt="Logo" className="h-8 w-8" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SitemapHub</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-2">
          <div className="mb-4">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </h3>
            {menuItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={onClose}>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {isAuthenticated && (
            <div className="mb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                My Account
              </h3>
              {authenticatedItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={onClose}>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {isAdmin && (
            <div className="mb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administration
              </h3>
              {adminItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={onClose}>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
