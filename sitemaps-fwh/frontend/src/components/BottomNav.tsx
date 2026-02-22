import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Info, Phone, LayoutDashboard, Globe, CreditCard } from 'lucide-react';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'gods-eye' | 'admin' | 'analytics' | 'exports' | 'monitoring' | 'admin-panel' | 'feature-checklist' | 'diagnostics' | 'catalogs' | 'catalog-builder';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'home' as Page, label: 'Home', icon: Home },
  { id: 'sitemaps' as Page, label: 'Sitemaps', icon: Globe },
  { id: 'subscription' as Page, label: 'Plans', icon: CreditCard },
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'about' as Page, label: 'About', icon: Info },
  { id: 'contact' as Page, label: 'Contact', icon: Phone },
];

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 z-50 bottom-nav-fixed">
      <div className="grid grid-cols-6 gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center h-14 gap-1 ${
                isActive ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs truncate w-full text-center">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
