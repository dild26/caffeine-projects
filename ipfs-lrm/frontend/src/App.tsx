import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IPFSContentViewer from '@/components/IPFSContentViewer';
import AdminPage from '@/pages/AdminPage';
import SitemapPage from '@/pages/SitemapPage';

const queryClient = new QueryClient();

// Layout component with Header and Footer
function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Home route - publicly accessible
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IPFSContentViewer,
});

// Admin route - requires authentication
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

// Sitemap route - publicly accessible
const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: SitemapPage,
});

// Create router
const routeTree = rootRoute.addChildren([indexRoute, adminRoute, sitemapRoute]);
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
