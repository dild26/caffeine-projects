import { Button } from '@/components/ui/button';
import { Moon, Sun, Database } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link, useRouterState } from '@tanstack/react-router';
import LoginButton from './LoginButton';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">IPFS Content Viewer</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Explore decentralized content</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button variant={currentPath === '/' ? 'secondary' : 'ghost'} size="sm">
                Home
              </Button>
            </Link>
            <Link to="/sitemap">
              <Button variant={currentPath === '/sitemap' ? 'secondary' : 'ghost'} size="sm">
                Sitemap
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant={currentPath === '/admin' ? 'secondary' : 'ghost'} size="sm">
                Admin
              </Button>
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <LoginButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
