import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Database, 
  HardDrive, 
  Server, 
  Clock, 
  FileCheck,
  Activity,
  Calendar,
  Video,
  FileWarning,
  Lock,
  Cloud,
  Network,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatBytes } from '../../lib/utils';
import { useListFiles } from '../../hooks/useQueries';
import { getAllReplicaEntries, verifyReplicaIntegrity, retrieveWithHealing } from '../../lib/backupVault';
import { 
  getBackupSchedules, 
  updateBackupSchedule,
  getBackupManifests,
  getBackupStatistics,
  cleanupOldBackups,
} from '../../lib/backupScheduler';
import { 
  getIntegrityReports, 
  clearIntegrityReports, 
  getCorruptionStatistics,
  runContinuousIntegrityCheck 
} from '../../lib/binaryIntegrity';
import {
  getVerificationResults,
  getVerificationStatistics,
  getQuarantinedFiles,
  removeFromQuarantine,
  clearVerificationResults,
  clearQuarantine,
  performPostWriteVerification,
} from '../../lib/postWriteVerification';
import {
  getIPFSManifests,
  getIPFSBackupStatistics,
  getIPFSNodes,
  getIPFSJobs,
  createIncrementalIPFSBackup,
  verifyIPFSPins,
  initializeDefaultIPFSNodes,
} from '../../lib/ipfsBackup';
import MediaDiagnostics from '../MediaDiagnostics';
import type { BackupSchedule, IntegrityCheckResult, IntegrityIssue } from '../../types';

