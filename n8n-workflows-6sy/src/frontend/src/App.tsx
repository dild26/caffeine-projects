import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import WorkflowDetailPage from './pages/WorkflowDetailPage';
import AdminPage from './pages/AdminPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ProsPage from './pages/ProsPage';
import WhatWeDoPage from './pages/WhatWeDoPage';
import WhyUsPage from './pages/WhyUsPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/TermsPage';
import ReferralPage from './pages/ReferralPage';
import TrustPage from './pages/TrustPage';
import SitemapPage from './pages/SitemapPage';
import DashboardPage from './pages/DashboardPage';
import FeaturesPage from './pages/FeaturesPage';
import SubscribersPage from './pages/SubscribersPage';
import ErrorRecoveryPage from './pages/ErrorRecoveryPage';
import FeatureValidationPage from './pages/FeatureValidationPage';
import GalleryPage from './pages/GalleryPage';
import TestGuidePage from './pages/TestGuidePage';

const rootRoute = createRootRoute({
  component: Layout,
});

// Public routes - no authentication required
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: CatalogPage,
});

const workflowDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workflow/$id',
  component: WorkflowDetailPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const prosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pros',
  component: ProsPage,
});

const whatWeDoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/what-we-do',
  component: WhatWeDoPage,
});

const whyUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/why-us',
  component: WhyUsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FaqPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: ReferralPage,
});

const trustRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trust',
  component: TrustPage,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: SitemapPage,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: FeaturesPage,
});

// Protected routes - authentication required
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const subscribersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscribers',
  component: SubscribersPage,
});

const errorRecoveryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/error-recovery',
  component: ErrorRecoveryPage,
});

const featureValidationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feature-validation',
  component: FeatureValidationPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: GalleryPage,
});

const testGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-guide',
  component: TestGuidePage,
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  workflowDetailRoute,
  adminRoute,
  dashboardRoute,
  featuresRoute,
  subscribersRoute,
  errorRecoveryRoute,
  featureValidationRoute,
  galleryRoute,
  testGuideRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  blogRoute,
  aboutRoute,
  prosRoute,
  whatWeDoRoute,
  whyUsRoute,
  contactRoute,
  faqRoute,
  termsRoute,
  referralRoute,
  trustRoute,
  sitemapRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
