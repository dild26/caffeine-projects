import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, CheckCircle2, Server } from 'lucide-react';

export default function Trust() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <img
          src="/assets/generated/trust-badge-transparent.dim_80x80.png"
          alt="Trust Badge"
          className="h-20 w-20 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-4">Trust & Security</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your security and privacy are our top priorities
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <Shield className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Blockchain Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Built on the Internet Computer blockchain, our platform leverages cutting-edge cryptography and
              distributed consensus to ensure your data is secure and tamper-proof.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Decentralized architecture
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Cryptographic verification
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Immutable audit logs
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Lock className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Data Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We take your privacy seriously. Your personal information and workflow data are encrypted and stored
              securely.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                End-to-end encryption
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                No third-party data sharing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                GDPR compliant
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Server className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Infrastructure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our platform runs on the Internet Computer, providing unparalleled reliability and performance.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                99.9% uptime guarantee
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Global CDN distribution
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Automatic backups
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <img
              src="/assets/generated/stripe-icon-transparent.dim_64x64.png"
              alt="Stripe"
              className="h-12 w-12 mb-4"
            />
            <CardTitle>Secure Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              All payments are processed through industry-leading payment providers with bank-level security.
            </p>
            <div className="flex gap-4 items-center">
              <img src="/assets/generated/stripe-icon-transparent.dim_64x64.png" alt="Stripe" className="h-8" />
              <img src="/assets/generated/payu-logo-transparent.dim_64x64.png" alt="PayU" className="h-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Security Certifications</h2>
        <p className="text-muted-foreground mb-4">
          We maintain the highest security standards and regularly undergo third-party security audits to ensure your
          data is protected.
        </p>
        <p className="text-muted-foreground">
          For security concerns or to report vulnerabilities, please contact:{' '}
          <a href="mailto:security@secoinfi.com" className="text-primary hover:underline">
            security@secoinfi.com
          </a>
        </p>
      </div>
    </div>
  );
}
