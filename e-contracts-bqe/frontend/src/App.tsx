import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import ProfileSetupModal from './components/ProfileSetupModal';
import { VoiceProvider } from './components/VoiceProvider';
import PublicLayout from './components/PublicLayout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import FeaturesPage from './pages/FeaturesPage';
import FeatureChecklistAdminPage from './pages/FeatureChecklistAdminPage';
import TemplatesPage from './pages/TemplatesPage';
import TemplateDetailPage from './pages/TemplateDetailPage';
import BlogPage from './pages/BlogPage';
import AboutUsPage from './pages/AboutUsPage';
import ProsPage from './pages/ProsPage';
import WhatWeDoPage from './pages/WhatWeDoPage';
import WhyUsPage from './pages/WhyUsPage';
import ContactUsPage from './pages/ContactUsPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import ReferralPage from './pages/ReferralPage';
import ProofOfTrustPage from './pages/ProofOfTrustPage';
import SitemapPage from './pages/SitemapPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import StripeSetupPage from './pages/StripeSetupPage';

const rootRoute = createRootRoute({
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: FeaturesPage,
});

const featureChecklistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feature-checklist',
  component: FeatureChecklistAdminPage,
});

const templatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates',
  component: TemplatesPage,
});

const templateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates/$templateId',
  component: TemplateDetailPage,
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

const prosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pros-of-e-contracts',
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

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms-conditions',
  component: TermsPage,
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

const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access-denied',
  component: AccessDeniedPage,
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

const stripeSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stripe-setup',
  component: StripeSetupPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  dashboardRoute,
  featuresRoute,
  featureChecklistRoute,
  templatesRoute,
  templateDetailRoute,
  blogRoute,
  aboutUsRoute,
  prosRoute,
  whatWeDoRoute,
  whyUsRoute,
  contactUsRoute,
  faqRoute,
  termsRoute,
  referralRoute,
  proofOfTrustRoute,
  sitemapRoute,
  accessDeniedRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  stripeSetupRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing || (isAuthenticated && !isFetched)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Initializing...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <VoiceProvider>
        {showProfileSetup && <ProfileSetupModal />}
        <RouterProvider router={router} />
        <Toaster />
      </VoiceProvider>
    </ThemeProvider>
  );
}
