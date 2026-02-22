import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Search, LayoutDashboard, BarChart3, Users } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function BottomNavigation() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { path: '/', icon: Home, label: 'Home', auth: false },
    { path: '/search', icon: Search, label: 'Search', auth: false },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', auth: true },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', auth: true },
    { path: '/referral', icon: Users, label: 'Referral', auth: true },
  ];

  const visibleItems = navItems.filter(item => !item.auth || isAuthenticated);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex justify-around items-center h-16">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
