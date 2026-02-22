import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronRight, Download, FileText, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import { useGetRawSitemapXml, useGetRobotsTxt, useCheckSitemapIntegrity, useCheckFAQIntegrity, useRunDataIntegrityTests, useIsCallerAdmin } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';

export default function Sitemap() {
  const navigate = useNavigate();
  const { data: sitemapXml, isLoading: sitemapLoading } = useGetRawSitemapXml();
  const { data: robotsTxt, isLoading: robotsLoading } = useGetRobotsTxt();
  const { data: sitemapIntegrityCheck = true } = useCheckSitemapIntegrity();
  const { data: faqIntegrityCheck = true } = useCheckFAQIntegrity();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const runIntegrityTests = useRunDataIntegrityTests();
  const [showIntegrityWarning, setShowIntegrityWarning] = useState(false);

  useEffect(() => {
    if (!sitemapIntegrityCheck || !faqIntegrityCheck) {
      setShowIntegrityWarning(true);
    } else {
      setShowIntegrityWarning(false);
    }
  }, [sitemapIntegrityCheck, faqIntegrityCheck]);

  const sitemapStructure = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Live Status', path: '/live-status' },
    { label: 'About Us', path: '/about' },
    { label: 'Pros of SECoin', path: '/pros' },
    { label: 'What We Do', path: '/what-we-do' },
    { label: 'Why Us', path: '/why-us' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Referral Program', path: '/referral' },
    { label: 'Proof of Trust', path: '/proof-of-trust' },
    { label: 'Admin Dashboard', path: '/dashboard' },
    { label: 'Feature Tracking', path: '/features' },
  ];

  const handleNavigate = (path: string) => {
    try {
      navigate({ to: path });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleDownloadSitemap = () => {
    if (!sitemapXml) return;
    
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRobotsTxt = () => {
    if (!robotsTxt) return;
    
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunIntegrityTests = () => {
    runIntegrityTests.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {isAdmin && (
        <div className="mb-6">
          {showIntegrityWarning ? (
            <Alert variant="destructive" className="border-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-bold">Data Integrity Warning</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {!sitemapIntegrityCheck && 'Sitemap data may be missing or incomplete. '}
                  {!faqIntegrityCheck && 'FAQ data may be missing or incomplete. '}
                  Please run integrity checks.
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRunIntegrityTests}
                  disabled={runIntegrityTests.isPending}
                  className="ml-4"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  {runIntegrityTests.isPending ? 'Testing...' : 'Run Integrity Check'}
                </Button>
              </AlertDescription>
            </Alert>
          ) : sitemapIntegrityCheck && faqIntegrityCheck ? (
            <Alert className="border-2 border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="font-bold text-green-700">Data Integrity: OK</AlertTitle>
              <AlertDescription className="text-green-600">
                All system data (sitemap, FAQs, robots.txt) is present and verified.
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
      )}

      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-primary">Sitemap</h1>
        <p className="text-lg text-muted-foreground">
          Website navigation structure and SEO resources
        </p>
      </div>

      <Alert className="mb-6 border-primary/30 bg-primary/5">
        <FileText className="h-4 w-4" />
        <AlertDescription>
          The sitemap.xml and robots.txt files are automatically generated and served by the backend at the root path.
          These files are always available to search engines and web crawlers.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="border-3d shadow-3d">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <FileText className="h-5 w-5" />
              sitemap.xml
            </CardTitle>
            <CardDescription>
              XML sitemap for search engines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDownloadSitemap}
              disabled={sitemapLoading || !sitemapXml}
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              {sitemapLoading ? 'Loading...' : 'Download sitemap.xml'}
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">
              Available at: <code className="text-primary">https://secoin-ep6.caffeine.xyz/sitemap.xml</code>
            </p>
            {sitemapXml && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified: {sitemapXml.length} bytes</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-3d shadow-3d">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <FileText className="h-5 w-5" />
              robots.txt
            </CardTitle>
            <CardDescription>
              Robots exclusion protocol file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDownloadRobotsTxt}
              disabled={robotsLoading || !robotsTxt}
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              {robotsLoading ? 'Loading...' : 'Download robots.txt'}
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">
              Available at: <code className="text-primary">https://secoin-ep6.caffeine.xyz/robots.txt</code>
            </p>
            {robotsTxt && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified: Allows all bots, references sitemap</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-3d shadow-3d">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Site Navigation</CardTitle>
          <CardDescription>
            Click any link to navigate to that page. All pages are isolated to prevent data conflicts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {sitemapStructure.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                className="text-left p-4 rounded-lg border-2 border-primary/20 hover:border-primary/60 hover:bg-primary/5 transition-all group flex items-center gap-3"
              >
                <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                <span className="text-base font-medium text-primary group-hover:text-accent transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {sitemapXml && (
        <Card className="mt-6 border-3d shadow-3d">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Sitemap XML Preview</CardTitle>
            <CardDescription>
              Current sitemap content (first 500 characters)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{sitemapXml.substring(0, 500)}...</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {robotsTxt && (
        <Card className="mt-6 border-3d shadow-3d">
          <CardHeader>
            <CardTitle className="text-xl text-primary">robots.txt Content</CardTitle>
            <CardDescription>
              Current robots.txt configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{robotsTxt}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
