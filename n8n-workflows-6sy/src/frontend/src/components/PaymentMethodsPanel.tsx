import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PaymentMethodsPanel() {
  const upiId = 'secoin@uboi';
  const upiPhone = '+919620058644';

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/multi-payment-methods.dim_600x300.png"
              alt="Payment Methods"
              className="h-12 w-auto rounded"
            />
            <div>
              <CardTitle>Multiple Payment Options</CardTitle>
              <CardDescription>
                Choose your preferred payment method for seamless transactions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stripe Payment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Credit/Debit Card (Stripe)</h3>
              <Badge>Primary</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure payment processing via Stripe. Accepts all major credit and debit cards.
            </p>
            <Alert>
              <AlertDescription className="text-xs">
                Stripe checkout will open in a new window for secure payment processing.
              </AlertDescription>
            </Alert>
          </div>

          {/* UPI Payment */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">UPI Payment (India)</h3>
              <Badge variant="secondary">Alternative</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Pay directly using UPI apps like Google Pay, PhonePe, or Paytm.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">UPI ID:</p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-mono text-sm">{upiId}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Phone Number:</p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-mono text-sm">{upiPhone}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center p-4 bg-white rounded-lg border-2">
              <img
                src="/assets/generated/upi-qr-payment-interface.dim_400x400.png"
                alt="UPI QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Scan this QR code with any UPI app to make payment
            </p>
          </div>

          {/* PayPal Payment */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">PayPal Subscription</h3>
              <Badge variant="secondary">Alternative</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Subscribe using PayPal for recurring payments and buyer protection.
            </p>
            
            <div className="flex justify-center p-4 bg-muted rounded-lg">
              <img
                src="/assets/generated/paypal-subscription-integration.dim_350x150.png"
                alt="PayPal Subscription"
                className="h-24 w-auto object-contain"
              />
            </div>

            <Alert>
              <AlertDescription className="text-xs">
                PayPal subscription button will be integrated here. Contact support for PayPal payment setup.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
