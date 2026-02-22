import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, HelpCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-destructive">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6 mx-auto">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-bold">Payment Failed</CardTitle>
            <CardDescription className="text-lg mt-2">
              We couldn't process your payment. Please try again or contact support if the problem persists.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Common reasons for payment failure:</strong>
                <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                  <li>Insufficient funds in your account</li>
                  <li>Card declined by your bank</li>
                  <li>Incorrect card details entered</li>
                  <li>Payment cancelled by user</li>
                  <li>Network connection issues</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">What You Can Do:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <RefreshCw className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Try the payment again with the same or different card</span>
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Contact your bank to ensure your card is authorized for online purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Reach out to our support team if you need assistance</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={() => navigate({ to: '/catalog' })} size="lg">
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/contact' })} size="lg">
                <HelpCircle className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
              <Button variant="ghost" onClick={() => navigate({ to: '/' })} size="lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Home
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                No charges were made to your account. You can safely retry the payment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
