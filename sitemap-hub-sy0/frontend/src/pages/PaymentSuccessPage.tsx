import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
  }, [queryClient]);

  return (
    <div className="container px-4 py-16 max-w-2xl mx-auto">
      <Card className="border-2 border-green-500/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Payment Successful!</CardTitle>
          <CardDescription className="text-base">
            Your subscription has been activated. Welcome to SitemapHub!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-6 space-y-3">
            <h3 className="font-semibold">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Access enhanced search features with increased result limits</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Start earning with our referral program</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Track your usage and analytics in the dashboard</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Link to="/dashboard" className="flex-1">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link to="/search" className="flex-1">
              <Button variant="outline" className="w-full">
                Start Searching
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
