import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            There was an issue processing your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Your payment could not be completed. Please try again or contact support if the issue persists.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => navigate({ to: '/' })} className="flex-1">
              Go Home
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" className="flex-1">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
