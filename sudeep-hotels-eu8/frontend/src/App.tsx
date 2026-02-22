import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import DataObjects from './pages/DataObjects';
import AdminSettings from './pages/AdminSettings';
import ClonedPage from './pages/ClonedPage';
import ProfileSetup from './components/ProfileSetup';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
});

const dataObjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/data-objects',
  component: DataObjects,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminSettings,
});

const clonedPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pages/$pageId',
  component: ClonedPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  contactRoute,
  dataObjectsRoute,
  adminRoute,
  clonedPageRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="sudeep-hotels-theme">
      <AppContent />
      <Toaster richColors closeButton position="top-right" />
    </ThemeProvider>
  );
}
