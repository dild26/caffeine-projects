import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider, useInternetIdentity } from './hooks/useInternetIdentity';
import { useEffect, useState } from 'react';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ContactUsPage from './components/ContactUsPage';
import ContentPage from './components/ContentPage';
import LeaderboardPage from './components/LeaderboardPage';
import SitemapPage from './components/SitemapPage';
import ProsPage from './components/ProsPage';
import SitemapManagementPage from './components/SitemapManagementPage';
import PaymentPage from './pages/PaymentPage';
import PageManagementDashboard from './pages/PageManagementDashboard';
import AngelVCPage from './components/AngelVCPage';
import MainControlPage from './pages/MainControlPage';
import ComparePage from './pages/ComparePage';
import SecoinfiAppsPage from './pages/SecoinfiAppsPage';
import SecureRoutesPage from './pages/SecureRoutesPage';
import P2PSecurePage from './pages/P2PSecurePage';
import RankPage from './pages/RankPage';
import LivePage from './pages/LivePage';
import Header from './components/Header';
import ProfileSetupModal from './components/ProfileSetupModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Auth guard component that redirects to /moap if authenticated
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, loginStatus, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // If user is authenticated and on login page, redirect to dashboard
    if (identity && !isInitializing && !hasRedirected && window.location.pathname === '/') {
      setHasRedirected(true);
      navigate({ to: '/moap' });
    }
  }, [identity, isInitializing, navigate, hasRedirected]);

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, don't show login page
  if (identity && window.location.pathname === '/') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

// App shell with header and profile setup for authenticated routes
function AppShell() {
  const { identity, loginStatus, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [hasShownError, setHasShownError] = useState(false);

  const isAuthenticated = !!identity;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isInitializing && !isAuthenticated && window.location.pathname !== '/') {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  // Handle login errors
  useEffect(() => {
    if (loginStatus === 'loginError' && !hasShownError) {
      setHasShownError(true);
      toast.error('Sign-in failed, please retry', {
        description: 'There was an error during authentication. Please try again.',
        action: {
          label: 'Retry',
          onClick: () => window.location.reload(),
        },
      });
    }
  }, [loginStatus, hasShownError]);

  // Auto-redirect if session is valid but still on login page
  useEffect(() => {
    if (isAuthenticated && !isInitializing && window.location.pathname === '/') {
      navigate({ to: '/moap' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  // Show profile setup modal if authenticated but no profile
  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Show app shell with header for authenticated users
  return (
    <>
      <Header />
      <Outlet />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <AuthGuard>
      <LoginPage />
    </AuthGuard>
  ),
});

const moapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/moap',
  component: () => <Dashboard onNavigate={() => { }} />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <Dashboard onNavigate={() => { }} />,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactUsPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => <ContentPage page="blog" />,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => <ContentPage page="about" />,
});

const prosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pros',
  component: () => <ProsPage project="MOAP" />,
});

const whatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/what',
  component: () => <ContentPage page="what" />,
});

const whyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/why',
  component: () => <ContentPage page="why" />,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: () => <ContentPage page="faq" />,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: () => <ContentPage page="terms" />,
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: () => <ContentPage page="referral" />,
});

const trustRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trust',
  component: () => <ContentPage page="trust" />,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: () => <SitemapPage onNavigate={() => { }} />,
});

const sitemapManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap-management',
  component: SitemapManagementPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment',
  component: () => <PaymentPage appId="all" />,
});

const pageManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/page-management',
  component: PageManagementDashboard,
});

const angelVCRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/angel-vc',
  component: AngelVCPage,
});

const mainControlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/main-control',
  component: () => <MainControlPage isAdmin={true} />,
});

const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compare',
  component: ComparePage,
});

const secoinfiAppsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/secoinfi-apps',
  component: SecoinfiAppsPage,
});

const secureRoutesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/secure-routes',
  component: SecureRoutesPage,
});

const p2pSecureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/secure',
  component: P2PSecurePage,
});

const rankRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rank',
  component: RankPage,
});

const liveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/live',
  component: LivePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  moapRoute,
  dashboardRoute,
  contactRoute,
  blogRoute,
  aboutRoute,
  prosRoute,
  whatRoute,
  whyRoute,
  faqRoute,
  termsRoute,
  referralRoute,
  trustRoute,
  leaderboardRoute,
  sitemapRoute,
  sitemapManagementRoute,
  paymentRoute,
  pageManagementRoute,
  angelVCRoute,
  mainControlRoute,
  compareRoute,
  secoinfiAppsRoute,
  secureRoutesRoute,
  p2pSecureRoute,
  rankRoute,
  liveRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}

export default App;
