import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsStripeConfigured, useSetStripeConfiguration, useIsCallerAdmin } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function StripeSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: isStripeConfigured, isLoading: configLoading } = useIsStripeConfigured();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const setStripeConfig = useSetStripeConfiguration();

  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB');

  const isAuthenticated = !!identity;
  const showSetup = isAuthenticated && !configLoading && !adminLoading && isAdmin && !isStripeConfigured;

  useEffect(() => {
    if (showSetup !== undefined) {
      setOpen(showSetup);
    }
  }, [showSetup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    try {
      await setStripeConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries: countries.split(',').map(c => c.trim()).filter(Boolean),
      });

      toast.success('Stripe configured successfully!');
      setOpen(false);
    } catch (error) {
      console.error('Error configuring Stripe:', error);
      toast.error('Failed to configure Stripe. Please try again.');
    }
  };

  if (!showSetup) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Configure Stripe Payment</DialogTitle>
          <DialogDescription>
            As an admin, please configure Stripe to enable payment functionality for the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key *</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_test_..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
            <Input
              id="countries"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="US,CA,GB"
            />
            <p className="text-xs text-muted-foreground">
              Use ISO 3166-1 alpha-2 country codes (e.g., US, CA, GB)
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={setStripeConfig.isPending}>
            {setStripeConfig.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Configuring...
              </>
            ) : (
              'Configure Stripe'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
