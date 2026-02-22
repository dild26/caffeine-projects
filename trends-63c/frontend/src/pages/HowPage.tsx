import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaticPageLayout from '../components/StaticPageLayout';

export default function HowPage() {
  return (
    <StaticPageLayout
      title="How It Works"
      subtitle="Understanding the technology behind latestTrends"
      icon={Settings}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Data Aggregation</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Our system simulates data ingestion from multiple sources including search engines, social media
              platforms, and news outlets. We analyze patterns to identify emerging trends in real-time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Trend Scoring</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Each topic receives a score based on three key factors:
            </p>
            <ul>
              <li>
                <strong>Recency:</strong> How recently the topic started trending
              </li>
              <li>
                <strong>Search Volume:</strong> The number of searches and mentions
              </li>
              <li>
                <strong>Cross-Platform Presence:</strong> How widely the topic is discussed across different
                platforms
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. AI Content Generation</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              For each trending topic, our AI generates comprehensive content including:
            </p>
            <ul>
              <li>Overview and definition (60-110 words)</li>
              <li>Why it's trending now (60-110 words)</li>
              <li>Key facts and data points (60-110 words)</li>
              <li>Future outlook and implications (60-110 words)</li>
            </ul>
            <p>Each paragraph includes 1-3 source links for verification and deeper research.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Visual Representation</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Topics are displayed as interactive polygon cards. The number of vertices (3-12) corresponds to the
              topic's trending score, creating a unique visual signature for each trend.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Continuous Updates</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              The system refreshes hourly, rotating out older topics and adding new ones. This ensures you always
              see the most current trends without information overload.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. User Interaction</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Browse topics by category, click for detailed views, explore related queries, and access source
              links. The interface is designed for intuitive exploration and discovery.
            </p>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
