import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetCallerUserProfile, useGetSitemaps, useAddSitemap, useDeleteSitemap } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Globe, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { Sitemap } from '../backend';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: sitemaps } = useGetSitemaps();
  const addSitemap = useAddSitemap();
  const deleteSitemap = useDeleteSitemap();

  const [newSitemapUrl, setNewSitemapUrl] = useState('');
  const [newSitemapDomain, setNewSitemapDomain] = useState('');

  const userSitemaps = sitemaps?.filter(s => 
    s.owner.toString() === identity?.getPrincipal().toString()
  ) || [];

  const handleAddSitemap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSitemapUrl.trim() || !newSitemapDomain.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const tld = newSitemapDomain.split('.').pop() || 'com';
      const now = BigInt(Date.now() * 1000000);
      
      const sitemap: Sitemap = {
        id: Math.random().toString(36).substring(2),
        url: newSitemapUrl.trim(),
        domain: newSitemapDomain.trim(),
        tld,
        urlCount: BigInt(0),
        createdAt: now,
        lastUpdated: now,
        owner: identity!.getPrincipal(),
      };

      await addSitemap.mutateAsync(sitemap);
      toast.success('Sitemap added successfully!');
      setNewSitemapUrl('');
      setNewSitemapDomain('');
    } catch (error) {
      toast.error('Failed to add sitemap');
      console.error(error);
    }
  };

  const handleDeleteSitemap = async (sitemapId: string) => {
    try {
      await deleteSitemap.mutateAsync(sitemapId);
      toast.success('Sitemap deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete sitemap');
      console.error(error);
    }
  };

  const getSubscriptionBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      free: 'secondary',
      basic: 'default',
      premium: 'default',
      enterprise: 'default',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your sitemaps and account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">{userProfile?.name}</p>
                <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                {userProfile && getSubscriptionBadge(userProfile.subscriptionStatus)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Sitemaps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userSitemaps.length}</p>
              <p className="text-sm text-muted-foreground">Total sitemaps</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Code</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-mono font-bold">{userProfile?.referralCode}</p>
              <p className="text-sm text-muted-foreground">Share to earn rewards</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sitemaps" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sitemaps">My Sitemaps</TabsTrigger>
            <TabsTrigger value="add">Add Sitemap</TabsTrigger>
          </TabsList>

          <TabsContent value="sitemaps" className="space-y-4">
            {userSitemaps.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No sitemaps yet. Add your first sitemap!</p>
                </CardContent>
              </Card>
            ) : (
              userSitemaps.map((sitemap) => (
                <Card key={sitemap.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-primary" />
                          {sitemap.domain}
                        </CardTitle>
                        <CardDescription className="mt-2">{sitemap.url}</CardDescription>
                      </div>
                      <Badge variant="secondary">.{sitemap.tld}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {Number(sitemap.urlCount)} URLs
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(sitemap.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteSitemap(sitemap.id)}
                          disabled={deleteSitemap.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Sitemap</CardTitle>
                <CardDescription>
                  Import a sitemap by providing the URL and domain information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSitemap} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={newSitemapDomain}
                      onChange={(e) => setNewSitemapDomain(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="url">Sitemap URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/sitemap.xml"
                      value={newSitemapUrl}
                      onChange={(e) => setNewSitemapUrl(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={addSitemap.isPending}>
                    <Plus className="h-4 w-4 mr-2" />
                    {addSitemap.isPending ? 'Adding...' : 'Add Sitemap'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
