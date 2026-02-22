import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp, Shield, DollarSign, Users, Clock, BarChart,
  CheckCircle2, Zap, Globe, Lock, Award, Target,
  Sparkles, TrendingDown, PieChart, Wallet, Building2,
  FileCheck, Handshake, Scale, Briefcase, LineChart,
  BadgeCheck, Coins, RefreshCw, ShieldCheck, UserCheck,
  FileText, Calculator, BarChart3, Landmark, Home,
  Percent, ArrowUpRight, Eye, Layers, Settings,
  Star, Trophy, Gem
} from 'lucide-react';

export default function ProsOfSECoin() {
  const pros = [
    {
      icon: DollarSign,
      title: 'Low Entry Barrier',
      description: 'Start investing in premium properties with fractional ownership. No need for large capital to enter the real estate market.',
      highlight: true,
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Built on Internet Computer blockchain, ensuring maximum security, transparency, and immutability of all transactions.',
      highlight: true,
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Price Updates',
      description: 'Get instant price updates and market insights. Stay informed about your investments with real-time data.',
      highlight: false,
    },
    {
      icon: Users,
      title: 'Fractional Ownership',
      description: 'Own a portion of premium properties and benefit from rental income and property appreciation proportional to your stake.',
      highlight: true,
    },
    {
      icon: Clock,
      title: 'Enhanced Liquidity',
      description: 'Unlike traditional real estate, fractional ownership provides better liquidity options for your investments.',
      highlight: false,
    },
    {
      icon: BarChart,
      title: 'Portfolio Diversification',
      description: 'Spread your investment across multiple properties to reduce risk and maximize potential returns.',
      highlight: false,
    },
    {
      icon: CheckCircle2,
      title: 'Verified Properties',
      description: 'All properties are thoroughly vetted and verified before being listed on the platform.',
      highlight: false,
    },
    {
      icon: Zap,
      title: 'Instant Transactions',
      description: 'Execute property transactions instantly with blockchain technology, eliminating lengthy paperwork.',
      highlight: true,
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Invest in properties from anywhere in the world, breaking geographical barriers.',
      highlight: false,
    },
    {
      icon: Lock,
      title: 'Immutable Records',
      description: 'All ownership records are permanently stored on the blockchain, preventing fraud and disputes.',
      highlight: false,
    },
    {
      icon: Award,
      title: 'Professional Management',
      description: 'Properties are managed by experienced professionals, ensuring optimal returns and maintenance.',
      highlight: false,
    },
    {
      icon: Target,
      title: 'Targeted Investment',
      description: 'Choose specific properties that align with your investment goals and risk appetite.',
      highlight: false,
    },
    {
      icon: Sparkles,
      title: 'Premium Properties',
      description: 'Access to high-quality, premium real estate that was previously available only to institutional investors.',
      highlight: true,
    },
    {
      icon: TrendingDown,
      title: 'Lower Transaction Costs',
      description: 'Reduced fees and commissions compared to traditional real estate transactions.',
      highlight: false,
    },
    {
      icon: PieChart,
      title: 'Transparent Analytics',
      description: 'Comprehensive analytics and reporting tools to track your investment performance.',
      highlight: false,
    },
    {
      icon: Wallet,
      title: 'Digital Wallet Integration',
      description: 'Seamlessly manage your investments through secure digital wallet integration.',
      highlight: false,
    },
    {
      icon: Building2,
      title: 'Commercial & Residential',
      description: 'Invest in both commercial and residential properties to diversify your portfolio.',
      highlight: false,
    },
    {
      icon: FileCheck,
      title: 'Legal Compliance',
      description: 'All transactions are fully compliant with local and international real estate regulations.',
      highlight: false,
    },
    {
      icon: Handshake,
      title: 'Community Driven',
      description: 'Join a community of like-minded investors and share insights and strategies.',
      highlight: false,
    },
    {
      icon: Scale,
      title: 'Fair Valuation',
      description: 'Properties are valued fairly using advanced algorithms and market data analysis.',
      highlight: false,
    },
    {
      icon: Briefcase,
      title: 'Passive Income',
      description: 'Earn regular rental income without the hassles of property management.',
      highlight: true,
    },
    {
      icon: LineChart,
      title: 'Capital Appreciation',
      description: 'Benefit from long-term property value appreciation in prime locations.',
      highlight: false,
    },
    {
      icon: BadgeCheck,
      title: 'KYC Verified',
      description: 'All investors undergo thorough KYC verification for a secure investment environment.',
      highlight: false,
    },
    {
      icon: Coins,
      title: 'Tokenized Assets',
      description: 'Properties are tokenized, making them easily tradeable and divisible.',
      highlight: false,
    },
    {
      icon: RefreshCw,
      title: 'Easy Exit Strategy',
      description: 'Sell your fractional ownership anytime through the secondary market.',
      highlight: false,
    },
    {
      icon: ShieldCheck,
      title: 'Insurance Protected',
      description: 'Properties are insured against damages and natural disasters.',
      highlight: false,
    },
    {
      icon: UserCheck,
      title: 'Investor Protection',
      description: 'Robust investor protection mechanisms and dispute resolution systems.',
      highlight: false,
    },
    {
      icon: FileText,
      title: 'Detailed Documentation',
      description: 'Access complete property documentation, legal papers, and ownership history.',
      highlight: false,
    },
    {
      icon: Calculator,
      title: 'ROI Calculator',
      description: 'Built-in tools to calculate potential returns and investment scenarios.',
      highlight: false,
    },
    {
      icon: BarChart3,
      title: 'Market Insights',
      description: 'Regular market reports and insights to help you make informed decisions.',
      highlight: false,
    },
    {
      icon: Landmark,
      title: 'Prime Locations',
      description: 'Properties located in high-growth areas with strong appreciation potential.',
      highlight: true,
    },
    {
      icon: Home,
      title: 'No Maintenance Hassles',
      description: 'Professional property management handles all maintenance and tenant issues.',
      highlight: false,
    },
    {
      icon: Percent,
      title: 'Competitive Returns',
      description: 'Attractive returns that often outperform traditional investment vehicles.',
      highlight: false,
    },
    {
      icon: ArrowUpRight,
      title: 'Growth Potential',
      description: 'Invest in emerging markets and high-growth corridors for maximum appreciation.',
      highlight: false,
    },
    {
      icon: Eye,
      title: 'Full Transparency',
      description: 'Complete visibility into property performance, expenses, and income distribution.',
      highlight: false,
    },
    {
      icon: Layers,
      title: 'Multi-Floor Options',
      description: 'Invest in specific floors or sections of properties based on your preference.',
      highlight: false,
    },
    {
      icon: Settings,
      title: 'Customizable Portfolio',
      description: 'Build and customize your property portfolio according to your investment strategy.',
      highlight: false,
    },
    {
      icon: Star,
      title: 'Premium Support',
      description: '24/7 customer support to assist with all your investment queries.',
      highlight: false,
    },
    {
      icon: Trophy,
      title: 'Award-Winning Platform',
      description: 'Recognized for innovation in real estate technology and blockchain integration.',
      highlight: false,
    },
  ];

  return (
    <div className="container px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Gem className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-foreground md:text-5xl">
          Pros of SECoin in Realty as it is Forever
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          Discover the revolutionary advantages of investing in real estate through SECoin's blockchain-powered platform
        </p>
      </div>

      {/* Introduction Card */}
      <div className="mb-12">
        <Card className="border-4 border-primary/20 shadow-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
          <CardContent className="pt-8 pb-8">
            <p className="text-xl text-center leading-relaxed">
              <span className="font-bold text-primary">SECoin</span> revolutionizes property investment by combining the{' '}
              <span className="font-semibold italic text-accent">stability of real estate</span> with the{' '}
              <span className="font-semibold italic text-primary">innovation of blockchain technology</span>, making premium
              property investments accessible to everyone, everywhere, forever.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pros Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pros.map((pro, index) => (
          <Card
            key={index}
            className={`border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${pro.highlight
                ? 'border-accent/50 bg-gradient-to-br from-accent/5 to-primary/5'
                : 'border-primary/20'
              }`}
          >
            <CardHeader>
              <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl shadow-md ${pro.highlight
                  ? 'bg-gradient-to-br from-accent to-accent/80'
                  : 'bg-gradient-to-br from-primary to-primary/80'
                }`}>
                <pro.icon className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="flex items-start gap-2">
                <span className={`text-lg ${pro.highlight ? 'text-accent' : ''}`}>
                  {pro.title}
                </span>
                {pro.highlight && (
                  <Sparkles className="h-5 w-5 text-accent flex-shrink-0" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pro.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <Card className="border-4 border-accent/30 shadow-2xl bg-gradient-to-br from-accent/10 to-primary/10">
          <CardContent className="pt-8 pb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Ready to Transform Your Real Estate Investment Journey?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of investors who are already benefiting from the future of property investment with SECoin.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
