import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useGetCurrentTheme, useInitializeDefaultPages } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import LoadingScreen from './components/LoadingScreen';
import { Outlet } from '@tanstack/react-router';
import { Theme } from './backend';
import { useEffect } from 'react';

// Pages
import HomePage from './pages/HomePage';
import SitemapPage from './pages/SitemapPage';
import AdminDashboard from './pages/AdminDashboard';
import ContractsPage from './pages/ContractsPage';
import UploadPage from './pages/UploadPage';
import TemplatesPage from './pages/TemplatesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BackupPage from './pages/BackupPage';
import FeaturesPage from './pages/FeaturesPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import CartPage from './pages/CartPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DashboardPage from './pages/DashboardPage';
import BlogPage from './pages/BlogPage';
import AboutUsPage from './pages/AboutUsPage';
import ProsOfEContractsPage from './pages/ProsOfEContractsPage';
import WhatWeDoPage from './pages/WhatWeDoPage';
import WhyUsPage from './pages/WhyUsPage';
import ContactUsPage from './pages/ContactUsPage';
import FAQPage from './pages/FAQPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import ReferralPage from './pages/ReferralPage';
import ProofOfTrustPage from './pages/ProofOfTrustPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

function Layout() {
  const { data: backendTheme } = useGetCurrentTheme();
  const { data: isAdmin } = useIsCallerAdmin();
  const initPages = useInitializeDefaultPages();

  useEffect(() => {
    if (backendTheme === Theme.vibgyor) {
      document.documentElement.classList.add('vibgyor-theme');
    } else {
      document.documentElement.classList.remove('vibgyor-theme');
    }
  }, [backendTheme]);

  // Initialize default pages when admin is detected
  useEffect(() => {
    if (isAdmin && !initPages.isSuccess) {
      initPages.mutate();
    }
  }, [isAdmin]);

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

const rootRoute = createRootRoute({
  component: Layout,
});

// Public routes - no authentication required
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogPage,
});

const aboutUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about-us',
  component: AboutUsPage,
});

const prosOfEContractsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pros-of-e-contracts',
  component: ProsOfEContractsPage,
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

const contactUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact-us',
  component: ContactUsPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FAQPage,
});

const termsAndConditionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms-and-conditions',
  component: TermsAndConditionsPage,
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: ReferralPage,
});

const proofOfTrustRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proof-of-trust',
  component: ProofOfTrustPage,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: SitemapPage,
});

const templatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates',
  component: TemplatesPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: UploadPage,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpPage,
});

const contractsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contracts',
  component: ContractsPage,
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

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

// Protected routes - require authentication (Admin or Subscription)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: FeaturesPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: AnalyticsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const backupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/backup',
  component: BackupPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute,
  aboutUsRoute,
  prosOfEContractsRoute,
  whatWeDoRoute,
  whyUsRoute,
  contactUsRoute,
  faqRoute,
  termsAndConditionsRoute,
  referralRoute,
  proofOfTrustRoute,
  sitemapRoute,
  templatesRoute,
  uploadRoute,
  helpRoute,
  contractsRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  cartRoute,
  leaderboardRoute,
  dashboardRoute,
  featuresRoute,
  analyticsRoute,
  reportsRoute,
  settingsRoute,
  adminRoute,
  backupRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  const { isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
      {showProfileSetup && <ProfileSetupModal />}
    </ThemeProvider>
  );
}
