import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Trophy, Users, TrendingUp, DollarSign } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Trophy,
      title: 'Showcase Your Expertise',
      description: 'Create topics highlighting your skills and get recognized by the community through votes.',
    },
    {
      icon: Users,
      title: 'Build Your Network',
      description: 'Connect with professionals, share knowledge, and grow your professional network.',
    },
    {
      icon: TrendingUp,
      title: 'Climb the Leaderboard',
      description: 'Earn votes on your topics and rise through the ranks to become a top contributor.',
    },
    {
      icon: DollarSign,
      title: 'Earn Through Referrals',
      description: 'Invite others to join and earn rewards through our referral program.',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Showcase Your{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Professional Worth
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Join a community where your skills, expertise, and knowledge are valued. Create topics, earn votes, and
                climb the leaderboard while building your professional network.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate({ to: '/topics' })} className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/features' })}>
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero.jpg"
                alt="Professionals collaborating"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Your NetWorth?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A platform designed to help professionals showcase their expertise and earn recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/assets/generated/trophy.png"
                alt="Trophy"
                className="w-32 h-32 mx-auto lg:mx-0 mb-6"
              />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Compete and Win</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Create compelling topics about your expertise, earn votes from the community, and climb the global
                leaderboard. The more value you provide, the higher you rank.
              </p>
              <Button onClick={() => navigate({ to: '/leaderboard' })}>
                View Leaderboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">1</div>
                    <div>
                      <h4 className="font-semibold">Create Topics</h4>
                      <p className="text-sm text-muted-foreground">Share your expertise and insights</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">2</div>
                    <div>
                      <h4 className="font-semibold">Earn Votes</h4>
                      <p className="text-sm text-muted-foreground">Get recognized by the community</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">3</div>
                    <div>
                      <h4 className="font-semibold">Climb Rankings</h4>
                      <p className="text-sm text-muted-foreground">Rise to the top of the leaderboard</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Showcase Your Worth?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are building their reputation and earning recognition for their expertise.
          </p>
          <Button size="lg" onClick={() => navigate({ to: '/topics' })} className="group">
            Start Your Journey
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </div>
  );
}
