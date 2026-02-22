import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '@/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Moon, Sun, Infinity, FileText, Lock, FileCode, Shield, FileInput, Boxes } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

type View = 'projects' | 'features' | 'secure' | 'spec-generation' | 'fixtures' | 'form-templates' | 'node-types';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      toast.success('Logged out successfully');
    } else {
      try {
        await login();
        toast.success('Logged in successfully');
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const capitalizeRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Infinity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">InfiTask</h1>
          </div>

          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === 'projects' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('projects')}
            >
              Projects
            </Button>
            <Button
              variant={currentView === 'features' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('features')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Features
            </Button>
            <Button
              variant={currentView === 'secure' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('secure')}
            >
              <Lock className="h-4 w-4 mr-2" />
              Secure
            </Button>
            {isAdmin && (
              <>
                <Button
                  variant={currentView === 'spec-generation' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('spec-generation')}
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  Spec
                </Button>
                <Button
                  variant={currentView === 'fixtures' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('fixtures')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Fixtures
                </Button>
                <Button
                  variant={currentView === 'form-templates' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('form-templates')}
                >
                  <FileInput className="h-4 w-4 mr-2" />
                  Forms
                </Button>
                <Button
                  variant={currentView === 'node-types' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('node-types')}
                >
                  <Boxes className="h-4 w-4 mr-2" />
                  Nodes
                </Button>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile && (
            <div className="text-sm">
              <span className="font-medium">{userProfile.name}</span>
              <span className="text-muted-foreground ml-2">
                ({capitalizeRole(userProfile.role)})
              </span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </header>
  );
}
