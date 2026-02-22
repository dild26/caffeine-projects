import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetAllContactData, useFetchExternalContactData } from '../hooks/useQueries';
import { RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Contact() {
  const { data: contactData, isLoading } = useGetAllContactData();
  const fetchExternal = useFetchExternalContactData();
  const [iframeError, setIframeError] = useState(false);

  const handleFetchExternal = async () => {
    try {
      await fetchExternal.mutateAsync();
      toast.success('Contact data synchronized successfully!');
    } catch (error) {
      toast.error('Failed to fetch external contact data');
      console.error(error);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Contact Information</h1>
        <p className="text-muted-foreground">
          Enhanced contact verification with external data integration
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>External Contact Source</CardTitle>
                <CardDescription>
                  Embedded from networth-htm.caffeine.xyz
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleFetchExternal}
                disabled={fetchExternal.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${fetchExternal.isPending ? 'animate-spin' : ''}`} />
                Sync
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!iframeError ? (
              <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://networth-htm.caffeine.xyz/contact"
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                  onError={() => setIframeError(true)}
                  title="External Contact"
                />
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unable to load external contact source. Displaying local data below.
                </AlertDescription>
              </Alert>
            )}
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              <a
                href="https://networth-htm.caffeine.xyz/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Open in new tab
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Contact Data</CardTitle>
            <CardDescription>
              Verified and cached contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : contactData && contactData.length > 0 ? (
              <div className="space-y-4">
                {contactData.map(contact => (
                  <Card key={contact.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{contact.name}</h3>
                          {contact.verified ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Unverified
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            <span className="font-medium">Email:</span> {contact.email}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Phone:</span> {contact.phone}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Source:</span> {contact.source}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last verified: {formatTimestamp(contact.lastVerified)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No contact data available. Click the Sync button to fetch from external source.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
