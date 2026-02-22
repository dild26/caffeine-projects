import { useMemo } from 'react';
import { DEFAULT_APPS } from '../data/defaultApps';

export interface MenuItem {
  id: number;
  name: string;
  url: string;
  category: string;
  icon?: string;
  isInternal: boolean;
  isExternal?: boolean;
}

export function useMenuItems(): MenuItem[] {
  const menuItems = useMemo<MenuItem[]>(() => {
    const moapItems: MenuItem[] = [
      { id: 1, name: 'Home', url: '/', category: 'MOAP App', icon: 'Home', isInternal: true },
      { id: 2, name: 'Dashboard', url: '/dashboard', category: 'MOAP App', icon: 'LayoutDashboard', isInternal: true },
      { id: 3, name: 'Contact', url: '/contact', category: 'MOAP App', icon: 'Mail', isInternal: true },
      { id: 4, name: 'Blog', url: '/blog', category: 'MOAP App', icon: 'BookOpen', isInternal: true },
      { id: 5, name: 'About Us', url: '/about', category: 'MOAP App', icon: 'Info', isInternal: true },
      { id: 6, name: 'Pros', url: '/pros', category: 'MOAP App', icon: 'ThumbsUp', isInternal: true },
      { id: 7, name: 'What We Do', url: '/what', category: 'MOAP App', icon: 'Briefcase', isInternal: true },
      { id: 8, name: 'Why Us', url: '/why', category: 'MOAP App', icon: 'Star', isInternal: true },
      { id: 9, name: 'FAQ', url: '/faq', category: 'MOAP App', icon: 'HelpCircle', isInternal: true },
      { id: 10, name: 'Terms', url: '/terms', category: 'MOAP App', icon: 'FileText', isInternal: true },
      { id: 11, name: 'Referral', url: '/referral', category: 'MOAP App', icon: 'Users', isInternal: true },
      { id: 12, name: 'Trust', url: '/trust', category: 'MOAP App', icon: 'Shield', isInternal: true },
      { id: 13, name: 'Leaderboard', url: '/leaderboard', category: 'MOAP App', icon: 'Trophy', isInternal: true },
      { id: 14, name: 'Sitemap', url: '/sitemap', category: 'MOAP App', icon: 'Map', isInternal: true },
      { id: 15, name: 'Payment', url: '/payment', category: 'MOAP App', icon: 'CreditCard', isInternal: true },
      { id: 16, name: 'Angel/VC', url: '/angel-vc', category: 'MOAP App', icon: 'TrendingUp', isInternal: true },
      { id: 17, name: 'Main Control', url: '/main-control', category: 'MOAP App', icon: 'Settings', isInternal: true },
      { id: 18, name: 'Compare', url: '/compare', category: 'MOAP App', icon: 'GitCompare', isInternal: true },
      { id: 21, name: 'SECOINFI Apps', url: '/secoinfi-apps', category: 'MOAP App', icon: 'Grid', isInternal: true },
      { id: 22, name: 'Secure Routes', url: '/secure-routes', category: 'MOAP App', icon: 'Lock', isInternal: true },
      { id: 23, name: 'P2P Secure', url: '/secure', category: 'MOAP App', icon: 'Share2', isInternal: true },
    ];

    const secoinfiApps: MenuItem[] = DEFAULT_APPS.map((app, index) => ({
      id: 1000 + index,
      name: app.name,
      url: app.url,
      category: 'SECOINFI Apps',
      icon: 'ExternalLink',
      isInternal: false,
      isExternal: true,
    }));

    return [...moapItems, ...secoinfiApps];
  }, []);

  return menuItems;
}
