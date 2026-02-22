import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Layers, 
  Globe, 
  Zap, 
  Shield, 
  DollarSign, 
  Rocket, 
  Users, 
  Target,
  Award,
  BarChart,
  Lock,
  CheckCircle,
  Star,
  Sparkles,
  ExternalLink,
  UserPlus,
  Send,
  Handshake
} from 'lucide-react';
import { InvestorOutreachDialog } from './InvestorOutreachForm';

export default function AngelVCPage() {
  const [activeDialog, setActiveDialog] = useState<'join' | 'demo' | 'meet' | null>(null);

  const sections = [
    {
      id: 'category-breakthrough',
      title: 'Category Breakthrough',
      icon: Sparkles,
      content: 'MOAP unifies 26 of the world\'s most successful digital domains into a single, modular super-platform. This unprecedented integration creates a new category of platform that combines e-commerce, social media, cloud services, fintech, and more into one cohesive ecosystem.',
      anchor: 'category-breakthrough'
    },
    {
      id: 'massive-tam',
      title: 'Massive TAM',
      icon: Globe,
      content: 'By combining 26 major digital domains, MOAP addresses a multi-trillion-dollar cross-domain market. Each domain represents billions in market value, and our unified approach captures value across all of them simultaneously.',
      anchor: 'massive-tam'
    },
    {
      id: 'modular-architecture',
      title: 'Modular Architecture',
      icon: Layers,
      content: 'Our plug-and-play modular design allows domains to share AI, wallet, analytics, and other core services. This architecture reduces development costs, accelerates time-to-market, and ensures consistent quality across all modules.',
      anchor: 'modular-architecture'
    },
    {
      id: 'market-leadership',
      title: 'Market Leadership',
      icon: Award,
      content: 'MOAP positions itself as the "Mother of All Platforms" - comparable to how AWS unified cloud services, Google unified search and advertising, and Shopify unified e-commerce. We\'re creating the operating system for the digital economy.',
      anchor: 'market-leadership'
    },
    {
      id: 'ai-native',
      title: 'AI-Native from Day One',
      icon: Zap,
      content: 'Built with integrated AI automation and cross-sector intelligence from the ground up. Our AI systems learn from user behavior across all 26 domains, creating unprecedented insights and automation capabilities.',
      anchor: 'ai-native'
    },
    {
      id: 'competitive-moat',
      title: 'Competitive Moat',
      icon: Shield,
      content: 'Our data advantage spans 26 domains, creating massive switching costs and ecosystem lock-in. The more domains a user engages with, the more valuable the platform becomes, creating a powerful network effect.',
      anchor: 'competitive-moat'
    },
    {
      id: 'revenue-stack',
      title: 'Revenue Stack',
      icon: DollarSign,
      content: '7+ monetization models including: SaaS subscriptions, transaction fees, advertising, data analytics, API access, white-label licensing, and enterprise solutions. Multiple revenue streams reduce risk and maximize growth potential.',
      anchor: 'revenue-stack'
    },
    {
      id: 'scalability-blueprint',
      title: 'Scalability Blueprint',
      icon: TrendingUp,
      content: 'Modular microservices architecture enables global scale. Each domain can scale independently while sharing core infrastructure, allowing us to serve billions of users efficiently.',
      anchor: 'scalability-blueprint'
    },
    {
      id: 'plug-in-system',
      title: 'Plug-in System',
      icon: Target,
      content: 'Third-party developers can build on our platform and participate in revenue sharing. This creates an ecosystem effect similar to Apple\'s App Store or Salesforce\'s AppExchange.',
      anchor: 'plug-in-system'
    },
    {
      id: 'distribution-strategy',
      title: 'Distribution Strategy',
      icon: Rocket,
      content: 'Multi-channel approach: SaaS for direct customers, APIs for developers, white-label for enterprises, and franchise model for regional expansion. Each channel reinforces the others.',
      anchor: 'distribution-strategy'
    },
    {
      id: 'investor-narrative',
      title: 'Investor Narrative',
      icon: BarChart,
      content: '"MOAP combines entire digital economies into one platform." This simple, powerful narrative resonates with investors looking for the next platform giant. We\'re not just another app - we\'re the infrastructure for the digital future.',
      anchor: 'investor-narrative'
    },
    {
      id: 'defensibility',
      title: 'Defensibility',
      icon: Lock,
      content: 'Built on blockchain for transparency, modular schema for flexibility, and comprehensive auditability. Our technical architecture creates multiple layers of competitive advantage.',
      anchor: 'defensibility'
    },
    {
      id: 'traction-readiness',
      title: 'Traction-Readiness',
      icon: CheckCircle,
      content: '26 modules already developed and live MOAP ecosystem proof. We\'re not just a concept - we have working technology and real users demonstrating product-market fit.',
      anchor: 'traction-readiness'
    },
    {
      id: 'secoinfi-advantage',
      title: 'SECOINFI Advantage',
      icon: Star,
      content: 'Founded by experienced entrepreneurs with deep expertise in platform development, blockchain technology, and digital ecosystems. Our team has the vision and execution capability to build the next platform giant.',
      anchor: 'secoinfi-advantage'
    },
    {
      id: 'investor-angles',
      title: 'Investor-Specific Angles',
      icon: Users,
      content: 'For Angels: Early entry into a category-defining platform with massive upside potential. For VCs: Proven traction, clear path to scale, and multiple exit opportunities through strategic acquisitions or IPO.',
      anchor: 'investor-angles'
    },
    {
      id: 'global-visibility',
      title: 'Global Visibility',
      icon: Globe,
      content: 'Perfect positioning for Web Summit, TechCrunch, and other major tech events. Our unified platform story generates media attention and attracts top-tier investors and partners.',
      anchor: 'global-visibility'
    },
    {
      id: 'viral-positioning',
      title: 'Viral Positioning',
      icon: Sparkles,
      content: 'MOAP as a universal, memorable brand - "Mother of All Platforms" creates instant recognition and word-of-mouth marketing. The name itself tells the story.',
      anchor: 'viral-positioning'
    },
    {
      id: 'future-proof',
      title: 'Future-Proof Factors',
      icon: Zap,
      content: 'AI-native architecture, extensible design, and cloud-distributed infrastructure ensure we stay ahead of technology trends. Built for the next decade of digital innovation.',
      anchor: 'future-proof'
    },
    {
      id: 'growth-path',
      title: 'Growth Path',
      icon: TrendingUp,
      content: 'Cross-domain onboarding strategy targets 100M+ users. Each domain serves as an entry point, with natural progression to other domains creating exponential growth.',
      anchor: 'growth-path'
    },
    {
      id: 'ultimate-pitch',
      title: 'Ultimate Pitch Line',
      icon: Rocket,
      content: '"MOAP is the operating system for the post-AI economy." This positions us as essential infrastructure for the future, not just another application or service.',
      anchor: 'ultimate-pitch'
    }
  ];

  const scrollToSection = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="card-3d border-4 border-primary/30 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 animate-gradient" />
          <img 
            src="/assets/generated/angel-vc-hero-banner.dim_1024x400.png" 
            alt="Angel VC Investment Opportunities"
            className="w-full h-64 object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <Badge className="mb-4 text-lg px-6 py-2 neon-glow">
              <img 
                src="/assets/generated/investment-opportunity-icon-transparent.dim_64x64.png" 
                alt="Investment"
                className="w-6 h-6 inline mr-2"
              />
              Investment Opportunity
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-4 animate-float">
              Angel / VC Investment Opportunities List
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mb-6">
              World's Top 26 Digital Domains Unified Into One Future-Proof Platform by SECOINFI
            </p>
            <a 
              href="https://map-56b.caffeine.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-semibold text-lg hover:underline"
            >
              Explore MOAP Platform
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </Card>

      {/* Interactive Investor Outreach Section */}
      <Card className="card-3d border-4 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gradient mb-4">
            Investor Outreach System
          </CardTitle>
          <CardDescription className="text-lg">
            Connect with us to explore investment opportunities in MOAP's 26-domain global platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-3d card-3d-hover border-2 border-primary/20">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 neon-glow">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-center text-xl">Join Now</CardTitle>
                <CardDescription className="text-center">
                  Become an investor in the future of digital platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => setActiveDialog('join')}
                  className="w-full neon-glow"
                  size="lg"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join as Investor
                </Button>
              </CardContent>
            </Card>

            <Card className="card-3d card-3d-hover border-2 border-accent/20">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 neon-glow">
                  <Send className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-center text-xl">Request Demo</CardTitle>
                <CardDescription className="text-center">
                  See MOAP's AI-native modularity and cross-domain scalability
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => setActiveDialog('demo')}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Request Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="card-3d card-3d-hover border-2 border-secondary/20">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 neon-glow">
                  <Handshake className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-center text-xl">Meet the Founders</CardTitle>
                <CardDescription className="text-center">
                  Connect directly with the SECOINFI founding team
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => setActiveDialog('meet')}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Handshake className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <Badge variant="outline" className="text-sm">
              All investor inquiries receive a response within 24-48 hours
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <Card className="card-3d card-3d-hover">
        <CardHeader>
          <CardTitle className="text-2xl">Quick Navigation</CardTitle>
          <CardDescription>Jump to any section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant="outline"
                size="sm"
                onClick={() => scrollToSection(section.anchor)}
                className="justify-start text-left h-auto py-2"
              >
                <section.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{section.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card 
              key={section.id} 
              id={section.anchor}
              className="card-3d card-3d-hover scroll-mt-24"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 neon-glow">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {String(index + 1).padStart(2, '0')}
                      </Badge>
                      <CardTitle className="text-2xl text-gradient">
                        {section.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {section.content}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Separator className="my-8" />

      {/* Call to Action Section */}
      <Card className="card-3d border-4 border-accent/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gradient mb-4">
            Ready to Invest in the Future?
          </CardTitle>
          <CardDescription className="text-lg">
            Take the next step in your investment journey with MOAP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setActiveDialog('join')}
              size="lg"
              className="h-auto py-6 flex flex-col items-center gap-3 neon-glow"
            >
              <img 
                src="/assets/generated/join-now-button-transparent.dim_200x60.png" 
                alt="Join Now"
                className="w-12 h-12"
              />
              <span className="font-semibold text-lg">Join Now</span>
            </Button>

            <Button
              onClick={() => setActiveDialog('demo')}
              variant="outline"
              size="lg"
              className="h-auto py-6 flex flex-col items-center gap-3"
            >
              <img 
                src="/assets/generated/request-demo-button-transparent.dim_200x60.png" 
                alt="Request Demo"
                className="w-12 h-12"
              />
              <span className="font-semibold text-lg">Request Demo</span>
            </Button>

            <Button
              onClick={() => setActiveDialog('meet')}
              variant="outline"
              size="lg"
              className="h-auto py-6 flex flex-col items-center gap-3"
            >
              <img 
                src="/assets/generated/meet-founders-button-transparent.dim_200x60.png" 
                alt="Meet Founders"
                className="w-12 h-12"
              />
              <span className="font-semibold text-lg">Meet the Founders</span>
            </Button>
          </div>

          <Separator />

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              For immediate inquiries and detailed information
            </p>
            <a 
              href="https://map-56b.caffeine.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold text-lg hover:shadow-neon transition-all duration-300 hover:scale-105"
            >
              Visit MOAP Platform
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <Card className="card-3d">
        <CardContent className="py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>MOAP (Mother Of All Platforms)</strong> is owned by SECOINFI / Sudha Enterprises (PIN 560097)
            </p>
            <p>
              This platform legally explores and unifies the pros, USPs, functionalities, design, and business trends 
              of the top 26 global domains, creating a high-performance, modular platform that can serve billions of users.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Investor Outreach Dialogs */}
      {activeDialog && (
        <InvestorOutreachDialog
          type={activeDialog}
          isOpen={!!activeDialog}
          onClose={() => setActiveDialog(null)}
        />
      )}
    </div>
  );
}
