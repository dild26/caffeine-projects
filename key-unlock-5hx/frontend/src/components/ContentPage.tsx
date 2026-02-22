import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, HelpCircle, Shield, Users, Award, TrendingUp, Target, Zap, Map } from 'lucide-react';

interface ContentPageProps {
  page: string;
}

export default function ContentPage({ page }: ContentPageProps) {
  const getPageContent = () => {
    switch (page) {
      case '/blog':
        return {
          icon: FileText,
          title: 'Blog',
          description: 'Latest news, updates, and insights from MOAP',
          content: 'Stay tuned for our latest articles, platform updates, and industry insights. We regularly share content about platform development, technology trends, and best practices for managing large-scale web applications.',
        };
      case '/about-us':
        return {
          icon: Users,
          title: 'About Us',
          description: 'Learn more about SECOINFI / Sudha Enterprises',
          content: 'SECOINFI / Sudha Enterprises (PIN 560097) is a pioneering technology company dedicated to creating comprehensive platform solutions. We legally explore and unify the best features from the world\'s top 26 global domains to create a high-performance, scalable, modular platform that serves billions of users with on-demand products and services.',
        };
      case '/pros-of-secoin':
        return {
          icon: Award,
          title: 'Pros of SECoin',
          description: 'Discover the advantages of our platform',
          content: 'SECoin offers unparalleled advantages including: unified platform architecture, legal exploration of top global domains, modular and scalable design, billion-user capacity, comprehensive feature integration, advanced security and privacy, optimized performance, and future-ready technology stack.',
        };
      case '/what-we-do':
        return {
          icon: Target,
          title: 'What We Do',
          description: 'Our services and solutions',
          content: 'We provide comprehensive platform management solutions that unify the best features from the world\'s leading domains. Our services include: platform architecture design, modular system development, scalability optimization, security implementation, feature integration, performance tuning, and ongoing platform maintenance.',
        };
      case '/why-us':
        return {
          icon: Zap,
          title: 'Why Us',
          description: 'Why choose MOAP platform',
          content: 'Choose MOAP for: legal exploration and unification of top 26 global domains, proven scalability for billions of users, modular and resilient architecture, comprehensive feature set, cutting-edge technology stack, expert team with deep industry knowledge, and commitment to innovation and excellence.',
        };
      case '/faq':
        return {
          icon: HelpCircle,
          title: 'FAQ',
          description: 'Frequently Asked Questions',
          content: 'Find answers to common questions about MOAP platform, including: What is MOAP? How does it work? What domains are included? How scalable is the platform? What security measures are in place? How can I get started? Contact us for specific questions not covered here.',
        };
      case '/terms-conditions':
        return {
          icon: Shield,
          title: 'Terms & Conditions',
          description: 'Legal terms and conditions',
          content: 'By using MOAP platform, you agree to our terms and conditions. These include: acceptable use policies, intellectual property rights, privacy and data protection, service availability, limitation of liability, and dispute resolution. Please read carefully before using our services.',
        };
      case '/referral':
        return {
          icon: Users,
          title: 'Referral Program',
          description: 'Refer and earn rewards',
          content: 'Join our referral program and earn rewards for bringing new users to MOAP platform. Share your unique referral link, help others discover our comprehensive platform solutions, and receive benefits for successful referrals. Contact us to learn more about our referral program.',
        };
      case '/proof-of-trust':
        return {
          icon: Award,
          title: 'Proof of Trust',
          description: 'Our credentials and testimonials',
          content: 'MOAP platform is built on trust and excellence. We maintain the highest standards of security, privacy, and performance. Our platform legally explores and unifies features from the world\'s top 26 domains, demonstrating our commitment to innovation and quality. Contact us for references and case studies.',
        };
      case '/sitemap':
        return {
          icon: Map,
          title: 'Sitemap',
          description: 'Navigate our platform',
          content: 'Complete site structure: Home, Dashboard (Admin), Features (Admin), Blog, About Us, Pros of SECoin, What We Do, Why Us, Contact Us, FAQ, Terms & Conditions, Referral, Proof of Trust, and Sitemap. Explore all sections to learn more about MOAP platform.',
        };
      default:
        return {
          icon: FileText,
          title: 'Page Not Found',
          description: 'The requested page could not be found',
          content: 'Please use the navigation menu to find what you\'re looking for.',
        };
    }
  };

  const pageContent = getPageContent();
  const Icon = pageContent.icon;

  return (
    <div className="space-y-6">
      <Card className="card-3d card-3d-hover border-4 border-primary/30">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4">
            <Icon className="w-16 h-16 text-primary mx-auto animate-pulse-glow" />
          </div>
          <CardTitle className="text-4xl font-bold text-gradient mb-4">{pageContent.title}</CardTitle>
          <CardDescription className="text-lg">{pageContent.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed text-center">{pageContent.content}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-3d card-3d-hover">
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              For more information or specific inquiries, please contact us.
            </p>
            <a
              href="/contact-us"
              className="text-primary hover:text-accent transition-colors font-semibold hover:underline"
            >
              Visit our Contact Us page →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
