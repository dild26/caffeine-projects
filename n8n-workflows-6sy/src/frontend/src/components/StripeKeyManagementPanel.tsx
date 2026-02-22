import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Eye, EyeOff, Key, Lock, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import { useGetStripeKeys, useUpdateStripeKeys, useRevealStripeSecretKey } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function StripeKeyManagementPanel() {
  const { data: stripeKeys, isLoading } = useGetStripeKeys();
  const updateKeys = useUpdateStripeKeys();
  const revealSecret = useRevealStripeSecretKey();

  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showRevealDialog, setShowRevealDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [revealedSecretKey, setRevealedSecretKey] = useState<string | null>(null);

  const handleRevealSecret = async () => {
    try {
      const revealed = await revealSecret.mutateAsync();
      setRevealedSecretKey(revealed);
      setShowSecretKey(true);
      setShowRevealDialog(false);
      toast.success('Secret key revealed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reveal secret key');
      console.error(error);
    }
  };

  const handleUpdateKeys = async () => {
    if (!publicKey.trim() || !secretKey.trim()) {
      toast.error('Both public and secret keys are required');
      return;
    }

    if (!publicKey.startsWith('pk_')) {
      toast.error('Public key must start with "pk_"');
      return;
    }

    if (!secretKey.startsWith('sk_')) {
      toast.error('Secret key must start with "sk_"');
      return;
    }

    try {
      await updateKeys.mutateAsync({ secretKey, publicKey });
      toast.success('Stripe keys updated successfully');
      setShowUpdateDialog(false);
      setIsEditing(false);
      setPublicKey('');
      setSecretKey('');
      setShowSecretKey(false);
      setRevealedSecretKey(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update Stripe keys');
      console.error(error);
    }
  };

  const handleStartEdit = () => {
    if (stripeKeys) {
      setPublicKey(stripeKeys.publicKey);
      setSecretKey('');
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPublicKey('');
    setSecretKey('');
    setShowSecretKey(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img
              src="/assets/generated/stripe-key-management-interface.dim_600x400.png"
              alt="Stripe Key Management"
              className="h-6 w-6"
            />
            Stripe Key Management
          </CardTitle>
          <CardDescription>
            Secure management of Stripe API keys with masked display and update capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Security Notice</AlertTitle>
            <AlertDescription className="text-xs">
              Stripe keys are stored securely and only accessible to administrators. Never share your secret key with anyone.
            </AlertDescription>
          </Alert>

          {stripeKeys && !isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Public Key
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={stripeKeys.publicKey}
                    readOnly
                    className="font-mono text-sm bg-muted"
                  />
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Secret Key
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={showSecretKey && revealedSecretKey ? revealedSecretKey : stripeKeys.secretKey}
                    readOnly
                    type={showSecretKey ? 'text' : 'password'}
                    className="font-mono text-sm bg-muted"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (showSecretKey) {
                        setShowSecretKey(false);
                        setRevealedSecretKey(null);
                      } else {
                        setShowRevealDialog(true);
                      }
                    }}
                    disabled={revealSecret.isPending}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {stripeKeys.isMasked && !showSecretKey && (
                  <p className="text-xs text-muted-foreground">
                    Secret key is masked for security. Click the eye icon to reveal.
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleStartEdit} className="flex-1">
                  Update Stripe Keys
                </Button>
              </div>
            </div>
          ) : isEditing ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription className="text-xs">
                  Updating Stripe keys will immediately replace the current configuration. All previous keys will be permanently discarded.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="publicKey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  New Public Key
                </Label>
                <Input
                  id="publicKey"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  placeholder="pk_live_..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Must start with "pk_"
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretKey" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  New Secret Key
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="secretKey"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    type={showSecretKey ? 'text' : 'password'}
                    placeholder="sk_live_..."
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must start with "sk_"
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setShowUpdateDialog(true)}
                  disabled={!publicKey.trim() || !secretKey.trim() || updateKeys.isPending}
                  className="flex-1"
                >
                  {updateKeys.isPending ? 'Updating...' : 'Confirm Update'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={updateKeys.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No Stripe keys configured yet</p>
              <Button onClick={handleStartEdit} className="mt-4">
                Configure Stripe Keys
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reveal Secret Key Dialog */}
      <AlertDialog open={showRevealDialog} onOpenChange={setShowRevealDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Reveal Secret Key?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                You are about to reveal the Stripe secret key. This is sensitive information that should never be shared.
              </p>
              <Alert variant="destructive" className="mt-4">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Security Best Practices:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Never share your secret key with anyone</li>
                    <li>Do not store it in version control</li>
                    <li>Ensure you're in a secure environment</li>
                    <li>Hide your screen from others</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevealSecret} disabled={revealSecret.isPending}>
              {revealSecret.isPending ? 'Revealing...' : 'Reveal Secret Key'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Keys Confirmation Dialog */}
      <AlertDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Stripe Key Update
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                You are about to update your Stripe API keys. This action will:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Immediately replace the current Stripe configuration</li>
                <li>Permanently discard all previous key copies</li>
                <li>Apply the new keys to all future payment operations</li>
                <li>Prevent the app from prompting for configuration again</li>
              </ul>
              <Alert className="mt-4">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Make sure you have tested these keys in your Stripe dashboard before proceeding.
                </AlertDescription>
              </Alert>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateKeys} disabled={updateKeys.isPending}>
              {updateKeys.isPending ? 'Updating...' : 'Confirm Update'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
