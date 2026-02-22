import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Users } from 'lucide-react';

export default function Referral() {
  const topReferrerPayouts = [
    { rank: 'Top 10', type: 'Sales Referral', payout: '$100', icon: Trophy, color: 'text-yellow-500' },
    { rank: 'Top 50', type: 'Rental Referral', payout: '$100', icon: Users, color: 'text-blue-500' },
    { rank: 'Top 100', type: 'Lease Referral', payout: '$100', icon: TrendingUp, color: 'text-green-500' },
  ];

  const predictableIncomeData = [
    { month: 'Month 1', sales: '$100', rentals: '$100', leases: '$100', total: '$300' },
    { month: 'Month 2', sales: '$200', rentals: '$200', leases: '$200', total: '$600' },
    { month: 'Month 3', sales: '$300', rentals: '$300', leases: '$300', total: '$900' },
    { month: 'Month 4', sales: '$400', rentals: '$400', leases: '$400', total: '$1,200' },
    { month: 'Month 5', sales: '$500', rentals: '$500', leases: '$500', total: '$1,500' },
    { month: 'Month 6', sales: '$600', rentals: '$600', leases: '$600', total: '$1,800' },
    { month: 'Month 7', sales: '$700', rentals: '$700', leases: '$700', total: '$2,100' },
    { month: 'Month 8', sales: '$800', rentals: '$800', leases: '$800', total: '$2,400' },
    { month: 'Month 9', sales: '$900', rentals: '$900', leases: '$900', total: '$2,700' },
    { month: 'Month 10', sales: '$1,000', rentals: '$1,000', leases: '$1,000', total: '$3,000' },
    { month: 'Month 11', sales: '$1,100', rentals: '$1,100', leases: '$1,100', total: '$3,300' },
    { month: 'Month 12', sales: '$1,200', rentals: '$1,200', leases: '$1,200', total: '$3,600' },
  ];

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Referral Program</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Earn rewards by referring clients and watch your income grow predictably
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {topReferrerPayouts.map((payout, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <payout.icon className={`h-8 w-8 ${payout.color}`} />
                  <div>
                    <CardTitle>{payout.rank}</CardTitle>
                    <CardDescription>{payout.type}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{payout.payout}</div>
                <p className="text-sm text-muted-foreground mt-2">Monthly payout</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Predictable Income: 12x Returns in 12 Months
            </CardTitle>
            <CardDescription>
              See how your referral income can grow month by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Rentals</TableHead>
                    <TableHead>Leases</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictableIncomeData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell>{row.sales}</TableCell>
                      <TableCell>{row.rentals}</TableCell>
                      <TableCell>{row.leases}</TableCell>
                      <TableCell className="text-right font-bold">{row.total}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Total (12 Months)</TableCell>
                    <TableCell className="font-bold">$7,800</TableCell>
                    <TableCell className="font-bold">$7,800</TableCell>
                    <TableCell className="font-bold">$7,800</TableCell>
                    <TableCell className="text-right font-bold text-primary text-lg">$23,400</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Start earning with our referral system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="mt-1">1</Badge>
                <div>
                  <h3 className="font-semibold">Get Your Unique Tracking Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Each subscriber receives a unique referral banner with Merkle root UID for tracking
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">2</Badge>
                <div>
                  <h3 className="font-semibold">Share Your Permalink</h3>
                  <p className="text-sm text-muted-foreground">
                    Auto-assigned permalinks make it easy to share with potential clients
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">3</Badge>
                <div>
                  <h3 className="font-semibold">Track Your Earnings</h3>
                  <p className="text-sm text-muted-foreground">
                    All transactions tracked with UID, Nonce, and UserID for complete transparency
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">4</Badge>
                <div>
                  <h3 className="font-semibold">Secure Backup & Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    All referral data securely stored with modular, failure-resilient system
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
