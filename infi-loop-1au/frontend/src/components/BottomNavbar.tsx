import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeToggle from './ThemeToggle';
import SitemapMenu from './SitemapMenu';
import { useNavigate } from '@tanstack/react-router';

export default function BottomNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    try {
      navigate({ to: path });
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left side - Menu Icon */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="main">Main</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <SitemapMenu onNavigate={() => setIsMenuOpen(false)} />
                </TabsContent>
                
                <TabsContent value="main" className="mt-4 space-y-2">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/')}
                    >
                      Home
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/dashboard')}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/gods-eye-net')}
                    >
                      God's Eye Net
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/advanced-gods-eye')}
                    >
                      Advanced God's Eye
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/features')}
                    >
                      Features
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/contact')}
                    >
                      Contact
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/sitemap')}
                    >
                      Sitemap
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="mt-4 space-y-2">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/blog')}
                    >
                      Blog
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/about')}
                    >
                      About
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/pros')}
                    >
                      Pros
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/what')}
                    >
                      What
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/why')}
                    >
                      Why
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/how')}
                    >
                      How
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/faq')}
                    >
                      FAQ
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/terms')}
                    >
                      Terms
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/referral')}
                    >
                      Referral
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate('/trust')}
                    >
                      Trust
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </SheetContent>
        </Sheet>

        {/* Right side - Theme Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-sm text-muted-foreground hidden sm:inline">Theme</span>
        </div>
      </div>
    </nav>
  );
}
