import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Receipt, ArrowRight } from 'lucide-react';
import { useUpdatePaymentStatus } from '@/hooks/useStripePayment';
import { useNavigate } from '@tanstack/react-router';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const updatePaymentStatus = useUpdatePaymentStatus();

  useEffect(() => {
    // Extract session ID from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session_id');
    
    if (sid) {
      setSessionId(sid);
      // Update payment status to completed
      updatePaymentStatus.mutate({ sessionId: sid, status: 'completed' });
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="cyber-gradient border-green-500/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-3xl text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-lg">
                Thank you for your purchase! Your payment has been processed successfully.
              </p>
              <p className="text-muted-foreground">
                Your account has been updated with your new subscription or domain batch access.
              </p>
            </div>

            {sessionId && (
              <div className="p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID:</span>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {sessionId.slice(0, 20)}...
                  </code>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Payment confirmed and processed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Account access updated immediately</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Receipt sent to your email</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => navigate({ to: '/dashboard' })}
                className="flex-1 neon-glow"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/subscription' })}
                className="flex-1"
              >
                <Receipt className="mr-2 h-4 w-4" />
                View Subscription
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Need help? <a href="/contact" className="text-primary hover:underline">Contact our support team</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
