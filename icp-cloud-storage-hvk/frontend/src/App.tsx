import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, useLocation } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import ProfileSetupModal from './components/ProfileSetupModal';

// Lazy load all pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const ProsPage = lazy(() => import('./pages/ProsPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Public pages that don't require authentication - permanently accessible
const PUBLIC_ROUTES = ['/about', '/faq', '/contact', '/compare', '/pros', '/terms', '/sitemap', '/features'];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const location = useLocation();

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname === route);

  if (isInitializing && !isPublicRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Require authentication for protected routes
  if (!identity) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

// Create router outside component to avoid recreation
const rootRoute = createRootRoute({
  component: () => (
    <AuthGuard>
      <Layout />
    </AuthGuard>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Dashboard />
    </Suspense>
  ),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ContactPage />
    </Suspense>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AboutPage />
    </Suspense>
  ),
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <FeaturesPage />
    </Suspense>
  ),
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <FAQPage />
    </Suspense>
  ),
});

const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compare',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ComparePage />
    </Suspense>
  ),
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SitemapPage />
    </Suspense>
  ),
});

const prosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pros',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProsPage />
    </Suspense>
  ),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <TermsPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  contactRoute,
  aboutRoute,
  featuresRoute,
  faqRoute,
  compareRoute,
  sitemapRoute,
  prosRoute,
  termsRoute,
]);

const router = createRouter({ routeTree });

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [profileSetupDismissed, setProfileSetupDismissed] = useState(false);

  const isAuthenticated = !!identity;

  // Memoize the profile setup visibility to prevent flickering
  const showProfileSetup = useMemo(() => {
    if (!isAuthenticated) return false;
    if (profileLoading || !isFetched) return false;
    if (profileSetupDismissed) return false;
    return userProfile === null;
  }, [isAuthenticated, profileLoading, isFetched, userProfile, profileSetupDismissed]);

  // Reset dismissed state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setProfileSetupDismissed(false);
    }
  }, [isAuthenticated]);

  const handleProfileSetupClose = () => {
    setProfileSetupDismissed(true);
  };

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal onClose={handleProfileSetupClose} />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContent />
      <Toaster />
    </ThemeProvider>
  );
}
