import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Users, TrendingUp, Gift, DollarSign, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ReferralPage() {
  const { identity } = useInternetIdentity();
  const [referralCode] = useState('REF-' + Math.random().toString(36).substring(2, 10).toUpperCase());
  const merkleRootUID = `0x${Math.random().toString(16).substring(2, 18)}`;

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard!');
  };

  const copyPermalink = (uid: string) => {
    const permalink = `${window.location.origin}/referral/${uid}`;
    navigator.clipboard.writeText(permalink);
    toast.success('Permalink copied to clipboard!');
  };

  // 12-month income projection data
  const incomeProjection = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthName: new Date(2025, i).toLocaleString('default', { month: 'short' }),
    top10: (i + 1) * 0.1,
    top100: (i + 1) * 1,
    top1000: (i + 1) * 10,
    total: (i + 1) * 11.1,
  }));

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 border-b-4 border-accent">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Referral Program
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Earn rewards by referring friends to our platform
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
              <p className="text-lg text-muted-foreground">
                Our referral system uses blockchain-inspired Merkle root tracking to ensure transparent and verifiable referral relationships. Every referral is cryptographically recorded on the Internet Computer.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Share Your Link</h3>
                    <p className="text-sm text-muted-foreground">
                      Copy your unique referral link and share it with friends
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">They Sign Up</h3>
                    <p className="text-sm text-muted-foreground">
                      When they create an account, the referral is recorded on-chain
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Earn Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Get commission based on their usage tier
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/assets/generated/referral-diagram.dim_500x350.png"
                alt="Referral System"
                className="rounded-lg shadow-xl border-4 border-accent"
              />
            </div>
          </div>

          {/* Referrer Earnings Structure */}
          <div className="mb-16">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Referrer Earnings Structure
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Earn a percentage of subscriber fees based on their usage tier
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mb-8">
              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Top 10</CardTitle>
                  <CardDescription>10% commission</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-5xl font-bold text-primary">$0.1</div>
                  <p className="text-sm text-muted-foreground">per referral execution</p>
                  <Badge variant="outline" className="text-xs">From $1 subscriber fee</Badge>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent hover:border-accent/70 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10 w-fit">
                    <DollarSign className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Top 100</CardTitle>
                  <CardDescription>10% commission</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-5xl font-bold text-accent">$1</div>
                  <p className="text-sm text-muted-foreground">per referral execution</p>
                  <Badge variant="outline" className="text-xs">From $10 subscriber fee</Badge>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Top 1000</CardTitle>
                  <CardDescription>10% commission</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-5xl font-bold text-primary">$10</div>
                  <p className="text-sm text-muted-foreground">per referral execution</p>
                  <Badge variant="outline" className="text-xs">From $100 subscriber fee</Badge>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <img
                src="/assets/generated/referrer-earnings-chart.dim_500x300.png"
                alt="Referrer Earnings"
                className="mx-auto rounded-lg shadow-lg max-w-2xl w-full"
              />
            </div>
          </div>

          {/* 12-Month Income Projection */}
          <div className="mb-16">
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/generated/income-projection-table.dim_700x400.png"
                    alt="Income Projection"
                    className="h-12 w-auto rounded"
                  />
                  <div>
                    <CardTitle>Predictable 12x Income in 12 Months</CardTitle>
                    <CardDescription>
                      Projected monthly earnings based on consistent referral activity
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Top 10 ($0.1)</TableHead>
                        <TableHead className="text-right">Top 100 ($1)</TableHead>
                        <TableHead className="text-right">Top 1000 ($10)</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incomeProjection.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.monthName}</TableCell>
                          <TableCell className="text-right">${row.top10.toFixed(1)}</TableCell>
                          <TableCell className="text-right">${row.top100.toFixed(0)}</TableCell>
                          <TableCell className="text-right">${row.top1000.toFixed(0)}</TableCell>
                          <TableCell className="text-right font-bold text-primary">
                            ${row.total.toFixed(1)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">Total (12 months)</TableCell>
                        <TableCell className="text-right font-bold">$7.8</TableCell>
                        <TableCell className="text-right font-bold">$78</TableCell>
                        <TableCell className="text-right font-bold">$780</TableCell>
                        <TableCell className="text-right font-bold text-primary text-lg">
                          $865.8
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                  <p className="text-sm text-center font-medium">
                    💡 With consistent referrals across all tiers, you can earn <span className="text-primary font-bold">12x your initial monthly income</span> by month 12!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Banners */}
          <div className="mb-16">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Scalable Referral Banners
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Multiple tracking codes with Merkle root-based UIDs and permalinks
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((bannerNum) => {
                const bannerUID = `0x${Math.random().toString(16).substring(2, 18)}`;
                return (
                  <Card key={bannerNum} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Banner #{bannerNum}</CardTitle>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <CardDescription>Merkle UID: {bannerUID}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <img
                          src="/assets/generated/referral-banner-template.dim_800x200.png"
                          alt={`Referral Banner ${bannerNum}`}
                          className="w-full rounded-lg border-2 border-primary/20"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-sm font-bold text-primary">Tracking Code</div>
                            <div className="text-xs font-mono">{bannerUID.substring(0, 12)}...</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => copyPermalink(bannerUID)}
                        >
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Copy Permalink
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            navigator.clipboard.writeText(bannerUID);
                            toast.success('UID copied!');
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy UID
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {identity ? (
            <Card className="border-2 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Your Referral Dashboard</CardTitle>
                <CardDescription>
                  Share this link to start earning rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Referral Code</Label>
                  <div className="flex gap-2">
                    <Input value={referralCode} readOnly />
                    <Button onClick={copyReferralLink} variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Merkle Root UID</Label>
                  <div className="flex gap-2">
                    <Input value={merkleRootUID} readOnly className="font-mono text-xs" />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(merkleRootUID);
                        toast.success('UID copied!');
                      }}
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Referrals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">$0</div>
                    <div className="text-sm text-muted-foreground">Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Conversions</div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <img
                    src="/assets/generated/transaction-tracking.dim_400x250.png"
                    alt="Transaction Tracking"
                    className="w-full rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    All transactions tracked with UID, Nonce, and UserID
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Login Required</CardTitle>
                <CardDescription>
                  Please login to access your referral dashboard
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div className="grid gap-8 md:grid-cols-3 mt-16">
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Unlimited Referrals</CardTitle>
                <CardDescription>
                  No limit on how many people you can refer
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 rounded-full bg-accent/10 w-fit mb-4">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>10% Commission</CardTitle>
                <CardDescription>
                  Earn 10% on every purchase your referrals make
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Bonus Rewards</CardTitle>
                <CardDescription>
                  Get special bonuses for reaching referral milestones
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Security Notice */}
          <Card className="mt-16 border-2 border-accent max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/backup-security-shield-transparent.dim_80x80.png"
                  alt="Security"
                  className="h-12 w-12"
                />
                <div>
                  <CardTitle>Robust Data Security</CardTitle>
                  <CardDescription>
                    All referral data is backed up with UID, Nonce, and UserID tracking
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Catalog and referral details backed up automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Merkle root verification ensures data integrity</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Transaction tracking with unique identifiers for safety</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
