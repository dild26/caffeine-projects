import { Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useGetAllNavigationItemsSorted } from '../hooks/useQueries';

export default function Footer() {
  const { data: allNavItems } = useGetAllNavigationItemsSorted();

  // Get public navigation items grouped by type
  const publicNavItems = allNavItems?.filter(item => item.isPublic) || [];
  
  const platformPages = publicNavItems.filter(item => 
    ['/', '/dashboard', '/explore', '/resources', '/instructors'].includes(item.url)
  );
  
  const infoPages = publicNavItems.filter(item => 
    ['/about', '/features', '/faq', '/blogs'].includes(item.url)
  );
  
  const resourcePages = publicNavItems.filter(item => 
    ['/info', '/keywords', '/navigation', '/sitemap'].includes(item.url)
  );
  
  const connectPages = publicNavItems.filter(item => 
    ['/contact', '/join-us', '/locations', '/maps'].includes(item.url)
  );

  // Fallback links if backend data is not loaded
  const fallbackPlatform = [
    { url: '/dashboard', navLabel: 'Dashboard' },
    { url: '/explore', navLabel: 'Explore' },
    { url: '/resources', navLabel: 'Resources' },
    { url: '/instructors', navLabel: 'Instructors' },
  ];

  const fallbackInfo = [
    { url: '/about', navLabel: 'About' },
    { url: '/features', navLabel: 'Features' },
    { url: '/faq', navLabel: 'FAQ' },
    { url: '/blogs', navLabel: 'Blog' },
  ];

  const fallbackResources = [
    { url: '/info', navLabel: 'Info' },
    { url: '/keywords', navLabel: 'Keywords' },
    { url: '/navigation', navLabel: 'Navigation' },
    { url: '/sitemap', navLabel: 'Sitemap' },
  ];

  const fallbackConnect = [
    { url: '/contact', navLabel: 'Contact' },
    { url: '/join-us', navLabel: 'Join Us' },
    { url: '/locations', navLabel: 'Locations' },
    { url: '/maps', navLabel: 'Map' },
  ];

  const platform = platformPages.length > 0 ? platformPages : fallbackPlatform;
  const info = infoPages.length > 0 ? infoPages : fallbackInfo;
  const resources = resourcePages.length > 0 ? resourcePages : fallbackResources;
  const connect = connectPages.length > 0 ? connectPages : fallbackConnect;

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {platform.map((item) => (
                <li key={item.url}>
                  <Link to={item.url} className="hover:text-primary transition-colors">
                    {item.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {info.map((item) => (
                <li key={item.url}>
                  <Link to={item.url} className="hover:text-primary transition-colors">
                    {item.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {resources.map((item) => (
                <li key={item.url}>
                  <Link to={item.url} className="hover:text-primary transition-colors">
                    {item.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {connect.map((item) => (
                <li key={item.url}>
                  <Link to={item.url} className="hover:text-primary transition-colors">
                    {item.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            © 2025 E-Tutorial. Built with <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
