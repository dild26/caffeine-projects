import { useState, useEffect } from 'react';
import { useSyncContactPage } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { RefreshCw, AlertCircle, CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

export default function ContactPage() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const syncContact = useSyncContactPage();

  const handleSync = async () => {
    setSyncStatus('syncing');
    try {
      await syncContact.mutateAsync();
      setSyncStatus('success');
      setLastSync(new Date());
      toast.success('Contact page synchronized successfully');
    } catch (error) {
      setSyncStatus('error');
      toast.error('Failed to sync contact page');
      console.error(error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="container py-12 space-y-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with our team for support, inquiries, or feedback.
          </p>
        </div>

        {/* Sync Status */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <img src="/assets/generated/sync-icon-transparent.dim_24x24.png" alt="Sync" className="h-5 w-5" />
                  External Content Sync
                </CardTitle>
                <CardDescription>
                  Synchronize with external contact page for latest information
                </CardDescription>
              </div>
              <Button onClick={handleSync} disabled={syncStatus === 'syncing'} size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {syncStatus === 'success' && (
              <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Successfully synchronized. Last sync: {lastSync?.toLocaleString()}
                </AlertDescription>
              </Alert>
            )}
            {syncStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to synchronize external content. Showing cached information below.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* External Content Iframe */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>External contact page content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src="https://networth-htm.caffeine.xyz/contact"
                className="w-full h-[600px]"
                title="External Contact Page"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </CardContent>
        </Card>

        {/* Fallback Contact Information */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">support@etutorial.example</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Location</h3>
              <p className="text-sm text-muted-foreground">Online Platform</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
