import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { ErrorBoundary } from './components/ErrorBoundary';
import { lazy, Suspense, useEffect, memo } from 'react';
import LoginPrompt from './components/LoginPrompt';
import ProfileSetupModal from './components/ProfileSetupModal';
import PropertyGrid from './components/PropertyGrid';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Footer from './components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { validateRuntimeIntegrity } from './lib/bundleOptimization';
import { useIsCallerAdmin } from './hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldOff } from 'lucide-react';

// Lazy load heavy admin components with better error handling
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').catch(() => ({
  default: () => <div className="p-8 text-center">Failed to load Admin Dashboard</div>
})));

const FeatureCompare = lazy(() => import('./pages/FeatureCompare').catch(() => ({
  default: () => <div className="p-8 text-center">Failed to load Features</div>
})));

const SystemHealthDashboard = lazy(() => import('./pages/SystemHealthDashboard').catch(() => ({
  default: () => <div className="p-8 text-center">Failed to load System Health</div>
})));

const BundleOptimization = lazy(() => import('./pages/BundleOptimization').catch(() => ({
  default: () => <div className="p-8 text-center">Failed to load Bundle Optimization</div>
})));

const MenuAnalysis = lazy(() => import('./pages/MenuAnalysis').catch(() => ({
  default: () => <div className="p-8 text-center">Failed to load Menu Analysis</div>
})));

const NodeManagement = lazy(() => import('./pages/NodeManagement').catch(() => ({
  default: () => <div className="p-8 text-center">Failed to load Node Management</div>
})));

// Regular imports for public pages
import AboutUs from './pages/AboutUs';
import ProsOfSECoin from './pages/ProsOfSECoin';
import WhatWeDo from './pages/WhatWeDo';
import WhyUs from './pages/WhyUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import TermsAndConditions from './pages/TermsAndConditions';
import Referral from './pages/Referral';
import ProofOfTrust from './pages/ProofOfTrust';
import Sitemap from './pages/Sitemap';
import Gallery from './pages/Gallery';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Leaderboard from './pages/Leaderboard';
import PropertyDetail from './pages/PropertyDetail';
import LiveStatus from './pages/LiveStatus';
import SpecificationStatus from './pages/SpecificationStatus';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Enhanced loading fallback with progressive rendering
const PageLoadingFallback = memo(() => (
  <div className="container px-4 py-8 animate-in fade-in duration-300">
    <div className="mb-8 flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
    </div>
    <Skeleton className="h-96" />
  </div>
));
PageLoadingFallback.displayName = 'PageLoadingFallback';

// Admin route guard component
function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { data: isAdmin, isLoading, error } = useIsCallerAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin && !error) {
      // Redirect to home if not admin
      navigate({ to: '/' });
    }
  }, [isAdmin, isLoading, error, navigate]);

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  if (error) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <ShieldOff className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            Failed to verify admin access. Please try logging in again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <ShieldOff className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page. Redirecting to home...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

// Root layout component
function RootLayout() {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ErrorBoundary>
      <LoginPrompt />
      <ProfileSetupModal />
      <PropertyGrid />
      <AdminPanel />
    </ErrorBoundary>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => <ErrorBoundary><AboutUs /></ErrorBoundary>,
});

const prosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pros',
  component: () => <ErrorBoundary><ProsOfSECoin /></ErrorBoundary>,
});

const whatWeDoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/what-we-do',
  component: () => <ErrorBoundary><WhatWeDo /></ErrorBoundary>,
});

const whyUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/why-us',
  component: () => <ErrorBoundary><WhyUs /></ErrorBoundary>,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: () => <ErrorBoundary><ContactUs /></ErrorBoundary>,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: () => <ErrorBoundary><FAQ /></ErrorBoundary>,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: () => <ErrorBoundary><TermsAndConditions /></ErrorBoundary>,
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: () => <ErrorBoundary><Referral /></ErrorBoundary>,
});

const proofOfTrustRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proof-of-trust',
  component: () => <ErrorBoundary><ProofOfTrust /></ErrorBoundary>,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: () => <ErrorBoundary><Sitemap /></ErrorBoundary>,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: () => <ErrorBoundary><Gallery /></ErrorBoundary>,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => <ErrorBoundary><BlogList /></ErrorBoundary>,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$postId',
  component: () => <ErrorBoundary><BlogPost /></ErrorBoundary>,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ErrorBoundary>
      <AdminRouteGuard>
        <Suspense fallback={<PageLoadingFallback />}>
          <AdminDashboard />
        </Suspense>
      </AdminRouteGuard>
    </ErrorBoundary>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ErrorBoundary>
      <AdminRouteGuard>
        <Suspense fallback={<PageLoadingFallback />}>
          <AdminDashboard />
        </Suspense>
      </AdminRouteGuard>
    </ErrorBoundary>
  ),
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: () => (
    <ErrorBoundary>
      <AdminRouteGuard>
        <Suspense fallback={<PageLoadingFallback />}>
          <FeatureCompare />
        </Suspense>
      </AdminRouteGuard>
    </ErrorBoundary>
  ),
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: () => <ErrorBoundary><Leaderboard /></ErrorBoundary>,
});

// Main property detail route with singular path
const propertyDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/property/$propertyId',
  component: () => <ErrorBoundary><PropertyDetail /></ErrorBoundary>,
});

// Redirect route for backward compatibility: /properties/:id -> /property/:id
const propertiesRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties/$propertyId',
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/property/$propertyId',
      params: { propertyId: params.propertyId },
    });
  },
});

const nodeManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/property/$propertyId/nodes',
  component: () => (
    <ErrorBoundary>
      <AdminRouteGuard>
        <Suspense fallback={<PageLoadingFallback />}>
          <NodeManagement />
        </Suspense>
      </AdminRouteGuard>
    </ErrorBoundary>
  ),
});

const liveStatusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/live-status',
  component: () => <ErrorBoundary><LiveStatus /></ErrorBoundary>,
});

const systemHealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/system-health',
  component: () => (
    <ErrorBoundary>
      <AdminRouteGuard>
        <Suspense fallback={<PageLoadingFallback />}>
          <SystemHealthDashboard />
        </Suspense>
      </AdminRouteGuard>
    </ErrorBoundary>
  ),
});

const specificationStatusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/specification-status',
  component: () => <ErrorBoundary><SpecificationStatus /></ErrorBoundary>,
});

const bundleOptimizationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bundle-optimization',
  component: () => (
    <ErrorBoundary>
      <AdminRouteGuard>
        <Suspense fallback={<PageLoadingFallback />}>
          <BundleOptimization />
        </Suspense>
      </AdminRouteGuard>
    </ErrorBoundary>
  ),
});

const menuAnalysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu-analysis',
  component: () => (
    <ErrorBoundary>
      <AdminRouteGuard>
        <Suspense fallback={<PageLoadingFallback />}>
          <MenuAnalysis />
        </Suspense>
      </AdminRouteGuard>
    </ErrorBoundary>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  prosRoute,
  whatWeDoRoute,
  whyUsRoute,
  contactRoute,
  faqRoute,
  termsRoute,
  referralRoute,
  proofOfTrustRoute,
  sitemapRoute,
  galleryRoute,
  blogRoute,
  blogPostRoute,
  adminRoute,
  dashboardRoute,
  featuresRoute,
  leaderboardRoute,
  propertyDetailRoute,
  propertiesRedirectRoute,
  nodeManagementRoute,
  liveStatusRoute,
  systemHealthRoute,
  specificationStatusRoute,
  bundleOptimizationRoute,
  menuAnalysisRoute,
]);

const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadDelay: 100,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  useEffect(() => {
    // Use requestIdleCallback for non-critical integrity check
    const checkIntegrity = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(async () => {
          try {
            const result = await validateRuntimeIntegrity();
            if (!result.isValid) {
              console.warn('Runtime integrity validation failed:', result.errors);
            }
          } catch (error) {
            console.error('Runtime integrity check error:', error);
          }
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(async () => {
          try {
            const result = await validateRuntimeIntegrity();
            if (!result.isValid) {
              console.warn('Runtime integrity validation failed:', result.errors);
            }
          } catch (error) {
            console.error('Runtime integrity check error:', error);
          }
        }, 1000);
      }
    };
    
    checkIntegrity();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <ErrorBoundary>
            <RouterProvider router={router} />
            <Toaster />
          </ErrorBoundary>
        </InternetIdentityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
