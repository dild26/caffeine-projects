import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard, TrendingUp, Calendar, DollarSign, Zap, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useGetCallerSubscription, useGetCallerPaymentHistory, useCreateCheckoutSession } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { SubscriptionPlan } from '../backend';

const PLAN_DETAILS = {
  basic: { name: 'Basic', price: 9, quota: 100, color: 'bg-blue-500' },
  pro: { name: 'Pro', price: 45, quota: 1000, color: 'bg-purple-500' },
  enterprise: { name: 'Enterprise', price: 99, quota: 10000, color: 'bg-amber-500' }
};

const EXECUTION_BATCHES = [
  { size: 10, price: 1 },
  { size: 100, price: 8 },
  { size: 1000, price: 70 },
  { size: 10000, price: 600 }
];

export default function SubscriptionManagementDashboard() {
  const { data: subscription, isLoading: subscriptionLoading } = useGetCallerSubscription();
  const { data: paymentHistory, isLoading: historyLoading } = useGetCallerPaymentHistory();
  const createCheckoutSession = useCreateCheckoutSession();
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      const planDetails = PLAN_DETAILS[plan];
      const items = [{
        productName: `${planDetails.name} Plan`,
        productDescription: `Monthly subscription with ${planDetails.quota} executions`,
        priceInCents: BigInt(planDetails.price * 100),
        currency: 'USD',
        quantity: BigInt(1)
      }];

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const session = await createCheckoutSession.mutateAsync({
        items,
        successUrl: `${baseUrl}/payment-success`,
        cancelUrl: `${baseUrl}/subscription-management`
      });

      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session');
    }
  };

  const handlePurchaseBatch = async (batchSize: number, price: number) => {
    try {
      const items = [{
        productName: `${batchSize} Execution Credits`,
        productDescription: `Pay-as-you-use execution batch`,
        priceInCents: BigInt(price * 100),
        currency: 'USD',
        quantity: BigInt(1)
      }];

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const session = await createCheckoutSession.mutateAsync({
        items,
        successUrl: `${baseUrl}/payment-success`,
        cancelUrl: `${baseUrl}/subscription-management`
      });

      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session');
    }
  };

  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const usagePercentage = subscription 
    ? (Number(subscription.executionsUsed) / Number(subscription.executionQuota)) * 100 
    : 0;

  const planDetails = subscription ? PLAN_DETAILS[subscription.plan] : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">Manage your subscription and execution credits</p>
      </div>

      {/* Current Subscription Status */}
      {subscription ? (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{planDetails?.name}</div>
              <p className="text-xs text-muted-foreground">
                ${planDetails?.price}/month
              </p>
              <Badge 
                variant={subscription.active ? "default" : "destructive"} 
                className="mt-2"
              >
                {subscription.active ? 'Active' : 'Inactive'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Execution Quota</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Number(subscription.executionsUsed)} / {Number(subscription.executionQuota)}
              </div>
              <Progress value={usagePercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {usagePercentage.toFixed(1)}% used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription Period</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-medium">
                  {new Date(Number(subscription.startDate) / 1000000).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">to</p>
                <p className="font-medium">
                  {new Date(Number(subscription.endDate) / 1000000).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Subscription</AlertTitle>
          <AlertDescription>
            Subscribe to a plan below to start using the SEC-Visual Builder Dashboard
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="batches">Execution Batches</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        {/* Subscription Plans */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(PLAN_DETAILS).map(([key, plan]) => (
              <Card key={key} className={subscription?.plan === key ? 'border-primary border-2' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                    {plan.name}
                  </CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      {plan.quota.toLocaleString()} executions/month
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Full dashboard access
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      GPU-accelerated rendering
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      AI-powered validation
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleSubscribe(key as SubscriptionPlan)}
                    disabled={subscription?.plan === key && subscription?.active}
                    variant={subscription?.plan === key ? "outline" : "default"}
                  >
                    {subscription?.plan === key && subscription?.active ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Execution Batches */}
        <TabsContent value="batches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Execution Credits</CardTitle>
              <CardDescription>
                Buy additional execution credits to supplement your subscription quota
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {EXECUTION_BATCHES.map((batch) => (
                  <Card 
                    key={batch.size}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedBatch === batch.size ? 'border-primary border-2' : ''
                    }`}
                    onClick={() => setSelectedBatch(batch.size)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{batch.size.toLocaleString()}</CardTitle>
                      <CardDescription>executions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-4">${batch.price}</div>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchaseBatch(batch.size, batch.price);
                        }}
                      >
                        Purchase
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your past transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : paymentHistory && paymentHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(Number(transaction.timestamp) / 1000000).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transaction.transactionType.__kind__ === 'subscription' 
                            ? `Subscription (${transaction.transactionType.subscription})`
                            : transaction.transactionType.__kind__ === 'executionBatch'
                            ? `Execution Batch (${transaction.transactionType.executionBatch})`
                            : transaction.transactionType.__kind__}
                        </TableCell>
                        <TableCell>${Number(transaction.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'destructive'}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {transaction.stripeSessionId.slice(0, 20)}...
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No payment history available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Secure Payment Badge */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <img 
          src="/assets/generated/stripe-secure-badge-transparent.dim_150x50.png" 
          alt="Stripe Secure" 
          className="h-8"
        />
        <img 
          src="/assets/generated/payment-cards-icons-transparent.dim_200x50.png" 
          alt="Payment Methods" 
          className="h-8"
        />
      </div>
    </div>
  );
}

