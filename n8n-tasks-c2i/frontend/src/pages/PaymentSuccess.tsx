import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-600">
          <CardHeader className="text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-3xl">Payment Successful!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for subscribing to our premium plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• You now have access to all premium workflows</li>
                <li>• Your subscription is active immediately</li>
                <li>• Check your email for the receipt</li>
                <li>• Visit your dashboard to start downloading workflows</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => navigate({ to: '/subscribers' })} className="flex-1">
                Browse Workflows
              </Button>
              <Button onClick={() => navigate({ to: '/dashboard' })} variant="outline" className="flex-1">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
