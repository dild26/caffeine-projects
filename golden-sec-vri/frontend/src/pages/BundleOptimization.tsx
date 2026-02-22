import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Package,
  TrendingDown,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  FileText,
} from 'lucide-react';
import {
  analyzeDependencies,
  detectDuplicates,
  validateRuntimeIntegrity,
  getPerformanceMetrics,
  generateOptimizationReport,
} from '@/lib/bundleOptimization';

export default function BundleOptimization() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [duplicates, setDuplicates] = useState<any>(null);
  const [integrity, setIntegrity] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const [depAnalysis, dupAnalysis, integrityCheck, perfMetrics] = await Promise.all([
        analyzeDependencies(),
        detectDuplicates(),
        validateRuntimeIntegrity(),
        getPerformanceMetrics(),
      ]);

      setAnalysis(depAnalysis);
      setDuplicates(dupAnalysis);
      setIntegrity(integrityCheck);
      setMetrics(perfMetrics);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    const report = generateOptimizationReport({
      analysis,
      duplicates,
      integrity,
      metrics,
    });
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bundle-optimization-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  const totalDependencies = analysis?.totalDependencies || 0;
  const optimizedDependencies = analysis?.optimizedDependencies || 0;
  const reductionPercentage = totalDependencies > 0
    ? ((totalDependencies - optimizedDependencies) / totalDependencies * 100).toFixed(1)
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Bundle Optimization</h1>
          <p className="text-muted-foreground">
            Comprehensive dependency analysis and optimization metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runAnalysis} disabled={isAnalyzing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Refresh Analysis
          </Button>
          <Button onClick={downloadReport} disabled={!analysis}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Runtime Integrity Status */}
      {integrity && (
        <Alert className={integrity.isValid ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500'}>
          {integrity.isValid ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertTitle className={integrity.isValid ? 'text-green-800 dark:text-green-200' : ''}>
            Runtime Integrity: {integrity.isValid ? 'Valid' : 'Issues Detected'}
          </AlertTitle>
          <AlertDescription className={integrity.isValid ? 'text-green-700 dark:text-green-300' : ''}>
            {integrity.isValid
              ? 'All optimizations have been applied successfully without breaking functionality.'
              : `${integrity.errors?.length || 0} issues detected. Please review the errors below.`}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Dependencies */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDependencies}</div>
            <p className="text-xs text-muted-foreground mt-1">Before optimization</p>
          </CardContent>
        </Card>

        {/* Optimized Dependencies */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              Optimized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{optimizedDependencies}</div>
            <p className="text-xs text-muted-foreground mt-1">After optimization</p>
          </CardContent>
        </Card>

        {/* Reduction Percentage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" />
              Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{reductionPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">Size reduction achieved</p>
          </CardContent>
        </Card>

        {/* Load Time */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Load Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics?.loadTime ? `${metrics.loadTime.toFixed(0)}ms` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Initial page load</p>
          </CardContent>
        </Card>
      </div>

      {/* Dependency Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Dependency Analysis</CardTitle>
          <CardDescription>Breakdown of dependencies and optimization techniques</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Optimization Techniques</h4>
                  <div className="space-y-1">
                    {analysis.techniques?.map((technique: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        <span className="text-sm">{technique}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Optimization Results</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Tree-shaken modules:</span>
                      <span className="font-medium">{analysis.treeShaken || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Flattened dependencies:</span>
                      <span className="font-medium">{analysis.flattened || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Vendor chunks:</span>
                      <span className="font-medium">{analysis.vendorChunks || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Aliases resolved:</span>
                      <span className="font-medium">{analysis.aliasesResolved || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm mb-2">Bundle Size Progress</h4>
                <Progress value={Number(reductionPercentage)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {reductionPercentage}% reduction from original bundle size
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Duplicate Detection */}
      {duplicates && duplicates.found > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Duplicate Dependencies Detected
            </CardTitle>
            <CardDescription>
              {duplicates.found} duplicate {duplicates.found === 1 ? 'dependency' : 'dependencies'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {duplicates.list?.map((dup: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{dup.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Versions: {dup.versions?.join(', ')}
                    </p>
                  </div>
                  <Badge variant="outline">{dup.count}x</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Real-time performance measurements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>DOM Content Loaded:</span>
                  <span className="font-medium">{metrics.domContentLoaded?.toFixed(0)}ms</span>
                </div>
                <Progress value={Math.min((metrics.domContentLoaded / 1000) * 100, 100)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Load Complete:</span>
                  <span className="font-medium">{metrics.loadComplete?.toFixed(0)}ms</span>
                </div>
                <Progress value={Math.min((metrics.loadComplete / 2000) * 100, 100)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>First Paint:</span>
                  <span className="font-medium">{metrics.firstPaint?.toFixed(0)}ms</span>
                </div>
                <Progress value={Math.min((metrics.firstPaint / 1000) * 100, 100)} />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Memory Usage</h4>
              <div className="flex justify-between text-sm">
                <span>Used JS Heap:</span>
                <span className="font-medium">
                  {metrics.memoryUsage ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integrity Errors */}
      {integrity && !integrity.isValid && integrity.errors && integrity.errors.length > 0 && (
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Runtime Integrity Issues
            </CardTitle>
            <CardDescription>The following issues were detected during validation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {integrity.errors.map((error: string, index: number) => (
                <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
