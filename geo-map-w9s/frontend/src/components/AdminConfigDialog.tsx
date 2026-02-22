import { useState } from 'react';
import { useSetStripeConfiguration } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

export default function AdminConfigDialog() {
  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [allowedCountries, setAllowedCountries] = useState('');
  const setStripeConfig = useSetStripeConfiguration();

  const handleSave = async () => {
    if (!secretKey.trim()) {
      toast.error('Please enter a Stripe secret key');
      return;
    }

    const countries = allowedCountries
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length === 2);

    if (countries.length === 0) {
      toast.error('Please enter at least one valid country code (e.g., US, CA, GB)');
      return;
    }

    try {
      await setStripeConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries: countries,
      });

      toast.success('Stripe configuration saved successfully');
      setOpen(false);
      setSecretKey('');
      setAllowedCountries('');
    } catch (error) {
      toast.error('Failed to save configuration');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Settings className="h-4 w-4 mr-2" />
          Configure Payment Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Payment Configuration</DialogTitle>
          <DialogDescription>
            Configure Stripe payment settings. All sensitive data is hashed before storage.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="secret-key">Stripe Secret Key</Label>
            <Input
              id="secret-key"
              type="password"
              placeholder="sk_test_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your Stripe secret key will be hashed before storage
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries</Label>
            <Textarea
              id="countries"
              placeholder="US, CA, GB, IN"
              value={allowedCountries}
              onChange={(e) => setAllowedCountries(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Enter country codes separated by commas (e.g., US, CA, GB, IN)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={setStripeConfig.isPending}>
            {setStripeConfig.isPending ? 'Saving...' : 'Save Configuration'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
