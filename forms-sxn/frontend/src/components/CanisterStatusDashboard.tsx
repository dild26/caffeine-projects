import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Info, ExternalLink, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface CanisterStatus {
  cycleBalance: bigint;
  memoryUsage: bigint;
  deploymentType: 'Permanent' | 'Ephemeral';
  status: 'healthy' | 'warning' | 'critical';
}

interface CanisterStatusDashboardProps {
  status?: CanisterStatus;
  isLoading?: boolean;
  error?: Error | null;
}

export default function CanisterStatusDashboard({ status, isLoading, error }: CanisterStatusDashboardProps) {
  // Mock data for demonstration - will be replaced with real data from backend
  const mockStatus: CanisterStatus = status || {
    cycleBalance: BigInt(5_000_000_000_000), // 5 trillion cycles
    memoryUsage: BigInt(50_000_000), // 50 MB
    deploymentType: 'Ephemeral',
    status: 'healthy',
  };

  const formatCycles = (cycles: bigint): string => {
    const trillion = BigInt(1_000_000_000_000);
    const billion = BigInt(1_000_000_000);
    const million = BigInt(1_000_000);

    if (cycles >= trillion) {
      return `${(Number(cycles) / Number(trillion)).toFixed(2)}T`;
    } else if (cycles >= billion) {
      return `${(Number(cycles) / Number(billion)).toFixed(2)}B`;
    } else if (cycles >= million) {
      return `${(Number(cycles) / Number(million)).toFixed(2)}M`;
    }
    return cycles.toString();
  };

  const formatMemory = (bytes: bigint): string => {
    const gb = BigInt(1_073_741_824);
    const mb = BigInt(1_048_576);
    const kb = BigInt(1024);

    if (bytes >= gb) {
      return `${(Number(bytes) / Number(gb)).toFixed(2)} GB`;
    } else if (bytes >= mb) {
      return `${(Number(bytes) / Number(mb)).toFixed(2)} MB`;
    } else if (bytes >= kb) {
      return `${(Number(bytes) / Number(kb)).toFixed(2)} KB`;
    }
    return `${bytes} bytes`;
  };

  const getCycleStatus = (cycles: bigint): 'healthy' | 'warning' | 'critical' => {
    const trillion = BigInt(1_000_000_000_000);
    if (cycles < trillion) return 'critical';
    if (cycles < trillion * BigInt(5)) return 'warning';
    return 'healthy';
  };

  const cycleStatus = getCycleStatus(mockStatus.cycleBalance);
  const cyclePercentage = Math.min(100, Number(mockStatus.cycleBalance) / Number(BigInt(10_000_000_000_000)) * 100);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Canister Status</CardTitle>
          <CardDescription>Loading canister information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded" />
            <div className="h-20 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Canister Status</AlertTitle>
        <AlertDescription>
          Unable to retrieve canister status information. Please try again later.
          <br />
          <span className="text-xs mt-2 block">{error.message}</span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {cycleStatus !== 'healthy' && (
        <Alert variant={cycleStatus === 'critical' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {cycleStatus === 'critical' ? 'Critical: Low Cycle Balance' : 'Warning: Cycle Balance Running Low'}
          </AlertTitle>
          <AlertDescription>
            Your canister is running low on cycles. Please top up your canister to avoid service interruption.
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto ml-1">
                  Learn how to add cycles
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>How to Top Up Cycles</DialogTitle>
                  <DialogDescription>
                    Follow these steps to add cycles to your canister
                  </DialogDescription>
                </DialogHeader>
                <CycleTopUpGuide />
              </DialogContent>
            </Dialog>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Canister Status</CardTitle>
              <CardDescription>Real-time monitoring of your canister health</CardDescription>
            </div>
            <Badge variant={cycleStatus === 'healthy' ? 'default' : cycleStatus === 'warning' ? 'secondary' : 'destructive'}>
              {cycleStatus === 'healthy' ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {cycleStatus.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cycle Balance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Cycle Balance</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>About Cycles</DialogTitle>
                      <DialogDescription>
                        Cycles are the computational resource used by canisters on the Internet Computer.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <p>
                        Cycles power all canister operations including storage, computation, and network calls.
                        Your canister consumes cycles continuously based on its resource usage.
                      </p>
                      <p>
                        <strong>Recommended minimum:</strong> 5 trillion cycles for stable operation.
                      </p>
                      <p>
                        <strong>Warning threshold:</strong> Below 5 trillion cycles.
                      </p>
                      <p>
                        <strong>Critical threshold:</strong> Below 1 trillion cycles.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <span className="text-2xl font-bold">{formatCycles(mockStatus.cycleBalance)}</span>
            </div>
            <Progress value={cyclePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {cyclePercentage.toFixed(1)}% of recommended balance (10T cycles)
            </p>
          </div>

          <Separator />

          {/* Memory Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Memory Usage</span>
              <span className="text-lg font-mono">{formatMemory(mockStatus.memoryUsage)}</span>
            </div>
            <Progress value={Number(mockStatus.memoryUsage) / 4_000_000_000 * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {(Number(mockStatus.memoryUsage) / 4_000_000_000 * 100).toFixed(2)}% of 4 GB stable memory limit
            </p>
          </div>

          <Separator />

          {/* Deployment Type */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Deployment Type</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deployment Types</DialogTitle>
                      <DialogDescription>
                        Understanding Permanent vs Ephemeral deployments
                      </DialogDescription>
                    </DialogHeader>
                    <DeploymentTypeGuide />
                  </DialogContent>
                </Dialog>
              </div>
              <Badge variant="outline">{mockStatus.deploymentType}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {mockStatus.deploymentType === 'Permanent'
                ? 'Your canister will persist indefinitely with sufficient cycles'
                : 'Your canister is temporary and will be deleted after a period of inactivity'}
            </p>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  Troubleshooting Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Deployment Troubleshooting</DialogTitle>
                  <DialogDescription>
                    Common issues and solutions for canister deployment
                  </DialogDescription>
                </DialogHeader>
                <TroubleshootingGuide />
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" asChild>
              <a href="https://internetcomputer.org/docs/current/developer-docs/gas-cost" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Cycle Documentation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CycleTopUpGuide() {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-semibold mb-2">Method 1: Using dfx (Command Line)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>
            <strong>Check your current balance:</strong>
            <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-x-auto">
              dfx canister status backend
            </pre>
          </li>
          <li>
            <strong>Top up with cycles:</strong>
            <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-x-auto">
              dfx canister deposit-cycles 10000000000000 backend
            </pre>
            <p className="text-muted-foreground mt-1">This adds 10 trillion cycles to your canister.</p>
          </li>
        </ol>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Method 2: Using NNS Dapp (Web Interface)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>Visit the <a href="https://nns.ic0.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NNS Dapp</a></li>
          <li>Connect your Internet Identity</li>
          <li>Navigate to "Canisters" section</li>
          <li>Find your canister by ID</li>
          <li>Click "Add Cycles" and specify the amount</li>
        </ol>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Method 3: Using Cycles Wallet</h3>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>
            <strong>Get your wallet ID:</strong>
            <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-x-auto">
              dfx identity get-wallet
            </pre>
          </li>
          <li>
            <strong>Send cycles from wallet:</strong>
            <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-x-auto">
              dfx wallet send [CANISTER_ID] 10000000000000
            </pre>
          </li>
        </ol>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Need Cycles?</AlertTitle>
        <AlertDescription>
          If you don't have cycles, you can obtain them through:
          <ul className="list-disc list-inside mt-2 ml-2">
            <li>Converting ICP tokens to cycles</li>
            <li>Using the cycles faucet for development</li>
            <li>Purchasing from cycle providers</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function DeploymentTypeGuide() {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-semibold mb-2">Permanent Deployment</h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Canister persists indefinitely with sufficient cycles</li>
          <li>Suitable for production applications</li>
          <li>Requires regular cycle top-ups</li>
          <li>Data is preserved across upgrades</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Ephemeral Deployment</h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Temporary canister for testing and development</li>
          <li>Automatically deleted after inactivity period</li>
          <li>Lower cycle requirements</li>
          <li>Not suitable for production use</li>
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">How to Change Deployment Type</h3>
        <p className="mb-2">To change from Ephemeral to Permanent:</p>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>
            Update your <code className="bg-muted px-1 rounded">dfx.json</code> configuration
          </li>
          <li>
            Redeploy your canister:
            <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-x-auto">
              dfx deploy backend --mode reinstall
            </pre>
          </li>
          <li>Ensure sufficient cycles are available (minimum 5T recommended)</li>
        </ol>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Changing deployment type may require reinstalling the canister, which will erase all stored data.
          Always backup your data before making this change.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function TroubleshootingGuide() {
  return (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Common Deployment Errors
        </h3>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Error: Insufficient Cycles</h4>
            <p className="text-muted-foreground mb-2">
              <code className="bg-muted px-1 rounded text-xs">
                Canister cannot be created with insufficient cycles
              </code>
            </p>
            <div className="space-y-2">
              <p><strong>Cause:</strong> Your canister doesn't have enough cycles to complete the operation.</p>
              <p><strong>Solution:</strong></p>
              <ol className="list-decimal list-inside ml-2 space-y-1">
                <li>Check your current cycle balance</li>
                <li>Top up cycles using one of the methods above</li>
                <li>Retry the deployment</li>
              </ol>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Error: Memory Limit Exceeded</h4>
            <p className="text-muted-foreground mb-2">
              <code className="bg-muted px-1 rounded text-xs">
                Canister exceeded memory allocation
              </code>
            </p>
            <div className="space-y-2">
              <p><strong>Cause:</strong> Your canister is using more memory than allocated.</p>
              <p><strong>Solution:</strong></p>
              <ol className="list-decimal list-inside ml-2 space-y-1">
                <li>Review your data storage strategy</li>
                <li>Consider implementing data archiving</li>
                <li>Optimize data structures to reduce memory usage</li>
                <li>Split functionality across multiple canisters if needed</li>
              </ol>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Error: Deployment Timeout</h4>
            <p className="text-muted-foreground mb-2">
              <code className="bg-muted px-1 rounded text-xs">
                Request timed out during deployment
              </code>
            </p>
            <div className="space-y-2">
              <p><strong>Cause:</strong> Network issues or canister initialization taking too long.</p>
              <p><strong>Solution:</strong></p>
              <ol className="list-decimal list-inside ml-2 space-y-1">
                <li>Check your internet connection</li>
                <li>Verify IC network status</li>
                <li>Retry the deployment</li>
                <li>If persistent, reduce initialization complexity</li>
              </ol>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Error: Canister Not Found</h4>
            <p className="text-muted-foreground mb-2">
              <code className="bg-muted px-1 rounded text-xs">
                Canister [ID] not found
              </code>
            </p>
            <div className="space-y-2">
              <p><strong>Cause:</strong> Canister was deleted or ID is incorrect.</p>
              <p><strong>Solution:</strong></p>
              <ol className="list-decimal list-inside ml-2 space-y-1">
                <li>Verify the canister ID is correct</li>
                <li>Check if canister was deleted due to low cycles</li>
                <li>Create a new canister if necessary</li>
                <li>Update your configuration with the new canister ID</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-base mb-3">Prevention Best Practices</h3>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>Monitor cycle balance regularly and set up alerts</li>
          <li>Maintain a minimum of 5 trillion cycles for stable operation</li>
          <li>Implement automatic cycle top-up mechanisms</li>
          <li>Use efficient data structures to minimize memory usage</li>
          <li>Test deployments in development environment first</li>
          <li>Keep backups of critical data</li>
          <li>Document your canister IDs and configuration</li>
        </ul>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Need More Help?</AlertTitle>
        <AlertDescription>
          <div className="space-y-2 mt-2">
            <p>Visit these resources for additional support:</p>
            <ul className="list-disc list-inside ml-2">
              <li>
                <a href="https://forum.dfinity.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  DFINITY Developer Forum
                </a>
              </li>
              <li>
                <a href="https://internetcomputer.org/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Internet Computer Documentation
                </a>
              </li>
              <li>
                <a href="https://discord.gg/jnjVVQaE2C" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  IC Developer Discord
                </a>
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
