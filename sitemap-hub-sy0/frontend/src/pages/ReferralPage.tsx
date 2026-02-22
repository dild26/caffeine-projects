import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetCallerUserProfile, useGetReferralsByReferrer } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { Copy, Download, Users, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReferralPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const principal = identity?.getPrincipal();
  const { data: referrals = [] } = useGetReferralsByReferrer(principal);
  const [copied, setCopied] = useState(false);

  if (!identity) {
    navigate({ to: '/' });
    return null;
  }

  if (!userProfile) {
    return null;
  }

  const totalCommission = referrals.reduce((sum, ref) => sum + Number(ref.commission), 0);
  const referralUrl = `${window.location.origin}?ref=${userProfile.referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportData = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const csv = [
        'Referrer,Referred,Commission,Date',
        ...referrals.map((r) =>
          [
            r.referrer.toString(),
            r.referred.toString(),
            (Number(r.commission) / 100).toFixed(2),
            new Date(Number(r.createdAt) / 1000000).toLocaleDateString(),
          ].join(',')
        ),
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'referrals.csv';
      a.click();
    } else {
      const json = JSON.stringify(referrals, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'referrals.json';
      a.click();
    }
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="container px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Referral Program</h1>
        <p className="text-muted-foreground">Earn commissions by referring new users</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{referrals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(totalCommission / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Commission earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {referrals.length > 0 ? ((referrals.length / (referrals.length + 10)) * 100).toFixed(1) : '0'}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Estimated rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn commissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
            />
            <Button onClick={copyReferralLink} variant="outline">
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Code: {userProfile.referralCode}</Badge>
            <Badge variant="outline">10% commission on all referrals</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>Track your referrals and earnings</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportData('json')}>
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No referrals yet. Start sharing your link!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referred User</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">{referral.referred.toString().slice(0, 20)}...</TableCell>
                    <TableCell className="font-semibold">${(Number(referral.commission) / 100).toFixed(2)}</TableCell>
                    <TableCell>{new Date(Number(referral.createdAt) / 1000000).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Copy your unique referral link and share it with friends, colleagues, or on social media.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">They Subscribe</h3>
              <p className="text-sm text-muted-foreground">
                When someone signs up using your link and subscribes to any plan, you earn a commission.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Receive 10% commission on their subscription payments. Track earnings in real-time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
