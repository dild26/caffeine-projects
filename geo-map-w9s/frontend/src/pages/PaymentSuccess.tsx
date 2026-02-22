import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your subscription has been activated successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Thank you for subscribing to GPS Grid Maps. You now have access to premium features.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate({ to: '/dashboard' })} className="w-full">
              Go to Dashboard
            </Button>
            <Button onClick={() => navigate({ to: '/' })} variant="outline" className="w-full">
              Start Mapping
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
