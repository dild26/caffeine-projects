import { Heart } from 'lucide-react';
import { SiFacebook, SiLinkedin, SiInstagram, SiX, SiYoutube } from 'react-icons/si';
import SitemapMenu from './SitemapMenu';
import { Button } from '@/components/ui/button';
import { useGetAllPages, useGetBusinessInfo } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';

export default function Footer() {
  const { data: allPages = [] } = useGetAllPages();
  const { data: businessInfo } = useGetBusinessInfo();
  const navigate = useNavigate();

  // Get unique public pages only (no duplicates)
  const quickLinks = useMemo(() => {
    const seen = new Set<string>();
    return allPages.filter(page => {
      if (page.isAdminOnly || seen.has(page.path)) {
        return false;
      }
      seen.add(page.path);
      return true;
    });
  }, [allPages]);

  const socialLinks = businessInfo ? [
    { icon: SiFacebook, href: businessInfo.facebook, label: 'Facebook' },
    { icon: SiLinkedin, href: businessInfo.linkedin, label: 'LinkedIn' },
    { icon: SiInstagram, href: businessInfo.instagram, label: 'Instagram' },
    { icon: SiX, href: businessInfo.x, label: 'X (Twitter)' },
    { icon: SiYoutube, href: businessInfo.youtube, label: 'YouTube' },
  ] : [];

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">{businessInfo?.companyName || 'E-Contracts System'}</h3>
            <p className="text-sm text-muted-foreground">
              Advanced contract management with blockchain integration, file processing, and real-time analytics.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate({ to: link.path })}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-full h-9 w-9"
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <link.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <SitemapMenu position="bottom-left" />
          
          <p className="text-sm text-muted-foreground">
            © 2025. Built with{' '}
            <Heart className="inline h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          
          <div className="w-10" />
        </div>
      </div>
    </footer>
  );
}
