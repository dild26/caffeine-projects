import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSetStripeConfiguration } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function StripeSetupModal() {
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB,AU,DE,FR');
  const setStripeConfig = useSetStripeConfiguration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    try {
      const allowedCountries = countries.split(',').map(c => c.trim()).filter(c => c);
      
      await setStripeConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries,
      });
      
      toast.success('Stripe configured successfully!');
    } catch (error) {
      toast.error('Failed to configure Stripe');
      console.error(error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Configure Stripe Payment</DialogTitle>
          <DialogDescription>
            Set up Stripe to enable subscription payments.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
            <Input
              id="countries"
              placeholder="US,CA,GB,AU,DE,FR"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={setStripeConfig.isPending}>
            {setStripeConfig.isPending ? 'Configuring...' : 'Configure Stripe'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
