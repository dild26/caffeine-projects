import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Home, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success('Payment completed successfully!');
  }, []);

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-500">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6 mx-auto">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold">Payment Successful!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Thank you for your purchase. Your transaction has been completed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">What's Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Your workflow is now available for download</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Access the full JSON code and automation features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Transaction logged with UID for security tracking</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={() => navigate({ to: '/catalog' })} size="lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse More Workflows
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/' })} size="lg">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
