import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Eye, Heart, Users } from 'lucide-react';

export default function AboutUsPage() {
  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'We constantly push boundaries to deliver cutting-edge contract management solutions.',
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'We believe in open communication and transparent operations with our users.',
    },
    {
      icon: Heart,
      title: 'User-Centric',
      description: 'Every feature we build is designed with our users\' needs and feedback in mind.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We foster a collaborative environment for teams to work together seamlessly.',
    },
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', bio: 'Visionary leader with 15+ years in blockchain technology.' },
    { name: 'Michael Chen', role: 'CTO', bio: 'Expert in distributed systems and smart contract development.' },
    { name: 'Emily Rodriguez', role: 'Head of Product', bio: 'Product strategist focused on user experience and innovation.' },
    { name: 'David Kim', role: 'Lead Engineer', bio: 'Full-stack developer passionate about building scalable solutions.' },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">About E-Contracts</h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            We're on a mission to revolutionize contract management through blockchain technology, AI assistance, and innovative user experiences.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-border/50 shadow-2xl">
          <img 
            src="/assets/generated/about-us-hero.dim_800x400.png" 
            alt="About E-Contracts" 
            className="h-auto w-full"
          />
        </div>

        {/* Mission & Vision */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To empower businesses and individuals with secure, efficient, and accessible digital contract management solutions that leverage the power of blockchain technology and artificial intelligence.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/50">
            <CardHeader>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To become the world's leading platform for digital contracts, making contract management seamless, secure, and accessible to everyone, everywhere.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">Our Core Values</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="text-center transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="mx-auto mb-4 inline-flex rounded-lg bg-primary/10 p-4 text-primary">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">Meet Our Team</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Card key={index} className="text-center transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-primary">{member.role}</CardDescription>
                  <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Story */}
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-12">
          <h2 className="mb-6 text-center text-4xl font-bold">Our Story</h2>
          <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground">
            <p>
              E-Contracts was founded in 2023 with a simple yet powerful vision: to make contract management accessible, secure, and efficient for everyone. Our founders recognized the challenges businesses face with traditional paper contracts and centralized digital solutions.
            </p>
            <p>
              By combining blockchain technology with AI-powered features like voice commands and text-to-speech, we've created a platform that not only solves these challenges but also sets new standards for what contract management can be.
            </p>
            <p>
              Today, we serve thousands of users worldwide, helping them manage millions of contracts with confidence and ease. Our commitment to innovation, security, and user experience continues to drive everything we do.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
