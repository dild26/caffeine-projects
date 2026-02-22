import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-destructive">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-3xl">Payment Failed</CardTitle>
            <CardDescription className="text-lg">
              We couldn't process your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-2">What Happened?</h3>
              <p className="text-muted-foreground mb-4">
                Your payment was not completed. This could be due to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Insufficient funds</li>
                <li>• Card declined by your bank</li>
                <li>• Incorrect payment details</li>
                <li>• Payment cancelled by you</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => navigate({ to: '/dashboard' })} className="flex-1">
                Try Again
              </Button>
              <Button onClick={() => navigate({ to: '/contact' })} variant="outline" className="flex-1">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
