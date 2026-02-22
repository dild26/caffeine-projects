import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function PaymentFailurePage() {
  return (
    <div className="container px-4 py-16 max-w-2xl mx-auto">
      <Card className="border-2 border-destructive/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-3xl">Payment Failed</CardTitle>
          <CardDescription className="text-base">
            We couldn't process your payment. Please try again or contact support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-6 space-y-3">
            <h3 className="font-semibold">Common Issues</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details</li>
              <li>• Card expired or blocked</li>
              <li>• Payment declined by your bank</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Link to="/subscription" className="flex-1">
              <Button className="w-full">Try Again</Button>
            </Link>
            <Link to="/contact" className="flex-1">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
