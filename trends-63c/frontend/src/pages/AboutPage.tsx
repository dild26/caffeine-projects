import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaticPageLayout from '../components/StaticPageLayout';

export default function AboutPage() {
  return (
    <StaticPageLayout
      title="About Us"
      subtitle="Discover what makes latestTrends your go-to source for trending topics"
      icon={Info}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              latestTrends is dedicated to bringing you real-time insights into what's happening around the world.
              We aggregate data from multiple sources to identify emerging trends before they go mainstream.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Our platform uses advanced algorithms to analyze search trends, social media activity, and news
              coverage. We score topics based on recency, search volume, and cross-platform presence to surface
              the most relevant trends.
            </p>
            <ul>
              <li>Real-time data aggregation from multiple sources</li>
              <li>AI-powered content generation for each topic</li>
              <li>Interactive visualizations with polygon cards</li>
              <li>Hourly updates to keep content fresh</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              We believe in transparency, accuracy, and accessibility. Our goal is to democratize access to
              trending information and help people stay informed about what matters most.
            </p>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
