import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Copy, Check, Share2, TrendingUp, Users, Coins, Shield, Infinity, DollarSign, Award, Sparkles, Hash, BarChart3 } from 'lucide-react';

interface BannerSize {
  name: string;
  width: number;
  height: number;
  image: string;
}

const bannerSizes: BannerSize[] = [
  { name: 'Small Button', width: 120, height: 60, image: '/assets/generated/secoin-banner-120x60.dim_120x60.png' },
  { name: 'Medium Rectangle', width: 300, height: 250, image: '/assets/generated/secoin-banner-300x250.dim_300x250.png' },
  { name: 'Leaderboard', width: 728, height: 90, image: '/assets/generated/secoin-banner-728x90.dim_728x90.png' },
  { name: 'Large Banner', width: 1200, height: 400, image: '/assets/generated/secoin-banner-1200x400.dim_1200x400.png' },
];

// Sample payout data for top referrers
const topReferrers = [
  { rank: 1, name: 'Alex Johnson', referrals: 245, earnings: '$12,450', predictedMonthly: '$15,000' },
  { rank: 2, name: 'Sarah Chen', referrals: 198, earnings: '$9,890', predictedMonthly: '$12,000' },
  { rank: 3, name: 'Michael Brown', referrals: 176, earnings: '$8,800', predictedMonthly: '$10,500' },
  { rank: 4, name: 'Emma Davis', referrals: 152, earnings: '$7,600', predictedMonthly: '$9,200' },
  { rank: 5, name: 'James Wilson', referrals: 134, earnings: '$6,700', predictedMonthly: '$8,000' },
];

function BannerCard({ banner }: { banner: BannerSize }) {
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedObject, setCopiedObject] = useState(false);

  const currentDomain = window.location.origin;
  
  // Generate unique tracking ID using Merkle root concept (simplified for demo)
  const generateTrackingId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}`;
  };

  const trackingId = generateTrackingId();
  const trackedUrl = `${currentDomain}?ref=${trackingId}`;

  const iframeCode = `<iframe src="${trackedUrl}" width="${banner.width}" height="${banner.height}" frameborder="0" scrolling="no" title="SECoin Property Investment" data-tracking-id="${trackingId}"></iframe>`;

  const objectCode = `<object data="${trackedUrl}" width="${banner.width}" height="${banner.height}" type="text/html" data-tracking-id="${trackingId}">
  <a href="${trackedUrl}">
    <img src="${currentDomain}${banner.image}" alt="SECoin Property Investment" width="${banner.width}" height="${banner.height}" />
  </a>
