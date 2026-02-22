import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="container py-16">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Your payment could not be processed. Please try again or contact support if the problem persists.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate({ to: '/cart' })}>
              Return to Cart
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/contracts' })}>
              Browse Contracts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
