import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden rounded-3xl shadow-heritage">
        <img
          src="/hero-bg.jpg"
          alt="Traditional Kerala Cuisine"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            Sudeep Hotels
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl drop-shadow-md">
            Authentic Kerala Cuisine Since 1952
          </p>
          <div className="mt-8">
            <Badge variant="secondary" className="px-4 py-2 text-lg bg-primary text-primary-foreground border-none">
              A Legacy of Taste
            </Badge>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-serif font-bold text-foreground">
          {isAuthenticated && userProfile ? `Welcome back, ${userProfile.username}!` : 'Explore Our Heritage'}
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg">
          {isAuthenticated
            ? "Here's an overview of your tasks and operations."
            : 'Experience the rich culinary heritage of Kerala. Our recipes have been passed down through generations, ensuring every dish tells a story.'}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 pb-12">
        <Card className="overflow-hidden border-none shadow-heritage group cursor-pointer transition-transform hover:-translate-y-1">
          <div className="h-48 overflow-hidden">
            <img src="/dish-1.jpg" alt="Banana Chips" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          <CardHeader>
            <CardTitle className="font-serif">Authentic Starters</CardTitle>
            <CardDescription>Hand-crafted Kerala favorites</CardDescription>
          </CardHeader>
        </Card>

        <Card className="overflow-hidden border-none shadow-heritage group cursor-pointer transition-transform hover:-translate-y-1">
          <div className="h-48 overflow-hidden">
            <img src="/dish-2.jpg" alt="Fish Cutlet" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          <CardHeader>
            <CardTitle className="font-serif">Regional Specials</CardTitle>
            <CardDescription>Fresh from the backwaters</CardDescription>
          </CardHeader>
        </Card>

        <Card className="overflow-hidden border-none shadow-heritage group cursor-pointer transition-transform hover:-translate-y-1">
          <div className="h-48 overflow-hidden">
            <img src="/restaurant.jpg" alt="Restaurant Interior" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          <CardHeader>
            <CardTitle className="font-serif">Our Ambiance</CardTitle>
            <CardDescription>Traditional Malabar setting</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
