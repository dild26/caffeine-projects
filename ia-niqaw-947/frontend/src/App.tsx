import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { lazy, Suspense } from 'react';
import type { LazyExoticComponent, ReactElement } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import LoginPage from './pages/LoginPage';
import ProfileSetup from './pages/ProfileSetup';

// Lazy load route components for code-splitting and performance optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CRM = lazy(() => import('./pages/CRM'));
const Billing = lazy(() => import('./pages/Billing'));
const Products = lazy(() => import('./pages/Products'));
const Features = lazy(() => import('./pages/Features'));
const Blog = lazy(() => import('./pages/Blog'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ProsOfEContracts = lazy(() => import('./pages/ProsOfEContracts'));
const WhatWeDo = lazy(() => import('./pages/WhatWeDo'));
const WhyUs = lazy(() => import('./pages/WhyUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const Referral = lazy(() => import('./pages/Referral'));
const ProofOfTrust = lazy(() => import('./pages/ProofOfTrust'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const Templates = lazy(() => import('./pages/Templates'));
const Upload = lazy(() => import('./pages/Upload'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const Help = lazy(() => import('./pages/Help'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Wrapper component for lazy-loaded routes
function LazyRoute({ component: Component }: { component: LazyExoticComponent<() => ReactElement> }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
}

// Root component for protected routes (requires authentication)
function ProtectedRootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (userProfile === null) {
    return <ProfileSetup />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

// Root component for public routes (no authentication required)
function PublicRootComponent() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}

const rootRoute = createRootRoute({
  component: PublicRootComponent,
});

// Public routes - accessible without login
const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: () => <LazyRoute component={Features} />,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => <LazyRoute component={Blog} />,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => <LazyRoute component={AboutUs} />,
});

const prosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pros-of-e-contracts',
  component: () => <LazyRoute component={ProsOfEContracts} />,
});

const whatWeDoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/what-we-do',
  component: () => <LazyRoute component={WhatWeDo} />,
});

const whyUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/why-us',
  component: () => <LazyRoute component={WhyUs} />,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: () => <LazyRoute component={ContactUs} />,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: () => <LazyRoute component={FAQ} />,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: () => <LazyRoute component={TermsConditions} />,
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: () => <LazyRoute component={Referral} />,
});

const proofRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proof-of-trust',
  component: () => <LazyRoute component={ProofOfTrust} />,
});

const templatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates',
  component: () => <LazyRoute component={Templates} />,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: () => <LazyRoute component={Help} />,
});

const publicSitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: () => <LazyRoute component={Sitemap} />,
});

// Protected root for authenticated routes
const protectedRootRoute = createRootRoute({
  component: ProtectedRootComponent,
});

// Protected routes - require authentication
const dashboardRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/',
  component: () => <LazyRoute component={Dashboard} />,
});

const crmRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/crm',
  component: () => <LazyRoute component={CRM} />,
});

const billingRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/billing',
  component: () => <LazyRoute component={Billing} />,
});

const productsRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/products',
  component: () => <LazyRoute component={Products} />,
});

const uploadRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/upload',
  component: () => <LazyRoute component={Upload} />,
});

const analyticsRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/analytics',
  component: () => <LazyRoute component={Analytics} />,
});

const reportsRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/reports',
  component: () => <LazyRoute component={Reports} />,
});

const settingsRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/settings',
  component: () => <LazyRoute component={Settings} />,
});

const adminRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/admin',
  component: () => <LazyRoute component={AdminDashboard} />,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/payment-success',
  component: () => <LazyRoute component={PaymentSuccess} />,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/payment-failure',
  component: () => <LazyRoute component={PaymentFailure} />,
});

// Create separate route trees
const publicRouteTree = rootRoute.addChildren([
  featuresRoute,
  blogRoute,
  aboutRoute,
  prosRoute,
  whatWeDoRoute,
  whyUsRoute,
  contactRoute,
  faqRoute,
  termsRoute,
  referralRoute,
  proofRoute,
  templatesRoute,
  helpRoute,
  publicSitemapRoute,
]);

const protectedRouteTree = protectedRootRoute.addChildren([
  dashboardRoute,
  crmRoute,
  billingRoute,
  productsRoute,
  uploadRoute,
  analyticsRoute,
  reportsRoute,
  settingsRoute,
  adminRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

// Determine which router to use based on the current path
function AppRouter() {
  const currentPath = window.location.pathname;
  
  // List of protected paths
  const protectedPaths = [
    '/',
    '/crm',
    '/billing',
    '/products',
    '/upload',
    '/analytics',
    '/reports',
    '/settings',
    '/admin',
    '/payment-success',
    '/payment-failure',
  ];

  const isProtectedPath = protectedPaths.some(path => 
    currentPath === path || currentPath.startsWith(path + '/')
  );

  const router = isProtectedPath 
    ? createRouter({ routeTree: protectedRouteTree })
    : createRouter({ routeTree: publicRouteTree });

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppRouter />
      <Toaster />
    </ThemeProvider>
  );
}
