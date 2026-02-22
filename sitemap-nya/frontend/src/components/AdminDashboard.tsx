import { useState } from 'react';
import { useGetSitemaps, useAddSitemap, useIsStripeConfigured, useSetStripeConfiguration } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Database, CreditCard, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { data: sitemaps, isLoading: sitemapsLoading } = useGetSitemaps();
  const { data: isStripeConfigured } = useIsStripeConfigured();
  const addSitemap = useAddSitemap();
  const setStripeConfig = useSetStripeConfiguration();

  const [newDomain, setNewDomain] = useState('');
  const [newJsonData, setNewJsonData] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [allowedCountries, setAllowedCountries] = useState('US,CA,GB,AU,DE,FR,IT,ES,NL,SE,NO,DK,FI');

  const handleAddSitemap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDomain.trim() || !newJsonData.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      JSON.parse(newJsonData); // Validate JSON
      await addSitemap.mutateAsync({
        domain: newDomain.trim(),
        jsonData: newJsonData.trim()
      });
      setNewDomain('');
      setNewJsonData('');
      toast.success('Sitemap added successfully');
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON format');
      } else {
        toast.error('Failed to add sitemap');
      }
    }
  };

  const handleConfigureStripe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripeSecretKey.trim()) {
      toast.error('Please enter Stripe secret key');
      return;
    }

    try {
      await setStripeConfig.mutateAsync({
        secretKey: stripeSecretKey.trim(),
        allowedCountries: allowedCountries.split(',').map(c => c.trim()).filter(c => c)
      });
      setStripeSecretKey('');
      toast.success('Stripe configuration saved successfully');
    } catch (error) {
      toast.error('Failed to configure Stripe');
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sitemaps</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sitemaps?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Domains indexed</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stripe Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={isStripeConfigured ? "default" : "destructive"}>
              {isStripeConfigured ? "Configured" : "Not Configured"}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Payment processing</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="default">Online</Badge>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sitemaps" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sitemaps">Sitemap Management</TabsTrigger>
          <TabsTrigger value="payments">Payment Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sitemaps" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add New Sitemap</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSitemap} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jsonData">JSON Data</Label>
                    <Textarea
                      id="jsonData"
                      placeholder='{"urls": ["https://example.com/page1", "https://example.com/page2"]}'
                      value={newJsonData}
                      onChange={(e) => setNewJsonData(e.target.value)}
                      rows={6}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={addSitemap.isPending}
                    className="w-full"
                  >
                    {addSitemap.isPending ? 'Adding...' : 'Add Sitemap'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Sitemaps</CardTitle>
              </CardHeader>
              <CardContent>
                {sitemapsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-12 bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {sitemaps?.slice(0, 10).map((sitemap, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{sitemap.domain}</p>
                            <p className="text-xs text-muted-foreground">
                              Updated: {formatDate(sitemap.lastUpdated)}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {(sitemap.jsonData.length / 1024).toFixed(1)}KB
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Stripe Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isStripeConfigured ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-500 font-medium">✓ Stripe is configured</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Payment processing is active and ready to accept subscriptions.
                    </p>
                  </div>
                  <form onSubmit={handleConfigureStripe} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stripe-key">Update Secret Key</Label>
                      <Input
                        id="stripe-key"
                        type="password"
                        placeholder="sk_test_..."
                        value={stripeSecretKey}
                        onChange={(e) => setStripeSecretKey(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
                      <Input
                        id="countries"
                        placeholder="US,CA,GB,AU,DE,FR"
                        value={allowedCountries}
                        onChange={(e) => setAllowedCountries(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={setStripeConfig.isPending}
                      variant="outline"
                    >
                      {setStripeConfig.isPending ? 'Updating...' : 'Update Configuration'}
                    </Button>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleConfigureStripe} className="space-y-4">
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-500 font-medium">⚠ Stripe not configured</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure Stripe to enable payment processing for subscriptions.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-key">Stripe Secret Key</Label>
                    <Input
                      id="stripe-key"
                      type="password"
                      placeholder="sk_test_..."
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
                    <Input
                      id="countries"
                      placeholder="US,CA,GB,AU,DE,FR"
                      value={allowedCountries}
                      onChange={(e) => setAllowedCountries(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={setStripeConfig.isPending}
                    className="w-full"
                  >
                    {setStripeConfig.isPending ? 'Configuring...' : 'Configure Stripe'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Analytics features coming soon...</p>
                <p className="text-sm mt-2">Track user activity, subscription metrics, and usage statistics.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