</object>`;

  const handleCopy = async (code: string, type: 'iframe' | 'object') => {
    try {
      await navigator.clipboard.writeText(code);
      if (type === 'iframe') {
        setCopiedIframe(true);
        setTimeout(() => setCopiedIframe(false), 2000);
      } else {
        setCopiedObject(true);
        setTimeout(() => setCopiedObject(false), 2000);
      }
      toast.success('Code copied with tracking ID!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Share2 className="h-5 w-5 text-accent" />
          {banner.name}
        </CardTitle>
        <CardDescription>
          Size: {banner.width} × {banner.height} pixels • Tracking ID: {trackingId.substring(0, 12)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Live Preview */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Live Preview</h3>
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-primary/30 bg-muted/30 p-4">
            <div
              className="overflow-hidden rounded-lg shadow-md"
              style={{ width: banner.width, height: banner.height }}
            >
              <img
                src={banner.image}
                alt={`SECoin ${banner.name}`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Merkle Root Tracking Info */}
        <div className="rounded-lg border-2 border-accent/20 bg-accent/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold">Merkle Root-Based Tracking</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Each banner includes a unique tracking ID (UID/Nonce) for comprehensive referral attribution and payout calculation.
          </p>
        </div>

        {/* Embed Codes */}
        <Tabs defaultValue="iframe" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="iframe">iframe</TabsTrigger>
            <TabsTrigger value="object">object</TabsTrigger>
          </TabsList>

          <TabsContent value="iframe" className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">iframe Embed Code</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(iframeCode, 'iframe')}
                  className="gap-2"
                >
                  {copiedIframe ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={iframeCode}
                readOnly
                className="font-mono text-xs"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="object" className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">object Embed Code</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(objectCode, 'object')}
                  className="gap-2"
                >
                  {copiedObject ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={objectCode}
                readOnly
                className="font-mono text-xs"
                rows={6}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function Referral() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-accent/10 p-4">
            <Share2 className="h-12 w-12 text-accent" />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
          Referral Program
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Join SECoin's revolutionary referral program and unlock unlimited earning potential through our unique profit-sharing system.
        </p>
      </div>

      {/* Earning Opportunities Hero Banner */}
      <Card className="mb-8 overflow-hidden border-2 border-accent bg-gradient-to-br from-accent/20 via-primary/10 to-accent/5">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex-shrink-0">
              <div className="rounded-2xl bg-accent/20 p-6">
                <img 
                  src="/assets/generated/profit-share-levels-icon-transparent.dim_64x64.png" 
                  alt="Profit Share Levels" 
                  className="h-16 w-16"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <Badge className="bg-accent text-accent-foreground">NEW</Badge>
                <Badge variant="outline" className="border-accent text-accent">Unlimited Earning</Badge>
              </div>
              <h2 className="mb-3 text-3xl font-bold text-foreground">
                Earn from Profit Share from Unlimited Levels
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience the power of multi-level earnings with no caps or limits. Every referral creates a lasting income stream that grows with your network.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictable Income Table for Top Referrers */}
      <Card className="mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-primary/20 p-6">
              <img 
                src="/assets/generated/predictable-income-table.dim_800x600.png" 
                alt="Predictable Income" 
                className="h-16 w-16"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            <BarChart3 className="mb-2 inline-block h-8 w-8 text-primary" />
            {' '}Predictable Income for Top Referrers
          </CardTitle>
          <CardDescription className="text-lg">
            See how our top performers are earning consistent, predictable income through the referral program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead className="text-right">Total Referrals</TableHead>
                  <TableHead className="text-right">Total Earnings</TableHead>
                  <TableHead className="text-right">Predicted Monthly</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topReferrers.map((referrer) => (
                  <TableRow key={referrer.rank}>
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        {referrer.rank === 1 && <Award className="h-5 w-5 text-accent" />}
                        #{referrer.rank}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{referrer.name}</TableCell>
                    <TableCell className="text-right">{referrer.referrals}</TableCell>
                    <TableCell className="text-right font-semibold text-accent">{referrer.earnings}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{referrer.predictedMonthly}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Join these top earners!</strong> Start building your network today and create a predictable passive income stream.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Unique Earning Opportunities Section */}
      <div className="mb-8">
        <h2 className="mb-6 text-center text-3xl font-bold text-foreground">
          <Sparkles className="mb-2 inline-block h-8 w-8 text-accent" />
          {' '}Unique Earning Opportunities
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Unlimited Levels */}
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="mb-3 flex justify-center">
                <div className="rounded-xl bg-primary/10 p-4">
                  <Infinity className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center text-xl">Unlimited Levels</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Earn commissions from <strong className="text-accent">every level</strong> of your referral network with no depth restrictions. Your earning potential is truly limitless.
              </p>
            </CardContent>
          </Card>

          {/* Profit Share Distribution */}
          <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <div className="mb-3 flex justify-center">
                <div className="rounded-xl bg-accent/10 p-4">
                  <TrendingUp className="h-10 w-10 text-accent" />
                </div>
              </div>
              <CardTitle className="text-center text-xl">Profit Share Distribution</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Receive a <strong className="text-accent">percentage of platform fees</strong> from all transactions made by your referrals and their networks.
              </p>
            </CardContent>
          </Card>

          {/* Passive Income */}
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="mb-3 flex justify-center">
                <div className="rounded-xl bg-primary/10 p-4">
                  <DollarSign className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center text-xl">Passive Income Stream</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Build a <strong className="text-accent">sustainable passive income</strong> as your network grows and generates ongoing transactions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* USP Section - Unique Nonce & Running Balance */}
      <Card className="mb-8 border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-accent/20 p-6">
              <img 
                src="/assets/generated/nonce-balance-icon-transparent.dim_64x64.png" 
                alt="Nonce Balance System" 
                className="h-16 w-16"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            <Award className="mb-2 inline-block h-8 w-8 text-accent" />
            {' '}Our Unique Advantage
          </CardTitle>
          <CardDescription className="text-lg">
            Revolutionary tracking and distribution system powered by blockchain technology
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Unique Nonce System */}
            <div className="rounded-xl border-2 border-primary/20 bg-background/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Unique Nonce System</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Every member and referrer is assigned a <strong className="text-accent">cryptographically unique nonce</strong> that ensures:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span><strong className="text-foreground">Accurate tracking</strong> of all referral relationships</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span><strong className="text-foreground">Tamper-proof identification</strong> preventing fraud</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span><strong className="text-foreground">Transparent attribution</strong> of earnings</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span><strong className="text-foreground">Lifetime member identification</strong> across the platform</span>
                </li>
              </ul>
            </div>

            {/* Running Balance Tracking */}
            <div className="rounded-xl border-2 border-accent/20 bg-background/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-3">
                  <Coins className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Running Balance Tracking</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Our advanced system maintains a <strong className="text-accent">real-time running balance</strong> of fees earned:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span><strong className="text-foreground">Instant updates</strong> as transactions occur</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span><strong className="text-foreground">Transparent calculation</strong> of profit distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span><strong className="text-foreground">Automated payouts</strong> based on accumulated earnings</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span><strong className="text-foreground">Complete audit trail</strong> for all earnings</span>
                </li>
              </ul>
            </div>
          </div>

          {/* How It Works */}
          <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6">
            <h3 className="mb-4 text-center text-xl font-bold text-foreground">
              How the Distribution Works
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">
                    1
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Transaction occurs</strong> in your referral network
                </p>
              </div>
              <div className="text-center">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">
                    2
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Unique nonce identifies</strong> all eligible referrers
                </p>
              </div>
              <div className="text-center">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">
                    3
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Running balance updates</strong> with your earned share
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits for Members */}
      <Card className="mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            <Users className="mb-2 inline-block h-7 w-7 text-primary" />
            {' '}Benefits for All Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
              <h4 className="mb-2 font-bold text-foreground">For New Members</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>Start earning immediately from your first referral</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>No minimum network size required to begin earning</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>Full transparency in tracking and earnings</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h4 className="mb-2 font-bold text-foreground">For Existing Members</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Compound your earnings as your network expands</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Benefit from unlimited level depth in your network</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Enjoy passive income from established referral chains</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Embeddable Banners Section */}
      <div className="mb-8">
        <h2 className="mb-6 text-center text-3xl font-bold text-foreground">
          Embeddable Referral Banners with Merkle Root Tracking
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          Share SECoin with your audience using our professionally designed banners with built-in tracking
        </p>

        {/* Info Card */}
        <Card className="mb-8 border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <img 
                src="/assets/generated/referral-tracking-merkle.dim_800x600.png" 
                alt="Merkle Tracking" 
                className="h-8 w-8"
              />
              How to Use with Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              1. <strong className="text-foreground">Choose a banner size</strong> that fits your website layout
            </p>
            <p>
              2. <strong className="text-foreground">Each banner includes a unique tracking ID</strong> (UID/Nonce) for Merkle root-based attribution
            </p>
            <p>
              3. <strong className="text-foreground">Click "Copy"</strong> to copy the embed code with tracking to your clipboard
            </p>
            <p>
              4. <strong className="text-foreground">Paste the code</strong> into your website's HTML where you want the banner to appear
            </p>
            <p>
              5. <strong className="text-foreground">Track your referrals</strong> and earnings through your dashboard with complete transparency
            </p>
          </CardContent>
        </Card>

        {/* Banner Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {bannerSizes.map((banner) => (
            <BannerCard key={`${banner.width}x${banner.height}`} banner={banner} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="border-2 border-accent bg-gradient-to-br from-accent/10 to-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ready to Start Earning?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Join thousands of members already earning through our revolutionary referral program. 
            Start building your network today and unlock unlimited earning potential with predictable income.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              <Users className="h-5 w-5" />
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
