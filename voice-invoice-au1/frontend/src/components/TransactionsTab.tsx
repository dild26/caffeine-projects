import { useGetMyTransactions } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TransactionsTab() {
  const { data: transactions, isLoading } = useGetMyTransactions();

  const formatHash = (hash: string) => {
    if (hash.length <= 8) return hash;
    return `${hash.slice(0, 4)}...${hash.slice(-4)}`;
  };

  const formatAmount = (amount: bigint) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Transactions</CardTitle>
        <CardDescription>View all your donation and payment transactions with blockchain verification</CardDescription>
      </CardHeader>
      <CardContent>
        {!transactions || transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Download className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No transactions yet</h3>
            <p className="text-sm text-muted-foreground">
              Your transactions will appear here once you make a donation or payment
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor Hash</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Taxes</TableHead>
                  <TableHead className="text-right">Exemptions</TableHead>
                  <TableHead>Merkle Root</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {formatHash(transaction.donorHash)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(transaction.timestamp)}</TableCell>
                    <TableCell className="text-right font-medium">{formatAmount(transaction.amount)}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatAmount(transaction.taxes)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-success">
                      {formatAmount(transaction.exemptions)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {formatHash(Buffer.from(transaction.merkleRoot).toString('hex'))}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <Download className="h-3 w-3" />
                          <span className="hidden sm:inline">Receipt</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <ExternalLink className="h-3 w-3" />
                          <span className="hidden sm:inline">Verify</span>
                        </Button>
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
  );
}
