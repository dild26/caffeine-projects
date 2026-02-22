import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsAdmin } from '@/hooks/useQueries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserProfileSetup from '@/components/UserProfileSetup';
import AccessDeniedScreen from '@/components/AccessDeniedScreen';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  const showProfileSetup = !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <UserProfileSetup />
        </main>
        <Footer />
      </div>
    );
  }

  if (profileLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen message="Admin access required" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage sitemaps, payments, and platform settings.
          </p>
        </div>

        <AdminDashboard />
      </main>
      
      <Footer />
    </div>
  );
}
