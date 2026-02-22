import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import GodsEyeNetPage from './pages/GodsEyeNetPage';
import AdvancedGodsEyePage from './pages/AdvancedGodsEyePage';
import IPCamsIPv4Page from './pages/IPCamsIPv4Page';
import IPNetDiscoveryPage from './pages/IPNetDiscoveryPage';
import IPNetIPCamsPage from './pages/IPNetIPCamsPage';
import ContactPage from './components/ContactPage';
import ContentPage from './components/ContentPage';
import FeaturesPage from './components/FeaturesPage';
import SitemapPage from './components/SitemapPage';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNavbar from './components/BottomNavbar';
import ProfileSetupModal from './components/ProfileSetupModal';
import LoginPrompt from './components/LoginPrompt';
import { DeploymentErrorBoundary } from './components/DeploymentErrorBoundary';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './hooks/useQueries';
import { startDeploymentMonitor } from './lib/deploymentValidator';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

startDeploymentMonitor();

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20">
        <DeploymentErrorBoundary componentName="MainContent">
          <Outlet />
        </DeploymentErrorBoundary>
      </main>
      <Footer />
      <BottomNavbar />
      <Toaster />
    </div>
  );
}

function IndexComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetupModal />;
  }

  return (
    <DeploymentErrorBoundary componentName="HomePage">
      <HomePage />
    </DeploymentErrorBoundary>
  );
}

function DashboardComponent() {
  return (
    <DeploymentErrorBoundary componentName="Dashboard">
      <Dashboard />
    </DeploymentErrorBoundary>
  );
}

function GodsEyeNetComponent() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold">Authentication Required</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            This page requires authentication. Please log in to access God's Eye Net.
          </p>
          <LoginPrompt />
        </div>
      </div>
    );
  }

  return (
    <DeploymentErrorBoundary componentName="GodsEyeNet">
      <GodsEyeNetPage />
    </DeploymentErrorBoundary>
  );
}

function AdvancedGodsEyeComponent() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold">Authentication Required</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            This page requires authentication. Please log in to access Advanced God's Eye.
          </p>
          <LoginPrompt />
        </div>
      </div>
    );
  }

  return (
    <DeploymentErrorBoundary componentName="AdvancedGodsEye">
      <AdvancedGodsEyePage />
    </DeploymentErrorBoundary>
  );
}

function IPCamsIPv4Component() {
  return (
    <DeploymentErrorBoundary componentName="IPCamsIPv4">
      <IPCamsIPv4Page />
    </DeploymentErrorBoundary>
  );
}

function IPNetDiscoveryComponent() {
  return (
    <DeploymentErrorBoundary componentName="IPNetDiscovery">
      <IPNetDiscoveryPage />
    </DeploymentErrorBoundary>
  );
}

function IPNetIPCamsComponent() {
  return (
    <DeploymentErrorBoundary componentName="IPNetIPCams">
      <IPNetIPCamsPage />
    </DeploymentErrorBoundary>
  );
}

function ContactComponent() {
  return (
    <DeploymentErrorBoundary componentName="Contact">
      <ContactPage />
    </DeploymentErrorBoundary>
  );
}

function FeaturesComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (isInitializing || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold">Access Restricted</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            This page is restricted to administrators. Please log in with an admin account to access this content.
          </p>
          <LoginPrompt />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold">Access Restricted</h1>
          <p className="text-lg text-muted-foreground">
            Access restricted to administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DeploymentErrorBoundary componentName="Features">
      <FeaturesPage />
    </DeploymentErrorBoundary>
  );
}

function SitemapComponent() {
  return (
    <DeploymentErrorBoundary componentName="Sitemap">
      <SitemapPage />
    </DeploymentErrorBoundary>
  );
}

function createContentComponent(pageName: string) {
  return function ContentComponent() {
    return (
      <DeploymentErrorBoundary componentName={pageName}>
        <ContentPage pageName={pageName} />
      </DeploymentErrorBoundary>
    );
  };
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardComponent,
});

const godsEyeNetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gods-eye-net',
  component: GodsEyeNetComponent,
});

const advancedGodsEyeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/advanced-gods-eye',
  component: AdvancedGodsEyeComponent,
});

const ipCamsIPv4Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/IPCams-IPv4',
  component: IPCamsIPv4Component,
});

const ipNetDiscoveryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/IPNet/discovery-ui',
  component: IPNetDiscoveryComponent,
});

const ipNetIPCamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/IPNet/ipcams',
  component: IPNetIPCamsComponent,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactComponent,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: FeaturesComponent,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: SitemapComponent,
});

const contentRoutes = [
  { path: '/blog', pageName: 'blog' },
  { path: '/about', pageName: 'about' },
  { path: '/pros', pageName: 'pros' },
  { path: '/what', pageName: 'what' },
  { path: '/why', pageName: 'why' },
  { path: '/how', pageName: 'how' },
  { path: '/faq', pageName: 'faq' },
  { path: '/terms', pageName: 'terms' },
  { path: '/referral', pageName: 'referral' },
  { path: '/trust', pageName: 'trust' },
].map(({ path, pageName }) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: createContentComponent(pageName),
  })
);

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  godsEyeNetRoute,
  advancedGodsEyeRoute,
  ipCamsIPv4Route,
  ipNetDiscoveryRoute,
  ipNetIPCamsRoute,
  contactRoute,
  featuresRoute,
  sitemapRoute,
  ...contentRoutes,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <StrictMode>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
