import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Shield, Users, TrendingUp, Clock, Target } from 'lucide-react';

export default function WhyUs() {
  const usps = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description:
        'Built on Internet Computer blockchain, providing unparalleled security and transparency for all transactions.',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description:
        'Our team combines decades of real estate experience with cutting-edge blockchain expertise.',
    },
    {
      icon: TrendingUp,
      title: 'Proven Track Record',
      description:
        'Consistent returns and satisfied investors demonstrate our commitment to excellence.',
    },
    {
      icon: Clock,
      title: 'Quick & Easy',
      description:
        'Simple onboarding process and intuitive platform make investing in real estate effortless.',
    },
    {
      icon: Target,
      title: 'Curated Properties',
      description:
        'Every property is carefully selected and vetted to ensure quality and investment potential.',
    },
    {
      icon: Award,
      title: 'Investor-Centric',
      description:
        'We prioritize investor interests with transparent operations and regular communication.',
    },
  ];

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Why Choose Us</h1>
          <p className="text-muted-foreground">What makes SECoin the best choice for property investment</p>
        </div>
      </div>

      <div className="mb-8">
        <Card className="border-2 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <p className="text-lg text-center">
              SECoin stands out in the property investment landscape by combining traditional real estate
              expertise with innovative blockchain technology, creating a secure, transparent, and accessible
              platform for all investors.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {usps.map((usp, index) => (
          <Card key={index} className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <usp.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{usp.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{usp.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle>Our Competitive Advantages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  ✓
                </div>
                <div>
                  <strong>Lower Fees:</strong> Blockchain technology reduces intermediary costs, passing savings to
                  investors.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  ✓
                </div>
                <div>
                  <strong>Global Access:</strong> Invest from anywhere in the world with just an internet connection.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  ✓
                </div>
                <div>
                  <strong>Real-Time Transparency:</strong> Track your investments and property performance in real-time.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  ✓
                </div>
                <div>
                  <strong>Community Support:</strong> Join a growing community of like-minded investors.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
