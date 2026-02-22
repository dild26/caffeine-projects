import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import StaticPageLayout from '../components/StaticPageLayout';

export default function FaqPage() {
  return (
    <StaticPageLayout
      title="FAQ"
      subtitle="Frequently asked questions about latestTrends"
      icon={HelpCircle}
      pageTitle="FAQ - latestTrends"
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is latestTrends?</AccordionTrigger>
          <AccordionContent>
            latestTrends is a platform that aggregates and analyzes trending topics from across the internet. We
            provide real-time insights into what's capturing public attention, with AI-generated content for each
            topic.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How often is the data updated?</AccordionTrigger>
          <AccordionContent>
            Our system refreshes hourly, ensuring you always see the most current trends. We continuously monitor
            multiple data sources to identify emerging topics.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Where does the data come from?</AccordionTrigger>
          <AccordionContent>
            We simulate data ingestion from multiple sources including search engines, social media platforms, and
            news outlets. Each topic includes source links for verification.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Is registration required?</AccordionTrigger>
          <AccordionContent>
            No, you can browse all trending topics without creating an account. We believe trending information
            should be freely accessible to everyone.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>How are topics scored?</AccordionTrigger>
          <AccordionContent>
            Topics are scored based on three factors: recency (how recently it started trending), search volume
            (number of searches and mentions), and cross-platform presence (how widely discussed).
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>Can I suggest topics?</AccordionTrigger>
          <AccordionContent>
            Currently, topics are automatically identified by our system. However, we're always looking to improve.
            Feel free to contact us with suggestions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger>What do the polygon shapes mean?</AccordionTrigger>
          <AccordionContent>
            The number of vertices (3-12) on each polygon card corresponds to the topic's trending score. Higher
            scores result in more complex shapes, creating a unique visual signature for each trend.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>Is the content AI-generated?</AccordionTrigger>
          <AccordionContent>
            Yes, each topic includes AI-generated summaries covering overview, trending reasons, key facts, and
            future outlook. All content includes source links for verification and deeper research.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StaticPageLayout>
  );
}
