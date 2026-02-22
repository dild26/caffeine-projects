import { useEffect, useState } from 'react';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useInitializeDefaultModules } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import LoginScreen from './pages/LoginScreen';
import ProfileSetup from './pages/ProfileSetup';
import MainPage from './pages/MainPage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';

const rootRoute = createRootRoute({
  component: Layout,
});

const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/main',
  component: MainPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const router = createRouter({ routeTree: rootRoute.addChildren([mainRoute, adminRoute, indexRoute]) });
    router.navigate({ to: '/main' });
    return null;
  },
});

const routeTree = rootRoute.addChildren([mainRoute, adminRoute, indexRoute]);
const router = createRouter({ routeTree });

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const { mutate: initializeModules, isPending: isInitializingModules } = useInitializeDefaultModules();

  const [modulesInitialized, setModulesInitialized] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !modulesInitialized && !isInitializingModules) {
      initializeModules(undefined, {
        onSuccess: () => {
          setModulesInitialized(true);
        },
        onError: (error) => {
          console.log('Module initialization:', error);
          setModulesInitialized(true);
        },
      });
    }
  }, [isAuthenticated, modulesInitialized, initializeModules, isInitializingModules]);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppContent />
      <Toaster />
    </ThemeProvider>
  );
}
