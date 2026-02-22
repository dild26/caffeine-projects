import React from 'react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Search, Home, LayoutDashboard, Globe } from 'lucide-react';

type Page = 'home' | 'search' | 'dashboard';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isActive = (page: Page) => currentPage === page;

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SitemapAI
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive('home') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => onNavigate('search')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive('search') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  isActive('dashboard') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? "outline" : "default"}
            className={isAuthenticated ? "" : "neon-glow"}
          >
            {text}
          </Button>
        </div>
      </div>
    </header>
  );
}
