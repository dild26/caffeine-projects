import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaticPageLayout from '../components/StaticPageLayout';

export default function WhyPage() {
  return (
    <StaticPageLayout
      title="Why latestTrends?"
      subtitle="The reasons to choose our platform for trending insights"
      icon={Lightbulb}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Stay Ahead of the Curve</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              In today's fast-paced digital world, staying informed about trending topics is crucial. Whether
              you're a content creator, marketer, or simply curious, latestTrends helps you discover what's
              capturing attention before it becomes mainstream.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Save Time on Research</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Instead of manually checking multiple platforms and sources, get all trending topics in one place.
              Our AI-generated summaries provide quick insights, saving you hours of research time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data-Driven Decisions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Make informed decisions based on real trending data. Our scoring system considers recency, search
              volume, and cross-platform presence to identify truly significant trends.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Coverage</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              From AI breakthroughs to entertainment news, sports highlights to political developments, we cover
              trends across all major categories. Get a holistic view of what's happening globally.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Built on Modern Technology</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Powered by the Internet Computer blockchain, latestTrends offers a decentralized, secure, and
              scalable platform for trending topic discovery. Experience the future of web applications.
            </p>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
