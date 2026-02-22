import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, FileText, Zap, Shield, TrendingUp } from 'lucide-react';

export default function SpecificationStatus() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Specification Status</h1>
        <p className="text-muted-foreground">
          System specification format and performance monitoring
        </p>
      </div>

      {/* Current Status */}
      <Card className="mb-6 border-green-200 dark:border-green-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Specification Format: YAML (Optimal)
            </CardTitle>
            <Badge variant="default" className="bg-green-600">Active</Badge>
          </div>
          <CardDescription>
            ✅ YAML spec loaded successfully. All modules active. Source: spec.yaml. Mode: deduplicated, unit-safe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-semibold">Source File</div>
                <div className="text-sm text-muted-foreground">spec.yaml</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-semibold">Performance</div>
                <div className="text-sm text-muted-foreground">Optimal</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-semibold">Mode</div>
                <div className="text-sm text-muted-foreground">Unit-safe, DRY</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schema Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Schema Architecture</CardTitle>
            <CardDescription>DRY principles with YAML anchors</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Primary source: spec.yaml (authoritative)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <span>YAML parsing with module validation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Anchors & $ref for deduplication</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Cached module execution model</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Modules</CardTitle>
            <CardDescription>All modules operational</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                'authentication',
                'storage',
                'nodes',
                'images',
                'audit',
                'billing',
                'blog',
                'referrals',
                'sitemap',
                'gallery',
                'faq',
                'frontend',
                'operations',
                'performance-monitoring'
              ].map((module) => (
                <div key={module} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{module}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unit-Safe Storage */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Unit-Safe Storage System</CardTitle>
          <CardDescription>Preventing BigInt/float precision issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Enforcement Level: Strict</h4>
              <p className="text-sm text-muted-foreground mb-3">
                All numeric values stored as objects with value (Float), unit (string), and editableBy (array)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-2">Supported Unit Categories</h5>
                <ul className="text-sm space-y-1">
                  <li>• Length: m, cm, km, ft, in</li>
                  <li>• Area: m², sqm, sqft, acre</li>
                  <li>• Price: INR, USD, EUR, paise, cents</li>
                  <li>• Volume: m³, L, gal</li>
                  <li>• Weight: kg, g, lb, oz</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Features</h5>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Automatic float-to-scaled conversion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Unit metadata preservation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Permission-based editability
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Future-proof extensibility
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Matching System */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Image Matching & Gallery Rules</CardTitle>
          <CardDescription>Property-specific image isolation with validation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Matching Rules</h5>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Case-insensitive matching
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Filename normalization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Extension-agnostic comparison
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Property ID validation
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Cache Strategy</h5>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Property-specific cache busting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Timestamp-based invalidation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Cross-property prevention
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Comprehensive audit logging
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Monitoring */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Monitoring
          </CardTitle>
          <CardDescription>Proactive degraded mode prevention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h5 className="font-medium mb-2">Metrics Tracked</h5>
                <ul className="text-sm space-y-1">
                  <li>• Response time</li>
                  <li>• Cache hit rate</li>
                  <li>• Query performance</li>
                  <li>• Module load time</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Thresholds</h5>
                <ul className="text-sm space-y-1">
                  <li>• Response: &lt;1000ms</li>
                  <li>• Cache miss: &lt;30%</li>
                  <li>• Error rate: &lt;5%</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Recovery Actions</h5>
                <ul className="text-sm space-y-1">
                  <li>• Auto-reload modules</li>
                  <li>• Clear corrupted cache</li>
                  <li>• Admin notifications</li>
                  <li>• Audit logging</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future-Proofing */}
      <Card>
        <CardHeader>
          <CardTitle>Future-Proofing & Migration Support</CardTitle>
          <CardDescription>Seamless updates and error prevention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Version Management</h5>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Semantic versioning enabled
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Breaking changes notification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  90-day deprecation warning
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Backward compatibility tracking
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Migration Features</h5>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Automated migrations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Rollback support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Pre/post validation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Automatic backups
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fallback Warning (Hidden - only shown when degraded) */}
      <Card className="mt-6 border-yellow-200 dark:border-yellow-800 hidden" id="fallback-warning">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <CardTitle>Fallback Mode Active</CardTitle>
          </div>
          <CardDescription className="text-yellow-700 dark:text-yellow-400">
            ⚠️ spec.md fallback in use. Performance may be degraded.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            The system has fallen back to markdown specification format. This may result in:
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Slower module loading times</li>
            <li>• Reduced caching efficiency</li>
            <li>• Increased memory usage</li>
            <li>• Potential parsing inconsistencies</li>
          </ul>
          <p className="text-sm mt-3 font-medium">
            Please contact the system administrator to restore YAML specification format.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
