import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Component, ErrorInfo, ReactNode } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import ResourcesPage from './pages/ResourcesPage';
import InstructorsPage from './pages/InstructorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import FAQPage from './pages/FAQPage';
import BlogsPage from './pages/BlogsPage';
import ContactPage from './pages/ContactPage';
import JoinUsPage from './pages/JoinUsPage';
import ValuesPage from './pages/ValuesPage';
import InfoPage from './pages/InfoPage';
import KeywordsPage from './pages/KeywordsPage';
import LocationsPage from './pages/LocationsPage';
import MapsPage from './pages/MapsPage';
import GeoMapPage from './pages/GeoMapPage';
import NavigationPage from './pages/NavigationPage';
import SitemapPage from './pages/SitemapPage';
import DesignPage from './pages/DesignPage';
import PermissionsPage from './pages/PermissionsPage';
import QueriesPage from './pages/QueriesPage';
import ResponsiveDesignPage from './pages/ResponsiveDesignPage';
import TimestampPage from './pages/TimestampPage';
import UIUXPage from './pages/UIUXPage';
import WhatWhyWhenWhereWhoPage from './pages/WhatWhyWhenWhereWhoPage';
import AdminPage from './pages/AdminPage';
import DataSeeder from './components/DataSeeder';
import ValidationAlert from './components/ValidationAlert';
import ContrastAlert from './components/ContrastAlert';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🔴 ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔴 Error details:', error, errorInfo);
    // Log to external service in production
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastError', JSON.stringify({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }));
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application Error</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>Something went wrong while loading the application.</p>
              <p className="text-sm font-mono bg-destructive/10 p-2 rounded">
                {this.state.error?.message || 'Unknown error'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Reload Application
              </button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <ErrorBoundary>
      <DataSeeder />
      <ValidationAlert />
      <ContrastAlert />
      <Layout />
      <Toaster />
    </ErrorBoundary>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Routing Error</AlertTitle>
        <AlertDescription>
          <p className="mb-2">Failed to load the requested page.</p>
          <p className="text-sm font-mono bg-destructive/10 p-2 rounded">
            {error.message}
          </p>
        </AlertDescription>
      </Alert>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorePage,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resources',
  component: ResourcesPage,
});

const instructorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/instructors',
  component: InstructorsPage,
});

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments',
  component: AppointmentsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: FeaturesPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FAQPage,
});

const blogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blogs',
  component: BlogsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const joinUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join-us',
  component: JoinUsPage,
});

const valuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/values',
  component: ValuesPage,
});

const infoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info',
  component: InfoPage,
});

const keywordsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/keywords',
  component: KeywordsPage,
});

const locationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locations',
  component: LocationsPage,
});

const mapsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maps',
  component: MapsPage,
});

const geoMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/geo-map',
  component: GeoMapPage,
});

const navigationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/navigation',
  component: NavigationPage,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: SitemapPage,
});

const designRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/design',
  component: DesignPage,
});

const permissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/permissions',
  component: PermissionsPage,
});

const queriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/queries',
  component: QueriesPage,
});

const responsiveDesignRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/responsive-design',
  component: ResponsiveDesignPage,
});

const timestampRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/timestamp',
  component: TimestampPage,
});

const uiUxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ui-ux',
  component: UIUXPage,
});

const whatWhyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/what-why-when-where-who',
  component: WhatWhyWhenWhereWhoPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  exploreRoute,
  resourcesRoute,
  instructorsRoute,
  appointmentsRoute,
  aboutRoute,
  featuresRoute,
  faqRoute,
  blogsRoute,
  contactRoute,
  joinUsRoute,
  valuesRoute,
  infoRoute,
  keywordsRoute,
  locationsRoute,
  mapsRoute,
  geoMapRoute,
  navigationRoute,
  sitemapRoute,
  designRoute,
  permissionsRoute,
  queriesRoute,
  responsiveDesignRoute,
  timestampRoute,
  uiUxRoute,
  whatWhyRoute,
  adminRoute,
]);

const router = createRouter({ 
  routeTree,
  defaultErrorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Page Error</AlertTitle>
        <AlertDescription>
          <p className="mb-2">An error occurred while loading this page.</p>
          <p className="text-sm font-mono bg-destructive/10 p-2 rounded">
            {error.message}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Go to Home
          </button>
        </AlertDescription>
      </Alert>
    </div>
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Log app initialization
console.log('🚀 E-Tutorial App initializing...');
console.log('📊 Router configured with', routeTree.children?.length || 0, 'routes');
console.log('🎨 ThemeProvider will wrap entire application');

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
