import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, Heart, Sparkles } from 'lucide-react';

export default function WhyUsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Why Choose Us</h1>
          <p className="text-xl text-muted-foreground">
            The reasons that make SECOINFI stand out
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Industry Leadership</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We're pioneers in blockchain-based authentication, with years of experience building secure, scalable identity solutions on the Internet Computer.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Proven Track Record</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our authentication system has successfully protected millions of user identities across various platforms, with zero major security breaches.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Heart className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">User-Centric Design</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Every feature we build prioritizes user experience and privacy, ensuring that security never comes at the cost of usability.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Continuous Innovation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We're constantly evolving our technology to stay ahead of emerging threats and provide cutting-edge authentication solutions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
