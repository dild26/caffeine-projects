import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award, Heart } from 'lucide-react';

export default function AboutUsPage() {
  const values = [
    {
      icon: Users,
      title: 'Customer First',
      description: 'We prioritize our customers needs and satisfaction above all else.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly evolving with cutting-edge technology and solutions.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality in everything we do.',
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'Building trust through transparency and ethical practices.',
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We are dedicated to revolutionizing contract management through innovative technology
          and exceptional service.
        </p>
      </div>

      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">
              To provide a comprehensive, secure, and user-friendly platform for managing
              e-contracts that empowers businesses and individuals to streamline their
              document workflows.
            </p>
            <p>
              We leverage blockchain technology, advanced file processing, and real-time
              analytics to deliver a solution that meets the evolving needs of modern
              contract management.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Our Story</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Founded with a vision to transform the way contracts are created, managed, and
            executed, our platform combines cutting-edge technology with intuitive design.
            We continue to innovate and expand our capabilities to serve our growing
            community of users worldwide.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
