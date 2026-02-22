import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>There was an issue processing your payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment could not be completed. Please try again or contact support if the issue persists.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => navigate({ to: '/billing' })} variant="outline" className="flex-1">
              Back to Billing
            </Button>
            <Button onClick={() => navigate({ to: '/contact' })} className="flex-1">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
