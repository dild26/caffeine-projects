import { Card, CardContent } from '@/components/ui/card';

export default function AboutUs() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Building the future of business management on the Internet Computer
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden mb-8">
        <img src="/assets/generated/team-collaboration.png" alt="Team" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
          <div className="container">
            <h2 className="text-3xl font-bold mb-2">Our Mission</h2>
            <p className="text-lg text-muted-foreground">Empowering businesses with secure, scalable solutions</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3">Who We Are</h3>
            <p className="text-muted-foreground">
              SECOINFI is a comprehensive business management platform built on the Internet Computer blockchain. 
              We provide secure, scalable solutions for CRM, billing, and product management, enabling businesses 
              to operate efficiently in the decentralized web.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
            <p className="text-muted-foreground">
              We envision a future where businesses can manage their operations with complete transparency, 
              security, and control. By leveraging blockchain technology, we're creating tools that put 
              businesses in charge of their data and processes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3">Our Values</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Security and privacy first</li>
              <li>• User-centric design</li>
              <li>• Transparency and trust</li>
              <li>• Innovation and excellence</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3">Why Choose Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Built on Internet Computer</li>
              <li>• Multi-tenant architecture</li>
              <li>• Role-based access control</li>
              <li>• Comprehensive feature set</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
