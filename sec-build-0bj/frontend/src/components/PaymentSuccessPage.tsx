import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, ArrowRight, CreditCard } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Invalidate subscription queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['callerSubscription'] });
    queryClient.invalidateQueries({ queryKey: ['callerPaymentHistory'] });

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate({ to: '/workspace' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-success/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-success/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img 
              src="/assets/generated/payment-success-icon-transparent.dim_64x64.png" 
              alt="Payment Success" 
              className="w-24 h-24 mx-auto"
            />
          </div>
          <CardTitle className="text-3xl text-success flex items-center justify-center gap-2">
            <CheckCircle2 className="w-8 h-8" />
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Your subscription has been activated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-success bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">Transaction Complete</AlertTitle>
            <AlertDescription>
              Your payment has been processed successfully. You now have full access to the SEC-Visual Builder Dashboard with all premium features.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Your execution quota has been updated</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>All premium features are now unlocked</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>You can start executing workflows immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>View your subscription details in the management dashboard</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1" 
              size="lg"
              onClick={() => navigate({ to: '/workspace' })}
            >
              Go to Workspace
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              size="lg"
              onClick={() => navigate({ to: '/subscription-management' })}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              View Subscription
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Redirecting to workspace in {countdown} seconds...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

