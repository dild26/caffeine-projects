import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function ProsOfEContracts() {
  const benefits = [
    'Instant execution and verification',
    'Reduced paperwork and administrative costs',
    'Enhanced security through blockchain technology',
    'Automated compliance and audit trails',
    'Global accessibility and 24/7 availability',
    'Immutable record keeping',
    'Faster dispute resolution',
    'Environmental sustainability',
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Pros of e-Contracts</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the advantages of digital contract management
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3">Cost Efficiency</h3>
            <p className="text-muted-foreground">
              Eliminate printing, shipping, and storage costs associated with traditional paper contracts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3">Speed & Convenience</h3>
            <p className="text-muted-foreground">
              Execute contracts in minutes instead of days, with instant delivery and signing capabilities.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3">Security & Trust</h3>
            <p className="text-muted-foreground">
              Blockchain-based verification ensures authenticity and prevents tampering or fraud.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
