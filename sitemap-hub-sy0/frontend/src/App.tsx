import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ReferralPage from './pages/ReferralPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GodsEyePage from './pages/GodsEyePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import FeatureChecklistPage from './pages/FeatureChecklistPage';

const rootRoute = createRootRoute({
  component: Layout,
});

// Public routes - no authentication required
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const godsEyeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gods-eye',
  component: GodsEyePage,
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: ReferralPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

// Protected routes - authentication required
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const subscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription',
  component: () => (
    <ProtectedRoute>
      <SubscriptionPage />
    </ProtectedRoute>
  ),
});

// Admin-only routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedRoute requireAdmin>
      <AdminPage />
    </ProtectedRoute>
  ),
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: () => (
    <ProtectedRoute requireAdmin>
      <AdminPage />
    </ProtectedRoute>
  ),
});

const featureChecklistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feature-checklist',
  component: () => (
    <ProtectedRoute requireAdmin>
      <FeatureChecklistPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  searchRoute,
  dashboardRoute,
  adminRoute,
  sitemapRoute,
  subscriptionRoute,
  referralRoute,
  aboutRoute,
  contactRoute,
  godsEyeRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  featureChecklistRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
