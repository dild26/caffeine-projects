import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ContactPage from './pages/ContactPage';
import SitemapPage from './pages/SitemapPage';
import MarkdownPage from './pages/MarkdownPage';
import ExplorePage from './pages/ExplorePage';
import PublicDatasetPage from './pages/PublicDatasetPage';
import FeaturePage from './pages/FeaturePage';
import ProfileSetupModal from './components/ProfileSetupModal';
import LoginPrompt from './components/LoginPrompt';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function HomePage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showLoginPrompt = !isAuthenticated && !isInitializing;
  const showDashboard = isAuthenticated && !showProfileSetup && userProfile !== null;

  if (isInitializing || profileLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (showLoginPrompt) {
    return <LoginPrompt />;
  }

  if (showDashboard) {
    return (
      <>
        <Dashboard />
        {showProfileSetup && <ProfileSetupModal />}
      </>
    );
  }

  return null;
}

function DashboardWrapper() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing || profileLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <>
      <Dashboard />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

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
  component: DashboardWrapper,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: SitemapPage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorePage,
});

const featureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feature',
  component: FeaturePage,
});

const publicDatasetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dataset/$cid',
  component: PublicDatasetPage,
});

// Sitemap content pages
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => <MarkdownPage pageId="about" />,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => <MarkdownPage pageId="blog" />,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: () => <MarkdownPage pageId="faq" />,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: () => <MarkdownPage pageId="features" />,
});

const prosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pros',
  component: () => <MarkdownPage pageId="pros" />,
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: () => <MarkdownPage pageId="referral" />,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: () => <MarkdownPage pageId="terms" />,
});

const whoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/who',
  component: () => <MarkdownPage pageId="who" />,
});

const whatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/what',
  component: () => <MarkdownPage pageId="what" />,
});

const whyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/why',
  component: () => <MarkdownPage pageId="why" />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  contactRoute,
  sitemapRoute,
  exploreRoute,
  featureRoute,
  publicDatasetRoute,
  aboutRoute,
  blogRoute,
  faqRoute,
  featuresRoute,
  prosRoute,
  referralRoute,
  termsRoute,
  whoRoute,
  whatRoute,
  whyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
