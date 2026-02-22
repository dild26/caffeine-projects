import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Eye, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="text-xl text-muted-foreground">
            Building the future of secure digital identity
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              SECOINFI is at the forefront of decentralized authentication technology, leveraging the power of the Internet Computer blockchain to provide secure, private, and user-controlled identity management.
            </p>
            <p>
              Founded with the vision of eliminating password-based vulnerabilities and centralized identity control, we're building a future where users truly own their digital identities.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide secure, decentralized authentication solutions that empower users with complete control over their digital identities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Eye className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A world where digital identity is secure, private, and truly owned by individuals, not corporations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Security, privacy, transparency, and user empowerment guide everything we do.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
