import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, Heart } from 'lucide-react';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const navigate = useNavigate();

  const infoPages = [
    { label: 'Features', path: '/features' },
    { label: 'Blog', path: '/blog' },
    { label: 'About Us', path: '/about' },
    { label: 'What We Do', path: '/what-we-do' },
    { label: 'Why Us', path: '/why-us' },
    { label: 'Pros of e-Contracts', path: '/pros-of-e-contracts' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Help', path: '/help' },
    { label: 'Referral Program', path: '/referral' },
    { label: 'Proof of Trust', path: '/proof-of-trust' },
    { label: 'Templates', path: '/templates' },
  ];

  const handleLoginClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate({ to: '/features' })} className="flex items-center gap-2">
              <img src="/assets/generated/secoinfi-logo-transparent.png" alt="SECOINFI" className="h-8 w-8" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SECOINFI
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/features' })}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/about' })}
              >
                About
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/contact' })}
              >
                Contact
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {infoPages.map((page) => (
                  <DropdownMenuItem key={page.path} onClick={() => navigate({ to: page.path })}>
                    {page.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={handleLoginClick} size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </Button>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-2 mt-8">
                  {infoPages.map((page) => (
                    <Button
                      key={page.path}
                      variant="ghost"
                      onClick={() => navigate({ to: page.path })}
                      className="justify-start"
                    >
                      {page.label}
                    </Button>
                  ))}
                  <Button onClick={handleLoginClick} className="justify-start gap-2 mt-4">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container py-6">{children}</main>

      <footer className="border-t bg-muted/30 mt-12">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© 2025. Built with</span>
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              <span>using</span>
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </div>
            <div className="flex gap-4 text-sm">
              <button onClick={() => navigate({ to: '/terms' })} className="text-muted-foreground hover:text-foreground">
                Terms
              </button>
              <button onClick={() => navigate({ to: '/sitemap' })} className="text-muted-foreground hover:text-foreground">
                Sitemap
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
