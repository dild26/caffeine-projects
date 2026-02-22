import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import LoginButton from '../components/LoginButton';
import ProfileSetup from '../components/ProfileSetup';
import MapView from '../components/MapView';
import PayuPlans from '../components/PayuPlans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MapPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex-1 px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-md mx-auto text-center space-y-8">
            <div className="space-y-4">
              <img 
                src="/assets/generated/globe-icon-transparent.dim_64x64.png" 
                alt="Globe" 
                className="mx-auto h-20 w-20 opacity-90"
              />
              <h1 className="text-4xl font-bold tracking-tight">GPS Grid Maps</h1>
              <p className="text-lg text-muted-foreground">
                Explore the world with interactive 3D globe and 2D map views, featuring advanced grid overlays and geospatial operations.
              </p>
            </div>
            <div className="space-y-4">
              <LoginButton />
              <p className="text-sm text-muted-foreground">
                Sign in to place pins, create polygons, and log your geospatial operations.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Pay As You Use (PAYU)</h2>
              <p className="text-muted-foreground">
                Flexible pricing options for pins and nodes
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <PayuPlans />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  return <MapView />;
}
