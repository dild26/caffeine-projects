import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCurrentTermsVersion, useHasUserAcceptedTerms } from './hooks/useQueries';
import { RouterProvider, createRouter, createRoute, createRootRoute, useRouterState } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CalcPage from './pages/CalcPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import BlogsPage from './pages/BlogsPage';
import TransactionsPage from './pages/TransactionsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import FeaturesPage from './pages/FeaturesPage';
import MainFormPage from './pages/MainFormPage';
import TermsPage from './pages/TermsPage';
import SitemapPage from './pages/SitemapPage';
import Layout from './components/Layout';
import ProfileSetupModal from './components/ProfileSetupModal';
import ApprovalPendingScreen from './components/ApprovalPendingScreen';
import TermsModal from './components/TermsModal';

const rootRoute = createRootRoute({
  component: Layout,
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

const calcRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calc',
  component: CalcPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
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

const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  component: TransactionsPage,
});

const subscriptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscriptions',
  component: SubscriptionsPage,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: FeaturesPage,
});

const mainFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/main-form',
  component: MainFormPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: SitemapPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  calcRoute,
  leaderboardRoute,
  adminRoute,
  aboutRoute,
  contactRoute,
  faqRoute,
  blogsRoute,
  transactionsRoute,
  subscriptionsRoute,
  featuresRoute,
  mainFormRoute,
  termsRoute,
  sitemapRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Define restricted routes that require authentication
const RESTRICTED_ROUTES = [
  '/admin',
  '/main-form',
  '/subscriptions',
  '/leaderboard',
  '/dashboard',
  '/transactions',
];

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  
  const isRestrictedRoute = RESTRICTED_ROUTES.includes(currentPath);
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: currentTerms, isLoading: termsLoading } = useGetCurrentTermsVersion();
  const { data: hasAcceptedTerms, isLoading: acceptanceLoading } = useHasUserAcceptedTerms();

  // Only show modals for authenticated users on restricted routes
  const showProfileSetup = isAuthenticated && isRestrictedRoute && !profileLoading && isFetched && userProfile === null;
  const showTermsModal = isAuthenticated && isRestrictedRoute && !termsLoading && !acceptanceLoading && currentTerms && !hasAcceptedTerms;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal />}
      {isRestrictedRoute && <ApprovalPendingScreen />}
      {showTermsModal && currentTerms && <TermsModal terms={currentTerms} />}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="vibgyor" enableSystem>
      <AppContent />
    </ThemeProvider>
  );
}
