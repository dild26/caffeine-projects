import { useState } from 'react';
import { useGetAllTransactions, useGetAllTrustAccounts, useAddTrustAccount, useAddPoojaRitual } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Plus, Building2, Flower2, Loader2, Map } from 'lucide-react';
import SitemapTab from './SitemapTab';

export default function AdminTab() {
  const { data: allTransactions, isLoading: txLoading } = useGetAllTransactions();
  const { data: trustAccounts, isLoading: trustLoading } = useGetAllTrustAccounts();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Dashboard
          </CardTitle>
          <CardDescription>Manage trust accounts, rituals, sitemap, and view all transactions</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="trusts">Trust Accounts</TabsTrigger>
          <TabsTrigger value="rituals">Manage Rituals</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <AllTransactionsView transactions={allTransactions} isLoading={txLoading} />
        </TabsContent>

        <TabsContent value="trusts">
          <TrustAccountsView accounts={trustAccounts} isLoading={trustLoading} />
        </TabsContent>

        <TabsContent value="rituals">
          <ManageRitualsView />
        </TabsContent>

        <TabsContent value="sitemap">
          <SitemapTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AllTransactionsView({ transactions, isLoading }: { transactions?: any[]; isLoading: boolean }) {
  const formatAmount = (amount: bigint) => `₹${Number(amount).toLocaleString('en-IN')}`;
  const formatHash = (hash: string) => (hash.length <= 8 ? hash : `${hash.slice(0, 4)}...${hash.slice(-4)}`);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>Complete transaction history across all users</CardDescription>
      </CardHeader>
      <CardContent>
        {!transactions || transactions.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor Hash</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Taxes</TableHead>
                  <TableHead>Exemptions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {formatHash(tx.donorHash)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formatAmount(tx.amount)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatAmount(tx.taxes)}</TableCell>
                    <TableCell className="text-success">{formatAmount(tx.exemptions)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Verified</Badge>
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

function TrustAccountsView({ accounts, isLoading }: { accounts?: any[]; isLoading: boolean }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cgstRate: '',
    sgstRate: '',
    exemptionPolicy: '',
  });
  const { mutate: addAccount, isPending } = useAddTrustAccount();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = {
      id: `trust-${Date.now()}`,
      name: formData.name,
      cgstRate: BigInt(formData.cgstRate),
      sgstRate: BigInt(formData.sgstRate),
      exemptionPolicy: formData.exemptionPolicy,
    };
    addAccount(account, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ name: '', cgstRate: '', sgstRate: '', exemptionPolicy: '' });
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trust Accounts</CardTitle>
            <CardDescription>Manage temple trust accounts and tax policies</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Trust
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Trust Account</DialogTitle>
                <DialogDescription>Create a new temple trust account</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trustName">Trust Name</Label>
                  <Input
                    id="trustName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cgst">CGST Rate (%)</Label>
                    <Input
                      id="cgst"
                      type="number"
                      value={formData.cgstRate}
                      onChange={(e) => setFormData({ ...formData, cgstRate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sgst">SGST Rate (%)</Label>
                    <Input
                      id="sgst"
                      type="number"
                      value={formData.sgstRate}
                      onChange={(e) => setFormData({ ...formData, sgstRate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policy">Exemption Policy</Label>
                  <Textarea
                    id="policy"
                    value={formData.exemptionPolicy}
                    onChange={(e) => setFormData({ ...formData, exemptionPolicy: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Add Trust Account
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {!accounts || accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No trust accounts yet</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.map((account) => (
              <div key={account.id} className="rounded-lg border p-4 space-y-2">
                <h3 className="font-semibold">{account.name}</h3>
                <div className="flex gap-2 text-sm">
                  <Badge variant="outline">CGST: {Number(account.cgstRate)}%</Badge>
                  <Badge variant="outline">SGST: {Number(account.sgstRate)}%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{account.exemptionPolicy}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ManageRitualsView() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    donationType: '',
    horoscopeReference: '',
    beneficiaryAccount: '',
    price: '',
  });
  const { mutate: addRitual, isPending } = useAddPoojaRitual();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ritual = {
      id: `ritual-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      donationType: formData.donationType,
      horoscopeReference: formData.horoscopeReference,
      beneficiaryAccount: formData.beneficiaryAccount,
      price: BigInt(formData.price),
    };
    addRitual(ritual, {
      onSuccess: () => {
        setOpen(false);
        setFormData({
          name: '',
          category: '',
          donationType: '',
          horoscopeReference: '',
          beneficiaryAccount: '',
          price: '',
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Manage Pooja Rituals</CardTitle>
            <CardDescription>Add and configure available pooja rituals</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Ritual
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Pooja Ritual</DialogTitle>
                <DialogDescription>Create a new pooja ritual offering</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ritualName">Ritual Name</Label>
                    <Input
                      id="ritualName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="donationType">Donation Type</Label>
                    <Input
                      id="donationType"
                      value={formData.donationType}
                      onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horoscope">Horoscope Reference</Label>
                  <Input
                    id="horoscope"
                    value={formData.horoscopeReference}
                    onChange={(e) => setFormData({ ...formData, horoscopeReference: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beneficiary">Beneficiary Account</Label>
                  <Input
                    id="beneficiary"
                    value={formData.beneficiaryAccount}
                    onChange={(e) => setFormData({ ...formData, beneficiaryAccount: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Add Ritual
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Flower2 className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Use the button above to add pooja rituals</p>
        </div>
      </CardContent>
    </Card>
  );
}
