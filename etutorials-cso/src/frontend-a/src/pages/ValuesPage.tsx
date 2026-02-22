import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Heart, Users, Shield, Zap, Target, Globe } from 'lucide-react';

export default function ValuesPage() {
  const values = [
    {
      icon: Heart,
      title: 'Learner-Centered',
      description: 'Every decision we make prioritizes the learning experience and student success.',
      details: [
        'Intuitive interfaces that reduce cognitive load',
        'Personalized learning paths and progress tracking',
        'Responsive support and continuous improvement',
        'Accessible design for all learners',
      ],
    },
    {
      icon: Users,
      title: 'Community-Driven',
      description: 'We believe in the power of collaborative learning and knowledge sharing.',
      details: [
        'Connect learners with expert instructors',
        'Foster peer-to-peer learning opportunities',
        'Build a supportive educational community',
        'Encourage feedback and participation',
      ],
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data and privacy are protected with blockchain-based security.',
      details: [
        'Decentralized storage on Internet Computer',
        'Role-based access control for data protection',
        'Transparent operations and clear policies',
        'Secure authentication with Internet Identity',
      ],
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to enhance educational outcomes.',
      details: [
        'Blockchain-based platform for reliability',
        'Smart scheduling with optimization algorithms',
        'Real-time synchronization and updates',
        'Continuous feature development',
      ],
    },
    {
      icon: Target,
      title: 'Quality Excellence',
      description: 'We maintain high standards for content, instructors, and user experience.',
      details: [
        'Admin verification for all resources',
        'Qualified instructor network',
        'Regular quality assessments',
        'Commitment to continuous improvement',
      ],
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Education should be accessible to everyone, everywhere.',
      details: [
        'Platform available 24/7 worldwide',
        'Multi-language support',
        'Responsive design for all devices',
        'Affordable pricing and fee transparency',
      ],
    },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Heart className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Our Values</h1>
        <p className="text-xl text-muted-foreground">
          The principles that guide everything we do at E-Tutorial.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>
              Empowering learners through accessible, quality education
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              E-Tutorial exists to democratize access to quality education by connecting learners with expert instructors 
              and curated resources. We leverage blockchain technology to create a transparent, secure, and efficient 
              learning platform that serves students worldwide.
            </p>
          </CardContent>
        </Card>

        {values.map((value) => {
          const Icon = value.icon;
          return (
            <Card key={value.title}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{value.title}</CardTitle>
                    <CardDescription>{value.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {value.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardHeader>
            <CardTitle>Our Commitment</CardTitle>
            <CardDescription>
              What you can expect from us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We are committed to maintaining these values in every aspect of our platform and operations:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Transparency</h4>
                <p className="text-sm text-muted-foreground">
                  Clear communication about features, pricing, and policies. No hidden fees or surprises.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Responsiveness</h4>
                <p className="text-sm text-muted-foreground">
                  Quick response to user feedback and continuous platform improvements based on your needs.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Reliability</h4>
                <p className="text-sm text-muted-foreground">
                  Stable, secure platform built on blockchain technology for consistent uptime and performance.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Inclusivity</h4>
                <p className="text-sm text-muted-foreground">
                  Welcoming environment for learners of all backgrounds, abilities, and experience levels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Join Our Community</CardTitle>
            <CardDescription>
              Be part of a global learning movement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Whether you're a learner seeking knowledge or an instructor ready to share expertise, E-Tutorial 
              welcomes you. Together, we're building a better future through education.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
