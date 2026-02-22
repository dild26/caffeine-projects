import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Info, Award, HelpCircle, Shield, Lock, Settings, TestTube, Image, BarChart, Layers, Users, AlertCircle, CheckSquare, BookOpen, Plus, Hash, Clock, CheckCircle2, XCircle, Radio } from 'lucide-react';
import { useGetAllPages, useGetAllSitemapEntries, useAddPage, useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function SitemapPage() {
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: allPages, isLoading: pagesLoading } = useGetAllPages();
  const { data: sitemapEntries, isLoading: entriesLoading } = useGetAllSitemapEntries();
  const addPageMutation = useAddPage();

  const [newPageSlug, setNewPageSlug] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPage = async () => {
    if (!newPageSlug.trim()) {
      toast.error('Page slug cannot be empty');
      return;
    }

    try {
      await addPageMutation.mutateAsync(newPageSlug.trim());
      toast.success(`Page "${newPageSlug}" added successfully`);
      setNewPageSlug('');
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add page');
    }
  };

  const sections = [
    {
      title: 'Main Pages',
      icon: FileText,
      links: [
        { to: '/', label: 'Home', adminOnly: false },
        { to: '/catalog', label: 'Catalog', adminOnly: false },
        { to: '/blog', label: 'Blog', adminOnly: false },
      ],
    },
    {
      title: 'Company',
      icon: Info,
      links: [
        { to: '/about', label: 'About', adminOnly: false },
        { to: '/contact', label: 'Contact', adminOnly: false },
        { to: '/terms', label: 'Terms of Service', adminOnly: false },
      ],
    },
    {
      title: 'Features',
      icon: Award,
      links: [
        { to: '/pros', label: 'Pros', adminOnly: false },
        { to: '/what-we-do', label: 'What We Do', adminOnly: false },
        { to: '/why-us', label: 'Why Us', adminOnly: false },
        { to: '/features', label: 'Platform Features', adminOnly: false },
      ],
    },
    {
      title: 'Resources',
      icon: HelpCircle,
      links: [
        { to: '/faq', label: 'FAQ', adminOnly: false },
        { to: '/referral', label: 'Referral Program', adminOnly: false },
        { to: '/trust', label: 'Proof of Trust', adminOnly: false },
        { to: '/sitemap', label: 'Sitemap', adminOnly: false },
      ],
    },
    {
      title: 'User Management',
      icon: Users,
      links: [
        { to: '/subscribers', label: 'Subscribers', adminOnly: false },
      ],
    },
    {
      title: 'Admin Panel',
      icon: Shield,
      links: [
        { to: '/admin', label: 'Admin Panel', adminOnly: true },
        { to: '/dashboard', label: 'Analytics Dashboard', adminOnly: true },
        { to: '/test-guide', label: 'Test Guide', adminOnly: true },
      ],
    },
    {
      title: 'Admin Tools',
      icon: Settings,
      links: [
        { to: '/gallery', label: 'Image Gallery', adminOnly: true },
        { to: '/error-recovery', label: 'Error Recovery', adminOnly: true },
        { to: '/feature-validation', label: 'Feature Validation', adminOnly: true },
      ],
    },
    {
      title: 'Payment',
      icon: BarChart,
      links: [
        { to: '/payment-success', label: 'Payment Success', adminOnly: false },
        { to: '/payment-failure', label: 'Payment Failure', adminOnly: false },
      ],
    },
  ];

  const getRouteTypeIcon = (routeType: string) => {
    switch (routeType) {
      case 'manual':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'appControlled':
        return <Radio className="h-4 w-4 text-purple-500" />;
      case 'systemPreset':
        return <Shield className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRouteTypeBadge = (routeType: string) => {
    switch (routeType) {
      case 'manual':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Manual</Badge>;
      case 'appControlled':
        return <Badge variant="outline" className="text-purple-500 border-purple-500">App-Controlled</Badge>;
      case 'systemPreset':
        return <Badge variant="outline" className="text-green-500 border-green-500">System Preset</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'deleted':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pendingApproval':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Separate pages by type
  const manualPages = sitemapEntries?.filter(e => e.routeType === 'manual' && e.status === 'active') || [];
  const appControlledPages = sitemapEntries?.filter(e => e.routeType === 'appControlled' && e.status === 'active') || [];
  const systemPresetPages = sitemapEntries?.filter(e => e.routeType === 'systemPreset' && e.status === 'active') || [];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-b-4 border-primary">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex justify-center mb-6">
              <img
                src="/assets/generated/sitemap-tree-structure.dim_800x600.png"
                alt="Sitemap"
                className="h-32 w-auto rounded-lg shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Enhanced Sitemap Management
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Navigate through all pages with manual control, app-controlled routes, and comprehensive audit tracking
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container space-y-12">
          {/* Admin Add Page Form */}
          {isAdmin && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/generated/admin-sitemap-management.dim_800x600.png"
                      alt="Admin Sitemap Management"
                      className="h-12 w-auto rounded"
                    />
                    <div>
                      <CardTitle>Admin Sitemap Management</CardTitle>
                      <CardDescription>
                        Add new pages to the manual pages array with validation
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    variant={showAddForm ? "outline" : "default"}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {showAddForm ? 'Cancel' : 'Add Page'}
                  </Button>
                </div>
              </CardHeader>
              {showAddForm && (
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageSlug">Page Slug</Label>
                      <Input
                        id="pageSlug"
                        placeholder="e.g., new-feature"
                        value={newPageSlug}
                        onChange={(e) => setNewPageSlug(e.target.value.toLowerCase())}
                      />
                      <p className="text-xs text-muted-foreground">
                        Must be lowercase, no spaces, unique, and not a reserved keyword
                      </p>
                    </div>

                    <Alert>
                      <img
                        src="/assets/generated/page-slug-validation.dim_600x400.png"
                        alt="Validation"
                        className="h-4 w-4"
                      />
                      <AlertTitle>Validation Rules</AlertTitle>
                      <AlertDescription className="text-xs space-y-1">
                        <div>✓ Lowercase letters only (a-z)</div>
                        <div>✓ Hyphens allowed for word separation</div>
                        <div>✓ No spaces or special characters</div>
                        <div>✓ Must be unique (not already exist)</div>
                        <div>✓ Cannot be a system preset or reserved keyword</div>
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleAddPage}
                      disabled={addPageMutation.isPending || !newPageSlug.trim()}
                      className="w-full"
                    >
                      {addPageMutation.isPending ? 'Adding...' : 'Add Page to Manual Array'}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Priority Pages Section */}
          {(manualPages.length > 0 || appControlledPages.length > 0) && (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/generated/priority-pages-section.dim_700x500.png"
                    alt="Priority Pages"
                    className="h-12 w-auto rounded"
                  />
                  <div>
                    <CardTitle>Priority Pages</CardTitle>
                    <CardDescription>
                      Manual pages and app-controlled routes with enhanced management
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Manual Pages */}
                {manualPages.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">Manual Pages ({manualPages.length})</h3>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {manualPages.map((entry) => (
                        <div
                          key={entry.slug}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {getRouteTypeIcon(entry.routeType)}
                            <span className="text-sm font-medium">/{entry.slug}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              <Hash className="h-3 w-3 mr-1" />
                              {entry.hash}
                            </Badge>
                            {getStatusIcon(entry.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* App-Controlled Routes */}
                {appControlledPages.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/generated/app-controlled-routes-dashboard.dim_800x600.png"
                        alt="App-Controlled Routes"
                        className="h-5 w-auto rounded"
                      />
                      <h3 className="font-semibold">App-Controlled Routes ({appControlledPages.length})</h3>
                    </div>
                    <Alert>
                      <Radio className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        These routes are managed by whitelisted applications and require admin approval
                      </AlertDescription>
                    </Alert>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {appControlledPages.map((entry) => (
                        <div
                          key={entry.slug}
                          className="flex items-center justify-between p-3 rounded-lg border bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {getRouteTypeIcon(entry.routeType)}
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                              /{entry.slug}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs border-purple-500 text-purple-600">
                              Runtime
                            </Badge>
                            {getStatusIcon(entry.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* System Preset Protection Notice */}
          {isAdmin && systemPresetPages.length > 0 && (
            <Alert>
              <img
                src="/assets/generated/system-preset-protection.dim_600x400.png"
                alt="System Preset Protection"
                className="h-4 w-4"
              />
              <AlertTitle>System Preset Protection</AlertTitle>
              <AlertDescription className="text-xs">
                {systemPresetPages.length} system preset pages are protected from deletion or modification.
                These core pages ensure platform stability and cannot be removed.
              </AlertDescription>
            </Alert>
          )}

          {/* Standard Navigation Sections */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="flex flex-col gap-2">
                      {section.links.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                          <span>{link.label}</span>
                          {link.adminOnly && (
                            <Lock className="h-3 w-3 text-primary ml-auto" />
                          )}
                        </Link>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tree Structure Visualization */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Page Hierarchy (Tree Structure)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="font-bold">/ (Root)</div>
                <div className="ml-4">├── /catalog</div>
                <div className="ml-4">├── /blog</div>
                <div className="ml-4">├── /about</div>
                <div className="ml-4">├── /contact</div>
                <div className="ml-4">├── /pros</div>
                <div className="ml-4">├── /what-we-do</div>
                <div className="ml-4">├── /why-us</div>
                <div className="ml-4">├── /features</div>
                <div className="ml-4">├── /faq</div>
                <div className="ml-4">├── /referral</div>
                <div className="ml-4">├── /trust</div>
                <div className="ml-4">├── /terms</div>
                <div className="ml-4">├── /sitemap</div>
                <div className="ml-4">├── /subscribers</div>
                <div className="ml-4">├── /workflow/:id</div>
                <div className="ml-4">├── /payment-success</div>
                <div className="ml-4">├── /payment-failure</div>

                {/* App-Controlled Routes */}
                {appControlledPages.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="text-purple-600 dark:text-purple-400 font-semibold">
                      App-Controlled Routes:
                    </div>
                    {appControlledPages.map((entry) => (
                      <div key={entry.slug} className="ml-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                        ├── /{entry.slug} <Radio className="h-3 w-3 inline" />
                      </div>
                    ))}
                  </>
                )}

                {/* Manual Pages */}
                {manualPages.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="text-blue-600 dark:text-blue-400 font-semibold">
                      Manual Pages:
                    </div>
                    {manualPages.map((entry) => (
                      <div key={entry.slug} className="ml-4 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        ├── /{entry.slug} <FileText className="h-3 w-3 inline" />
                      </div>
                    ))}
                  </>
                )}

                <Separator className="my-2" />
                <div className="ml-4 text-primary flex items-center gap-2">
                  └── /admin <Lock className="h-3 w-3 inline" />
                </div>
                <div className="ml-8 text-primary flex items-center gap-2">
                  ├── /dashboard <Lock className="h-3 w-3 inline" />
                </div>
                <div className="ml-8 text-primary flex items-center gap-2">
                  ├── /test-guide <Lock className="h-3 w-3 inline" />
                </div>
                <div className="ml-8 text-primary flex items-center gap-2">
                  ├── /gallery <Lock className="h-3 w-3 inline" />
                </div>
                <div className="ml-8 text-primary flex items-center gap-2">
                  ├── /error-recovery <Lock className="h-3 w-3 inline" />
                </div>
                <div className="ml-8 text-primary flex items-center gap-2">
                  └── /feature-validation <Lock className="h-3 w-3 inline" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Audit Information */}
          {isAdmin && sitemapEntries && sitemapEntries.length > 0 && (
            <Card className="border-2 border-amber-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/generated/merkle-hash-audit.dim_400x300.png"
                    alt="Audit Tracking"
                    className="h-12 w-auto rounded"
                  />
                  <div>
                    <CardTitle>Audit & Version Tracking</CardTitle>
                    <CardDescription>
                      Comprehensive audit trail with Merkle hashes and timestamps
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid gap-2">
                    {sitemapEntries.slice(0, 5).map((entry) => (
                      <div
                        key={entry.slug}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          {getRouteTypeIcon(entry.routeType)}
                          <div>
                            <div className="font-medium text-sm">/{entry.slug}</div>
                            <div className="text-xs text-muted-foreground">
                              Version {entry.version.toString()} • Hash: {entry.hash}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRouteTypeBadge(entry.routeType)}
                          {getStatusIcon(entry.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                  {sitemapEntries.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Showing 5 of {sitemapEntries.length} entries
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Versioned Snapshots Info */}
          {isAdmin && (
            <Alert>
              <img
                src="/assets/generated/versioned-sitemap-snapshots.dim_700x500.png"
                alt="Versioned Snapshots"
                className="h-4 w-4"
              />
              <AlertTitle>Versioned Sitemap Snapshots</AlertTitle>
              <AlertDescription className="text-xs">
                All sitemap modifications are tracked with versioned snapshots for audit safety and rollback capabilities.
                Access snapshot management in the Admin Panel.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </section>
    </div>
  );
}
