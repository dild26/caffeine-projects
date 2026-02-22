import { HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaticPageLayout from '../components/StaticPageLayout';

export default function WhatPage() {
  return (
    <StaticPageLayout
      title="What is latestTrends?"
      subtitle="Understanding our platform and what we offer"
      icon={HelpCircle}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>A Trending Topics Platform</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              latestTrends is a comprehensive platform that aggregates and analyzes trending topics from across
              the internet. We simulate data ingestion from sources like Google Trends, social media platforms,
              and news outlets to identify what's capturing public attention.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li>
                <strong>Topic Discovery:</strong> Browse 100+ trending topics updated hourly
              </li>
              <li>
                <strong>AI-Generated Content:</strong> Each topic includes 4 comprehensive paragraphs covering
                overview, trending reasons, key facts, and future outlook
              </li>
              <li>
                <strong>Visual Design:</strong> Interactive polygon cards with animations that reflect trending
                scores
              </li>
              <li>
                <strong>Category Organization:</strong> Topics organized by AI, sports, entertainment, technology,
                and more
              </li>
              <li>
                <strong>Related Queries:</strong> Discover related search terms and topics
              </li>
              <li>
                <strong>Source Links:</strong> Access original sources for deeper research
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Who It's For</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>latestTrends is designed for:</p>
            <ul>
              <li>Content creators looking for trending topics to cover</li>
              <li>Marketers researching current consumer interests</li>
              <li>Journalists tracking emerging stories</li>
              <li>Researchers analyzing cultural trends</li>
              <li>Anyone curious about what's happening in the world</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
