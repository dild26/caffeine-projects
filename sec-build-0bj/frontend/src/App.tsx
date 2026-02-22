import { useEffect } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { initializeGlobalKeyboardHandler } from './hooks/useGlobalKeyboard';
import HomePage from './pages/HomePage';
import WorkspaceView from './pages/WorkspaceView';
import FeaturesPage from './pages/FeaturesPage';
import DocumentationPage from './pages/DocumentationPage';
import AboutPage from './pages/AboutPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SubscriptionManagementDashboard from './components/SubscriptionManagementDashboard';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import PaymentFailedPage from './components/PaymentFailedPage';
import AdminPage from './pages/AdminPage';
import SitemapPage from './pages/SitemapPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspace',
  component: WorkspaceView,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: FeaturesPage,
});

const documentationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documentation',
  component: DocumentationPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const subscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription',
  component: SubscriptionPage,
});

const subscriptionManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription-management',
  component: SubscriptionManagementDashboard,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailedPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: SitemapPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  workspaceRoute,
  featuresRoute,
  documentationRoute,
  aboutRoute,
  subscriptionRoute,
  subscriptionManagementRoute,
  paymentSuccessRoute,
  paymentFailedRoute,
  adminRoute,
  sitemapRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  useEffect(() => {
    // Initialize global keyboard handler
    const cleanup = initializeGlobalKeyboardHandler();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
