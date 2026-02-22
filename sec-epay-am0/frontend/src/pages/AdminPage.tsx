import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useListApprovals, useSetApproval, useGetAllTransactions, useGetAllSubscriptions, useGetAdminSettings, useUpdateAdminSettings, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState } from 'react';
import { toast } from 'sonner';
import { ApprovalStatus } from '../backend';
import { Shield, Users, Settings, FileText, Map } from 'lucide-react';
import SitemapManagementPanel from '../components/SitemapManagementPanel';

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: approvals = [], isLoading: approvalsLoading } = useListApprovals();
  const { data: transactions = [], isLoading: transactionsLoading } = useGetAllTransactions();
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useGetAllSubscriptions();
  const { data: adminSettings } = useGetAdminSettings();
  const setApproval = useSetApproval();
  const updateSettings = useUpdateAdminSettings();

  const [conversionRate, setConversionRate] = useState('90');
  const [subscriptionFee, setSubscriptionFee] = useState('1000');
  const [rotationCycle, setRotationCycle] = useState('3600');

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please login to access the admin panel.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Shield className="mr-2 h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>You do not have administrator privileges.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleApproval = async (principal: string, status: ApprovalStatus) => {
    try {
      await setApproval.mutateAsync({
        user: { __principal__: principal } as any,
        status,
      });
      toast.success(`User ${status === ApprovalStatus.approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      toast.error('Failed to update approval status');
      console.error(error);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        conversionRate: BigInt(conversionRate),
        subscriptionFee: BigInt(subscriptionFee),
        rotationCycle: BigInt(rotationCycle),
      });
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Shield className="mr-3 h-8 w-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Manage users, transactions, and system settings</p>
      </div>

      <Tabs defaultValue="approvals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="approvals" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Approvals
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="flex items-center">
            <Map className="mr-2 h-4 w-4" />
            Sitemap
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>User Approvals</CardTitle>
              <CardDescription>Approve or reject user access requests</CardDescription>
            </CardHeader>
            <CardContent>
              {approvalsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading approvals...</div>
              ) : approvals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No approval requests</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Principal ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvals.map((approval) => (
                        <TableRow key={approval.principal.toString()}>
                          <TableCell className="font-mono text-xs">{approval.principal.toString()}</TableCell>
                          <TableCell>
                            <Badge variant={approval.status === ApprovalStatus.approved ? 'default' : approval.status === ApprovalStatus.pending ? 'secondary' : 'destructive'}>
                              {approval.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {approval.status !== ApprovalStatus.approved && (
                                <Button
                                  size="sm"
                                  onClick={() => handleApproval(approval.principal.toString(), ApprovalStatus.approved)}
                                  disabled={setApproval.isPending}
                                >
                                  Approve
                                </Button>
                              )}
                              {approval.status !== ApprovalStatus.rejected && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleApproval(approval.principal.toString(), ApprovalStatus.rejected)}
                                  disabled={setApproval.isPending}
                                >
                                  Reject
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>View and monitor all system transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No transactions yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.slice(0, 50).map((transaction) => (
                        <TableRow key={Number(transaction.id)}>
                          <TableCell className="font-mono text-xs">#{Number(transaction.id)}</TableCell>
                          <TableCell className="font-mono text-xs">{transaction.user.toString().slice(0, 15)}...</TableCell>
                          <TableCell>{transaction.type === 'payIn' ? 'Pay-In' : 'Pay-Out'}</TableCell>
                          <TableCell className="font-semibold">
                            {transaction.currency === 'inr' ? '₹' : '$'}{(Number(transaction.amount) / 100).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === 'ok' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{formatTimestamp(transaction.timestamp)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>All Subscriptions</CardTitle>
              <CardDescription>View and manage user subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptionsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading subscriptions...</div>
              ) : subscriptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No subscriptions yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>QRC</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map((subscription) => (
                        <TableRow key={subscription.user.toString()}>
                          <TableCell className="font-mono text-xs">{subscription.user.toString().slice(0, 15)}...</TableCell>
                          <TableCell className="text-xs">{subscription.qrc}</TableCell>
                          <TableCell className="font-semibold">₹{Number(subscription.fee).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                              {subscription.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{formatTimestamp(subscription.startTime)}</TableCell>
                          <TableCell className="text-xs">{formatTimestamp(subscription.endTime)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure global system parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateSettings} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="conversionRate">USD to INR Conversion Rate</Label>
                  <Input
                    id="conversionRate"
                    type="number"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(e.target.value)}
                    placeholder="90"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Current: 1 USD = {adminSettings ? Number(adminSettings.conversionRate) : 90} INR</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subscriptionFee">Subscription Fee (INR)</Label>
                  <Input
                    id="subscriptionFee"
                    type="number"
                    value={subscriptionFee}
                    onChange={(e) => setSubscriptionFee(e.target.value)}
                    placeholder="1000"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Current: ₹{adminSettings ? Number(adminSettings.subscriptionFee).toLocaleString() : '1,000'}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rotationCycle">Leaderboard Rotation Cycle (seconds)</Label>
                  <Input
                    id="rotationCycle"
                    type="number"
                    value={rotationCycle}
                    onChange={(e) => setRotationCycle(e.target.value)}
                    placeholder="3600"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Current: {adminSettings ? Number(adminSettings.rotationCycle) : 3600} seconds ({adminSettings ? Math.floor(Number(adminSettings.rotationCycle) / 3600) : 1} hour)</p>
                </div>

                <Button type="submit" disabled={updateSettings.isPending}>
                  {updateSettings.isPending ? 'Updating...' : 'Update Settings'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sitemap">
          <SitemapManagementPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
