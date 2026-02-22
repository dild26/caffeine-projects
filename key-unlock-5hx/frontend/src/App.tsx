import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useAppQueries';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useActor } from './hooks/useActor';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import ProfileSetup from './components/ProfileSetup';
import LoginPrompt from './components/LoginPrompt';
import LoginPage from './pages/LoginPage';
import LivePage from './pages/LivePage';
import SecoinfiAppsPage from './pages/SecoinfiAppsPage';
import MainControlPage from './pages/MainControlPage';
import PaymentPage from './pages/PaymentPage';
import Dashboard from './components/Dashboard';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ProsPage from './pages/ProsPage';
import WhatWeDoPage from './pages/WhatWeDoPage';
import WhyUsPage from './pages/WhyUsPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/TermsPage';
import ReferralPage from './pages/ReferralPage';
import ProofOfTrustPage from './pages/ProofOfTrustPage';
import SitemapPage from './pages/SitemapPage';
import FeaturesPage from './pages/FeaturesPage';
import ProDetailPage from './pages/ProDetailPage';
import TestInputPage from './pages/TestInputPage';
import IntegrationGuidePage from './pages/IntegrationGuidePage';
import AdminPage from './pages/AdminPage';
import ThemeSynchronizer from './components/ThemeSynchronizer';

// Route protection wrapper
function ProtectedRoute({ children, path }: { children: React.ReactNode; path: string }) {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { actor } = useActor();
  const [isRestricted, setIsRestricted] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if path is restricted
    const checkRestriction = async () => {
      if (!actor) {
        setIsRestricted(false);
        return;
      }

      try {
        const restricted = await actor.isPathRestricted(path);
        setIsRestricted(restricted);
      } catch (error) {
        console.error('Error checking path restriction:', error);
        setIsRestricted(false);
      }
    };

    checkRestriction();
  }, [path, actor]);

  // Show loading while checking
  if (isRestricted === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not restricted, show content
  if (!isRestricted) {
    return <>{children}</>;
  }

  // If restricted and not authenticated, show login prompt
  if (!identity) {
    return <LoginPrompt />;
  }

  // If authenticated, show content
  return <>{children}</>;
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-16 md:pb-0">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <Toaster />
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

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: SitemapPage,
});

const testInputRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-input',
  component: TestInputPage,
});

const integrationGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/integration-guide',
  component: IntegrationGuidePage,
});

// Pro detail pages - public
const secureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/secure',
  component: () => <ProDetailPage proId={1n} />,
});

const privateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/private',
  component: () => <ProDetailPage proId={2n} />,
});

const decentralisedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/decentralised',
  component: () => <ProDetailPage proId={3n} />,
});

const universalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/universal',
  component: () => <ProDetailPage proId={4n} />,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => <ProDetailPage proId={5n} />,
});

const identityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/identity',
  component: () => <ProDetailPage proId={6n} />,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/authenticated',
  component: () => <ProDetailPage proId={7n} />,
});

const blockchainBasedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blockchain-based',
  component: () => <ProDetailPage proId={8n} />,
});

const cryptographicSecurityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cryptographic-security',
  component: () => <ProDetailPage proId={9n} />,
});

const multiDeviceSupportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/multi-device-support',
  component: () => <ProDetailPage proId={10n} />,
});

const protectedIdentityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/protected-identity',
  component: () => <ProDetailPage proId={11n} />,
});

// Restricted routes - authentication required
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute path="/dashboard">
      <Dashboard />
    </ProtectedRoute>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedRoute path="/admin">
      <AdminPage />
    </ProtectedRoute>
  ),
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: () => (
    <ProtectedRoute path="/features">
      <FeaturesPage />
    </ProtectedRoute>
  ),
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: () => (
    <ProtectedRoute path="/referral">
      <ReferralPage />
    </ProtectedRoute>
  ),
});

const proofOfTrustRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proof-of-trust',
  component: () => (
    <ProtectedRoute path="/proof-of-trust">
      <ProofOfTrustPage />
    </ProtectedRoute>
  ),
});



const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const liveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/live',
  component: LivePage,
});

const appsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/apps',
  component: SecoinfiAppsPage,
});

const controlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/control',
  component: MainControlPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment',
  component: PaymentPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  liveRoute,
  appsRoute,
  controlRoute,
  paymentRoute,
  dashboardRoute,
  adminRoute,
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
  proofOfTrustRoute,
  sitemapRoute,
  testInputRoute,
  integrationGuideRoute,
  secureRoute,
  privateRoute,
  decentralisedRoute,
  universalRoute,
  profileRoute,
  identityRoute,
  authenticatedRoute,
  blockchainBasedRoute,
  cryptographicSecurityRoute,
  multiDeviceSupportRoute,
  protectedIdentityRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending: isSavingProfile } = useSaveCallerUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleProfileSave = (name: string) => {
    saveProfile(
      { name, subscribed: false },
      {
        onSuccess: () => {
          toast.success('Profile created successfully!');
          setShowProfileSetup(false);
        },
        onError: (error) => {
          toast.error(`Failed to create profile: ${error.message}`);
        }
      }
    );
  };

  if (showProfileSetup) {
    return (
      <div className="min-h-screen flex flex-col bg-background pb-16 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <ProfileSetup onSave={handleProfileSave} isSaving={isSavingProfile} />
        </main>
        <Footer />
        <BottomNav />
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <ThemeSynchronizer />
      <RouterProvider router={router} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} themes={['light', 'dark', 'vibgyor']}>
      <AppContent />
    </ThemeProvider>
  );
}
