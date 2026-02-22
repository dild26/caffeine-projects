import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, TrendingUp, Users, Lock, Globe } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Every transaction is secured with Merkle root validation and cryptographic hashing for maximum security.',
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Real-time transaction processing with QRC-based payments for seamless user experience.',
    },
    {
      icon: TrendingUp,
      title: 'Multi-Level System',
      description: 'Unlimited transaction depth with automatic running balance calculations and validation.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a growing community of users benefiting from transparent, decentralized finance.',
    },
    {
      icon: Lock,
      title: 'Complete Transparency',
      description: 'Full audit trail with timestamp visibility for every transaction on the platform.',
    },
    {
      icon: Globe,
      title: 'Global Ready',
      description: 'Multi-currency support with automatic conversion between INR and USD.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Secoinfi ePay</h1>
          <p className="text-xl text-muted-foreground">
            Revolutionizing financial transactions with blockchain-inspired technology
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              Secoinfi ePay is a decentralized financial platform that combines the security of blockchain technology
              with the convenience of modern payment systems. We aim to provide a transparent, secure, and efficient
              way for users to manage their financial transactions.
            </p>
            <p>
              Our platform leverages advanced cryptographic techniques, including Merkle root validation, to ensure
              every transaction is secure and verifiable. With support for multi-level transaction processing and
              automatic balance calculations, we offer a superior alternative to traditional financial systems.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Why Choose Secoinfi ePay?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Security First</h3>
              <p className="text-sm text-muted-foreground">
                Built on the Internet Computer with blockchain-inspired security measures, ensuring your transactions
                are always safe and verifiable.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Transparent Operations</h3>
              <p className="text-sm text-muted-foreground">
                Every transaction is recorded with complete audit trails, timestamps, and validation status for
                maximum transparency.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">User-Centric Design</h3>
              <p className="text-sm text-muted-foreground">
                Intuitive interface with QRC scanning support, real-time updates, and comprehensive dashboard for
                easy financial management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Competitive Returns</h3>
              <p className="text-sm text-muted-foreground">
                Higher returns compared to traditional chit fund systems, with flexible subscription options and
                leaderboard rewards.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
