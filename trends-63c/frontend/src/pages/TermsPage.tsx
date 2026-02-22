import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaticPageLayout from '../components/StaticPageLayout';

export default function TermsPage() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      subtitle="Legal information and usage guidelines"
      icon={FileText}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              By accessing and using latestTrends, you accept and agree to be bound by the terms and provision of
              this agreement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Use of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              latestTrends provides trending topic information for informational purposes. You agree to use the
              service only for lawful purposes and in accordance with these terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Content Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              While we strive for accuracy, the content on latestTrends is provided "as is" without warranties of
              any kind. We do not guarantee the accuracy, completeness, or timeliness of the information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              The service and its original content, features, and functionality are owned by latestTrends and are
              protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              In no event shall latestTrends be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of or inability to use the service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              We reserve the right to modify or replace these terms at any time. Continued use of the service after
              changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
