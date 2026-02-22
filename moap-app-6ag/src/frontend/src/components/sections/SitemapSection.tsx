import { useGetSitemap } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function SitemapSection() {
  const { data: sitemap, isLoading } = useGetSitemap();

  const isCanonicalUrl = (url: string) => {
    return url.startsWith('https://') && url.endsWith('.caffeine.xyz');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Integrated Master Sitemap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sections = sitemap?.sections || [];

  if (sections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Integrated Master Sitemap</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No sitemap data available. Sitemap sections can be defined in the spec.yaml or spec.json configuration file. 
              The sitemap uses merge-only behavior - entries are never deleted by omission.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrated Master Sitemap</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This sitemap uses merge-only behavior. Entries are never deleted by omission - only explicit removal operations can delete entries.
            All URLs are validated against the canonical format: https://&lt;subdomain&gt;.caffeine.xyz
          </AlertDescription>
        </Alert>

        <Accordion type="multiple" className="w-full">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-lg font-semibold">
                {section.title}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({section.links?.length || 0} links)
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {(section.links || []).map((link) => {
                    const urlIsCanonical = isCanonicalUrl(link.url);
                    
                    return (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline flex items-center gap-2"
                          >
                            {link.title}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <p className="text-sm text-muted-foreground mt-1">{link.url}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {urlIsCanonical ? (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-xs">Valid</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                              <XCircle className="h-4 w-4" />
                              <span className="text-xs">Invalid</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
