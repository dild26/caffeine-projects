import { useNavigate } from '@tanstack/react-router';
import { useGetContactInfo } from '../hooks/useQueries';
import { Heart, Facebook, Instagram, Linkedin, Twitter, Youtube, MessageCircle, Globe } from 'lucide-react';

export default function PublicFooter() {
  const navigate = useNavigate();
  const { data: contactInfo } = useGetContactInfo();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', path: '/features' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Pros of e-Contracts', path: '/pros-of-e-contracts' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about-us' },
        { label: 'What We Do', path: '/what-we-do' },
        { label: 'Why Us', path: '/why-us' },
        { label: 'Blog', path: '/blog' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', path: '/contact-us' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Proof of Trust', path: '/proof-of-trust' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms & Conditions', path: '/terms-conditions' },
        { label: 'Referral Program', path: '/referral' },
        { label: 'Sitemap', path: '/sitemap' },
      ],
    },
  ];

  const socialMediaLinks = contactInfo ? [
    { icon: Facebook, label: 'Facebook', url: contactInfo.socialMedia.facebook },
    { icon: Linkedin, label: 'LinkedIn', url: contactInfo.socialMedia.linkedin },
    { icon: MessageCircle, label: 'Telegram', url: contactInfo.socialMedia.telegram },
    { icon: MessageCircle, label: 'Discord', url: contactInfo.socialMedia.discord },
    { icon: Globe, label: 'Blogspot', url: contactInfo.socialMedia.blogspot },
    { icon: Instagram, label: 'Instagram', url: contactInfo.socialMedia.instagram },
    { icon: Twitter, label: 'X/Twitter', url: contactInfo.socialMedia.twitter },
    { icon: Youtube, label: 'YouTube', url: contactInfo.socialMedia.youtube },
  ] : [];

  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/assets/generated/contract-icon-transparent.dim_128x128.png" 
                alt="E-Contracts" 
                className="h-10 w-10"
              />
              <h3 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent">
                E-Contracts
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Decentralized contract management with AI-powered voice assistance.
            </p>
            {contactInfo && (
              <div className="flex flex-wrap gap-2">
                {socialMediaLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-border bg-background p-2 transition-all hover:border-primary hover:shadow-md"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate({ to: link.path })}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              © 2025 {contactInfo?.companyName || 'E-Contracts'}. Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
              <a 
                href="https://caffeine.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            {contactInfo && (
              <p className="text-sm text-muted-foreground">
                CEO: {contactInfo.ceoName}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
