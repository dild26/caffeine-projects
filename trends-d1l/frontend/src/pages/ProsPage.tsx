import { ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaticPageLayout from '../components/StaticPageLayout';

export default function ProsPage() {
  return (
    <StaticPageLayout
      title="Advantages"
      subtitle="Why choose latestTrends for your trending topic insights"
      icon={ThumbsUp}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Get hourly updates on trending topics. Our system continuously monitors multiple data sources to
              ensure you're always seeing the latest trends.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Each topic includes auto-generated content with comprehensive analysis, helping you understand not
              just what's trending, but why it matters.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interactive Visualizations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our unique polygon card design makes browsing trends engaging and intuitive. The shape and
              animations reflect each topic's trending score.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cross-Platform Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We aggregate data from search engines, social media, news outlets, and more to give you a
              comprehensive view of what's trending everywhere.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Easy Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Browse by category, search for specific topics, or explore our curated collections. Finding
              relevant trends has never been easier.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>No Registration Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access all trending topics instantly without creating an account. We believe trending information
              should be freely accessible to everyone.
            </p>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
