import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetUserTransactions, useGetSubscription, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowUpRight, ArrowDownRight, Clock, TrendingUp, Wallet, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Variant_inr_usd, Variant_payIn_payOut } from '../backend';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: transactions = [], isLoading: transactionsLoading } = useGetUserTransactions();
  const { data: subscription, isLoading: subscriptionLoading } = useGetSubscription();
  const { data: isAdmin } = useIsCallerAdmin();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please login to access your dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalPayIns = transactions
    .filter(t => t.type === Variant_payIn_payOut.payIn)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalPayOuts = transactions
    .filter(t => t.type === Variant_payIn_payOut.payOut)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalPayIns - totalPayOuts;

  const recentTransactions = [...transactions]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 5);

  const formatCurrency = (amount: number, currency: Variant_inr_usd) => {
    return currency === Variant_inr_usd.inr ? `₹${amount.toLocaleString()}` : `$${amount.toLocaleString()}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
      </div>

      {isAdmin && (
        <Card className="mb-6 border-primary/50 bg-gradient-to-r from-primary/5 to-chart-1/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Admin Access
            </CardTitle>
            <CardDescription>You have administrator privileges.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/admin' })}>Go to Admin Panel</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.length} total transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pay-Ins</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalPayIns.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter(t => t.type === Variant_payIn_payOut.payIn).length} deposits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pay-Outs</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalPayOuts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter(t => t.type === Variant_payIn_payOut.payOut).length} withdrawals
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest transaction activity</CardDescription>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No transactions yet</div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={Number(transaction.id)} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`rounded-full p-2 ${transaction.type === Variant_payIn_payOut.payIn ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        {transaction.type === Variant_payIn_payOut.payIn ? (
                          <ArrowDownRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.type === Variant_payIn_payOut.payIn ? 'Pay-In' : 'Pay-Out'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === Variant_payIn_payOut.payIn ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === Variant_payIn_payOut.payIn ? '+' : '-'}
                        {formatCurrency(Number(transaction.amount), transaction.currency)}
                      </p>
                      <Badge variant={transaction.status === 'ok' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate({ to: '/transactions' })}>
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Your leaderboard subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            {subscriptionLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading subscription...</div>
            ) : subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                    {subscription.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <span className="text-sm font-medium">Fee Paid</span>
                  <span className="font-semibold">₹{Number(subscription.fee).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <span className="text-sm font-medium">Start Time</span>
                  <span className="text-sm">{formatTimestamp(subscription.startTime)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <span className="text-sm font-medium">End Time</span>
                  <span className="text-sm">{formatTimestamp(subscription.endTime)}</span>
                </div>
                <div className="p-3 rounded-lg bg-accent/10">
                  <p className="text-sm font-medium mb-1">QRC Code</p>
                  <p className="text-xs text-muted-foreground break-all">{subscription.qrc}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No active subscription</p>
                <Button onClick={() => navigate({ to: '/subscriptions' })}>
                  Subscribe Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate({ to: '/transactions' })}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Transactions
            </CardTitle>
            <CardDescription>Manage your pay-ins and pay-outs</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate({ to: '/subscriptions' })}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Subscriptions
            </CardTitle>
            <CardDescription>Join the leaderboard rotation</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate({ to: '/leaderboard' })}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Leaderboard
            </CardTitle>
            <CardDescription>View top performers</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
