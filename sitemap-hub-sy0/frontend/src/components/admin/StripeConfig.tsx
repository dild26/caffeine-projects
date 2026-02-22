import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function StripeConfig() {
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB,DE,FR');
  const { data: isConfigured, isLoading } = useIsStripeConfigured();
  const { mutateAsync: setConfig, isPending } = useSetStripeConfiguration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretKey.trim()) {
      toast.error('Secret key is required');
      return;
    }

    try {
      await setConfig({
        secretKey: secretKey.trim(),
        allowedCountries: countries.split(',').map((c) => c.trim()),
      });
      toast.success('Stripe configuration saved successfully');
      setSecretKey('');
    } catch (error) {
      console.error('Config error:', error);
      toast.error('Failed to save Stripe configuration');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Stripe Configuration
            </CardTitle>
            <CardDescription>Configure payment processing settings</CardDescription>
          </div>
          {!isLoading && (
            <Badge variant={isConfigured ? 'default' : 'outline'} className="gap-2">
              {isConfigured ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Configured
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Not Configured
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key *</Label>
            <Input
              id="secretKey"
              type="password"
              placeholder="sk_test_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Your Stripe secret key. Keep this secure and never share it publicly.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries</Label>
            <Input
              id="countries"
              placeholder="US,CA,GB,DE,FR"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list of ISO country codes (e.g., US, CA, GB)
            </p>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Saving...' : 'Save Configuration'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">Important Notes:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use test keys for development (sk_test_...)</li>
            <li>• Use live keys for production (sk_live_...)</li>
            <li>• Ensure your Stripe account is properly configured</li>
            <li>• Test payments before going live</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
