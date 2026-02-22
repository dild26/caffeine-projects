import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetUserTransactions, useCreateTransaction } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ArrowUpRight, ArrowDownRight, Plus, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { Variant_inr_usd, Variant_payIn_payOut } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQRScanner } from '../qr-code/useQRScanner';
import { toBackendUnitValue, formatUnitValue } from '../lib/unitConversion';

export default function TransactionsPage() {
  const { identity } = useInternetIdentity();
  const { data: transactions = [], isLoading } = useGetUserTransactions();
  const createTransaction = useCreateTransaction();

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'inr' | 'usd'>('inr');
  const [type, setType] = useState<'payIn' | 'payOut'>('payIn');
  const [qrcDialogOpen, setQrcDialogOpen] = useState(false);

  const {
    qrResults,
    isScanning,
    isActive,
    error: scanError,
    startScanning,
    stopScanning,
    videoRef,
    canvasRef,
    canStartScanning,
  } = useQRScanner({ facingMode: 'environment' });

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please login to manage transactions.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await createTransaction.mutateAsync({
        amount: toBackendUnitValue({ value: Number(amount), unit: currency.toUpperCase() }, 'currency'),
        currency: { [currency]: null } as Variant_inr_usd,
        type: { [type]: null } as Variant_payIn_payOut,
      });
      toast.success('Transaction created successfully!');
      setAmount('');
    } catch (error) {
      toast.error('Failed to create transaction');
      console.error(error);
    }
  };

  const handleQRScan = () => {
    if (qrResults.length > 0) {
      const latestQR = qrResults[0];
      setAmount(latestQR.data);
      setQrcDialogOpen(false);
      stopScanning();
      toast.success('QR code scanned successfully!');
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  const sortedTransactions = [...transactions].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transactions</h1>
        <p className="text-muted-foreground">Manage your pay-ins and pay-outs with QRC support.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              New Transaction
            </CardTitle>
            <CardDescription>Create a pay-in or pay-out transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as 'payIn' | 'payOut')}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payIn">Pay-In (Deposit)</SelectItem>
                    <SelectItem value="payOut">Pay-Out (Withdrawal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex space-x-2">
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  <Dialog open={qrcDialogOpen} onOpenChange={setQrcDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="icon">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Scan QR Code</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                          <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            playsInline
                            muted
                          />
                          <canvas ref={canvasRef} className="hidden" />
                        </div>
                        {scanError && (
                          <div className="text-sm text-destructive">{scanError.message}</div>
                        )}
                        {qrResults.length > 0 && (
                          <div className="p-3 bg-accent/10 rounded-lg">
                            <p className="text-sm font-medium mb-1">Scanned Data:</p>
                            <p className="text-xs break-all">{qrResults[0].data}</p>
                          </div>
                        )}
                        <div className="flex space-x-2">
                          {!isActive && (
                            <Button onClick={startScanning} disabled={!canStartScanning} className="flex-1">
                              Start Scanning
                            </Button>
                          )}
                          {isActive && (
                            <Button onClick={stopScanning} variant="outline" className="flex-1">
                              Stop Scanning
                            </Button>
                          )}
                          {qrResults.length > 0 && (
                            <Button onClick={handleQRScan} className="flex-1">
                              Use This
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={(v) => setCurrency(v as 'inr' | 'usd')}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inr">INR (₹)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={createTransaction.isPending}>
                {createTransaction.isPending ? 'Processing...' : 'Create Transaction'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View all your transactions with validation status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
            ) : sortedTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No transactions yet</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.map((transaction) => (
                      <TableRow key={Number(transaction.id)}>
                        <TableCell className="font-mono text-xs">#{Number(transaction.id)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {'payIn' in transaction.type_ ? (
                              <ArrowDownRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-red-500" />
                            )}
                            <span>{'payIn' in transaction.type_ ? 'Pay-In' : 'Pay-Out'}</span>
                          </div>
                        </TableCell>
                        <TableCell className={'payIn' in transaction.type_ ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {'payIn' in transaction.type_ ? '+' : '-'}
                          {formatUnitValue(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={'ok' in transaction.status ? 'default' : 'pending' in transaction.status ? 'secondary' : 'destructive'}>
                            {Object.keys(transaction.status)[0]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatTimestamp(transaction.timestamp)}
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
    </div>
  );
}
