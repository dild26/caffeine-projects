import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { InternetIdentityProvider } from '@/hooks/useInternetIdentity';
import { ActorProvider } from '@/hooks/useActor';
import AppSidebar from '@/components/AppSidebar';
import BottomNav from '@/components/BottomNav';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import HomePage from '@/components/HomePage';
import AboutUsPage from '@/components/AboutUsPage';
import ContactUsPage from '@/components/ContactUsPage';
import DashboardPage from '@/components/DashboardPage';
import SitemapsPage from '@/components/SitemapsPage';
import SubscriptionPage from '@/components/SubscriptionPage';
import ReferralsPage from '@/components/ReferralsPage';
import GodsEyeSummaryPage from '@/components/GodsEyeSummaryPage';
import AdminPage from '@/components/AdminPage';
import AdvancedAnalyticsDashboard from '@/components/AdvancedAnalyticsDashboard';
import EnhancedExportManager from '@/components/EnhancedExportManager';
import SystemMonitoringDashboard from '@/components/SystemMonitoringDashboard';
import EnhancedAdminPanel from '@/components/EnhancedAdminPanel';
import FeatureChecklistPage from '@/components/FeatureChecklistPage';
import PaymentSuccessPage from '@/components/PaymentSuccessPage';
import PaymentFailurePage from '@/components/PaymentFailurePage';
import CatalogsPage from '@/pages/CatalogsPage';
import DeploymentDiagnostics from '@/components/DeploymentDiagnostics';
import DomainCatalogBuilder from '@/components/DomainCatalogBuilder';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import AdvancedSearchMenu from '@/components/AdvancedSearchMenu';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'gods-eye' | 'admin' | 'analytics' | 'exports' | 'monitoring' | 'admin-panel' | 'feature-checklist' | 'catalogs' | 'diagnostics' | 'catalog-builder';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState<number>(0);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);

  // Self-healing error recovery
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      setHasError(true);
      setErrorCount(prev => prev + 1);
      setLastErrorTime(Date.now());

      // Auto-recovery after 3 seconds
      setTimeout(() => {
        setHasError(false);
      }, 3000);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setErrorCount(prev => prev + 1);
      setLastErrorTime(Date.now());

      setTimeout(() => {
        setHasError(false);
      }, 3000);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Watchdog for deployment diagnostics
  useEffect(() => {
    const checkDeploymentHealth = async () => {
      try {
        const response = await fetch('/health-check', { method: 'HEAD' });
        if (!response.ok) {
          console.warn('Deployment health check failed');
        }
      } catch (error) {
        console.warn('Deployment health check error:', error);
      }
    };

    const interval = setInterval(checkDeploymentHealth, 60000);
    checkDeploymentHealth();

    return () => clearInterval(interval);
  }, []);

  // Persist theme and user preferences
  useEffect(() => {
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage && savedPage !== currentPage) {
      setCurrentPage(savedPage as Page);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    setSearchMenuOpen(false);
  };

  const handleRecovery = () => {
    setHasError(false);
    setErrorCount(0);
    queryClient.clear();
    window.location.reload();
  };

  const renderPage = () => {
    try {
      switch (currentPage) {
        case 'home': return <HomePage onNavigate={handleNavigate} />;
        case 'about': return <AboutUsPage onNavigate={handleNavigate} />;
        case 'contact': return <ContactUsPage onNavigate={handleNavigate} />;
        case 'dashboard': return <DashboardPage onNavigate={handleNavigate} />;
        case 'sitemaps': return <SitemapsPage onNavigate={handleNavigate} />;
        case 'subscription': return <SubscriptionPage onNavigate={handleNavigate} />;
        case 'referrals': return <ReferralsPage onNavigate={handleNavigate} />;
        case 'gods-eye': return <GodsEyeSummaryPage onNavigate={handleNavigate} />;
        case 'admin': return <AdminPage onNavigate={handleNavigate} />;
        case 'analytics': return <AdvancedAnalyticsDashboard />;
        case 'exports': return <EnhancedExportManager />;
        case 'monitoring': return <SystemMonitoringDashboard />;
        case 'admin-panel': return <EnhancedAdminPanel onNavigate={handleNavigate} />;
        case 'feature-checklist': return <FeatureChecklistPage onNavigate={handleNavigate} />;
        case 'catalogs': return <CatalogsPage />;
        case 'diagnostics': return <DeploymentDiagnostics />;
        case 'catalog-builder': return <DomainCatalogBuilder />;
        default: return <HomePage onNavigate={handleNavigate} />;
      }
    } catch (error) {
      console.error('Page render error:', error);
      setHasError(true);
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Alert className="max-w-md border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Page failed to load</p>
              <p className="text-sm mb-4">An error occurred while rendering this page.</p>
              <Button onClick={() => setCurrentPage('home')} className="w-full">
                Return to Home
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  };

  if (hasError && errorCount > 3 && Date.now() - lastErrorTime < 10000) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-destructive/5">
        <Alert className="max-w-md border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Multiple errors detected</p>
            <p className="text-sm mb-4">
              The application encountered {errorCount} errors. Recovery mode activated.
            </p>
            <div className="space-y-2">
              <Button onClick={handleRecovery} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recover Application
              </Button>
              <Button onClick={() => setCurrentPage('diagnostics')} variant="outline" className="w-full">
                Run Diagnostics
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="shadow-lg"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <ThemeToggle />
      </div>

      {/* Desktop Theme Toggle */}
      <div className="hidden lg:block fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AppSidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onClose={() => setSidebarOpen(false)}
          onOpenSearchMenu={() => setSearchMenuOpen(true)}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-4">
          {renderPage()}
        </main>

        {/* Bottom Navigation */}
        <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      </div>

      {/* Advanced Search Menu */}
      <AdvancedSearchMenu
        open={searchMenuOpen}
        onClose={() => setSearchMenuOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Profile Setup Modal */}
      <ProfileSetupModal />
    </div>
  );
}

export default function App() {
  return (
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <InternetIdentityProvider>
            <ActorProvider>
              <AppContent />
              <Toaster position="top-right" expand={true} richColors />
            </ActorProvider>
          </InternetIdentityProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
