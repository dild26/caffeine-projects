import { useEffect } from 'react';
import { useListCompareProviders, useCreateCompareProvider, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, TrendingDown } from 'lucide-react';
import type { CompareProvider } from '../types';

export default function ComparePage() {
  const { data: providers = [], isLoading } = useListCompareProviders();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const createCompareProvider = useCreateCompareProvider();

  useEffect(() => {
    // Auto-populate default providers if admin and list is empty
    if (isAdmin && providers.length === 0 && !isLoading) {
      const defaultProviders: CompareProvider[] = [
        { rank: BigInt(1), provider: 'ICP Cloud Storage', pricePerGB: '$0.46', providerType: 'Blockchain', notes: 'Decentralized, secure, and cost-effective' },
        { rank: BigInt(2), provider: 'Wasabi', pricePerGB: '$5.99', providerType: 'Cloud', notes: 'Hot cloud storage' },
        { rank: BigInt(3), provider: 'Backblaze B2', pricePerGB: '$6.00', providerType: 'Cloud', notes: 'Affordable cloud storage' },
        { rank: BigInt(4), provider: 'Google Cloud Storage', pricePerGB: '$20.00', providerType: 'Cloud', notes: 'Standard tier' },
        { rank: BigInt(5), provider: 'Amazon S3', pricePerGB: '$23.00', providerType: 'Cloud', notes: 'Standard storage' },
        { rank: BigInt(6), provider: 'Microsoft Azure', pricePerGB: '$24.00', providerType: 'Cloud', notes: 'Hot tier' },
        { rank: BigInt(7), provider: 'Dropbox', pricePerGB: '$120.00', providerType: 'Cloud', notes: 'Business plan' },
        { rank: BigInt(8), provider: 'Box', pricePerGB: '$180.00', providerType: 'Cloud', notes: 'Business plan' },
        { rank: BigInt(9), provider: 'OneDrive', pricePerGB: '$70.00', providerType: 'Cloud', notes: 'Business plan' },
        { rank: BigInt(10), provider: 'iCloud', pricePerGB: '$120.00', providerType: 'Cloud', notes: 'Consumer plan' },
      ];

      defaultProviders.forEach(provider => {
        createCompareProvider.mutateAsync(provider).catch(console.error);
      });
    }
  }, [isAdmin, providers.length, isLoading]);

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Cloud Storage Comparison</h1>
          <p className="text-lg text-muted-foreground">
            Compare top cloud storage providers and see why ICP is the best choice
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Price Comparison (per GB/month)</CardTitle>
            <CardDescription>Top 10 cloud storage providers ranked by price</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Price/GB</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow key={Number(provider.rank)} className={Number(provider.rank) === 1 ? 'bg-primary/5' : ''}>
                      <TableCell className="font-bold">#{Number(provider.rank)}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {provider.provider}
                          {Number(provider.rank) === 1 && (
                            <Badge variant="default" className="ml-2">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Best Value
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={Number(provider.rank) === 1 ? 'text-primary font-bold text-lg' : ''}>
                          {provider.pricePerGB}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={provider.providerType === 'Blockchain' ? 'default' : 'secondary'}>
                          {provider.providerType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{provider.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-primary" />
                Cost Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  ICP Cloud Storage offers up to <span className="font-bold text-primary">98% cost savings</span> compared to traditional cloud providers.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-primary">$0.46</p>
                    <p className="text-xs text-muted-foreground">ICP per GB/month</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">$23.00</p>
                    <p className="text-xs text-muted-foreground">AWS S3 per GB/month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                ICP Advantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span><strong>Decentralized:</strong> No single point of failure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span><strong>Secure:</strong> Blockchain-based immutability</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span><strong>Cost-effective:</strong> Up to 98% cheaper</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span><strong>Fast:</strong> Global CDN with low latency</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span><strong>Transparent:</strong> On-chain verification</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visual Comparison</CardTitle>
            <CardDescription>See the price difference at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <img 
              src="/assets/cloud-storages-compared.png" 
              alt="Cloud Storage Price Comparison" 
              className="w-full rounded-lg border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
