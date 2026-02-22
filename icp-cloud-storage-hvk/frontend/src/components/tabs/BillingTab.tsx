import { useListBillingRecords, useIsStripeConfigured } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { DollarSign, Receipt, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function BillingTab() {
  const { data: billingRecords = [], isLoading } = useListBillingRecords();
  const { data: isStripeConfigured = false } = useIsStripeConfigured();

  const totalAmount = billingRecords.reduce((acc, record) => acc + Number(record.amount), 0);
  const paidRecords = billingRecords.filter(r => r.status === 'paid').length;
  const pendingRecords = billingRecords.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">View your invoices and payment history</p>
      </div>

      {!isStripeConfigured && (
        <Alert>
          <Receipt className="h-4 w-4" />
          <AlertTitle>Payment System Not Configured</AlertTitle>
          <AlertDescription>
            Stripe payment integration is not yet configured. Contact your administrator to enable billing features.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalAmount / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {billingRecords.length} total invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidRecords}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRecords}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Your billing records and payment status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : billingRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No billing records</p>
              <p className="text-sm text-muted-foreground">Your invoices will appear here</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">{record.invoiceId}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell className="font-medium">
                        ${(Number(record.amount) / 100).toFixed(2)} {record.currency.toUpperCase()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(Number(record.periodStart) / 1000000).toLocaleDateString()} -{' '}
                        {new Date(Number(record.periodEnd) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === 'paid'
                              ? 'default'
                              : record.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(Number(record.createdAt) / 1000000).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
