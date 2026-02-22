import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { SiX, SiFacebook, SiLinkedin } from 'react-icons/si';
import ThemeToggle from './ThemeToggle';
import ProfileSetupModal from './ProfileSetupModal';
import ApprovalPendingScreen from './ApprovalPendingScreen';
import TermsModal from './TermsModal';
import { useGetCallerUserProfile, useGetCurrentTermsVersion, useHasUserAcceptedTerms } from '../hooks/useQueries';

export default function Layout() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: currentTerms, isLoading: termsLoading } = useGetCurrentTermsVersion();
  const { data: hasAcceptedTerms, isLoading: acceptanceLoading } = useHasUserAcceptedTerms();

  const RESTRICTED_ROUTES = [
    '/admin',
    '/main-form',
    '/subscriptions',
    '/leaderboard',
    '/dashboard',
    '/transactions',
  ];

  const isRestrictedRoute = RESTRICTED_ROUTES.includes(currentPath);
  const isAuthenticated = !!identity;

  // Only show modals for authenticated users on restricted routes
  const showProfileSetup = isAuthenticated && isRestrictedRoute && !profileLoading && isFetched && userProfile === null;
  const showTermsModal = isAuthenticated && isRestrictedRoute && !termsLoading && !acceptanceLoading && currentTerms && !hasAcceptedTerms;


  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  // Define navigation links with auth requirements
  const navLinks = [
    { path: '/', label: 'Home', public: true },
    { path: '/calc', label: 'Calculator', public: true },
    { path: '/features', label: 'Features', public: true },
    { path: '/about', label: 'About', public: true },
    { path: '/blogs', label: 'Blogs', public: true },
    { path: '/faq', label: 'FAQ', public: true },
    { path: '/contact', label: 'Contact', public: true },
    { path: '/terms', label: 'Terms', public: true },
    { path: '/sitemap', label: 'Sitemap', public: true },
    { path: '/dashboard', label: 'Dashboard', public: false },
    { path: '/leaderboard', label: 'Leaderboard', public: false },
    { path: '/transactions', label: 'Transactions', public: false },
    { path: '/subscriptions', label: 'Subscriptions', public: false },
    { path: '/admin', label: 'Admin', public: false },
    { path: '/main-form', label: 'Config', public: false },
  ];

  // Show all public links, and restricted links only when authenticated
  const visibleLinks = navLinks.filter(link => link.public || isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img src="/assets/generated/secoinfi-logo-transparent.dim_200x200.png" alt="Secoinfi ePay" className="h-10 w-10" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Secoinfi ePay
              </span>
            </button>

            <nav className="hidden md:flex items-center space-x-1">
              {visibleLinks.slice(0, 9).map((link) => (
                <Button
                  key={link.path}
                  variant={currentPath === link.path ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate({ to: link.path })}
                >
                  {link.label}
                </Button>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                variant={isAuthenticated ? 'outline' : 'default'}
                size="sm"
                className="hidden md:flex"
              >
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-border/40">
              {visibleLinks.map((link) => (
                <Button
                  key={link.path}
                  variant={currentPath === link.path ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    navigate({ to: link.path });
                    setMobileMenuOpen(false);
                  }}
                >
                  {link.label}
                </Button>
              ))}
              <div className="flex items-center space-x-2 pt-2">
                <ThemeToggle />
                <Button
                  onClick={handleAuth}
                  disabled={isLoggingIn}
                  variant={isAuthenticated ? 'outline' : 'default'}
                  className="flex-1"
                >
                  {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Secoinfi ePay</h3>
              <p className="text-sm text-muted-foreground">
                Decentralized financial platform with blockchain-inspired security and transparency.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate({ to: '/about' })} className="text-muted-foreground hover:text-foreground transition-colors">About</button></li>
                <li><button onClick={() => navigate({ to: '/faq' })} className="text-muted-foreground hover:text-foreground transition-colors">FAQ</button></li>
                <li><button onClick={() => navigate({ to: '/contact' })} className="text-muted-foreground hover:text-foreground transition-colors">Contact</button></li>
                <li><button onClick={() => navigate({ to: '/terms' })} className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button></li>
                <li><button onClick={() => navigate({ to: '/sitemap' })} className="text-muted-foreground hover:text-foreground transition-colors">Sitemap</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate({ to: '/calc' })} className="text-muted-foreground hover:text-foreground transition-colors">Calculator</button></li>
                <li><button onClick={() => navigate({ to: '/features' })} className="text-muted-foreground hover:text-foreground transition-colors">Features</button></li>
                {isAuthenticated && (
                  <>
                    <li><button onClick={() => navigate({ to: '/leaderboard' })} className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</button></li>
                    <li><button onClick={() => navigate({ to: '/dashboard' })} className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</button></li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-3">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiX className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiLinkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground mb-2">
              By using this service, you agree to our <button onClick={() => navigate({ to: '/terms' })} className="text-primary hover:underline">Terms of Service</button>.
              All transactions are recorded on the blockchain for transparency and security.
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a>
            </p>
          </div>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupModal />}
      {isRestrictedRoute && <ApprovalPendingScreen />}
      {showTermsModal && currentTerms && <TermsModal terms={currentTerms} />}
    </div>
  );
}
