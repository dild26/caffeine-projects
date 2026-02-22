import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaticPageLayout from '../components/StaticPageLayout';

export default function ContactPage() {
  return (
    <StaticPageLayout
      title="Contact Us"
      subtitle="Get in touch with the latestTrends team"
      icon={Mail}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[16/9] w-full">
              <iframe
                src="https://e-contract-lwf.caffeine.xyz/contact-us"
                className="h-full w-full rounded-lg border"
                title="Contact Form"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Resources</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>Visit our other platforms:</p>
            <ul>
              <li>
                <a
                  href="https://caffeine.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  caffeine.ai
                </a>
              </li>
              <li>
                <a
                  href="https://www.caffeine.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.caffeine.ai
                </a>
              </li>
              <li>
                <a
                  href="https://e-contract-lwf.caffeine.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  e-contract-lwf.caffeine.xyz
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
