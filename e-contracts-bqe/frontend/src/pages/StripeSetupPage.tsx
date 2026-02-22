import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function StripeSetupPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const { actor } = useActor();
  const [secretKey, setSecretKey] = useState('');
  const [allowedCountries, setAllowedCountries] = useState('US,CA,GB');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!identity || !isAdmin)) {
      navigate({ to: '/access-denied' });
    }
  }, [identity, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!actor) {
      toast.error('Actor not available');
      return;
    }

    setIsSubmitting(true);
    try {
      const countries = allowedCountries.split(',').map(c => c.trim()).filter(c => c);
      await actor.setStripeConfiguration({
        secretKey,
        allowedCountries: countries,
      });
      toast.success('Stripe configuration saved successfully');
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Stripe setup error:', error);
      toast.error('Failed to save Stripe configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!identity || !isAdmin) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Stripe Payment Setup</CardTitle>
                <CardDescription>
                  Configure Stripe for payment processing
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This is an admin-only configuration. Your Stripe secret key will be stored securely.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="secretKey">Stripe Secret Key</Label>
                <Input
                  id="secretKey"
                  type="password"
                  placeholder="sk_test_..."
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your Stripe secret key (starts with sk_test_ or sk_live_)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedCountries">Allowed Countries</Label>
                <Input
                  id="allowedCountries"
                  placeholder="US,CA,GB,AU"
                  value={allowedCountries}
                  onChange={(e) => setAllowedCountries(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of country codes (e.g., US, CA, GB)
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Configuration'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
