import { useEffect } from 'react';
import { Outlet, useRouter, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllRouteConfigs } from '../hooks/useQueries';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { identity } = useInternetIdentity();
  const router = useRouter();
  const location = useLocation();
  const { data: routeConfigs, isLoading: routeConfigsLoading } = useGetAllRouteConfigs();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (routeConfigsLoading || !routeConfigs) return;

    const currentPath = location.pathname;
    
    // Find matching route config
    const routeConfig = routeConfigs.find(config => config.path === currentPath);
    
    // Check if route requires authentication
    const requiresAuth = routeConfig?.requiresAuth || 
                        currentPath.startsWith('/admin') || 
                        currentPath.startsWith('/settings/admin');

    // Redirect to login if authentication is required but user is not authenticated
    if (requiresAuth && !isAuthenticated && currentPath !== '/login') {
      router.navigate({ to: '/login', search: { redirect: currentPath } });
    }
  }, [location.pathname, isAuthenticated, routeConfigs, routeConfigsLoading, router]);

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
