import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaticPageLayout from '../components/StaticPageLayout';

export default function BlogPage() {
  return (
    <StaticPageLayout
      title="Blog"
      subtitle="Insights, updates, and stories about trending topics"
      icon={BookOpen}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Our Blog</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Stay informed with the latest insights on trending topics from around the world. Our blog covers
              technology, culture, business, and more.
            </p>
            <h3>What We Cover</h3>
            <ul>
              <li>Technology trends and innovations</li>
              <li>Cultural phenomena and social movements</li>
              <li>Business insights and market analysis</li>
              <li>Entertainment and media highlights</li>
            </ul>
            <p>
              Our team analyzes data from multiple sources to bring you comprehensive coverage of what's trending
              and why it matters.
            </p>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
