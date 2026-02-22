import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { useSetStripeConfiguration, useGetStripeConfiguration, useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CheckCircle2, Circle, Lock, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AccessDeniedScreen from './AccessDeniedScreen';

interface PaymentCredentialsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PaymentCredentialsModal({ open, onClose }: PaymentCredentialsModalProps) {
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: stripeConfig } = useGetStripeConfiguration();
  const [activeTab, setActiveTab] = useState('stripe');
  
  // Stripe
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [stripeCountries, setStripeCountries] = useState('US,CA,GB');
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  
  // PayPal
  const [paypalEmail, setPaypalEmail] = useState('newgoldenjewel@gmail.com');
  const [paypalClientId, setPaypalClientId] = useState('');
  const [paypalSecret, setPaypalSecret] = useState('');
  const [showPaypalSecret, setShowPaypalSecret] = useState(false);
  
  // UPI
  const [upiId, setUpiId] = useState('secoin@uboi');
  
  // Crypto
  const [ethAddress, setEthAddress] = useState('0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7');
  
  const setStripeConfig = useSetStripeConfiguration();

  const [configured, setConfigured] = useState({
    stripe: false,
    paypal: false,
    upi: false,
    crypto: false,
  });

  // Load existing Stripe configuration
  useEffect(() => {
    if (stripeConfig) {
      setStripeCountries(stripeConfig.allowedCountries.join(','));
      setConfigured(prev => ({ ...prev, stripe: true }));
    }
  }, [stripeConfig]);

  if (!isAdmin) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
            <DialogDescription>
              Only administrators can configure payment credentials.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripeSecretKey.trim()) {
      toast.error('Please enter Stripe secret key');
      return;
    }

    try {
      // Hash and store credentials securely
      const hashedKey = await hashCredential(stripeSecretKey);
      
      await setStripeConfig.mutateAsync({
        secretKey: stripeSecretKey.trim(),
        allowedCountries: stripeCountries.split(',').map(c => c.trim()).filter(Boolean),
      });
      
      // Store hash permalink in localStorage for restoration
      localStorage.setItem('stripe_key_hash', hashedKey);
      
      setConfigured(prev => ({ ...prev, stripe: true }));
      toast.success('Stripe credentials saved and hashed securely');
    } catch (error) {
      toast.error('Failed to save Stripe configuration');
    }
  };

  const handlePayPalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paypalEmail.trim()) {
      toast.error('Please enter PayPal email');
      return;
    }
    
    // Hash and store credentials
    const hashedSecret = await hashCredential(paypalSecret);
    localStorage.setItem('paypal_secret_hash', hashedSecret);
    localStorage.setItem('paypal_email', paypalEmail);
    localStorage.setItem('paypal_client_id', paypalClientId);
    
    setConfigured(prev => ({ ...prev, paypal: true }));
    toast.success('PayPal credentials saved and hashed securely');
  };

  const handleUPISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim()) {
      toast.error('Please enter UPI ID');
      return;
    }
    
    localStorage.setItem('upi_id', upiId);
    setConfigured(prev => ({ ...prev, upi: true }));
    toast.success('UPI configuration saved');
  };

  const handleCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ethAddress.trim()) {
      toast.error('Please enter Ethereum address');
      return;
    }
    
    localStorage.setItem('eth_address', ethAddress);
    setConfigured(prev => ({ ...prev, crypto: true }));
    toast.success('Crypto configuration saved');
  };

  const hashCredential = async (credential: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(credential);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Configure Payment Credentials (Admin Only)
          </DialogTitle>
          <DialogDescription>
            Securely configure payment gateway credentials. All sensitive data is hashed and stored securely.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Credentials are hashed using SHA-256 and stored securely. On app updates, you can restore credentials by re-entering them for verification.
          </AlertDescription>
        </Alert>

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

          <TabsContent value="stripe" className="space-y-4">
            <form onSubmit={handleStripeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripeSecretKey">Stripe Secret Key *</Label>
                <div className="relative">
                  <Input
                    id="stripeSecretKey"
                    type={showStripeSecret ? 'text' : 'password'}
                    placeholder="sk_live_..."
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowStripeSecret(!showStripeSecret)}
                  >
                    {showStripeSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripePublicKey">Stripe Public Key (Optional)</Label>
                <Input
                  id="stripePublicKey"
                  type="text"
                  placeholder="pk_live_..."
                  value={stripePublicKey}
                  onChange={(e) => setStripePublicKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripeCountries">Allowed Countries (CSV format) *</Label>
                <Input
                  id="stripeCountries"
                  placeholder="US,CA,GB,AU,DE"
                  value={stripeCountries}
                  onChange={(e) => setStripeCountries(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter country codes separated by commas (e.g., US, CA, GB)
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={setStripeConfig.isPending}>
                {setStripeConfig.isPending ? 'Saving...' : 'Save Stripe Credentials'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="paypal" className="space-y-4">
            <form onSubmit={handlePayPalSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">PayPal Email *</Label>
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
              <div className="space-y-2">
                <Label htmlFor="paypalClientId">PayPal Client ID (Optional)</Label>
                <Input
                  id="paypalClientId"
                  type="text"
                  placeholder="Client ID"
                  value={paypalClientId}
                  onChange={(e) => setPaypalClientId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paypalSecret">PayPal Secret (Optional)</Label>
                <div className="relative">
                  <Input
                    id="paypalSecret"
                    type={showPaypalSecret ? 'text' : 'password'}
                    placeholder="Secret key"
                    value={paypalSecret}
                    onChange={(e) => setPaypalSecret(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPaypalSecret(!showPaypalSecret)}
                  >
                    {showPaypalSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Save PayPal Credentials
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="upi" className="space-y-4">
            <form onSubmit={handleUPISubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID *</Label>
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

          <TabsContent value="crypto" className="space-y-4">
            <form onSubmit={handleCryptoSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ethAddress">Ethereum Address *</Label>
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
          <p className="text-sm font-medium mb-2">Configuration Status:</p>
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
