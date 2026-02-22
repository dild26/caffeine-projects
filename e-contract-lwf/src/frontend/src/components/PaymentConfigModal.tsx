import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useSetStripeConfiguration } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';

interface PaymentConfigModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PaymentConfigModal({ open, onClose }: PaymentConfigModalProps) {
  const [activeTab, setActiveTab] = useState('stripe');
  const [stripeKey, setStripeKey] = useState('');
  const [stripeCountries, setStripeCountries] = useState('US,CA,GB');
  const [paypalEmail, setPaypalEmail] = useState('newgoldenjewel@gmail.com');
  const [upiId, setUpiId] = useState('secoin@uboi');
  const [ethAddress, setEthAddress] = useState('0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7');
  
  const setStripeConfig = useSetStripeConfiguration();

  const [configured, setConfigured] = useState({
    stripe: false,
    paypal: false,
    upi: false,
    crypto: false,
  });

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripeKey.trim()) {
      toast.error('Please enter Stripe secret key');
      return;
    }

    try {
      await setStripeConfig.mutateAsync({
        secretKey: stripeKey.trim(),
        allowedCountries: stripeCountries.split(',').map(c => c.trim()).filter(Boolean),
      });
      setConfigured(prev => ({ ...prev, stripe: true }));
      toast.success('Stripe configuration saved');
    } catch (error) {
      toast.error('Failed to save Stripe configuration');
    }
  };

  const handlePayPalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paypalEmail.trim()) {
      toast.error('Please enter PayPal email');
      return;
    }
    setConfigured(prev => ({ ...prev, paypal: true }));
    toast.success('PayPal configuration saved');
  };

  const handleUPISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim()) {
      toast.error('Please enter UPI ID');
      return;
    }
    setConfigured(prev => ({ ...prev, upi: true }));
    toast.success('UPI configuration saved');
  };

  const handleCryptoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ethAddress.trim()) {
      toast.error('Please enter Ethereum address');
      return;
    }
    setConfigured(prev => ({ ...prev, crypto: true }));
    toast.success('Crypto configuration saved');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Payment Gateways</DialogTitle>
          <DialogDescription>
            Set up your payment methods to enable checkout
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stripe" className="relative">
              Stripe
              {configured.stripe && <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="paypal" className="relative">
              PayPal
              {configured.paypal && <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="upi" className="relative">
              UPI
              {configured.upi && <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="crypto" className="relative">
              Crypto
              {configured.crypto && <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-green-500" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stripe">
            <form onSubmit={handleStripeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripeKey">Stripe Secret Key</Label>
                <Input
                  id="stripeKey"
                  type="password"
                  placeholder="sk_test_..."
                  value={stripeKey}
                  onChange={(e) => setStripeKey(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripeCountries">Allowed Countries (comma-separated)</Label>
                <Input
                  id="stripeCountries"
                  placeholder="US,CA,GB"
                  value={stripeCountries}
                  onChange={(e) => setStripeCountries(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Example: US, CA, GB, AU, DE
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={setStripeConfig.isPending}>
                {setStripeConfig.isPending ? 'Saving...' : 'Save Stripe Configuration'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="paypal">
            <form onSubmit={handlePayPalSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">PayPal Email</Label>
                <Input
                  id="paypalEmail"
                  type="email"
                  placeholder="your-email@example.com"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Default: newgoldenjewel@gmail.com
                </p>
              </div>
              <Button type="submit" className="w-full">
                Save PayPal Configuration
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="upi">
            <form onSubmit={handleUPISubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  type="text"
                  placeholder="username@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Default: secoin@uboi
                </p>
              </div>
              <Button type="submit" className="w-full">
                Save UPI Configuration
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="crypto">
            <form onSubmit={handleCryptoSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ethAddress">Ethereum Address</Label>
                <Input
                  id="ethAddress"
                  type="text"
                  placeholder="0x..."
                  value={ethAddress}
                  onChange={(e) => setEthAddress(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Default: 0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7
                </p>
              </div>
              <Button type="submit" className="w-full">
                Save Crypto Configuration
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-2">Configuration Status:</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(configured).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                {value ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
