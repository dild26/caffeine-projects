import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCardIcon, CheckIcon, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SubscriptionPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-8">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <CreditCardIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Subscription Management</h1>
        </div>

        <Alert className="mb-6 border-primary/30 bg-primary/5">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Restricted Access:</strong> This page is only accessible to authenticated users.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your subscription status and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg font-semibold">Free Plan</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Access to all public government schemes and basic search features
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Free Plan</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold">₹0</span>
                  <span className="text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Search all government schemes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Filter by ministry and category</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Pin schemes to your list</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Access to official scheme links</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-4 w-full" disabled>
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Premium Plan</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold">₹99</span>
                  <span className="text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">All Free plan features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Email alerts for new schemes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Personalized recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Advanced filtering options</span>
                  </li>
                </ul>
                <Button className="mt-4 w-full" disabled>
                  Upgrade (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your past transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No payment history available. You are currently on the Free plan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
