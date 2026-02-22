import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useCreateCheckoutSession, useAddPaymentRecord } from '@/hooks/useStripePayment';
import { ShoppingItem } from '@/backend';
import { toast } from 'sonner';

interface StripePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shoppingItem: ShoppingItem;
  paymentType: 'subscription' | 'payAsYouUse';
}

export default function StripePaymentModal({
  open,
  onOpenChange,
  shoppingItem,
  paymentType,
}: StripePaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const createCheckoutSession = useCreateCheckoutSession();
  const addPaymentRecord = useAddPaymentRecord();

  const formatPrice = (cents: bigint) => {
    return `$${(Number(cents) / 100).toFixed(2)}`;
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Create base URLs for success and cancel
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;

      // Create checkout session
      const session = await createCheckoutSession.mutateAsync({
        items: [shoppingItem],
        successUrl,
        cancelUrl,
      });

      // Add payment record to history
      await addPaymentRecord.mutateAsync({
        type: paymentType,
        amount: Number(shoppingItem.priceInCents),
        currency: shoppingItem.currency,
        status: 'pending',
        sessionId: session.id,
        productName: shoppingItem.productName,
        productDescription: shoppingItem.productDescription,
      });

      // Redirect to Stripe checkout
      toast.success('Redirecting to secure payment page...');
      window.location.href = session.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Secure Payment Checkout
          </DialogTitle>
          <DialogDescription>
            You will be redirected to Stripe's secure payment page to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Details */}
          <div className="p-4 bg-muted/30 rounded-lg border">
            <h3 className="font-semibold mb-2">{shoppingItem.productName}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {shoppingItem.productDescription}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(shoppingItem.priceInCents)} {shoppingItem.currency}
              </span>
            </div>
          </div>

          {/* Security Notice */}
          <Alert className="border-green-500/20 bg-green-500/5">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-sm">
              <strong>Secure Payment:</strong> Your payment is processed securely through Stripe. 
              We never store your credit card information.
            </AlertDescription>
          </Alert>

          {/* Payment Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                You'll be redirected to Stripe's secure checkout page
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">
                PCI DSS compliant payment processing
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">
                Supports all major credit and debit cards
              </span>
            </div>
          </div>

          {/* Error Display */}
          {createCheckoutSession.isError && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription>
                Failed to create checkout session. Please try again or contact support if the issue persists.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full sm:w-auto neon-glow"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
