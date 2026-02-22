import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, Home, RefreshCw, HelpCircle } from 'lucide-react';
import { useUpdatePaymentStatus } from '@/hooks/useStripePayment';
import { useNavigate } from '@tanstack/react-router';

export default function PaymentFailurePage() {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const updatePaymentStatus = useUpdatePaymentStatus();

  useEffect(() => {
    // Extract session ID from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session_id');
    
    if (sid) {
      setSessionId(sid);
      // Update payment status to failed
      updatePaymentStatus.mutate({ sessionId: sid, status: 'failed' });
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="cyber-gradient border-destructive/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-destructive/10 border-2 border-destructive rounded-full flex items-center justify-center">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-3xl text-destructive">Payment Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-lg">
                Your payment was not completed.
              </p>
              <p className="text-muted-foreground">
                No charges have been made to your account. You can try again or choose a different payment method.
              </p>
            </div>

            <Alert className="border-yellow-500/20 bg-yellow-500/5">
              <HelpCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription>
                <strong>Common reasons for payment cancellation:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Payment was manually cancelled</li>
                  <li>Card was declined by your bank</li>
                  <li>Insufficient funds</li>
                  <li>Session timeout</li>
                </ul>
              </AlertDescription>
            </Alert>

            {sessionId && (
              <div className="p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Session ID:</span>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {sessionId.slice(0, 20)}...
                  </code>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => navigate({ to: '/subscription' })}
                className="flex-1 neon-glow"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Having trouble? <a href="/contact" className="text-primary hover:underline">Contact our support team</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
