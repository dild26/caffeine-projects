import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';

export default function PaymentFailedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-destructive/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img 
              src="/assets/generated/payment-failed-icon-transparent.dim_64x64.png" 
              alt="Payment Failed" 
              className="w-24 h-24 mx-auto"
            />
          </div>
          <CardTitle className="text-3xl text-destructive flex items-center justify-center gap-2">
            <XCircle className="w-8 h-8" />
            Payment Failed
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            We couldn't process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Transaction Unsuccessful</AlertTitle>
            <AlertDescription>
              Your payment was not completed. No charges have been made to your account.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Common Reasons for Payment Failure:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <span>Incorrect card details or expired card</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <span>Payment declined by your bank</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <span>Network or connection issues</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">What You Can Do:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Try again with a different payment method</span>
              </li>
              <li className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Check your card details and billing address</span>
              </li>
              <li className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Contact your bank to authorize the transaction</span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Contact our support team if the issue persists</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1" 
              size="lg"
              onClick={() => navigate({ to: '/subscription-management' })}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              size="lg"
              onClick={() => navigate({ to: '/' })}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            Need help? Contact support or check our FAQ section
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

