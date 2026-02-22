import { useState, useEffect, lazy, Suspense, Component, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useGetAllSites } from '../hooks/useSites';
import { useSeedMenuItems } from '../hooks/useSeedMenuItems';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Chunk Error Boundary for handling dynamic import failures
class ChunkErrorBoundary extends Component<
  { children: ReactNode; componentName?: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; componentName?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    if (
      error.name === 'ChunkLoadError' ||
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed')
    ) {
      return { hasError: true };
    }
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Component loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Failed to load {this.props.componentName || 'component'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load all components with error handling
const createLazyComponent = (importFn: () => Promise<any>, componentName: string) => {
  return lazy(() =>
    importFn().catch((error) => {
      console.error(`Failed to load ${componentName}:`, error);
      return {
        default: () => (
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Failed to load {componentName}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
              >
                Refresh Page
              </button>
            </div>
          </div>
        ),
      };
    })
  );
};

const SitesOverview = createLazyComponent(() => import('../components/SitesOverview'), 'Sites Overview');
const ComparePage = createLazyComponent(() => import('./ComparePage'), 'Compare Page');
const SiteManagement = createLazyComponent(() => import('../components/SiteManagement'), 'Site Management');
const TemplateLibrary = createLazyComponent(() => import('../components/TemplateLibrary'), 'Template Library');
const PlatformConfiguration = createLazyComponent(() => import('../components/PlatformConfiguration'), 'Platform Configuration');
const DocumentationCenter = createLazyComponent(() => import('../components/DocumentationCenter'), 'Documentation Center');
const DomainReferenceManager = createLazyComponent(() => import('../components/DomainReferenceManager'), 'Domain Reference Manager');
const ContactUsPage = createLazyComponent(() => import('../components/ContactUsPage'), 'Contact Us');
const ContentPage = createLazyComponent(() => import('../components/ContentPage'), 'Content Page');
const LeaderboardPage = createLazyComponent(() => import('../components/LeaderboardPage'), 'Leaderboard');
const SitemapPage = createLazyComponent(() => import('../components/SitemapPage'), 'Sitemap');
const SitemapManagementPage = createLazyComponent(() => import('../components/SitemapManagementPage'), 'Sitemap Management');
const ProsPage = createLazyComponent(() => import('../components/ProsPage'), 'Pros');
const AppsManagement = createLazyComponent(() => import('../components/AppsManagement'), 'Apps Management');
const FeaturesManagement = createLazyComponent(() => import('../components/FeaturesManagement'), 'Features Management');
const PaymentPage = createLazyComponent(() => import('../pages/PaymentPage'), 'Payment');
const FixturesPage = createLazyComponent(() => import('../components/FixturesPage'), 'Fixtures');
const AllAppFeaturesComparison = createLazyComponent(() => import('../components/AllAppFeaturesComparison'), 'Features Comparison');
const YamlConfigEditor = createLazyComponent(() => import('../components/YamlConfigEditor'), 'YAML Config Editor');
const SecureRoutesManager = createLazyComponent(() => import('../components/SecureRoutesManager'), 'Secure Routes Manager');
const ManifestLogViewer = createLazyComponent(() => import('../components/ManifestLogViewer'), 'Manifest Log Viewer');
const PageManagementDashboard = createLazyComponent(() => import('../pages/PageManagementDashboard'), 'Page Management Dashboard');
const RemotePageIntegration = createLazyComponent(() => import('../components/RemotePageIntegration'), 'Remote Page Integration');
const AngelVCPage = createLazyComponent(() => import('../components/AngelVCPage'), 'Angel/VC Page');
const BroadcastHub = createLazyComponent(() => import('../components/BroadcastHub'), 'Broadcast Hub');
const MainControlPage = createLazyComponent(() => import('../pages/MainControlPage'), 'Main Control');
const BuildOptimizationReport = createLazyComponent(() => import('../components/BuildOptimizationReport'), 'Build Optimization Report');

interface DashboardProps {
  onNavigate: (page: string) => void;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { actor } = useActor();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: allSites = [] } = useGetAllSites();

  useSeedMenuItems();

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor,
  });

  const { data: userRole } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) return 'guest';
      const role = await actor.getCallerUserRole();
      return role;
    },
    enabled: !!actor,
  });

  const topSites = allSites.slice(0, 7);

  useEffect(() => {
    const handleNavigation = (page: string) => {
      const pageToTab: Record<string, string> = {
        '/dashboard': 'overview',
        '/compare': 'compare',
        '/sites': 'sites',
        '/templates': 'templates',
        '/config': 'config',
        '/docs': 'docs',
        '/domains': 'domains',
        '/contact-us': 'contact',
        '/blog': 'blog',
        '/about-us': 'about',
        '/pros': 'pros',
        '/what-we-do': 'what',
        '/why-us': 'why',
        '/faq': 'faq',
        '/terms-and-conditions': 'terms',
        '/referral': 'referral',
        '/proof-of-trust': 'trust',
        '/leaderboard': 'leaderboard',
        '/sitemap': 'sitemap',
        '/sitemap-mgmt': 'sitemap-mgmt',
        '/apps': 'apps',
        '/features': 'features',
        '/payment': 'payment',
        '/fixtures': 'fixtures',
        '/comparison': 'comparison',
        '/yaml-config': 'yaml',
        '/secure-routes': 'secure-routes',
        '/manifest-logs': 'manifest',
        '/page-management': 'page-mgmt',
        '/remote-integration': 'remote-pages',
        '/angel-vc': 'angel-vc',
        '/broadcast-hub': 'broadcast',
        '/main-control': 'main-control',
        '/build-report': 'build-report',
      };

      const tab = pageToTab[page] || 'overview';
      setActiveTab(tab);
    };

    const currentPage = window.location.pathname;
    handleNavigation(currentPage);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <div className="container mx-auto">
            <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="sites">Sites</TabsTrigger>
              <TabsTrigger value="apps">Apps</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              {isAdmin && <TabsTrigger value="main-control">Main Control</TabsTrigger>}
            </TabsList>
          </div>
        </div>

        <div className="container mx-auto py-8">
          <ChunkErrorBoundary componentName="Tab Content">
            <Suspense fallback={<LoadingFallback />}>
              <TabsContent value="overview">
                <SitesOverview allSites={allSites} topSites={topSites} />
              </TabsContent>
              <TabsContent value="compare">
                <ComparePage />
              </TabsContent>
              <TabsContent value="sites">
                <SiteManagement isAdmin={isAdmin || false} />
              </TabsContent>
              <TabsContent value="templates">
                <TemplateLibrary isAdmin={isAdmin || false} />
              </TabsContent>
              <TabsContent value="config">
                <PlatformConfiguration isAdmin={isAdmin || false} />
              </TabsContent>
              <TabsContent value="docs">
                <DocumentationCenter />
              </TabsContent>
              <TabsContent value="domains">
                <DomainReferenceManager isAdmin={isAdmin || false} />
              </TabsContent>
              <TabsContent value="contact">
                <ContactUsPage />
              </TabsContent>
              <TabsContent value="blog">
                <ContentPage page="/blog" />
              </TabsContent>
              <TabsContent value="about">
                <ContentPage page="/about-us" />
              </TabsContent>
              <TabsContent value="pros">
                <ProsPage project="MOAP" />
              </TabsContent>
              <TabsContent value="what">
                <ContentPage page="/what-we-do" />
              </TabsContent>
              <TabsContent value="why">
                <ContentPage page="/why-us" />
              </TabsContent>
              <TabsContent value="faq">
                <ContentPage page="/faq" />
              </TabsContent>
              <TabsContent value="terms">
                <ContentPage page="/terms-conditions" />
              </TabsContent>
              <TabsContent value="referral">
                <ContentPage page="/referral" />
              </TabsContent>
              <TabsContent value="trust">
                <ContentPage page="/proof-of-trust" />
              </TabsContent>
              <TabsContent value="leaderboard">
                <LeaderboardPage />
              </TabsContent>
              <TabsContent value="sitemap">
                <SitemapPage onNavigate={onNavigate} />
              </TabsContent>
              <TabsContent value="sitemap-mgmt">
                <SitemapManagementPage />
              </TabsContent>
              <TabsContent value="apps">
                <AppsManagement onNavigate={onNavigate} />
              </TabsContent>
              <TabsContent value="features">
                <FeaturesManagement />
              </TabsContent>
              <TabsContent value="payment">
                <PaymentPage appId="moap" />
              </TabsContent>
              <TabsContent value="fixtures">
                <FixturesPage />
              </TabsContent>
              <TabsContent value="comparison">
                <AllAppFeaturesComparison />
              </TabsContent>
              <TabsContent value="yaml">
                <YamlConfigEditor isAdmin={isAdmin || false} />
              </TabsContent>
              <TabsContent value="secure-routes">
                <SecureRoutesManager isAdmin={isAdmin || false} userRole={userRole || 'guest'} />
              </TabsContent>
              <TabsContent value="manifest">
                <ManifestLogViewer isAdmin={isAdmin || false} />
              </TabsContent>
              <TabsContent value="page-mgmt">
                <PageManagementDashboard />
              </TabsContent>
              <TabsContent value="remote-pages">
                <RemotePageIntegration />
              </TabsContent>
              <TabsContent value="angel-vc">
                <AngelVCPage />
              </TabsContent>
              <TabsContent value="broadcast">
                <BroadcastHub />
              </TabsContent>
              {isAdmin && (
                <TabsContent value="main-control">
                  <MainControlPage isAdmin={isAdmin} />
                </TabsContent>
              )}
              {isAdmin && (
                <TabsContent value="build-report">
                  <BuildOptimizationReport />
                </TabsContent>
              )}
            </Suspense>
          </ChunkErrorBoundary>
        </div>
      </Tabs>
    </div>
  );
}
