import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CreditCard, Users, Trophy, Hash, MessageSquare, TrendingUp, Gift } from 'lucide-react';

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: Users,
      title: 'User Profiles',
      description: 'Create comprehensive profiles showcasing your skills, experiences, qualifications, and unique selling points.',
      features: ['Detailed skill listings', 'Experience tracking', 'Qualification verification', 'Professional highlights'],
    },
    {
      icon: MessageSquare,
      title: 'Topic Creation',
      description: 'Share your expertise through topics that can be voted on and reacted to by the community.',
      features: ['Rich content creation', 'Upvote/downvote system', 'Emoji reactions', 'Engagement tracking'],
    },
    {
      icon: Hash,
      title: 'Hashtag Search',
      description: 'Discover topics and connect with professionals using intelligent hashtag extraction and search.',
      features: ['Automatic hashtag extraction', 'Keyword search', 'Topic categorization', 'Advanced filtering'],
    },
    {
      icon: Trophy,
      title: 'Global Leaderboard',
      description: 'Compete with professionals worldwide and climb the rankings based on your topic votes.',
      features: ['Real-time rankings', 'Vote tracking', 'Performance metrics', 'Achievement badges'],
    },
    {
      icon: Gift,
      title: 'Referral System',
      description: 'Earn rewards by inviting others to join the platform with your unique referral link.',
      features: ['Unique referral IDs', 'Earnings tracking', 'Payout management', 'Referral analytics'],
    },
    {
      icon: TrendingUp,
      title: 'Blog Platform',
      description: 'Engage in discussions and share long-form content with the community.',
      features: ['Article publishing', 'Community discussions', 'Content discovery', 'Author profiles'],
    },
  ];

  const paymentMethods = [
    { name: 'Stripe', description: 'Credit and debit card payments' },
    { name: 'PayPal', description: 'Secure online payments' },
    { name: 'UPI', description: 'Instant bank transfers (India)' },
    { name: 'Cryptocurrency', description: 'Bitcoin, Ethereum, and more' },
  ];

  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Platform Features</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover all the powerful features that make Your NetWorth the ultimate platform for professional networking
            and recognition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Payment Options</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We support multiple payment methods to make it easy for you to purchase votes, referrals, and subscription
              services. Minimum transaction: $0.50 per topic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((method, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <img
              src="/assets/generated/payment-methods.dim_800x400.png"
              alt="Payment Methods"
              className="rounded-lg shadow-lg mx-auto max-w-full"
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <Badge variant="outline" className="mb-4">
            Secure & Reliable
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Data Security</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All critical data including user profiles, referrals, and topics are securely stored on the Internet Computer
            blockchain with automatic backup and redundancy. Your data is safe, encrypted, and always accessible.
          </p>
        </div>
      </div>
    </div>
  );
}
