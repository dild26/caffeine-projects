import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-16">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate({ to: '/contracts' })}>
              Browse More Contracts
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
