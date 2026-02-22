import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaticPageLayout from '../components/StaticPageLayout';

export default function TrustPage() {
  return (
    <StaticPageLayout
      title="Trust & Safety"
      subtitle="Our commitment to data integrity and user privacy"
      icon={Shield}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Integrity</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              We take data accuracy seriously. Our trending topics are derived from multiple verified sources, and
              each topic includes source links for transparency and verification.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Protection</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              We respect your privacy. latestTrends does not require registration, and we do not collect personal
              information beyond what's necessary for the service to function.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Moderation</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              All topics undergo automated moderation with approval and confidence scores. We filter out
              inappropriate content and ensure topics meet quality standards before publication.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blockchain Security</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Built on the Internet Computer blockchain, latestTrends benefits from decentralized security. Each
              topic includes hash identifiers and Merkle roots for data integrity verification.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transparency</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              We believe in transparency. Our methodology is open, our sources are cited, and our scoring system is
              clearly explained. You can verify any information through the provided source links.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Continuous Improvement</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              We continuously monitor and improve our systems to ensure the highest standards of trust and safety.
              If you notice any issues, please contact us immediately.
            </p>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
