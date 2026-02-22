import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We couldn't process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Your payment was not completed. Please try again or contact support if the problem persists.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate({ to: '/subscription' })} className="w-full">
              Try Again
            </Button>
            <Button onClick={() => navigate({ to: '/contact' })} variant="outline" className="w-full">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
