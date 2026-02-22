import { useState, useEffect } from 'react';
import { useGetSystemStats, useGetAdminStatus, useGetAllFixtures, useGetSocialMediaPlatforms, useUpdateSocialMediaPlatform, useCreateSocialMediaPlatform, useDeleteSocialMediaPlatform, useInitializeDefaultSocialMediaPlatforms } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { getPlatformIcon, getFallbackIcon, previewDomainExtraction } from '../lib/socialMediaUtils';
import {
  Building2,
  BookOpen,
  CheckSquare,
  Users,
  LayoutDashboard,
  Upload,
  FileText,
  AlertCircle,
  ShieldCheck,
  Share2,
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Info,
  TrendingUp,
  Award,
  Shield,
  Crown,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import type { SocialMediaPlatform } from '../backend';
import { toast } from 'sonner';

// Sample data for top referrers predictable income
const topReferrers = [
  { rank: 1, name: 'Alex Johnson', referrals: 245, earnings: '$12,450', predictedMonthly: '$15,000' },
  { rank: 2, name: 'Sarah Chen', referrals: 198, earnings: '$9,890', predictedMonthly: '$12,000' },
  { rank: 3, name: 'Michael Brown', referrals: 176, earnings: '$8,800', predictedMonthly: '$10,500' },
];

export default function AdminDashboard() {
  const { identity, login, clear } = useInternetIdentity();
  const { data: adminStatus, isLoading: adminLoading, error: adminError, isFetched: adminFetched, refetch: refetchAdminStatus } = useGetAdminStatus();
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useGetSystemStats();
  const { data: allFixtures, isLoading: fixturesLoading } = useGetAllFixtures();
  const { data: socialPlatforms = [], isLoading: socialLoading } = useGetSocialMediaPlatforms();
  const updatePlatform = useUpdateSocialMediaPlatform();
  const createPlatform = useCreateSocialMediaPlatform();
  const deletePlatform = useDeleteSocialMediaPlatform();
  const initializeDefaults = useInitializeDefaultSocialMediaPlatforms();
  const navigate = useNavigate();

  const [editingPlatform, setEditingPlatform] = useState<SocialMediaPlatform | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPlatformUrl, setNewPlatformUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedPrincipal, setCopiedPrincipal] = useState(false);

  const isAuthenticated = !!identity;
  const isAdmin = adminStatus?.isAdmin ?? false;
  const isGenesisAdmin = adminStatus?.isGenesisAdmin ?? false;

  // Auto-refresh stats every 30 seconds to keep dashboard in sync
  useEffect(() => {
    const interval = setInterval(() => {
      refetchStats();
      refetchAdminStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchStats, refetchAdminStatus]);

  // Get fixtures for dashboard
  const dashboardFixtures = allFixtures?.find(f => f.id === 'dashboard');
  const featuresFixtures = allFixtures?.find(f => f.id === 'features');

  // Filter platforms by search term (search by platform name - clean domain)
  const filteredPlatforms = socialPlatforms.filter(platform => 
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Preview domain extraction for new URL
  const urlPreview = newPlatformUrl.trim() ? previewDomainExtraction(newPlatformUrl) : null;

  const handleCopyPrincipal = (principal: string) => {
    navigator.clipboard.writeText(principal);
    setCopiedPrincipal(true);
    toast.success('Principal ID copied to clipboard');
    setTimeout(() => setCopiedPrincipal(false), 2000);
  };

  const handleRelogin = async () => {
    await clear();
    setTimeout(() => login(), 300);
  };

  // Show loading state while checking admin status or not authenticated
  if (!isAuthenticated || adminLoading || !adminFetched) {
    return (
      <div className="container px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="mt-6">
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Verifying Admin Access</AlertTitle>
            <AlertDescription>
              Checking your permissions... This ensures Genesis admin access is properly granted.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Show error state if admin check failed
  if (adminError) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Checking Admin Status</AlertTitle>
          <AlertDescription>
            There was an error verifying your admin status. This might be due to a session issue.
            {adminError instanceof Error && ` Error: ${adminError.message}`}
          </AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          <Button variant="outline" onClick={handleRelogin}>Re-login</Button>
        </div>
      </div>
    );
  }

  // Only show access denied if explicitly not admin after successful fetch
  if (!isAdmin && adminFetched) {
    return (
      <div className="container px-4 py-8">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have permission to access the admin dashboard. This page is restricted to administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminStatus && (
              <div className="rounded-lg border bg-muted p-4 space-y-2">
                <p className="text-sm font-medium">Your Current Status:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Principal: <code className="text-xs">{adminStatus.currentPrincipal}</code></p>
                  <p>Admin Access: <Badge variant="destructive">Denied</Badge></p>
                  {adminStatus.genesisAdminPrincipal && (
                    <p>Genesis Admin: <code className="text-xs">{adminStatus.genesisAdminPrincipal}</code></p>
                  )}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
              <Button variant="outline" onClick={handleRelogin}>Try Re-login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: stats ? Number(stats.totalProperties) : 0,
      icon: Building2,
      color: 'text-primary',
      link: '/',
    },
    {
      title: 'Blog Posts',
      value: stats ? Number(stats.totalBlogPosts) : 0,
      icon: BookOpen,
      color: 'text-accent',
      link: '/blog',
    },
    {
      title: 'Features Tracked',
      value: stats ? Number(stats.totalFeatures) : 0,
      icon: CheckSquare,
      color: 'text-chart-3',
      link: '/features',
    },
    {
      title: 'Total Users',
      value: stats ? Number(stats.totalUsers) : 0,
      icon: Users,
      color: 'text-chart-4',
      link: '/',
    },
  ];

  const quickActions = [
    {
      title: 'Upload Property',
      description: 'Add new property to the platform',
      icon: Upload,
      action: () => navigate({ to: '/' }),
    },
    {
      title: 'Manage Features',
      description: 'Track feature development progress',
      icon: CheckSquare,
      action: () => navigate({ to: '/features' }),
    },
    {
      title: 'Create Blog Post',
      description: 'Write and publish new blog content',
      icon: FileText,
      action: () => navigate({ to: '/blog' }),
    },
  ];

  const handleUpdatePlatform = (platform: SocialMediaPlatform, updates: Partial<SocialMediaPlatform>) => {
    updatePlatform.mutate({
      id: platform.id,
      url: updates.url ?? platform.url,
      displayOrder: updates.displayOrder ?? platform.displayOrder,
      active: updates.active ?? platform.active,
    });
  };

  const handleAddPlatform = () => {
    if (!newPlatformUrl.trim()) {
      return;
    }
    
    const maxOrder = socialPlatforms.reduce((max, p) => Math.max(max, Number(p.displayOrder)), 0);
    
    createPlatform.mutate({
      url: newPlatformUrl,
      displayOrder: BigInt(maxOrder + 1),
      active: true,
    }, {
      onSuccess: () => {
        setNewPlatformUrl('');
        setIsAddDialogOpen(false);
      },
    });
  };

  const handleDeletePlatform = (id: string) => {
    if (confirm('Are you sure you want to delete this social media platform?')) {
      deletePlatform.mutate(id);
    }
  };

  const handleInitializeDefaults = () => {
    if (confirm('This will initialize default social media platforms. Continue?')) {
      initializeDefaults.mutate();
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and quick actions</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => {
          refetchStats();
          refetchAdminStatus();
        }} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Admin Status Indicator */}
      {adminStatus && (
        <Card className="mb-8 border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isGenesisAdmin ? (
                  <Crown className="h-8 w-8 text-accent" />
                ) : (
                  <Shield className="h-8 w-8 text-primary" />
                )}
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Admin Status
                    {isGenesisAdmin && (
                      <Badge variant="default" className="gap-1 bg-accent">
                        <Crown className="h-3 w-3" />
                        Genesis Admin
                      </Badge>
                    )}
                    {isAdmin && !isGenesisAdmin && (
                      <Badge variant="default" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isGenesisAdmin 
                      ? 'You are the Genesis (first) admin with permanent, irrevocable access'
                      : 'You have admin access to manage the platform'}
                  </CardDescription>
                </div>
              </div>
              <img 
                src="/assets/generated/admin-status-badge-transparent.dim_200x100.png" 
                alt="Admin Badge" 
                className="h-16 w-auto opacity-80"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border-2 bg-background p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Your Principal ID</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyPrincipal(adminStatus.currentPrincipal)}
                    className="h-8 gap-2"
                  >
                    {copiedPrincipal ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <code className="block text-xs break-all bg-muted p-2 rounded">
                  {adminStatus.currentPrincipal}
                </code>
              </div>
              
              {adminStatus.genesisAdminPrincipal && (
                <div className="rounded-lg border-2 bg-background p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Crown className="h-4 w-4 text-accent" />
                      Genesis Admin Principal
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyPrincipal(adminStatus.genesisAdminPrincipal!)}
                      className="h-8 gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <code className="block text-xs break-all bg-muted p-2 rounded">
                    {adminStatus.genesisAdminPrincipal}
                  </code>
                  {isGenesisAdmin && (
                    <p className="text-xs text-muted-foreground">
                      ✓ This is you! Your admin access is permanent and cannot be revoked.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {isGenesisAdmin && (
              <Alert className="mt-4 border-accent/50 bg-accent/5">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <AlertTitle>Bulletproof Admin Access</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>
                    As the Genesis admin (first logged-in user), your admin access is:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Permanent:</strong> Cannot be revoked or lost</li>
                    <li><strong>Session-independent:</strong> Survives logouts and re-logins</li>
                    <li><strong>Upgrade-persistent:</strong> Preserved across canister upgrades</li>
                    <li><strong>Principal-locked:</strong> Tied to your Internet Identity principal</li>
                  </ul>
                  <p className="text-xs mt-2">
                    Your principal is stored in stable memory and checked on every admin operation.
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {statsLoading ? (
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card 
              key={stat.title} 
              className="border-2 shadow-lg cursor-pointer transition-all hover:shadow-xl hover:border-primary group"
              onClick={() => navigate({ to: stat.link })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate({ to: stat.link });
                }
              }}
              aria-label={`View ${stat.title} - ${stat.value} items`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                  {stat.title}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">
                  Click to view details
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Predictable Income Table for Top Referrers */}
      <Card className="mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Predictable Income - Top Referrers</CardTitle>
              <CardDescription>
                Track earnings and predicted monthly income for top-performing referrers
              </CardDescription>
            </div>
          </div>
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
          <div className="mt-4 rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-sm text-muted-foreground">
              View full referral analytics and income predictions in the <a href="/referral" className="text-primary hover:underline font-semibold">Referral Dashboard</a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fixtures Status Overview */}
      {!fixturesLoading && (dashboardFixtures || featuresFixtures) && (
        <Card className="mb-8 border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/merkle-tree-icon-transparent.dim_64x64.png" 
                alt="Merkle Tree" 
                className="h-10 w-10"
              />
              <div>
                <CardTitle>Cryptographic Verification Status</CardTitle>
                <CardDescription>Data integrity verification using Merkle/Verkle tree proofs</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {featuresFixtures && (
                <div className="rounded-lg border-2 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Features Data</h3>
                    <div className="flex items-center gap-2">
                      {featuresFixtures.proofStatus === 'verified' ? (
                        <img 
                          src="/assets/generated/fixtures-verified-icon-transparent.dim_64x64.png" 
                          alt="Verified" 
                          className="h-5 w-5"
                        />
                      ) : (
                        <img 
                          src="/assets/generated/fixtures-warning-icon-transparent.dim_64x64.png" 
                          alt="Warning" 
                          className="h-5 w-5"
                        />
                      )}
                      <Badge variant={featuresFixtures.proofStatus === 'verified' ? 'default' : 'destructive'}>
                        {featuresFixtures.proofStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verification:</span>
                      <span className="font-medium">{featuresFixtures.verificationResult}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verkle Leaves:</span>
                      <span className="font-medium">{featuresFixtures.verkleLeaves.length}</span>
                    </div>
                    {featuresFixtures.autoUpdateRecommendations.length > 0 && (
                      <div className="mt-3 rounded-md bg-accent/10 p-2">
                        <p className="text-xs font-medium text-accent">
                          {featuresFixtures.autoUpdateRecommendations.length} recommendations available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {dashboardFixtures && (
                <div className="rounded-lg border-2 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Dashboard Data</h3>
                    <div className="flex items-center gap-2">
                      {dashboardFixtures.proofStatus === 'verified' ? (
                        <img 
                          src="/assets/generated/fixtures-verified-icon-transparent.dim_64x64.png" 
                          alt="Verified" 
                          className="h-5 w-5"
                        />
                      ) : (
                        <img 
                          src="/assets/generated/fixtures-warning-icon-transparent.dim_64x64.png" 
                          alt="Warning" 
                          className="h-5 w-5"
                        />
                      )}
                      <Badge variant={dashboardFixtures.proofStatus === 'verified' ? 'default' : 'destructive'}>
                        {dashboardFixtures.proofStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verification:</span>
                      <span className="font-medium">{dashboardFixtures.verificationResult}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verkle Leaves:</span>
                      <span className="font-medium">{dashboardFixtures.verkleLeaves.length}</span>
                    </div>
                    {dashboardFixtures.discrepancyResolution && (
                      <div className="mt-3 rounded-md bg-muted p-2">
                        <p className="text-xs">{dashboardFixtures.discrepancyResolution}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {!featuresFixtures && !dashboardFixtures && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Fixtures Data</AlertTitle>
                <AlertDescription>
                  Cryptographic verification fixtures have not been initialized yet. Visit the Features page to generate proofs.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Social Media Management Section */}
      <Card className="mb-8 border-2 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Share2 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Social Media Management</CardTitle>
                <CardDescription>
                  Add social media URLs - the backend automatically extracts clean domain names for platform names and icons
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {socialPlatforms.length === 0 && (
                <Button onClick={handleInitializeDefaults} variant="outline" size="sm">
                  Initialize Defaults
                </Button>
              )}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Platform
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Social Media Platform</DialogTitle>
                    <DialogDescription>
                      Enter the full URL - the backend will automatically extract the clean domain name
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-url">URL</Label>
                      <Input
                        id="new-url"
                        value={newPlatformUrl}
                        onChange={(e) => setNewPlatformUrl(e.target.value)}
                        placeholder="https://refresh.me/?plan=3b&via=66ef19"
                      />
                    </div>
                    
                    {/* Live Preview */}
                    {urlPreview && (
                      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-2">Backend will auto-extract:</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground min-w-[100px]">Platform Name:</span>
                                <span className="font-mono font-semibold text-primary">{urlPreview.platformName}</span>
                                <span className="text-xs text-muted-foreground">(first letter capitalized)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground min-w-[100px]">Icon Name:</span>
                                <span className="font-mono font-semibold text-primary">{urlPreview.iconName}</span>
                                <span className="text-xs text-muted-foreground">(lowercase domain)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground min-w-[100px]">Icon Preview:</span>
                                <img 
                                  src={getPlatformIcon(urlPreview.iconName)} 
                                  alt={`${urlPreview.platformName} icon`}
                                  className="h-6 w-6 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = getFallbackIcon();
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1 pl-8">
                          <p>✓ Protocols (http://, https://) removed</p>
                          <p>✓ www. prefix removed</p>
                          <p>✓ All paths, queries, and symbols removed</p>
                          <p>✓ Only clean domain name extracted</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-2">
                      <p className="font-semibold">Examples:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>• https://refresh.me/?plan=3b → Platform: "Refresh", Icon: "refresh"</p>
                        <p>• https://www.facebook.com/secoinfi → Platform: "Facebook", Icon: "facebook"</p>
                        <p>• https://t.me/dilee → Platform: "T", Icon: "t"</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsAddDialogOpen(false);
                      setNewPlatformUrl('');
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPlatform} disabled={!newPlatformUrl.trim()}>
                      Add Platform
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Field */}
          {socialPlatforms.length > 0 && (
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search platforms by name (e.g., Facebook, Refresh)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {socialLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : filteredPlatforms.length === 0 && searchTerm ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Results</AlertTitle>
              <AlertDescription>
                No platforms found matching "{searchTerm}". Search uses the platform name (e.g., "Facebook", "Refresh").
              </AlertDescription>
            </Alert>
          ) : socialPlatforms.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Social Media Platforms</AlertTitle>
              <AlertDescription>
                Click "Initialize Defaults" to add default social media platforms, or "Add Platform" to add custom ones.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {filteredPlatforms.map((platform) => (
                <div key={platform.id} className="rounded-lg border-2 p-4">
                  {editingPlatform?.id === platform.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`url-${platform.id}`}>URL</Label>
                        <Input
                          id={`url-${platform.id}`}
                          value={editingPlatform.url}
                          onChange={(e) => setEditingPlatform({ ...editingPlatform, url: e.target.value })}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Backend will auto-extract clean domain name for platform name and icon
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={editingPlatform.active}
                            onCheckedChange={(checked) => setEditingPlatform({ ...editingPlatform, active: checked })}
                          />
                          <Label>Active</Label>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingPlatform(null)}>
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              handleUpdatePlatform(platform, editingPlatform);
                              setEditingPlatform(null);
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <img 
                            src={getPlatformIcon(platform.icon)} 
                            alt={`${platform.name} icon`}
                            className="h-6 w-6 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = getFallbackIcon();
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{platform.name}</h3>
                            <Badge variant={platform.active ? 'default' : 'secondary'}>
                              {platform.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <a 
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors break-all inline-flex items-center gap-1 group"
                          >
                            <span className="group-hover:underline">{platform.url}</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                          <p className="text-xs text-muted-foreground mt-1">
                            Domain: <span className="font-mono">{platform.icon}</span> • Order: {Number(platform.displayOrder)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPlatform(platform)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePlatform(platform.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer border-2 shadow-lg transition-all hover:shadow-xl hover:border-primary"
              onClick={action.action}
            >
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Platform health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Backend Status</span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authentication</span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Sync</span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                Synced
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Admin Access</span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                {isGenesisAdmin && <Crown className="h-3 w-3" />}
                {isGenesisAdmin ? 'Genesis Admin' : 'Admin'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cryptographic Verification</span>
              {featuresFixtures?.proofStatus === 'verified' ? (
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                  Verified
                </span>
              ) : (
                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                  Pending
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

