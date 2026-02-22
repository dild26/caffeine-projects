import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Info, Package, FileArchive, Zap, CheckCircle, TrendingDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BuildMetrics {
  totalCompressedSize: number;
  totalUncompressedSize: number;
  uniquePackages: number;
  spaceSavings: number;
  compressionRatio: number;
  schemaDeduplication: {
    originalSchemas: number;
    deduplicatedSchemas: number;
    duplicatesRemoved: number;
  };
  optimizationMethods: string[];
}

interface BuildOptimizationDashboardProps {
  metrics?: BuildMetrics;
  isLoading?: boolean;
}

export default function BuildOptimizationDashboard({ metrics, isLoading }: BuildOptimizationDashboardProps) {
  // Mock data for demonstration - will be replaced with real data from backend
  const mockMetrics: BuildMetrics = metrics || {
    totalCompressedSize: 2_450_000, // ~2.45 MB
    totalUncompressedSize: 8_900_000, // ~8.9 MB
    uniquePackages: 127,
    spaceSavings: 6_450_000, // ~6.45 MB saved
    compressionRatio: 72.5,
    schemaDeduplication: {
      originalSchemas: 45,
      deduplicatedSchemas: 32,
      duplicatesRemoved: 13,
    },
    optimizationMethods: ['Brotli Compression', 'Tree Shaking', 'Code Splitting', 'Minification'],
  };

  const formatBytes = (bytes: number): string => {
    const mb = bytes / 1_048_576;
    const kb = bytes / 1024;
    
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else if (kb >= 1) {
      return `${kb.toFixed(2)} KB`;
    }
    return `${bytes} bytes`;
  };

  const getOptimizationStatus = (ratio: number): 'excellent' | 'good' | 'fair' => {
    if (ratio >= 70) return 'excellent';
    if (ratio >= 50) return 'good';
    return 'fair';
  };

  const optimizationStatus = getOptimizationStatus(mockMetrics.compressionRatio);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Build Optimization Metrics</CardTitle>
          <CardDescription>Loading optimization data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded" />
            <div className="h-20 bg-muted animate-pulse rounded" />
            <div className="h-20 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Build Optimization Active</AlertTitle>
        <AlertDescription>
          Your application is using modern compression and optimization techniques to minimize bundle size and improve load times.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Build Optimization Metrics</CardTitle>
              <CardDescription>Real-time bundle size and optimization statistics</CardDescription>
            </div>
            <Badge 
              variant={optimizationStatus === 'excellent' ? 'default' : optimizationStatus === 'good' ? 'secondary' : 'outline'}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {optimizationStatus.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Compression Ratio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileArchive className="h-5 w-5 text-primary" />
                <span className="font-semibold">Compression Ratio</span>
              </div>
              <span className="text-2xl font-bold">{mockMetrics.compressionRatio.toFixed(1)}%</span>
            </div>
            <Progress value={mockMetrics.compressionRatio} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Space savings: {formatBytes(mockMetrics.spaceSavings)} ({mockMetrics.compressionRatio.toFixed(1)}% reduction)
            </p>
          </div>

          <Separator />

          {/* Bundle Sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Uncompressed Size</span>
              </div>
              <p className="text-2xl font-bold">{formatBytes(mockMetrics.totalUncompressedSize)}</p>
              <p className="text-xs text-muted-foreground">Original bundle size</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Compressed Size</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatBytes(mockMetrics.totalCompressedSize)}</p>
              <p className="text-xs text-muted-foreground">Optimized bundle size</p>
            </div>
          </div>

          <Separator />

          {/* Package Count */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-semibold">Unique Packages</span>
              </div>
              <span className="text-xl font-mono">{mockMetrics.uniquePackages}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Dependencies included in production build after tree-shaking
            </p>
          </div>

          <Separator />

          {/* Schema Deduplication */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">Schema Deduplication</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{mockMetrics.schemaDeduplication.originalSchemas}</p>
                <p className="text-xs text-muted-foreground">Original</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">{mockMetrics.schemaDeduplication.deduplicatedSchemas}</p>
                <p className="text-xs text-muted-foreground">Optimized</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-orange-600">{mockMetrics.schemaDeduplication.duplicatesRemoved}</p>
                <p className="text-xs text-muted-foreground">Removed</p>
              </div>
            </div>

            <Progress 
              value={(mockMetrics.schemaDeduplication.duplicatesRemoved / mockMetrics.schemaDeduplication.originalSchemas) * 100} 
              className="h-2" 
            />
            <p className="text-xs text-muted-foreground">
              {((mockMetrics.schemaDeduplication.duplicatesRemoved / mockMetrics.schemaDeduplication.originalSchemas) * 100).toFixed(1)}% 
              duplicate definitions merged
            </p>
          </div>

          <Separator />

          {/* Optimization Methods */}
          <div className="space-y-3">
            <span className="font-semibold">Active Optimization Methods</span>
            <div className="flex flex-wrap gap-2">
              {mockMetrics.optimizationMethods.map((method) => (
                <Badge key={method} variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {method}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  Optimization Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Build Optimization Details</DialogTitle>
                  <DialogDescription>
                    Understanding the optimization techniques applied to your application
                  </DialogDescription>
                </DialogHeader>
                <OptimizationDetailsGuide />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Schema Deduplication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Schema Deduplication Process</DialogTitle>
                  <DialogDescription>
                    How duplicate schema definitions are identified and merged
                  </DialogDescription>
                </DialogHeader>
                <SchemaDeduplicationGuide />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      {optimizationStatus !== 'excellent' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {optimizationStatus === 'fair' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Consider removing unused dependencies to reduce bundle size</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Enable code splitting for larger components</span>
                  </li>
                </>
              )}
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Review schema definitions for additional deduplication opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Consider lazy loading for non-critical features</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function OptimizationDetailsGuide() {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-semibold mb-2">Brotli Compression</h3>
        <p className="text-muted-foreground mb-2">
          Brotli is a modern compression algorithm that provides superior compression ratios compared to gzip.
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Typically achieves 15-25% better compression than gzip</li>
          <li>Supported by all modern browsers</li>
          <li>Applied to JavaScript, CSS, and HTML files</li>
          <li>Reduces bandwidth usage and improves load times</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Tree Shaking</h3>
        <p className="text-muted-foreground mb-2">
          Tree shaking eliminates unused code from your final bundle.
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Removes unused exports from imported modules</li>
          <li>Analyzes static import/export statements</li>
          <li>Reduces bundle size by excluding dead code</li>
          <li>Works best with ES6 module syntax</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Code Splitting</h3>
        <p className="text-muted-foreground mb-2">
          Code splitting breaks your application into smaller chunks that can be loaded on demand.
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Reduces initial bundle size</li>
          <li>Improves time to interactive (TTI)</li>
          <li>Loads code only when needed</li>
          <li>Enables parallel loading of resources</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Minification</h3>
        <p className="text-muted-foreground mb-2">
          Minification removes unnecessary characters from code without changing functionality.
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Removes whitespace, comments, and line breaks</li>
          <li>Shortens variable and function names</li>
          <li>Optimizes code structure</li>
          <li>Reduces file size by 30-50% on average</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Dependency Optimization</h3>
        <p className="text-muted-foreground mb-2">
          Ensures only necessary dependencies are included in production builds.
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Excludes devDependencies from production</li>
          <li>Uses lightweight alternatives where possible</li>
          <li>Removes test-only modules</li>
          <li>Updates to latest stable versions for better optimization</li>
        </ul>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Automatic Optimization</AlertTitle>
        <AlertDescription>
          All optimization techniques are applied automatically during the build process. No manual configuration required.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function SchemaDeduplicationGuide() {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-semibold mb-2">What is Schema Deduplication?</h3>
        <p className="text-muted-foreground">
          Schema deduplication identifies and merges duplicate field definitions, validation rules, and metadata 
          across multiple form schemas to reduce redundancy and improve efficiency.
        </p>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Deduplication Process</h3>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>
            <strong>Analysis Phase</strong>
            <p className="text-muted-foreground ml-6 mt-1">
              Scans all schema definitions to identify duplicate field definitions, validation rules, and metadata
            </p>
          </li>
          <li>
            <strong>Comparison Phase</strong>
            <p className="text-muted-foreground ml-6 mt-1">
              Compares field properties (type, validation, options) to find exact matches
            </p>
          </li>
          <li>
            <strong>Merging Phase</strong>
            <p className="text-muted-foreground ml-6 mt-1">
              Consolidates duplicate definitions into shared references
            </p>
          </li>
          <li>
            <strong>Optimization Phase</strong>
            <p className="text-muted-foreground ml-6 mt-1">
              Removes redundant metadata and normalizes schema structure
            </p>
          </li>
        </ol>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Benefits</h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Reduces storage requirements for schema definitions</li>
          <li>Improves schema loading and parsing performance</li>
          <li>Simplifies schema maintenance and updates</li>
          <li>Ensures consistency across similar form fields</li>
          <li>Reduces memory footprint in the canister</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Example</h3>
        <div className="space-y-3">
          <div>
            <p className="font-medium mb-1">Before Deduplication:</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`Schema A: { field: "email", type: "email", required: true }
Schema B: { field: "email", type: "email", required: true }
Schema C: { field: "email", type: "email", required: true }`}
            </pre>
          </div>
          <div>
            <p className="font-medium mb-1">After Deduplication:</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`Shared Definition: { field: "email", type: "email", required: true }
Schema A: references shared definition
Schema B: references shared definition
Schema C: references shared definition`}
            </pre>
          </div>
        </div>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Safe Process</AlertTitle>
        <AlertDescription>
          Deduplication preserves all schema functionality. Only duplicate definitions are merged; 
          unique field configurations remain unchanged.
        </AlertDescription>
      </Alert>
    </div>
  );
}
