import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppsSection } from '@/components/sections/AppsSection';
import { CompareSection } from '@/components/sections/CompareSection';
import { LeaderboardSection } from '@/components/sections/LeaderboardSection';
import { VersionsSection } from '@/components/sections/VersionsSection';
import { OverviewSection } from '@/components/sections/OverviewSection';
import { SitemapSection } from '@/components/sections/SitemapSection';
import { useInitialize, getCurrentDataSource } from '@/hooks/useQueries';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle2, FileCode2 } from 'lucide-react';

export function HomePage() {
  const initMutation = useInitialize();
  const [dataSource, setDataSource] = useState<'backend' | 'yaml' | 'json' | 'default'>('yaml');
  const [activeTab, setActiveTab] = useState('apps');

  useEffect(() => {
    // Try to initialize backend (will fail gracefully if not available)
    initMutation.mutate(undefined, {
      onError: (error) => {
        // Silently handle initialization errors - we'll use spec files
        console.log('Backend not available, using spec files');
      },
    });

    // Handle hash-based navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['apps', 'compare', 'sitemap', 'leaderboard', 'versions'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Periodically check data source
  useEffect(() => {
    const interval = setInterval(() => {
      const source = getCurrentDataSource();
      if (source !== dataSource) {
        setDataSource(source);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [dataSource]);

  // Update hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
          MoAP Application Registry
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive application management with merge-only updates, canonical URL validation, and complete version tracking
        </p>
      </div>

      {dataSource === 'yaml' && (
        <Alert className="mb-8 border-purple-500 bg-purple-50 dark:bg-purple-950/20">
          <FileCode2 className="h-4 w-4 text-purple-600 dark:text-purple-500" />
          <AlertTitle className="text-purple-800 dark:text-purple-400">Loading from spec.yaml</AlertTitle>
          <AlertDescription className="text-purple-700 dark:text-purple-300">
            ✅ Displaying data from the unified spec.yaml configuration with 26 SECOINFI applications and 26 Secoinfi modules. 
            This YAML-based configuration enables workflow-style execution similar to n8n. Data automatically reloads every 60 seconds.
          </AlertDescription>
        </Alert>
      )}

      {dataSource === 'json' && (
        <Alert className="mb-8 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          <AlertTitle className="text-blue-800 dark:text-blue-400">Loading from spec.json</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            ⚠️ Displaying data from the spec.json configuration file with 26 SECOINFI applications. 
            Note: Secoinfi modules are only available in spec.yaml. Data automatically reloads every 60 seconds.
          </AlertDescription>
        </Alert>
      )}

      {dataSource === 'default' && (
        <Alert className="mb-8 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-400">Using Fallback Data</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            ⚠️ spec.yaml and spec.json are unavailable. Displaying embedded default applications from defaultSpec.json. 
            Some features may be limited. Please ensure spec.yaml is properly configured for full functionality.
          </AlertDescription>
        </Alert>
      )}

      {dataSource === 'backend' && (
        <Alert className="mb-8 border-green-500 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
          <AlertTitle className="text-green-800 dark:text-green-400">Connected to Backend</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            ✅ Successfully connected to the backend canister. All data is loaded from the Internet Computer.
          </AlertDescription>
        </Alert>
      )}

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Unified YAML Configuration System</AlertTitle>
        <AlertDescription>
          MoAP now supports a unified spec.yaml configuration that consolidates all application data, features, sitemap, and policies. 
          The system uses workflow-style execution where each UI component reads from its corresponding YAML subtree, similar to n8n workflow nodes. 
          All updates use non-destructive merge semantics with canonical URL validation. The Apps Registry tab displays both SECOINFI applications (26 apps) 
          and Secoinfi modules (26 modules) in separate searchable tables with proper URL validation and error handling.
        </AlertDescription>
      </Alert>

      <OverviewSection />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-12">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-8">
          <TabsTrigger value="apps">Apps Registry</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="apps">
          <AppsSection />
        </TabsContent>

        <TabsContent value="compare">
          <CompareSection />
        </TabsContent>

        <TabsContent value="sitemap">
          <SitemapSection />
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardSection />
        </TabsContent>

        <TabsContent value="versions">
          <VersionsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
