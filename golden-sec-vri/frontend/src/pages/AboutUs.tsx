import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Target, Users, Award } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Info className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">About Us</h1>
          <p className="text-muted-foreground">Learn more about SECoin and our mission</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              SECoin is revolutionizing property investment by making real estate accessible to everyone through
              fractional ownership. We believe that premium property investments should not be limited to the wealthy
              few, but should be available to all investors regardless of their capital.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Who We Are
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Founded by a team of real estate professionals and blockchain experts, SECoin combines traditional
              property investment expertise with cutting-edge technology. Our platform is built on the Internet
              Computer blockchain, ensuring security, transparency, and efficiency in every transaction.
            </p>
            <p>
              We are committed to democratizing real estate investment and creating opportunities for investors
              to build wealth through property ownership.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Our Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  1
                </span>
                <div>
                  <strong>Transparency:</strong> We believe in complete transparency in all our operations and
                  transactions.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  2
                </span>
                <div>
                  <strong>Accessibility:</strong> Making property investment accessible to everyone, regardless of
                  their investment size.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  3
                </span>
                <div>
                  <strong>Innovation:</strong> Leveraging blockchain technology to create a secure and efficient
                  investment platform.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  4
                </span>
                <div>
                  <strong>Community:</strong> Building a strong community of investors who support and learn from
                  each other.
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
