import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, FileText, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Terms & Privacy</h1>
        <p className="text-lg text-muted-foreground">
          Our commitment to compliance and data privacy
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Data Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Information We Collect</h3>
              <p>
                DomainHub collects minimal information necessary to provide our services. This includes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your Internet Identity principal (anonymous identifier)</li>
                <li>Your chosen display name</li>
                <li>Domain URLs you add to your collection</li>
                <li>Voting and interaction data (upvotes, downvotes, click counts)</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">How We Use Your Data</h3>
              <p>
                Your data is used exclusively to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide domain management functionality</li>
                <li>Calculate domain rankings based on community votes</li>
                <li>Enable import/export of your domain collections</li>
                <li>Maintain your user profile and preferences</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Data Storage & Security</h3>
              <p>
                All data is stored on the Internet Computer blockchain, providing:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Decentralized, tamper-proof storage</li>
                <li>No central point of failure</li>
                <li>Cryptographic security for all operations</li>
                <li>User-controlled access via Internet Identity</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Acceptable Use</h3>
              <p>
                By using DomainHub, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the service for legitimate domain management purposes</li>
                <li>Not upload malicious, illegal, or harmful content</li>
                <li>Respect the voting system and not manipulate rankings</li>
                <li>Not attempt to compromise the security of the platform</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">User Responsibilities</h3>
              <p>
                Users are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Maintaining the security of their Internet Identity</li>
                <li>The accuracy of domain URLs they add</li>
                <li>Backing up their data using export functionality</li>
                <li>Complying with applicable laws and regulations</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Service Availability</h3>
              <p>
                DomainHub is provided "as is" without warranties. We strive for high availability but cannot guarantee uninterrupted service. The platform runs on the Internet Computer blockchain, which provides inherent reliability and redundancy.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Compliance & Regulations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">GDPR Compliance</h3>
              <p>
                For users in the European Union, we comply with GDPR requirements:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Right to access your data (via export functionality)</li>
                <li>Right to data portability (JSON, CSV, Markdown exports)</li>
                <li>Right to erasure (contact administrators)</li>
                <li>Minimal data collection principles</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Data Retention</h3>
              <p>
                Domain data and user profiles are retained as long as your account is active. You can export and delete your data at any time. Voting data is aggregated and anonymized for ranking purposes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Questions or Concerns?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              If you have any questions about our privacy policy, terms of service, or compliance practices, please contact us through the Internet Computer community channels or submit an issue on our GitHub repository.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