export default function IntegrityChecksTab() {
  const { data: files = [] } = useListFiles();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isHealing, setIsHealing] = useState(false);
  const [isContinuousCheck, setIsContinuousCheck] = useState(false);
  const [isIPFSBackup, setIsIPFSBackup] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [lastCheckResult, setLastCheckResult] = useState<IntegrityCheckResult | null>(null);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [backupStats, setBackupStats] = useState<any>(null);
  const [corruptionStats, setCorruptionStats] = useState<any>(null);
  const [verificationStats, setVerificationStats] = useState<any>(null);
  const [ipfsStats, setIPFSStats] = useState<any>(null);

  useEffect(() => {
    loadSchedules();
    loadBackupStats();
    loadCorruptionStats();
    loadVerificationStats();
    loadIPFSStats();
    initializeDefaultIPFSNodes();
  }, []);

  const loadSchedules = () => {
    const loaded = getBackupSchedules();
    setSchedules(loaded);
  };

  const loadBackupStats = () => {
    const stats = getBackupStatistics();
    setBackupStats(stats);
  };

  const loadCorruptionStats = () => {
    const stats = getCorruptionStatistics();
    setCorruptionStats(stats);
  };

  const loadVerificationStats = () => {
    const stats = getVerificationStatistics();
    setVerificationStats(stats);
  };

  const loadIPFSStats = () => {
    const stats = getIPFSBackupStatistics();
    setIPFSStats(stats);
  };

  const handleVerifyIntegrity = async () => {
    setIsVerifying(true);
    setVerificationProgress(0);
    
    const startTime = Date.now();
    const issues: IntegrityIssue[] = [];
    let verifiedFiles = 0;
    let corruptedFiles = 0;
    let missingFiles = 0;
    
    try {
      const replicaEntries = getAllReplicaEntries();
      const totalFiles = replicaEntries.length;
      
      for (let i = 0; i < replicaEntries.length; i++) {
        const entry = replicaEntries[i];
        setVerificationProgress(Math.round(((i + 1) / totalFiles) * 100));
        
        const result = await verifyReplicaIntegrity(entry.fileId);
        
        if (result.healthy) {
          verifiedFiles++;
        } else {
          const hasHealthy = result.replicas.some(r => r.status === 'healthy');
          const hasCorrupted = result.replicas.some(r => r.status === 'corrupted');
          const hasMissing = result.replicas.some(r => r.status === 'missing');
          
          if (hasCorrupted) {
            corruptedFiles++;
            issues.push({
              fileId: entry.fileId,
              fileName: entry.fileName,
              issueType: 'corrupted',
              severity: hasHealthy ? 'medium' : 'critical',
              description: `Corrupted replicas detected: ${result.replicas.filter(r => r.status === 'corrupted').map(r => r.type).join(', ')}`,
              autoHealed: false,
              timestamp: BigInt(Date.now() * 1000000),
            });
          }
          
          if (hasMissing) {
            missingFiles++;
            issues.push({
              fileId: entry.fileId,
              fileName: entry.fileName,
              issueType: 'missing',
              severity: hasHealthy ? 'low' : 'high',
              description: `Missing replicas: ${result.replicas.filter(r => r.status === 'missing').map(r => r.type).join(', ')}`,
              autoHealed: false,
              timestamp: BigInt(Date.now() * 1000000),
            });
          }
        }
      }
      
      const duration = Date.now() - startTime;
      const checkResult: IntegrityCheckResult = {
        id: `check_${Date.now()}`,
        timestamp: BigInt(Date.now() * 1000000),
        totalFiles: replicaEntries.length,
        verifiedFiles,
        corruptedFiles,
        missingFiles,
        healedFiles: 0,
        issues,
        duration,
        status: 'completed',
      };
      
      setLastCheckResult(checkResult);
      
      if (issues.length === 0) {
        toast.success(`Integrity check completed: All ${verifiedFiles} files verified successfully ✓`);
      } else {
        toast.warning(`Integrity check completed: Found ${issues.length} issues`);
      }
    } catch (error) {
      toast.error('Integrity check failed');
      console.error(error);
    } finally {
      setIsVerifying(false);
      setVerificationProgress(0);
    }
  };

  const handleContinuousIntegrityCheck = async () => {
    setIsContinuousCheck(true);
    setVerificationProgress(0);

    try {
      const fileList = files.map(f => ({
        id: f.id,
        name: f.name,
        checksum: f.checksum,
        size: Number(f.size),
      }));

      const result = await runContinuousIntegrityCheck(
        fileList,
        (current, total) => {
          setVerificationProgress(Math.round((current / total) * 100));
        }
      );

      const issues: IntegrityIssue[] = result.issues.map(issue => ({
        fileId: issue.fileId,
        fileName: issue.fileName,
        issueType: 'checksum_mismatch',
        severity: 'high',
        description: issue.error,
        autoHealed: false,
        timestamp: BigInt(Date.now() * 1000000),
      }));

      const checkResult: IntegrityCheckResult = {
        id: `continuous_check_${Date.now()}`,
        timestamp: BigInt(Date.now() * 1000000),
        totalFiles: result.totalFiles,
        verifiedFiles: result.verifiedFiles,
        corruptedFiles: result.corruptedFiles,
        missingFiles: 0,
        healedFiles: 0,
        issues,
        duration: 0,
        status: 'completed',
      };

      setLastCheckResult(checkResult);

      if (result.corruptedFiles === 0) {
        toast.success(`Continuous check completed: All ${result.verifiedFiles} files verified ✓`);
      } else {
        toast.error(`Found ${result.corruptedFiles} corrupted files. Please re-upload affected files.`);
      }
    } catch (error) {
      toast.error('Continuous integrity check failed');
      console.error(error);
    } finally {
      setIsContinuousCheck(false);
      setVerificationProgress(0);
    }
  };

  const handleAutoHeal = async () => {
    if (!lastCheckResult || lastCheckResult.issues.length === 0) {
      toast.info('No issues to heal');
      return;
    }
    
    setIsHealing(true);
    let healedCount = 0;
    
    try {
      for (const issue of lastCheckResult.issues) {
        try {
          const data = await retrieveWithHealing(issue.fileId);
          if (data) {
            healedCount++;
            issue.autoHealed = true;
          }
        } catch (error) {
          console.error(`Failed to heal ${issue.fileName}:`, error);
        }
      }
      
      if (lastCheckResult) {
        lastCheckResult.healedFiles = healedCount;
      }
      
      toast.success(`Auto-healed ${healedCount} of ${lastCheckResult.issues.length} issues`);
    } catch (error) {
      toast.error('Auto-heal failed');
      console.error(error);
    } finally {
      setIsHealing(false);
    }
  };

  const handleToggleSchedule = (scheduleId: string, enabled: boolean) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      const updated = { ...schedule, enabled };
      updateBackupSchedule(updated);
      loadSchedules();
      toast.success(`Backup schedule ${enabled ? 'enabled' : 'disabled'}`);
    }
  };

  const handleUpdateSchedule = (scheduleId: string, field: keyof BackupSchedule, value: any) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      const updated = { ...schedule, [field]: value };
      updateBackupSchedule(updated);
      loadSchedules();
    }
  };

  const handleCleanupOldBackups = () => {
    const removed = cleanupOldBackups();
    loadBackupStats();
    toast.success(`Cleaned up ${removed} old backup(s)`);
  };

  const handleClearIntegrityReports = () => {
    clearIntegrityReports();
    loadCorruptionStats();
    toast.success('Integrity reports cleared');
  };

  const handleClearVerificationResults = () => {
    clearVerificationResults();
    loadVerificationStats();
    toast.success('Verification results cleared');
  };

  const handleClearQuarantine = () => {
    clearQuarantine();
    loadVerificationStats();
    toast.success('Quarantine cleared');
  };

  const handleRemoveFromQuarantine = (fileId: string) => {
    removeFromQuarantine(fileId);
    loadVerificationStats();
    toast.success('File removed from quarantine');
  };

  const handleCreateIPFSBackup = async () => {
    setIsIPFSBackup(true);
    setVerificationProgress(0);

    try {
      const fileList = files.map(f => ({
        id: f.id,
        name: f.name,
        checksum: f.checksum,
        size: Number(f.size),
      }));

      const manifests = getIPFSManifests();
      const lastManifest = manifests[manifests.length - 1];

      const manifest = await createIncrementalIPFSBackup(
        fileList,
        lastManifest?.merkleRoot
      );

      loadIPFSStats();
      toast.success(`IPFS backup created: ${manifest.ipfsHashes.length} files uploaded`);
    } catch (error) {
      toast.error('IPFS backup failed');
      console.error(error);
    } finally {
      setIsIPFSBackup(false);
      setVerificationProgress(0);
    }
  };

  const handleVerifyIPFSPins = async (manifestId: string) => {
    try {
      const verified = await verifyIPFSPins(manifestId);
      if (verified) {
        toast.success('IPFS pins verified successfully');
      } else {
        toast.error('IPFS pin verification failed');
      }
    } catch (error) {
      toast.error('Pin verification failed');
      console.error(error);
    }
  };

  const getHealthStatus = () => {
    if (!lastCheckResult) return { status: 'unknown', color: 'gray', icon: Shield };
    
    const healthPercentage = (lastCheckResult.verifiedFiles / lastCheckResult.totalFiles) * 100;
    
    if (healthPercentage === 100) {
      return { status: 'healthy', color: 'green', icon: CheckCircle };
    } else if (healthPercentage >= 80) {
      return { status: 'good', color: 'blue', icon: CheckCircle };
    } else if (healthPercentage >= 50) {
      return { status: 'degraded', color: 'yellow', icon: AlertTriangle };
    } else {
      return { status: 'critical', color: 'red', icon: XCircle };
    }
  };

  const health = getHealthStatus();
  const HealthIcon = health.icon;
  const integrityReports = getIntegrityReports();
  const verificationResults = getVerificationResults();
  const quarantinedFiles = getQuarantinedFiles();
  const ipfsManifests = getIPFSManifests();
  const ipfsNodes = getIPFSNodes();
  const ipfsJobs = getIPFSJobs();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Integrity Checks & Verification</h2>
        <p className="text-muted-foreground">
          Monitor storage health, verify binary integrity, manage IPFS backups, and detect corruption
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="integrity">
            <FileCheck className="h-4 w-4 mr-2" />
            Integrity Checks
          </TabsTrigger>
          <TabsTrigger value="verification">
            <Lock className="h-4 w-4 mr-2" />
            Post-Write Verification
          </TabsTrigger>
          <TabsTrigger value="ipfs">
            <Cloud className="h-4 w-4 mr-2" />
            IPFS Backup
          </TabsTrigger>
          <TabsTrigger value="corruption">
            <FileWarning className="h-4 w-4 mr-2" />
            Corruption Reports
          </TabsTrigger>
          <TabsTrigger value="schedules">
            <Calendar className="h-4 w-4 mr-2" />
            Backup Schedules
          </TabsTrigger>
          <TabsTrigger value="manifests">
            <Database className="h-4 w-4 mr-2" />
            Backup History
          </TabsTrigger>
          <TabsTrigger value="media">
            <Video className="h-4 w-4 mr-2" />
            Media Diagnostics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Health</CardTitle>
                <HealthIcon className={`h-4 w-4 text-${health.color}-600`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{health.status}</div>
                {lastCheckResult && (
                  <p className="text-xs text-muted-foreground">
                    {lastCheckResult.verifiedFiles}/{lastCheckResult.totalFiles} files verified
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {verificationStats ? `${verificationStats.verificationRate.toFixed(1)}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {verificationStats?.verified || 0} verified, {verificationStats?.quarantined || 0} quarantined
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IPFS Backups</CardTitle>
                <Cloud className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ipfsStats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {ipfsStats?.pinned || 0} pinned, {ipfsStats?.verified || 0} verified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Backup</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {backupStats?.nextScheduled ? (
                    new Date(Number(backupStats.nextScheduled.nextRun) / 1000000).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  ) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {backupStats?.nextScheduled?.type || 'No schedule'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
              <CardDescription>Decentralized, resilient storage with IPv4 compatibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">IndexedDB (Primary)</p>
                      <p className="text-xs text-muted-foreground">Browser-based persistent storage with SHA-256 checksums</p>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">localStorage (Secondary)</p>
                      <p className="text-xs text-muted-foreground">Fallback with metadata index and checksum validation</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Server Backup (Tertiary)</p>
                      <p className="text-xs text-muted-foreground">Encrypted cloud backup with post-write verification</p>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">IPFS Network (Distributed)</p>
                      <p className="text-xs text-muted-foreground">Decentralized storage with incremental snapshots and pin verification</p>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">IPv4 Network Compatibility</p>
                      <p className="text-xs text-muted-foreground">Full compatibility with existing datacenters and IP camera systems</p>
                    </div>
                  </div>
                  <Badge variant="outline">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Run Integrity Checks</CardTitle>
              <CardDescription>
                Verify all file replicas, detect corruption, and validate binary integrity with SHA-256 checksums
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Replica Verification</h4>
                  <p className="text-xs text-muted-foreground">
                    Check all storage replicas for corruption and missing data
                  </p>
                  <Button
                    onClick={handleVerifyIntegrity}
                    disabled={isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Verifying... {verificationProgress}%
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Verify Replicas
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Continuous Integrity Check</h4>
                  <p className="text-xs text-muted-foreground">
                    Verify all files with checksum validation and size verification
                  </p>
                  <Button
                    onClick={handleContinuousIntegrityCheck}
                    disabled={isContinuousCheck}
                    variant="outline"
                    className="w-full"
                  >
                    {isContinuousCheck ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Checking... {verificationProgress}%
                      </>
                    ) : (
                      <>
                        <FileCheck className="h-4 w-4 mr-2" />
                        Run Continuous Check
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {(isVerifying || isContinuousCheck) && (
                <Progress value={verificationProgress} />
              )}

              {lastCheckResult && lastCheckResult.issues.length > 0 && (
                <>
                  <Alert variant={lastCheckResult.issues.some(i => i.severity === 'critical') ? 'destructive' : 'default'}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium mb-2">
                        Found {lastCheckResult.issues.length} integrity issue(s)
                      </p>
                      <div className="space-y-1 text-xs">
                        {lastCheckResult.issues.slice(0, 5).map((issue, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Badge variant={
                              issue.severity === 'critical' ? 'destructive' :
                              issue.severity === 'high' ? 'destructive' :
                              issue.severity === 'medium' ? 'default' : 'secondary'
                            } className="text-xs">
                              {issue.severity}
                            </Badge>
                            <span>{issue.fileName}: {issue.description}</span>
                            {issue.autoHealed && (
                              <Badge variant="outline" className="text-xs">Healed</Badge>
                            )}
                          </div>
                        ))}
                        {lastCheckResult.issues.length > 5 && (
                          <p className="text-muted-foreground">
                            ...and {lastCheckResult.issues.length - 5} more
                          </p>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleAutoHeal}
                    disabled={isHealing}
                    variant="outline"
                    className="w-full"
                  >
                    {isHealing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Healing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Auto-Heal Issues
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Server-Side Post-Write Verification</CardTitle>
                  <CardDescription>
                    Automatic checksum computation and corruption detection after file storage
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleClearVerificationResults}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Verifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{verificationStats?.total || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Verified Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {verificationStats?.verified || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quarantined Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {verificationStats?.quarantined || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {verificationResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Lock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No verification results found</p>
                  <p className="text-xs">Results will appear here after file uploads</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Checksum</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verificationResults.slice(0, 20).map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{result.fileName}</TableCell>
                        <TableCell>{formatBytes(Number(result.size))}</TableCell>
                        <TableCell>
                          <div className="text-xs font-mono">
                            <div className={result.checksumMatch ? 'text-green-600' : 'text-red-600'}>
                              {result.checksumMatch ? '✓ Match' : '✗ Mismatch'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {result.status === 'verified' ? (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : result.status === 'quarantined' ? (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Quarantined
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(Number(result.timestamp) / 1000000).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {quarantinedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quarantined Files</CardTitle>
                    <CardDescription>
                      Files blocked from download due to corruption detection
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleClearQuarantine}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Quarantine
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Quarantined At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quarantinedFiles.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{file.fileName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{file.reason}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(Number(file.quarantinedAt) / 1000000).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFromQuarantine(file.fileId)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium">Quarantined Files Detected</p>
                    <p className="text-sm mt-1">
                      These files failed post-write verification and are blocked from download.
                      Please re-upload these files to restore access.
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ipfs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IPFS Backup Dashboard</CardTitle>
              <CardDescription>
                Modular incremental backups with Merkle root diff comparison and pin verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Create Incremental Backup</h4>
                  <p className="text-xs text-muted-foreground">
                    Upload changed files to IPFS with automatic pinning and replication
                  </p>
                  <Button
                    onClick={handleCreateIPFSBackup}
                    disabled={isIPFSBackup}
                    className="w-full"
                  >
                    {isIPFSBackup ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating Backup...
                      </>
                    ) : (
                      <>
                        <Cloud className="h-4 w-4 mr-2" />
                        Create IPFS Backup
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Backup Statistics</h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Total Backups:</span>
                      <span className="font-medium">{ipfsStats?.total || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Incremental:</span>
                      <span className="font-medium">{ipfsStats?.incremental || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Full:</span>
                      <span className="font-medium">{ipfsStats?.full || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Size:</span>
                      <span className="font-medium">{formatBytes(ipfsStats?.totalSize || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {ipfsManifests.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Recent IPFS Backups</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Files</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Pin Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ipfsManifests.slice(0, 10).map((manifest, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-sm">
                            {new Date(Number(manifest.timestamp) / 1000000).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={manifest.type === 'full' ? 'default' : 'secondary'}>
                              {manifest.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{Number(manifest.fileCount)}</TableCell>
                          <TableCell>{formatBytes(Number(manifest.size))}</TableCell>
                          <TableCell>
                            <Badge variant={
                              manifest.pinStatus === 'pinned' ? 'default' :
                              manifest.pinStatus === 'failed' ? 'destructive' : 'secondary'
                            }>
                              {manifest.pinStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerifyIPFSPins(manifest.id)}
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Verify
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>IPFS Node Health Monitor</CardTitle>
              <CardDescription>
                Real-time monitoring of IPFS nodes with connectivity and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ipfsNodes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No IPFS nodes configured</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ipfsNodes.map((node, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Network className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Node {index + 1}</p>
                            <p className="text-xs text-muted-foreground font-mono">{node.address}</p>
                          </div>
                        </div>
                        <Badge variant={
                          node.status === 'online' ? 'default' :
                          node.status === 'degraded' ? 'secondary' : 'destructive'
                        }>
                          {node.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground">Pinned Files</p>
                          <p className="font-medium">{Number(node.pinnedCount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Available Space</p>
                          <p className="font-medium">{formatBytes(Number(node.availableSpace))}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Response Time</p>
                          <p className="font-medium">{node.responseTime}ms</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {ipfsJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>IPFS Backup Jobs</CardTitle>
                <CardDescription>
                  Queue management and progress tracking for IPFS backup operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead>Uploaded</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ipfsJobs.slice(0, 10).map((job, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">{job.id.substring(0, 16)}...</TableCell>
                        <TableCell>
                          <Badge variant={
                            job.status === 'completed' ? 'default' :
                            job.status === 'failed' ? 'destructive' :
                            job.status === 'running' ? 'secondary' : 'outline'
                          }>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={job.progress} className="w-20" />
                            <span className="text-xs">{job.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {Number(job.filesProcessed)}/{Number(job.totalFiles)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatBytes(Number(job.bytesUploaded))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="corruption" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Binary Corruption Reports</CardTitle>
                  <CardDescription>
                    Detailed analysis of file corruption with binary diff patterns
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleClearIntegrityReports}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Reports
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {integrityReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No corruption reports found</p>
                  <p className="text-xs">Reports will appear here when corruption is detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Reports</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{integrityReports.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Corrupted Files</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                          {integrityReports.filter(r => r.corruptionDetected).length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Common Patterns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">
                          {corruptionStats?.commonPatterns.slice(0, 2).join(', ') || 'None'}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Checksum</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {integrityReports.slice(0, 20).map((report, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{report.fileName}</TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <div>Original: {formatBytes(report.originalSize)}</div>
                              <div>Downloaded: {formatBytes(report.downloadedSize)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-mono">
                              <div className={report.checksumMatch ? 'text-green-600' : 'text-red-600'}>
                                {report.checksumMatch ? '✓ Match' : '✗ Mismatch'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {report.corruptionDetected ? (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Corrupted
                              </Badge>
                            ) : (
                              <Badge variant="default">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(report.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {integrityReports.some(r => r.corruptionDetected) && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <p className="font-medium">Corruption Detected</p>
                        <p className="text-sm mt-1">
                          Files with corruption should be re-uploaded. The system has detected binary differences
                          between original and downloaded files. Check the reports above for details.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Backup Schedules</CardTitle>
              <CardDescription>
                Configure incremental and full backup schedules with compression, encryption, and integrity verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium capitalize">
                          {schedule.type} Backup - {schedule.frequency}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Next run: {new Date(Number(schedule.nextRun) / 1000000).toLocaleString()}
                        </p>
                      </div>
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={(checked) => handleToggleSchedule(schedule.id, checked)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`retention-${schedule.id}`} className="text-xs">
                          Retention (days)
                        </Label>
                        <Input
                          id={`retention-${schedule.id}`}
                          type="number"
                          value={schedule.retentionDays}
                          onChange={(e) => handleUpdateSchedule(schedule.id, 'retentionDays', parseInt(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`replicas-${schedule.id}`} className="text-xs">
                          Replica Count
                        </Label>
                        <Input
                          id={`replicas-${schedule.id}`}
                          type="number"
                          min="1"
                          max="3"
                          value={schedule.replicaCount}
                          onChange={(e) => handleUpdateSchedule(schedule.id, 'replicaCount', parseInt(e.target.value))}
                          className="h-8"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={schedule.compressionEnabled}
                          onCheckedChange={(checked) => handleUpdateSchedule(schedule.id, 'compressionEnabled', checked)}
                        />
                        <Label className="text-xs">Compression</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={schedule.encryptionEnabled}
                          onCheckedChange={(checked) => handleUpdateSchedule(schedule.id, 'encryptionEnabled', checked)}
                        />
                        <Label className="text-xs">Encryption</Label>
                      </div>
                    </div>

                    {schedule.lastRun && (
                      <p className="text-xs text-muted-foreground">
                        Last run: {new Date(Number(schedule.lastRun) / 1000000).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manifests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Backup History</CardTitle>
                  <CardDescription>View all backup manifests with integrity verification logs</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleCleanupOldBackups}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cleanup Old Backups
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const manifests = getBackupManifests();
                
                if (manifests.length === 0) {
                  return (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No backup manifests found</p>
                      <p className="text-xs">Backups will appear here once scheduled jobs run</p>
                    </div>
                  );
                }

                return (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Files</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Replicas</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {manifests.slice(0, 20).map((manifest) => (
                        <TableRow key={manifest.id}>
                          <TableCell className="text-sm">
                            {new Date(Number(manifest.timestamp) / 1000000).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={manifest.type === 'full' ? 'default' : 'secondary'}>
                              {manifest.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{Number(manifest.fileCount)}</TableCell>
                          <TableCell>{formatBytes(Number(manifest.size))}</TableCell>
                          <TableCell>{manifest.replicaCount}</TableCell>
                          <TableCell>
                            <Badge variant={
                              manifest.status === 'completed' ? 'default' :
                              manifest.status === 'failed' ? 'destructive' : 'secondary'
                            }>
                              {manifest.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <MediaDiagnostics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
