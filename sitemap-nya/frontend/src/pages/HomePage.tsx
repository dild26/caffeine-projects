import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginButton from '@/components/LoginButton';
import UserProfileSetup from '@/components/UserProfileSetup';
import HeroSection from '@/components/HeroSection';
import PricingSection from '@/components/PricingSection';
import FeaturesSection from '@/components/FeaturesSection';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        
        {isAuthenticated && userProfile && (
          <section className="py-16 bg-card/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Welcome back, {userProfile.name}!</h2>
              <p className="text-muted-foreground mb-8">Ready to explore millions of sitemaps?</p>
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
