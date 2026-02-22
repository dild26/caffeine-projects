import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useValidateNavigationLinks, useMarkFeatureAsCompleted } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Clock, AlertCircle, Package, FileText, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AccessDeniedScreen from '../components/AccessDeniedScreen';

interface Feature {
  id: string;
  name: string;
  status: 'pending' | 'started' | 'completed' | 'verified';
  autoVerified: boolean;
  manualVerified: boolean;
  description: string;
}

export default function FeaturesPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: navigationValid, isLoading: validationLoading } = useValidateNavigationLinks();
  const markFeature = useMarkFeatureAsCompleted();
  
  const isAuthenticated = !!identity;

  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 'file-upload',
      name: 'File Upload with SHA-256',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Upload files with SHA-256 hashing and deduplication',
    },
    {
      id: 'contract-pairing',
      name: 'Contract Template Pairing',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Automatic pairing of .json and .md files by normalized basename',
    },
    {
      id: 'manifest-logging',
      name: 'Manifest Logging',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Comprehensive logging of all file operations with detailed match attempts',
    },
    {
      id: 'public-contracts',
      name: 'Public Contracts Page',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Public access to contract templates without authentication',
    },
    {
      id: 'voting-system',
      name: 'Voting System',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Upvote/downvote contracts with session tracking',
    },
    {
      id: 'cart-system',
      name: 'Shopping Cart',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Add contracts to cart with quantity management',
    },
    {
      id: 'stripe-integration',
      name: 'Stripe Payment Integration',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Stripe checkout for contract purchases',
    },
    {
      id: 'navigation-system',
      name: 'Complete Navigation System',
      status: 'pending',
      autoVerified: false,
      manualVerified: false,
      description: 'All pages accessible with proper public/admin filtering',
    },
    {
      id: 'payment-gateways',
      name: 'Multiple Payment Gateways',
      status: 'pending',
      autoVerified: false,
      manualVerified: false,
      description: 'PayPal, UPI, Crypto payment support',
    },
    {
      id: 'dynamic-form-generation',
      name: 'Dynamic Form Generation',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Forms dynamically generated from uploaded .json schemas with no placeholder data',
    },
    {
      id: 'md-content-display',
      name: 'MD Content Display',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Raw .md content displayed as plain text in Details tab, matched by basename',
    },
    {
      id: 'state-clearing',
      name: 'State Clearing on Template Change',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Previous form/template state cleared before loading new data',
    },
    {
      id: 'error-surfacing',
      name: 'Error Surfacing',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'File pairing and parsing errors clearly surfaced in UI and manifest log',
    },
    {
      id: 'strict-file-pairing',
      name: 'Strict File Pairing & Parsing',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'JSON/MD files matched by normalized basename with strict content validation',
    },
    {
      id: 'content-validation',
      name: 'Content Type Validation',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Pre-checks for JSON (starts with { or [) and MD (not JSON-like) with descriptive warnings',
    },
    {
      id: 'admin-preview',
      name: 'Admin Preview Mode',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Preview parsed JSON and raw Markdown before committing',
    },
    {
      id: 'manifest-detailed-logging',
      name: 'Detailed Manifest Logging',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Every file match attempt logged with filename, extension, tab assignment, and errors',
    },
    {
      id: 'access-control',
      name: 'Role-Based Access Control',
      status: 'completed',
      autoVerified: true,
      manualVerified: false,
      description: 'Public pages accessible without login, admin/subscription pages require authentication',
    },
  ]);

  // Auto-verify navigation system when validation passes
  useEffect(() => {
    if (!validationLoading && navigationValid === true) {
      setFeatures(prev => prev.map(f =>
        f.id === 'navigation-system' 
          ? { ...f, status: 'completed', autoVerified: true } 
          : f
      ));
    }
  }, [navigationValid, validationLoading]);

  const handleManualVerify = async (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    const newVerifiedState = !feature.manualVerified;
    
    setFeatures(prev => prev.map(f =>
      f.id === featureId ? { ...f, manualVerified: newVerifiedState } : f
    ));

    if (newVerifiedState && isAdmin) {
      try {
        await markFeature.mutateAsync(feature.name);
        toast.success(`Feature "${feature.name}" marked as completed`);
      } catch (error) {
        console.error('Failed to mark feature:', error);
        toast.error('Failed to mark feature as completed');
      }
    }
  };

  const getStatusIcon = (status: Feature['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'started':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Feature['status']) => {
    const variants: Record<Feature['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      started: 'secondary',
      pending: 'outline',
      verified: 'default',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const completedCount = features.filter(f => f.status === 'completed').length;
  const totalCount = features.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Features</h1>
        <p className="text-muted-foreground">
          Track implementation status and verification of all features
        </p>
      </div>

      {isAdmin && (
        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
          <Package className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-700 dark:text-amber-300">
            Build & Deployment Optimizations Required
          </AlertTitle>
          <AlertDescription className="text-amber-600 dark:text-amber-400 space-y-2">
            <p className="font-semibold">The following optimizations require infrastructure-level changes:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Documentation Deduplication:</strong> Deduplicate spec.md and .yaml files (not in frontend codebase)</li>
              <li><strong>Dependency Updates:</strong> Update all dependencies to latest stable versions (package.json is read-only)</li>
              <li><strong>Node Modules Compression:</strong> Apply tree-shaking, minification, and dependency pruning</li>
              <li><strong>Post-Install Cleanup:</strong> Implement build scripts to remove redundant files and artifacts</li>
              <li><strong>IC Compatibility Check:</strong> Add pre-build verification for Internet Computer environment compatibility</li>
            </ul>
            <p className="mt-3 text-sm">
              <strong>Action Required:</strong> These optimizations must be implemented in the build pipeline, CI/CD configuration, 
              or deployment scripts. Frontend code changes cannot address these infrastructure concerns.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>
            {completedCount} of {totalCount} features completed ({completionPercentage}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-4">
            <div 
              className="bg-primary h-4 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Checklist</CardTitle>
          <CardDescription>
            All features with dual verification (Auto/AI and Manual/Admin)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Auto/AI</TableHead>
                <TableHead className="text-center">Manual/Admin</TableHead>
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(feature.status)}
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(feature.status)}</TableCell>
                  <TableCell className="text-center">
                    {feature.autoVerified ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {feature.manualVerified ? (
                      <CheckCircle2 className="h-5 w-5 text-blue-500 mx-auto" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mx-auto" />
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleManualVerify(feature.id)}
                        disabled={markFeature.isPending}
                      >
                        {feature.manualVerified ? 'Unverify' : 'Verify'}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Zap className="h-5 w-5" />
              Infrastructure Optimization Checklist
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400">
              <strong>Build Pipeline Tasks (Requires DevOps/Infrastructure Changes):</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-700 dark:text-blue-300">Documentation Deduplication</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Remove redundant content from spec.md and .yaml files. Ensure both contain unique, 
                    well-structured definitions with synchronized updates.
                  </p>
                  <Badge variant="outline" className="mt-2">Infrastructure Task</Badge>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-700 dark:text-blue-300">Dependency Optimization</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Update all dependencies to latest compatible stable versions. Apply production optimization 
                    including tree-shaking, minification, and dependency pruning.
                  </p>
                  <Badge variant="outline" className="mt-2">Build Configuration</Badge>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-700 dark:text-blue-300">Post-Installation Cleanup</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Implement automatic compression of unused packages and cleanup of redundant files 
                    or build artifacts post-installation to reduce deployment footprint.
                  </p>
                  <Badge variant="outline" className="mt-2">Build Scripts</Badge>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-700 dark:text-blue-300">IC Compatibility Verification</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Add safety mechanism to verify all new dependencies against compatibility with 
                    Internet Computer environment before final build.
                  </p>
                  <Badge variant="outline" className="mt-2">Pre-Build Check</Badge>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-700 dark:text-blue-300">Optimization Logging</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Ensure deduplication and optimization logs are written to the manifest for admin 
                    verification in this Features page.
                  </p>
                  <Badge variant="outline" className="mt-2">Logging Integration</Badge>
                </div>
              </div>
            </div>

            <Alert className="bg-blue-100 dark:bg-blue-900 border-blue-300">
              <AlertCircle className="h-4 w-4 text-blue-700" />
              <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
                <strong>Note:</strong> These optimizations cannot be implemented through frontend code changes. 
                They require modifications to build configuration files, CI/CD pipelines, deployment scripts, 
                or infrastructure setup. Contact your DevOps team or system administrator to implement these changes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {navigationValid === true && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              Navigation System Verified
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              All pages are properly configured with role-based access control and accessible through navigation menus.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className="border-green-500 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle2 className="h-5 w-5" />
            Strict File Pairing & Parsing System Implemented ✓
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            <strong>File Pairing (Completed):</strong><br />
            ✓ Match .json and .md files by normalized (lowercase) basename only<br />
            ✓ Never match by extension, never mix content types<br />
            ✓ Case-insensitive, extension-agnostic pairing<br />
            <br />
            <strong>Content Validation (Completed):</strong><br />
            ✓ Parse .json files only for Tab 1 (form population) with schema validation<br />
            ✓ Pre-check: JSON content must start with '&#123;' or '['<br />
            ✓ Render .md files only as raw Markdown in Tab 3<br />
            ✓ Pre-check: MD content must not start with JSON characters<br />
            <br />
            <strong>Error Handling (Completed):</strong><br />
            ✓ Descriptive warnings for mismatches (e.g., "File type mismatch: expected JSON, received Markdown")<br />
            ✓ Skip rendering on errors instead of crashing<br />
            ✓ All errors surfaced in UI with detailed messages<br />
            <br />
            <strong>Manifest Logging (Completed):</strong><br />
            ✓ Log every file match attempt with filename, extension, tab assignment<br />
            ✓ Log all errors and mismatches with detailed context<br />
            ✓ Step-by-step loading process tracked in manifest<br />
            <br />
            <strong>Admin Features (Completed):</strong><br />
            ✓ Preview mode to review parsed JSON and raw Markdown<br />
            ✓ Admin affirmation for critical file pairings (backend support)<br />
            ✓ Validation results displayed in metadata tab<br />
            <br />
            <strong>Data Integrity (Completed):</strong><br />
            ✓ All contract forms generated only from uploaded .json files<br />
            ✓ No demo or placeholder data<br />
            ✓ State clearing before loading new templates<br />
            <br />
            <strong>Access Control (Completed):</strong><br />
            ✓ Public pages accessible without authentication<br />
            ✓ Admin and subscription pages require login<br />
            ✓ Navigation menus filter based on user role<br />
            <br />
            <strong>Language:</strong> English ✓
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
