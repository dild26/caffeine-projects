import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectView } from '@/components/ProjectView';
import { FeaturesPage } from '@/components/FeaturesPage';
import { SecurePage } from '@/components/SecurePage';
import { SpecGenerationPage } from '@/components/SpecGenerationPage';
import { FixtureDashboard } from '@/components/FixtureDashboard';
import { FormTemplatesPage } from '@/components/FormTemplatesPage';
import { NodeTypeManager } from '@/components/NodeTypeManager';
import { ProfileSetup } from '@/components/ProfileSetup';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

type View = 'projects' | 'features' | 'secure' | 'spec-generation' | 'fixtures' | 'form-templates' | 'node-types';

function AppContent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentView, setCurrentView] = useState<View>('projects');

  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1">
          <ProfileSetup />
        </main>
        <Footer />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1">
        {currentView === 'projects' && <ProjectView />}
        {currentView === 'features' && <FeaturesPage />}
        {currentView === 'secure' && <SecurePage />}
        {currentView === 'spec-generation' && <SpecGenerationPage />}
        {currentView === 'fixtures' && <FixtureDashboard />}
        {currentView === 'form-templates' && <FormTemplatesPage />}
        {currentView === 'node-types' && <NodeTypeManager />}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
