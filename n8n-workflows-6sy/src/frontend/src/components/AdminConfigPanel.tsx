import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUpdateStripeKeys, useGetStripeKeys, useRevealStripeSecretKey } from '../hooks/useQueries';
import { Eye, EyeOff, Save, AlertTriangle, CheckCircle2, Key, Webhook, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function AdminConfigPanel() {
  const { data: stripeKeys, refetch: refetchKeys } = useGetStripeKeys();
  const updateKeys = useUpdateStripeKeys();
  const revealSecret = useRevealStripeSecretKey();

  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);
  const [showRevealedSecret, setShowRevealedSecret] = useState(false);
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const handleSaveStripeKeys = async () => {
    if (!publicKey.trim() || !secretKey.trim()) {
      toast.error('Both public and secret keys are required');
      return;
    }

    if (!publicKey.startsWith('pk_')) {
      toast.error('Invalid public key format. Must start with pk_');
      return;
    }

    if (!secretKey.startsWith('sk_')) {
      toast.error('Invalid secret key format. Must start with sk_');
      return;
    }

    try {
      await updateKeys.mutateAsync({ secretKey, publicKey });
      toast.success('Stripe keys updated and persisted successfully');
      
      // Clear form after successful save
      setPublicKey('');
      setSecretKey('');
      setShowSecret(false);
      setRevealedSecret(null);
      
      // Refetch to show updated masked keys
      await refetchKeys();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update Stripe keys');
      console.error(error);
    }
  };

  const handleRevealSecret = async () => {
    try {
      const secret = await revealSecret.mutateAsync();
      setRevealedSecret(secret);
      setShowRevealedSecret(true);
      toast.success('Secret key revealed (will auto-hide in 30 seconds)');
      
      // Auto-hide after 30 seconds
      setTimeout(() => {
        setShowRevealedSecret(false);
        setTimeout(() => setRevealedSecret(null), 500);
      }, 30000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reveal secret key');
      console.error(error);
    }
  };

  const handleCopyPublic = async () => {
    if (stripeKeys?.publicKey) {
      await navigator.clipboard.writeText(stripeKeys.publicKey);
      setCopiedPublic(true);
      toast.success('Public key copied to clipboard');
      setTimeout(() => setCopiedPublic(false), 2000);
    }
  };

  const handleCopySecret = async () => {
    if (revealedSecret) {
      await navigator.clipboard.writeText(revealedSecret);
      setCopiedSecret(true);
      toast.success('Secret key copied to clipboard');
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/admin-config-panel.dim_700x500.png"
            alt="Admin Configuration"
            className="h-12 w-auto rounded"
          />
          <div>
            <CardTitle>Secure Configuration Panel</CardTitle>
            <CardDescription>
              Persistent Stripe key storage with masked display and secure reveal
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stripe" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe">
              <Key className="h-4 w-4 mr-2" />
              Stripe Keys
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Webhook className="h-4 w-4 mr-2" />
              Webhook Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="space-y-6">
            {/* Current Configuration Display */}
            {stripeKeys && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Current Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Public Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={stripeKeys.publicKey}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleCopyPublic}
                      >
                        {copiedPublic ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Secret Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={revealedSecret && showRevealedSecret ? revealedSecret : stripeKeys.secretKey}
                        readOnly
                        type={revealedSecret && showRevealedSecret ? 'text' : 'password'}
                        className="font-mono text-xs"
                      />
                      {revealedSecret && showRevealedSecret ? (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleCopySecret}
                        >
                          {copiedSecret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleRevealSecret}
                          disabled={revealSecret.isPending}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {revealedSecret && showRevealedSecret && (
                      <Alert variant="destructive" className="py-2">
                        <AlertTriangle className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          Secret key is visible. Will auto-hide in 30 seconds.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Keys are persistently stored in backend. Update below to change configuration.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* Update Keys Form */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Security Warning</AlertTitle>
              <AlertDescription>
                Keys are persistently stored in backend canister state and survive upgrades.
                Old keys are automatically replaced after update. Never share your secret key.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="publicKey">Stripe Public Key</Label>
                <Input
                  id="publicKey"
                  type="text"
                  placeholder="pk_live_... or pk_test_..."
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  disabled={updateKeys.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Your Stripe publishable key (starts with pk_)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretKey">Stripe Secret Key</Label>
                <div className="relative">
                  <Input
                    id="secretKey"
                    type={showSecret ? 'text' : 'password'}
                    placeholder="sk_live_... or sk_test_..."
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    disabled={updateKeys.isPending}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your Stripe secret key (starts with sk_) - will be masked after saving
                </p>
              </div>

              <Separator />

              <Button
                onClick={handleSaveStripeKeys}
                disabled={updateKeys.isPending || !publicKey.trim() || !secretKey.trim()}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateKeys.isPending ? 'Saving...' : stripeKeys ? 'Update Stripe Keys' : 'Save Stripe Keys'}
              </Button>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Keys are stored persistently in backend canister state and survive upgrades and migrations.
                  Old keys are automatically replaced after successful update.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Alert>
              <Webhook className="h-4 w-4" />
              <AlertTitle>Motoko/ICP Webhook Handling</AlertTitle>
              <AlertDescription>
                The Internet Computer (ICP) backend uses Motoko and does not support traditional webhook endpoints like /api/webhook.
                Instead, payment confirmations are handled through Stripe's checkout session status polling.
              </AlertDescription>
            </Alert>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">How Payment Confirmation Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">1</Badge>
                    <div>
                      <p className="text-sm font-medium">Checkout Session Creation</p>
                      <p className="text-xs text-muted-foreground">
                        Backend creates Stripe checkout session with success/cancel URLs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">2</Badge>
                    <div>
                      <p className="text-sm font-medium">User Payment</p>
                      <p className="text-xs text-muted-foreground">
                        User completes payment on Stripe's secure checkout page
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">3</Badge>
                    <div>
                      <p className="text-sm font-medium">Redirect to Success/Failure Page</p>
                      <p className="text-xs text-muted-foreground">
                        Stripe redirects to /payment-success or /payment-failure
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">4</Badge>
                    <div>
                      <p className="text-sm font-medium">Status Verification (Optional)</p>
                      <p className="text-xs text-muted-foreground">
                        Backend can verify session status using getStripeSessionStatus()
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>No webhook endpoint configuration needed.</strong> The Motoko backend handles payment
                confirmation through Stripe's checkout session API, which is fully compatible with ICP's architecture.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Success & Cancel URLs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Success URL</Label>
                  <Input
                    value={`${window.location.protocol}//${window.location.host}/payment-success`}
                    readOnly
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Cancel URL</Label>
                  <Input
                    value={`${window.location.protocol}//${window.location.host}/payment-failure`}
                    readOnly
                    className="font-mono text-xs"
                  />
                </div>

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    These URLs are automatically configured when creating checkout sessions.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
