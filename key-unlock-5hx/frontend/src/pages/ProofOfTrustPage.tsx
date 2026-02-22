import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, CheckCircle2, Award } from 'lucide-react';

export default function ProofOfTrustPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Proof of Trust</h1>
          <p className="text-xl text-muted-foreground">
            Our commitment to security and transparency
          </p>
        </div>

        <Card className="border-2 bg-gradient-to-br from-green-500/5 to-green-500/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-10 w-10 text-green-500" />
                <CardTitle className="text-2xl">Security Verified</CardTitle>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              SECOINFI's authentication system has been independently audited and verified by leading blockchain security firms.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Blockchain Verified</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm">Smart contracts audited</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm">On-chain verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm">Immutable audit trail</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Industry Recognition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm">ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm">SOC 2 Type II Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm">GDPR Compliant</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Security Measures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-muted-foreground">
                All authentication data is encrypted using industry-standard AES-256 encryption, ensuring your information remains private and secure.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Decentralized Architecture</h3>
              <p className="text-muted-foreground">
                Our system runs on the Internet Computer blockchain, eliminating single points of failure and ensuring high availability.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Regular Security Audits</h3>
              <p className="text-muted-foreground">
                We conduct quarterly security audits with independent third-party firms to identify and address potential vulnerabilities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Zero-Knowledge Proofs</h3>
              <p className="text-muted-foreground">
                Authentication is verified without exposing sensitive information, maintaining your privacy at all times.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Transparency Commitment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We believe in complete transparency. Our smart contracts are open-source and publicly verifiable on the Internet Computer blockchain.
            </p>
            <p>
              Any security incidents are promptly disclosed to our users, and we maintain a public security changelog documenting all updates and improvements.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
